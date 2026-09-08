import { evalStats, runProvenance, scoredSamples } from '../../../data/evals'

/**
 * Right-hand pane for the selected run: headline scores, the provenance that
 * makes the run comparable to another, and the per-sample judge output.
 */
export default function RunDetails() {
  return (
    <div className="lg:col-span-8 xl:col-span-9 flex flex-col cyber-panel relative overflow-hidden">
      <div className="absolute -top-[10px] right-4 bg-surface px-2 border border-outline-variant text-[10px] text-on-surface-variant font-code tracking-widest">
        JUDGE.VALIDATED_OK
      </div>
      {/* Details Header */}
      <div className="p-6 border-b border-outline-variant bg-surface-container-high/50 flex justify-between items-center">
        <h2 className="font-headline-md text-[20px] text-primary-fixed-dim neon-green m-0">
          // RUN_DETAILS :: [EVL-1042]
        </h2>
        <div className="flex gap-2">
          <button className="cyber-button-secondary px-3 py-1 text-[12px]">
            <span className="material-symbols-outlined text-[14px] align-middle">compare_arrows</span>
          </button>
          <button className="cyber-button-secondary px-3 py-1 text-[12px]">
            <span className="material-symbols-outlined text-[14px] align-middle">replay</span>
          </button>
        </div>
      </div>
      {/* Stats Row */}
      <div className="p-6 border-b border-outline-variant grid grid-cols-2 md:grid-cols-4 gap-4 bg-surface-container-lowest/80">
        {evalStats.map((stat) => (
          <div className="border border-outline-variant p-3" key={stat.label}>
            <div className="font-label-caps text-[10px] text-on-surface-variant mb-1">
              {stat.label}
            </div>
            <div className={`font-display text-[24px] ${stat.valueClasses}`}>
              {stat.value}
              {stat.unit && <span className="text-[12px]">{stat.unit}</span>}
            </div>
          </div>
        ))}
      </div>
      {/* Provenance strip: what the scores below are tagged with */}
      <div className="px-6 py-3 border-b border-outline-variant bg-surface-container-low/50 flex flex-wrap gap-x-8 gap-y-2">
        {runProvenance.map((field) => (
          <div className="flex items-center gap-2 font-code text-[11px]" key={field.label}>
            <span className="text-on-surface-variant">{field.label}</span>
            <span className="text-secondary-fixed-dim">{field.value}</span>
          </div>
        ))}
      </div>
      {/* Per-sample scores */}
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
            {scoredSamples.map((sample) => (
              <tr
                className="border-b border-outline-variant/30 hover:bg-surface-variant/30 transition-colors group"
                key={sample.id}
              >
                <td className="py-3 px-4 text-on-surface-variant">{sample.id}</td>
                <td className="py-3 px-4 text-secondary-fixed break-words pr-4">{sample.input}</td>
                <td className="py-3 px-4 text-on-surface break-words pr-4">{sample.output}</td>
                <td className="py-3 px-4 text-primary-fixed-dim">{sample.relevance}</td>
                <td
                  className={`py-3 px-4 ${
                    sample.failed
                      ? 'text-error drop-shadow-[0_0_5px_rgba(255,180,171,0.5)]'
                      : 'text-primary-fixed-dim'
                  }`}
                >
                  {sample.faithfulness}
                </td>
                <td
                  className={`py-3 px-4 break-words pr-4 ${
                    sample.failed ? 'text-error' : 'text-on-surface-variant'
                  }`}
                >
                  {sample.reason}
                </td>
                <td className="py-3 px-4 text-right text-on-surface-variant">{sample.latency}</td>
              </tr>
            ))}
          </tbody>
        </table>
        <div className="mt-4 text-center text-on-surface-variant text-[10px] font-code">
          -- 95 MORE SAMPLES OMITTED -- <br />
          <button className="underline hover:text-secondary-fixed mt-1">LOAD_MORE_SAMPLES</button>
        </div>
      </div>
      {/* Action Bar */}
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
