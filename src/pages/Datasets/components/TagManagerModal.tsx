import { useState } from 'react'

/**
 * TAG_MANAGER overlay, from the datasets_tagging mockup.
 *
 * Tags are read from the API but there is no endpoint to write them back yet,
 * so APPLY_CHANGES is disabled and says why rather than silently doing nothing.
 * A disabled control that explains itself is better than one that lies.
 */
const SUGGESTED_TAGS = ['billing', 'urgent', 'hardware', 'pii_risk', 'edge_case', 'general']

const toneFor = (tag: string, checked: boolean): { panel: string; text: string } => {
  if (!checked) return { panel: 'opacity-60 hover:opacity-100', text: 'text-on-surface-variant' }
  if (tag === 'urgent' || tag === 'pii_risk') {
    return {
      panel: 'border-tertiary-fixed-dim bg-tertiary-container/10',
      text: 'text-tertiary-fixed-dim',
    }
  }
  return {
    panel: 'border-primary-fixed-dim bg-primary-container/10',
    text: 'text-primary-fixed-dim',
  }
}

export default function TagManagerModal({
  rowId,
  tags,
  onClose,
}: {
  rowId: string
  tags: string[]
  onClose: () => void
}) {
  const available = Array.from(new Set([...SUGGESTED_TAGS, ...tags]))
  const [checked, setChecked] = useState<Record<string, boolean>>(() =>
    Object.fromEntries(available.map((tag) => [tag, tags.includes(tag)])),
  )

  const toggle = (name: string) => setChecked((prev) => ({ ...prev, [name]: !prev[name] }))

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-background/80 backdrop-blur-sm p-margin">
      <div className="cyber-panel w-full max-md:h-full md:w-[600px] flex flex-col overflow-hidden shadow-[0_0_30px_rgba(0,230,57,0.2)]">
        <div className="p-6 border-b border-outline-variant bg-surface-container-high/50 flex justify-between items-center">
          <h2 className="font-headline-md text-[20px] text-primary-fixed-dim neon-green m-0">
            // TAG_MANAGER :: [ROW_{rowId}]
          </h2>
          <button
            className="text-on-surface-variant hover:text-primary-fixed transition-colors"
            onClick={onClose}
          >
            <span className="material-symbols-outlined">close</span>
          </button>
        </div>

        <div className="p-6 flex-1 overflow-y-auto flex flex-col gap-6">
          <div>
            <label className="font-label-caps text-[10px] text-on-surface-variant mb-2 block">
              CREATE_NEW_TAG
            </label>
            <div className="cyber-input-wrapper">
              <input
                autoFocus
                className="cyber-input font-code text-code"
                placeholder="ENTER_TAG_NAME..."
                type="text"
              />
              <span className="cursor"></span>
            </div>
          </div>
          <div>
            <label className="font-label-caps text-[10px] text-on-surface-variant mb-4 block">
              AVAILABLE_TAGS
            </label>
            <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
              {available.map((tag) => {
                const tone = toneFor(tag, Boolean(checked[tag]))
                return (
                  <label
                    className={`cyber-panel p-3 flex items-center gap-3 cursor-pointer ${tone.panel}`}
                    key={tag}
                  >
                    <input
                      checked={Boolean(checked[tag])}
                      className="hidden"
                      onChange={() => toggle(tag)}
                      type="checkbox"
                    />
                    <span className={`material-symbols-outlined ${tone.text} text-[18px]`}>
                      {checked[tag] ? 'check_box' : 'check_box_outline_blank'}
                    </span>
                    <span className={`font-code text-code ${tone.text}`}>{tag}</span>
                  </label>
                )
              })}
            </div>
          </div>
        </div>

        <div className="p-4 border-t border-outline-variant bg-surface-container-high/50 flex justify-between items-center gap-4">
          <p className="font-code text-[10px] text-on-surface-variant/70">
            Read-only: no write endpoint for tags yet.
          </p>
          <div className="flex gap-4 shrink-0">
            <button
              className="cyber-button-secondary px-6 py-2 font-label-caps text-[12px]"
              onClick={onClose}
            >
              [ CLOSE ]
            </button>
            <button
              className="cyber-button px-6 py-2 font-label-caps text-[12px] opacity-40 cursor-not-allowed"
              disabled
              title="No write endpoint for tags yet"
            >
              [ APPLY_CHANGES ]
            </button>
          </div>
        </div>
      </div>
    </div>
  )
}
