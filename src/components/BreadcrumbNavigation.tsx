import React from 'react'
import {
  Breadcrumb as ChakraBreadcrumb,
  BreadcrumbItem,
  BreadcrumbLink
} from '@chakra-ui/react'

interface BreadcrumbNavigationProps {
  activeFile: string
}

const BreadcrumbNavigation: React.FC<BreadcrumbNavigationProps> = ({
  activeFile
}) => {
  const filePath = ['home', 'runner', activeFile]

  return (
    <ChakraBreadcrumb spacing='8px' separator='/'>
      {filePath.map((segment, index) => (
        <BreadcrumbItem key={index}>
          <BreadcrumbLink href='#'>{segment}</BreadcrumbLink>
        </BreadcrumbItem>
      ))}
    </ChakraBreadcrumb>
  )
}

export default BreadcrumbNavigation
