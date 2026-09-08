"""Run orchestration.

Scoring a dataset is IO bound and rate limited, so samples are evaluated
concurrently behind a semaphore rather than in a loop. Each sample is
independent: one failure records itself against that sample and the run
continues, because losing 99 good scores to one timeout would be absurd.
"""
from __future__ import annotations

import asyncio
import statistics
from datetime import datetime
from typing import List, Optional

from sqlmodel import Session, select

from app import judge as judge_module
from app.config import get_settings
from app.models import (
    Dataset,
    DatasetItem,
    Run,
    RunStatus,
    Sample,
    SampleStatus,
    Score,
)
from app.providers import Message, ProviderError, cost_usd, get_provider

DEFAULT_SYSTEM_PROMPT = "You are a helpful assistant. Answer the question directly and concisely."


class SpendCapExceeded(RuntimeError):
    """The run would push spend past the configured monthly ceiling."""


def next_public_id(session: Session) -> str:
    """Human-facing run id, continuing the EVL-1000 series."""
    count = len(session.exec(select(Run.id)).all())
    return f"EVL-{1000 + count + 1}"


def create_run(
    session: Session,
    dataset_name: str,
    candidate_model: str,
    candidate_provider: str = "mock",
    judge_model: Optional[str] = None,
    judge_provider: str = "mock",
    prompt_version: str = "v1.0.0",
    system_prompt: str = DEFAULT_SYSTEM_PROMPT,
) -> Run:
    """Queue a run, refusing configurations that would produce untrustworthy numbers."""
    settings = get_settings()
    judge_model = judge_model or settings.judge_model

    dataset = session.exec(select(Dataset).where(Dataset.name == dataset_name)).first()
    if dataset is None:
        raise ValueError(f"Unknown dataset '{dataset_name}'")

    items = session.exec(
        select(DatasetItem).where(DatasetItem.dataset_id == dataset.id)
    ).all()
    if not items:
        raise ValueError(f"Dataset '{dataset_name}' has no items")

    # Refused before any spend, not discovered halfway through.
    judge_module.assert_not_self_judging(candidate_model, judge_model)
    _assert_within_spend_cap(session, len(items))

    run = Run(
        public_id=next_public_id(session),
        dataset_id=dataset.id,
        candidate_model=candidate_model,
        candidate_provider=candidate_provider,
        judge_model=judge_model,
        judge_provider=judge_provider,
        judge_temperature=settings.judge_temperature,
        prompt_version=prompt_version,
        rubric_version=settings.rubric_version,
        system_prompt=system_prompt,
        total_samples=len(items),
    )
    session.add(run)
    session.commit()
    session.refresh(run)

    for item in items:
        session.add(
            Sample(
                run_id=run.id,
                dataset_item_id=item.id,
                external_id=item.external_id,
                question=item.question,
                reference=item.reference,
                context=item.context,
            )
        )
    session.commit()
    session.refresh(run)
    return run


def _assert_within_spend_cap(session: Session, sample_count: int) -> None:
    """Stop a run that would cross the monthly ceiling.

    Estimated generously at a cent per sample: this is a guard rail, and
    over-estimating fails safe.
    """
    settings = get_settings()
    spent = sum(row for row in session.exec(select(Run.total_cost_usd)).all() if row)
    estimate = sample_count * 0.01
    if spent + estimate > settings.monthly_spend_cap:
        raise SpendCapExceeded(
            f"Run would put spend at about ${spent + estimate:.2f}, past the "
            f"${settings.monthly_spend_cap:.2f} cap. Raise the cap or use a local model."
        )


async def execute_run(session: Session, run_id: int) -> Run:
    """Generate and score every sample in a run, then roll up the totals."""
    settings = get_settings()
    run = session.get(Run, run_id)
    if run is None:
        raise ValueError(f"Unknown run id {run_id}")

    run.status = RunStatus.RUNNING
    run.started_at = datetime.utcnow()
    session.add(run)
    session.commit()

    candidate = get_provider(run.candidate_provider)
    judge_provider = get_provider(run.judge_provider)
    samples = session.exec(select(Sample).where(Sample.run_id == run.id)).all()
    semaphore = asyncio.Semaphore(settings.max_concurrency)

    async def evaluate(sample: Sample) -> None:
        async with semaphore:
            await _evaluate_sample(session, run, sample, candidate, judge_provider)

    try:
        await asyncio.gather(*(evaluate(sample) for sample in samples))
    except Exception as exc:  # pragma: no cover - defensive
        run.status = RunStatus.FAILED
        run.error = str(exc)
        run.finished_at = datetime.utcnow()
        session.add(run)
        session.commit()
        raise

    _roll_up(session, run)
    return run


