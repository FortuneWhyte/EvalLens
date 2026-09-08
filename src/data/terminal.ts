/**
 * Command definitions for the Terminal screen. Responses are canned, but the
 * command set mirrors the operations the backend will actually expose, so the
 * screen doubles as a sketch of the eventual CLI surface.
 */

export interface TerminalLine {
  kind: 'input' | 'output' | 'error' | 'hint'
  text: string
}

export const banner: TerminalLine[] = [
  { kind: 'output', text: 'EvalLens control terminal :: build 0.1.0' },
  { kind: 'hint', text: "Type 'help' for available commands." },
]

export interface CommandSpec {
  name: string
  usage: string
  summary: string
  run: (args: string[]) => TerminalLine[]
}

const runsTable = [
  'ID         DATASET                MODEL           STATUS    COST',
  'EVL-1042   customer_support_v2    gpt-4-turbo     DONE      $1.02',
  'EVL-1043   medical_qa_gold        claude-3-opus   RUNNING   $0.41',
  'EVL-1044   ecommerce_intent_raw   llama-3-70b     QUEUED    $0.00',
  'EVL-1041   customer_support_v2    gpt-3.5-turbo   FAILED    $0.04',
]

export const commands: CommandSpec[] = [
  {
    name: 'help',
    usage: 'help',
    summary: 'List available commands.',
    run: () => [
      { kind: 'output', text: 'Available commands:' },
      ...commands.map((command) => ({
        kind: 'output' as const,
        text: `  ${command.usage.padEnd(28)} ${command.summary}`,
      })),
    ],
  },
  {
    name: 'runs',
    usage: 'runs',
    summary: 'List recent evaluation runs.',
    run: () => runsTable.map((text) => ({ kind: 'output' as const, text })),
  },
  {
    name: 'run',
    usage: 'run <dataset> [--model <id>]',
    summary: 'Queue an evaluation run.',
    run: (args) => {
      if (args.length === 0) {
        return [{ kind: 'error', text: 'run: missing dataset. Usage: run <dataset> [--model <id>]' }]
      }
      const modelIndex = args.indexOf('--model')
      const model = modelIndex >= 0 ? args[modelIndex + 1] : 'gpt-4.1-mini'
      if (modelIndex >= 0 && !model) {
        return [{ kind: 'error', text: 'run: --model requires a model id' }]
      }
      return [
        { kind: 'output', text: `Queued EVL-1045 :: dataset=${args[0]} model=${model}` },
        { kind: 'output', text: 'Judge: gpt-4-turbo-2024-04-09 (temperature 0.0, rubric r3)' },
        { kind: 'hint', text: "Watch progress with 'logs' or on the EVALS screen." },
      ]
    },
  },
  {
    name: 'models',
    usage: 'models',
    summary: 'Show the configured model registry.',
    run: () => [
      { kind: 'output', text: 'gpt-4-turbo-2024-04-09   OPENAI      JUDGE       READY' },
      { kind: 'output', text: 'gpt-4.1-mini             OPENAI      CANDIDATE   READY' },
      { kind: 'output', text: 'claude-3-opus            ANTHROPIC   CANDIDATE   READY' },
      { kind: 'output', text: 'llama-3-70b              OLLAMA      CANDIDATE   LOCAL' },
    ],
  },
  {
    name: 'cost',
    usage: 'cost',
    summary: 'Report spend against the monthly cap.',
    run: () => [
      { kind: 'output', text: 'October 2024 :: $18.40 of $50.00 cap (36.8%)' },
      { kind: 'output', text: 'Last run EVL-1042 :: $1.02 across 200 calls' },
      { kind: 'hint', text: 'Local models are exempt from the cap.' },
    ],
  },
  {
    name: 'clear',
    usage: 'clear',
    summary: 'Clear the screen.',
    run: () => [],
  },
]
