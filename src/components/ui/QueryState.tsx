import type { ReactNode } from 'react'
import { ApiError } from '../../lib/api'

/**
 * Loading, error and empty states drawn in the app's own language rather than
 * a bare spinner. The error case matters most: when the backend is not running
 * every screen would otherwise render blank with no explanation.
 */
export function LoadingPanel({ label = 'LOADING' }: { label?: string }) {
  return (
    <div className="flex items-center gap-3 p-6 font-code text-code text-on-surface-variant">
      <span className="status-blinker status-blinker-cyan w-2 h-2"></span>
      <span className="animate-pulse">_ {label}...</span>
    </div>
  )
}

export function ErrorPanel({ error, onRetry }: { error: unknown; onRetry?: () => void }) {
  const status = error instanceof ApiError ? error.status : undefined
  const message = error instanceof Error ? error.message : 'Unknown error'
  // 0 is the client's marker for a request that never reached a server; 502-504
  // are what a proxy returns when the API behind it is down. Both mean the same
  // thing to the person reading this: start the backend.
  const offline = status === 0 || status === 502 || status === 503 || status === 504

  return (
    <div className="border border-error bg-error-container/10 p-6 flex flex-col gap-3">
      <div className="flex items-center gap-2 font-label-caps text-label-caps text-error">
        <span className="material-symbols-outlined text-[16px]">error</span>
        {offline ? 'API_UNREACHABLE' : `REQUEST_FAILED${status ? ` :: ${status}` : ''}`}
      </div>
      <p className="font-code text-[12px] text-on-surface-variant leading-relaxed">{message}</p>
      {offline && (
        <pre className="font-code text-[11px] text-on-surface-variant/70 bg-surface-container-lowest border border-outline-variant p-3 overflow-x-auto">
{`cd backend
.venv/bin/uvicorn app.main:app --reload`}
        </pre>
      )}
      {onRetry && (
        <button
          className="cyber-button-secondary px-4 py-2 font-label-caps text-[10px] self-start"
          onClick={onRetry}
        >
          [ RETRY ]
        </button>
      )}
    </div>
  )
}

export function EmptyPanel({ message, children }: { message: string; children?: ReactNode }) {
  return (
    <div className="border border-outline-variant border-dashed p-6 flex flex-col gap-3 items-start">
      <p className="font-code text-code text-on-surface-variant">{message}</p>
      {children}
    </div>
  )
}
