import PanelBrackets from '../../../components/ui/PanelBrackets'

/** The "SCORES_OVER_TIME" panel: a gridded well with a glowing SVG trend line. */
export default function ScoresChart() {
  return (
    <section className="relative bg-surface-container-low border border-outline-variant p-1 shadow-[0_0_15px_rgba(0,0,0,0.5)]">
      <PanelBrackets color="bg-outline-variant" />
      <div className="bg-surface-container-lowest h-64 chart-grid relative overflow-hidden flex items-center justify-center border border-surface-container">
        <div className="absolute top-2 left-2 bg-surface-container-highest px-2 py-1 border border-outline-variant">
          <span className="font-label-caps text-label-caps text-on-surface">// SCORES_OVER_TIME</span>
        </div>
        {/* SVG Chart Mock */}
        <svg
          className="w-full h-full absolute inset-0 opacity-80"
          preserveAspectRatio="none"
          viewBox="0 0 1000 200"
        >
          <defs>
            <linearGradient id="neon-glow" x1="0%" x2="100%" y1="0%" y2="0%">
              <stop offset="0%" stopColor="#00e639" stopOpacity="0.8"></stop>
              <stop offset="50%" stopColor="#00e639" stopOpacity="1"></stop>
              <stop offset="100%" stopColor="#00e639" stopOpacity="0.8"></stop>
            </linearGradient>
            <filter height="140%" id="glow" width="140%" x="-20%" y="-20%">
              <feGaussianBlur result="blur" stdDeviation="3"></feGaussianBlur>
              <feComposite in="SourceGraphic" in2="blur" operator="over"></feComposite>
            </filter>
          </defs>
          <path
            d="M 0,150 Q 50,140 100,100 T 200,120 T 300,80 T 400,110 T 500,40 T 600,90 T 700,50 T 800,70 T 900,30 T 1000,60"
            fill="none"
            filter="url(#glow)"
            stroke="url(#neon-glow)"
            strokeWidth="3"
          ></path>
        </svg>
      </div>
    </section>
  )
}
