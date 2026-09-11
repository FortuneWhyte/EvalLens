/**
 * Response shapes from the EvalLens API.
 *
 * These mirror backend/app/schemas.py field for field. When one changes, both
 * change: there is no code generation step, so the pairing is maintained by
 * hand and the API's /docs page is the reference.
 */

export type RunStatus = 'QUEUED' | 'RUNNING' | 'DONE' | 'FAILED'
export type SampleStatus = 'PENDING' | 'DONE' | 'FAILED'

export interface Score {
  relevance: number | null
  faithfulness: number | null
  reason: string
  judge_model: string
  judge_temperature: number
  rubric_version: string
  prompt_version: string
  judge_cost_usd: number
}

export interface Sample {
  external_id: string
  question: string
  reference: string | null
  output: string | null
  status: SampleStatus
  error: string | null
  latency_ms: number | null
  input_tokens: number
  output_tokens: number
  cost_usd: number
  score: Score | null
}

export interface RunSummary {
  public_id: string
  dataset: string
  candidate_model: string
  judge_model: string
  status: RunStatus
  total_samples: number
  completed_samples: number
  avg_relevance: number | null
  avg_faithfulness: number | null
  p50_latency_ms: number | null
  total_cost_usd: number
  created_at: string
}

export interface RunDetail extends RunSummary {
  candidate_provider: string
  judge_provider: string
  judge_temperature: number
  prompt_version: string
  rubric_version: string
  system_prompt: string
  error: string | null
  samples: Sample[]
}

export interface DatasetSummary {
  name: string
  description: string
  item_count: number
}

export interface DatasetItem {
  external_id: string
  question: string
  reference: string | null
  context: string | null
  tags: string[]
}

export interface ProviderStatus {
  name: string
  configured: boolean
}

export interface CostSummary {
  total_spend_usd: number
  monthly_cap_usd: number
  run_count: number
  remaining_usd: number
}

export interface CreateRunRequest {
  dataset: string
  candidate_model?: string
  candidate_provider?: string
  judge_model?: string | null
  judge_provider?: string
  prompt_version?: string
  system_prompt?: string
}
