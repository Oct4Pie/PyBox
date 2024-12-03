import React from 'react'
import {
  Flex,
  Box,
  IconButton,
  Text,
  Tooltip,
  useColorModeValue
} from '@chakra-ui/react'
import {
  HamburgerIcon,
  SunIcon,
  MoonIcon,
  SearchIcon,
  SettingsIcon
} from '@chakra-ui/icons'
import { FaPlay, FaSave } from 'react-icons/fa'

interface TopNavigationBarProps {
  isMobile: boolean
  colorMode: string
  toggleColorMode: () => void
  onOpen: () => void
  handleRunCode: () => void
  handleManualSave: () => void
  isRunning: boolean
  unsavedFiles: Set<string>
  activeFile: string
}

const TopNavigationBar: React.FC<TopNavigationBarProps> = ({
  isMobile,
  colorMode,
  toggleColorMode,
  onOpen,
  handleRunCode,
  handleManualSave,
  isRunning,
  unsavedFiles,
  activeFile
}) => {
  const bgColor = useColorModeValue('gray.100', 'gray.800')
  const borderColor = useColorModeValue('gray.300', 'gray.500')
  const textColor = useColorModeValue('gray.800', 'white')
  const iconHoverBg = useColorModeValue('gray.100', 'gray.700')
  const titleColor = useColorModeValue('teal.500', 'teal.300')
  const titleHoverColor = useColorModeValue('teal.500', 'teal.400')

  return (
    <Flex
      bg={bgColor}
      p={4}
      alignItems='center'
      borderBottom='1px'
      borderColor={borderColor}
      shadow='md'
      position='relative'
      zIndex={1}
    >
      <IconButton
        aria-label='Toggle Theme'
        icon={colorMode === 'light' ? <MoonIcon /> : <SunIcon />}
        variant='ghost'
        color={textColor}
        onClick={toggleColorMode}
        mr={2}
        _hover={{ bg: iconHoverBg }}
      />

      {isMobile && (
        <Box>
          <Tooltip label='Open Menu' aria-label='Menu Tooltip'>
            <IconButton
              aria-label='Menu'
              icon={<HamburgerIcon />}
              variant='ghost'
              color={textColor}
              onClick={onOpen}
              _hover={{ bg: iconHoverBg }}
            />
          </Tooltip>
        </Box>
      )}

      <Text
        fontSize='xl'
        fontWeight='bold'
        color={titleColor}
        ml={{ base: 2, md: 0 }}
        cursor='pointer'
        _hover={{ color: titleHoverColor }}
      >
        PyBox
      </Text>

      {/* Search Bar */}
      {!isMobile && (
        <Flex ml={{ base: 0, md: 4 }} flex='1' alignItems='center' px={4}>
          <Box flex='1'></Box>
          <Tooltip label='Search Files' aria-label='Search Files Tooltip'>
            <IconButton
              icon={<SearchIcon />}
              aria-label='Search'
              size='sm'
              colorScheme='teal'
              variant='ghost'
              _hover={{ bg: iconHoverBg }}
              onClick={() => {
                // TODO: search functionality
              }}
            />
          </Tooltip>
        </Flex>
      )}

      <Flex alignItems='center' ml='auto'>
        {!isMobile && (
          <>
            <Tooltip label='Run Code (Ctrl+R)' aria-label='Run Code Tooltip'>
              <IconButton
                icon={<FaPlay />}
                aria-label='Run Code'
                size='lg'
                colorScheme='green'
                variant='solid'
                onClick={handleRunCode}
                isLoading={isRunning}
                mr={4}
                _hover={{ bg: 'green.600' }}
              />
            </Tooltip>

            <Tooltip label='Save File (Ctrl+S)' aria-label='Save File Tooltip'>
              <IconButton
                icon={<FaSave />}
                aria-label='Save File'
                size='lg'
                colorScheme='blue'
                variant='solid'
                onClick={handleManualSave}
                isDisabled={!unsavedFiles.has(activeFile)}
                mr={2}
                _hover={{ bg: 'blue.600' }}
              />
            </Tooltip>

            <Tooltip
              label='Package Manager (Ctrl+Shift+P)'
              aria-label='Package Manager Tooltip'
            >
              <IconButton
                icon={<SettingsIcon />}
                aria-label='Open Package Manager'
                size='md'
                colorScheme='purple'
                variant='ghost'
                onClick={onOpen}
                mr={2}
                _hover={{ bg: iconHoverBg }}
              />
            </Tooltip>
          </>
        )}
      </Flex>
    </Flex>
  )
}

export default TopNavigationBar
