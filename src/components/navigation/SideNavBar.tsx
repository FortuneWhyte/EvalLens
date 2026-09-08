import { Link, useLocation } from 'react-router-dom'
import { routes } from '../../routes'

type SideNavVariant = 'explorer' | 'ide'

const OPERATOR_AVATAR =
  'https://lh3.googleusercontent.com/aida-public/AB6AXuAMPUgyGwEM0JCAKwbMZe0ebate0qV2yWnxHZFmbpnal-pYo8neWuNkRpk2HqwajcNyygTMOapcuyZCsFyMTea3C_RsZP58ym3J2--lxMCIWlV-X5Kw0g4Rz7E-wY7sTlEFGATMWGuo4nAOdTTjbYDWJfjOlM9VjfnTvoRTQtDxg6qECbv6Iij30aGb4QsyTpORtuHKxToNjpejBpqcwNWRL62_TLofUKcj7a1_xuaouzxJ1IGg9h7R'

interface NavItem {
  label: string
  icon: string
  /** absent for the sections that have no design yet — those stay inert anchors */
  to?: string
}

/**
 * DASHBOARD is not in any mockup's sidebar; it is added so the Dashboard is
 * reachable from the other screens rather than only through the top bar.
 */
const navItems: NavItem[] = [
  { label: 'DASHBOARD', icon: 'dashboard', to: routes.dashboard },
  { label: 'TERMINAL', icon: 'terminal' },
  { label: 'PROMPT_IDE', icon: 'code', to: routes.promptIde },
  { label: 'DATASETS', icon: 'database', to: routes.datasets },
  { label: 'MODELS', icon: 'psychology' },
  { label: 'SETTINGS', icon: 'settings' },
]

/**
 * Shared app-shell sidebar. The Dataset Explorer and Prompt IDE mockups draw it
 * differently (operator avatar vs. terminal glyph, icon row vs. labelled links),
 * so each is reproduced as its own variant. The active item follows the route.
 *
 * `stretch` makes the sidebar fill its flex row instead of sizing to content,
 * which the Dashboard needs because its main column is much taller.
 */
export default function SideNavBar({
  variant,
  stretch = false,
}: {
  variant: SideNavVariant
  stretch?: boolean
}) {
  const { pathname } = useLocation()
  const height = stretch ? 'self-stretch' : 'h-full'

  return variant === 'explorer' ? (
    <ExplorerSideNav height={height} pathname={pathname} />
  ) : (
    <IdeSideNav height={height} pathname={pathname} />
  )
}

function ExplorerSideNav({ height, pathname }: { height: string; pathname: string }) {
  return (
    <aside
      className={`hidden md:flex flex-col ${height} bg-surface-container-low border-r border-outline-variant w-64 py-margin flex-shrink-0 z-40 relative`}
    >
      <div className="px-margin mb-8 flex items-center gap-4">
        <div className="w-12 h-12 border border-primary-fixed-dim bg-surface flex items-center justify-center relative overflow-hidden">
          <img
            alt="SYSTEM_OPERATOR"
            className="w-full h-full object-cover opacity-80"
            data-alt="A futuristic, low-resolution pixel art avatar of a cyberpunk system operator wearing glowing AR goggles in a dark room. Deep blacks, bright neon green accents. Minimalist."
            src={OPERATOR_AVATAR}
          />
          <div className="absolute inset-0 bg-primary-fixed-dim/10 mix-blend-overlay"></div>
        </div>
        <div>
          <div className="font-label-caps text-label-caps text-secondary-fixed neon-cyan mb-1">
            OPERATOR_01
          </div>
          <div className="font-code text-[10px] text-on-surface-variant flex items-center gap-1">
            <span className="status-blinker"></span> STATUS: ACTIVE
          </div>
        </div>
      </div>
      <nav className="flex flex-col flex-1 gap-1">
        {navItems.map((item) => {
          const active = item.to !== undefined && item.to === pathname
          const inner = active ? (
            <>
              <span
                className="material-symbols-outlined text-[20px] neon-green"
                style={{ fontVariationSettings: "'FILL' 1" }}
              >
                {item.icon}
              </span>
              <span className="font-label-caps text-label-caps neon-green">{item.label}</span>
            </>
          ) : (
            <>
              <span className="material-symbols-outlined text-[20px] group-hover:neon-cyan">
                {item.icon}
              </span>
              <span className="font-label-caps text-label-caps">{item.label}</span>
            </>
          )
          const className = active
            ? 'flex items-center gap-3 text-primary-fixed-dim border-l-4 border-primary-fixed-dim bg-primary-container/10 px-4 py-3 translate-x-1 duration-150'
            : 'flex items-center gap-3 text-on-surface-variant px-4 py-3 hover:bg-surface-variant/20 hover:text-secondary-container transition-colors group'

          return item.to ? (
            <Link className={className} key={item.label} to={item.to}>
              {inner}
            </Link>
          ) : (
            <a className={className} href="#" key={item.label}>
              {inner}
            </a>
          )
        })}
      </nav>
      <div className="mt-auto px-margin flex flex-col gap-4">
        <button className="cyber-button-secondary w-full py-2 font-label-caps text-label-caps">
          UPGRADE_PLAN
        </button>
        <div className="flex justify-between border-t border-outline-variant pt-4">
          <a
            className="text-on-surface-variant hover:text-secondary-container transition-colors"
            href="#"
            title="SUPPORT"
          >
            <span className="material-symbols-outlined">help</span>
          </a>
          <a
            className="text-on-surface-variant hover:text-secondary-container transition-colors"
            href="#"
            title="LOGOUT"
          >
            <span className="material-symbols-outlined">logout</span>
          </a>
        </div>
      </div>
    </aside>
  )
}

