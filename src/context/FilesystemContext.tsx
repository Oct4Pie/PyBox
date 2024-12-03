import React, { createContext, useContext, useEffect, useState } from 'react'
import { Directory } from '@wasmer/sdk'
import {
  initializeSharedDirectory,
  getSharedDirectory
} from '../sharedFileSystem'
import { useToast, Center, Spinner, Text } from '@chakra-ui/react'

interface FilesystemContextProps {
  sharedDir: Directory
  refreshFS: () => Promise<void>
}

const FilesystemContext = createContext<FilesystemContextProps | undefined>(
  undefined
)

export const FilesystemProvider: React.FC<{ children: React.ReactNode }> = ({
  children
}) => {
  const [sharedDir, setSharedDir] = useState<Directory | null>(null)
  const toast = useToast()

  useEffect(() => {
    let isMounted = true

    const initFS = async () => {
      try {
        const dir = await initializeSharedDirectory()
        if (isMounted) {
          setSharedDir(dir)
          toast({
            title: 'Filesystem Initialized',
            status: 'success',
            duration: 2000,
            isClosable: true
          })
        }
      } catch (err: any) {
        console.error('Failed to initialize shared Directory:', err)
        if (isMounted) {
          toast({
            title: 'Filesystem Initialization Error',
            description: err.message,
            status: 'error',
            duration: 5000,
            isClosable: true
          })
        }
      }
    }

    initFS()

    return () => {
      isMounted = false
    }
  }, [toast])

  const refreshFS = async () => {
    try {
      const dir = getSharedDirectory()
      setSharedDir(dir)
    } catch (err: any) {
      console.error('Error refreshing filesystem:', err)
      toast({
        title: 'Filesystem Refresh Error',
        description: err.message,
        status: 'error',
        duration: 5000,
        isClosable: true
      })
    }
  }

  if (!sharedDir) {
    return (
      <Center h='100vh' bg='gray.100'>
        <Spinner size='xl' />
        <Text ml={2}>Initializing Filesystem...</Text>
      </Center>
    )
  }

  return (
    <FilesystemContext.Provider value={{ sharedDir, refreshFS }}>
      {children}
    </FilesystemContext.Provider>
  )
}

export const useFilesystem = (): FilesystemContextProps => {
  const context = useContext(FilesystemContext)
  if (!context) {
    throw new Error('useFilesystem must be used within a FilesystemProvider')
  }
  return context
}
