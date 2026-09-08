import { evalRuns, type EvalRunStatus, type EvalRunSummary } from '../../../data/evals'

const statusBadges: Record<EvalRunStatus, { classes: string; indicator: 'blinker' | 'blinker-cyan' | 'none' }> = {
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

function EvalRunCard({ run }: { run: EvalRunSummary }) {
  const badge = statusBadges[run.status]

  return (
    <div
      className={`cyber-panel p-4 cursor-pointer relative ${
        run.selected
          ? 'border-primary-fixed-dim bg-primary-container/5 shadow-[0_0_10px_rgba(0,230,57,0.1)]'
          : 'opacity-80 hover:opacity-100'
      }`}
    >
      {run.selected && (
        <div className="absolute -top-[10px] left-4 bg-surface px-2 border border-primary-fixed-dim text-[10px] text-primary-fixed-dim font-code tracking-widest">
          SELECTED
        </div>
      )}
      <div className="flex justify-between items-start mb-2">
        <h3
          className={`font-headline-md text-[16px] truncate ${
            run.selected ? 'text-primary-fixed-dim' : 'text-secondary-fixed'
          }`}
        >
          {run.id}
        </h3>
        <div
          className={`font-label-caps text-[10px] border px-2 py-1 flex items-center gap-1 ${badge.classes}`}
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
        <p className="opacity-50 mt-1">{run.model}</p>
        <div className="flex justify-between mt-2 opacity-50">
          <span>{run.started}</span>
          <span>{run.samples}</span>
        </div>
      </div>
    </div>
  )
}

export default function EvalRunList() {
  return (
    <div className="lg:col-span-4 xl:col-span-3 flex flex-col gap-4 overflow-y-auto pr-2 pb-8">
      {evalRuns.map((run) => (
        <EvalRunCard key={run.id} run={run} />
      ))}
    </div>
  )
}
