import { Box } from '@chakra-ui/react'
import type { BoxProps } from '@chakra-ui/react'

interface SkeletonProps extends BoxProps {
  isLoading?: boolean
  children?: React.ReactNode
}

export function Skeleton({ isLoading = true, children, ...props }: SkeletonProps) {
  if (!isLoading && children) {
    return <>{children}</>
  }

  return (
    <Box
      bg="gray.200"
      borderRadius="md"
      position="relative"
      overflow="hidden"
      _before={{
        content: '""',
        position: 'absolute',
        top: 0,
        left: '-100%',
        width: '100%',
        height: '100%',
        background: 'linear-gradient(90deg, transparent, rgba(255,255,255,0.6), transparent)',
        animation: 'shimmer 1.5s infinite',
      }}
      css={{
        '@keyframes shimmer': {
          '0%': { left: '-100%' },
          '100%': { left: '100%' },
        },
      }}
      {...props}
    />
  )
}
