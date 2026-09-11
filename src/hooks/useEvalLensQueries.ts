/**
 * Query hooks, one per endpoint.
 *
 * Screens import from here rather than calling the client directly, so caching
 * and polling policy lives in one place instead of being restated per screen.
 */
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query'
import { api } from '../lib/api'
import type { CreateRunRequest, RunDetail, RunSummary } from '../types/api'

export const queryKeys = {
  runs: ['runs'] as const,
  run: (publicId: string) => ['runs', publicId] as const,
  datasets: ['datasets'] as const,
  providers: ['providers'] as const,
  cost: ['cost'] as const,
}

/** True while a run is still being evaluated, so the UI knows to keep watching. */
function isInFlight(status: string | undefined): boolean {
  return status === 'QUEUED' || status === 'RUNNING'
}

export function useRuns() {
  return useQuery({
    queryKey: queryKeys.runs,
    queryFn: api.listRuns,
    // Poll only while something is actually running. A list of finished runs is
    // immutable, so polling it forever would be wasted requests.
    refetchInterval: (query) => {
      const runs = query.state.data as RunSummary[] | undefined
      return runs?.some((run) => isInFlight(run.status)) ? 2000 : false
    },
  })
}

export function useRun(publicId: string | undefined) {
  return useQuery({
    queryKey: queryKeys.run(publicId ?? ''),
    queryFn: () => api.getRun(publicId as string),
    enabled: Boolean(publicId),
    refetchInterval: (query) => {
      const run = query.state.data as RunDetail | undefined
      return isInFlight(run?.status) ? 1500 : false
    },
  })
}

export function useDatasets() {
  return useQuery({ queryKey: queryKeys.datasets, queryFn: api.listDatasets })
}

export function useProviders() {
  return useQuery({ queryKey: queryKeys.providers, queryFn: api.listProviders })
}

export function useCost() {
  return useQuery({ queryKey: queryKeys.cost, queryFn: api.getCost })
}

export function useCreateRun() {
  const queryClient = useQueryClient()
  return useMutation({
    mutationFn: (payload: CreateRunRequest) => api.createRun(payload),
    onSuccess: () => {
      // The new run is QUEUED, so refreshing the list also starts the polling
      // that will follow it to completion.
      queryClient.invalidateQueries({ queryKey: queryKeys.runs })
      queryClient.invalidateQueries({ queryKey: queryKeys.cost })
    },
  })
}
