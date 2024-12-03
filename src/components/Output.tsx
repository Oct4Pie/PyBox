import React, { useState } from 'react'
import {
  Box,
  Flex,
  Heading,
  IconButton,
  Collapse,
  useColorModeValue,
  Tooltip,
  useColorMode,
  Text
} from '@chakra-ui/react'
import { DeleteIcon, ChevronUpIcon, ChevronDownIcon } from '@chakra-ui/icons'

interface OutputProps {
  output: string
  clearOutput: () => void
}

const Output: React.FC<OutputProps> = ({ output, clearOutput }) => {
  const [isCollapsed, setIsCollapsed] = useState(false)

  const bgColor = useColorModeValue('gray.100', 'gray.800')

  return (
    <Box h='100%' bg={bgColor} p='4' overflowY='auto'>
      <Flex justifyContent='space-between' alignItems='center' mb='2'>
        <Heading size='md'>Output</Heading>
        <Flex>
          <Tooltip label='Clear Output'>
            <IconButton
              icon={<DeleteIcon />}
              size='sm'
              onClick={clearOutput}
              aria-label='Clear Output'
              variant='ghost'
            />
          </Tooltip>
          <Tooltip label={isCollapsed ? 'Expand' : 'Collapse'}>
            <IconButton
              icon={isCollapsed ? <ChevronUpIcon /> : <ChevronDownIcon />}
              size='sm'
              onClick={() => setIsCollapsed(!isCollapsed)}
              aria-label='Toggle Output'
              variant='ghost'
            />
          </Tooltip>
        </Flex>
      </Flex>
      <Collapse in={!isCollapsed} animateOpacity>
        <Box
          as='pre'
          fontFamily='monospace'
          fontSize='sm'
          whiteSpace='pre-wrap'
          overflow='auto'
          bg={useColorModeValue('gray.200', 'gray.700')}
          maxHeight='300px'
          p='2'
          borderRadius='md'
          h='full'
          color='white'
        >
          <Text
          color={useColorModeValue('gray.800', 'white')}
          fontFamily='monospace'
          decoration={'bold'}
          >{output}</Text>

        </Box>
      </Collapse>
    </Box>
  )
}

export default Output
