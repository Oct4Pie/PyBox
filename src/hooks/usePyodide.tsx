import { useState, useEffect, useCallback } from 'react'
import { useFilesystem } from '../context/FilesystemContext'

declare global {
  interface Window {
    loadPyodide: any
  }
}

const usePyodide = () => {
  const { sharedDir } = useFilesystem()
  const [pyodide, setPyodide] = useState<any>(null)
  const [isLoading, setIsLoading] = useState(true)
  const [error, setError] = useState<any>(null)
  const [installedPackages, setInstalledPackages] = useState<string[]>([])

  useEffect(() => {
    let isMounted = true

    const loadPyodideInstance = async () => {
      try {
        if (!window.loadPyodide) {
          await new Promise<void>((resolve, reject) => {
            const script = document.createElement('script')
            script.src =
              'https://cdn.jsdelivr.net/pyodide/v0.26.1/full/pyodide.js' // Use the latest version
            script.onload = () => resolve()
            script.onerror = () =>
              reject(new Error('Failed to load Pyodide script'))
            document.head.appendChild(script)
          })
        }

        const pyodideInstance = await window.loadPyodide({
          stdout: (msg: string) => console.log(msg),
          stderr: (msg: string) => console.error(msg)
        })

        if (isMounted) {
          setPyodide(pyodideInstance)
          setIsLoading(false)
          console.log('Pyodide successfully loaded and initialized')
        }

        await synchronizeFSToPyodide(pyodideInstance)
        console.log('Initial synchronization complete')
      } catch (err: any) {
        if (isMounted) {
          setError(err)
          setIsLoading(false)
          console.error('Error loading Pyodide:', err)
        }
      }
    }

    loadPyodideInstance()

    return () => {
      isMounted = false
    }
  }, [sharedDir])

  const synchronizeFSToPyodide = useCallback(
    async (pyodideInstance: {
      FS: {
        mkdir: (arg0: string) => void
        readdir: (arg0: string) => any[]
        stat: (arg0: string) => any
        isDir: (arg0: any) => any
        unlink: (arg0: string) => void
        writeFile: (arg0: string, arg1: Uint8Array) => void
      }
    }) => {
      console.log('Synchronizing from sharedDir:/runner to Pyodide FS:/runner')

      try {
        pyodideInstance.FS.mkdir('/runner')
      } catch (e) {}

      const sharedEntries = await sharedDir.readDir('/runner')
      const sharedEntryNames = sharedEntries.map(entry => entry.name)

      const pyodideEntries = pyodideInstance.FS.readdir('/runner').filter(
        (name: string) => name !== '.' && name !== '..'
      )

      for (const entryName of pyodideEntries) {
        if (!sharedEntryNames.includes(entryName)) {
          const pyodideEntryPath = `/runner/${entryName}`
          const stat = pyodideInstance.FS.stat(pyodideEntryPath)
          if (pyodideInstance.FS.isDir(stat.mode)) {
            removeDirRecursivelyPyodide(pyodideInstance, pyodideEntryPath)
          } else {
            pyodideInstance.FS.unlink(pyodideEntryPath)
          }
          console.log(`Deleted from Pyodide FS: ${pyodideEntryPath}`)
        }
      }

      for (const entry of sharedEntries) {
        const sharedEntryPath = `/runner/${entry.name}`
        const pyodideEntryPath = `/runner/${entry.name}`
        if (entry.type === 'file') {
          const content = await sharedDir.readFile(sharedEntryPath)
          pyodideInstance.FS.writeFile(pyodideEntryPath, content)
          console.log(`Synchronized file to Pyodide FS: ${pyodideEntryPath}`)
        } else if (entry.type === 'dir') {
          await synchronizeDirectoryToPyodide(
            pyodideInstance,
            sharedEntryPath,
            pyodideEntryPath
          )
        }
      }
    },
    [sharedDir]
  )

  async function synchronizeDirectoryToPyodide (
    pyodideInstance: any,
    sharedDirPath: string,
    pyodideDirPath: string
  ) {
    try {
      pyodideInstance.FS.mkdir(pyodideDirPath)
    } catch (e) {}

    const sharedEntries = await sharedDir.readDir(sharedDirPath)
    const sharedEntryNames = sharedEntries.map(entry => entry.name)

    const pyodideEntries = pyodideInstance.FS.readdir(pyodideDirPath).filter(
      (name: string) => name !== '.' && name !== '..'
    )

    for (const entryName of pyodideEntries) {
      if (!sharedEntryNames.includes(entryName)) {
        const pyodideEntryPath = `${pyodideDirPath}/${entryName}`
        const stat = pyodideInstance.FS.stat(pyodideEntryPath)
        if (pyodideInstance.FS.isDir(stat.mode)) {
          removeDirRecursivelyPyodide(pyodideInstance, pyodideEntryPath)
        } else {
          pyodideInstance.FS.unlink(pyodideEntryPath)
        }
        console.log(`Deleted from Pyodide FS: ${pyodideEntryPath}`)
      }
    }

    for (const entry of sharedEntries) {
      const sharedEntryPath = `${sharedDirPath}/${entry.name}`
      const pyodideEntryPath = `${pyodideDirPath}/${entry.name}`
      if (entry.type === 'file') {
        const content = await sharedDir.readFile(sharedEntryPath)
        pyodideInstance.FS.writeFile(pyodideEntryPath, content)
        console.log(`Synchronized file to Pyodide FS: ${pyodideEntryPath}`)
      } else if (entry.type === 'dir') {
        await synchronizeDirectoryToPyodide(
          pyodideInstance,
          sharedEntryPath,
          pyodideEntryPath
        )
      }
    }
  }

  async function removeDirRecursively (dirPath: string): Promise<void> {
    const entries = await sharedDir.readDir(dirPath)
    for (const entry of entries) {
      const entryPath = `${dirPath}/${entry.name}`
      if (entry.type === 'dir') {
        await removeDirRecursively(entryPath)
      } else {
        await sharedDir.removeFile(entryPath)
      }
    }
    await sharedDir.removeDir(dirPath)
  }

  const synchronizePyodideToFS = useCallback(
    async (pyodideInstance: any) => {
      console.log('Synchronizing from Pyodide FS:/runner to sharedDir:/runner')

      try {
        await sharedDir.createDir('/runner')
      } catch (e) {}

      const pyodideEntries = pyodideInstance.FS.readdir('/runner').filter(
        (name: string) => name !== '.' && name !== '..'
      )
      const pyodideEntrySet = new Set(pyodideEntries)

      const sharedEntries = await sharedDir.readDir('/runner')

      for (const entry of sharedEntries) {
        if (!pyodideEntrySet.has(entry.name)) {
          const sharedEntryPath = `/runner/${entry.name}`
          if (entry.type === 'dir') {
            await removeDirRecursively(sharedEntryPath)
          } else {
            await sharedDir.removeFile(sharedEntryPath)
          }
          console.log(`Deleted from sharedDir: ${sharedEntryPath}`)
        }
      }

      for (const entryName of pyodideEntries) {
        const pyodideEntryPath = `/runner/${entryName}`
        const sharedEntryPath = `/runner/${entryName}`
        const stat = pyodideInstance.FS.stat(pyodideEntryPath)
        if (pyodideInstance.FS.isFile(stat.mode)) {
          const content = pyodideInstance.FS.readFile(pyodideEntryPath, {
            encoding: 'binary'
          })
          await sharedDir.writeFile(sharedEntryPath, content)
          console.log(
            `Synchronized file from Pyodide FS to sharedDir: ${sharedEntryPath}`
          )
        } else if (pyodideInstance.FS.isDir(stat.mode)) {
          await synchronizeDirectoryFromPyodide(
            pyodideInstance,
            pyodideEntryPath,
            sharedEntryPath
          )
        }
      }
    },
    [sharedDir]
  )

  async function synchronizeDirectoryFromPyodide (
    pyodideInstance: any,
    pyodideDirPath: string,
    sharedDirPath: string
  ) {
    try {
      await sharedDir.createDir(sharedDirPath)
    } catch (e) {}

    const pyodideEntries = pyodideInstance.FS.readdir(pyodideDirPath).filter(
      (name: string) => name !== '.' && name !== '..'
    )
    const pyodideEntrySet = new Set(pyodideEntries)

    const sharedEntries = await sharedDir.readDir(sharedDirPath)

    for (const entry of sharedEntries) {
      if (!pyodideEntrySet.has(entry.name)) {
        const sharedEntryPath = `${sharedDirPath}/${entry.name}`
        if (entry.type === 'dir') {
          await removeDirRecursively(sharedEntryPath)
        } else {
          await sharedDir.removeFile(sharedEntryPath)
        }
        console.log(`Deleted from sharedDir: ${sharedEntryPath}`)
      }
    }

    for (const entryName of pyodideEntries) {
      const pyodideEntryPath = `${pyodideDirPath}/${entryName}`
      const sharedEntryPath = `${sharedDirPath}/${entryName}`
      const stat = pyodideInstance.FS.stat(pyodideEntryPath)
      if (pyodideInstance.FS.isFile(stat.mode)) {
        const content = pyodideInstance.FS.readFile(pyodideEntryPath, {
          encoding: 'binary'
        })
        await sharedDir.writeFile(sharedEntryPath, content)
        console.log(
          `Synchronized file from Pyodide FS to sharedDir: ${sharedEntryPath}`
        )
      } else if (pyodideInstance.FS.isDir(stat.mode)) {
        await synchronizeDirectoryFromPyodide(
          pyodideInstance,
          pyodideEntryPath,
          sharedEntryPath
        )
      }
    }
  }

  function removeDirRecursivelyPyodide (
    pyodideInstance: any,
    dirPath: string
  ): void {
    const entries = pyodideInstance.FS.readdir(dirPath).filter(
      (name: string) => name !== '.' && name !== '..'
    )
    for (const entryName of entries) {
      const entryPath = `${dirPath}/${entryName}`
      const stat = pyodideInstance.FS.stat(entryPath)
      if (pyodideInstance.FS.isDir(stat.mode)) {
        removeDirRecursivelyPyodide(pyodideInstance, entryPath)
      } else {
        pyodideInstance.FS.unlink(entryPath)
      }
    }
    pyodideInstance.FS.rmdir(dirPath)
  }

  const runCode = useCallback(
    async (activeFile: string) => {
      if (!pyodide) {
        throw new Error('Pyodide is not loaded')
      }

      try {
        await synchronizeFSToPyodide(pyodide)

        await pyodide.runPythonAsync(`
import sys
from io import StringIO
import traceback
sys.stdout = StringIO()
sys.stderr = StringIO()
import os
os.chdir('/runner')
        `)

        await pyodide.runPythonAsync(`
try:
    exec(open('${activeFile}').read())
except Exception:
    traceback.print_exc()
        `)

        const output = pyodide.runPython(`
stdout = sys.stdout.getvalue()
stderr = sys.stderr.getvalue()
sys.stdout = sys.__stdout__
sys.stderr = sys.__stderr__
stdout + stderr
        `)

        await synchronizePyodideToFS(pyodide)

        return output
      } catch (error: any) {
        console.error('Error during code execution:', error)
        return `Error: ${error}`
      }
    },
    [pyodide, synchronizeFSToPyodide, synchronizePyodideToFS]
  )

  const installPackage = useCallback(
    async (packageName: string) => {
      if (!pyodide) {
        throw new Error('Pyodide is not loaded')
      }

      try {
        if (pyodide.loadedPackages[packageName]) {
          console.log(`Package '${packageName}' is already loaded.`)
          return
        }

        if (!pyodide.loadedPackages['micropip']) {
          await pyodide.loadPackage('micropip')
          console.log('Loaded micropip')
        }

        const micropip = pyodide.pyimport('micropip')
        await micropip.install(packageName)
        setInstalledPackages(prev => [...new Set([...prev, packageName])])
        console.log(`Installed package: ${packageName}`)
      } catch (error) {
        console.error(`Failed to install package '${packageName}':`, error)
        throw new Error(`Failed to install package '${packageName}': ${error}`)
      }
    },
    [pyodide]
  )

  return {
    pyodide,
    isLoading,
    error,
    runCode,
    installPackage,
    installedPackages
  }
}

export default usePyodide
