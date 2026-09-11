import Footer from '../../components/ui/Footer'
import ScanlineOverlay from '../../components/ui/ScanlineOverlay'
import SideNavBar from '../../components/navigation/SideNavBar'
import TopNavBar from '../../components/navigation/TopNavBar'
import { EmptyPanel, ErrorPanel, LoadingPanel } from '../../components/ui/QueryState'
import { buildDashboardStats } from '../../data/dashboard'
import { useCost, useRuns } from '../../hooks/useEvalLensQueries'
import RunsTable from './components/RunsTable'
import ScoresChart from './components/ScoresChart'
import StatCard from './components/StatCard'

export default function Dashboard() {
  const runsQuery = useRuns()
  const costQuery = useCost()

  const runs = runsQuery.data ?? []
  const stats = buildDashboardStats(runs, costQuery.data)

  return (
    <div className="page-dashboard text-on-surface font-body-md crt-flicker min-h-screen flex flex-col relative pb-8">
      <ScanlineOverlay />
      <TopNavBar variant="dashboard" />
      <div className="flex flex-1 relative">
        <SideNavBar stretch variant="explorer" />
        <main className="flex-grow p-margin max-w-container-max mx-auto w-full flex flex-col gap-8 relative z-10 mt-4">
          {runsQuery.isLoading ? (
            <LoadingPanel label="FETCHING_RUNS" />
          ) : runsQuery.isError ? (
            <ErrorPanel error={runsQuery.error} onRetry={() => runsQuery.refetch()} />
          ) : (
            <>
              <section className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
                {stats.map((stat) => (
                  <StatCard key={stat.label} stat={stat} />
                ))}
              </section>
              <ScoresChart runs={runs} />
              {runs.length === 0 ? (
                <EmptyPanel message="No runs recorded yet. Queue one from the EVALS screen, or POST to /api/runs." />
              ) : (
                <RunsTable runs={runs} />
              )}
            </>
          )}
        </main>
      </div>
      <Footer variant="ticker" />
    </div>
  )
}
