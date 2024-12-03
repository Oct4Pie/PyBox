import React, { useState } from 'react'
import {
  Flex,
  Text,
  Input,
  IconButton,
  Tooltip,
  Box,
  useColorModeValue
} from '@chakra-ui/react'
import { CloseIcon, EditIcon } from '@chakra-ui/icons'
import { FaDotCircle } from 'react-icons/fa'

interface TabProps {
  filename: string
  isActive: boolean
  onClick: () => void
  onClose: () => void
  onRename: (oldName: string, newName: string) => void
  hasUnsavedChanges: boolean
}

const Tab: React.FC<TabProps> = React.memo(
  ({ filename, isActive, onClick, onClose, onRename, hasUnsavedChanges }) => {
    const [renaming, setRenaming] = useState<boolean>(false)
    const [newName, setNewName] = useState<string>(filename)

    const handleRename = () => {
      if (renaming && newName.trim() && newName !== filename) {
        onRename(filename, newName.trim())
      }
      setRenaming(!renaming)
    }

    // light and dark modes
    const activeBg = useColorModeValue('teal.300', 'teal.700')
    const inactiveBg = useColorModeValue('gray.200', 'gray.700')
    const hoverBg = useColorModeValue('teal.200', 'teal.600')
    const activeBorderColor = useColorModeValue('teal.500', 'teal.300')
    const unsavedColor = useColorModeValue('red.600', 'red.500')

    return (
      <Flex
        align='center'
        px='4'
        py='2'
        bg={isActive ? activeBg : inactiveBg}
        borderBottom={isActive ? `2px solid ${activeBorderColor}` : 'none'}
        _hover={{ bg: hoverBg, cursor: 'pointer' }}
        onClick={onClick}
        transition='background 0.2s'
        position='relative'
      >
        {renaming ? (
          <Input
            value={newName}
            onChange={e => setNewName(e.target.value)}
            onBlur={handleRename}
            onKeyPress={e => e.key === 'Enter' && handleRename()}
            size='sm'
            autoFocus
          />
        ) : (
          <Flex align='center'>
            <Text mr='2' isTruncated>
              {filename}
            </Text>
            {hasUnsavedChanges && (
              <Box
                as={FaDotCircle}
                color={unsavedColor}
                ml={1}
                w='6px'
                h='6px'
                borderRadius='full'
              />
            )}
          </Flex>
        )}
        <Tooltip label='Rename Tab'>
          <IconButton
            icon={<EditIcon />}
            size='xs'
            onClick={e => {
              e.stopPropagation()
              handleRename()
            }}
            aria-label='Rename Tab'
            variant='ghost'
            ml={2}
          />
        </Tooltip>
        <Tooltip label='Close Tab'>
          <IconButton
            icon={<CloseIcon />}
            size='xs'
            onClick={e => {
              e.stopPropagation()
              onClose()
            }}
            aria-label='Close Tab'
            variant='ghost'
            ml={1}
          />
        </Tooltip>
      </Flex>
    )
  }
)

export default Tab
