import React from 'react'
import {
  Flex,
  IconButton,
  Text,
  Tooltip,
  useColorModeValue
} from '@chakra-ui/react'
import { SunIcon, MoonIcon, SearchIcon, SettingsIcon } from '@chakra-ui/icons'
import { FaPlay, FaSave, FaFolderOpen } from 'react-icons/fa'

interface TopNavigationBarProps {
  colorMode: string
  toggleColorMode: () => void
  onOpen: () => void
  handleRunCode: () => void
  handleManualSave: () => void
  isRunning: boolean
  unsavedFiles: Set<string>
  activeFile: string
  isMobile?: boolean
  onOpenFileExplorer: () => void
}

const TopNavigationBar: React.FC<TopNavigationBarProps> = ({
  colorMode,
  toggleColorMode,
  onOpen,
  handleRunCode,
  handleManualSave,
  isRunning,
  unsavedFiles,
  activeFile,
  onOpenFileExplorer,
  isMobile
}) => {
  const bgColor = useColorModeValue('gray.100', 'gray.800')
  const borderColor = useColorModeValue('gray.300', 'gray.600')
  const textColor = useColorModeValue('gray.800', 'white')
  const iconHoverBg = useColorModeValue('gray.200', 'gray.700')
  const titleColor = useColorModeValue('teal.600', 'teal.300')

  return (
    <Flex
      bg={bgColor}
      p={{ base: 3, md: 5 }}
      alignItems='center'
      borderBottom='1px'
      borderColor={borderColor}
      shadow={{ base: 'sm', md: 'lg' }}
      position='relative'
      zIndex={1}
      justifyContent='space-between'
      transition='background-color 0.2s, box-shadow 0.2s'
    >
      <Flex align='center'>
        <Tooltip label='Toggle Theme'>
          <IconButton
            aria-label='Toggle Theme'
            icon={colorMode === 'light' ? <MoonIcon /> : <SunIcon />}
            variant='ghost'
            color={textColor}
            onClick={toggleColorMode}
            size={{ base: 'sm', md: 'md' }}
            _hover={{ bg: iconHoverBg }}
            transition='transform 0.2s'
            _active={{ transform: 'scale(0.95)' }}
          />
        </Tooltip>

        <Text
          fontSize={{ base: 'lg', md: 'xl' }}
          fontWeight='bold'
          color={titleColor}
          userSelect='none'
        >
          PyBox
        </Text>
      </Flex>

      <Flex align='center'>
        {isMobile && (
          <Tooltip label='File Explorer'>
            <IconButton
              icon={<FaFolderOpen />}
              aria-label='Open File Explorer'
              variant='ghost'
              color={textColor}
              onClick={onOpenFileExplorer}
              size={{ base: 'sm', md: 'md' }}
              mr={{ base: 2, md: 4 }}
              _hover={{ bg: iconHoverBg }}
            />
          </Tooltip>
        )}

        <Tooltip label='Search Files'>
          <IconButton
            icon={<SearchIcon />}
            aria-label='Search Files'
            variant='ghost'
            color={textColor}
            onClick={() => {}}
            size={{ base: 'sm', md: 'md' }}
            mr={{ base: 2, md: 4 }}
            _hover={{ bg: iconHoverBg }}
            display={{ base: 'none', md: 'inline-flex' }}
          />
        </Tooltip>

        <Tooltip label='Run Code (Ctrl+R)'>
          <IconButton
            icon={<FaPlay />}
            aria-label='Run Code'
            colorScheme='green'
            onClick={handleRunCode}
            isLoading={isRunning}
            size={{ base: 'sm', md: 'md' }}
            mr={{ base: 2, md: 4 }}
            _hover={{ bg: 'green.600' }}
            transition='background-color 0.2s'
          />
        </Tooltip>

        <Tooltip label='Save File (Ctrl+S)'>
          <IconButton
            icon={<FaSave />}
            aria-label='Save File'
            colorScheme='blue'
            onClick={handleManualSave}
            isDisabled={!unsavedFiles.has(activeFile)}
            size={{ base: 'sm', md: 'md' }}
            mr={{ base: 2, md: 4 }}
            _hover={{ bg: 'blue.600' }}
            transition='background-color 0.2s'
          />
        </Tooltip>

        <Tooltip label='Package Manager (Ctrl+Shift+P)'>
          <IconButton
            icon={<SettingsIcon />}
            aria-label='Open Package Manager'
            colorScheme='purple'
            variant='ghost'
            onClick={onOpen}
            size={{ base: 'sm', md: 'md' }}
            _hover={{ bg: iconHoverBg }}
          />
        </Tooltip>
      </Flex>
    </Flex>
  )
}

export default TopNavigationBar
