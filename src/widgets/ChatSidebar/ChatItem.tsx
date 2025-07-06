import { Box, Text, HStack, IconButton } from '@chakra-ui/react'
import { Share2, Edit3, Trash2 } from 'lucide-react'
import anthropicIcon from '../../assets/icons/anthropic.svg'
import openaiIcon from '../../assets/icons/openai.svg'

type ChatItemProps = {
  id: string
  title: string
  type: 'anthropic' | 'openai' | 'both'
  isSelected: boolean
  hasActions?: boolean
  onClick: () => void
}

export function ChatItem({ title, type, isSelected, hasActions, onClick }: ChatItemProps) {
  return (
    <Box
      px={2}
      py={1.5}
      borderRadius="4px"
      bg={isSelected ? '#e4e4e7' : 'white'}
      cursor="pointer"
      onClick={onClick}
      _hover={{ bg: '#e4e4e7' }}
      position="relative"
      className="group"
    >
      <HStack gap={2} align="center">
        {/* AI Logo */}
        {type === 'both' ? (
          <Box position="relative" width="28px" height="28px">
            <img src={anthropicIcon} alt="Anthropic" width="20" height="20" />
            <Box
              position="absolute"
              bottom={0}
              right={0}
              width="20px"
              height="20px"
              borderRadius="full"
              overflow="hidden"
              display="flex"
              alignItems="center"
              justifyContent="center"
            >
              <img src={openaiIcon} alt="OpenAI" width="20" height="20" />
            </Box>
          </Box>
        ) : type === 'anthropic' ? (
          <img src={anthropicIcon} alt="Anthropic" width="28" height="28" />
        ) : (
          <img src={openaiIcon} alt="OpenAI" width="28" height="28" />
        )}
        
        {/* Chat title */}
        <Text 
          fontSize="12px" 
          lineHeight="16px"
          fontWeight="400"
          color="#000000"
          flex={1}
          overflow="hidden"
          textOverflow="ellipsis"
          whiteSpace="nowrap"
          _groupHover={hasActions ? { 
            maxWidth: "calc(100% - 125px)"
          } : {}}
        >
          {title}
        </Text>

        {/* Actions */}
        {hasActions && (
          <HStack 
            gap={0}
            position="absolute"
            right={2}
            opacity={0}
            transition="opacity 0.2s"
            _groupHover={{ opacity: 1 }}
          >
            <IconButton
              aria-label="Share"
              size="xs"
              variant="ghost"
              color="gray.500"
            >
              <Share2 size={16} />
            </IconButton>
            <IconButton
              aria-label="Edit"
              size="xs"
              variant="ghost"
              color="gray.500"
            >
              <Edit3 size={16} />
            </IconButton>
            <IconButton
              aria-label="Delete"
              size="xs"
              variant="ghost"
              color="gray.500"
            >
              <Trash2 size={16} />
            </IconButton>
          </HStack>
        )}
      </HStack>
    </Box>
  )
}