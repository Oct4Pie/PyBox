import React, {
  useState,
  useEffect,
  useCallback,
  forwardRef,
  useImperativeHandle
} from 'react'
import AceEditor from 'react-ace'
import { useFilesystem } from '../context/FilesystemContext'
import { useToast, Center, useColorMode } from '@chakra-ui/react'
import { useHotkeys } from 'react-hotkeys-hook'

import 'ace-builds/src-noconflict/mode-python'
import 'ace-builds/src-noconflict/theme-one_dark'
import 'ace-builds/src-noconflict/snippets/python'
import 'ace-builds/src-noconflict/ext-language_tools'
import 'ace-builds/src-noconflict/ext-searchbox'
import 'ace-builds/src-noconflict/theme-chrome'
import 'ace-builds/src-noconflict/ace'
import ace from 'ace-builds/src-noconflict/ace'

ace.config.set('basePath', '/')

interface EditorProps {
  activeFile: string
  markFileAsUnsaved: (filename: string) => void
}

const Editor = forwardRef((props: EditorProps, ref) => {
  const { activeFile, markFileAsUnsaved } = props
  const { sharedDir } = useFilesystem()
  const [value, setValue] = useState('')
  const [loading, setLoading] = useState(true)
  const [hasUnsavedChanges, setHasUnsavedChanges] = useState(false)
  const { colorMode } = useColorMode()
  const toast = useToast()

  // Load file content
  const loadFileContent = useCallback(async () => {
    if (!activeFile) return
    setLoading(true)
    const filePath = `runner/${activeFile}`
    console.log(`Loading file: ${filePath}`)
    try {
      const contentBytes = await sharedDir.readFile(filePath)
      const content = new TextDecoder().decode(contentBytes)
      setValue(content)
      setHasUnsavedChanges(false)
      console.log(`File loaded successfully: ${filePath}`)
    } catch (err: any) {
      // If the file doesn't exist, create it
      if (err.message.includes('No such file or directory')) {
        await sharedDir.writeFile(filePath, new TextEncoder().encode(''))
        setValue('')
        setHasUnsavedChanges(false)
        console.log(`Created new file: ${filePath}`)
      } else {
        console.error('Error loading file:', err)
        toast({
          title: 'Error Loading File',
          description: err.message,
          status: 'error',
          duration: 5000,
          isClosable: true
        })
      }
    } finally {
      setLoading(false)
    }
  }, [activeFile, sharedDir, toast])

  useEffect(() => {
    loadFileContent()
  }, [loadFileContent, activeFile])

  const saveToFile = useCallback(async () => {
    const filePath = `runner/${activeFile}`
    console.log(`Attempting to save file: ${filePath}`)
    try {
      try {
        await sharedDir.removeFile(filePath)
        console.log(`Existing file deleted: ${filePath}`)
      } catch (err) {
        console.log(`File does not exist, no need to delete: ${filePath}`)
      }

      await sharedDir.writeFile(filePath, new TextEncoder().encode(value))
      console.log(`File saved successfully: ${filePath}`)

      const savedContentBytes = await sharedDir.readFile(filePath)
      const decodedContent = new TextDecoder().decode(savedContentBytes)
      console.log('decodedContent:', decodedContent)
      console.log('value:', value)
      if (decodedContent !== value) {
        throw new Error('File content does not match after saving.')
      }

      setHasUnsavedChanges(false)

      toast({
        title: 'File Saved',
        description: `File '${activeFile}' has been saved.`,
        status: 'success',
        duration: 2000,
        isClosable: true
      })
    } catch (err: any) {
      console.error('Error writing file:', err)
      toast({
        title: 'Save Error',
        description: err.message,
        status: 'error',
        duration: 5000,
        isClosable: true
      })
    }
  }, [activeFile, sharedDir, value, toast])

  useImperativeHandle(ref, () => ({
    saveFile: async () => {
      await saveToFile()
    }
  }))

  const handleManualSave = useCallback(async () => {
    if (hasUnsavedChanges) {
      await saveToFile()
    } else {
      toast({
        title: 'No changes to save.',
        status: 'info',
        duration: 2000,
        isClosable: true
      })
    }
  }, [hasUnsavedChanges, saveToFile, toast])

  useHotkeys(
    'ctrl+s, cmd+s',
    event => {
      event.preventDefault()
      handleManualSave()
    },
    [handleManualSave]
  )

  const handleChange = (newValue: string) => {
    setValue(newValue)
    if (!hasUnsavedChanges) {
      setHasUnsavedChanges(true)
      markFileAsUnsaved(activeFile)
      console.log(`File marked as having unsaved changes: ${activeFile}`)
    }
  }

  if (loading) {
    return <Center h='100%'>Loading Editor...</Center>
  }

  return (
    <AceEditor
      mode='python'
      theme={colorMode === 'dark' ? 'one_dark' : 'chrome'}
      onChange={handleChange}
      value={value}
      name='python-editor'
      editorProps={{ $blockScrolling: true }}
      width='100%'
      height='100%'
      fontSize={14}
      showPrintMargin={false}
      showGutter={true}
      highlightActiveLine={true}
      wrapEnabled={true}
      setOptions={{
        enableBasicAutocompletion: true,
        enableLiveAutocompletion: true,
        enableSnippets: true,
        showLineNumbers: true,
        tabSize: 4,
        useWorker: true
      }}
    />
  )
})

export default Editor
