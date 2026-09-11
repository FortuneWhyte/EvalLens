import type { RunDetail, Sample } from '../../../types/api'

/** Scores are 0..1 floats; show two decimals, or a dash when unscored. */
function score(value: number | null): string {
  return value === null ? '--' : value.toFixed(2)
}

function percent(value: number | null): string {
  return value === null ? '--' : Math.round(value * 100).toString()
}

/** A sample counts as a failure worth flagging if it errored or scored poorly. */
function isFlagged(sample: Sample): boolean {
  if (sample.status === 'FAILED') return true
  const faithfulness = sample.score?.faithfulness
  return faithfulness !== null && faithfulness !== undefined && faithfulness < 0.5
}

export default function RunDetails({ run }: { run: RunDetail }) {
  const stats = [
    {
      label: 'RELEVANCE',
      value: percent(run.avg_relevance),
      unit: run.avg_relevance === null ? undefined : '%',
      classes: 'text-primary-fixed-dim',
    },
    {
      label: 'FAITHFULNESS',
      value: percent(run.avg_faithfulness),
      unit: run.avg_faithfulness === null ? undefined : '%',
      classes: 'text-secondary-fixed',
    },
    {
      label: 'LATENCY_P50',
      value: run.p50_latency_ms === null ? '--' : String(run.p50_latency_ms),
      unit: run.p50_latency_ms === null ? undefined : 'ms',
      classes: 'text-on-surface',
    },
    {
      label: 'TOTAL_COST',
      value: `$${run.total_cost_usd.toFixed(4)}`,
      classes: 'text-tertiary-fixed-dim',
    },
  ]

  const provenance = [
    { label: 'JUDGE_MODEL', value: run.judge_model },
    { label: 'PROMPT_VER', value: run.prompt_version },
    { label: 'RUBRIC_VER', value: run.rubric_version },
    { label: 'TEMPERATURE', value: run.judge_temperature.toFixed(1) },
  ]

  return (
    <div className="lg:col-span-8 xl:col-span-9 flex flex-col cyber-panel relative overflow-hidden">
      <div className="absolute -top-[10px] right-4 bg-surface px-2 border border-outline-variant text-[10px] text-on-surface-variant font-code tracking-widest">
        {run.status === 'DONE' ? 'JUDGE.VALIDATED_OK' : `RUN.${run.status}`}
      </div>
      <div className="p-6 border-b border-outline-variant bg-surface-container-high/50 flex justify-between items-center gap-4">
        <h2 className="font-headline-md text-[20px] text-primary-fixed-dim neon-green m-0 truncate">
          // RUN_DETAILS :: [{run.public_id}]
        </h2>
        <div className="flex gap-2 shrink-0">
          <button className="cyber-button-secondary px-3 py-1 text-[12px]">
            <span className="material-symbols-outlined text-[14px] align-middle">
              compare_arrows
            </span>
          </button>
          <button className="cyber-button-secondary px-3 py-1 text-[12px]">
            <span className="material-symbols-outlined text-[14px] align-middle">replay</span>
          </button>
        </div>
      </div>

      {run.error && (
        <div className="px-6 py-3 border-b border-error bg-error-container/10 font-code text-[12px] text-error">
          {run.error}
        </div>
      )}

      <div className="p-6 border-b border-outline-variant grid grid-cols-2 md:grid-cols-4 gap-4 bg-surface-container-lowest/80">
        {stats.map((stat) => (
          <div className="border border-outline-variant p-3" key={stat.label}>
            <div className="font-label-caps text-[10px] text-on-surface-variant mb-1">
              {stat.label}
            </div>
            <div className={`font-display text-[24px] ${stat.classes}`}>
              {stat.value}
              {stat.unit && <span className="text-[12px]">{stat.unit}</span>}
            </div>
          </div>
        ))}
      </div>

      {/* What the scores above are tagged with, without which they cannot be
          compared to another run. */}
      <div className="px-6 py-3 border-b border-outline-variant bg-surface-container-low/50 flex flex-wrap gap-x-8 gap-y-2">
        {provenance.map((field) => (
          <div className="flex items-center gap-2 font-code text-[11px]" key={field.label}>
            <span className="text-on-surface-variant">{field.label}</span>
            <span className="text-secondary-fixed-dim">{field.value}</span>
          </div>
        ))}
      </div>

      <div className="flex-1 p-6 overflow-auto bg-surface-container-lowest relative">
        <div
          className="absolute inset-0 opacity-5 pointer-events-none"
          style={{
            backgroundImage:
              'repeating-linear-gradient(0deg, transparent, transparent 2px, #fff 2px, #fff 4px)',
          }}
        ></div>
        <table className="w-full text-left font-code text-[12px] border-collapse relative z-10">
          <thead>
            <tr className="text-on-surface-variant border-b border-outline-variant">
              <th className="py-2 px-4 font-normal w-12">ID</th>
              <th className="py-2 px-4 font-normal w-1/4">INPUT</th>
              <th className="py-2 px-4 font-normal w-1/4">OUTPUT</th>
              <th className="py-2 px-4 font-normal">REL</th>
              <th className="py-2 px-4 font-normal">FAITH</th>
              <th className="py-2 px-4 font-normal w-1/4">JUDGE_REASON</th>
              <th className="py-2 px-4 font-normal text-right">MS</th>
            </tr>
          </thead>
          <tbody>
            {run.samples.map((sample) => {
              const flagged = isFlagged(sample)
              return (
                <tr
                  className="border-b border-outline-variant/30 hover:bg-surface-variant/30 transition-colors group"
                  key={sample.external_id}
                >
                  <td className="py-3 px-4 text-on-surface-variant">{sample.external_id}</td>
                  <td className="py-3 px-4 text-secondary-fixed break-words pr-4">
                    {sample.question}
                  </td>
                  <td className="py-3 px-4 text-on-surface break-words pr-4">
                    {sample.output ?? '--'}
                  </td>
                  <td className="py-3 px-4 text-primary-fixed-dim">
                    {score(sample.score?.relevance ?? null)}
                  </td>
                  <td
                    className={`py-3 px-4 ${
                      flagged
                        ? 'text-error drop-shadow-[0_0_5px_rgba(255,180,171,0.5)]'
                        : 'text-primary-fixed-dim'
                    }`}
                  >
                    {score(sample.score?.faithfulness ?? null)}
                  </td>
                  <td
                    className={`py-3 px-4 break-words pr-4 ${
                      flagged ? 'text-error' : 'text-on-surface-variant'
                    }`}
                  >
                    {sample.error ?? sample.score?.reason ?? '--'}
                  </td>
                  <td className="py-3 px-4 text-right text-on-surface-variant">
                    {sample.latency_ms ?? '--'}
                  </td>
                </tr>
              )
            })}
          </tbody>
        </table>
      </div>

      <div className="p-4 border-t border-outline-variant bg-surface-container-high/50 flex flex-wrap gap-4 justify-end">
        <button className="cyber-button-secondary px-4 py-2 font-label-caps text-[12px] flex items-center gap-2">
          <span className="material-symbols-outlined text-[16px]">download</span>[ EXPORT_SCORES ]
        </button>
        <button className="cyber-button px-4 py-2 font-label-caps text-[12px] flex items-center gap-2">
          <span className="material-symbols-outlined text-[16px]">replay</span>[ RE_RUN ]
        </button>
        <button className="cyber-button-danger px-4 py-2 font-label-caps text-[12px] flex items-center gap-2 ml-auto md:ml-8">
          <span className="material-symbols-outlined text-[16px]">delete</span>[ DELETE_RUN ]
        </button>
      </div>
    </div>
  )
}
