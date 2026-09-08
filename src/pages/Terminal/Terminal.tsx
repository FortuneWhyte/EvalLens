import { useEffect, useRef, useState } from 'react'
import Footer from '../../components/ui/Footer'
import ScanlineOverlay from '../../components/ui/ScanlineOverlay'
import SideNavBar from '../../components/navigation/SideNavBar'
import TopNavBar from '../../components/navigation/TopNavBar'
import type { TerminalLine } from '../../data/terminal'
import { useTerminal } from './hooks/useTerminal'

const lineStyles: Record<TerminalLine['kind'], string> = {
  input: 'text-primary-fixed-dim',
  output: 'text-on-surface',
  error: 'text-error',
  hint: 'text-on-surface-variant/70',
}

export default function Terminal() {
  const { lines, submit, recall } = useTerminal()
  const [draft, setDraft] = useState('')
  const bufferRef = useRef<HTMLDivElement>(null)
  const inputRef = useRef<HTMLInputElement>(null)

  useEffect(() => {
    const buffer = bufferRef.current
    if (buffer) buffer.scrollTop = buffer.scrollHeight
  }, [lines])

  return (
    <div className="page-datasets bg-background text-on-surface grid-bg min-h-screen flex flex-col antialiased selection:bg-primary-fixed-dim selection:text-surface">
      <ScanlineOverlay />
      <TopNavBar variant="explorer" />
      <div className="flex flex-1 overflow-hidden relative">
        <SideNavBar variant="explorer" />
        <main className="flex-1 flex flex-col h-full overflow-hidden p-gutter md:p-margin relative">
          <div className="mb-6 border-b border-outline-variant pb-4">
            <h1 className="font-headline-lg text-headline-lg text-primary-fixed-dim mb-2 neon-green">
              // CONTROL_TERMINAL
            </h1>
            <p className="font-code text-code text-on-surface-variant">
              OPERATOR_01 @ evallens :: type `help` for commands
            </p>
          </div>

          <div
            className="flex-1 flex flex-col cyber-panel relative overflow-hidden min-h-0 cursor-text"
            onClick={() => inputRef.current?.focus()}
          >
            <div className="absolute -top-[10px] right-4 bg-surface px-2 border border-outline-variant text-[10px] text-on-surface-variant font-code tracking-widest">
              TTY.0
            </div>
            <div
              className="flex-1 overflow-auto p-4 font-code text-[12px] leading-relaxed relative bg-surface-container-lowest"
              ref={bufferRef}
            >
              <div
                className="absolute inset-0 opacity-5 pointer-events-none"
                style={{
                  backgroundImage:
                    'repeating-linear-gradient(0deg, transparent, transparent 2px, #fff 2px, #fff 4px)',
                }}
              ></div>
              <div className="relative z-10">
                {lines.map((line, index) => (
                  <div className={`whitespace-pre-wrap ${lineStyles[line.kind]}`} key={index}>
                    {line.text}
                  </div>
                ))}
              </div>
            </div>
            <form
              className="border-t border-outline-variant bg-surface-container-low flex items-center px-4 py-3 gap-2"
              onSubmit={(event) => {
                event.preventDefault()
                submit(draft)
                setDraft('')
              }}
            >
              <span className="text-primary-fixed-dim font-code text-[13px] shrink-0">
                operator@evallens:~$
              </span>
              <input
                autoFocus
                className="flex-1 bg-transparent border-none outline-none font-code text-[13px] text-on-surface"
                onChange={(event) => setDraft(event.target.value)}
                onKeyDown={(event) => {
                  if (event.key === 'ArrowUp' || event.key === 'ArrowDown') {
                    event.preventDefault()
                    const recalled = recall(event.key === 'ArrowUp' ? -1 : 1)
                    if (recalled !== null) setDraft(recalled)
                  }
                }}
                ref={inputRef}
                spellCheck={false}
                value={draft}
              />
              <span className="cursor-blink bg-primary-fixed-dim w-2 h-4 inline-block shrink-0"></span>
            </form>
          </div>
        </main>
      </div>
      <Footer variant="links" />
    </div>
  )
}
