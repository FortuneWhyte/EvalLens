/**
 * The app's navigation, defined once.
 *
 * The desktop top bar, the desktop sidebar and the mobile drawer all render
 * from these lists. Keeping them here is what stops the mobile menu from
 * quietly drifting out of step with the desktop navs as screens are added.
 */
import { routes } from '../../routes'

export interface NavItem {
  label: string
  /** absent for sections with no screen yet — those stay inert anchors */
  to?: string
  /** Material Symbols glyph; the top bar renders labels only, so it is optional */
  icon?: string
}

/** Top bar: the product-level sections. */
export const topNavItems: NavItem[] = [
  { label: 'DASHBOARD', to: routes.dashboard, icon: 'dashboard' },
  { label: 'EVALS', to: routes.evals, icon: 'science' },
  { label: 'LOGS', to: routes.logs, icon: 'receipt_long' },
  { label: 'DOCS', icon: 'menu_book' },
]

/**
 * Sidebar: the working areas.
 *
 * DASHBOARD appears in both navs on purpose. It is the only way back from a
 * screen whose sidebar is the only visible chrome.
 */
export const sideNavItems: NavItem[] = [
  { label: 'DASHBOARD', icon: 'dashboard', to: routes.dashboard },
  { label: 'TERMINAL', icon: 'terminal', to: routes.terminal },
  { label: 'PROMPT_IDE', icon: 'code', to: routes.promptIde },
  { label: 'DATASETS', icon: 'database', to: routes.datasets },
  { label: 'MODELS', icon: 'psychology', to: routes.models },
  { label: 'SETTINGS', icon: 'settings', to: routes.settings },
]

/**
 * Everything reachable, in one list, with duplicates removed.
 *
 * The mobile drawer replaces both navs at once, so it shows the union rather
 * than making someone guess which of two hidden menus a screen lives in.
 */
export const allNavItems: NavItem[] = [
  ...sideNavItems,
  ...topNavItems.filter(
    (item) => !sideNavItems.some((existing) => existing.label === item.label),
  ),
]
