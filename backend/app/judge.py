"""LLM-as-judge scoring.

This is the part the project stands or falls on. The planning notes are blunt
about it: cost and latency are free byproducts, and the real problem is making
a quality signal reproducible and low-bias. Concretely that means:

- The judge is a different model from the candidate. A model asked to grade its
  own output prefers it (self-preference bias), so this module refuses that
  configuration outright rather than warning about it.
- Temperature is pinned at zero and the judge model is named explicitly. A
  judge that varies between runs is measuring noise.
- The rubric is versioned and stamped onto every score, so improving the rubric
  never silently rewrites what past numbers meant.
- Output is structured JSON, parsed and range-checked, not scraped out of prose.
"""
from __future__ import annotations

import json
import re
from dataclasses import dataclass
from typing import Optional

from app.providers import Completion, Message, Provider

RUBRIC_VERSION = "r3"

SYSTEM_PROMPT = """You are a strict evaluation judge. You score a candidate answer against a question and, when supplied, a reference answer and retrieved context.

Score two dimensions, each from 0.0 to 1.0:

relevance - does the answer address what was actually asked?
  1.0  directly and completely answers the question
  0.7  answers, but partially or with padding
  0.4  related to the topic but evades the question
  0.0  does not address the question

faithfulness - is the answer supported by the reference and context?
  1.0  every claim is supported
  0.7  supported, with a minor unsupported detail
  0.4  mixes supported and unsupported claims
  0.0  contradicts the source, or invents facts

Rules:
- Judge only what is written. Do not reward length, confidence or style.
- If no reference or context is supplied, score faithfulness on internal
  consistency alone and say so in your reason.
- A fluent answer that contradicts the reference scores near 0.0 on
  faithfulness however well written it is.

Respond with a single JSON object and nothing else:
{"relevance": <float>, "faithfulness": <float>, "reason": "<one or two sentences>"}"""


@dataclass(frozen=True)
class Verdict:
    relevance: float
    faithfulness: float
    reason: str
    completion: Completion


class JudgeError(RuntimeError):
    """The judge answered, but not with something usable."""


class SelfJudgingError(ValueError):
    """Judge and candidate are the same model, which biases the score upward."""


def assert_not_self_judging(candidate_model: str, judge_model: str) -> None:
    """Refuse a configuration where a model would grade its own output.

    Compared on the undated stem so gpt-4.1 and gpt-4.1-2025-04-14 are caught as
    the same model.
    """
    if _stem(candidate_model) == _stem(judge_model):
        raise SelfJudgingError(
            f"Judge and candidate are both '{candidate_model}'. A model prefers its own "
            "output, so the score would be biased upward. Choose a different judge."
        )


def _stem(model: str) -> str:
    """Strip a trailing date suffix: gpt-4.1-2025-04-14 -> gpt-4.1."""
    return re.sub(r"-\d{4}-\d{2}-\d{2}$", "", model.strip().lower())


def build_prompt(
    question: str,
    answer: str,
    reference: Optional[str] = None,
    context: Optional[str] = None,
) -> str:
    parts = [f"QUESTION:\n{question}", f"CANDIDATE ANSWER:\n{answer}"]
    if reference:
        parts.append(f"REFERENCE ANSWER:\n{reference}")
    if context:
        parts.append(f"RETRIEVED CONTEXT:\n{context}")
    return "\n\n".join(parts)


def parse_verdict(text: str) -> tuple:
    """Pull scores out of the judge's reply.

    Structured output should make this trivial, but a model can still wrap JSON
    in prose or a code fence, so the first balanced object is extracted before
    parsing. Values outside 0..1 are clamped rather than accepted, since an
    out-of-range score would silently skew every average built on it.
    """
    payload = _extract_json(text)
    if payload is None:
        raise JudgeError(f"Judge did not return JSON: {text[:200]!r}")
    try:
        data = json.loads(payload)
    except json.JSONDecodeError as exc:
        raise JudgeError(f"Judge returned unparseable JSON: {exc}") from exc
    if not isinstance(data, dict):
        raise JudgeError("Judge returned JSON that is not an object")

    try:
        relevance = _clamp(float(data["relevance"]))
        faithfulness = _clamp(float(data["faithfulness"]))
    except (KeyError, TypeError, ValueError) as exc:
        raise JudgeError(f"Judge JSON missing usable scores: {data}") from exc

    reason = str(data.get("reason", "")).strip()
    return relevance, faithfulness, reason


def _clamp(value: float) -> float:
    return max(0.0, min(1.0, value))


def _extract_json(text: str) -> Optional[str]:
    """Return the first balanced {...} block, ignoring braces inside strings."""
    start = text.find("{")
    if start == -1:
        return None
    depth = 0
    in_string = False
    escaped = False
    for index in range(start, len(text)):
        char = text[index]
        if in_string:
            if escaped:
                escaped = False
            elif char == "\\":
                escaped = True
            elif char == '"':
                in_string = False
            continue
        if char == '"':
            in_string = True
        elif char == "{":
            depth += 1
        elif char == "}":
            depth -= 1
            if depth == 0:
                return text[start : index + 1]
    return None


async def score_sample(
    provider: Provider,
    judge_model: str,
    question: str,
    answer: str,
    reference: Optional[str] = None,
    context: Optional[str] = None,
    temperature: float = 0.0,
) -> Verdict:
    """Score one answer. Raises JudgeError if the reply cannot be used."""
    completion = await provider.complete(
        messages=[
            Message("system", SYSTEM_PROMPT),
            Message("user", build_prompt(question, answer, reference, context)),
        ],
        model=judge_model,
        temperature=temperature,
        json_mode=True,
    )
    relevance, faithfulness, reason = parse_verdict(completion.text)
    return Verdict(
        relevance=relevance,
        faithfulness=faithfulness,
        reason=reason,
        completion=completion,
    )
