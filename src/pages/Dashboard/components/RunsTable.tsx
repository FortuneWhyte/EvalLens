import PanelBrackets from '../../../components/ui/PanelBrackets'
import { evaluationRuns, type EvaluationRun, type RunStatus } from '../../../data/dashboard'

const statusStyles: Record<RunStatus, { cell: string; row: string }> = {
  DONE: {
    cell: 'text-primary-fixed-dim drop-shadow-[0_0_5px_rgba(0,230,57,0.5)]',
    row: 'hover:text-primary-fixed',
  },
  RUNNING: { cell: 'text-secondary-container pulse-cyan inline-block', row: 'hover:text-secondary-container' },
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

function Row({ run }: { run: EvaluationRun }) {
  const status = statusStyles[run.status]
  const dimAll = run.dim === 'all' ? 'text-on-surface-variant' : ''
  const dimMetrics = run.dim === 'none' ? '' : 'text-on-surface-variant'

  return (
    <tr
      className={`border-b border-surface-container-highest hover:bg-surface-variant/20 ${status.row} transition-colors group cursor-pointer`}
    >
      <td className={`py-3 px-4 ${dimAll}`}>{run.id}</td>
      <td className={`py-3 px-4 ${dimAll}`}>{run.model}</td>
      <td className={`py-3 px-4 ${dimAll}`}>{run.promptVer}</td>
      <td className="py-3 px-4">
        <span className={status.cell}>[{run.status}]</span>
      </td>
      <td className={`py-3 px-4 ${dimMetrics}`}>{run.relevance}</td>
      <td className={`py-3 px-4 ${dimMetrics}`}>{run.faithfulness}</td>
      <td className={`py-3 px-4 ${dimAll}`}>{run.latency}</td>
      <td className={`py-3 px-4 text-right ${dimAll}`}>{run.cost}</td>
    </tr>
  )
}

export default function RunsTable() {
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
            {evaluationRuns.map((run) => (
              <Row key={run.id} run={run} />
            ))}
          </tbody>
        </table>
      </div>
    </section>
  )
}
