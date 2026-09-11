import PanelBrackets from '../../../components/ui/PanelBrackets'
import type { RunStatus, RunSummary } from '../../../types/api'

const statusStyles: Record<RunStatus, { cell: string; row: string }> = {
  DONE: {
    cell: 'text-primary-fixed-dim drop-shadow-[0_0_5px_rgba(0,230,57,0.5)]',
    row: 'hover:text-primary-fixed',
  },
  RUNNING: {
    cell: 'text-secondary-container pulse-cyan inline-block',
    row: 'hover:text-secondary-container',
  },
  QUEUED: { cell: 'text-on-surface-variant', row: 'hover:text-primary-fixed' },
  FAILED: {
    cell: 'text-error drop-shadow-[0_0_5px_rgba(255,180,171,0.5)]',
    row: 'hover:text-error',
  },
}

const columns = [
  'RUN_ID',
  'MODEL',
  'PROMPT_VER',
  'STATUS',
  'RELEVANCE',
  'FAITHFULNESS',
  'LATENCY_MS',
  'COST',
]

function percent(value: number | null): string {
  return value === null ? '--' : `${Math.round(value * 100)}%`
}

function Row({ run }: { run: RunSummary }) {
  const status = statusStyles[run.status]
  // A run with no scores yet has nothing to dim selectively, so the whole row
  // goes muted - matching how the design treated a QUEUED run.
  const dim = run.status === 'QUEUED' ? 'text-on-surface-variant' : ''
  const dimMetrics = run.avg_relevance === null ? 'text-on-surface-variant' : ''

  return (
    <tr
      className={`border-b border-surface-container-highest hover:bg-surface-variant/20 ${status.row} transition-colors group cursor-pointer`}
    >
      <td className={`py-3 px-4 ${dim}`}>{run.public_id}</td>
      <td className={`py-3 px-4 ${dim}`}>{run.candidate_model}</td>
      <td className={`py-3 px-4 ${dim}`}>{run.dataset}</td>
      <td className="py-3 px-4">
        <span className={status.cell}>[{run.status}]</span>
      </td>
      <td className={`py-3 px-4 ${dimMetrics}`}>{percent(run.avg_relevance)}</td>
      <td className={`py-3 px-4 ${dimMetrics}`}>{percent(run.avg_faithfulness)}</td>
      <td className={`py-3 px-4 ${dim}`}>{run.p50_latency_ms ?? '--'}</td>
      <td className={`py-3 px-4 text-right ${dim}`}>${run.total_cost_usd.toFixed(4)}</td>
    </tr>
  )
}

export default function RunsTable({ runs }: { runs: RunSummary[] }) {
  return (
    <section className="relative bg-surface-container-low border border-outline-variant p-6 shadow-[0_0_15px_rgba(0,0,0,0.5)]">
      <PanelBrackets color="bg-outline-variant" />
      <h2
        className="font-headline-md text-headline-md text-on-surface mb-6 glitch-text"
        data-text="// EVALUATION_RUNS"
      >
        // EVALUATION_RUNS
      </h2>
      <div className="overflow-x-auto">
        <table className="w-full text-left border-collapse font-code text-code">
          <thead>
            <tr className="border-b border-outline-variant text-on-surface-variant font-label-caps text-label-caps">
              {columns.map((column) => (
                <th
                  className={`py-2 px-4 font-normal ${column === 'COST' ? 'text-right' : ''}`}
                  key={column}
                >
                  {column}
                </th>
              ))}
            </tr>
          </thead>
          <tbody>
            {runs.map((run) => (
              <Row key={run.public_id} run={run} />
            ))}
          </tbody>
        </table>
      </div>
    </section>
  )
}
