/**
 * The only place in the app that speaks HTTP.
 *
 * Per the project's structure guide, third-party and transport concerns live
 * behind a facade so a change lands in one file. Everything above this talks in
 * typed domain objects and never sees a URL or a Response.
 */
import type {
  CostSummary,
  CreateRunRequest,
  DatasetItem,
  DatasetSummary,
  HealthStatus,
  ProviderStatus,
  RunDetail,
  RunSummary,
} from '../types/api'

/** Same-origin by default: Vite proxies /api to the backend in development. */
const BASE_URL = import.meta.env.VITE_API_BASE_URL ?? ''

export class ApiError extends Error {
  readonly status: number

  constructor(message: string, status: number) {
    super(message)
    this.name = 'ApiError'
    this.status = status
  }
}

/**
 * The backend distinguishes its refusals by status code — 422 for a
 * self-judging configuration, 402 for the spend cap, 400 for a bad request —
 * and puts the human-readable reason in `detail`. Surfacing that text matters:
 * "Judge and candidate are both gpt-4.1" is the whole point of the refusal.
 */
async function request<T>(path: string, init?: RequestInit): Promise<T> {
  let response: Response
  try {
    response = await fetch(`${BASE_URL}${path}`, {
      headers: { 'content-type': 'application/json' },
      ...init,
    })
  } catch (cause) {
    // fetch only rejects on network failure, which in practice means the API
    // process is not running — worth saying plainly rather than "Failed to fetch".
    throw new ApiError(
      'Cannot reach the EvalLens API. Is the backend running on port 8000?',
      0,
    )
  }

  if (!response.ok) {
    let detail = `${response.status} ${response.statusText}`
    try {
      const body = await response.json()
      if (typeof body?.detail === 'string') detail = body.detail
    } catch {
      // A non-JSON error body is not worth failing over; keep the status line.
    }
    throw new ApiError(detail, response.status)
  }

  return (await response.json()) as T
}

export const api = {
  listRuns: () => request<RunSummary[]>('/api/runs'),
  getRun: (publicId: string) => request<RunDetail>(`/api/runs/${publicId}`),
  createRun: (payload: CreateRunRequest) =>
    request<RunSummary>('/api/runs', {
      method: 'POST',
      body: JSON.stringify(payload),
    }),
  listDatasets: () => request<DatasetSummary[]>('/api/datasets'),
  listDatasetItems: (name: string) =>
    request<DatasetItem[]>(`/api/datasets/${encodeURIComponent(name)}/items`),
  listProviders: () => request<ProviderStatus[]>('/api/providers'),
  getCost: () => request<CostSummary>('/api/cost'),
  getHealth: () => request<HealthStatus>('/health'),
}
