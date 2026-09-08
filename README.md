# EvalLens

**An evaluation harness and dashboard for LLM applications.** Run a dataset of test questions through a
candidate model, grade every answer with a second "judge" model, and record quality, latency, and dollar
cost for each sample — so you can prove a prompt change made things better instead of hoping it did.

> **Status: design phase.** This repository currently holds the UI design system and static mockups for
> the four main screens. No application code has been written yet. See [Roadmap](#roadmap).

---

## The problem

When you tune a prompt, you usually judge the result by reading one answer and deciding it "looks
better." That is not measurement — it is vibes. And two things you actually care about are invisible in
a normal chat interface: how long each answer took, and what it cost.

EvalLens replaces the guesswork with numbers. It runs your test set automatically, scores every answer,
and puts the results next to each other so two prompts, two models, or two retrieval configurations can
be compared on the same evidence.

## How it works

Each sample flows through two API calls:

1. **Generation.** The candidate model answers the test question. The response carries the answer text
   and a token-usage count. Wrapping a timer around the call gives you **latency**; multiplying tokens by
   the provider's rate gives you **cost**. Both fall out for free.
2. **Judging.** A second model — deliberately a *different* one — receives the question, the answer, and
   (for RAG) the retrieved source documents, with a rubric instructing it to return structured JSON:

   ```json
   { "relevance": 0.9, "faithfulness": 0.85, "reason": "..." }
   ```

Run metadata, per-sample records, and scores are persisted (`runs`, `samples`, `scores`), exposed over a
REST API, and rendered by the dashboard.

## The hard part

Cost and latency are deterministic byproducts of the call — trivial. The engineering substance is making
the **quality** signal trustworthy, because LLM-as-judge is a noisy, biased estimator. The design takes
that seriously:

- **Determinism** — judge temperature pinned to 0, judge model version pinned.
- **Bias control** — the judge model must differ from the candidate (self-preference bias); rubrics are
  anchored with few-shot examples; position and verbosity bias are accounted for.
- **Pairwise where it helps** — "is A or B better" is more reliable than absolute 0–1 scoring.
- **Structured output** — function calling, so scores are parsed, not regex-scraped.
- **Versioned comparability** — every score is tagged with judge model, prompt version, and rubric
  version, so runs remain comparable over time.
- **Judge validation** — a score means nothing until the judge is checked against a human-labeled golden
  set. Correlation with human ratings is the thing that makes the rest of the chart meaningful.

That last point is the project's thesis: *trivial metrics are free; the real problem is reproducible,
low-bias quality measurement, and the system is designed around it.*

## Screens

The mockups live in this repo — each folder has a rendered screenshot (`screen.png`), a static HTML
prototype (`code.html`), and the design spec (`DESIGN.md`).

| Folder | Screen | What it does |
| --- | --- | --- |
| [`dashboard/`](dashboard/) | Dashboard | Run history with relevance, faithfulness, cost, and latency; comparison across runs |
| [`datasets/`](datasets/) | Dataset Explorer | Browse and inspect evaluation datasets and their samples |
| [`datasets_tagging/`](datasets_tagging/) | Dataset Explorer + Tag Manager | The explorer with the tag-management modal open, for labeling samples |
| [`prompt_ide/`](prompt_ide/) | Prompt IDE | Author prompts, pick models, and track version history |

![Dashboard](dashboard/screen.png)

The design system is **"Cyber-Terminal Matrix"** — a dark, dense, monospace (JetBrains Mono) terminal
aesthetic with neon accents on a near-black ground: green for standard state and success, cyan for
active/running processes, magenta for data visualization and cost. The full token set and layout rules
are documented identically in each `DESIGN.md`.

## Planned stack

Everything here is free and open source; the only thing that ever costs money is model API tokens.

**Backend** — Python, FastAPI, SQLModel, Alembic
**Frontend** — React, Vite, TypeScript, Tailwind, shadcn/ui, TanStack Query/Table, Recharts
**Relational store** — SQLite for the single-user build, with a clean path to PostgreSQL
**Vector store** — Chroma embedded, with a path to pgvector or Qdrant *(RAG evaluation only: retrieval
metrics like context precision and recall need the retrieved chunks stored, not just final answers)*
**Jobs** — batch scoring is IO-bound and rate-limited, so runs go through an async queue
(FastAPI `BackgroundTasks` → arq → Celery as it scales), with idempotent, versioned run records
**Infra** — Docker Compose for local development

## Cost model

Nothing runs continuously. No agent lives inside EvalLens burning money in the background — models are
remote, and you pay only for the moments a request is in flight. Close the laptop and the cost is zero.

A representative 100-question run is roughly **$0.40** — about $0.0007 per sample for generation on a
small model and ~$0.003 for a stronger judge. Batch APIs (50% off) and prompt caching (up to 90% off
repeated input) both apply well here, since the same rubric prompt is reused on every sample. Provider
spend limits let you hard-cap the whole thing.

**Provider-agnostic by design.** The candidate and judge are swappable interfaces behind an API call, so
both can be pointed at a local open-source model via Ollama or LM Studio. Per-token cost then drops to
zero — the architecture does not depend on any paid service.

## Roadmap

- [x] Design system and static mockups for the four core screens
- [ ] FastAPI backend: `runs`, `samples`, `scores` schema and migrations
- [ ] Provider abstraction for candidate and judge models (OpenAI + local)
- [ ] Judge with structured output, pinned versions, and rubric versioning
- [ ] Async run execution with progress reporting
- [ ] React dashboard wired to the API
- [ ] Cost tracking: exact dollar cost per run, with a running total on the dashboard
- [ ] Golden-set judge validation and human-agreement reporting
- [ ] RAG evaluation: retrieval storage and context precision/recall metrics

## Repository layout

```
dashboard/            Dashboard mockup      (screen.png, code.html, DESIGN.md)
datasets/             Dataset explorer mockup
datasets_tagging/     Dataset explorer with tag manager
prompt_ide/           Prompt IDE mockup
docs/                 Planning notes and saved design conversations
```
