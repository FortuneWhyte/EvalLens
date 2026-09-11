"""HTTP behaviour, including how refusals are reported."""
from __future__ import annotations

import time

import pytest
from fastapi.testclient import TestClient


@pytest.fixture()
def client(seeded):
    """A client over the seeded database.

    TestClient must be used as a context manager or the lifespan handler never
    runs and every query hits a database with no tables.
    """
    from app.main import app

    with TestClient(app) as test_client:
        yield test_client


def _finished_run(client, public_id, attempts=50):
    for _ in range(attempts):
        detail = client.get(f"/api/runs/{public_id}").json()
        if detail["status"] in {"DONE", "FAILED"}:
            return detail
        time.sleep(0.05)
    raise AssertionError(f"run {public_id} did not finish")


def test_health_reports_the_judge_configuration(client):
    body = client.get("/health").json()
    assert body["status"] == "ok"
    assert "judge_model" in body and "rubric_version" in body


def test_datasets_lists_the_seeded_dataset(client):
    body = client.get("/api/datasets").json()
    assert body == [
        {"name": "customer_support_v2", "description": "seed", "item_count": 3}
    ]


def test_posting_a_run_returns_202_and_completes_in_the_background(client):
    response = client.post(
        "/api/runs",
        json={
            "dataset": "customer_support_v2",
            "candidate_model": "mock-candidate",
            "judge_model": "mock-judge",
        },
    )
    assert response.status_code == 202
    public_id = response.json()["public_id"]

    detail = _finished_run(client, public_id)
    assert detail["status"] == "DONE"
    assert detail["completed_samples"] == 3
    assert len(detail["samples"]) == 3
    assert detail["samples"][0]["score"]["relevance"] is not None
    # Provenance travels with the run, not just the score rows.
    assert detail["judge_model"] == "mock-judge"
    assert detail["rubric_version"]


def test_missing_run_is_404(client):
    assert client.get("/api/runs/EVL-9999").status_code == 404


def test_self_judging_is_422_not_a_generic_bad_request(client):
    response = client.post(
        "/api/runs",
        json={
            "dataset": "customer_support_v2",
            "candidate_model": "gpt-4.1",
            "judge_model": "gpt-4.1",
            "candidate_provider": "openai",
            "judge_provider": "openai",
        },
    )
    assert response.status_code == 422
    assert "judge" in response.json()["detail"].lower()


def test_unknown_dataset_is_400(client):
    response = client.post(
        "/api/runs", json={"dataset": "nope", "candidate_model": "mock-candidate"}
    )
    assert response.status_code == 400


def test_cost_endpoint_reports_spend_against_the_cap(client):
    body = client.get("/api/cost").json()
    assert body["monthly_cap_usd"] > 0
    assert body["remaining_usd"] == pytest.approx(
        body["monthly_cap_usd"] - body["total_spend_usd"]
    )


def test_providers_reports_configuration_honestly(client):
    body = client.get("/api/providers").json()
    names = {entry["name"] for entry in body}
    assert {"mock", "openai", "anthropic", "ollama"} <= names
    mock = next(entry for entry in body if entry["name"] == "mock")
    assert mock["configured"] is True


def test_dataset_items_are_listed_with_tags_split(client):
    """Tags are stored comma separated in SQLite; the API speaks in lists."""
    from sqlmodel import Session, select

    from app.db import get_engine
    from app.models import DatasetItem

    with Session(get_engine()) as session:
        item = session.exec(select(DatasetItem)).first()
        item.tags = "billing,urgent"
        session.add(item)
        session.commit()

    body = client.get("/api/datasets/customer_support_v2/items").json()
    assert len(body) == 3
    assert body[0]["question"]
    tagged = next(entry for entry in body if entry["tags"])
    assert tagged["tags"] == ["billing", "urgent"]


def test_items_for_an_unknown_dataset_is_404(client):
    assert client.get("/api/datasets/nope/items").status_code == 404
