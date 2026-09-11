/**
 * The model catalogue for the Models screen. Prices are per million tokens and follow
 * the figures in the planning notes; the local entry is priced at zero to make
 * the provider-agnostic escape hatch visible rather than merely claimed.
 */

import type { ProviderStatus } from '../types/api'

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

const CATALOGUE: Omit<ModelEntry, "status">[] = [
  {
    id: 'gpt-4-turbo-2024-04-09',
    provider: 'OPENAI',
    role: 'JUDGE',
    context: '128K',
    inputPrice: '$2.00',
    outputPrice: '$8.00',
    note: 'Pinned version. Must differ from the candidate to avoid self-preference bias.',
  },
  {
    id: 'gpt-4.1-mini',
    provider: 'OPENAI',
    role: 'CANDIDATE',
    context: '128K',
    inputPrice: '$0.40',
    outputPrice: '$1.60',
    note: 'Default candidate. Cheap enough to run a full sweep on every prompt change.',
  },
  {
    id: 'claude-3-opus',
    provider: 'ANTHROPIC',
    role: 'CANDIDATE',
    context: '200K',
    inputPrice: '$15.00',
    outputPrice: '$75.00',
    note: 'Used for head-to-head pairwise comparisons against the default candidate.',
  },
  {
    id: 'llama-3-70b',
    provider: 'OLLAMA',
    role: 'CANDIDATE',
    context: '8K',
    inputPrice: '$0.00',
    outputPrice: '$0.00',
    note: 'Runs on this machine. Zero token cost; the meter is electricity, not billing.',
  },
  {
    id: 'mixtral-8x7b',
    provider: 'OLLAMA',
    role: 'UNUSED',
    context: '32K',
    inputPrice: '$0.00',
    outputPrice: '$0.00',
    note: 'Pulled but not currently served. Start the local runtime to enable.',
  },
  {
    id: 'gemini-1.5-pro',
    provider: 'GOOGLE',
    role: 'UNUSED',
    context: '1M',
    inputPrice: '$1.25',
    outputPrice: '$5.00',
    note: 'No API key configured. Add one in SETTINGS to enable this provider.',
  },
]


/**
 * Merge the static catalogue with what the API says is actually reachable.
 *
 * The catalogue is a design decision (which models this project cares about
 * and why); readiness is a fact only the backend knows, so it is never assumed
 * here. A provider with no key configured must read NO_KEY, not READY.
 */
export function buildModelEntries(providers: ProviderStatus[] | undefined): ModelEntry[] {
  const configured = new Map(
    (providers ?? []).map((provider) => [provider.name.toUpperCase(), provider.configured]),
  )

  return CATALOGUE.map((entry) => {
    const isConfigured = configured.get(entry.provider)
    const local = entry.provider === 'OLLAMA'

    let status: ModelStatus
    if (isConfigured === undefined) {
      status = 'OFFLINE'
    } else if (!isConfigured) {
      // A local daemon that is not answering is offline; a hosted provider
      // without credentials is a different problem, and says so.
      status = local ? 'OFFLINE' : 'NO_KEY'
    } else {
      status = local ? 'LOCAL' : 'READY'
    }

    return { ...entry, status }
  })
}

export function buildProviderSummary(
  providers: ProviderStatus[] | undefined,
  entries: ModelEntry[],
  monthSpend: number,
) {
  return [
    {
      label: 'PROVIDERS',
      value: String(providers?.length ?? 0),
      valueClasses: 'text-primary-fixed-dim',
    },
    {
      label: 'MODELS_READY',
      value: String(entries.filter((entry) => entry.status === 'READY').length),
      valueClasses: 'text-secondary-fixed',
    },
    {
      label: 'LOCAL_MODELS',
      value: String(entries.filter((entry) => entry.status === 'LOCAL').length),
      valueClasses: 'text-tertiary-fixed-dim',
    },
    { label: 'MONTH_SPEND', value: `$${monthSpend.toFixed(2)}`, valueClasses: 'text-on-surface' },
  ]
}
