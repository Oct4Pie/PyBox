import React, { useEffect, useRef, useState } from 'react'
import {
  Box,
  useColorModeValue,
  useColorMode,
  Button,
  Flex
} from '@chakra-ui/react'
import { Terminal as XTerm } from 'xterm'
import { FitAddon } from 'xterm-addon-fit'
import 'xterm/css/xterm.css'
import usePyodide from '../hooks/usePyodide'

const PythonRepl: React.FC = () => {
  const terminalRef = useRef<HTMLDivElement>(null)
  const { pyodide, isLoading, error } = usePyodide()
  const { colorMode } = useColorMode()
  const [replKey, setReplKey] = useState<number>(0)
  const [termI, setTermI] = useState<any>(null)

  const terminalTheme = {
    background: colorMode === 'dark' ? '#2D3748' : 'white',
    foreground: colorMode === 'dark' ? '#E2E8F0' : '#2D3748',
    cursor:
      colorMode === 'dark' ? 'rgba(255, 255, 255, 0.8)' : 'rgba(0, 0, 0, 0.8)',
    selectionBackground:
      colorMode === 'dark' ? 'rgba(255, 255, 255, 0.2)' : 'rgba(0, 0, 0, 0.2)'
  }

  useEffect(() => {
    if (termI) {
      termI.options.theme = terminalTheme
    }
  }, [colorMode])

  useEffect(() => {
    if (!pyodide || isLoading || error) return

    let term: XTerm
    let pyconsole: any
    let await_fut: any
    let commandHistory: string[] = []
    let historyIndex: number = -1
    let inputBuffer: string = ''
    let codeBuffer: string = ''
    let prompt = '>>> '
    let currentFuture: any = null
    let fitAddon: FitAddon
    let cursorPosition: number = 0

    const initializeRepl = async () => {
      term = new XTerm({
        cursorBlink: true,
        convertEol: true,
        fontFamily: '"Fira Code", monospace',
        fontSize: 14,
        theme: terminalTheme
      })
      setTermI(term)
      fitAddon = new FitAddon()
      term.loadAddon(fitAddon)
      term.open(terminalRef.current!)
      term.element!.style.padding = '16px'
      fitAddon.fit()
      term.focus()

      setTimeout(() => fitAddon.fit(), 0)

      const resizeObserver = new ResizeObserver(() => {
        fitAddon.fit()
      })
      resizeObserver.observe(terminalRef.current!)

      const pyConsoleModule = pyodide.pyimport('pyodide.console')
      const { BANNER, PyodideConsole } = pyConsoleModule
      pyconsole = PyodideConsole(pyodide.globals)

      await_fut = pyodide.runPython(`
import builtins
from pyodide.ffi import to_js

async def await_fut(fut):
    try:
        res = await fut
        if res is not None:
            builtins._ = res
        return to_js([res], depth=1)
    except KeyboardInterrupt:
        return to_js([None], depth=1)

await_fut
`)

      pyconsole.stdout_callback = (s: string) =>
        term.write(s.replace(/\n/g, '\r\n'))
      pyconsole.stderr_callback = (s: string) =>
        term.write(s.replace(/\n/g, '\r\n'))

      term.writeln(
        `Welcome to the Pyodide ${pyodide.version} terminal emulator 🐍`
      )
      term.writeln(BANNER)

      prompt = '>>> '
      commandHistory = []
      historyIndex = -1
      inputBuffer = ''
      codeBuffer = ''
      cursorPosition = 0
      currentFuture = null

      term.write(prompt)

      term.onKey(handleKey)
    }

    const refreshLine = () => {
      term.write('\r')

      term.write(prompt + inputBuffer)

      term.write('\x1b[K')

      const cursorPos = prompt.length + cursorPosition
      const totalLength = prompt.length + inputBuffer.length
      const moveLeft = totalLength - cursorPos
      if (moveLeft > 0) {
        term.write(`\x1b[${moveLeft}D`)
      }
    }

    const handleKey = (event: { key: string; domEvent: KeyboardEvent }) => {
      const { key, domEvent } = event
      const printable =
        !domEvent.altKey &&
        !domEvent.ctrlKey &&
        !domEvent.metaKey &&
        domEvent.key.length === 1

      if (domEvent.key === 'Enter') {
        handleEnter()
      } else if (domEvent.key === 'Backspace') {
        handleBackspace()
      } else if (domEvent.key === 'ArrowUp') {
        handleHistoryNavigation('up')
      } else if (domEvent.key === 'ArrowDown') {
        handleHistoryNavigation('down')
      } else if (domEvent.key === 'ArrowLeft') {
        if (cursorPosition > 0) {
          cursorPosition--
          term.write('\x1b[D')
        }
      } else if (domEvent.key === 'ArrowRight') {
        if (cursorPosition < inputBuffer.length) {
          cursorPosition++
          term.write('\x1b[C')
        }
      } else if (domEvent.key === 'Home') {
        term.write(`\x1b[${cursorPosition}D`)
        cursorPosition = 0
      } else if (domEvent.key === 'End') {
        term.write(`\x1b[${inputBuffer.length - cursorPosition}C`)
        cursorPosition = inputBuffer.length
      } else if (domEvent.key === 'Tab') {
        handleTab()
      } else if (domEvent.ctrlKey && domEvent.key === 'c') {
        handleCtrlC()
      } else if (printable) {
        inputBuffer =
          inputBuffer.slice(0, cursorPosition) +
          key +
          inputBuffer.slice(cursorPosition)
        cursorPosition++
        refreshLine()
      }

      domEvent.preventDefault()
    }

    const handleEnter = async () => {
      term.write('\r\n')
      const code = codeBuffer + inputBuffer

      if (code.trim() !== '') {
        commandHistory.push(codeBuffer + inputBuffer)
      }
      historyIndex = commandHistory.length

      const currentInput = inputBuffer

      inputBuffer = ''
      cursorPosition = 0

      term.options.disableStdin = true

      try {
        currentFuture = pyconsole.push(currentInput + '\n')

        if (currentFuture.syntax_check === 'syntax-error') {
          term.writeln(currentFuture.formatted_error.trimEnd())
          codeBuffer = ''
          prompt = '>>> '
          term.write(prompt)
          term.options.disableStdin = false
        } else if (currentFuture.syntax_check === 'incomplete') {
          codeBuffer += currentInput + '\n'
          prompt = '... '
          term.write(prompt)
          term.options.disableStdin = false
        } else if (currentFuture.syntax_check === 'complete') {
          codeBuffer += currentInput + '\n'
          try {
            const wrapped = await_fut(currentFuture)
            const [value] = await wrapped
            if (value !== undefined) {
              const resultStr = pyodide.runPython('repr(_)')
              term.writeln(resultStr)
            }
          } catch (e: any) {
            if (e.constructor.name === 'PythonError') {
              const message = currentFuture.formatted_error || e.message
              term.writeln(message.trimEnd())
            } else {
              console.error(e)
              term.writeln(`Error: ${e.message}`)
            }
          } finally {
            currentFuture.destroy()
            currentFuture = null
          }
          codeBuffer = ''
          prompt = '>>> '
          term.write(prompt)
          term.options.disableStdin = false
        }
      } catch (e: any) {
        console.error(e)
        term.writeln(`Error: ${e.message}`)
        codeBuffer = ''
        prompt = '>>> '
        term.write(prompt)
        term.options.disableStdin = false
      }
    }

    const handleCtrlC = () => {
      if (inputBuffer.length > 0 || codeBuffer.length > 0) {
        inputBuffer = ''
        codeBuffer = ''
        cursorPosition = 0
        term.write('^C\r\n')
        prompt = '>>> '
        term.write(prompt)
        term.options.disableStdin = false
      } else if (currentFuture && !currentFuture.f_done) {
        try {
          currentFuture.cancel()

          pyodide.runPython(`
import sys
import _asyncio
_asyncio.set_fatal_error_handler(lambda *args: None)
raise KeyboardInterrupt
`)
          term.write('^C\r\nExecution interrupted\r\n')
        } catch (e: any) {
          console.error('Error during Ctrl+C handling:', e)
        } finally {
          currentFuture.destroy()
          currentFuture = null
          prompt = '>>> '
          term.write(prompt)
          term.options.disableStdin = false
        }
      } else {
        term.write('^C\r\n')
        prompt = '>>> '
        term.write(prompt)
        term.options.disableStdin = false
      }
    }

    const handleBackspace = () => {
      if (cursorPosition > 0) {
        inputBuffer =
          inputBuffer.slice(0, cursorPosition - 1) +
          inputBuffer.slice(cursorPosition)
        cursorPosition--
        refreshLine()
      }
    }

    const handleHistoryNavigation = (direction: 'up' | 'down') => {
      if (direction === 'up' && historyIndex > 0) {
        historyIndex--
        const historyEntry = commandHistory[historyIndex]

        codeBuffer = ''
        prompt = '>>> '
        inputBuffer = historyEntry
        cursorPosition = inputBuffer.length
        refreshLine()
      } else if (direction === 'down') {
        if (historyIndex < commandHistory.length - 1) {
          historyIndex++
          const historyEntry = commandHistory[historyIndex]

          codeBuffer = ''
          prompt = '>>> '
          inputBuffer = historyEntry
        } else {
          historyIndex = commandHistory.length
          codeBuffer = ''
          prompt = '>>> '
          inputBuffer = ''
        }
        cursorPosition = inputBuffer.length
        refreshLine()
      }
    }

    const handleTab = () => {
      const inputUpToCursor = inputBuffer.slice(0, cursorPosition)
      const match = inputUpToCursor.match(/([a-zA-Z0-9_\.]+)$/)
      const currentWord = match ? match[1] : ''

      if (currentWord === '') {
        const indent = '    '
        inputBuffer =
          inputBuffer.slice(0, cursorPosition) +
          indent +
          inputBuffer.slice(cursorPosition)
        cursorPosition += indent.length
        refreshLine()
      } else {
        handleTabCompletion()
      }
    }

    const handleTabCompletion = () => {
      const inputUpToCursor = inputBuffer.slice(0, cursorPosition)
      const completionResult = pyconsole.complete(inputUpToCursor).toJs()
      const completions = completionResult[0]
      const offset = completionResult[1]

      if (completions.length === 0) {
      } else if (completions.length === 1) {
        const completion = completions[0]
        const toInsert = completion.slice(offset)
        inputBuffer =
          inputBuffer.slice(0, cursorPosition) +
          toInsert +
          inputBuffer.slice(cursorPosition)
        cursorPosition += toInsert.length
        refreshLine()
      } else if (completions.length > 1) {
        term.write('\r\n')
        term.writeln(completions.join('  '))
        term.write(prompt + inputBuffer)

        const cursorPos = prompt.length + cursorPosition
        const totalLength = prompt.length + inputBuffer.length
        if (cursorPos < totalLength) {
          term.write(`\x1b[${totalLength - cursorPos}D`)
        }
      }
    }

    initializeRepl()

    return () => {
      term?.dispose()
    }
  }, [pyodide, isLoading, error, replKey])

  const resetRepl = () => {
    setReplKey(prev => prev + 1)
  }

  return (
    <Box key={replKey} position='relative'>
      <Box
        ref={terminalRef}
        style={{
          width: '100%',
          maxHeight: '350px'
        }}
        bg={useColorModeValue('gray.900', 'gray.800')}
        borderRadius='lg'
        overflow='scroll'
      />

      <Flex justifyContent='center' mb={2}>
        <Button mt='2' size='sm' onClick={resetRepl}>
          Clear
        </Button>
      </Flex>
    </Box>
  )
}

export default PythonRepl
