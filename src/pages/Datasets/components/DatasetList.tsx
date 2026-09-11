import type { DatasetSummary } from '../../../types/api'

export default function DatasetList({
  datasets,
  selectedName,
  onSelect,
}: {
  datasets: DatasetSummary[]
  selectedName: string | null
  onSelect: (name: string) => void
}) {
  return (
    <div className="lg:col-span-4 xl:col-span-3 flex flex-col gap-4 overflow-y-auto pr-2 pb-8">
      {datasets.map((dataset) => {
        const selected = dataset.name === selectedName
        return (
          <button
            className={`cyber-panel p-4 cursor-pointer relative text-left w-full ${
              selected
                ? 'border-primary-fixed-dim bg-primary-container/5 shadow-[0_0_10px_rgba(0,230,57,0.1)]'
                : 'opacity-80 hover:opacity-100'
            }`}
            key={dataset.name}
            onClick={() => onSelect(dataset.name)}
          >
            {selected && (
              <div className="absolute -top-[10px] left-4 bg-surface px-2 border border-primary-fixed-dim text-[10px] text-primary-fixed-dim font-code tracking-widest">
                SELECTED
              </div>
            )}
            <h3
              className={`font-headline-md text-[16px] mb-2 truncate ${
                selected ? 'text-primary-fixed-dim' : 'text-secondary-fixed'
              }`}
            >
              {dataset.name}
            </h3>
            <div className="flex justify-between items-end gap-2">
              <div className="font-code text-code text-on-surface-variant min-w-0">
                <p>ROWS: {dataset.item_count.toLocaleString()}</p>
                <p className="opacity-50 mt-1 truncate">{dataset.description || 'no description'}</p>
              </div>
              <div className="font-label-caps text-[10px] text-primary-fixed-dim border border-primary-fixed-dim px-2 py-1 flex items-center gap-1 bg-primary-container/10 shrink-0">
                <span className="status-blinker w-2 h-2"></span> LOADED
              </div>
            </div>
          </button>
        )
      })}
    </div>
  )
}
