import React, { useState, useEffect, useRef, Suspense } from 'react'
import {
  Flex,
  Center,
  Text,
  IconButton,
  Tooltip,
  useDisclosure,
  useBreakpointValue,
  useColorMode
} from '@chakra-ui/react'
import { ChevronDownIcon, ChevronUpIcon } from '@chakra-ui/icons'
import { HotKeys } from 'react-hotkeys'

import Spinner from './components/Spinner'
import usePyodide from './hooks/usePyodide'
import { useFilesystem } from './context/FilesystemContext'

import { keyMap, createHandlers } from './config/keyboardShortcuts'
import { useEditorState } from './hooks/useEditorState'
import { useThemeColors } from './theme/colors'
import { useHandlers } from './hooks/useHandlers'
import TopNavigationBar from './components/TopNavigationBar'

const PackageManagerDrawer = React.lazy(
  () => import('./components/PackageManagerDrawer')
)
const MainLayout = React.lazy(() => import('./components/MainLayout'))

const App: React.FC = () => {
  const { colorMode, toggleColorMode } = useColorMode()
  const isMobile = useBreakpointValue({ base: true, md: false }) || false
  const { bgColor, panelBgColor } = useThemeColors()

  const {
    openFiles,
    setOpenFiles,
    activeFile,
    setActiveFile,
    unsavedFiles,
    markFileAsUnsaved,
    markFileAsSaved
  } = useEditorState()

  const [output, setOutput] = useState<string>('')
  const [isRunning, setIsRunning] = useState<boolean>(false)
  const [isBottomPanelVisible, setIsBottomPanelVisible] =
    useState<boolean>(true)
  const [activeBottomPanel, setActiveBottomPanel] = useState<string>('Output')

  const { isLoading, error, runCode, installPackage, installedPackages } =
    usePyodide()
  const { refreshFS } = useFilesystem()
  const { isOpen, onOpen, onClose } = useDisclosure()

  const editorRef = useRef<any>(null)

  const {
    handleRunCode,
    handleFileSelect,
    handleInstallPackage,
    handleAddNewFile,
    handleCloseFile,
    toggleBottomPanel,
    handleManualSave,
    handleSaveFile,
    clearOutput,
    handleRenameFile
  } = useHandlers({
    activeFile,
    setActiveFile,
    openFiles,
    setOpenFiles,
    markFileAsSaved,
    markFileAsUnsaved,
    refreshFS,
    installPackage,
    runCode,
    setOutput,
    setIsRunning,
    isBottomPanelVisible,
    setIsBottomPanelVisible,
    setActiveBottomPanel,
    unsavedFiles,
    editorRef
  })

  const handlers = createHandlers(
    handleRunCode,
    handleAddNewFile,
    toggleBottomPanel,
    handleManualSave,
    onOpen
  )

  const [fileExplorerSize, setFileExplorerSize] = useState<number>(() => {
    return parseInt(localStorage.getItem('fileExplorerSize') || '20')
  })

  if (isLoading) {
    return (
      <Center h='100vh' bg={bgColor}>
        <Spinner />
        <Text ml={2}>Loading PyBox...</Text>
      </Center>
    )
  }

  if (error) {
    return (
      <Center h='100vh' bg={bgColor}>
        <Text color='red.500'>Error loading Pyodide: {error.message}</Text>
      </Center>
    )
  }

  return (
    <HotKeys keyMap={keyMap} handlers={handlers}>
      <Flex h='100vh' direction='column' bg={bgColor} overflow='hidden'>
        {/* Top Navigation Bar */}
        <TopNavigationBar
          isMobile={isMobile}
          colorMode={colorMode}
          toggleColorMode={toggleColorMode}
          onOpen={onOpen}
          handleRunCode={handleRunCode}
          handleManualSave={handleManualSave}
          isRunning={isRunning}
          unsavedFiles={unsavedFiles}
          activeFile={activeFile}
        />

        {/* Main Layout */}
        <Suspense fallback={<Center><Spinner /></Center>}>
          <MainLayout
            fileExplorerSize={fileExplorerSize}
            setFileExplorerSize={setFileExplorerSize}
            panelBgColor={panelBgColor}
            activeFile={activeFile}
            openFiles={openFiles}
            setActiveFile={setActiveFile}
            handleFileSelect={handleFileSelect}
            unsavedFiles={unsavedFiles}
            handleCloseFile={handleCloseFile}
            handleRenameFile={handleRenameFile}
            handleAddNewFile={handleAddNewFile}
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

        {/* Toggle Bottom Panel Button */}
        <Tooltip
          label='Toggle Bottom Panel (Ctrl+B)'
          aria-label='Toggle Bottom Panel'
        >
          <IconButton
            icon={
              isBottomPanelVisible ? <ChevronDownIcon /> : <ChevronUpIcon />
            }
            size='md'
            position='fixed'
            bottom={4}
            right={4}
            onClick={toggleBottomPanel}
            colorScheme='teal'
            isRound
            shadow='md'
            _hover={{ transform: 'scale(1.1)', bg: 'teal.600' }}
            transition='transform 0.2s, background-color 0.3s'
            aria-label='Toggle Bottom Panel'
          />
        </Tooltip>

        {/* Package Manager Drawer */}
        <Suspense fallback={<Center><Spinner /></Center>}>
          <PackageManagerDrawer
            isOpen={isOpen}
            onClose={onClose}
            onInstall={handleInstallPackage}
            installedPackages={installedPackages}
          />
        </Suspense>
      </Flex>
    </HotKeys>
  )
}

export default App
