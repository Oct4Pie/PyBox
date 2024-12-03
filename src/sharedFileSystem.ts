import { Directory } from '@wasmer/sdk'
import { initializeWasmer } from './wasmerInit'

let sharedDirectory: Directory | null = null

export const initializeSharedDirectory = async (): Promise<Directory> => {
  if (!sharedDirectory) {
    try {
      await initializeWasmer()
      sharedDirectory = new Directory()
      console.log('Shared Directory initialized')

      try {
        await sharedDirectory.createDir('/runner')
        console.log("Created '/runner' directory")
      } catch (error: any) {
        if (error.message.includes('File exists')) {
          console.log("'/runner' directory already exists")
        } else {
          throw error
        }
      }

      try {
        await sharedDirectory.readFile('/runner/main.py')
        console.log("'/runner/main.py' already exists")
      } catch (error: any) {
        if (
          error.message.includes('No such file or directory') ||
          error.message.includes('entry not found')
        ) {
          const initialContent = `# main.py\nprint("Hello from PyBox!")\n`
          await sharedDirectory.writeFile(
            '/runner/main.py',
            new TextEncoder().encode(initialContent)
          )
          console.log("Created initial '/runner/main.py'")
        } else {
          throw error
        }
      }
    } catch (err) {
      console.error('Error initializing shared Directory:', err)
      throw err
    }
  } else {
    console.log('Shared Directory already initialized')
  }
  return sharedDirectory
}

export const getSharedDirectory = (): Directory => {
  if (!sharedDirectory) {
    throw new Error(
      'Shared Directory is not initialized. Call initializeSharedDirectory first.'
    )
  }
  return sharedDirectory
}

export const renameFile = async (
  oldPath: string,
  newPath: string
): Promise<void> => {
  if (!sharedDirectory) {
    throw new Error('Shared Directory is not initialized.')
  }
  try {
    const content = await sharedDirectory.readFile(oldPath)
    await sharedDirectory.writeFile(newPath, content)
    await sharedDirectory.removeFile(oldPath)
    console.log(`Renamed file from ${oldPath} to ${newPath}`)
  } catch (err) {
    console.error(`Error renaming file from ${oldPath} to ${newPath}:`, err)
    throw err
  }
}

export const renameDir = async (
  oldPath: string,
  newPath: string
): Promise<void> => {
  if (!sharedDirectory) {
    throw new Error('Shared Directory is not initialized.')
  }
  try {
    const entries = await sharedDirectory.readDir(oldPath)

    await sharedDirectory.createDir(newPath)

    for (const entry of entries) {
      const oldEntryPath = `${oldPath}/${entry.name}`
      const newEntryPath = `${newPath}/${entry.name}`
      if (entry.type === 'file') {
        const content = await sharedDirectory.readFile(oldEntryPath)
        await sharedDirectory.writeFile(newEntryPath, content)
      } else if (entry.type === 'dir') {
        await renameDir(oldEntryPath, newEntryPath)
      }
    }

    await sharedDirectory.removeDir(oldPath)
    console.log(`Renamed directory from ${oldPath} to ${newPath}`)
  } catch (err) {
    console.error(
      `Error renaming directory from ${oldPath} to ${newPath}:`,
      err
    )
    throw err
  }
}
