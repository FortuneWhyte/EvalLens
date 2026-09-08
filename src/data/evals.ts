/**
 * Seed content for the Evals screen. No mockup exists for this screen; the
 * shapes here follow what the planning notes say a run record must carry —
 * every score tagged with the judge model, prompt version and rubric version
 * that produced it, so runs stay comparable over time.
 */

export type EvalRunStatus = 'DONE' | 'RUNNING' | 'QUEUED' | 'FAILED'

export interface EvalRunSummary {
  id: string
  dataset: string
  model: string
  status: EvalRunStatus
  started: string
  samples: string
  selected: boolean
}

export const evalRuns: EvalRunSummary[] = [
  {
    id: 'EVL-1042',
    dataset: 'customer_support_v2',
    model: 'gpt-4-turbo',
    status: 'DONE',
    started: '2024-10-24 14:32',
    samples: '100/100',
    selected: true,
  },
  {
    id: 'EVL-1043',
    dataset: 'medical_qa_gold',
    model: 'claude-3-opus',
    status: 'RUNNING',
    started: '2024-10-24 15:01',
    samples: '38/100',
    selected: false,
  },
  {
    id: 'EVL-1044',
    dataset: 'ecommerce_intent_raw',
    model: 'llama-3-70b',
    status: 'QUEUED',
    started: '--',
    samples: '0/100',
    selected: false,
  },
  {
    id: 'EVL-1041',
    dataset: 'customer_support_v2',
    model: 'gpt-3.5-turbo',
    status: 'FAILED',
    started: '2024-10-23 09:12',
    samples: '12/100',
    selected: false,
  },
]

export interface EvalStat {
  label: string
  value: string
  unit?: string
  valueClasses: string
}

export const evalStats: EvalStat[] = [
  { label: 'RELEVANCE', value: '94', unit: '%', valueClasses: 'text-primary-fixed-dim' },
  { label: 'FAITHFULNESS', value: '89', unit: '%', valueClasses: 'text-secondary-fixed' },
  { label: 'LATENCY_P50', value: '320', unit: 'ms', valueClasses: 'text-on-surface' },
  { label: 'TOTAL_COST', value: '$1.02', valueClasses: 'text-tertiary-fixed-dim' },
]

/** The provenance every score is tagged with, so two runs can be compared. */
export const runProvenance = [
  { label: 'JUDGE_MODEL', value: 'gpt-4-turbo-2024-04-09' },
  { label: 'PROMPT_VER', value: 'v1.2.4' },
  { label: 'RUBRIC_VER', value: 'r3' },
  { label: 'TEMPERATURE', value: '0.0' },
]

export interface ScoredSample {
  id: string
  input: string
  output: string
  relevance: string
  faithfulness: string
  reason: string
  latency: string
  /** flagged rows scored below the pass threshold */
  failed: boolean
}

export const scoredSamples: ScoredSample[] = [
  {
    id: '001',
    input: '"How do I reset my router?"',
    output: '"Unplug it, wait 30 seconds, plug it back in."',
    relevance: '0.98',
    faithfulness: '0.95',
    reason: 'Directly answers the question and matches the reference steps.',
    latency: '280',
    failed: false,
  },
  {
    id: '002',
    input: '"Billing error on my invoice #992"',
    output: '"I have escalated invoice #992 to the billing team."',
    relevance: '0.92',
    faithfulness: '0.91',
    reason: 'Correct routing; invoice number preserved from the input.',
    latency: '310',
    failed: false,
  },
  {
    id: '003',
    input: '"What are your business hours?"',
    output: '"We are open 24/7, including public holidays."',
    relevance: '0.88',
    faithfulness: '0.21',
    reason: 'Contradicts the source: reference states 9AM-5PM EST, Mon-Fri.',
    latency: '295',
    failed: true,
  },
  {
    id: '004',
    input: '"Can I cancel my subscription mid-month?"',
    output: '"Yes. Refunds are prorated to the day of cancellation."',
    relevance: '0.96',
    faithfulness: '0.94',
    reason: 'Faithful to the refund policy in the retrieved context.',
    latency: '340',
    failed: false,
  },
  {
    id: '005',
    input: '"Do you ship to Canada?"',
    output: '"Shipping is available to most regions."',
    relevance: '0.61',
    faithfulness: '0.80',
    reason: 'Evasive: never confirms Canada specifically.',
    latency: '265',
    failed: true,
  },
]
