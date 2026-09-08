"""The judge is the project's credibility, so its edges are pinned down."""
from __future__ import annotations

import pytest

from app.judge import (
    JudgeError,
    SelfJudgingError,
    assert_not_self_judging,
    parse_verdict,
)


def test_parses_clean_json():
    assert parse_verdict('{"relevance":0.9,"faithfulness":0.85,"reason":"ok"}') == (
        0.9,
        0.85,
        "ok",
    )


def test_parses_json_wrapped_in_prose_or_a_code_fence():
    text = 'Sure!\n```json\n{"relevance":0.5,"faithfulness":0.4,"reason":"meh"}\n```'
    assert parse_verdict(text) == (0.5, 0.4, "meh")


def test_a_brace_inside_the_reason_does_not_truncate_the_object():
    relevance, _, reason = parse_verdict(
        '{"relevance":1,"faithfulness":1,"reason":"contains } a brace"}'
    )
    assert relevance == 1.0
    assert reason == "contains } a brace"


def test_out_of_range_scores_are_clamped_not_accepted():
    """An out-of-range score would skew every average built on it."""
    assert parse_verdict('{"relevance":1.7,"faithfulness":-0.3,"reason":"x"}')[:2] == (
        1.0,
        0.0,
    )


@pytest.mark.parametrize(
    "text",
    [
        "no json at all",
        '{"relevance":"abc","faithfulness":1}',
        "[1, 2, 3]",
        '{"faithfulness":0.5}',
    ],
)
def test_unusable_replies_raise_rather_than_storing_a_wrong_number(text):
    with pytest.raises(JudgeError):
        parse_verdict(text)


def test_self_judging_is_refused_even_across_a_date_suffix():
    with pytest.raises(SelfJudgingError):
        assert_not_self_judging("gpt-4.1", "gpt-4.1-2025-04-14")


def test_a_different_judge_is_allowed():
    assert_not_self_judging("gpt-4.1-mini", "gpt-4.1")
