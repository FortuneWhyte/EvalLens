"""FastAPI application entry point."""
from __future__ import annotations

from contextlib import asynccontextmanager

from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware

from app.api.routes import router
from app.config import get_settings
from app.db import init_db

@asynccontextmanager
async def lifespan(_: FastAPI):
    """Ensure tables exist so a fresh checkout runs without migrating first.

    A lifespan handler rather than @app.on_event, which is deprecated.
    """
    init_db()
    yield


app = FastAPI(
    title="EvalLens API",
    version="0.1.0",
    summary="Evaluation harness for LLM applications.",
    lifespan=lifespan,
)

# The Vite dev server runs on a different origin during development.
app.add_middleware(
    CORSMiddleware,
    allow_origins=["http://localhost:5173", "http://localhost:4173"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)


app.include_router(router)


@app.get("/health", tags=["system"])
def health() -> dict:
    """Liveness probe, and a cheap way to see how the process is configured."""
    settings = get_settings()
    return {
        "status": "ok",
        "judge_model": settings.judge_model,
        "rubric_version": settings.rubric_version,
        "max_concurrency": settings.max_concurrency,
    }
