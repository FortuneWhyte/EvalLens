import Footer from '../../components/ui/Footer'
import ScanlineOverlay from '../../components/ui/ScanlineOverlay'
import SideNavBar from '../../components/navigation/SideNavBar'
import TopNavBar from '../../components/navigation/TopNavBar'
import { EmptyPanel, ErrorPanel, LoadingPanel } from '../../components/ui/QueryState'
import { buildModelEntries, buildProviderSummary } from '../../data/models'
import { useCost, useProviders } from '../../hooks/useEvalLensQueries'
import ModelCard from './components/ModelCard'

/**
 * MODELS has no mockup. It is the registry behind every run: which providers
 * are configured, which model plays candidate and which plays judge, and what
 * each costs per million tokens.
 */
export default function Models() {
  const providersQuery = useProviders()
  const costQuery = useCost()

  const entries = buildModelEntries(providersQuery.data)
  const summary = buildProviderSummary(
    providersQuery.data,
    entries,
    costQuery.data?.total_spend_usd ?? 0,
  )

  return (
    <div className="page-datasets bg-background text-on-surface grid-bg min-h-screen flex flex-col antialiased selection:bg-primary-fixed-dim selection:text-surface">
      <ScanlineOverlay />
      <TopNavBar variant="explorer" />
      <div className="flex flex-1 overflow-hidden relative">
        <SideNavBar variant="explorer" />
        <main className="flex-1 flex flex-col h-full overflow-y-auto p-gutter md:p-margin relative pb-16">
          {/* Header Section */}
          <div className="flex flex-col md:flex-row justify-between items-start md:items-end mb-6 gap-4 border-b border-outline-variant pb-4">
            <div>
              <h1 className="font-headline-lg text-headline-lg text-primary-fixed-dim mb-2 neon-green">
                // MODEL_REGISTRY
              </h1>
              <div className="cyber-input-wrapper w-full md:w-96 mt-4">
                <input
                  className="cyber-input font-code text-code"
                  placeholder="FIND_MODEL..."
                  type="text"
                />
              </div>
            </div>
            <button className="cyber-button px-6 py-3 font-label-caps text-label-caps flex items-center gap-2">
              <span className="material-symbols-outlined text-[18px]">add</span>[ +_ADD_PROVIDER ]
            </button>
          </div>
          {providersQuery.isLoading ? (
            <LoadingPanel label="QUERYING_PROVIDERS" />
          ) : providersQuery.isError ? (
            <ErrorPanel error={providersQuery.error} onRetry={() => providersQuery.refetch()} />
          ) : (
            <>
          {/* Summary Row */}
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-6">
            {summary.map((stat) => (
              <div
                className="border border-outline-variant p-3 bg-surface-container-low"
                key={stat.label}
              >
                <div className="font-label-caps text-[10px] text-on-surface-variant mb-1">
                  {stat.label}
                </div>
                <div className={`font-display text-[24px] ${stat.valueClasses}`}>{stat.value}</div>
              </div>
            ))}
          </div>
          {/* Registry Grid */}
          {entries.length === 0 ? (
            <EmptyPanel message="No providers reported by the API." />
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-4">
              {entries.map((model) => (
                <ModelCard key={model.id} model={model} />
              ))}
            </div>
          )}
            </>
          )}
        </main>
      </div>
      <Footer variant="links" />
    </div>
  )
}
