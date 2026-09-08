"""A provider that answers without a network call.

This is not only a test double. It is how the whole pipeline can be run and
demonstrated at zero cost with no API key configured, which is the difference
between "the architecture does not depend on a paid service" being a design
claim and being a thing you can check.

Responses are deterministic: the same question always produces the same answer
and the same scores, so tests can assert on them.
"""
from __future__ import annotations

import hashlib
import json
import time
from typing import List, Optional

from app.providers.base import Completion, Message


def _stable_unit(text: str, salt: str) -> float:
    """A repeatable pseudo-random value in [0, 1) derived from the text."""
    digest = hashlib.sha256((salt + text).encode("utf-8")).hexdigest()
    return int(digest[:8], 16) / 0xFFFFFFFF


class MockProvider:
    name = "mock"

    def is_configured(self) -> bool:
        return True

    async def complete(
        self,
        messages: List[Message],
        model: str,
        temperature: float = 0.0,
        max_tokens: Optional[int] = None,
        json_mode: bool = False,
    ) -> Completion:
        started = time.perf_counter()
        prompt = "\n".join(message.content for message in messages)

        if json_mode:
            # Stand in for the judge. Scores vary by input but never randomly,
            # and a deterministic slice of inputs scores badly so failure paths
            # are exercised rather than only the happy one.
            relevance = round(0.60 + 0.39 * _stable_unit(prompt, "rel"), 2)
            faithfulness = round(0.20 + 0.79 * _stable_unit(prompt, "faith"), 2)
            text = json.dumps(
                {
                    "relevance": relevance,
                    "faithfulness": faithfulness,
                    "reason": "Mock judge: deterministic score derived from the input.",
                }
            )
        else:
            question = messages[-1].content if messages else ""
            text = f"Mock answer to: {question.strip()[:160]}"

        latency_ms = int((time.perf_counter() - started) * 1000)
        return Completion(
            text=text,
            # Rough but stable stand-in: about four characters per token.
            input_tokens=max(1, len(prompt) // 4),
            output_tokens=max(1, len(text) // 4),
            latency_ms=latency_ms,
            model=model,
            provider=self.name,
        )