async def _evaluate_sample(
    session: Session,
    run: Run,
    sample: Sample,
    candidate,
    judge_provider,
) -> None:
    """Generate an answer, judge it, and persist both, or record why not."""
    try:
        completion = await candidate.complete(
            messages=[
                Message("system", run.system_prompt or DEFAULT_SYSTEM_PROMPT),
                Message("user", sample.question),
            ],
            model=run.candidate_model,
        )
    except ProviderError as exc:
        _fail_sample(session, sample, f"generation failed: {exc}")
        return

    sample.output = completion.text
    sample.latency_ms = completion.latency_ms
    sample.input_tokens = completion.input_tokens
    sample.output_tokens = completion.output_tokens
    sample.cost_usd = cost_usd(
        completion.model,
        completion.provider,
        completion.input_tokens,
        completion.output_tokens,
    )

    try:
        verdict = await judge_module.score_sample(
            provider=judge_provider,
            judge_model=run.judge_model,
            question=sample.question,
            answer=sample.output,
            reference=sample.reference,
            context=sample.context,
            temperature=run.judge_temperature,
        )
    except (ProviderError, judge_module.JudgeError) as exc:
        # The generation is still worth keeping; only the score is missing.
        _fail_sample(session, sample, f"judging failed: {exc}", keep_output=True)
        return

    judge_completion = verdict.completion
    session.add(
        Score(
            sample_id=sample.id,
            relevance=verdict.relevance,
            faithfulness=verdict.faithfulness,
            reason=verdict.reason,
            judge_model=run.judge_model,
            judge_temperature=run.judge_temperature,
            rubric_version=run.rubric_version,
            prompt_version=run.prompt_version,
            judge_latency_ms=judge_completion.latency_ms,
            judge_input_tokens=judge_completion.input_tokens,
            judge_output_tokens=judge_completion.output_tokens,
            judge_cost_usd=cost_usd(
                judge_completion.model,
                judge_completion.provider,
                judge_completion.input_tokens,
                judge_completion.output_tokens,
            ),
        )
    )
    sample.status = SampleStatus.DONE
    session.add(sample)
    session.commit()


def _fail_sample(
    session: Session, sample: Sample, message: str, keep_output: bool = False
) -> None:
    sample.status = SampleStatus.FAILED
    sample.error = message
    if not keep_output:
        sample.output = None
    session.add(sample)
    session.commit()


def _roll_up(session: Session, run: Run) -> None:
    """Aggregate sample and score rows onto the run.

    Averages come from scored samples only. Including failures as zeros would
    make a timeout look like a quality regression, which is a different thing.
    """
    samples: List[Sample] = session.exec(
        select(Sample).where(Sample.run_id == run.id)
    ).all()
    scores: List[Score] = session.exec(
        select(Score).join(Sample).where(Sample.run_id == run.id)
    ).all()

    relevances = [s.relevance for s in scores if s.relevance is not None]
    faithfulnesses = [s.faithfulness for s in scores if s.faithfulness is not None]
    latencies = [s.latency_ms for s in samples if s.latency_ms is not None]

    run.completed_samples = sum(1 for s in samples if s.status == SampleStatus.DONE)
    run.total_cost_usd = round(
        sum(s.cost_usd for s in samples) + sum(s.judge_cost_usd for s in scores), 6
    )
    run.avg_relevance = round(statistics.fmean(relevances), 4) if relevances else None
    run.avg_faithfulness = (
        round(statistics.fmean(faithfulnesses), 4) if faithfulnesses else None
    )
    run.p50_latency_ms = int(statistics.median(latencies)) if latencies else None
    run.status = RunStatus.DONE if run.completed_samples else RunStatus.FAILED
    run.finished_at = datetime.utcnow()
    session.add(run)
    session.commit()
