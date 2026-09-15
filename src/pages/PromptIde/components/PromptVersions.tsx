import { promptVersions, type PromptVersion } from '../../../data/promptIde'

const states: Record<
  PromptVersion['state'],
  { panel: string; label: string; dot: string; timestamp: string }
> = {
  recent: {
    panel: 'border border-outline-variant p-2 hover:bg-primary-fixed-dim/5 cursor-pointer transition-colors group',
    label: 'font-code text-code text-on-surface group-hover:text-primary-fixed-dim',
    dot: 'w-2 h-2 bg-secondary-fixed-dim',
    timestamp: 'font-label-caps text-label-caps text-on-surface-variant text-[10px]',
  },
  active: {
    panel: 'border border-primary-fixed-dim bg-primary-fixed-dim/10 p-2 cursor-pointer relative panel-brackets',
    label: 'font-code text-code text-primary-fixed-dim',
    dot: 'w-2 h-2 bg-primary-fixed-dim animate-pulse',
    timestamp: 'font-label-caps text-label-caps text-primary-fixed-dim opacity-70 text-[10px]',
  },
  archived: {
    panel: 'border border-outline-variant p-2 opacity-50 hover:opacity-100 hover:bg-primary-fixed-dim/5 cursor-pointer transition-all group',
    label: 'font-code text-code text-on-surface group-hover:text-primary-fixed-dim',
    dot: 'w-2 h-2 bg-outline',
    timestamp: 'font-label-caps text-label-caps text-on-surface-variant text-[10px]',
  },
}

/** Left pane: the PROMPT_VERSIONS history strip. */
export default function PromptVersions() {
  return (
    <section className="w-full lg:w-64 shrink-0 bg-surface-container-lowest border border-outline-variant flex flex-col panel-brackets relative">
      <div className="absolute -top-3 left-2 bg-surface-container-lowest px-2 border border-outline-variant border-b-0 text-primary-fixed-dim font-label-caps text-label-caps z-10">
        PROMPT_VERSIONS
      </div>
      <div className="p-4 pt-6 flex-1 overflow-y-auto flex flex-col gap-2">
        {promptVersions.map((version) => {
          const style = states[version.state]
          return (
            <div className={style.panel} key={version.version}>
              <div className="flex justify-between items-center mb-1">
                <span className={style.label}>{version.version}</span>
                <span className={style.dot}></span>
              </div>
              <div className={style.timestamp}>{version.timestamp}</div>
            </div>
          )
        })}
      </div>
    </section>
  )
}
