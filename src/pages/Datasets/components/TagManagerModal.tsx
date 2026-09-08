import { useState } from 'react'
import { tagOptions } from '../../../data/datasets'

/**
 * TAG_MANAGER overlay from datasets_tagging/code.html. The mockup removed the
 * node with an inline onclick; here the parent owns the open/closed state and
 * the checkboxes are controlled.
 */
export default function TagManagerModal({
  rowId,
  onClose,
}: {
  rowId: string
  onClose: () => void
}) {
  const [checked, setChecked] = useState<Record<string, boolean>>(() =>
    Object.fromEntries(tagOptions.map((tag) => [tag.name, tag.checked])),
  )

  const toggle = (name: string) => setChecked((prev) => ({ ...prev, [name]: !prev[name] }))

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-background/80 backdrop-blur-sm p-margin">
      <div className="cyber-panel w-full max-md:h-full md:w-[600px] flex flex-col overflow-hidden shadow-[0_0_30px_rgba(0,230,57,0.2)]">
        {/* Modal Header */}
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
        {/* Modal Body */}
        <div className="p-6 flex-1 overflow-y-auto flex flex-col gap-6">
          {/* Create New Tag */}
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
          {/* Available Tags Grid */}
          <div>
            <label className="font-label-caps text-[10px] text-on-surface-variant mb-4 block">
              AVAILABLE_TAGS
            </label>
            <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
              {tagOptions.map((tag) => (
                <label
                  className={`cyber-panel p-3 flex items-center gap-3 cursor-pointer ${tag.panelClasses}`}
                  key={tag.name}
                >
                  <input
                    checked={checked[tag.name]}
                    className="hidden"
                    onChange={() => toggle(tag.name)}
                    type="checkbox"
                  />
                  <span className={`material-symbols-outlined ${tag.textClasses} text-[18px]`}>
                    {checked[tag.name] ? 'check_box' : 'check_box_outline_blank'}
                  </span>
                  <span className={`font-code text-code ${tag.textClasses}`}>{tag.name}</span>
                </label>
              ))}
            </div>
          </div>
        </div>
        {/* Modal Footer */}
        <div className="p-4 border-t border-outline-variant bg-surface-container-high/50 flex justify-end gap-4">
          <button
            className="cyber-button-secondary px-6 py-2 font-label-caps text-[12px]"
            onClick={onClose}
          >
            [ CANCEL ]
          </button>
          <button className="cyber-button px-6 py-2 font-label-caps text-[12px]" onClick={onClose}>
            [ APPLY_CHANGES ]
          </button>
        </div>
      </div>
    </div>
  )
}
