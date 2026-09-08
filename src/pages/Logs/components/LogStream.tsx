import { logLevelStyles, type LogEntry } from '../../../data/logs'

/** The scrolling log body. Each row is one emitted line. */
export default function LogStream({ entries }: { entries: LogEntry[] }) {
  return (
    <div className="flex-1 overflow-auto bg-surface-container-lowest relative p-4">
      <div
        className="absolute inset-0 opacity-5 pointer-events-none"
        style={{
          backgroundImage:
            'repeating-linear-gradient(0deg, transparent, transparent 2px, #fff 2px, #fff 4px)',
        }}
      ></div>
      <div className="relative z-10 font-code text-[12px] leading-relaxed flex flex-col">
        {entries.map((entry, index) => (
          <div
            className="flex items-start gap-3 py-1 border-b border-outline-variant/20 hover:bg-surface-variant/20 transition-colors"
            key={`${entry.timestamp}-${index}`}
          >
            <span className="text-on-surface-variant/60 shrink-0">{entry.timestamp}</span>
            <span
              className={`shrink-0 border px-1 text-[10px] font-label-caps ${logLevelStyles[entry.level]}`}
            >
              {entry.level}
            </span>
            <span className="text-secondary-fixed-dim shrink-0 w-16">{entry.source}</span>
            <span className="text-on-surface break-words flex-1">{entry.message}</span>
            {entry.tokens && (
              <span className="text-on-surface-variant/70 shrink-0 hidden xl:inline">
                {entry.tokens}
              </span>
            )}
            {entry.cost && (
              <span className="text-tertiary-fixed-dim shrink-0 w-16 text-right">{entry.cost}</span>
            )}
          </div>
        ))}
        <div className="flex items-center gap-2 py-2 text-on-surface-variant">
          <span className="status-blinker status-blinker-cyan w-2 h-2"></span>
          <span className="animate-pulse">_ streaming...</span>
        </div>
      </div>
    </div>
  )
}
