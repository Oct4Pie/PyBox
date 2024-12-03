import { useState } from 'react'

export const useEditorState = () => {
  const [openFiles, setOpenFiles] = useState<string[]>(['main.py'])
  const [activeFile, setActiveFile] = useState<string>('main.py')
  const [unsavedFiles, setUnsavedFiles] = useState<Set<string>>(new Set())

  const markFileAsUnsaved = (filename: string) => {
    setUnsavedFiles(prev => new Set(prev).add(filename))
  }

  const markFileAsSaved = (filename: string) => {
    setUnsavedFiles(prev => {
      const updated = new Set(prev)
      updated.delete(filename)
      return updated
    })
  }

  return {
    openFiles,
    setOpenFiles,
    activeFile,
    setActiveFile,
    unsavedFiles,
    markFileAsUnsaved,
    markFileAsSaved
  }
}
