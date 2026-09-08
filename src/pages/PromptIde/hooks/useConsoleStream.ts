import { useEffect, useState } from 'react'
import { initialConsoleLines, testRunLines, type ConsoleLine } from '../../../data/promptIde'
import type { ConsolePhase } from '../components/ConsoleOutput'

/**
 * Replaces the mockup's inline <script>: pressing RUN_TEST drops the
 * "awaiting" line and streams the test-run log one entry every 400ms.
 */
export function useConsoleStream() {
  const [lines, setLines] = useState<ConsoleLine[]>(initialConsoleLines)
  const [phase, setPhase] = useState<ConsolePhase>('idle')

  useEffect(() => {
    if (phase !== 'running') return

    let index = 0
    const interval = setInterval(() => {
      if (index < testRunLines.length) {
        const next = testRunLines[index]
        setLines((current) => [...current, next])
        index += 1
      } else {
        clearInterval(interval)
        setPhase('done')
      }
    }, 400)

    return () => clearInterval(interval)
  }, [phase])

  const runTest = () => setPhase('running')

  return { lines, phase, runTest }
}
