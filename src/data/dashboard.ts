/**
 * Presentation helpers for the Dashboard.
 *
 * The numbers themselves come from the API; what stays here is how a stat tile
 * is coloured, which is a design decision rather than data.
 */
import type { CostSummary, RunSummary } from '../types/api'

export type StatTone = 'green' | 'cyan' | 'magenta'

export interface DashboardStat {
  label: string
  value: string
  delta: string
  /** true when the delta reads as a regression and is drawn in the error colour */
  deltaIsNegative: boolean
  tone: StatTone
}

function percent(value: number | null | undefined): string {
  return value === null || value === undefined ? '--' : `${Math.round(value * 100)}%`
}

/**
 * Build the four headline tiles from the run list.
 *
 * Deltas compare the newest scored run against the one before it, which is the
 * only comparison the data actually supports. With fewer than two scored runs
 * there is nothing to compare, so the delta is blank rather than invented.
 */
export function buildDashboardStats(
  runs: RunSummary[],
  cost: CostSummary | undefined,
): DashboardStat[] {
  const scored = runs.filter((run) => run.avg_relevance !== null)
  const latest = scored[0]
  const previous = scored[1]

  const delta = (
    current: number | null | undefined,
    prior: number | null | undefined,
  ): { text: string; negative: boolean } => {
    if (current === null || current === undefined || prior === null || prior === undefined) {
      return { text: '--', negative: false }
    }
    const points = Math.round((current - prior) * 100)
    return {
      text: `${points >= 0 ? '+' : ''}${points}%`,
      negative: points < 0,
    }
  }

  const relevance = delta(latest?.avg_relevance, previous?.avg_relevance)
  const faithfulness = delta(latest?.avg_faithfulness, previous?.avg_faithfulness)

  return [
    {
      label: 'RELEVANCE',
      value: percent(latest?.avg_relevance),
      delta: relevance.text,
      deltaIsNegative: relevance.negative,
      tone: 'green',
    },
    {
      label: 'FAITHFULNESS',
      value: percent(latest?.avg_faithfulness),
      delta: faithfulness.text,
      deltaIsNegative: faithfulness.negative,
      tone: 'cyan',
    },
    {
      label: 'COST',
      value: `$${(cost?.total_spend_usd ?? 0).toFixed(2)}`,
      // Spend only ever rises, so it is reported rather than compared.
      delta: cost ? `of $${cost.monthly_cap_usd.toFixed(0)}` : '--',
      deltaIsNegative: false,
      tone: 'magenta',
    },
    {
      label: 'RUNS',
      value: String(runs.length),
      delta: `${runs.filter((run) => run.status === 'RUNNING').length} active`,
      deltaIsNegative: false,
      tone: 'green',
    },
  ]
}

export const tickerText =
  '> SYS_LOAD: 12% | LATENCY_AVG: 240ms | BUFFER_STABLE | API_QUOTA: 84% | MEMORY: 4GB/16GB | ACTIVE_NODES: 3 | LAST_SYNC: 0.04s AGO | (C) 2024 EVAL_LENS // SYSTEM_STABLE'
