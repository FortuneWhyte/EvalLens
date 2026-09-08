"""FastAPI application entry point."""
from __future__ import annotations

from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware

from app.config import get_settings

app = FastAPI(
    title="EvalLens API",
    version="0.1.0",
    summary="Evaluation harness for LLM applications.",
)

# The Vite dev server runs on a different origin during development.
app.add_middleware(
    CORSMiddleware,
    allow_origins=["http://localhost:5173", "http://localhost:4173"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)


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
