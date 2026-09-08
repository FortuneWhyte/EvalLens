import { useMemo, useState } from 'react'
import Footer from '../../components/ui/Footer'
import ScanlineOverlay from '../../components/ui/ScanlineOverlay'
import SideNavBar from '../../components/navigation/SideNavBar'
import TopNavBar from '../../components/navigation/TopNavBar'
import { logEntries, logLevelFilters, logStats, type LogLevel } from '../../data/logs'
import LogStream from './components/LogStream'

/**
 * LOGS has no mockup. It reuses the app shell and the terminal panel language,
 * with the level filter and search wired up since a log viewer that cannot be
 * filtered is not much of a log viewer.
 */
export default function Logs() {
  const [level, setLevel] = useState<LogLevel | 'ALL'>('ALL')
  const [query, setQuery] = useState('')

  const visible = useMemo(() => {
    const needle = query.trim().toLowerCase()
    return logEntries.filter((entry) => {
      const levelMatches = level === 'ALL' || entry.level === level
      const queryMatches =
        needle === '' ||
        entry.message.toLowerCase().includes(needle) ||
        entry.source.toLowerCase().includes(needle)
      return levelMatches && queryMatches
    })
  }, [level, query])

  return (
    <div className="page-datasets bg-background text-on-surface grid-bg min-h-screen flex flex-col antialiased selection:bg-primary-fixed-dim selection:text-surface">
      <ScanlineOverlay />
      <TopNavBar variant="explorer" />
      <div className="flex flex-1 overflow-hidden relative">
        <SideNavBar variant="explorer" />
        <main className="flex-1 flex flex-col h-full overflow-hidden p-gutter md:p-margin relative">
          {/* Header Section */}
          <div className="flex flex-col md:flex-row justify-between items-start md:items-end mb-6 gap-4 border-b border-outline-variant pb-4">
            <div>
              <h1 className="font-headline-lg text-headline-lg text-primary-fixed-dim mb-2 neon-green">
                // SYSTEM_LOGS
              </h1>
              <div className="cyber-input-wrapper w-full md:w-96 mt-4">
                <input
                  className="cyber-input font-code text-code"
                  onChange={(event) => setQuery(event.target.value)}
                  placeholder="FILTER_LOGS..."
                  type="text"
                  value={query}
                />
              </div>
            </div>
            <div className="flex flex-wrap gap-2">
              {logLevelFilters.map((filter) => (
                <button
                  className={`px-3 py-2 font-label-caps text-[10px] border transition-colors ${
                    level === filter
                      ? 'border-primary-fixed-dim text-primary-fixed-dim bg-primary-container/10'
                      : 'border-outline-variant text-on-surface-variant hover:text-primary-fixed hover:border-primary-fixed-dim'
                  }`}
                  key={filter}
                  onClick={() => setLevel(filter)}
                >
                  {filter}
                </button>
              ))}
            </div>
          </div>
          {/* Stats Row */}
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-6">
            {logStats.map((stat) => (
              <div className="border border-outline-variant p-3 bg-surface-container-low" key={stat.label}>
                <div className="font-label-caps text-[10px] text-on-surface-variant mb-1">
                  {stat.label}
                </div>
                <div className={`font-display text-[24px] ${stat.valueClasses}`}>
                  {stat.value}
                  {stat.unit && <span className="text-[12px]">{stat.unit}</span>}
                </div>
              </div>
            ))}
          </div>
          {/* Log Stream */}
          <div className="flex-1 flex flex-col cyber-panel relative overflow-hidden min-h-0">
            <div className="absolute -top-[10px] right-4 bg-surface px-2 border border-outline-variant text-[10px] text-on-surface-variant font-code tracking-widest">
              TAIL -F
            </div>
            <div className="p-4 border-b border-outline-variant bg-surface-container-high/50 flex justify-between items-center">
              <h2 className="font-headline-md text-[16px] text-primary-fixed-dim neon-green m-0">
                // STREAM :: [{visible.length} LINES]
              </h2>
              <button className="cyber-button-secondary px-3 py-1 font-label-caps text-[10px]">
                [ PAUSE ]
              </button>
            </div>
            <LogStream entries={visible} />
          </div>
        </main>
      </div>
      <Footer variant="links" />
    </div>
  )
}
