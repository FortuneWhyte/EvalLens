/**
 * Seed content for the Logs screen. Every line models something the backend
 * will actually emit: the two API calls per sample (generation, then judge),
 * the token counts those responses carry, and the failure modes the planning
 * notes call out — rate limits, timeouts, and judge output that will not parse.
 */

export type LogLevel = 'INFO' | 'WARN' | 'ERROR' | 'DEBUG'

export interface LogEntry {
  timestamp: string
  level: LogLevel
  source: string
  message: string
  /** present on lines that record a completed model call */
  tokens?: string
  cost?: string
}

export const logLevelStyles: Record<LogLevel, string> = {
  INFO: 'text-primary-fixed-dim border-primary-fixed-dim',
  WARN: 'text-tertiary-fixed-dim border-tertiary-fixed-dim',
  ERROR: 'text-error border-error',
  DEBUG: 'text-on-surface-variant border-outline-variant',
}

export const logStats = [
  { label: 'REQUESTS', value: '412', valueClasses: 'text-primary-fixed-dim' },
  { label: 'ERRORS', value: '3', valueClasses: 'text-error' },
  { label: 'AVG_LATENCY', value: '240', unit: 'ms', valueClasses: 'text-secondary-fixed' },
  { label: 'TOKENS_USED', value: '184.2K', valueClasses: 'text-tertiary-fixed-dim' },
]

export const logLevelFilters: Array<LogLevel | 'ALL'> = ['ALL', 'INFO', 'WARN', 'ERROR', 'DEBUG']

export const logEntries: LogEntry[] = [
  {
    timestamp: '14:32:01.104',
    level: 'INFO',
    source: 'runner',
    message: 'Run EVL-1042 started :: dataset=customer_support_v2 samples=100',
  },
  {
    timestamp: '14:32:01.288',
    level: 'DEBUG',
    source: 'queue',
    message: 'Dispatching batch 1/10 with concurrency=8',
  },
  {
    timestamp: '14:32:01.902',
    level: 'INFO',
    source: 'openai',
    message: 'POST /v1/chat/completions :: gpt-4-turbo :: 280ms',
    tokens: '512 in / 143 out',
    cost: '$0.0021',
  },
  {
    timestamp: '14:32:02.417',
    level: 'INFO',
    source: 'judge',
    message: 'Scored sample 001 :: relevance=0.98 faithfulness=0.95',
    tokens: '1,024 in / 96 out',
    cost: '$0.0031',
  },
  {
    timestamp: '14:32:03.006',
    level: 'WARN',
    source: 'openai',
    message: 'Rate limit headroom low :: 8 requests remaining, backing off 400ms',
  },
  {
    timestamp: '14:32:04.550',
    level: 'INFO',
    source: 'judge',
    message: 'Scored sample 003 :: relevance=0.88 faithfulness=0.21',
    tokens: '1,088 in / 112 out',
    cost: '$0.0034',
  },
  {
    timestamp: '14:32:04.551',
    level: 'WARN',
    source: 'judge',
    message: 'Sample 003 below faithfulness threshold (0.21 < 0.50) :: flagged',
  },
  {
    timestamp: '14:32:06.130',
    level: 'ERROR',
    source: 'judge',
    message: 'Sample 007 :: judge returned unparseable JSON, retrying (1/3)',
  },
  {
    timestamp: '14:32:07.402',
    level: 'INFO',
    source: 'judge',
    message: 'Sample 007 :: retry succeeded on structured output',
    tokens: '1,102 in / 88 out',
    cost: '$0.0033',
  },
  {
    timestamp: '14:32:09.771',
    level: 'ERROR',
    source: 'openai',
    message: 'Sample 012 :: request timed out after 800ms, marking failed',
  },
  {
    timestamp: '14:32:11.220',
    level: 'DEBUG',
    source: 'store',
    message: 'Persisted 24 score rows :: judge=gpt-4-turbo-2024-04-09 rubric=r3',
  },
  {
    timestamp: '14:32:12.008',
    level: 'INFO',
    source: 'runner',
    message: 'Run EVL-1042 complete :: 100/100 samples, total cost $1.02',
  },
]
