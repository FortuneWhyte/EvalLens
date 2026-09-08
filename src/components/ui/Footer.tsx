type FooterVariant = 'ticker' | 'links' | 'ide'

/**
 * Docked footer. The Dashboard runs a scrolling system ticker; the Dataset
 * Explorer and Prompt IDE dock a static status line with utility links.
 */
export default function Footer({ variant }: { variant: FooterVariant }) {
  if (variant === 'ticker') return <TickerFooter />
  if (variant === 'ide') return <IdeFooter />
  return <LinksFooter />
}

function TickerFooter() {
  return (
    <footer className="fixed bottom-0 w-full bg-surface-container-lowest border-t border-outline-variant py-1 z-50 overflow-hidden after:content-[''] after:absolute after:inset-0 after:bg-[linear-gradient(transparent_50%,black_50%)] after:bg-[length:100%_2px] after:pointer-events-none after:opacity-10">
      <div className="ticker-wrap font-code text-code text-on-surface-variant/70 px-4">
        <div className="ticker">
          &gt; SYS_LOAD: 12% | LATENCY_AVG: 240ms | BUFFER_STABLE | API_QUOTA: 84% | MEMORY:
          4GB/16GB | ACTIVE_NODES: 3 | LAST_SYNC: 0.04s AGO | (C) 2024 EVAL_LENS // SYSTEM_STABLE
          &gt; SYS_LOAD: 12% | LATENCY_AVG: 240ms | BUFFER_STABLE
        </div>
      </div>
    </footer>
  )
}

function LinksFooter() {
  return (
    <footer className="bg-surface-container-lowest border-t border-outline-variant fixed bottom-0 w-full flex justify-between items-center px-margin py-2 z-50 overflow-hidden after:content-[''] after:absolute after:inset-0 after:bg-[linear-gradient(transparent_50%,black_50%)] after:bg-[length:100%_2px] after:pointer-events-none after:opacity-10">
      <div className="font-display text-label-caps text-primary">
        (C) 2024 EVAL_LENS // SYSTEM_STABLE
      </div>
      <div className="flex gap-4 font-code text-code text-on-surface-variant">
        <a className="hover:text-surface-tint" href="#">
          SYS_STATUS
        </a>
        <a className="hover:text-surface-tint" href="#">
          API_REF
        </a>
        <a className="hover:text-surface-tint" href="#">
          LEGAL
        </a>
      </div>
    </footer>
  )
}

function IdeFooter() {
  return (
    <footer className="fixed bottom-0 w-full flex justify-between items-center px-margin py-2 z-50 overflow-hidden after:content-[''] after:absolute after:inset-0 after:bg-[linear-gradient(transparent_50%,black_50%)] after:bg-[length:100%_2px] after:pointer-events-none after:opacity-10 bg-surface-container-lowest dark:bg-surface-container-lowest text-primary-fixed-dim dark:text-primary-fixed-dim font-code text-code border-t border-outline-variant">
      <div>(C) 2024 EVAL_LENS // SYSTEM_STABLE</div>
      <div className="flex gap-4">
        <a className="text-on-surface-variant hover:text-surface-tint" href="#">
          SYS_STATUS
        </a>
        <a className="text-on-surface-variant hover:text-surface-tint" href="#">
          API_REF
        </a>
        <a className="text-on-surface-variant hover:text-surface-tint" href="#">
          LEGAL
        </a>
      </div>
      <div className="font-display text-label-caps text-primary"></div>
    </footer>
  )
}
