import React, { useEffect, useRef, useState } from 'react'
import { Box, Button, Flex, Icon, useColorMode } from '@chakra-ui/react'
import { FiTerminal } from 'react-icons/fi'
import { Terminal as XTerm } from 'xterm'
import { FitAddon } from 'xterm-addon-fit'
import 'xterm/css/xterm.css'
import { Wasmer, init } from '@wasmer/sdk'
//@ts-ignore
import WasmModule from '@wasmer/sdk/wasm?url'
import { useFilesystem } from '../context/FilesystemContext'

const encoder = new TextEncoder()

const Terminal: React.FC = () => {
  const terminalRef = useRef<HTMLDivElement>(null)
  const termRef = useRef<XTerm | null>(null)
  const fitAddonRef = useRef<FitAddon | null>(null)
  const { sharedDir } = useFilesystem()
  const { colorMode } = useColorMode()
  const [instance, setInstance] = useState<any>(null)
  const [termI, setTermI] = useState<any>(null)
  const [terminalLoaded, setTerminalLoaded] = useState(false)

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
    if (!terminalLoaded) return

    const handleResize = () => {
      fitAddonRef.current?.fit()
    }

    const runTerminal = async () => {
      try {
        await init({
          module: WasmModule,
          sdkUrl: `${location.origin}/sdk/index.mjs`
        })
        console.log('Wasmer SDK initialized')

        const term = new XTerm({
          cursorBlink: true,
          convertEol: true,
          fontFamily: '"Fira Code", monospace',
          fontSize: 13,
          theme: terminalTheme
        })

        setTermI(term)
        const fitAddon = new FitAddon()
        term.loadAddon(fitAddon)
        term.open(terminalRef.current!)
        fitAddon.fit()
        term.focus()

        term.element!.style.padding = '16px'

        const pkg = await Wasmer.fromRegistry('sharrattj/bash')
        console.log('Bash package fetched from Wasmer registry')

        const instance = await pkg.entrypoint!.run({
          args: [
            '-c',
            'echo "root:x:0:0:root:/root:/bin/bash" > /etc/passwd && echo "runner" > /etc/hostname && echo "127.0.0.1 runner" >> /etc/hosts && bash'
          ],
          mount: { '/home': sharedDir },
          cwd: '/home',
          env: {
            HOME: '/home',
            PS1: '\\u@runner:\\w\\$ '
          }
        })
        console.log(
          "Bash package running with sharedDir mounted at '.' and cwd set to 'home'"
        )

        connectStreams(instance, term)
        setInstance(instance)

        termRef.current = term
        fitAddonRef.current = fitAddon

        window.addEventListener('resize', handleResize)
      } catch (err: any) {
        console.error('Error initializing Terminal:', err)
        termRef.current?.writeln(`\r\n\x1b[31mError: ${err.message}\x1b[0m\r\n`)
      }
    }

    runTerminal()

    return () => {
      termRef.current?.dispose()
      fitAddonRef.current?.dispose()
      window.removeEventListener('resize', handleResize)
    }
  }, [terminalLoaded, sharedDir])

  const connectStreams = (instance: any, term: XTerm) => {
    let stdin = instance.stdin?.getWriter()

    term.onData(data => {
      let command = term.buffer.active
        .getLine(term.buffer.active.cursorY)
        ?.translateToString(true)
        .trim()

      command = command!.replace(/^bash-\d+\.\d+#\s*/, '')

      if (command === 'clear') {
        term.clear()
        stdin?.write(encoder.encode('\x03'))
        stdin?.write(encoder.encode('\n'))
      } else {
        stdin?.write(encoder.encode(data))
      }
    })

    instance.stdout
      .pipeTo(
        new WritableStream({
          write: (chunk: Uint8Array) => {
            const output = new TextDecoder().decode(chunk)
            term.write(output)
          }
        })
      )
      .catch((err: any) => {
        console.error('Error piping stdout:', err)
      })

    instance.stderr
      .pipeTo(
        new WritableStream({
          write: (chunk: Uint8Array) => {
            const output = new TextDecoder().decode(chunk)
            term.write(output)
          }
        })
      )
      .catch((err: any) => {
        console.error('Error piping stderr:', err)
      })
  }

  return (
    <>
      {!terminalLoaded ? (
        <Flex
          direction='row'
          w='100%'
          h='300px'
          align='center'
          justify='center'
        >
          <Button onClick={() => setTerminalLoaded(true)}>
            <Icon as={FiTerminal} mr={2} />
            Load Terminal
          </Button>
        </Flex>
      ) : (
        <Box
          ref={terminalRef}
          style={{
            width: '100%',
            height: '350px',
            overflowY: 'auto'
          }}
          borderRadius='lg'
          overflow='clip'
        />
      )}
    </>
  )
}

export default Terminal
