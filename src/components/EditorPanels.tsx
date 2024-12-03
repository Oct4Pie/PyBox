import React, { Suspense, useEffect, useState } from 'react'
import {
  Flex,
  Box,
  Tabs,
  Tooltip,
  TabList,
  TabPanels,
  TabPanel,
  Tab as ChakraTab,
  IconButton,
  Text,
  Center,
  Icon,
  useColorModeValue
} from '@chakra-ui/react'
import { PanelGroup, Panel, PanelResizeHandle } from 'react-resizable-panels'
import Spinner from './Spinner'
import Output from './Output'
import Tab from './Tab'
import {
  FaChartBar,
  FaCode,
  FaImage,
  FaTerminal,
  FaPython
} from 'react-icons/fa'
import { CloseIcon, AddIcon } from '@chakra-ui/icons'

const Editor = React.lazy(() => import('./Editor'))
const PythonRepl = React.lazy(() => import('./PythonRepl'))
const Terminal = React.lazy(() => import('./Terminal'))

interface EditorAndBottomPanelsProps {
  panelBgColor: string
  activeFile: string
  openFiles: string[]
  setActiveFile: (file: string) => void
  handleCloseFile: (file: string) => void
  handleRenameFile: (oldName: string, newName: string) => void
  handleAddNewFile: () => void
  unsavedFiles: Set<string>
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

const EditorAndBottomPanels: React.FC<EditorAndBottomPanelsProps> = ({
  panelBgColor,
  activeFile,
  openFiles,
  setActiveFile,
  handleCloseFile,
  handleRenameFile,
  handleAddNewFile,
  unsavedFiles,
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
  const [plotContent, setPlotContent] = useState<string | null>(null)

  useEffect(() => {
    const plotContainer = document.getElementById('plot-container')
    ;(document as any).pyodideMplTarget = plotContainer
    if (plotContent && plotContent.indexOf('matplotlib_') !== -1) {
      plotContainer!.innerHTML = plotContent
    }
  }, [])

  useEffect(() => {
    const plotContainer = (document as any).pyodideMplTarget
    if (plotContainer) {
      if (plotContent && plotContent.indexOf('matplotlib_') !== -1) {
        plotContainer.innerHTML = plotContent
      }

      const observer = new MutationObserver(() => {
        const lastChild = Array.from(plotContainer.children).at(-1)
        const content = lastChild ? lastChild.innerHTML.trim() : ''
        if (!content) {
          setPlotContent(null)
        } else {
          if (content.indexOf('matplotlib_') !== -1) {
            setPlotContent(content)
          }
        }
      })

      observer.observe(plotContainer, { childList: true, subtree: true })

      return () => observer.disconnect()
    }
  }, [plotContent])

  const getActiveTabIndex = () => {
    switch (activeBottomPanel) {
      case 'Output':
        return 0
      case 'Visual':
        return 1
      case 'Terminal':
        return 2
      case 'Python REPL':
        return 3
      default:
        return 0
    }
  }

  return (
    <Flex direction='column' h='100%'>
      {/* Breadcrumb Navigation */}
      <Box
        bg={panelBgColor}
        borderBottom='1px'
        borderColor='gray.300'
        px={4}
        py={2}
        transition='background-color 0.3s'
      >
        {/* BreadcrumbNavigation Component */}
      </Box>

      {/* Tabs */}
      <Box
        bg={panelBgColor}
        borderBottom='1px'
        borderColor='gray.300'
        px={4}
        py={1}
        transition='background-color 0.3s'
      >
        <Flex alignItems='center' overflowX='auto'>
          <Tabs
            variant='soft-rounded'
            colorScheme='teal'
            isLazy
            index={openFiles.indexOf(activeFile)}
            onChange={index => setActiveFile(openFiles[index])}
          >
            <TabList>
              {openFiles.map(file => (
                <Tab
                  key={file}
                  filename={file}
                  isActive={activeFile === file}
                  onClick={() => setActiveFile(file)}
                  onClose={() => handleCloseFile(file)}
                  onRename={handleRenameFile}
                  hasUnsavedChanges={unsavedFiles.has(file)}
                />
              ))}
            </TabList>
          </Tabs>
          {/* Move "Add New File" button outside of TabList */}
          <Tooltip label='Add New File' aria-label='Add New File Tooltip'>
            <IconButton
              icon={<AddIcon />}
              size='xs'
              variant='ghost'
              aria-label='Add New File'
              onClick={e => {
                e.stopPropagation()
                handleAddNewFile()
              }}
              _hover={{ bg: 'teal.500', color: 'white' }}
              ml={2}
            />
          </Tooltip>
        </Flex>
      </Box>

      <PanelGroup direction='vertical' style={{ flex: 1, display: 'flex' }}>
        <Panel
          minSize={1}
          className='panel-editor'
          style={{
            display: 'flex',
            flexDirection: 'column',
            overflow: 'hidden'
          }}
        >
          <Box position='relative' h='100%'>
            <Suspense fallback={<Spinner />}>
              <Editor
                ref={editorRef}
                activeFile={activeFile}
                markFileAsUnsaved={markFileAsUnsaved}
              />
            </Suspense>
          </Box>
        </Panel>

        {/* Conditionally Render PanelResizeHandle and Bottom Panel */}
        {
          <>
            <PanelResizeHandle
              className='resize-handle-horizontal'
              style={{
                display: isBottomPanelVisible ? 'flex' : 'none',
                cursor: 'row-resize',
                backgroundColor: panelBgColor,
                height: '5px'
              }}
            />

            <Panel
              defaultSize={30}
              minSize={5}
              className='panel-bottom'
              style={{
                display: isBottomPanelVisible ? 'flex' : 'none',
                flexDirection: 'column',
                backgroundColor: panelBgColor,
                overflow: 'hidden'
              }}
            >
              {/* Bottom Panels Content */}
              <Box h='100%' overflow='hidden'>
                <Tabs
                  variant='enclosed'
                  size='sm'
                  index={getActiveTabIndex()}
                  onChange={index => {
                    const panels = [
                      'Output',
                      'Visual',
                      'Terminal',
                      'Python REPL'
                    ]
                    setActiveBottomPanel(panels[index])
                  }}
                >
                  <Flex alignItems='center'>
                    <TabList>
                      <ChakraTab>
                        <Flex align='center'>
                          <FaCode size={16} style={{ marginRight: '8px' }} />
                          Output
                        </Flex>
                      </ChakraTab>
                      <ChakraTab>
                        <Flex align='center'>
                          <FaImage size={16} style={{ marginRight: '8px' }} />
                          Visual
                        </Flex>
                      </ChakraTab>
                      <ChakraTab>
                        <Flex align='center'>
                          <FaTerminal
                            size={16}
                            style={{ marginRight: '8px' }}
                          />
                          Terminal
                        </Flex>
                      </ChakraTab>
                      <ChakraTab>
                        <Flex align='center'>
                          <FaPython size={16} style={{ marginRight: '8px' }} />
                          Python REPL
                        </Flex>
                      </ChakraTab>
                    </TabList>
                    <IconButton
                      aria-label='Close Panel'
                      icon={<CloseIcon />}
                      size='sm'
                      onClick={() => setIsBottomPanelVisible(false)}
                      ml='auto'
                      variant='ghost'
                      _hover={{ bg: 'red.500', color: 'white' }}
                      mt={1}
                      mr={2}
                    />
                  </Flex>
                  <TabPanels>
                    <TabPanel p='2'>
                      {output ? (
                        <Output output={output} clearOutput={clearOutput} />
                      ) : (
                        <Center h='100%'>
                          <Flex
                            direction='column'
                            align='center'
                            color='gray.500'
                          >
                            <FaCode
                              size={50}
                              style={{ marginBottom: '16px' }}
                            />
                            <Text fontSize='md' mb={2}>
                              Run your code
                            </Text>
                            <Text fontSize='sm'>
                              Results of your code will appear here when you run
                              the project.
                            </Text>
                          </Flex>
                        </Center>
                      )}
                    </TabPanel>
                    <TabPanel p='2' overflow='scroll' maxH='65vh'>
                      <Box
                        w='100%'
                        h='100%'
                        borderRadius='md'
                        overflow='auto'
                        boxShadow='sm'
                        display='flex'
                        flexDirection='column'
                        alignItems='center'
                        justifyContent='center'
                        textAlign='center'
                        fontSize='sm'
                      >
                        {plotContent &&
                          plotContent.indexOf('matplotlib_') === -1 && (
                            <>
                              <Icon
                                as={FaChartBar}
                                boxSize={10}
                                mb={2}
                                color='gray.500'
                              />
                              <Text color='gray.500'>
                                Render a graph and it will show here
                              </Text>
                            </>
                          )}
                        <Box
                          id='plot-container'
                          w='95%'
                          h='100%'
                          borderRadius='md'
                          overflow='auto'
                          boxShadow='sm'
                          display='flex'
                          flexDirection='column'
                          alignItems='center'
                          justifyContent='center'
                          textAlign='center'
                          fontSize='sm'
                        >
                          {plotContent &&
                          plotContent.includes('matplotlib_') ? null : (
                            <Text
                              color={useColorModeValue('gray.500', 'gray.300')}
                              textAlign='center'
                              my={4}
                            >
                              <Icon as={FaChartBar} boxSize={10} mb={2} />
                              <br />
                              When a graph is rendered into the container, it
                              will show here
                            
                            </Text>
                          )}
                        </Box>
                      </Box>
                    </TabPanel>

                    <TabPanel p='2'>
                      <Suspense fallback={<Spinner />}>
                        <Terminal />
                      </Suspense>
                    </TabPanel>
                    <TabPanel p='2'>
                      <Suspense fallback={<Spinner />}>
                        <PythonRepl />
                      </Suspense>
                    </TabPanel>
                  </TabPanels>
                </Tabs>
              </Box>
            </Panel>
          </>
        }
      </PanelGroup>
    </Flex>
  )
}

export default EditorAndBottomPanels
