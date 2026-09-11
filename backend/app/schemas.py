"""API response shapes.

These deliberately mirror the seed modules the front end already renders
(src/data/*.ts), so wiring the React app to this API is a swap rather than a
rewrite.
"""
from __future__ import annotations

from datetime import datetime
from typing import List, Optional

from pydantic import BaseModel


class ScoreOut(BaseModel):
    relevance: Optional[float]
    faithfulness: Optional[float]
    reason: str
    judge_model: str
    judge_temperature: float
    rubric_version: str
    prompt_version: str
    judge_cost_usd: float


class SampleOut(BaseModel):
    external_id: str
    question: str
    reference: Optional[str]
    output: Optional[str]
    status: str
    error: Optional[str]
    latency_ms: Optional[int]
    input_tokens: int
    output_tokens: int
    cost_usd: float
    score: Optional[ScoreOut]


class RunSummaryOut(BaseModel):
    """The run list. Everything here is rolled up, so listing needs no joins."""

    public_id: str
    dataset: str
    candidate_model: str
    judge_model: str
    status: str
    total_samples: int
    completed_samples: int
    avg_relevance: Optional[float]
    avg_faithfulness: Optional[float]
    p50_latency_ms: Optional[int]
    total_cost_usd: float
    created_at: datetime


class RunDetailOut(RunSummaryOut):
    """A run plus the provenance behind its numbers and its scored samples."""

    candidate_provider: str
    judge_provider: str
    judge_temperature: float
    prompt_version: str
    rubric_version: str
    system_prompt: str
    error: Optional[str]
    samples: List[SampleOut]


class DatasetOut(BaseModel):
    name: str
    description: str
    item_count: int


class DatasetItemOut(BaseModel):
    """One test question. `tags` is stored flat in SQLite and split on read."""

    external_id: str
    question: str
    reference: Optional[str]
    context: Optional[str]
    tags: List[str]


class ProviderOut(BaseModel):
    name: str
    configured: bool


class CreateRunIn(BaseModel):
    dataset: str
    candidate_model: str = "mock-candidate"
    candidate_provider: str = "mock"
    judge_model: Optional[str] = None
    judge_provider: str = "mock"
    prompt_version: str = "v1.0.0"
    system_prompt: Optional[str] = None


class CostSummaryOut(BaseModel):
    total_spend_usd: float
    monthly_cap_usd: float
    run_count: int
    remaining_usd: float
