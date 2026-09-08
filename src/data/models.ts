/**
 * Seed content for the Models screen. Prices are per million tokens and follow
 * the figures in the planning notes; the local entry is priced at zero to make
 * the provider-agnostic escape hatch visible rather than merely claimed.
 */

export type ModelRole = 'CANDIDATE' | 'JUDGE' | 'UNUSED'
export type ModelStatus = 'READY' | 'NO_KEY' | 'LOCAL' | 'OFFLINE'

export interface ModelEntry {
  id: string
  provider: string
  role: ModelRole
  status: ModelStatus
  context: string
  inputPrice: string
  outputPrice: string
  note: string
}

export const roleStyles: Record<ModelRole, string> = {
  CANDIDATE: 'text-secondary-fixed border-secondary-fixed bg-secondary-container/10',
  JUDGE: 'text-primary-fixed-dim border-primary-fixed-dim bg-primary-container/10',
  UNUSED: 'text-on-surface-variant border-outline-variant bg-surface-variant/10',
}

export const statusStyles: Record<ModelStatus, string> = {
  READY: 'text-primary-fixed-dim',
  NO_KEY: 'text-error',
  LOCAL: 'text-tertiary-fixed-dim',
  OFFLINE: 'text-on-surface-variant',
}

export const modelEntries: ModelEntry[] = [
  {
    id: 'gpt-4-turbo-2024-04-09',
    provider: 'OPENAI',
    role: 'JUDGE',
    status: 'READY',
    context: '128K',
    inputPrice: '$2.00',
    outputPrice: '$8.00',
    note: 'Pinned version. Must differ from the candidate to avoid self-preference bias.',
  },
  {
    id: 'gpt-4.1-mini',
    provider: 'OPENAI',
    role: 'CANDIDATE',
    status: 'READY',
    context: '128K',
    inputPrice: '$0.40',
    outputPrice: '$1.60',
    note: 'Default candidate. Cheap enough to run a full sweep on every prompt change.',
  },
  {
    id: 'claude-3-opus',
    provider: 'ANTHROPIC',
    role: 'CANDIDATE',
    status: 'READY',
    context: '200K',
    inputPrice: '$15.00',
    outputPrice: '$75.00',
    note: 'Used for head-to-head pairwise comparisons against the default candidate.',
  },
  {
    id: 'llama-3-70b',
    provider: 'OLLAMA',
    role: 'CANDIDATE',
    status: 'LOCAL',
    context: '8K',
    inputPrice: '$0.00',
    outputPrice: '$0.00',
    note: 'Runs on this machine. Zero token cost; the meter is electricity, not billing.',
  },
  {
    id: 'mixtral-8x7b',
    provider: 'OLLAMA',
    role: 'UNUSED',
    status: 'OFFLINE',
    context: '32K',
    inputPrice: '$0.00',
    outputPrice: '$0.00',
    note: 'Pulled but not currently served. Start the local runtime to enable.',
  },
  {
    id: 'gemini-1.5-pro',
    provider: 'GOOGLE',
    role: 'UNUSED',
    status: 'NO_KEY',
    context: '1M',
    inputPrice: '$1.25',
    outputPrice: '$5.00',
    note: 'No API key configured. Add one in SETTINGS to enable this provider.',
  },
]

export const providerSummary = [
  { label: 'PROVIDERS', value: '4', valueClasses: 'text-primary-fixed-dim' },
  { label: 'MODELS_READY', value: '3', valueClasses: 'text-secondary-fixed' },
  { label: 'LOCAL_MODELS', value: '2', valueClasses: 'text-tertiary-fixed-dim' },
  { label: 'MONTH_SPEND', value: '$18.40', valueClasses: 'text-on-surface' },
]
