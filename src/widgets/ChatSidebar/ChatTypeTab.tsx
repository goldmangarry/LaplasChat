import { Box, Text, HStack, Badge } from '@chakra-ui/react'
import type { LucideIcon } from 'lucide-react'

type ChatTypeTabProps = {
  icon: LucideIcon
  label: string
  isSelected: boolean
  isDisabled?: boolean
  badge?: string
  onClick: () => void
}

export function ChatTypeTab({ icon: Icon, label, isSelected, isDisabled, badge, onClick }: ChatTypeTabProps) {
  return (
    <Box position="relative">
      <Box
        px={2}
        py={1.5}
        borderRadius="md"
        bg={isSelected ? '#e4e4e7' : 'transparent'}
        cursor={isDisabled ? 'not-allowed' : 'pointer'}
        onClick={!isDisabled ? onClick : undefined}
        opacity={isDisabled ? 0.5 : 1}
        _hover={{ bg: isDisabled ? undefined : '#e4e4e7' }}
      >
        <HStack gap={1}>
          <Icon size={14} />
          <Text fontSize="14px" fontWeight="400" lineHeight="20px">{label}</Text>
        </HStack>
      </Box>
      {badge && (
        <Badge
          position="absolute"
          top="6px"
          left="75px"
          bg="#ec4899"
          color="#f5f5f5"
          fontSize="10px"
          fontWeight="700"
          lineHeight="14px"
          px="6px"
          py="1px"
          borderRadius="16px"
        >
          {badge}
        </Badge>
      )}
    </Box>
  )
}