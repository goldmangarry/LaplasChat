import { HStack, VStack } from '@chakra-ui/react'
import { Skeleton } from './Skeleton'

export function UserProfileSkeleton() {
  return (
    <HStack 
      gap={2} 
      paddingY="8px" 
      alignSelf="stretch" 
      px={2}
      borderRadius="md"
    >
      {/* Avatar skeleton */}
      <Skeleton 
        width="40px" 
        height="40px" 
        borderRadius="full" 
      />
      
      {/* User info skeleton */}
      <VStack gap={1} align="flex-start" flex={1}>
        <Skeleton height="16px" width="120px" />
        <Skeleton height="14px" width="100px" />
      </VStack>
    </HStack>
  )
}
