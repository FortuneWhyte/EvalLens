import { models, parameterSliders } from '../../../data/promptIde'

/** Right pane: sampling parameters and model selection. */
export default function ParametersPanel() {
  return (
    <section className="w-72 bg-surface-container-lowest border border-outline-variant flex flex-col panel-brackets relative">
      <div className="absolute -top-3 right-2 bg-surface-container-lowest px-2 border border-outline-variant border-b-0 text-secondary-fixed-dim font-label-caps text-label-caps z-10 uppercase">
        PARAMETERS
      </div>
      <div className="p-4 pt-8 flex-1 overflow-y-auto flex flex-col gap-6">
        {parameterSliders.map((slider) => (
          <div className="flex flex-col gap-2" key={slider.label}>
            <div className="flex justify-between items-center font-label-caps text-label-caps text-on-surface">
              <span>{slider.label}</span>
              <span className="text-secondary-fixed-dim font-code">{slider.value}</span>
            </div>
            <input
              defaultValue={slider.defaultValue}
              max={slider.max}
              min={slider.min}
              step={slider.step}
              type="range"
            />
            <div className="flex justify-between text-[10px] text-outline-variant font-code">
              <span>{slider.minLabel}</span>
              <span>{slider.maxLabel}</span>
            </div>
          </div>
        ))}
        <div className="mt-auto border-t border-outline-variant pt-4">
          <div className="font-label-caps text-label-caps text-on-surface-variant mb-2">
            MODEL_SELECTION
          </div>
          <select className="w-full bg-surface border border-outline-variant text-on-surface font-code text-code p-2 focus:border-primary-fixed-dim focus:ring-0 appearance-none rounded-none uppercase">
            {models.map((model) => (
              <option key={model}>{model}</option>
            ))}
          </select>
        </div>
      </div>
    </section>
  )
}
