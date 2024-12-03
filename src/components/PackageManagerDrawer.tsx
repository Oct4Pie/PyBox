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
}

const PackageManagerDrawer: React.FC<PackageManagerDrawerProps> = ({
  isOpen,
  onClose,
  onInstall,
  installedPackages
}) => {
  return (
    <Drawer
      isOpen={isOpen}
      placement='right'
      onClose={onClose}
      size='md'
      isFullHeight
    >
      <DrawerOverlay />
      <DrawerContent>
        <DrawerCloseButton />
        <DrawerBody bgColor={useColorModeValue('gray.50', 'gray.800')}>
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
