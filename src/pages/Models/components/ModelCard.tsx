import { roleStyles, statusStyles, type ModelEntry } from '../../../data/models'

/** One registry entry. Cards rather than rows, to distinguish this screen from Evals and Datasets. */
export default function ModelCard({ model }: { model: ModelEntry }) {
  const assigned = model.role !== 'UNUSED'

  return (
    <div
      className={`cyber-panel p-4 flex flex-col gap-3 relative ${
        assigned ? '' : 'opacity-70 hover:opacity-100'
      }`}
    >
      <div className="flex justify-between items-start gap-2">
        <div className="min-w-0">
          <div className="font-label-caps text-[10px] text-on-surface-variant mb-1">
            {model.provider}
          </div>
          <h3 className="font-headline-md text-[16px] text-secondary-fixed truncate">{model.id}</h3>
        </div>
        <div
          className={`font-label-caps text-[10px] border px-2 py-1 shrink-0 ${roleStyles[model.role]}`}
        >
          {model.role}
        </div>
      </div>

      <div className="grid grid-cols-3 gap-2 font-code text-[11px] border-y border-outline-variant/40 py-3">
        <div>
          <div className="text-on-surface-variant/70 text-[10px]">CONTEXT</div>
          <div className="text-on-surface">{model.context}</div>
        </div>
        <div>
          <div className="text-on-surface-variant/70 text-[10px]">IN /1M</div>
          <div className="text-tertiary-fixed-dim">{model.inputPrice}</div>
        </div>
        <div>
          <div className="text-on-surface-variant/70 text-[10px]">OUT /1M</div>
          <div className="text-tertiary-fixed-dim">{model.outputPrice}</div>
        </div>
      </div>

      <p className="font-code text-[11px] text-on-surface-variant leading-relaxed">{model.note}</p>

      <div className="flex justify-between items-center mt-auto pt-2">
        <div className={`font-code text-[11px] flex items-center gap-2 ${statusStyles[model.status]}`}>
          {model.status === 'READY' && <span className="status-blinker w-2 h-2"></span>}
          {model.status === 'LOCAL' && (
            <span className="material-symbols-outlined text-[12px]">home_storage</span>
          )}
          {model.status === 'NO_KEY' && (
            <span className="material-symbols-outlined text-[12px]">key_off</span>
          )}
          {model.status === 'OFFLINE' && (
            <span className="material-symbols-outlined text-[12px]">cloud_off</span>
          )}
          {model.status}
        </div>
        <button
          className={`px-3 py-1 font-label-caps text-[10px] ${
            assigned ? 'cyber-button-secondary' : 'cyber-button'
          }`}
        >
          {assigned ? '[ CONFIGURE ]' : '[ ENABLE ]'}
        </button>
      </div>
    </div>
  )
}
