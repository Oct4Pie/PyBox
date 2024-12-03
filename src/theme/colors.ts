import { useColorModeValue } from '@chakra-ui/react'

export const useThemeColors = () => {
  const bgColor = useColorModeValue('gray.50', 'gray.900')
  const viewBgColor = useColorModeValue('gray.800', 'gray.700')
  const panelBgColor = useColorModeValue('gray.100', 'gray.800')

  return { bgColor, viewBgColor, panelBgColor }
}
