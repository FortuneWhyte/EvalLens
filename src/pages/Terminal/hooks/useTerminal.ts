import { useCallback, useState } from 'react'
import { banner, commands, type TerminalLine } from '../../../data/terminal'

/** Command buffer, history and dispatch for the Terminal screen. */
export function useTerminal() {
  const [lines, setLines] = useState<TerminalLine[]>(banner)
  const [history, setHistory] = useState<string[]>([])
  /** index into history while arrowing back through it; -1 means "not browsing" */
  const [historyIndex, setHistoryIndex] = useState(-1)

  const submit = useCallback((raw: string) => {
    const input = raw.trim()
    if (input === '') return

    setHistory((current) => [...current, input])
    setHistoryIndex(-1)

    const [name, ...args] = input.split(/\s+/)
    const command = commands.find((entry) => entry.name === name.toLowerCase())

    if (name.toLowerCase() === 'clear') {
      setLines([])
      return
    }

    const echo: TerminalLine = { kind: 'input', text: `> ${input}` }
    const output: TerminalLine[] = command
      ? command.run(args)
      : [{ kind: 'error', text: `command not found: ${name}. Type 'help' for the list.` }]

    setLines((current) => [...current, echo, ...output])
  }, [])

  /** Step back (-1) or forward (1) through submitted commands. */
  const recall = useCallback(
    (direction: -1 | 1) => {
      if (history.length === 0) return null
      const next =
        historyIndex === -1
          ? direction === -1
            ? history.length - 1
            : -1
          : Math.min(history.length - 1, Math.max(-1, historyIndex - direction))
      setHistoryIndex(next)
      return next === -1 ? '' : history[next]
    },
    [history, historyIndex],
  )

  return { lines, submit, recall }
}
