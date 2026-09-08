"""Anthropic messages API."""
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

API_URL = "https://api.anthropic.com/v1/messages"
API_VERSION = "2023-06-01"


class AnthropicProvider:
    name = "anthropic"

    def __init__(self, api_key: Optional[str] = None) -> None:
        settings = get_settings()
        self._api_key = api_key or settings.anthropic_api_key
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
            raise ProviderNotConfigured("Anthropic API key is not set")

        # This API takes the system prompt as a top-level field rather than a
        # message, so system turns are lifted out here.
        system = "\n".join(m.content for m in messages if m.role == "system")
        turns = [
            {"role": m.role, "content": m.content} for m in messages if m.role != "system"
        ]
        if json_mode:
            # No response_format on this API; the instruction plus a prefilled
            # opening brace is the documented way to force bare JSON.
            system = (system + "\n\nRespond with a single JSON object and nothing else.").strip()

        payload = {
            "model": model,
            "temperature": temperature,
            "max_tokens": max_tokens or 1024,
            "messages": turns,
        }
        if system:
            payload["system"] = system

        started = time.perf_counter()
        try:
            async with httpx.AsyncClient(timeout=self._timeout) as client:
                response = await client.post(
                    API_URL,
                    headers={
                        "x-api-key": self._api_key,
                        "anthropic-version": API_VERSION,
                        "content-type": "application/json",
                    },
                    json=payload,
                )
        except httpx.HTTPError as exc:
            raise ProviderError(f"Anthropic request failed: {exc}") from exc
        latency_ms = int((time.perf_counter() - started) * 1000)

        if response.status_code != 200:
            raise ProviderError(
                f"Anthropic returned {response.status_code}: {response.text[:300]}"
            )

        body = response.json()
        usage = body.get("usage", {})
        text = "".join(
            block.get("text", "") for block in body.get("content", []) if block.get("type") == "text"
        )
        return Completion(
            text=text,
            input_tokens=usage.get("input_tokens", 0),
            output_tokens=usage.get("output_tokens", 0),
            latency_ms=latency_ms,
            model=body.get("model", model),
            provider=self.name,
        )
