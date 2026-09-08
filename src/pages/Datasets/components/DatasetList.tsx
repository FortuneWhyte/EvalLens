import { datasetSummaries, type DatasetSummary } from '../../../data/datasets'

function DatasetCard({ dataset }: { dataset: DatasetSummary }) {
  return (
    <div
      className={`cyber-panel p-4 cursor-pointer relative ${
        dataset.selected
          ? 'border-primary-fixed-dim bg-primary-container/5 shadow-[0_0_10px_rgba(0,230,57,0.1)]'
          : 'opacity-80 hover:opacity-100'
      }`}
    >
      {dataset.selected && (
        <div className="absolute -top-[10px] left-4 bg-surface px-2 border border-primary-fixed-dim text-[10px] text-primary-fixed-dim font-code tracking-widest">
          SELECTED
        </div>
      )}
      <h3 className={`font-headline-md text-[16px] ${dataset.titleClasses} mb-2 truncate`}>
        {dataset.name}
      </h3>
      <div className="flex justify-between items-end">
        <div className="font-code text-code text-on-surface-variant">
          <p>{dataset.rows}</p>
          <p className="opacity-50 mt-1">{dataset.updated}</p>
        </div>
        <div
          className={`font-label-caps text-[10px] border px-2 py-1 flex items-center gap-1 ${dataset.badge.classes}`}
        >
          {dataset.badge.indicator === 'icon' ? (
            <span className="material-symbols-outlined text-[10px]">{dataset.badge.icon}</span>
          ) : (
            <span
              className={`status-blinker w-2 h-2 ${
                dataset.badge.indicator === 'blinker-cyan' ? 'status-blinker-cyan' : ''
              }`}
            ></span>
          )}{' '}
          {dataset.badge.label}
        </div>
      </div>
    </div>
  )
}

export default function DatasetList() {
  return (
    <div className="lg:col-span-4 xl:col-span-3 flex flex-col gap-4 overflow-y-auto pr-2 pb-8">
      {datasetSummaries.map((dataset) => (
        <DatasetCard dataset={dataset} key={dataset.name} />
      ))}
    </div>
  )
}
