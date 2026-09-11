import { useEffect, useState } from 'react'
import Footer from '../../components/ui/Footer'
import ScanlineOverlay from '../../components/ui/ScanlineOverlay'
import SideNavBar from '../../components/navigation/SideNavBar'
import TopNavBar from '../../components/navigation/TopNavBar'
import { EmptyPanel, ErrorPanel, LoadingPanel } from '../../components/ui/QueryState'
import { useDatasets, useRuns } from '../../hooks/useEvalLensQueries'
import DatasetDetails from './components/DatasetDetails'
import DatasetList from './components/DatasetList'
import TagManagerModal from './components/TagManagerModal'

export default function Datasets() {
  const datasetsQuery = useDatasets()
  const runsQuery = useRuns()
  const [selectedName, setSelectedName] = useState<string | null>(null)
  const [query, setQuery] = useState('')
  const [tagging, setTagging] = useState<{ id: string; tags: string[] } | null>(null)

  const datasets = datasetsQuery.data ?? []
  const visible = datasets.filter((dataset) =>
    dataset.name.toLowerCase().includes(query.trim().toLowerCase()),
  )

  useEffect(() => {
    if (visible.length === 0) {
      if (selectedName !== null) setSelectedName(null)
      return
    }
    if (!visible.some((dataset) => dataset.name === selectedName)) {
      setSelectedName(visible[0].name)
    }
  }, [visible, selectedName])

  const selected = visible.find((dataset) => dataset.name === selectedName) ?? null
  const runsForSelected = (runsQuery.data ?? []).filter(
    (run) => run.dataset === selected?.name,
  )

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
                // DATASET_EXPLORER
              </h1>
              <div className="cyber-input-wrapper w-full md:w-96 mt-4">
                <input
                  className="cyber-input font-code text-code"
                  onChange={(event) => setQuery(event.target.value)}
                  placeholder="FIND_DATASET..."
                  type="text"
                  value={query}
                />
              </div>
            </div>
            <button className="cyber-button px-6 py-3 font-label-caps text-label-caps flex items-center gap-2">
              <span className="material-symbols-outlined text-[18px]">add</span>[ +_ADD_SOURCE ]
            </button>
          </div>

          {datasetsQuery.isLoading ? (
            <LoadingPanel label="FETCHING_DATASETS" />
          ) : datasetsQuery.isError ? (
            <ErrorPanel error={datasetsQuery.error} onRetry={() => datasetsQuery.refetch()} />
          ) : visible.length === 0 ? (
            <EmptyPanel
              message={
                datasets.length === 0
                  ? 'No datasets loaded. Run `python seed.py` in backend/ to load the samples.'
                  : `No dataset matches "${query}".`
              }
            />
          ) : (
            <div className="flex-1 grid grid-cols-1 lg:grid-cols-12 gap-gutter lg:gap-margin min-h-0">
              <DatasetList
                datasets={visible}
                onSelect={setSelectedName}
                selectedName={selectedName}
              />
              {selected && (
                <DatasetDetails
                  dataset={selected}
                  onEditTags={(id, tags) => setTagging({ id, tags })}
                  runs={runsForSelected}
                />
              )}
            </div>
          )}
        </main>
      </div>
      {tagging && (
        <TagManagerModal
          onClose={() => setTagging(null)}
          rowId={tagging.id}
          tags={tagging.tags}
        />
      )}
      <Footer variant="links" />
    </div>
  )
}
