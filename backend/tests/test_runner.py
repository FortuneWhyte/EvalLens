"""The end-to-end path, and the guard rails that stop bad runs before spend."""
from __future__ import annotations

import pytest
from sqlmodel import select

from app.judge import SelfJudgingError
from app.models import RunStatus, Sample, SampleStatus, Score
from app.runner import SpendCapExceeded, create_run, execute_run


def _make_run(session, **overrides):
    kwargs = dict(
        dataset_name="customer_support_v2",
        candidate_model="mock-candidate",
        candidate_provider="mock",
        judge_model="mock-judge",
        judge_provider="mock",
        prompt_version="v1.2.4",
    )
    kwargs.update(overrides)
    return create_run(session, **kwargs)


async def test_a_run_generates_judges_and_rolls_up(seeded):
    run = _make_run(seeded)
    assert run.status == RunStatus.QUEUED
    assert run.total_samples == 3

    await execute_run(seeded, run.id)
    seeded.refresh(run)

    assert run.status == RunStatus.DONE
    assert run.completed_samples == 3
    assert 0.0 <= run.avg_relevance <= 1.0
    assert 0.0 <= run.avg_faithfulness <= 1.0
    assert run.p50_latency_ms is not None
    assert run.finished_at is not None


async def test_every_score_is_stamped_with_its_provenance(seeded):
    """A score is a fact about a judge and rubric, not about a sample alone."""
    run = _make_run(seeded)
    await execute_run(seeded, run.id)

    scores = seeded.exec(select(Score)).all()
    assert len(scores) == 3
    for score in scores:
        assert score.judge_model == "mock-judge"
        assert score.rubric_version == run.rubric_version
        assert score.prompt_version == "v1.2.4"
        assert score.judge_temperature == 0.0


async def test_samples_record_latency_and_token_counts(seeded):
    run = _make_run(seeded)
    await execute_run(seeded, run.id)

    samples = seeded.exec(select(Sample).where(Sample.run_id == run.id)).all()
    for sample in samples:
        assert sample.status == SampleStatus.DONE
        assert sample.output
        assert sample.latency_ms is not None
        assert sample.input_tokens > 0
        assert sample.output_tokens > 0


async def test_one_bad_sample_does_not_sink_the_run(seeded, monkeypatch):
    """Losing 99 good scores to one timeout would be absurd."""
    from app.providers import ProviderError
    from app.providers.mock import MockProvider

    original = MockProvider.complete
    calls = {"n": 0}

    async def flaky(self, messages, model, **kwargs):
        calls["n"] += 1
        if calls["n"] == 1:
            raise ProviderError("simulated timeout")
        return await original(self, messages, model, **kwargs)

    monkeypatch.setattr(MockProvider, "complete", flaky)

    run = _make_run(seeded)
    await execute_run(seeded, run.id)
    seeded.refresh(run)

    samples = seeded.exec(select(Sample).where(Sample.run_id == run.id)).all()
    failed = [s for s in samples if s.status == SampleStatus.FAILED]
    done = [s for s in samples if s.status == SampleStatus.DONE]
    assert len(failed) == 1
    assert len(done) == 2
    assert run.status == RunStatus.DONE
    assert run.completed_samples == 2
    # The failure must not be averaged in as a zero.
    assert run.avg_relevance > 0.0


def test_self_judging_is_refused_before_any_spend(seeded):
    with pytest.raises(SelfJudgingError):
        _make_run(seeded, candidate_model="gpt-4.1", judge_model="gpt-4.1")


def test_spend_cap_refuses_a_run_that_would_cross_it(seeded, monkeypatch):
    from app.config import get_settings

    get_settings.cache_clear()
    monkeypatch.setenv("EVALLENS_MONTHLY_SPEND_CAP", "0.01")
    get_settings.cache_clear()
    with pytest.raises(SpendCapExceeded):
        _make_run(seeded)
    get_settings.cache_clear()


def test_unknown_dataset_is_rejected(seeded):
    with pytest.raises(ValueError):
        _make_run(seeded, dataset_name="does-not-exist")
