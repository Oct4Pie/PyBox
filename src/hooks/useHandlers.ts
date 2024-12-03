import { useToast } from '@chakra-ui/react'
import { useFilesystem } from '../context/FilesystemContext'

interface UseHandlersParams {
  activeFile: string
  setActiveFile: React.Dispatch<React.SetStateAction<string>>
  openFiles: string[]
  setOpenFiles: React.Dispatch<React.SetStateAction<string[]>>
  markFileAsSaved: (filename: string) => void
  markFileAsUnsaved: (filename: string) => void
  refreshFS: () => Promise<void>
  installPackage: (packageName: string) => Promise<void>
  runCode: (filename: string) => Promise<string>
  setOutput: React.Dispatch<React.SetStateAction<string>>
  setIsRunning: React.Dispatch<React.SetStateAction<boolean>>
  isBottomPanelVisible: boolean
  setIsBottomPanelVisible: React.Dispatch<React.SetStateAction<boolean>>
  setActiveBottomPanel: React.Dispatch<React.SetStateAction<string>>
  unsavedFiles: Set<string>
  editorRef: React.RefObject<any>
}

export const useHandlers = ({
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
}: UseHandlersParams) => {
  const toast = useToast()
  const { sharedDir } = useFilesystem()

  const handleManualSave = async () => {
    if (editorRef.current && editorRef.current.saveFile) {
      await editorRef.current.saveFile()
      markFileAsSaved(activeFile)
    } else {
      console.error('Editor ref is not available.')
    }
  }

  const handleSaveFile = async () => {
    await handleManualSave()
  }

  const handleRunCode = async () => {
    if (!activeFile) {
      toast({
        title: 'No Active File',
        description: 'Please select a file to run.',
        status: 'warning',
        duration: 3000,
        isClosable: true
      })
      return
    }

    if (unsavedFiles.has(activeFile)) {
      await handleManualSave()
    }

    setIsRunning(true)
    try {
      const output = await runCode(activeFile)
      setOutput(output)
      if (!isBottomPanelVisible) {
        setIsBottomPanelVisible(true)
      }
      setActiveBottomPanel('Output')
    } catch (err: any) {
      console.error('Error running code:', err)
      toast({
        title: 'Execution Error',
        description: err.message || 'An error occurred while running the code.',
        status: 'error',
        duration: 5000,
        isClosable: true
      })
    } finally {
      setIsRunning(false)
    }
  }

  const handleFileSelect = (filename: string) => {
    setActiveFile(filename)

    setOpenFiles(prevOpenFiles => {
      if (!prevOpenFiles.includes(filename)) {
        return [...prevOpenFiles, filename]
      }
      return prevOpenFiles
    })
  }

  const handleInstallPackage = async (packageName: string) => {
    if (!packageName.trim()) {
      toast({
        title: 'Invalid Package Name',
        description: 'Package name cannot be empty.',
        status: 'warning',
        duration: 3000,
        isClosable: true
      })
      return
    }

    setIsRunning(true)
    try {
      await installPackage(packageName.trim())
      setOutput(`Package '${packageName.trim()}' installed successfully.`)
      toast({
        title: 'Package Installed',
        description: `Package '${packageName.trim()}' installed successfully.`,
        status: 'success',
        duration: 3000,
        isClosable: true
      })
      await refreshFS()
    } catch (error: any) {
      setOutput(
        `Error installing package '${packageName.trim()}': ${error.message}`
      )
      toast({
        title: 'Package Installation Error',
        description:
          error.message || 'An error occurred while installing the package.',
        status: 'error',
        duration: 5000,
        isClosable: true
      })
    } finally {
      setIsRunning(false)
    }
  }

  const handleAddNewFile = async () => {
    const newFile = `new_file${Date.now()}.py`
    try {
      await sharedDir.writeFile(
        `runner/${newFile}`,
        new TextEncoder().encode('')
      )
      setOpenFiles(prev => [...prev, newFile])
      setActiveFile(newFile)
      toast({
        title: 'New File Created',
        description: `File '${newFile}' has been created.`,
        status: 'info',
        duration: 3000,
        isClosable: true
      })
      await refreshFS()
      if (!isBottomPanelVisible) {
        setIsBottomPanelVisible(true)
      }
      setActiveBottomPanel('Output')
    } catch (err: any) {
      console.error('Error creating new file:', err)
      toast({
        title: 'Error Creating File',
        description:
          err.message || 'An error occurred while creating the file.',
        status: 'error',
        duration: 5000,
        isClosable: true
      })
    }
  }

  const handleCloseFile = (file: string) => {
    setOpenFiles(prev => {
      const newOpenFiles = prev.filter(f => f !== file)
      if (activeFile === file && newOpenFiles.length > 0) {
        setActiveFile(newOpenFiles[0])
      } else if (newOpenFiles.length === 0) {
        setActiveFile('')
      }
      return newOpenFiles
    })
    toast({
      title: 'File Closed',
      description: `File '${file}' has been closed.`,
      status: 'warning',
      duration: 3000,
      isClosable: true
    })
  }

  const toggleBottomPanel = () => {
    setIsBottomPanelVisible(prev => !prev)
    toast({
      title: isBottomPanelVisible
        ? 'Output Panel Hidden'
        : 'Output Panel Shown',
      status: 'info',
      duration: 2000,
      isClosable: true
    })
  }

  const clearOutput = () => {
    setOutput('')
    toast({
      title: 'Output Cleared',
      status: 'success',
      duration: 2000,
      isClosable: true
    })
  }

  const handleRenameFile = async (oldName: string, newName: string) => {
    try {
      const oldPath = `/home/runner/${oldName}`
      const newPath = `/home/runner/${newName}`
      const content = await sharedDir.readFile(oldPath)

      await sharedDir.writeFile(newPath, content)

      await sharedDir.removeFile(oldPath)

      setOpenFiles(prev => prev.map(f => (f === oldName ? newName : f)))
      if (activeFile === oldName) {
        setActiveFile(newName)
      }

      toast({
        title: 'File Renamed',
        description: `File '${oldName}' has been renamed to '${newName}'.`,
        status: 'success',
        duration: 3000,
        isClosable: true
      })

      await refreshFS()
    } catch (err: any) {
      console.error('Error renaming file:', err)
      toast({
        title: 'Rename Error',
        description:
          err.message || 'An error occurred while renaming the file.',
        status: 'error',
        duration: 5000,
        isClosable: true
      })
    }
  }

  return {
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
  }
}
