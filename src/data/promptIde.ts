/** Seed content for the Prompt IDE, lifted from prompt_ide/code.html. */

export interface PromptVersion {
  version: string
  timestamp: string
  /** 'active' is the checked-out version, 'recent' is newer, 'archived' is older */
  state: 'active' | 'recent' | 'archived'
}

export const promptVersions: PromptVersion[] = [
  { version: 'v1.2.5', timestamp: '2024-05-12T14:32:01Z', state: 'recent' },
  { version: 'v1.2.4', timestamp: '2024-05-10T09:15:44Z', state: 'active' },
  { version: 'v1.2.3', timestamp: '2024-05-01T11:20:10Z', state: 'archived' },
  { version: 'v1.0.0', timestamp: '2024-01-15T00:00:00Z', state: 'archived' },
]

export interface ParameterSlider {
  label: string
  value: string
  min: number
  max: number
  step: number
  defaultValue: number
  minLabel: string
  maxLabel: string
}

export const parameterSliders: ParameterSlider[] = [
  {
    label: 'TEMPERATURE',
    value: '0.7',
    min: 0,
    max: 2,
    step: 0.1,
    defaultValue: 0.7,
    minLabel: '0.0 (PRECISE)',
    maxLabel: '2.0 (CREATIVE)',
  },
  {
    label: 'TOP_P',
    value: '0.9',
    min: 0,
    max: 1,
    step: 0.05,
    defaultValue: 0.9,
    minLabel: '0.0',
    maxLabel: '1.0',
  },
  {
    label: 'MAX_TOKENS',
    value: '2048',
    min: 256,
    max: 8192,
    step: 256,
    defaultValue: 2048,
    minLabel: '256',
    maxLabel: '8192',
  },
]

export const models = ['GPT-4-TURBO', 'CLAUDE-3-OPUS', 'LLAMA-3-70B']

export interface ConsoleSegment {
  text: string
  className?: string
}

/** A console row, split into segments so the mockup's inline colouring survives. */
export type ConsoleLine = ConsoleSegment[]

export const initialConsoleLines: ConsoleLine[] = [
  [{ text: '[SYS] Initializing validation sequence...' }],
  [
    { text: '[SYS] Loading context parameters... ' },
    { text: 'OK', className: 'text-primary-fixed-dim' },
  ],
  [{ text: '[CHK] Syntax scan initiated.' }],
  [
    { text: '[CHK] Variable interpolation... ' },
    { text: 'Found 2 markers.', className: 'text-secondary-fixed-dim' },
  ],
  [{ text: '[WARN] Temperature > 0.5 may cause format instability.' }],
]

/** Streamed into the console when RUN_TEST is pressed. */
export const testRunLines: ConsoleLine[] = [
  [{ text: '[EXEC] Sending payload to model...' }],
  [{ text: '[NET] Receiving stream...' }],
  [{ text: '[VAL] Parsing JSON output...' }],
  [
    { text: '[RES] ' },
    { text: 'Validation Passed.', className: 'text-primary-fixed-dim' },
    { text: ' Score: 0.98' },
  ],
  [{ text: '>_ Ready.' }],
]
