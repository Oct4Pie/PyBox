import React from 'react'
import { VStack, FormControl, FormLabel, Switch, Box } from '@chakra-ui/react'

interface SettingsProps {
  isAutosaveEnabled: boolean
  setIsAutosaveEnabled: (value: boolean) => void
}

const Settings: React.FC<SettingsProps> = ({
  isAutosaveEnabled,
  setIsAutosaveEnabled
}) => {
  const handleAutosaveToggle = (e: React.ChangeEvent<HTMLInputElement>) => {
    setIsAutosaveEnabled(e.target.checked)
  }

  return (
    <VStack align='start' spacing={4}>
      <FormControl display='flex' alignItems='center'>
        <FormLabel htmlFor='autosave' mb='0'>
          Autosave
        </FormLabel>
        <Switch
          id='autosave'
          isChecked={isAutosaveEnabled}
          onChange={handleAutosaveToggle}
          colorScheme='teal'
        />
      </FormControl>

      {/* Add more settings here as needed */}
      <Box>{/* Placeholder for additional settings */}</Box>
    </VStack>
  )
}

export default Settings
