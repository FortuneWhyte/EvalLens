import Footer from '../../components/ui/Footer'
import ScanlineOverlay from '../../components/ui/ScanlineOverlay'
import SideNavBar from '../../components/navigation/SideNavBar'
import TopNavBar from '../../components/navigation/TopNavBar'
import { dashboardStats } from '../../data/dashboard'
import RunsTable from './components/RunsTable'
import ScoresChart from './components/ScoresChart'
import StatCard from './components/StatCard'

export default function Dashboard() {
  return (
    <div className="page-dashboard text-on-surface font-body-md crt-flicker min-h-screen flex flex-col relative pb-8">
      <ScanlineOverlay />
      <TopNavBar variant="dashboard" />
      <div className="flex flex-1 relative">
        <SideNavBar stretch variant="explorer" />
        <main className="flex-grow p-margin max-w-container-max mx-auto w-full flex flex-col gap-8 relative z-10 mt-4">
          {/* Row 1: Stats */}
          <section className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
            {dashboardStats.map((stat) => (
              <StatCard key={stat.label} stat={stat} />
            ))}
          </section>
          {/* Row 2: Chart */}
          <ScoresChart />
          {/* Row 3: Data Table */}
          <RunsTable />
        </main>
      </div>
      <Footer variant="ticker" />
    </div>
  )
}
