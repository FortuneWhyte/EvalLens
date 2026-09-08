"""Database tables.

The shape here follows one rule from the planning notes: a score is only
meaningful alongside what produced it. So every Score carries the judge model,
prompt version and rubric version it was created under, and those fields are
never inherited implicitly from "current settings" at read time. That is what
lets two runs weeks apart be compared honestly.
"""
# NOTE: deliberately no `from __future__ import annotations` here. SQLModel
# resolves Relationship targets from the runtime annotation, and postponed
# evaluation turns those into strings SQLAlchemy cannot resolve, failing with
# "seems to be using a generic class as the argument to relationship()".
from datetime import datetime
from enum import Enum
from typing import List, Optional

from sqlmodel import Field, Relationship, SQLModel


class RunStatus(str, Enum):
    QUEUED = "QUEUED"
    RUNNING = "RUNNING"
    DONE = "DONE"
    FAILED = "FAILED"


class SampleStatus(str, Enum):
    PENDING = "PENDING"
    DONE = "DONE"
    FAILED = "FAILED"


def _now() -> datetime:
    return datetime.utcnow()


class Dataset(SQLModel, table=True):
    """A named collection of test questions."""

    __tablename__ = "datasets"

    id: Optional[int] = Field(default=None, primary_key=True)
    name: str = Field(index=True, unique=True)
    description: str = ""
    created_at: datetime = Field(default_factory=_now)

    items: List["DatasetItem"] = Relationship(back_populates="dataset")


class DatasetItem(SQLModel, table=True):
    """One test question, with an optional reference answer and context.

    `reference` is what a faithfulness judge compares against; `context` holds
    the retrieved chunks for a RAG evaluation. Both are optional because not
    every dataset is a graded one.
    """

    __tablename__ = "dataset_items"

    id: Optional[int] = Field(default=None, primary_key=True)
    dataset_id: int = Field(foreign_key="datasets.id", index=True)
    external_id: str = Field(description="Stable id within the dataset, e.g. '001'")
    question: str
    reference: Optional[str] = None
    context: Optional[str] = None
    tags: str = Field(default="", description="Comma separated; kept flat for SQLite")

    dataset: Optional[Dataset] = Relationship(back_populates="items")


class Run(SQLModel, table=True):
    """One evaluation sweep of a dataset against a candidate model.

    The judge configuration is copied onto the run at creation time rather than
    referenced, so changing settings later cannot rewrite what a past run meant.
    """

    __tablename__ = "runs"

    id: Optional[int] = Field(default=None, primary_key=True)
    public_id: str = Field(index=True, unique=True, description="e.g. EVL-1042")
    dataset_id: int = Field(foreign_key="datasets.id", index=True)

    candidate_model: str
    candidate_provider: str
    judge_model: str
    judge_provider: str
    judge_temperature: float
    prompt_version: str
    rubric_version: str
    system_prompt: str = ""

    status: RunStatus = Field(default=RunStatus.QUEUED, index=True)
    error: Optional[str] = None

    total_samples: int = 0
    completed_samples: int = 0

    # Rolled up from the samples as they finish, so the list view needs no joins.
    total_cost_usd: float = 0.0
    avg_relevance: Optional[float] = None
    avg_faithfulness: Optional[float] = None
    p50_latency_ms: Optional[int] = None

    created_at: datetime = Field(default_factory=_now, index=True)
    started_at: Optional[datetime] = None
    finished_at: Optional[datetime] = None

    samples: List["Sample"] = Relationship(back_populates="run")


class Sample(SQLModel, table=True):
    """One candidate generation inside a run.

    Latency and cost live here because they are byproducts of this call: the
    elapsed time around it, and its token counts priced at the model's rate.
    """

    __tablename__ = "samples"

    id: Optional[int] = Field(default=None, primary_key=True)
    run_id: int = Field(foreign_key="runs.id", index=True)
    dataset_item_id: int = Field(foreign_key="dataset_items.id")

    external_id: str
    question: str
    reference: Optional[str] = None
    context: Optional[str] = None
    output: Optional[str] = None

    status: SampleStatus = Field(default=SampleStatus.PENDING, index=True)
    error: Optional[str] = None

    latency_ms: Optional[int] = None
    input_tokens: int = 0
    output_tokens: int = 0
    cost_usd: float = 0.0

    created_at: datetime = Field(default_factory=_now)

    run: Optional[Run] = Relationship(back_populates="samples")
    scores: List["Score"] = Relationship(back_populates="sample")


class Score(SQLModel, table=True):
    """A judge's verdict on one sample.

    The provenance columns are the point of this table. A relevance of 0.9 is
    not a fact about the sample; it is a fact about the sample as scored by a
    named judge under a named rubric at a known temperature.
    """

    __tablename__ = "scores"

    id: Optional[int] = Field(default=None, primary_key=True)
    sample_id: int = Field(foreign_key="samples.id", index=True)

    relevance: Optional[float] = None
    faithfulness: Optional[float] = None
    reason: str = ""

    judge_model: str
    judge_temperature: float
    rubric_version: str
    prompt_version: str

    # The judge call has its own latency and cost, separate from generation.
    judge_latency_ms: Optional[int] = None
    judge_input_tokens: int = 0
    judge_output_tokens: int = 0
    judge_cost_usd: float = 0.0

    created_at: datetime = Field(default_factory=_now)

    sample: Optional[Sample] = Relationship(back_populates="scores")
