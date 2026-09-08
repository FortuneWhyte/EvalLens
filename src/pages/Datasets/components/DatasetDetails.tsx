import { datasetSamples, datasetStats } from '../../../data/datasets'

/** Right-hand pane: dataset header, allocation stats, sample preview and actions. */
export default function DatasetDetails({ onEditTags }: { onEditTags: (rowId: string) => void }) {
  return (
    <div className="lg:col-span-8 xl:col-span-9 flex flex-col cyber-panel relative overflow-hidden">
      <div className="absolute -top-[10px] right-4 bg-surface px-2 border border-outline-variant text-[10px] text-on-surface-variant font-code tracking-widest">
        SYS.MEM.ALLOC_OK
      </div>
      {/* Details Header */}
      <div className="p-6 border-b border-outline-variant bg-surface-container-high/50 flex justify-between items-center">
        <h2 className="font-headline-md text-[20px] text-primary-fixed-dim neon-green m-0">
          // DATASET_DETAILS :: [customer_support_v2]
        </h2>
        <div className="flex gap-2">
          <button className="cyber-button-secondary px-3 py-1 text-[12px]">
            <span className="material-symbols-outlined text-[14px] align-middle">edit</span>
          </button>
          <button className="cyber-button-secondary px-3 py-1 text-[12px]">
            <span className="material-symbols-outlined text-[14px] align-middle">sync</span>
          </button>
        </div>
      </div>
      {/* Stats Row */}
      <div className="p-6 border-b border-outline-variant grid grid-cols-2 md:grid-cols-4 gap-4 bg-surface-container-lowest/80">
        {datasetStats.map((stat) => (
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
      {/* Data Preview Table (Terminal Style) */}
      <div className="flex-1 p-6 overflow-auto bg-surface-container-lowest relative">
        {/* Simulated Background Texture in Code Area */}
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
              <th className="py-2 px-4 font-normal w-16">ID</th>
              <th className="py-2 px-4 font-normal w-1/3">INPUT_PROMPT</th>
              <th className="py-2 px-4 font-normal w-1/3">EXPECTED_OUTPUT</th>
              <th className="py-2 px-4 font-normal">TAGS</th>
            </tr>
          </thead>
          <tbody>
            {datasetSamples.map((sample) => (
              <tr
                className="border-b border-outline-variant/30 hover:bg-surface-variant/30 transition-colors group"
                key={sample.id}
              >
                <td className="py-3 px-4 text-on-surface-variant">{sample.id}</td>
                <td className="py-3 px-4 text-secondary-fixed break-words pr-4">{sample.input}</td>
                <td className="py-3 px-4 text-primary-fixed-dim break-words pr-4">
                  {sample.expected}
                </td>
                <td className="py-3 px-4 cursor-pointer" onClick={() => onEditTags(sample.id)}>
                  {sample.tags.map((tag) => (
                    <span
                      className="border border-outline-variant px-1 text-[10px] text-tertiary-fixed-dim mr-1"
                      key={tag}
                    >
                      {tag}
                    </span>
                  ))}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
        <div className="mt-4 text-center text-on-surface-variant text-[10px] font-code">
          -- 1,236 MORE ROWS OMITTED -- <br />
          <button className="underline hover:text-secondary-fixed mt-1">LOAD_MORE_PAGES</button>
        </div>
      </div>
      {/* Action Bar */}
      <div className="p-4 border-t border-outline-variant bg-surface-container-high/50 flex flex-wrap gap-4 justify-end">
        <button className="cyber-button-secondary px-4 py-2 font-label-caps text-[12px] flex items-center gap-2">
          <span className="material-symbols-outlined text-[16px]">download</span>[ EXPORT_JSON ]
        </button>
        <button className="cyber-button px-4 py-2 font-label-caps text-[12px] flex items-center gap-2">
          <span className="material-symbols-outlined text-[16px]">play_arrow</span>[ RUN_VALIDATION
          ]
        </button>
        <button className="cyber-button-danger px-4 py-2 font-label-caps text-[12px] flex items-center gap-2 ml-auto md:ml-8">
          <span className="material-symbols-outlined text-[16px]">delete</span>[ DELETE_SOURCE ]
        </button>
      </div>
    </div>
  )
}
