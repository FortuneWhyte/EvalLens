/** Seed content for the Dashboard screen, lifted from dashboard/code.html. */

export type StatTone = 'green' | 'cyan' | 'magenta'

export interface DashboardStat {
  label: string
  value: string
  delta: string
  /** true when the delta reads as a regression and is drawn in the error colour */
  deltaIsNegative: boolean
  tone: StatTone
}

export const dashboardStats: DashboardStat[] = [
  { label: 'RELEVANCE', value: '92%', delta: '+2%', deltaIsNegative: false, tone: 'green' },
  { label: 'FAITHFULNESS', value: '88%', delta: '-1%', deltaIsNegative: true, tone: 'cyan' },
  { label: 'COST', value: '$4.21', delta: '+0.05', deltaIsNegative: true, tone: 'magenta' },
  { label: 'RUNS', value: '36', delta: '+4', deltaIsNegative: false, tone: 'green' },
]

export type RunStatus = 'DONE' | 'RUNNING' | 'QUEUED' | 'FAILED'

export interface EvaluationRun {
  id: string
  model: string
  promptVer: string
  status: RunStatus
  relevance: string
  faithfulness: string
  latency: string
  cost: string
  /** which cells are drawn in the muted colour: the whole row, or just the metrics */
  dim: 'all' | 'metrics' | 'none'
}

export const evaluationRuns: EvaluationRun[] = [
  {
    id: 'EVL-1042',
    model: 'gpt-4-turbo',
    promptVer: 'v1.2.4',
    status: 'DONE',
    relevance: '94%',
    faithfulness: '89%',
    latency: '320',
    cost: '$1.02',
    dim: 'none',
  },
  {
    id: 'EVL-1043',
    model: 'claude-3-opus',
    promptVer: 'v1.2.4',
    status: 'RUNNING',
    relevance: '--',
    faithfulness: '--',
    latency: '--',
    cost: '--',
    dim: 'none',
  },
  {
    id: 'EVL-1044',
    model: 'llama-3-70b',
    promptVer: 'v1.2.5-draft',
    status: 'QUEUED',
    relevance: '--',
    faithfulness: '--',
    latency: '--',
    cost: '--',
    dim: 'all',
  },
  {
    id: 'EVL-1041',
    model: 'gpt-3.5-turbo',
    promptVer: 'v1.1.0',
    status: 'FAILED',
    relevance: '--',
    faithfulness: '--',
    latency: '800 (T/O)',
    cost: '$0.04',
    dim: 'metrics',
  },
  {
    id: 'EVL-1040',
    model: 'gpt-4-turbo',
    promptVer: 'v1.2.3',
    status: 'DONE',
    relevance: '91%',
    faithfulness: '87%',
    latency: '410',
    cost: '$0.98',
    dim: 'none',
  },
  {
    id: 'EVL-1039',
    model: 'mixtral-8x7b',
    promptVer: 'v1.2.3',
    status: 'DONE',
    relevance: '88%',
    faithfulness: '82%',
    latency: '120',
    cost: '$0.12',
    dim: 'none',
  },
]

export const tickerText =
  '> SYS_LOAD: 12% | LATENCY_AVG: 240ms | BUFFER_STABLE | API_QUOTA: 84% | MEMORY: 4GB/16GB | ACTIVE_NODES: 3 | LAST_SYNC: 0.04s AGO | (C) 2024 EVAL_LENS // SYSTEM_STABLE'
