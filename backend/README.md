# EvalLens backend

FastAPI service that runs evaluations: for each item in a dataset it generates
an answer with a candidate model, scores that answer with a separate judge
model, prices both calls from their token counts, and stores the result with
the provenance needed to compare it against another run later.

## Run it

```bash
cd backend
python3 -m venv .venv
.venv/bin/pip install -r requirements.txt
.venv/bin/python seed.py                       # load the sample datasets
.venv/bin/uvicorn app.main:app --reload        # http://localhost:8000
```

Interactive API docs are at `http://localhost:8000/docs`.

**No API key is needed to try it.** The `mock` provider answers without a
network call and costs nothing, so the whole pipeline runs end to end offline:

```bash
curl -X POST localhost:8000/api/runs \
  -H 'content-type: application/json' \
  -d '{"dataset":"customer_support_v2","candidate_model":"mock-candidate","judge_model":"mock-judge"}'

curl localhost:8000/api/runs/EVL-1001
```

To use real models, copy `.env.example` to `.env`, add a key, and pass
`"candidate_provider":"openai"` (or `anthropic`, or `ollama` for a local model).

## Tests

```bash
.venv/bin/python -m pytest
```

30 tests, under a second, no API key and no spend.

## Endpoints

| Method | Path | Purpose |
| --- | --- | --- |
| GET | `/health` | Liveness, and how the process is configured |
| GET | `/api/runs` | Run list, pre-rolled so no joins are needed |
| POST | `/api/runs` | Queue a run; returns 202 and evaluates in the background |
| GET | `/api/runs/{public_id}` | One run with provenance and per-sample scores |
| GET | `/api/datasets` | Datasets and item counts |
| GET | `/api/providers` | Which providers are actually usable right now |
| GET | `/api/cost` | Spend against the monthly cap |

## Design notes

**Provenance is stored, never inferred.** Every `Score` row carries the judge
model, temperature, rubric version and prompt version it was produced under. A
relevance of 0.9 is not a fact about a sample; it is a fact about that sample as
scored by a named judge under a named rubric. Reading those from current
settings at query time would let a settings change silently rewrite history.

**Bias is designed out, not warned about.** A run whose judge and candidate are
the same model is refused at creation, compared on the undated stem so `gpt-4.1`
and `gpt-4.1-2025-04-14` are caught as one model. The judge runs at temperature
zero against a rubric with described anchor points, and the prompt states
outright that a fluent answer contradicting the reference scores near zero.

**Cost is computed, not measured.** The response reports token counts;
`providers/pricing.py` holds the per-million rates. Local and mock models are
priced at zero because they cost electricity, not tokens.

**Failures are isolated.** Each sample is independent. A generation failure
records against that sample and the run continues; a judging failure keeps the
generation and marks only the score missing. Averages come from scored samples
only, so a timeout never looks like a quality regression.

**Guard rails run before spend.** Self-judging, an unknown dataset, and a run
that would cross the monthly cap are all refused at creation, each with its own
HTTP status (422, 400, 402) rather than a blanket 400.

## Known gaps

- Alembic is installed but no migration has been generated yet; tables are
  created from the models at startup.
- The React app still renders its own seed data and does not call this API.
- Judge validation against a human-labelled golden set is not implemented, so
  the scores are not yet checked for agreement with human ratings.
- Retrieval metrics (context precision and recall) need a vector store and are
  not started.
