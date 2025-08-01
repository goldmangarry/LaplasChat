import { Stack, VStack } from '@chakra-ui/react'
import { Skeleton } from './Skeleton'

interface ChatListSkeletonProps {
  count?: number
}

export function ChatListSkeleton({ count = 5 }: ChatListSkeletonProps) {
  return (
    <VStack gap={1} align="stretch">
      {Array.from({ length: count }).map((_, index) => (
        <ChatItemSkeleton key={index} />
      ))}
    </VStack>
  )
}

function ChatItemSkeleton() {
  return (
    <Stack
      direction="row"
      px="8px"
      py="6px"
      borderRadius="4px"
      align="center"
      gap="6px"
    >
      <Skeleton height="16px" flex={1} />
      <Skeleton width="20px" height="16px" />
    </Stack>
  )
}
