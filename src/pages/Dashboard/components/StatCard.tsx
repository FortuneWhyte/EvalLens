import PanelBrackets from '../../../components/ui/PanelBrackets'
import type { DashboardStat, StatTone } from '../../../data/dashboard'

const tones: Record<StatTone, { border: string; shadow: string; bracket: string; value: string }> = {
  green: {
    border: 'border-primary-fixed-dim',
    shadow: 'shadow-[0_0_8px_rgba(0,230,57,0.15)]',
    bracket: 'bg-primary-fixed-dim',
    value: 'text-primary-fixed-dim drop-shadow-[0_0_5px_rgba(0,230,57,0.5)]',
  },
  cyan: {
    border: 'border-secondary-container',
    shadow: 'shadow-[0_0_8px_rgba(0,241,253,0.15)]',
    bracket: 'bg-secondary-container',
    value: 'text-secondary-container drop-shadow-[0_0_5px_rgba(0,241,253,0.5)]',
  },
  magenta: {
    border: 'border-on-tertiary-container',
    shadow: 'shadow-[0_0_8px_rgba(173,0,173,0.15)]',
    bracket: 'bg-on-tertiary-container',
    value: 'text-on-tertiary-container drop-shadow-[0_0_5px_rgba(173,0,173,0.5)]',
  },
}

export default function StatCard({ stat }: { stat: DashboardStat }) {
  const tone = tones[stat.tone]

  return (
    <div
      className={`relative bg-surface-container-low border ${tone.border} p-4 ${tone.shadow} group`}
    >
      <PanelBrackets color={tone.bracket} />
      <h3 className="font-label-caps text-label-caps text-on-surface-variant mb-2">{stat.label}</h3>
      <div className="flex items-end gap-3">
        <span className={`font-display text-headline-lg ${tone.value}`}>{stat.value}</span>
        <span
          className={`font-code text-code mb-1 ${
            stat.deltaIsNegative ? 'text-error' : 'text-primary-fixed-dim'
          }`}
        >
          {stat.delta}
        </span>
      </div>
    </div>
  )
}
