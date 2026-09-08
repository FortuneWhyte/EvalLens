"""Ollama, for models running on this machine.

This is the path that makes token cost zero. It speaks to a local daemon, so
being "configured" means the daemon is reachable, not that a key exists.
"""
from __future__ import annotations

import time
from typing import List, Optional

import httpx

from app.config import get_settings
from app.providers.base import Completion, Message, ProviderError


class OllamaProvider:
    name = "ollama"

    def __init__(self, base_url: Optional[str] = None) -> None:
        settings = get_settings()
        self._base_url = (base_url or settings.ollama_base_url).rstrip("/")
        self._timeout = settings.request_timeout_seconds

    def is_configured(self) -> bool:
        """A local daemon is either up or it is not; ask it."""
        try:
            response = httpx.get(f"{self._base_url}/api/tags", timeout=1.0)
            return response.status_code == 200
        except httpx.HTTPError:
            return False

    async def complete(
        self,
        messages: List[Message],
        model: str,
        temperature: float = 0.0,
        max_tokens: Optional[int] = None,
        json_mode: bool = False,
    ) -> Completion:
        options = {"temperature": temperature}
        if max_tokens is not None:
            options["num_predict"] = max_tokens

        payload = {
            "model": model,
            "messages": [{"role": m.role, "content": m.content} for m in messages],
            "stream": False,
            "options": options,
        }
        if json_mode:
            payload["format"] = "json"

        started = time.perf_counter()
        try:
            async with httpx.AsyncClient(timeout=self._timeout) as client:
                response = await client.post(f"{self._base_url}/api/chat", json=payload)
        except httpx.HTTPError as exc:
            raise ProviderError(f"Ollama request failed: {exc}") from exc
        latency_ms = int((time.perf_counter() - started) * 1000)

        if response.status_code != 200:
            raise ProviderError(
                f"Ollama returned {response.status_code}: {response.text[:300]}"
            )

        body = response.json()
        return Completion(
            text=body.get("message", {}).get("content", ""),
            input_tokens=body.get("prompt_eval_count", 0),
            output_tokens=body.get("eval_count", 0),
            latency_ms=latency_ms,
            model=body.get("model", model),
            provider=self.name,
        )