function IdeSideNav({ height, pathname }: { height: string; pathname: string }) {
  return (
    <aside
      className={`hidden md:flex flex-col ${height} w-64 bg-surface-container-low dark:bg-surface-container-low text-secondary-fixed dark:text-secondary-fixed font-label-caps text-label-caps border-r border-outline-variant z-40 py-margin`}
    >
      <div className="px-4 mb-8">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 bg-surface border border-secondary-fixed-dim flex items-center justify-center relative panel-brackets">
            <span
              className="material-symbols-outlined text-secondary-fixed-dim"
              style={{ fontVariationSettings: "'FILL' 1" }}
            >
              terminal
            </span>
          </div>
          <div>
            <div className="font-headline-md text-body-md text-on-surface">OPERATOR_01</div>
            <div className="font-label-caps text-label-caps text-secondary-fixed-dim opacity-70">
              STATUS: ACTIVE
            </div>
          </div>
        </div>
      </div>
      <nav className="flex-1 flex flex-col gap-1">
        {navItems.map((item) => {
          const active = item.to !== undefined && item.to === pathname
          const inner = (
            <>
              <span
                className={
                  active
                    ? 'material-symbols-outlined text-primary-fixed-dim'
                    : 'material-symbols-outlined group-hover:text-secondary-fixed-dim transition-colors'
                }
              >
                {item.icon}
              </span>
              {item.label}
            </>
          )
          const className = active
            ? 'text-primary-fixed-dim border-l-4 border-primary-fixed-dim bg-primary-container/10 px-4 py-3 translate-x-1 duration-150 flex items-center gap-3 group'
            : 'text-on-surface-variant px-4 py-3 hover:bg-surface-variant/20 hover:text-secondary-container transition-colors flex items-center gap-3 group'

          return item.to ? (
            <Link className={className} key={item.label} to={item.to}>
              {inner}
            </Link>
          ) : (
            <a className={className} href="#" key={item.label}>
              {inner}
            </a>
          )
        })}
      </nav>
      <div className="mt-auto px-4 flex flex-col gap-2">
        <button className="w-full border border-secondary-fixed text-secondary-fixed py-2 hover:bg-secondary-fixed/10 transition-colors uppercase text-label-caps font-label-caps mb-4">
          UPGRADE_PLAN
        </button>
        <a
          className="text-on-surface-variant py-2 hover:text-secondary-container transition-colors flex items-center gap-3 text-label-caps font-label-caps"
          href="#"
        >
          <span className="material-symbols-outlined text-sm">help</span>
          SUPPORT
        </a>
        <a
          className="text-on-surface-variant py-2 hover:text-secondary-container transition-colors flex items-center gap-3 text-label-caps font-label-caps"
          href="#"
        >
          <span className="material-symbols-outlined text-sm">logout</span>
          LOGOUT
        </a>
      </div>
    </aside>
  )
}
