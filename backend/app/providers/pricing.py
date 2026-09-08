"""Token pricing, in USD per million tokens.

Cost is not measured, it is computed: the response reports token counts and
these are the rates. Local models are priced at zero on purpose - they cost
electricity, not tokens - which is what makes the local path a genuine escape
hatch from spend rather than a rhetorical one.
"""
from __future__ import annotations

from dataclasses import dataclass
from typing import Dict, Optional


@dataclass(frozen=True)
class Price:
    input_per_mtok: float
    output_per_mtok: float


# Rates follow the figures recorded in docs/. Unknown models fall back to zero
# rather than guessing, and the caller can see that a price was missing.
PRICES: Dict[str, Price] = {
    "gpt-4.1": Price(2.00, 8.00),
    "gpt-4.1-mini": Price(0.40, 1.60),
    "gpt-4.1-nano": Price(0.10, 0.40),
    "gpt-4-turbo": Price(10.00, 30.00),
    "gpt-4o": Price(2.50, 10.00),
    "gpt-4o-mini": Price(0.15, 0.60),
    "claude-opus-5": Price(15.00, 75.00),
    "claude-sonnet-5": Price(3.00, 15.00),
    "claude-haiku-4-5-20251001": Price(1.00, 5.00),
}

MOCK_PRICE = Price(0.0, 0.0)


def price_for(model: str, provider: str) -> Optional[Price]:
    """Look up a rate, or None if the model is unpriced.

    Local and mock providers are always free regardless of the model name, so
    they short-circuit before the table lookup.
    """
    if provider in {"ollama", "mock"}:
        return MOCK_PRICE
    exact = PRICES.get(model)
    if exact is not None:
        return exact
    # Providers append dated suffixes (gpt-4.1-2025-04-14); match the longest
    # known prefix so a pinned version still prices correctly.
    candidates = [name for name in PRICES if model.startswith(name)]
    if not candidates:
        return None
    return PRICES[max(candidates, key=len)]


def cost_usd(model: str, provider: str, input_tokens: int, output_tokens: int) -> float:
    """Price a single call. Returns 0.0 for free and unpriced models."""
    price = price_for(model, provider)
    if price is None:
        return 0.0
    return (
        input_tokens * price.input_per_mtok + output_tokens * price.output_per_mtok
    ) / 1_000_000
