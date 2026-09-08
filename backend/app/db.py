"""Engine and session management."""
from __future__ import annotations

from typing import Iterator

from sqlmodel import Session, SQLModel, create_engine

from app.config import get_settings

_settings = get_settings()

# check_same_thread is a SQLite-only concern: FastAPI serves requests from a
# threadpool, and the default would reject connections reused across threads.
_connect_args = (
    {"check_same_thread": False} if _settings.database_url.startswith("sqlite") else {}
)

engine = create_engine(_settings.database_url, echo=False, connect_args=_connect_args)


def init_db() -> None:
    """Create tables that do not exist yet.

    Alembic owns schema changes; this exists so a fresh checkout and the test
    suite can get a database without running migrations first.

    The models import is deliberate and load-bearing: SQLModel only registers a
    table on the shared metadata when its module is imported, so without this
    create_all() silently creates nothing.
    """
    import app.models  # noqa: F401  (registers tables on SQLModel.metadata)

    SQLModel.metadata.create_all(engine)


def get_session() -> Iterator[Session]:
    """FastAPI dependency yielding a session per request."""
    with Session(engine) as session:
        yield session
