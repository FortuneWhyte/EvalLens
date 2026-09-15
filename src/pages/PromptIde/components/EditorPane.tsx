/**
 * Centre pane: the SYSTEM_PROMPT.md buffer. The mockup renders the prompt as
 * pre-wrapped, syntax-tinted text, so the literal spacing is preserved here in
 * string expressions rather than JSX whitespace.
 */
export default function EditorPane({ onRunTest }: { onRunTest: () => void }) {
  return (
    <section className="flex-1 min-h-[320px] bg-surface-container-lowest border border-primary-fixed-dim flex flex-col relative panel-brackets shadow-[0_0_15px_rgba(0,230,57,0.1)]">
      <div className="flex justify-between items-center border-b border-primary-fixed-dim/30 bg-surface-container-low p-2">
        <div className="font-code text-code text-primary-fixed-dim flex items-center gap-2">
          <span className="material-symbols-outlined text-sm">description</span>
          // SYSTEM_PROMPT.md
        </div>
        <button
          className="pulse-glow border border-primary-fixed-dim text-primary-fixed bg-primary-fixed-dim/10 px-3 py-1 font-label-caps text-label-caps hover:bg-primary-fixed-dim/30 transition-colors flex items-center gap-1 uppercase"
          onClick={onRunTest}
        >
          <span className="material-symbols-outlined text-sm">play_arrow</span> RUN_TEST
        </button>
      </div>
      <div className="flex-1 p-4 overflow-y-auto font-code text-code bg-transparent outline-none resize-none text-on-surface whitespace-pre-wrap">
        <span className="text-outline-variant">
          {'/* \n * MAIN SYSTEM DIRECTIVE\n * VERSION: 1.2.4\n */'}
        </span>
        {'\n'}
        <span className="text-on-tertiary-container">You</span>
        {' are an advanced analytical engine.\nYour primary directive is to process the '}
        <span className="text-secondary-fixed-dim">{'{{user_input}}'}</span>
        {' \nand extract key entities.\n\n'}
        <span className="text-outline-variant">// Constraints</span>
        {'\n1. Do '}
        <span className="text-error">NOT</span>
        {' hallucinate data.\n2. Format output as strictly valid JSON.\n3. Use the context provided in '}
        <span className="text-secondary-fixed-dim">{'{{document_context}}'}</span>
        {'.\n\n'}
        <span className="text-outline-variant">// Execution Block</span>
        {'\nBEGIN PARSING SEQUENCE...\n'}
        <span className="text-primary-fixed-dim">&gt;</span>{' '}
        <span className="cursor-blink bg-primary-fixed-dim w-2 h-4 inline-block align-middle"></span>
      </div>
    </section>
  )
}
