"""OpenAI chat completions."""
from __future__ import annotations

import time
from typing import List, Optional

import httpx

from app.config import get_settings
from app.providers.base import (
    Completion,
    Message,
    ProviderError,
    ProviderNotConfigured,
)

API_URL = "https://api.openai.com/v1/chat/completions"


class OpenAIProvider:
    name = "openai"

    def __init__(self, api_key: Optional[str] = None) -> None:
        settings = get_settings()
        self._api_key = api_key or settings.openai_api_key
        self._timeout = settings.request_timeout_seconds

    def is_configured(self) -> bool:
        return bool(self._api_key)

    async def complete(
        self,
        messages: List[Message],
        model: str,
        temperature: float = 0.0,
        max_tokens: Optional[int] = None,
        json_mode: bool = False,
    ) -> Completion:
        if not self.is_configured():
            raise ProviderNotConfigured("OpenAI API key is not set")

        payload = {
            "model": model,
            "temperature": temperature,
            "messages": [{"role": m.role, "content": m.content} for m in messages],
        }
        if max_tokens is not None:
            payload["max_tokens"] = max_tokens
        if json_mode:
            # Structured output, so judge scores are parsed rather than scraped
            # out of prose with a regex.
            payload["response_format"] = {"type": "json_object"}

        started = time.perf_counter()
        try:
            async with httpx.AsyncClient(timeout=self._timeout) as client:
                response = await client.post(
                    API_URL,
                    headers={"Authorization": f"Bearer {self._api_key}"},
                    json=payload,
                )
        except httpx.HTTPError as exc:
            raise ProviderError(f"OpenAI request failed: {exc}") from exc
        latency_ms = int((time.perf_counter() - started) * 1000)

        if response.status_code != 200:
            raise ProviderError(
                f"OpenAI returned {response.status_code}: {response.text[:300]}"
            )

        body = response.json()
        usage = body.get("usage", {})
        return Completion(
            text=body["choices"][0]["message"]["content"] or "",
            input_tokens=usage.get("prompt_tokens", 0),
            output_tokens=usage.get("completion_tokens", 0),
            latency_ms=latency_ms,
            model=body.get("model", model),
            provider=self.name,
        )
