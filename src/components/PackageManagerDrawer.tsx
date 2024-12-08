import React, { Suspense } from 'react'
import {
  Drawer,
  DrawerOverlay,
  DrawerCloseButton,
  DrawerBody,
  DrawerContent,
  useColorModeValue
} from '@chakra-ui/react'
import Spinner from './Spinner'
const PackageManager = React.lazy(() => import('./PackageManager'))

interface PackageManagerDrawerProps {
  isOpen: boolean
  onClose: () => void
  onInstall: (packageName: string) => void
  installedPackages: string[]
  isMobile?: boolean
}

const PackageManagerDrawer: React.FC<PackageManagerDrawerProps> = ({
  isOpen,
  onClose,
  onInstall,
  installedPackages,
  isMobile = false
}) => {
  const drawerPlacement = isMobile ? 'bottom' : 'right'
  const drawerSize = isMobile ? 'full' : 'md'

  return (
    <Drawer
      isOpen={isOpen}
      placement={drawerPlacement}
      onClose={onClose}
      size={drawerSize}
      isFullHeight
    >
      <DrawerOverlay />
      <DrawerContent bgColor={useColorModeValue('gray.50', 'gray.800')}>
        <DrawerCloseButton size="lg" top={4} right={4} />
        <DrawerBody p={0}>
          <Suspense fallback={<Spinner />}>
            <PackageManager
              onInstall={onInstall}
              installedPackages={installedPackages}
            />
          </Suspense>
        </DrawerBody>
      </DrawerContent>
    </Drawer>
  )
}

export default PackageManagerDrawer
