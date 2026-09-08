/**
 * Seed content for the Settings screen. The spend cap is the concrete answer to
 * the funding question in the planning notes: cost is bounded by a limit the
 * operator sets, not by trust.
 */

export interface ApiKeyEntry {
  provider: string
  masked: string
  status: 'ACTIVE' | 'MISSING'
  added: string
}

export const apiKeys: ApiKeyEntry[] = [
  { provider: 'OPENAI', masked: 'sk-proj-••••••••••••••••4f2a', status: 'ACTIVE', added: '2024-09-02' },
  { provider: 'ANTHROPIC', masked: 'sk-ant-••••••••••••••••9c71', status: 'ACTIVE', added: '2024-09-14' },
  { provider: 'GOOGLE', masked: 'not configured', status: 'MISSING', added: '--' },
  { provider: 'OLLAMA', masked: 'http://localhost:11434', status: 'ACTIVE', added: '2024-10-01' },
]

export const spendLimit = {
  cap: '50.00',
  used: 18.4,
  capValue: 50,
  period: 'OCTOBER 2024',
}

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
