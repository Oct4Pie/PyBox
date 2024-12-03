import React, { useState } from 'react'
import {
  Box,
  Heading,
  Input,
  IconButton,
  HStack,
  useColorModeValue,
  Tooltip,
  List,
  ListItem,
  Text
} from '@chakra-ui/react'
import { RiInstallFill } from 'react-icons/ri'
interface PackageManagerProps {
  onInstall: (packageName: string) => void
  installedPackages: string[]
}

const PackageManager: React.FC<PackageManagerProps> = ({
  onInstall,
  installedPackages
}) => {
  const [packageName, setPackageName] = useState('')

  const handleInstall = () => {
    if (packageName.trim()) {
      onInstall(packageName.trim())
      setPackageName('')
    }
  }

  const bgColor = useColorModeValue('gray.50', 'gray.800')

  return (
    <Box h='100%' bg={bgColor} p='4' overflowY='auto'>
      <Heading size='md' mb='4'>
        Package Manager
      </Heading>
      <HStack mb='4'>
        <Input
          value={packageName}
          onChange={e => setPackageName(e.target.value)}
          placeholder='Package name (e.g., numpy)'
          onKeyPress={e => e.key === 'Enter' && handleInstall()}
          size='sm'
        />
        <Tooltip label='Install Package'>
          <IconButton
            icon={<RiInstallFill />}
            onClick={handleInstall}
            aria-label='Install Package'
            size='sm'
            colorScheme='teal'
          />
        </Tooltip>
      </HStack>
      {installedPackages && installedPackages.length > 0 && (
        <Box>
          <Heading size='sm' mb='2'>
            Installed Packages
          </Heading>
          <List spacing='1'>
            {installedPackages.map(pkg => (
              <ListItem key={pkg}>
                <Text fontSize='sm'>{pkg}</Text>
              </ListItem>
            ))}
          </List>
        </Box>
      )}
    </Box>
  )
}

export default PackageManager
