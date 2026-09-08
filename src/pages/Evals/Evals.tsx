import Footer from '../../components/ui/Footer'
import ScanlineOverlay from '../../components/ui/ScanlineOverlay'
import SideNavBar from '../../components/navigation/SideNavBar'
import TopNavBar from '../../components/navigation/TopNavBar'
import EvalRunList from './components/EvalRunList'
import RunDetails from './components/RunDetails'

/**
 * EVALS has no mockup. It reuses the Dataset Explorer's shell and panel
 * language so it reads as the same product: list on the left, detail on the
 * right, terminal-style table in the detail pane.
 */
export default function Evals() {
  return (
    <div className="page-datasets bg-background text-on-surface grid-bg min-h-screen flex flex-col antialiased selection:bg-primary-fixed-dim selection:text-surface">
      <ScanlineOverlay />
      <TopNavBar variant="explorer" />
      <div className="flex flex-1 overflow-hidden relative">
        <SideNavBar variant="explorer" />
        <main className="flex-1 flex flex-col h-full overflow-hidden p-gutter md:p-margin relative">
          {/* Header Section */}
          <div className="flex flex-col md:flex-row justify-between items-start md:items-end mb-8 gap-4 border-b border-outline-variant pb-4">
            <div>
              <h1 className="font-headline-lg text-headline-lg text-primary-fixed-dim mb-2 neon-green">
                // EVAL_RUNS
              </h1>
              <div className="cyber-input-wrapper w-full md:w-96 mt-4">
                <input
                  className="cyber-input font-code text-code"
                  placeholder="FIND_RUN..."
                  type="text"
                />
              </div>
            </div>
            <button className="cyber-button px-6 py-3 font-label-caps text-label-caps flex items-center gap-2">
              <span className="material-symbols-outlined text-[18px]">play_arrow</span>[ +_NEW_RUN ]
            </button>
          </div>
          {/* Two-Column Grid */}
          <div className="flex-1 grid grid-cols-1 lg:grid-cols-12 gap-gutter lg:gap-margin min-h-0">
            <EvalRunList />
            <RunDetails />
          </div>
        </main>
      </div>
      <Footer variant="links" />
    </div>
  )
}
