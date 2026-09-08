import { Link, useLocation } from 'react-router-dom'
import { routes } from '../../routes'

type TopNavVariant = 'dashboard' | 'explorer' | 'ide'

interface TopNavItem {
  label: string
  /** absent for sections with no screen yet — those stay inert anchors */
  to?: string
}

const topNavItems: TopNavItem[] = [
  { label: 'DASHBOARD', to: routes.dashboard },
  { label: 'EVALS', to: routes.evals },
  { label: 'LOGS', to: routes.logs },
  { label: 'DOCS' },
]

/**
 * Per-variant link styling. The mockups differ slightly: the Dashboard's links
 * carry the font size utility twice, and the Prompt IDE's are uppercased and
 * scale on the active item.
 */
const linkStyles: Record<TopNavVariant, { active: string; inactive: string }> = {
  dashboard: {
    active:
      'text-primary-fixed-dim border-b-2 border-primary-fixed-dim pb-1 font-label-caps text-label-caps',
    inactive:
      'text-on-surface-variant font-label-caps hover:text-primary-fixed hover:drop-shadow-[0_0_5px_rgba(114,255,112,0.5)] transition-all font-label-caps text-label-caps',
  },
  explorer: {
    active: 'text-primary-fixed-dim border-b-2 border-primary-fixed-dim pb-1 font-label-caps',
    inactive:
      'text-on-surface-variant font-label-caps hover:text-primary-fixed hover:drop-shadow-[0_0_5px_rgba(114,255,112,0.5)] transition-all',
  },
  ide: {
    active:
      'text-primary-fixed-dim border-b-2 border-primary-fixed-dim pb-1 opacity-80 scale-95 transition-transform uppercase',
    inactive:
      'text-on-surface-variant font-label-caps hover:text-primary-fixed hover:drop-shadow-[0_0_5px_rgba(114,255,112,0.5)] transition-all uppercase',
  },
}

function TopNavLinks({ variant }: { variant: TopNavVariant }) {
  const { pathname } = useLocation()
  const styles = linkStyles[variant]

  return (
    <>
      {topNavItems.map((item) => {
        const className = item.to === pathname ? styles.active : styles.inactive
        return item.to ? (
          <Link className={className} key={item.label} to={item.to}>
            {item.label}
          </Link>
        ) : (
          <a className={className} href="#" key={item.label}>
            {item.label}
          </a>
        )
      })}
    </>
  )
}

/**
 * Shared top bar. Each mockup ships a slightly different header — the
 * Dashboard glitches its wordmark and shows a system indicator, the Dataset
 * Explorer carries a search field, and the Prompt IDE centres its nav — so the
 * variants below reproduce each one exactly.
 */
export default function TopNavBar({ variant }: { variant: TopNavVariant }) {
  if (variant === 'dashboard') return <DashboardTopNav />
  if (variant === 'explorer') return <ExplorerTopNav />
  return <IdeTopNav />
}

function DashboardTopNav() {
  return (
    <header className="bg-surface border-b border-outline-variant bg-surface-container-lowest shadow-[0_0_10px_rgba(0,230,57,0.2)] flex justify-between items-center px-margin py-4 w-full docked full-width top-0 z-30 relative">
      <div className="flex items-center gap-8">
        <h1
          className="font-display text-headline-md text-primary-fixed-dim drop-shadow-[0_0_8px_rgba(0,230,57,0.8)] glitch-text"
          data-text="> EvalLens"
        >
          &gt; EvalLens<span className="blinking-cursor">_</span>
        </h1>
        <nav className="hidden md:flex gap-6">
          <TopNavLinks variant="dashboard" />
        </nav>
      </div>
      <div className="flex items-center gap-4">
        <div className="hidden md:flex items-center gap-2 text-primary-fixed-dim font-code text-code">
          <span className="w-2 h-2 bg-primary-fixed-dim block pulse-cyan"></span>
          SYSTEM ONLINE
        </div>
        <button className="border border-primary-fixed-dim text-primary-fixed-dim px-4 py-2 font-label-caps text-label-caps hover:bg-primary-fixed-dim/10 hover:drop-shadow-[0_0_8px_rgba(0,230,57,0.6)] transition-all uppercase">
          [ RUN_EVAL ]
        </button>
      </div>
    </header>
  )
}

function ExplorerTopNav() {
  return (
    <header className="bg-surface border-b border-outline-variant bg-surface-container-lowest shadow-[0_0_10px_rgba(0,230,57,0.2)] flex justify-between items-center px-margin py-4 w-full z-50 sticky top-0">
      <div className="flex items-center gap-8">
        <div className="font-display text-headline-md text-primary-fixed-dim drop-shadow-[0_0_8px_rgba(0,230,57,0.8)]">
          &gt; EvalLens
        </div>
        <nav className="hidden md:flex gap-6 items-center">
          <TopNavLinks variant="explorer" />
        </nav>
      </div>
      <div className="flex items-center gap-4">
        {/* Search bar 'on_right' */}
        <div className="hidden md:block cyber-input-wrapper w-48">
          <input className="cyber-input font-code text-code" placeholder="SEARCH..." type="text" />
        </div>
        <button className="font-label-caps text-label-caps cyber-button px-4 py-2 hover:opacity-80 active:scale-95 transition-transform">
          [ RUN_EVAL ]
        </button>
      </div>
    </header>
  )
}

function IdeTopNav() {
  return (
    <header className="flex justify-between items-center px-margin py-4 w-full bg-surface dark:bg-surface text-surface-tint dark:text-surface-tint font-headline-md text-headline-md border-b border-outline-variant bg-surface-container-lowest shadow-[0_0_10px_rgba(0,230,57,0.2)] z-50">
      <div className="flex items-center gap-4">
        <span
          className="font-display text-headline-md text-primary-fixed-dim drop-shadow-[0_0_8px_rgba(0,230,57,0.8)] glitch"
          data-text="> EvalLens"
        >
          &gt; EvalLens
        </span>
      </div>
      <nav className="hidden md:flex gap-6 items-center">
        <TopNavLinks variant="ide" />
      </nav>
      <div className="flex items-center gap-4">
        <button className="border border-primary-fixed-dim text-primary-fixed-dim px-4 py-1 hover:bg-primary-fixed-dim/10 hover:shadow-[0_0_8px_rgba(0,230,57,0.6)] font-label-caps text-label-caps uppercase transition-all">
          [ RUN_EVAL ]
        </button>
      </div>
    </header>
  )
}
