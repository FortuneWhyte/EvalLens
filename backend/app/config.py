"""Application settings, read from the environment or a .env file.

Every provider credential is optional. With none configured the system still
runs end to end against the mock provider, which is what makes the test suite
and a first local run cost nothing.
"""
from __future__ import annotations

from functools import lru_cache
from typing import Optional

from pydantic_settings import BaseSettings, SettingsConfigDict


class Settings(BaseSettings):
    model_config = SettingsConfigDict(
        env_prefix="EVALLENS_",
        env_file=".env",
        env_file_encoding="utf-8",
        extra="ignore",
    )

    database_url: str = "sqlite:///./evallens.db"

    openai_api_key: Optional[str] = None
    anthropic_api_key: Optional[str] = None
    ollama_base_url: str = "http://localhost:11434"

    # The judge is pinned and deterministic. A judge that drifts between runs
    # measures noise, so temperature is held at zero and the rubric is versioned.
    judge_model: str = "gpt-4.1"
    judge_temperature: float = 0.0
    rubric_version: str = "r3"

    monthly_spend_cap: float = 50.0
    max_concurrency: int = 8

    request_timeout_seconds: float = 60.0


@lru_cache
def get_settings() -> Settings:
    """Cached so the environment is read once per process."""
    return Settings()
