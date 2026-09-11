import { useEffect, useState } from 'react'
import Footer from '../../components/ui/Footer'
import ScanlineOverlay from '../../components/ui/ScanlineOverlay'
import SideNavBar from '../../components/navigation/SideNavBar'
import TopNavBar from '../../components/navigation/TopNavBar'
import { EmptyPanel, ErrorPanel, LoadingPanel } from '../../components/ui/QueryState'
import { useCreateRun, useDatasets, useRun, useRuns } from '../../hooks/useEvalLensQueries'
import EvalRunList from './components/EvalRunList'
import RunDetails from './components/RunDetails'

export default function Evals() {
  const runsQuery = useRuns()
  const datasetsQuery = useDatasets()
  const createRun = useCreateRun()
  const [selectedId, setSelectedId] = useState<string | null>(null)
  const [query, setQuery] = useState('')

  const runs = runsQuery.data ?? []
  const visible = runs.filter((run) => {
    const needle = query.trim().toLowerCase()
    if (needle === '') return true
    return (
      run.public_id.toLowerCase().includes(needle) ||
      run.dataset.toLowerCase().includes(needle) ||
      run.candidate_model.toLowerCase().includes(needle)
    )
  })

  // Select the newest run once the list arrives, and drop a selection that has
  // been filtered out so the detail pane never shows a run you cannot see.
  useEffect(() => {
    if (visible.length === 0) {
      if (selectedId !== null) setSelectedId(null)
      return
    }
    if (!visible.some((run) => run.public_id === selectedId)) {
      setSelectedId(visible[0].public_id)
    }
  }, [visible, selectedId])

  const runQuery = useRun(selectedId ?? undefined)
  const firstDataset = datasetsQuery.data?.[0]?.name

  return (
    <div className="page-datasets bg-background text-on-surface grid-bg min-h-screen flex flex-col antialiased selection:bg-primary-fixed-dim selection:text-surface">
      <ScanlineOverlay />
      <TopNavBar variant="explorer" />
      <div className="flex flex-1 overflow-hidden relative">
        <SideNavBar variant="explorer" />
        <main className="flex-1 flex flex-col h-full overflow-hidden p-gutter md:p-margin relative">
          <div className="flex flex-col md:flex-row justify-between items-start md:items-end mb-8 gap-4 border-b border-outline-variant pb-4">
            <div>
              <h1 className="font-headline-lg text-headline-lg text-primary-fixed-dim mb-2 neon-green">
                // EVAL_RUNS
              </h1>
              <div className="cyber-input-wrapper w-full md:w-96 mt-4">
                <input
                  className="cyber-input font-code text-code"
                  onChange={(event) => setQuery(event.target.value)}
                  placeholder="FIND_RUN..."
                  type="text"
                  value={query}
                />
              </div>
            </div>
            <button
              className="cyber-button px-6 py-3 font-label-caps text-label-caps flex items-center gap-2 disabled:opacity-50"
              disabled={!firstDataset || createRun.isPending}
              onClick={() =>
                firstDataset &&
                createRun.mutate({
                  dataset: firstDataset,
                  candidate_model: 'mock-candidate',
                  candidate_provider: 'mock',
                  judge_model: 'mock-judge',
                  judge_provider: 'mock',
                  prompt_version: 'v1.2.4',
                })
              }
            >
              <span className="material-symbols-outlined text-[18px]">play_arrow</span>
              {createRun.isPending ? '[ QUEUEING... ]' : '[ +_NEW_RUN ]'}
            </button>
          </div>

          {createRun.isError && (
            <div className="mb-4">
              <ErrorPanel error={createRun.error} />
            </div>
          )}

          {runsQuery.isLoading ? (
            <LoadingPanel label="FETCHING_RUNS" />
          ) : runsQuery.isError ? (
            <ErrorPanel error={runsQuery.error} onRetry={() => runsQuery.refetch()} />
          ) : visible.length === 0 ? (
            <EmptyPanel
              message={
                runs.length === 0
                  ? 'No runs yet. Queue one with [ +_NEW_RUN ], or POST to /api/runs.'
                  : `No run matches "${query}".`
              }
            />
          ) : (
            <div className="flex-1 grid grid-cols-1 lg:grid-cols-12 gap-gutter lg:gap-margin min-h-0">
              <EvalRunList onSelect={setSelectedId} runs={visible} selectedId={selectedId} />
              {runQuery.isLoading ? (
                <div className="lg:col-span-8 xl:col-span-9">
                  <LoadingPanel label="LOADING_RUN" />
                </div>
              ) : runQuery.isError ? (
                <div className="lg:col-span-8 xl:col-span-9">
                  <ErrorPanel error={runQuery.error} onRetry={() => runQuery.refetch()} />
                </div>
              ) : runQuery.data ? (
                <RunDetails run={runQuery.data} />
              ) : null}
            </div>
          )}
        </main>
      </div>
      <Footer variant="links" />
    </div>
  )
}
