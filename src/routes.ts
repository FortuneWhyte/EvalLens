/**
 * Route paths, kept apart from router.tsx: the shared nav components read these
 * at module scope, and importing them from the router would form a cycle
 * (router -> pages -> nav -> router).
 */
export const routes = {
  dashboard: '/',
  datasets: '/datasets',
  promptIde: '/prompt-ide',
} as const
