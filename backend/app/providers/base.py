"""The provider seam.

Everything above this line - the runner, the judge, the API - talks only to
Provider. That is what lets the same evaluation run against a paid API or a
model on this machine without changing anything else, which is the whole basis
for the claim that this project needs no funding to operate.
"""
from __future__ import annotations

from dataclasses import dataclass
from typing import List, Optional, Protocol


@dataclass(frozen=True)
class Message:
    role: str
    content: str


@dataclass(frozen=True)
class Completion:
    """One model response, plus the two numbers that fall out of it for free."""

    text: str
    input_tokens: int
    output_tokens: int
    latency_ms: int
    model: str
    provider: str

    @property
    def total_tokens(self) -> int:
        return self.input_tokens + self.output_tokens


class ProviderError(RuntimeError):
    """A call failed in a way the runner should record against the sample."""


class ProviderNotConfigured(ProviderError):
    """No credentials, so the provider refuses up front rather than at call time."""


class Provider(Protocol):
    """Minimal surface: name yourself, say whether you are usable, answer."""

    name: str

    def is_configured(self) -> bool:
        ...

    async def complete(
        self,
        messages: List[Message],
        model: str,
        temperature: float = 0.0,
        max_tokens: Optional[int] = None,
        json_mode: bool = False,
    ) -> Completion:
        ...
