"""Shared fixtures.

Each test gets its own SQLite file. The settings cache is cleared before the
app imports anything, since get_settings() memoises the environment.
"""
from __future__ import annotations

import os
import tempfile

import pytest


@pytest.fixture()
def db_path(monkeypatch) -> str:
    path = tempfile.mktemp(suffix=".db")
    monkeypatch.setenv("EVALLENS_DATABASE_URL", f"sqlite:///{path}")
    from app.config import get_settings

    get_settings.cache_clear()
    yield path
    get_settings.cache_clear()
    if os.path.exists(path):
        os.remove(path)


@pytest.fixture()
def session(db_path):
    """A session against a fresh database with tables created.

    No module reloading needed: app.db resolves its engine from current
    settings, so clearing the settings cache is enough to repoint it.
    """
    from sqlmodel import Session

    from app.db import get_engine, init_db

    init_db()
    with Session(get_engine()) as db_session:
        yield db_session


@pytest.fixture()
def seeded(session):
    """A three-item dataset, enough to exercise a run without being slow."""
    from app.models import Dataset, DatasetItem

    dataset = Dataset(name="customer_support_v2", description="seed")
    session.add(dataset)
    session.commit()
    session.refresh(dataset)
    rows = [
        ("001", "How do I reset my router?", "Unplug power, wait 30s, replug."),
        ("002", "What are your business hours?", "9AM-5PM EST, Mon-Fri."),
        ("003", "Do you ship to Canada?", "Yes, 5-7 business days."),
    ]
    for external_id, question, reference in rows:
        session.add(
            DatasetItem(
                dataset_id=dataset.id,
                external_id=external_id,
                question=question,
                reference=reference,
            )
        )
    session.commit()
    return session
