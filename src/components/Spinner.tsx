import React from 'react'
import { Spinner as ChakraSpinner, Flex } from '@chakra-ui/react'

const SpinnerComponent: React.FC = React.memo(() => {
  return (
    <Flex align='center' justify='center'>
      <ChakraSpinner size='xl' color='teal.500' />
    </Flex>
  )
})

export default SpinnerComponent
