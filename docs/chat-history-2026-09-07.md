# EvalLens — saved chat history

Source: prior Claude conversation (https://claude.ai/share/248cc667-abbe-4959-b6e1-a484c6bdba32 — not
fetchable by the agent; pasted in by the user). Saved 2026-09-07 for use as project context.

---

**User** (with attachment: `Screenshot 2026-06-12 at 12.46.17 PM.png`):

> We are going to begin the development of this project. start by stating what it is, is it a web app,
> or a system, how are users meant to access it.

**Assistant** *(Thought for 21s)*:

Good instinct — if you can explain the same thing at four altitudes, you actually understand it. Here's
each, kept tight.

### 1. To a layman (zero tech)

Imagine you hire an assistant who answers questions for you all day. Sometimes the answers are
brilliant; sometimes the assistant confidently makes something up. You want to know: is this assistant
actually any good, and is it worth what I'm paying?

EvalLens is a report-card machine for that assistant. You hand it a stack of test questions, it watches
the assistant answer them, and it grades each answer — was it correct? did it stay on topic? how long
did it take? how much did it cost? Then it puts all those grades on a screen so you can see the
assistant's strengths and weaknesses at a glance, and even line up two assistants side by side to see
which one is better. That's it: it grades a robot's homework and shows you the marks.

### 2. To a daily ChatGPT user (no tech grounding)

You already know the core problem from using ChatGPT: sometimes it nails the answer, sometimes it
hallucinates, and when you reword a prompt to improve it, you're mostly guessing that the new version is
better because one answer looked nicer. EvalLens replaces that guessing with measurement.

Instead of eyeballing one answer, it runs dozens of test questions automatically and grades every answer
for you. The neat trick is that the grading is also done by an AI — you ask a second, trusted AI to act
as a strict teacher: "here's the question, here's the answer, score it 0 to 100 and explain why." On top
of quality, it tracks two things you never see in the ChatGPT app: how many seconds each answer took, and
the tiny cost each answer racks up behind the scenes (every answer quietly costs a fraction of a cent).
Now when you change a prompt, you can prove "this version scores higher, runs faster, and costs less"
instead of hoping so.

### 3. To a junior developer (some tech, knows LLM outputs)

Mechanically, EvalLens is glue around two API calls plus storage. Your FastAPI backend takes a test
question and makes an HTTP request to the OpenAI API. The response comes back as JSON containing the
answer text and a token-usage count. You wrap a timer around that call → that's your latency; you
multiply the token count by OpenAI's price → that's your cost. Both fall out of the response for free.

For quality, you fire a second API call — the "judge." You send a structured prompt: question + the
answer + (for RAG) the source documents, and you instruct the model to return JSON like
`{"relevance": 0.9, "faithfulness": 0.85, "reason": "..."}`. You parse that, and now you have scores.
Everything — the run, each sample, each score, latency, cost — gets written to a database (think tables:
`runs`, `samples`, `scores`). FastAPI exposes endpoints like `/runs` and `/runs/{id}`; the React
dashboard calls those with TanStack Query and renders the tables and comparison charts. No model is
hosted locally — you're orchestrating remote calls and persisting the results.

### 4. To a senior engineer

The cost and latency metrics are deterministic and trivial — they're byproducts of the call. The actual
engineering substance is in making the quality signal trustworthy and reproducible, because
LLM-as-judge is a noisy, biased estimator. You're fighting non-determinism (pin temperature to 0, pin the
judge model version), position and verbosity bias, and self-preference bias (so the judge model must
differ from the candidate, and ideally rubric-anchored with few-shot examples). Pairwise comparison
("is A or B better") tends to be more reliable than absolute 0–1 scoring, and structured output /
function-calling makes scores parseable instead of regex-scraped. Critically, a score means nothing
until you've validated the judge against a human-labeled golden set — otherwise you're charting noise;
you want to show the judge correlates with human ratings.

Architecturally: batch scoring is IO-bound and rate-limited, so runs go through an async job queue
(BackgroundTasks → arq → Celery as you scale), with idempotent, versioned run records — every score is
tagged with judge model, prompt version, and rubric version so it's comparable across runs. The vector DB
earns its place only on the RAG side: retrieval metrics like context precision/recall need the retrieved
chunks plus ground-truth references, which is why you store embeddings and retrieved context, not just
final answers. SQLite/Chroma for the single-user OSS build, with a clean swap path to Postgres + pgvector
when it needs to scale. The defensible thesis is: trivial metrics are free, the hard problem is
reproducible, low-bias quality measurement, and the system is designed around that.

