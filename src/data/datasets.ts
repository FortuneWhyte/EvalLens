/** Seed content for the Dataset Explorer, lifted from datasets/code.html. */

export interface DatasetSummary {
  name: string
  rows: string
  updated: string
  selected: boolean
  badge: {
    label: string
    /** 'blinker' and 'blinker-cyan' draw a pulsing square; 'icon' draws a Material glyph */
    indicator: 'blinker' | 'blinker-cyan' | 'icon'
    icon?: string
    classes: string
  }
  titleClasses: string
}

export const datasetSummaries: DatasetSummary[] = [
  {
    name: 'customer_support_v2',
    rows: 'ROWS: 1,240',
    updated: 'UPD: 2024-10-24 14:32',
    selected: true,
    badge: {
      label: 'SYNCED',
      indicator: 'blinker',
      classes: 'text-primary-fixed-dim border-primary-fixed-dim bg-primary-container/10',
    },
    titleClasses: 'text-primary-fixed-dim',
  },
  {
    name: 'medical_qa_gold',
    rows: 'ROWS: 45,000',
    updated: 'UPD: 2024-09-12 09:11',
    selected: false,
    badge: {
      label: 'LOCAL',
      indicator: 'blinker-cyan',
      classes: 'text-secondary-fixed border-secondary-fixed bg-secondary-container/10',
    },
    titleClasses: 'text-secondary-fixed group-hover:neon-cyan',
  },
  {
    name: 'ecommerce_intent_raw',
    rows: 'ROWS: 8,902',
    updated: 'UPD: 2024-10-20 18:05',
    selected: false,
    badge: {
      label: 'OFFLINE',
      indicator: 'icon',
      icon: 'cloud_off',
      classes: 'text-tertiary-fixed-dim border-tertiary-fixed-dim bg-tertiary-container/10',
    },
    titleClasses: 'text-secondary-fixed',
  },
]

export interface DatasetStat {
  label: string
  value: string
  unit?: string
  valueClasses: string
}

export const datasetStats: DatasetStat[] = [
  { label: 'TOTAL_ROWS', value: '1,240', valueClasses: 'text-primary-fixed-dim' },
  { label: 'TOKEN_COUNT', value: '~48.2K', valueClasses: 'text-secondary-fixed' },
  { label: 'AVG_LENGTH', value: '142', unit: 'chars', valueClasses: 'text-tertiary-fixed-dim' },
  { label: 'UNIQUE_KEYS', value: '04', valueClasses: 'text-on-surface' },
]

export interface DatasetSample {
  id: string
  input: string
  expected: string
  tags: string[]
}

export const datasetSamples: DatasetSample[] = [
  {
    id: '001',
    input: '"How do I reset my router?"',
    expected: '"1. Unplug power. 2. Wait 30s. 3. Replug."',
    tags: ['hardware'],
  },
  {
    id: '002',
    input: '"Billing error on my invoice #992"',
    expected: '"Transferring to billing agent immediately."',
    tags: ['billing', 'urgent'],
  },
  {
    id: '003',
    input: '"What are your business hours?"',
    expected: '"We are open 9AM - 5PM EST, Mon-Fri."',
    tags: ['general'],
  },
  {
    id: '004',
    input: '"Can I cancel my subscription mid-month?"',
    expected: '"Yes, refunds are prorated automatically."',
    tags: ['account'],
  },
]

export interface TagOption {
  name: string
  checked: boolean
  /** panel + text colours for the tag chip inside the tag manager */
  panelClasses: string
  textClasses: string
}

export const tagOptions: TagOption[] = [
  {
    name: 'billing',
    checked: true,
    panelClasses: 'border-primary-fixed-dim bg-primary-container/10',
    textClasses: 'text-primary-fixed-dim',
  },
  {
    name: 'urgent',
    checked: true,
    panelClasses: 'border-tertiary-fixed-dim bg-tertiary-container/10',
    textClasses: 'text-tertiary-fixed-dim',
  },
  {
    name: 'hardware',
    checked: false,
    panelClasses: 'opacity-60 hover:opacity-100',
    textClasses: 'text-on-surface-variant',
  },
  {
    name: 'pii_risk',
    checked: false,
    panelClasses: 'opacity-60 hover:opacity-100',
    textClasses: 'text-on-surface-variant',
  },
  {
    name: 'edge_case',
    checked: false,
    panelClasses: 'border-secondary-fixed bg-secondary-container/10',
    textClasses: 'text-secondary-fixed',
  },
]
