import type { ReactNode } from 'react'

/** A titled panel, matching the bracketed-label treatment used across the app. */
export default function SettingsSection({
  title,
  children,
}: {
  title: string
  children: ReactNode
}) {
  return (
    <section className="cyber-panel relative flex flex-col">
      <div className="p-4 border-b border-outline-variant bg-surface-container-high/50">
        <h2 className="font-headline-md text-[16px] text-primary-fixed-dim neon-green m-0">
          {title}
        </h2>
      </div>
      <div className="p-6 flex flex-col gap-4">{children}</div>
    </section>
  )
}
