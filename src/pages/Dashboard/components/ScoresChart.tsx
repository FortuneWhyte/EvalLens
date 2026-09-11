import PanelBrackets from '../../../components/ui/PanelBrackets'
import type { RunSummary } from '../../../types/api'

/**
 * Relevance over time, drawn from the run history.
 *
 * Runs arrive newest first, so they are reversed to put time left to right.
 * The y axis is fixed to 0..1 rather than scaled to the data: an auto-scaled
 * axis makes a move from 0.90 to 0.91 look like a cliff, which is exactly the
 * kind of false signal this project exists to avoid.
 */
export default function ScoresChart({ runs }: { runs: RunSummary[] }) {
  const points = runs
    .filter((run) => run.avg_relevance !== null)
    .slice()
    .reverse()
    .map((run) => ({ id: run.public_id, value: run.avg_relevance as number }))

  const width = 1000
  const height = 200

  const path =
    points.length > 1
      ? points
          .map((point, index) => {
            const x = (index / (points.length - 1)) * width
            const y = height - point.value * height
            return `${index === 0 ? 'M' : 'L'} ${x.toFixed(1)},${y.toFixed(1)}`
          })
          .join(' ')
      : null

  return (
    <section className="relative bg-surface-container-low border border-outline-variant p-1 shadow-[0_0_15px_rgba(0,0,0,0.5)]">
      <PanelBrackets color="bg-outline-variant" />
      <div className="bg-surface-container-lowest h-64 chart-grid relative overflow-hidden flex items-center justify-center border border-surface-container">
        <div className="absolute top-2 left-2 bg-surface-container-highest px-2 py-1 border border-outline-variant z-10">
          <span className="font-label-caps text-label-caps text-on-surface">
            // RELEVANCE_OVER_TIME
          </span>
        </div>
        {path ? (
          <svg
            className="w-full h-full absolute inset-0 opacity-80"
            preserveAspectRatio="none"
            viewBox={`0 0 ${width} ${height}`}
          >
            <defs>
              <linearGradient id="neon-glow" x1="0%" x2="100%" y1="0%" y2="0%">
                <stop offset="0%" stopColor="#00e639" stopOpacity="0.8"></stop>
                <stop offset="50%" stopColor="#00e639" stopOpacity="1"></stop>
                <stop offset="100%" stopColor="#00e639" stopOpacity="0.8"></stop>
              </linearGradient>
              <filter height="140%" id="glow" width="140%" x="-20%" y="-20%">
                <feGaussianBlur result="blur" stdDeviation="3"></feGaussianBlur>
                <feComposite in="SourceGraphic" in2="blur" operator="over"></feComposite>
              </filter>
            </defs>
            <path
              d={path}
              fill="none"
              filter="url(#glow)"
              stroke="url(#neon-glow)"
              strokeWidth="3"
            ></path>
          </svg>
        ) : (
          <span className="font-code text-code text-on-surface-variant relative z-10">
            {points.length === 1
              ? '-- ONE SCORED RUN :: NEED TWO TO PLOT A TREND --'
              : '-- NO SCORED RUNS YET --'}
          </span>
        )}
      </div>
    </section>
  )
}