That last framing is your defense in one sentence — lead with it if someone challenges "isn't this just
calling an API twice?"

---

**User:**

> for this project, what would typically be the tech stack and would it in the long run require funding
> for the agents that are going to be installed on it

**Assistant** *(Thought for 9s; searched the web)*:

Two parts here — the stack (I'll consolidate what we've scattered across the thread into one clean view)
and the money question, which is the more important one for a project you'll defend.

Let me untangle one thing first, because it's the crux of your question: nothing gets "installed" on
EvalLens that runs continuously and racks up a bill. There are no agents living inside it burning money
in the background. The model sits on OpenAI's servers (remember the two-API-call picture), and you only
pay in the brief moments you actually fire a request. Close your laptop and the cost is exactly zero. So
"funding" isn't about keeping agents alive — it's purely about how often you press "run."

### The stack, consolidated — and what each part costs

Almost the entire stack is free and open-source, with no recurring cost:

- **Backend:** Python, FastAPI, SQLModel, Alembic — free.
- **Frontend:** React, Vite, TypeScript, Tailwind, shadcn/ui, TanStack Query/Table, Recharts — free.
- **Relational DB:** SQLite (free, file-based) → PostgreSQL later (free software).
- **Vector DB:** Chroma (free, embedded) → Qdrant or pgvector later (free software).
- **Infra:** Docker Compose to run it all locally — free.

If you run this on your own laptop, the software bill is $0/month, forever.

There is exactly one thing that costs money: the API tokens for the model calls. That's the generation
call, the judge call, and (on the RAG side) the embeddings. Everything else is just code moving data
around.

### What the API actually costs — real numbers

Pricing today, per million tokens: GPT-4.1 is $2 input / $8 output, GPT-4.1 Mini is $0.40 / $1.60, and
GPT-4.1 Nano is $0.10 / $0.40. [PE Collective] Embeddings run roughly $0.02–$0.13 per million tokens,
[PE Collective] which is basically a rounding error. And usefully, the Batch API discounts everything
50%, and prompt caching can cut repeated input costs up to 90% [PE Collective] — both of which apply
perfectly to eval workloads, since you reuse the same rubric prompt on every sample.

Let me cost out one realistic eval run of 100 test questions. Each question = one generation call + one
judge call:

- Generation (Mini, ~500 tokens in / 300 out): ≈ $0.0007 per sample
- Judge (GPT-4.1, ~1,000 in / 150 out): ≈ $0.003 per sample
- ≈ $0.004 per sample → about **$0.40 for the whole 100-question run**.

So a full evaluation run costs you under half a dollar. A heavy day of iterating — say 20 runs while you
tune prompts — is around $8. A month of active development on this project realistically lands somewhere
in the $30–150 range, and that's if you're hammering it. There are no fees for the API calls themselves,
no overage surprises, and no inactivity fees — unused API keys incur no cost. [Deploybase]

For a portfolio/capstone project, that's not "funding" — that's pocket money, and you can cap it: OpenAI
lets you set a hard monthly spend limit so it can never surprise you.

### When it would need real money — and when it won't

The honest answer to "in the long run":

- **As a self-hosted, single-user OSS tool** (your v1, and what you'd demo and defend): essentially
  free. A few dollars to tens of dollars in API usage, only when you run evals. No funding needed.
- **As a hosted SaaS** where strangers sign up and run their own evals against your API key: now their
  usage is your bill, and you'd need either funding, a "bring your own API key" model, or paid tiers.
  But that's a business decision you're choosing to take on, not something the project requires.

### The escape hatch that makes funding optional entirely

Because your Judge and candidate models are just swappable interfaces behind an API call, you can point
them at a local open-source model (via Ollama, LM Studio, etc.) running on your own machine instead of
OpenAI. Then the per-token cost drops to $0 — you're spending your own electricity and compute, nothing
else.

This is actually a strong point to put in your defense: "The system is provider-agnostic. It runs against
the OpenAI API for quality, or against a local model for free — so the architecture doesn't depend on any
paid service." That turns the cost question from a weakness into a design feature.

So, bottom line: no ongoing agents, no mandatory funding. The only meter that ever runs is token usage
during active evaluation, it's cents per run, you can hard-cap it, and you can zero it out entirely with
a local model.

**Open question left on the table:** whether to add a small cost-tracking module to the plan — EvalLens
logging the exact dollar cost of every run into the database and showing a running total on the
dashboard. Nearly free to build since token counts are already read off every response.
