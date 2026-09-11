import { LoadingPanel } from '../../../components/ui/QueryState'
import { useDatasetItems } from '../../../hooks/useEvalLensQueries'
import type { DatasetSummary, RunSummary } from '../../../types/api'

/**
 * Right-hand pane: what the dataset contains, and every run evaluated against
 * it. The sample preview is the part that makes this screen worth having -
 * seeing the questions a run will actually execute.
 */
export default function DatasetDetails({
  dataset,
  runs,
  onEditTags,
}: {
  dataset: DatasetSummary
  runs: RunSummary[]
  onEditTags: (externalId: string, tags: string[]) => void
}) {
  const itemsQuery = useDatasetItems(dataset.name)
  const items = itemsQuery.data ?? []

  const scored = runs.filter((run) => run.avg_relevance !== null)
  const bestRelevance = scored.length
    ? Math.max(...scored.map((run) => run.avg_relevance as number))
    : null
  const totalSpend = runs.reduce((sum, run) => sum + run.total_cost_usd, 0)

  const stats = [
    {
      label: 'TOTAL_ROWS',
      value: dataset.item_count.toLocaleString(),
      classes: 'text-primary-fixed-dim',
    },
    { label: 'RUNS', value: String(runs.length), classes: 'text-secondary-fixed' },
    {
      label: 'BEST_RELEVANCE',
      value: bestRelevance === null ? '--' : String(Math.round(bestRelevance * 100)),
      unit: bestRelevance === null ? undefined : '%',
      classes: 'text-tertiary-fixed-dim',
    },
    { label: 'SPEND', value: `$${totalSpend.toFixed(4)}`, classes: 'text-on-surface' },
  ]

  return (
    <div className="lg:col-span-8 xl:col-span-9 flex flex-col cyber-panel relative overflow-hidden">
      <div className="absolute -top-[10px] right-4 bg-surface px-2 border border-outline-variant text-[10px] text-on-surface-variant font-code tracking-widest">
        SYS.MEM.ALLOC_OK
      </div>
      <div className="p-6 border-b border-outline-variant bg-surface-container-high/50 flex justify-between items-center gap-4">
        <h2 className="font-headline-md text-[20px] text-primary-fixed-dim neon-green m-0 truncate">
          // DATASET_DETAILS :: [{dataset.name}]
        </h2>
        <div className="flex gap-2 shrink-0">
          <button className="cyber-button-secondary px-3 py-1 text-[12px]">
            <span className="material-symbols-outlined text-[14px] align-middle">edit</span>
          </button>
          <button className="cyber-button-secondary px-3 py-1 text-[12px]">
            <span className="material-symbols-outlined text-[14px] align-middle">sync</span>
          </button>
        </div>
      </div>

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

      <div className="flex-1 p-6 overflow-auto bg-surface-container-lowest relative">
        <div
          className="absolute inset-0 opacity-5 pointer-events-none"
          style={{
            backgroundImage:
              'repeating-linear-gradient(0deg, transparent, transparent 2px, #fff 2px, #fff 4px)',
          }}
        ></div>

        <div className="relative z-10 flex flex-col gap-8">
          <div>
            <div className="font-label-caps text-[10px] text-on-surface-variant mb-4">
              SAMPLE_PREVIEW
            </div>
            {itemsQuery.isLoading ? (
              <LoadingPanel label="LOADING_ITEMS" />
            ) : (
              <table className="w-full text-left font-code text-[12px] border-collapse">
                <thead>
                  <tr className="text-on-surface-variant border-b border-outline-variant">
                    <th className="py-2 px-4 font-normal w-16">ID</th>
                    <th className="py-2 px-4 font-normal w-1/3">INPUT_PROMPT</th>
                    <th className="py-2 px-4 font-normal w-1/3">EXPECTED_OUTPUT</th>
                    <th className="py-2 px-4 font-normal">TAGS</th>
                  </tr>
                </thead>
                <tbody>
                  {items.map((item) => (
                    <tr
                      className="border-b border-outline-variant/30 hover:bg-surface-variant/30 transition-colors group"
                      key={item.external_id}
                    >
                      <td className="py-3 px-4 text-on-surface-variant">{item.external_id}</td>
                      <td className="py-3 px-4 text-secondary-fixed break-words pr-4">
                        {item.question}
                      </td>
                      <td className="py-3 px-4 text-primary-fixed-dim break-words pr-4">
                        {item.reference ?? '--'}
                      </td>
                      <td
                        className="py-3 px-4 cursor-pointer"
                        onClick={() => onEditTags(item.external_id, item.tags)}
                        title="Edit tags"
                      >
                        {item.tags.length === 0 ? (
                          <span className="text-on-surface-variant/50 text-[10px]">+ ADD</span>
                        ) : (
                          item.tags.map((tag) => (
                            <span
                              className="border border-outline-variant px-1 text-[10px] text-tertiary-fixed-dim mr-1"
                              key={tag}
                            >
                              {tag}
                            </span>
                          ))
                        )}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            )}
          </div>

          <div>
            <div className="font-label-caps text-[10px] text-on-surface-variant mb-4">
              RUNS_AGAINST_THIS_DATASET
            </div>
            {runs.length === 0 ? (
              <p className="font-code text-[12px] text-on-surface-variant">
                -- NO RUNS YET FOR THIS DATASET --
              </p>
            ) : (
              <table className="w-full text-left font-code text-[12px] border-collapse">
                <thead>
                  <tr className="text-on-surface-variant border-b border-outline-variant">
                    <th className="py-2 px-4 font-normal">RUN_ID</th>
                    <th className="py-2 px-4 font-normal">MODEL</th>
                    <th className="py-2 px-4 font-normal">STATUS</th>
                    <th className="py-2 px-4 font-normal">REL</th>
                    <th className="py-2 px-4 font-normal">FAITH</th>
                    <th className="py-2 px-4 font-normal text-right">COST</th>
                  </tr>
                </thead>
                <tbody>
                  {runs.map((run) => (
                    <tr
                      className="border-b border-outline-variant/30 hover:bg-surface-variant/30 transition-colors"
                      key={run.public_id}
                    >
                      <td className="py-3 px-4 text-secondary-fixed">{run.public_id}</td>
                      <td className="py-3 px-4 text-on-surface-variant">{run.candidate_model}</td>
                      <td className="py-3 px-4 text-primary-fixed-dim">[{run.status}]</td>
                      <td className="py-3 px-4 text-primary-fixed-dim">
                        {run.avg_relevance === null ? '--' : run.avg_relevance.toFixed(2)}
                      </td>
                      <td className="py-3 px-4 text-primary-fixed-dim">
                        {run.avg_faithfulness === null ? '--' : run.avg_faithfulness.toFixed(2)}
                      </td>
                      <td className="py-3 px-4 text-right text-tertiary-fixed-dim">
                        ${run.total_cost_usd.toFixed(4)}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            )}
          </div>
        </div>
      </div>

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
