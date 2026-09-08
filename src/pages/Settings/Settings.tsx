import { useState } from 'react'
import Footer from '../../components/ui/Footer'
import ScanlineOverlay from '../../components/ui/ScanlineOverlay'
import SideNavBar from '../../components/navigation/SideNavBar'
import TopNavBar from '../../components/navigation/TopNavBar'
import { apiKeys, judgeSettings, spendLimit, toggles } from '../../data/settings'
import SettingsSection from './components/SettingsSection'

export default function Settings() {
  const [enabled, setEnabled] = useState<Record<string, boolean>>(() =>
    Object.fromEntries(toggles.map((toggle) => [toggle.label, toggle.enabled])),
  )
  const [cap, setCap] = useState(spendLimit.cap)

  const capNumber = Number(cap) || 0
  const usedPercent = capNumber > 0 ? Math.min(100, (spendLimit.used / capNumber) * 100) : 100

  return (
    <div className="page-datasets bg-background text-on-surface grid-bg min-h-screen flex flex-col antialiased selection:bg-primary-fixed-dim selection:text-surface">
      <ScanlineOverlay />
      <TopNavBar variant="explorer" />
      <div className="flex flex-1 overflow-hidden relative">
        <SideNavBar variant="explorer" />
        <main className="flex-1 flex flex-col h-full overflow-y-auto p-gutter md:p-margin relative pb-16">
          <div className="mb-6 border-b border-outline-variant pb-4">
            <h1 className="font-headline-lg text-headline-lg text-primary-fixed-dim mb-2 neon-green">
              // SYSTEM_SETTINGS
            </h1>
            <p className="font-code text-code text-on-surface-variant">
              OPERATOR_01 :: changes apply to every subsequent run
            </p>
          </div>

          <div className="grid grid-cols-1 xl:grid-cols-2 gap-gutter lg:gap-margin">
            <SettingsSection title="// API_KEYS">
              {apiKeys.map((key) => (
                <div
                  className="flex items-center justify-between gap-4 border border-outline-variant/50 p-3"
                  key={key.provider}
                >
                  <div className="min-w-0">
                    <div className="font-label-caps text-[10px] text-on-surface-variant mb-1">
                      {key.provider}
                    </div>
                    <div className="font-code text-[12px] text-on-surface truncate">
                      {key.masked}
                    </div>
                  </div>
                  <div className="flex items-center gap-3 shrink-0">
                    <span
                      className={`font-code text-[11px] flex items-center gap-1 ${
                        key.status === 'ACTIVE' ? 'text-primary-fixed-dim' : 'text-error'
                      }`}
                    >
                      {key.status === 'ACTIVE' && <span className="status-blinker w-2 h-2"></span>}
                      {key.status}
                    </span>
                    <button className="cyber-button-secondary px-3 py-1 font-label-caps text-[10px]">
                      {key.status === 'ACTIVE' ? '[ ROTATE ]' : '[ ADD ]'}
                    </button>
                  </div>
                </div>
              ))}
            </SettingsSection>

            <SettingsSection title="// SPEND_LIMIT">
              <div>
                <label className="font-label-caps text-[10px] text-on-surface-variant mb-2 block">
                  MONTHLY_CAP_USD
                </label>
                <div className="cyber-input-wrapper">
                  <input
                    className="cyber-input font-code text-code"
                    onChange={(event) => setCap(event.target.value)}
                    type="text"
                    value={cap}
                  />
                </div>
              </div>
              <div>
                <div className="flex justify-between font-code text-[11px] mb-2">
                  <span className="text-on-surface-variant">{spendLimit.period}</span>
                  <span className="text-tertiary-fixed-dim">
                    ${spendLimit.used.toFixed(2)} / ${capNumber.toFixed(2)}
                  </span>
                </div>
                <div className="h-3 border border-outline-variant bg-surface-container-lowest relative overflow-hidden">
                  <div
                    className="h-full bg-primary-fixed-dim/60 shadow-[0_0_8px_rgba(0,230,57,0.6)] transition-all"
                    style={{ width: `${usedPercent}%` }}
                  ></div>
                </div>
                <p className="font-code text-[11px] text-on-surface-variant mt-3 leading-relaxed">
                  Runs are refused once the cap is reached. Local models are exempt: they cost
                  electricity, not tokens.
                </p>
              </div>
            </SettingsSection>

            <SettingsSection title="// JUDGE_CONFIG">
              {judgeSettings.map((setting) => (
                <div className="border border-outline-variant/50 p-3" key={setting.label}>
                  <div className="flex justify-between items-center gap-4 mb-1">
                    <span className="font-label-caps text-[10px] text-on-surface-variant">
                      {setting.label}
                    </span>
                    <span className="font-code text-[12px] text-secondary-fixed-dim">
                      {setting.value}
                    </span>
                  </div>
                  <p className="font-code text-[11px] text-on-surface-variant/70 leading-relaxed">
                    {setting.hint}
                  </p>
                </div>
              ))}
            </SettingsSection>

            <SettingsSection title="// RUN_GUARDRAILS">
              {toggles.map((toggle) => (
                <button
                  className="flex items-start justify-between gap-4 border border-outline-variant/50 p-3 text-left hover:border-primary-fixed-dim/60 transition-colors"
                  key={toggle.label}
                  onClick={() =>
                    setEnabled((current) => ({
                      ...current,
                      [toggle.label]: !current[toggle.label],
                    }))
                  }
                >
                  <div className="min-w-0">
                    <div className="font-label-caps text-[10px] text-on-surface mb-1">
                      {toggle.label}
                    </div>
                    <p className="font-code text-[11px] text-on-surface-variant/70 leading-relaxed">
                      {toggle.hint}
                    </p>
                  </div>
                  <span
                    className={`shrink-0 font-code text-[11px] border px-2 py-1 ${
                      enabled[toggle.label]
                        ? 'text-primary-fixed-dim border-primary-fixed-dim bg-primary-container/10'
                        : 'text-on-surface-variant border-outline-variant'
                    }`}
                  >
                    {enabled[toggle.label] ? 'ON' : 'OFF'}
                  </span>
                </button>
              ))}
            </SettingsSection>
          </div>

          <div className="mt-6 flex flex-wrap gap-4 justify-end">
            <button className="cyber-button-secondary px-4 py-2 font-label-caps text-[12px]">
              [ REVERT ]
            </button>
            <button className="cyber-button px-4 py-2 font-label-caps text-[12px]">
              [ SAVE_SETTINGS ]
            </button>
            <button className="cyber-button-danger px-4 py-2 font-label-caps text-[12px] ml-auto md:ml-8">
              [ PURGE_ALL_RUNS ]
            </button>
          </div>
        </main>
      </div>
      <Footer variant="links" />
    </div>
  )
}
