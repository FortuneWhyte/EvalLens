"""HTTP surface."""
from __future__ import annotations

import asyncio
from typing import List, Optional

from fastapi import APIRouter, BackgroundTasks, Depends, HTTPException, Query
from sqlmodel import Session, select

from app.config import get_settings
from app.db import get_engine, get_session
from app.judge import SelfJudgingError
from app.models import Dataset, DatasetItem, Run, Sample, Score
from app.providers import available_providers
from app.runner import SpendCapExceeded, create_run, execute_run
from app.schemas import (
    CostSummaryOut,
    CreateRunIn,
    DatasetOut,
    ProviderOut,
    RunDetailOut,
    RunSummaryOut,
    SampleOut,
    ScoreOut,
)

router = APIRouter(prefix="/api")


def _dataset_name(session: Session, dataset_id: int) -> str:
    dataset = session.get(Dataset, dataset_id)
    return dataset.name if dataset else "(deleted)"


def _summary(session: Session, run: Run) -> RunSummaryOut:
    return RunSummaryOut(
        public_id=run.public_id,
        dataset=_dataset_name(session, run.dataset_id),
        candidate_model=run.candidate_model,
        judge_model=run.judge_model,
        status=run.status.value,
        total_samples=run.total_samples,
        completed_samples=run.completed_samples,
        avg_relevance=run.avg_relevance,
        avg_faithfulness=run.avg_faithfulness,
        p50_latency_ms=run.p50_latency_ms,
        total_cost_usd=run.total_cost_usd,
        created_at=run.created_at,
    )


@router.get("/runs", response_model=List[RunSummaryOut], tags=["runs"])
def list_runs(
    session: Session = Depends(get_session),
    limit: int = Query(50, ge=1, le=200),
) -> List[RunSummaryOut]:
    runs = session.exec(select(Run).order_by(Run.created_at.desc()).limit(limit)).all()
    return [_summary(session, run) for run in runs]


@router.get("/runs/{public_id}", response_model=RunDetailOut, tags=["runs"])
def get_run(public_id: str, session: Session = Depends(get_session)) -> RunDetailOut:
    run = session.exec(select(Run).where(Run.public_id == public_id)).first()
    if run is None:
        raise HTTPException(status_code=404, detail=f"No run '{public_id}'")

    samples = session.exec(select(Sample).where(Sample.run_id == run.id)).all()
    out_samples = []
    for sample in samples:
        score = session.exec(select(Score).where(Score.sample_id == sample.id)).first()
        out_samples.append(
            SampleOut(
                external_id=sample.external_id,
                question=sample.question,
                reference=sample.reference,
                output=sample.output,
                status=sample.status.value,
                error=sample.error,
                latency_ms=sample.latency_ms,
                input_tokens=sample.input_tokens,
                output_tokens=sample.output_tokens,
                cost_usd=sample.cost_usd,
                score=(
                    ScoreOut(
                        relevance=score.relevance,
                        faithfulness=score.faithfulness,
                        reason=score.reason,
                        judge_model=score.judge_model,
                        judge_temperature=score.judge_temperature,
                        rubric_version=score.rubric_version,
                        prompt_version=score.prompt_version,
                        judge_cost_usd=score.judge_cost_usd,
                    )
                    if score
                    else None
                ),
            )
        )

    base = _summary(session, run)
    return RunDetailOut(
        **base.model_dump(),
        candidate_provider=run.candidate_provider,
        judge_provider=run.judge_provider,
        judge_temperature=run.judge_temperature,
        prompt_version=run.prompt_version,
        rubric_version=run.rubric_version,
        system_prompt=run.system_prompt,
        error=run.error,
        samples=out_samples,
    )


def _run_in_background(run_id: int) -> None:
    """Execute a run outside the request.

    A fresh session is opened here on purpose: the request-scoped one is closed
    by the time this runs.
    """
    with Session(get_engine()) as session:
        asyncio.run(execute_run(session, run_id))


@router.post("/runs", response_model=RunSummaryOut, status_code=202, tags=["runs"])
def start_run(
    payload: CreateRunIn,
    background: BackgroundTasks,
    session: Session = Depends(get_session),
) -> RunSummaryOut:
    """Queue a run and return immediately; evaluation continues in the background."""
    try:
        run = create_run(
            session=session,
            dataset_name=payload.dataset,
            candidate_model=payload.candidate_model,
            candidate_provider=payload.candidate_provider,
            judge_model=payload.judge_model,
            judge_provider=payload.judge_provider,
            prompt_version=payload.prompt_version,
            **({"system_prompt": payload.system_prompt} if payload.system_prompt else {}),
        )
    except SelfJudgingError as exc:
        # 422: the request is well formed but the configuration is not usable.
        raise HTTPException(status_code=422, detail=str(exc)) from exc
    except SpendCapExceeded as exc:
        # 402: refused on cost, which is a different problem from a bad request.
        raise HTTPException(status_code=402, detail=str(exc)) from exc
    except ValueError as exc:
        raise HTTPException(status_code=400, detail=str(exc)) from exc

    background.add_task(_run_in_background, run.id)
    return _summary(session, run)


@router.get("/datasets", response_model=List[DatasetOut], tags=["datasets"])
def list_datasets(session: Session = Depends(get_session)) -> List[DatasetOut]:
    datasets = session.exec(select(Dataset)).all()
    return [
        DatasetOut(
            name=dataset.name,
            description=dataset.description,
            item_count=len(
                session.exec(
                    select(DatasetItem.id).where(DatasetItem.dataset_id == dataset.id)
                ).all()
            ),
        )
        for dataset in datasets
    ]


@router.get("/providers", response_model=List[ProviderOut], tags=["models"])
def list_providers() -> List[ProviderOut]:
    """Which providers are usable right now, so the UI can show NO_KEY honestly."""
    return [ProviderOut(**entry) for entry in available_providers()]


@router.get("/cost", response_model=CostSummaryOut, tags=["system"])
def cost_summary(session: Session = Depends(get_session)) -> CostSummaryOut:
    settings = get_settings()
    totals: List[Optional[float]] = session.exec(select(Run.total_cost_usd)).all()
    spent = round(sum(value for value in totals if value), 6)
    return CostSummaryOut(
        total_spend_usd=spent,
        monthly_cap_usd=settings.monthly_spend_cap,
        run_count=len(totals),
        remaining_usd=round(settings.monthly_spend_cap - spent, 6),
    )
