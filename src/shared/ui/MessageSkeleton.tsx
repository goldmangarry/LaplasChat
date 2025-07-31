import { VStack, HStack, Box } from '@chakra-ui/react'
import { Skeleton } from './Skeleton'

interface MessageSkeletonProps {
  count?: number
}

export function MessageSkeleton({ count = 3 }: MessageSkeletonProps) {
  return (
    <VStack gap={4} align="stretch" width="100%">
      {Array.from({ length: count }).map((_, index) => (
        <MessageItemSkeleton key={index} isOwnMessage={index % 2 === 0} />
      ))}
    </VStack>
  )
}

interface MessageItemSkeletonProps {
  isOwnMessage?: boolean
}

function MessageItemSkeleton({ isOwnMessage = false }: MessageItemSkeletonProps) {
  return (
    <HStack
      gap={3}
      align="flex-start"
      justify={isOwnMessage ? 'flex-end' : 'flex-start'}
      width="100%"
    >
      {!isOwnMessage && (
        <Skeleton 
          width="32px" 
          height="32px" 
          borderRadius="full" 
          flexShrink={0}
        />
      )}
      
      <VStack 
        gap={2} 
        align={isOwnMessage ? 'flex-end' : 'flex-start'}
        maxWidth="70%"
      >
        <Box
          bg={isOwnMessage ? '#007AFF' : '#F5F5F7'}
          borderRadius="16px"
          padding="12px 16px"
          width="100%"
        >
          <VStack gap={2} align="stretch">
            <Skeleton height="16px" width="100%" />
            <Skeleton height="16px" width="80%" />
            <Skeleton height="16px" width="60%" />
          </VStack>
        </Box>
        
        <Skeleton height="12px" width="60px" />
      </VStack>
      
      {isOwnMessage && (
        <Skeleton 
          width="32px" 
          height="32px" 
          borderRadius="full" 
          flexShrink={0}
        />
      )}
    </HStack>
  )
}
