import { useEffect, useRef } from 'react'
import type { ConsoleLine } from '../../../data/promptIde'

export type ConsolePhase = 'idle' | 'running' | 'done'

/** Bottom pane: CONSOLE_OUTPUT, auto-scrolled as lines stream in. */
export default function ConsoleOutput({
  lines,
  phase,
}: {
  lines: ConsoleLine[]
  phase: ConsolePhase
}) {
  const logRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    const log = logRef.current
    if (log) log.scrollTop = log.scrollHeight
  }, [lines])

  return (
    <section className="h-48 bg-surface-container-lowest border border-outline-variant flex flex-col relative panel-brackets">
      <div className="absolute -top-3 left-4 bg-surface-container-lowest px-2 border border-outline-variant border-b-0 text-on-surface-variant font-label-caps text-label-caps z-10 uppercase">
        CONSOLE_OUTPUT
      </div>
      <div
        className="flex-1 p-4 pt-6 overflow-y-auto font-code text-[12px] leading-tight text-on-surface-variant"
        id="console-log"
        ref={logRef}
      >
        {lines.map((line, index) => (
          <div key={index}>
            {line.map((segment, segmentIndex) =>
              segment.className ? (
                <span className={segment.className} key={segmentIndex}>
                  {segment.text}
                </span>
              ) : (
                <span key={segmentIndex}>{segment.text}</span>
              ),
            )}
          </div>
        ))}
        {phase === 'idle' && <div className="animate-pulse">_ Awaiting test execution...</div>}
        {phase === 'done' && <div className="animate-pulse">_</div>}
      </div>
    </section>
  )
}
