import React, { useState, useEffect, useCallback } from 'react'
import {
  Box,
  HStack,
  Heading,
  Input,
  IconButton,
  List,
  ListItem,
  Text,
  useColorModeValue,
  Tooltip,
  useToast,
  Collapse
} from '@chakra-ui/react'
import { AddIcon, EditIcon, DeleteIcon, DownloadIcon } from '@chakra-ui/icons'
import {
  FaFolderOpen,
  FaFolder,
  FaFileAlt,
  FaDotCircle,
  FaFileDownload
} from 'react-icons/fa'

import { TiExport } from 'react-icons/ti'
import { useFilesystem } from '../context/FilesystemContext'
import { renameFile, renameDir } from '../sharedFileSystem'
import JSZip from 'jszip'
import dayjs from 'dayjs'

interface FileSystemProps {
  onFileSelect: (filename: string) => void
  activeFile: string
  unsavedFiles: Set<string>
}

interface FileSystemEntry {
  name: string
  path: string
  type: 'file' | 'dir'
  children?: FileSystemEntry[]
}

const FileSystem: React.FC<FileSystemProps> = ({
  onFileSelect,
  activeFile,
  unsavedFiles
}) => {
  const { sharedDir, refreshFS } = useFilesystem()
  const [fileSystemTree, setFileSystemTree] = useState<FileSystemEntry[]>([])
  const [newName, setNewName] = useState('')
  const [renamingItem, setRenamingItem] = useState<string | null>(null)
  const [renameValue, setRenameValue] = useState('')
  const [expandedDirs, setExpandedDirs] = useState<Set<string>>(new Set())
  const [creatingInDirectory, setCreatingInDirectory] = useState<string | null>(
    null
  )
  const [newItemName, setNewItemName] = useState('')
  const toast = useToast()

  const readDirRecursive = useCallback(
    async (dirPath: string): Promise<FileSystemEntry[]> => {
      try {
        const entries = await sharedDir.readDir(dirPath)
        const result: FileSystemEntry[] = []

        for (const entry of entries) {
          const entryPath = `${dirPath}/${entry.name}`
          if (entry.type === 'dir') {
            const children = await readDirRecursive(entryPath)
            result.push({
              name: entry.name,
              path: entryPath,
              type: 'dir',
              children
            })
          } else if (entry.type === 'file') {
            result.push({ name: entry.name, path: entryPath, type: 'file' })
          }
        }
        return result
      } catch (err: any) {
        console.error('Error reading directory:', err)
        toast({
          title: 'Error Reading Directory',
          description: err.message,
          status: 'error',
          duration: 3000,
          isClosable: true
        })
        return []
      }
    },
    [sharedDir, toast]
  )

  const updateFileList = useCallback(async () => {
    const tree = await readDirRecursive('runner')
    setFileSystemTree(tree)
  }, [readDirRecursive])

  useEffect(() => {
    updateFileList()
    const interval = setInterval(() => {
      updateFileList()
    }, 5000)
    return () => clearInterval(interval)
  }, [updateFileList])

  const ensureParentDirectoriesExist = async (path: string) => {
    const pathSegments = path.split('/')
    pathSegments.pop()
    let currentPath = ''
    for (const segment of pathSegments) {
      if (segment === '') continue
      currentPath += '/' + segment
      try {
        await sharedDir.createDir(currentPath)
      } catch (err) {}
    }
  }

  const handleCreate = async () => {
    const trimmedName = newName.trim()
    if (!trimmedName) {
      toast({
        title: 'Name cannot be empty.',
        status: 'warning',
        duration: 3000,
        isClosable: true
      })
      return
    }

    const isDirectory = trimmedName.endsWith('/')
    const finalName = isDirectory ? trimmedName.slice(0, -1) : trimmedName

    const path = `runner/${finalName}`

    try {
      await ensureParentDirectoriesExist(path)

      if (isDirectory) {
        await sharedDir.createDir(path)
        toast({
          title: `Directory '${finalName}' created.`,
          status: 'success',
          duration: 2000,
          isClosable: true
        })
      } else {
        await sharedDir.writeFile(path, new TextEncoder().encode(''))
        toast({
          title: `File '${finalName}' created.`,
          status: 'success',
          duration: 2000,
          isClosable: true
        })
      }
      setNewName('')
      await refreshFS()
      updateFileList()
    } catch (err: any) {
      console.error('Error creating:', err)
      toast({
        title: 'Error creating item.',
        description: err.message,
        status: 'error',
        duration: 3000,
        isClosable: true
      })
    }
  }

  const saveAs = (blob: Blob, filename: string) => {
    const url = window.URL.createObjectURL(blob)
    const a = document.createElement('a')
    a.href = url
    a.download = filename
    a.click()
    window.URL.revokeObjectURL(url)
  }

  const handleCreateInDirectory = async (parentPath: string) => {
    const trimmedName = newItemName.trim()
    if (!trimmedName) {
      toast({
        title: 'Name cannot be empty.',
        status: 'warning',
        duration: 3000,
        isClosable: true
      })
      return
    }

    const isDirectory = trimmedName.endsWith('/')
    const finalName = isDirectory ? trimmedName.slice(0, -1) : trimmedName

    const path = `${parentPath}/${finalName}`

    try {
      await ensureParentDirectoriesExist(path)

      if (isDirectory) {
        await sharedDir.createDir(path)
        toast({
          title: `Directory '${finalName}' created.`,
          status: 'success',
          duration: 2000,
          isClosable: true
        })
      } else {
        await sharedDir.writeFile(path, new TextEncoder().encode(''))
        toast({
          title: `File '${finalName}' created.`,
          status: 'success',
          duration: 2000,
          isClosable: true
        })
      }
      setNewItemName('')
      setCreatingInDirectory(null)
      await refreshFS()
      updateFileList()
    } catch (err: any) {
      console.error('Error creating:', err)
      toast({
        title: 'Error creating item.',
        description: err.message,
        status: 'error',
        duration: 3000,
        isClosable: true
      })
    }
  }

  const handleRename = (path: string) => {
    setRenamingItem(path)
    setRenameValue(path.split('/').pop() || '')
  }

  const handleRenameSubmit = async () => {
    if (!renamingItem) return
    const trimmedNewName = renameValue.trim()
    const oldName = renamingItem.split('/').pop() || ''
    if (!trimmedNewName || trimmedNewName === oldName) {
      setRenamingItem(null)
      setRenameValue('')
      return
    }

    const isDirectory = renamingItem.endsWith('/')
    const parentPath = renamingItem.substring(0, renamingItem.lastIndexOf('/'))
    const newPath = `${parentPath}/${trimmedNewName}`

    try {
      await ensureParentDirectoriesExist(newPath)

      if (isDirectory) {
        await renameDir(renamingItem, newPath)
      } else {
        await renameFile(renamingItem, newPath)
      }

      setRenamingItem(null)
      setRenameValue('')
      toast({
        title: `Renamed to '${trimmedNewName}'.`,
        status: 'success',
        duration: 2000,
        isClosable: true
      })

      await refreshFS()
      updateFileList()

      if (activeFile === renamingItem) {
        onFileSelect(newPath)
      }
    } catch (err: any) {
      console.error('Error renaming:', err)
      toast({
        title: 'Error renaming.',
        description: err.message,
        status: 'error',
        duration: 3000,
        isClosable: true
      })
    }
  }

  const handleDelete = async (path: string) => {
    try {
      const isFile = path.split('/').pop()?.includes('.') ?? false
      if (isFile) {
        await sharedDir.removeFile(path)
      } else {
        await deleteDirectoryRecursively(path)
      }

      await refreshFS()
      updateFileList()

      if (activeFile === path) {
        onFileSelect('')
      }

      toast({
        title: `Removed '${path}'.`,
        status: 'success',
        duration: 2000,
        isClosable: true
      })
    } catch (err: any) {
      console.error('Error deleting:', err)
      toast({
        title: 'Error deleting.',
        description: err.message,
        status: 'error',
        duration: 3000,
        isClosable: true
      })
    }
  }

  const deleteDirectoryRecursively = async (dirPath: string) => {
    const entries = await sharedDir.readDir(dirPath)
    for (const entry of entries) {
      const entryPath = `${dirPath}/${entry.name}`
      if (entry.type === 'dir') {
        await deleteDirectoryRecursively(entryPath)
      } else {
        await sharedDir.removeFile(entryPath)
      }
    }
    await sharedDir.removeDir(dirPath)
  }

  const toggleDirectory = (dirPath: string) => {
    const newExpandedDirs = new Set(expandedDirs)
    if (newExpandedDirs.has(dirPath)) {
      newExpandedDirs.delete(dirPath)
    } else {
      newExpandedDirs.add(dirPath)
    }
    setExpandedDirs(newExpandedDirs)
  }

  const handleFileSelectInternal = (path: string) => {
    const relativePath = path.startsWith('runner/')
      ? path.slice('runner/'.length)
      : path
    onFileSelect(relativePath)
  }

  const handleDragStart = (event: React.DragEvent, entry: FileSystemEntry) => {
    event.stopPropagation()
    event.dataTransfer.setData('application/json', JSON.stringify(entry))
    event.dataTransfer.effectAllowed = 'move'
  }

  const handleDragOver = (event: React.DragEvent) => {
    event.preventDefault()
    event.dataTransfer.dropEffect = 'move'
  }

  const handleDrop = async (
    event: React.DragEvent,
    destination: FileSystemEntry
  ) => {
    event.preventDefault()
    event.stopPropagation()

    const data = event.dataTransfer.getData('application/json')
    const sourceEntry: FileSystemEntry = JSON.parse(data)

    if (sourceEntry.path === destination.path) {
      return
    }

    const isSubPath = (parentPath: string, childPath: string) => {
      if (childPath === parentPath) return true
      return childPath.startsWith(parentPath + '/')
    }

    if (isSubPath(sourceEntry.path, destination.path)) {
      toast({
        title: 'Invalid Move',
        description: 'Cannot move a directory into itself or its subdirectory.',
        status: 'warning',
        duration: 3000,
        isClosable: true
      })
      return
    }

    const destinationPath =
      destination.type === 'dir'
        ? destination.path
        : destination.path.substring(0, destination.path.lastIndexOf('/'))

    const newPath = `${destinationPath}/${sourceEntry.name}`

    try {
      if (sourceEntry.type === 'file') {
        await renameFile(sourceEntry.path, newPath)
      } else {
        await renameDir(sourceEntry.path, newPath)
      }

      toast({
        title: 'Item Moved',
        description: `Moved '${sourceEntry.name}' to '${destinationPath}'`,
        status: 'success',
        duration: 2000,
        isClosable: true
      })

      await refreshFS()
      updateFileList()
    } catch (err: any) {
      console.error('Error moving item:', err)
      toast({
        title: 'Error Moving Item',
        description: err.message,
        status: 'error',
        duration: 3000,
        isClosable: true
      })
    }
  }

  const handleDragEnter = (event: React.DragEvent) => {
    event.preventDefault()
    event.stopPropagation()
  }

  const handleDragLeave = (event: React.DragEvent) => {
    event.preventDefault()
    event.stopPropagation()
  }

  const handleFileUpload = async (files: FileList, path: string) => {
    for (const file of Array.from(files)) {
      const filePath = `${path}/${file.name}`

      await ensureParentDirectoriesExist(filePath)

      const content = await file.arrayBuffer()
      await sharedDir.writeFile(filePath, new Uint8Array(content))
    }
    toast({
      title: 'Files Uploaded',
      description: 'Your files have been uploaded successfully.',
      status: 'success',
      duration: 2000,
      isClosable: true
    })
    await refreshFS()
    updateFileList()
  }

  const handleDirectoryUpload = async (
    items: DataTransferItemList,
    path: string
  ) => {
    const traverseFileTree = async (entry: any, currentPath: string) => {
      if (entry.isFile) {
        const file = await new Promise<File>((resolve, reject) =>
          entry.file(resolve, reject)
        )
        const filePath = `${currentPath}/${file.name}`

        await ensureParentDirectoriesExist(filePath)

        const content = await file.arrayBuffer()
        await sharedDir.writeFile(filePath, new Uint8Array(content))
      } else if (entry.isDirectory) {
        const dirPath = `${currentPath}/${entry.name}`

        try {
          await sharedDir.createDir(dirPath)
        } catch (err) {}

        const dirReader = entry.createReader()
        let entries: any[] = []

        const readEntries = async () => {
          return new Promise<any[]>((resolve, reject) =>
            dirReader.readEntries(resolve, reject)
          )
        }

        let batch: any[]
        do {
          batch = await readEntries()
          entries = entries.concat(batch)
        } while (batch.length > 0)

        for (const childEntry of entries) {
          await traverseFileTree(childEntry, dirPath)
        }
      }
    }

    for (let i = 0; i < items.length; i++) {
      const entry = items[i].webkitGetAsEntry()
      if (entry) {
        await traverseFileTree(entry, path)
      }
    }

    toast({
      title: 'Directories Uploaded',
      description: 'Your directories have been uploaded successfully.',
      status: 'success',
      duration: 2000,
      isClosable: true
    })
    await refreshFS()
    updateFileList()
  }

  const handleDropUpload = async (event: React.DragEvent, path: string) => {
    event.preventDefault()
    event.stopPropagation()

    const files = event.dataTransfer.files
    const items = event.dataTransfer.items

    if (items.length > 0) {
      const hasDirectory = Array.from(items).some(item => {
        const entry = item.webkitGetAsEntry()
        return entry && entry.isDirectory
      })

      if (hasDirectory) {
        await handleDirectoryUpload(items, path)
      } else {
        await handleFileUpload(files, path)
      }
    }
  }

  const handleExport = async (entry: FileSystemEntry) => {
    try {
      if (entry.type === 'file') {
        const content = await sharedDir.readFile(entry.path)
        const blob = new Blob([content])
        saveAs(blob, entry.name)

        toast({
          title: 'Export Successful',
          description: `${entry.name} has been exported.`,
          status: 'success',
          duration: 3000,
          isClosable: true
        })
      } else if (entry.type === 'dir') {
        const zip = new JSZip()

        const addToZip = async (
          zipFolder: JSZip,
          dirEntry: FileSystemEntry
        ) => {
          if (dirEntry.type === 'file') {
            const content = await sharedDir.readFile(dirEntry.path)
            zipFolder.file(dirEntry.name, content)
          } else if (dirEntry.type === 'dir' && dirEntry.children) {
            const folder = zipFolder.folder(dirEntry.name)!
            for (const child of dirEntry.children) {
              await addToZip(folder, child)
            }
          }
        }

        await addToZip(zip, entry)

        const content = await zip.generateAsync({ type: 'blob' })
        saveAs(content, `${entry.name}.zip`)

        toast({
          title: 'Export Successful',
          description: `Directory '${entry.name}' has been exported as a ZIP.`,
          status: 'success',
          duration: 3000,
          isClosable: true
        })
      }
    } catch (err: any) {
      console.error('Error exporting entry:', err)
      toast({
        title: 'Export Failed',
        description: err.message || 'An error occurred during export.',
        status: 'error',
        duration: 3000,
        isClosable: true
      })
    }
  }

  const handleExportAll = async () => {
    const zip = new JSZip()

    const addToZip = async (zipFolder: JSZip, dirPath: string) => {
      const entries = await sharedDir.readDir(dirPath)
      for (const entry of entries) {
        const entryPath = `${dirPath}/${entry.name}`
        if (entry.type === 'file') {
          const content = await sharedDir.readFile(entryPath)
          zipFolder.file(entryPath.replace('runner/', ''), content)
        } else if (entry.type === 'dir') {
          const folder = zip.folder(entryPath.replace('runner/', ''))!
          await addToZip(folder, entryPath)
        }
      }
    }

    try {
      await addToZip(zip, 'runner')

      const content = await zip.generateAsync({ type: 'blob' })
      const timestamp = dayjs().format('YYYY-MM-DD_HH-mm-ss')
      const filename = `PyBox_${timestamp}.zip`
      saveAs(content, filename)

      toast({
        title: 'Export Successful',
        description: `All files have been exported as ${filename}`,
        status: 'success',
        duration: 3000,
        isClosable: true
      })
    } catch (err: any) {
      console.error('Error exporting all files:', err)
      toast({
        title: 'Export Failed',
        description: err.message || 'An error occurred while exporting files.',
        status: 'error',
        duration: 3000,
        isClosable: true
      })
    }
  }

  const renderFileSystemEntry = (entry: FileSystemEntry) => {
    const isDir = entry.type === 'dir'
    const isExpanded = expandedDirs.has(entry.path)

    const entryName = entry.name
    const displayEntryName =
      renamingItem === entry.path ? (
        <Input
          value={renameValue}
          onChange={e => setRenameValue(e.target.value)}
          onBlur={handleRenameSubmit}
          onKeyPress={e => e.key === 'Enter' && handleRenameSubmit()}
          size='sm'
          autoFocus
        />
      ) : (
        <Text
          isTruncated
          flex='1'
          ml='2'
          onClick={() =>
            isDir
              ? toggleDirectory(entry.path)
              : handleFileSelectInternal(entry.path)
          }
          cursor={isDir ? 'pointer' : 'default'}
          _hover={{ textDecoration: isDir ? 'underline' : 'none' }}
        >
          {entryName}
        </Text>
      )

    const renderAddItemInput = (parentPath: string) => (
      <HStack mt='2' pl='4'>
        <Input
          value={newItemName}
          onChange={e => setNewItemName(e.target.value)}
          placeholder='new_file.py or new_directory/'
          onKeyPress={e =>
            e.key === 'Enter' && handleCreateInDirectory(parentPath)
          }
          size='sm'
        />
        <Tooltip label='Create File or Directory'>
          <IconButton
            icon={<AddIcon />}
            onClick={() => handleCreateInDirectory(parentPath)}
            aria-label='Create File or Directory'
            size='sm'
            colorScheme='teal'
          />
        </Tooltip>
      </HStack>
    )

    const icon = isDir ? (isExpanded ? FaFolderOpen : FaFolder) : FaFileAlt

    return (
      <ListItem
        key={entry.path}
        p='2'
        bg={activeFile === entry.path ? 'teal.600' : 'transparent'}
        borderRadius='md'
        _hover={{ bg: 'teal.700', cursor: 'pointer' }}
        transition='background 0.2s'
        draggable
        onDragStart={e => handleDragStart(e, entry)}
        onDragOver={handleDragOver}
        onDrop={e => handleDrop(e, entry)}
        onDragEnter={handleDragEnter}
        onDragLeave={handleDragLeave}
        onDoubleClick={() => isDir && toggleDirectory(entry.path)}
        onClick={() => !isDir && handleFileSelectInternal(entry.path)}
        onDropCapture={e => handleDropUpload(e, entry.path)}
      >
        <HStack spacing='1'>
          <Box as={icon} />
          {displayEntryName}
          {unsavedFiles.has(entry.path) && (
            <Box
              as={FaDotCircle}
              color='red.500'
              ml={1}
              w='6px'
              h='6px'
              borderRadius='full'
            />
          )}
          {isDir && (
            <Tooltip label='Add File/Directory'>
              <IconButton
                icon={<AddIcon />}
                size='xs'
                onClick={e => {
                  e.stopPropagation()
                  setCreatingInDirectory(entry.path)
                }}
                aria-label='Add File or Directory'
                variant='ghost'
              />
            </Tooltip>
          )}
          <Tooltip label='Rename'>
            <IconButton
              icon={<EditIcon />}
              size='xs'
              onClick={e => {
                e.stopPropagation()
                handleRename(entry.path)
              }}
              aria-label='Rename'
              variant='ghost'
            />
          </Tooltip>
          <Tooltip label='Delete'>
            <IconButton
              icon={<DeleteIcon />}
              size='xs'
              onClick={e => {
                e.stopPropagation()
                handleDelete(entry.path)
              }}
              aria-label='Delete'
              variant='ghost'
            />
          </Tooltip>
          <Tooltip label='Download'>
            <IconButton
              icon={<DownloadIcon />}
              size='xs'
              onClick={e => {
                e.stopPropagation()
                handleExport(entry)
              }}
              aria-label='Download'
              variant='ghost'
            />
          </Tooltip>
        </HStack>
        {creatingInDirectory === entry.path && renderAddItemInput(entry.path)}
        {isDir && (
          <Collapse in={isExpanded} animateOpacity>
            <Box mt='2' pl='4'>
              <List spacing='2'>
                {entry.children &&
                  entry.children.map(child => renderFileSystemEntry(child))}
              </List>
            </Box>
          </Collapse>
        )}
      </ListItem>
    )
  }

  const bgColor = useColorModeValue('gray.100', 'gray.900')

  interface HTMLInputProps extends React.InputHTMLAttributes<HTMLInputElement> {
    webkitdirectory?: string
  }

  return (
    <Box
      w='100%'
      bg={bgColor}
      p='4'
      borderRight='1px'
      borderColor='gray.600'
      overflowY='auto'
      h='100vh'
      onDragOver={handleDragOver}
      onDrop={e => handleDropUpload(e, 'runner')}
    >
      <HStack mb='4' justifyContent='space-between'>
        <HStack>
          <Box as={FaFolderOpen} />
          <Heading size='md'>File Explorer</Heading>
          <Tooltip label='Upload'>
            <IconButton
              icon={<FaFileDownload />}
              aria-label='Upload'
              size='sm'
              variant='ghost'
              onClick={() => {
                document.getElementById('file-upload-input')?.click()
              }}
            />
          </Tooltip>
          <input
            id='file-upload-input'
            type='file'
            style={{ display: 'none' }}
            multiple
            ref={input => input && (input.webkitdirectory = true)}
            onChange={(e: React.ChangeEvent<HTMLInputElement>) => {
              const files = e.target.files
              if (files) {
                handleFileUpload(files, 'runner')
              }
            }}
          />
        </HStack>
        <Tooltip label='Export All Files'>
          <IconButton
            icon={<TiExport size={20} />}
            aria-label='Export All Files'
            size='sm'
            variant='ghost'
            onClick={handleExportAll}
          />
        </Tooltip>
      </HStack>
      <HStack mb='4'>
        <Input
          value={newName}
          onChange={e => setNewName(e.target.value)}
          placeholder='new_file.py or new_directory/'
          onKeyPress={e => e.key === 'Enter' && handleCreate()}
          size='sm'
        />
        <Tooltip label='Create File or Directory'>
          <IconButton
            icon={<AddIcon />}
            onClick={handleCreate}
            aria-label='Create File or Directory'
            size='sm'
            colorScheme='teal'
          />
        </Tooltip>
      </HStack>
      <List spacing='2'>
        {fileSystemTree.map(entry => renderFileSystemEntry(entry))}
      </List>
    </Box>
  )
}

export default FileSystem
