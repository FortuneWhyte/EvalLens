import { useState } from 'react'
import Footer from '../../components/ui/Footer'
import ScanlineOverlay from '../../components/ui/ScanlineOverlay'
import SideNavBar from '../../components/navigation/SideNavBar'
import TopNavBar from '../../components/navigation/TopNavBar'
import DatasetDetails from './components/DatasetDetails'
import DatasetList from './components/DatasetList'
import TagManagerModal from './components/TagManagerModal'

export default function Datasets() {
  const [taggingRowId, setTaggingRowId] = useState<string | null>(null)

  return (
    <div className="page-datasets bg-background text-on-surface grid-bg min-h-screen flex flex-col antialiased selection:bg-primary-fixed-dim selection:text-surface">
      {/* CRT Scanlines Overlay */}
      <ScanlineOverlay />
      <TopNavBar variant="explorer" />
      <div className="flex flex-1 overflow-hidden relative">
        <SideNavBar variant="explorer" />
        {/* Main Canvas */}
        <main className="flex-1 flex flex-col h-full overflow-hidden p-gutter md:p-margin relative">
          {/* Header Section */}
          <div className="flex flex-col md:flex-row justify-between items-start md:items-end mb-8 gap-4 border-b border-outline-variant pb-4">
            <div>
              <h1 className="font-headline-lg text-headline-lg text-primary-fixed-dim mb-2 neon-green">
                // DATASET_EXPLORER
              </h1>
              <div className="cyber-input-wrapper w-full md:w-96 mt-4">
                <input
                  className="cyber-input font-code text-code"
                  placeholder="FIND_DATASET..."
                  type="text"
                />
              </div>
            </div>
            <button className="cyber-button px-6 py-3 font-label-caps text-label-caps flex items-center gap-2">
              <span className="material-symbols-outlined text-[18px]">add</span>[ +_ADD_SOURCE ]
            </button>
          </div>
          {/* Two-Column Grid */}
          <div className="flex-1 grid grid-cols-1 lg:grid-cols-12 gap-gutter lg:gap-margin min-h-0">
            <DatasetList />
            <DatasetDetails onEditTags={setTaggingRowId} />
          </div>
        </main>
      </div>
      {taggingRowId && (
        <TagManagerModal onClose={() => setTaggingRowId(null)} rowId={taggingRowId} />
      )}
      <Footer variant="links" />
    </div>
  )
}
