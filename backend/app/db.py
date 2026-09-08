"""Engine and session management.

The engine is resolved lazily from current settings rather than created at
import time. Binding it at import made the database URL effectively immutable
once any module had imported it: a background task that opened its own session
could end up writing to a different database than the request that queued it.
Engines are cached per URL, so this stays a single connection pool in normal use.
"""
from __future__ import annotations

from typing import Dict, Iterator

from sqlalchemy.engine import Engine
from sqlmodel import Session, SQLModel, create_engine

from app.config import get_settings

_engines: Dict[str, Engine] = {}


def get_engine() -> Engine:
    """The engine for the currently configured database URL."""
    url = get_settings().database_url
    if url not in _engines:
        # check_same_thread is a SQLite-only concern: FastAPI serves requests
        # from a threadpool, and the default rejects connections reused across
        # threads.
        connect_args = {"check_same_thread": False} if url.startswith("sqlite") else {}
        _engines[url] = create_engine(url, echo=False, connect_args=connect_args)
    return _engines[url]


def init_db() -> None:
    """Create tables that do not exist yet.

    Alembic owns schema changes; this exists so a fresh checkout and the test
    suite can get a database without running migrations first.

    The models import is deliberate and load-bearing: SQLModel only registers a
    table on the shared metadata when its module is imported, so without this
    create_all() silently creates nothing.
    """
    import app.models  # noqa: F401  (registers tables on SQLModel.metadata)

    SQLModel.metadata.create_all(get_engine())


def get_session() -> Iterator[Session]:
    """FastAPI dependency yielding a session per request."""
    with Session(get_engine()) as session:
        yield session
