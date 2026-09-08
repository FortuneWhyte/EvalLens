"""Cost is computed from token counts, so the arithmetic has to be right."""
from __future__ import annotations

import pytest

from app.providers.pricing import cost_usd, price_for


def test_one_million_tokens_costs_the_listed_rate():
    assert cost_usd("gpt-4.1", "openai", 1_000_000, 0) == pytest.approx(2.00)
    assert cost_usd("gpt-4.1", "openai", 0, 1_000_000) == pytest.approx(8.00)


def test_matches_the_per_sample_estimates_from_the_planning_notes():
    """The notes predict ~$0.003 per judge call and ~$0.0007 per generation."""
    judge = cost_usd("gpt-4.1", "openai", 1000, 150)
    generation = cost_usd("gpt-4.1-mini", "openai", 500, 300)
    assert judge == pytest.approx(0.0032, abs=1e-4)
    assert generation == pytest.approx(0.00068, abs=1e-4)
    # And so a 100-sample run lands near the $0.40 the notes claim.
    assert (judge + generation) * 100 == pytest.approx(0.40, abs=0.02)


def test_pinned_date_suffix_still_prices():
    assert price_for("gpt-4.1-2025-04-14", "openai") == price_for("gpt-4.1", "openai")


def test_local_and_mock_models_are_free():
    assert cost_usd("llama-3-70b", "ollama", 10_000, 10_000) == 0.0
    assert cost_usd("anything", "mock", 10_000, 10_000) == 0.0


def test_unknown_model_reports_no_price_rather_than_guessing():
    assert price_for("who-knows", "openai") is None
    assert cost_usd("who-knows", "openai", 1000, 1000) == 0.0
