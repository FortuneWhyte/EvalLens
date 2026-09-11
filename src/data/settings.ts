/**
 * Settings content that has no API behind it yet.
 *
 * API keys, spend and the judge model now come from the backend. What is left
 * here is documentation: the hints explaining why each judge setting is set the
 * way it is, and the guardrail list. Those are decisions to explain, not state
 * to fetch.
 */

export interface JudgeSetting {
  label: string
  value: string
  hint: string
}

export const judgeSettings: JudgeSetting[] = [
  {
    label: 'DEFAULT_JUDGE',
    value: 'gpt-4-turbo-2024-04-09',
    hint: 'Pinned to a dated version so scores stay comparable across runs.',
  },
  {
    label: 'JUDGE_TEMPERATURE',
    value: '0.0',
    hint: 'Held at zero. A judge that varies run to run is measuring noise.',
  },
  {
    label: 'RUBRIC_VERSION',
    value: 'r3',
    hint: 'Stamped onto every score, so a rubric change never silently rewrites history.',
  },
  {
    label: 'SCORING_MODE',
    value: 'PAIRWISE',
    hint: 'Pairwise comparison is more reliable than absolute 0-1 scoring.',
  },
]

export const toggles = [
  {
    label: 'BLOCK_SELF_JUDGING',
    hint: 'Refuse runs where the judge and candidate are the same model.',
    enabled: true,
  },
  {
    label: 'BATCH_API',
    hint: 'Route eligible runs through the batch endpoint at half price.',
    enabled: true,
  },
  {
    label: 'PROMPT_CACHING',
    hint: 'Reuse the cached rubric prefix across samples in a run.',
    enabled: true,
  },
  {
    label: 'GOLDEN_SET_CHECK',
    hint: 'Compare judge scores against human labels before publishing a run.',
    enabled: false,
  },
]
