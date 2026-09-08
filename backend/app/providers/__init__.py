"""Provider registry.

Callers ask for a provider by name and get something satisfying Provider. The
runner never imports a concrete provider, which is what keeps candidate and
judge swappable between a paid API and a local model.
"""
from __future__ import annotations

from typing import Dict, List

from app.providers.anthropic import AnthropicProvider
from app.providers.base import (
    Completion,
    Message,
    Provider,
    ProviderError,
    ProviderNotConfigured,
)
from app.providers.mock import MockProvider
from app.providers.ollama import OllamaProvider
from app.providers.openai import OpenAIProvider
from app.providers.pricing import cost_usd, price_for

_BUILDERS = {
    "mock": MockProvider,
    "openai": OpenAIProvider,
    "anthropic": AnthropicProvider,
    "ollama": OllamaProvider,
}


def get_provider(name: str) -> Provider:
    """Build a provider by name, or raise if the name is unknown."""
    key = name.lower()
    if key not in _BUILDERS:
        known = ", ".join(sorted(_BUILDERS))
        raise ProviderError(f"Unknown provider '{name}'. Known providers: {known}")
    return _BUILDERS[key]()


def available_providers() -> List[Dict[str, object]]:
    """Every provider with whether it is usable right now.

    Used by the API so the Models screen can show NO_KEY and OFFLINE states
    truthfully instead of assuming everything works.
    """
    report = []
    for name in sorted(_BUILDERS):
        provider = _BUILDERS[name]()
        report.append({"name": name, "configured": provider.is_configured()})
    return report


__all__ = [
    "Completion",
    "Message",
    "Provider",
    "ProviderError",
    "ProviderNotConfigured",
    "available_providers",
    "cost_usd",
    "get_provider",
    "price_for",
]
