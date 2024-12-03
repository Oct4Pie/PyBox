import React, { Suspense } from 'react'
import { PanelGroup, Panel, PanelResizeHandle } from 'react-resizable-panels'
import { Box, Center } from '@chakra-ui/react'
import Spinner from './Spinner'
import FileSystem from './FileSystem'

const EditorAndBottomPanels = React.lazy(() => import('./EditorPanels'))

interface MainLayoutProps {
  fileExplorerSize: number
  setFileExplorerSize: (size: number) => void
  panelBgColor: string
  activeFile: string
  openFiles: string[]
  setActiveFile: (file: string) => void
  handleFileSelect: (file: string) => void
  unsavedFiles: Set<string>
  handleCloseFile: (file: string) => void
  handleRenameFile: (oldName: string, newName: string) => void
  handleAddNewFile: () => void
  markFileAsUnsaved: (file: string) => void
  handleSaveFile: () => Promise<void>
  isBottomPanelVisible: boolean
  setIsBottomPanelVisible: (visible: boolean) => void
  activeBottomPanel: string
  setActiveBottomPanel: (panel: string) => void
  output: string
  clearOutput: () => void
  editorRef: React.RefObject<any>
}

const MainLayout: React.FC<MainLayoutProps> = ({
  fileExplorerSize,
  setFileExplorerSize,
  panelBgColor,
  activeFile,
  openFiles,
  setActiveFile,
  handleFileSelect,
  unsavedFiles,
  handleCloseFile,
  handleRenameFile,
  handleAddNewFile,
  markFileAsUnsaved,
  handleSaveFile,
  isBottomPanelVisible,
  setIsBottomPanelVisible,
  activeBottomPanel,
  setActiveBottomPanel,
  output,
  clearOutput,
  editorRef
}) => {
  return (
    <PanelGroup direction='horizontal' style={{ flex: 1, display: 'flex' }}>
      {/* File Explorer Panel */}
      <Panel
        defaultSize={fileExplorerSize}
        minSize={15}
        onResize={size => setFileExplorerSize(size)}
        className='panel-sidebar'
        style={{
          display: 'flex',
          flexDirection: 'column',
          backgroundColor: panelBgColor,
          overflow: 'hidden'
        }}
      >
        <Box h='100%' overflowY='auto' p={2} transition='background-color 0.3s'>
          <Suspense fallback={<Center><Spinner /></Center>}>
            <FileSystem
              onFileSelect={handleFileSelect}
              activeFile={activeFile}
              unsavedFiles={unsavedFiles}
            />
          </Suspense>
        </Box>
      </Panel>

      {/* Resize Handle */}
      <PanelResizeHandle
        className='resize-handle'
        style={{
          cursor: 'col-resize',
          backgroundColor: panelBgColor,
          width: '5px',
          transition: 'background-color 0.3s'
        }}
      />

      {/* Main Content Panel */}
      <Panel
        className='panel-main'
        style={{
          display: 'flex',
          flexDirection: 'column',
          overflow: 'hidden'
        }}
      >
        <Suspense fallback={<Center><Spinner /></Center>}>
          <EditorAndBottomPanels
            panelBgColor={panelBgColor}
            activeFile={activeFile}
            openFiles={openFiles}
            setActiveFile={setActiveFile}
            handleCloseFile={handleCloseFile}
            handleRenameFile={handleRenameFile}
            handleAddNewFile={handleAddNewFile}
            unsavedFiles={unsavedFiles}
            markFileAsUnsaved={markFileAsUnsaved}
            handleSaveFile={handleSaveFile}
            isBottomPanelVisible={isBottomPanelVisible}
            setIsBottomPanelVisible={setIsBottomPanelVisible}
            activeBottomPanel={activeBottomPanel}
            setActiveBottomPanel={setActiveBottomPanel}
            output={output}
            clearOutput={clearOutput}
            editorRef={editorRef}
          />
        </Suspense>
      </Panel>
    </PanelGroup>
  )
}

export default MainLayout
