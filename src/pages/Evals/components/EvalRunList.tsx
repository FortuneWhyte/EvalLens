import type { RunStatus, RunSummary } from '../../../types/api'

const statusBadges: Record<
  RunStatus,
  { classes: string; indicator: 'blinker' | 'blinker-cyan' | 'none' }
> = {
  DONE: {
    classes: 'text-primary-fixed-dim border-primary-fixed-dim bg-primary-container/10',
    indicator: 'blinker',
  },
  RUNNING: {
    classes: 'text-secondary-fixed border-secondary-fixed bg-secondary-container/10',
    indicator: 'blinker-cyan',
  },
  QUEUED: {
    classes: 'text-on-surface-variant border-outline-variant bg-surface-variant/10',
    indicator: 'none',
  },
  FAILED: {
    classes: 'text-error border-error bg-error-container/10',
    indicator: 'none',
  },
}

/** Times arrive as UTC ISO strings; show them in the viewer's own zone. */
function formatStarted(iso: string): string {
  const date = new Date(iso.endsWith('Z') ? iso : `${iso}Z`)
  if (Number.isNaN(date.getTime())) return '--'
  return date.toLocaleString(undefined, {
    year: 'numeric',
    month: '2-digit',
    day: '2-digit',
    hour: '2-digit',
    minute: '2-digit',
  })
}

function EvalRunCard({
  run,
  selected,
  onSelect,
}: {
  run: RunSummary
  selected: boolean
  onSelect: (publicId: string) => void
}) {
  const badge = statusBadges[run.status]

  return (
    <button
      className={`cyber-panel p-4 cursor-pointer relative text-left w-full ${
        selected
          ? 'border-primary-fixed-dim bg-primary-container/5 shadow-[0_0_10px_rgba(0,230,57,0.1)]'
          : 'opacity-80 hover:opacity-100'
      }`}
      onClick={() => onSelect(run.public_id)}
    >
      {selected && (
        <div className="absolute -top-[10px] left-4 bg-surface px-2 border border-primary-fixed-dim text-[10px] text-primary-fixed-dim font-code tracking-widest">
          SELECTED
        </div>
      )}
      <div className="flex justify-between items-start mb-2 gap-2">
        <h3
          className={`font-headline-md text-[16px] truncate ${
            selected ? 'text-primary-fixed-dim' : 'text-secondary-fixed'
          }`}
        >
          {run.public_id}
        </h3>
        <div
          className={`font-label-caps text-[10px] border px-2 py-1 flex items-center gap-1 shrink-0 ${badge.classes}`}
        >
          {badge.indicator !== 'none' && (
            <span
              className={`status-blinker w-2 h-2 ${
                badge.indicator === 'blinker-cyan' ? 'status-blinker-cyan' : ''
              }`}
            ></span>
          )}
          {run.status}
        </div>
      </div>
      <div className="font-code text-code text-on-surface-variant">
        <p className="truncate">{run.dataset}</p>
        <p className="opacity-50 mt-1 truncate">{run.candidate_model}</p>
        <div className="flex justify-between mt-2 opacity-50 gap-2">
          <span className="truncate">{formatStarted(run.created_at)}</span>
          <span className="shrink-0">
            {run.completed_samples}/{run.total_samples}
          </span>
        </div>
      </div>
    </button>
  )
}

export default function EvalRunList({
  runs,
  selectedId,
  onSelect,
}: {
  runs: RunSummary[]
  selectedId: string | null
  onSelect: (publicId: string) => void
}) {
  return (
    <div className="lg:col-span-4 xl:col-span-3 flex flex-col gap-4 overflow-y-auto pr-2 pb-8">
      {runs.map((run) => (
        <EvalRunCard
          key={run.public_id}
          onSelect={onSelect}
          run={run}
          selected={run.public_id === selectedId}
        />
      ))}
    </div>
  )
}
