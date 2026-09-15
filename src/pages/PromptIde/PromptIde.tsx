import Footer from '../../components/ui/Footer'
import SideNavBar from '../../components/navigation/SideNavBar'
import TopNavBar from '../../components/navigation/TopNavBar'
import ConsoleOutput from './components/ConsoleOutput'
import EditorPane from './components/EditorPane'
import ParametersPanel from './components/ParametersPanel'
import PromptVersions from './components/PromptVersions'
import { useConsoleStream } from './hooks/useConsoleStream'

export default function PromptIde() {
  const { lines, phase, runTest } = useConsoleStream()

  return (
    <div className="page-prompt-ide scanlines h-screen flex flex-col font-body-md text-on-surface relative">
      <TopNavBar variant="ide" />
      <div className="flex flex-1 overflow-hidden">
        <SideNavBar variant="ide" />
        {/* Main Content */}
        <main className="flex-1 flex flex-col h-full bg-[#0a0a0f] p-gutter gap-gutter overflow-y-auto lg:overflow-hidden">
          {/* Three panes side by side on desktop; stacked below lg, where 256px
              plus 288px of fixed side panes cannot fit beside an editor. */}
          <div className="flex-1 flex flex-col lg:flex-row gap-gutter min-h-0">
            <PromptVersions />
            <EditorPane onRunTest={runTest} />
            <ParametersPanel />
          </div>
          {/* Bottom Area: Console Output */}
          <ConsoleOutput lines={lines} phase={phase} />
        </main>
      </div>
      <Footer variant="ide" />
    </div>
  )
}
