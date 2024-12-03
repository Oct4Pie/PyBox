import React from 'react'
import { Box, Text, Button } from '@chakra-ui/react'

interface ErrorBoundaryState {
  hasError: boolean
  error: Error | null
}

class ErrorBoundary extends React.Component<
  { children: React.ReactNode },
  ErrorBoundaryState
> {
  constructor (props: any) {
    super(props)
    this.state = { hasError: false, error: null }
  }

  static getDerivedStateFromError (error: any): ErrorBoundaryState {
    return { hasError: true, error }
  }

  componentDidCatch (error: any, errorInfo: any) {
    console.error('ErrorBoundary caught an error:', error, errorInfo)
  }

  handleReload = () => {
    window.location.reload()
  }

  render () {
    if (this.state.hasError && this.state.error) {
      return (
        <Box textAlign='center' mt='20'>
          <Text fontSize='2xl' color='red.500'>
            Something went wrong.
          </Text>
          <Text mt='4'>{this.state.error.message}</Text>
          <Button mt='6' colorScheme='teal' onClick={this.handleReload}>
            Reload Page
          </Button>
        </Box>
      )
    }

    return this.props.children
  }
}

export default ErrorBoundary
