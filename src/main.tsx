import React from 'react'
import ReactDOM from 'react-dom/client'
import { ChakraProvider, extendTheme, ColorModeScript } from '@chakra-ui/react'
import App from './App'
import { FilesystemProvider } from './context/FilesystemContext'
import ErrorBoundary from './components/ErrorBoundary'

const theme = extendTheme({
  config: {
    initialColorMode: 'dark',
    useSystemColorMode: true
  },
  styles: {
    global: {
      'html, body, #root': {
        height: '100%',
        margin: '0',
        padding: '0',
        overflow: 'hidden'
      }
    }
  }
})

const Root = () => {
  return (

      <FilesystemProvider>
        <App />
      </FilesystemProvider>

  )
}

const root = ReactDOM.createRoot(document.getElementById('root')!)
root.render(
  <React.StrictMode>
    <ChakraProvider theme={theme}>
      <ColorModeScript initialColorMode={theme.config.initialColorMode} />
      <Root />
    </ChakraProvider>
  </React.StrictMode>
)
