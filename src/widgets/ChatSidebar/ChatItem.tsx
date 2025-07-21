import { Box, Text, HStack, IconButton, VStack, Badge } from '@chakra-ui/react'
import { Trash2 } from 'lucide-react'
import { useChatStore } from '@/features/chat/store'
import anthropicIcon from '../../assets/icons/anthropic.svg'
import openaiIcon from '../../assets/icons/openai.svg'
import googleIcon from '../../assets/icons/google.svg'
import grokIcon from '../../assets/icons/grok.svg'

type ChatItemProps = {
  id: string
  title: string
  type: 'anthropic' | 'openai' | 'google' | 'xai' | 'both'
  isSelected: boolean
  hasActions?: boolean
  onClick: () => void
  lastMessage?: string
  timestamp?: string
  unreadCount?: number
}

export function ChatItem({ id, title, type, isSelected, hasActions, onClick, lastMessage, timestamp, unreadCount }: ChatItemProps) {
  const { deleteChat } = useChatStore()

  const handleDelete = (e: React.MouseEvent) => {
    e.stopPropagation()
    if (confirm('Are you sure you want to delete this chat?')) {
      deleteChat(id)
    }
  }
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
        ) : type === 'google' ? (
          <img src={googleIcon} alt="Google" width="28" height="28" />
        ) : type === 'xai' ? (
          <img src={grokIcon} alt="Grok" width="28" height="28" />
        ) : (
          <img src={openaiIcon} alt="OpenAI" width="28" height="28" />
        )}
        
        {/* Chat content */}
        <VStack align="start" flex={1} gap={0.5} overflow="hidden">
          <HStack width="100%" justify="space-between">
            <Text 
              fontSize="12px" 
              lineHeight="16px"
              fontWeight="500"
              color="#000000"
              flex={1}
              overflow="hidden"
              textOverflow="ellipsis"
              whiteSpace="nowrap"
              _groupHover={hasActions ? { 
                maxWidth: "calc(100% - 45px)"
              } : {}}
            >
              {title}
            </Text>
            {timestamp && (
              <Text
                fontSize="10px"
                color="gray.500"
                flexShrink={0}
              >
                {timestamp}
              </Text>
            )}
          </HStack>
          {lastMessage && (
            <Text
              fontSize="11px"
              color="gray.600"
              overflow="hidden"
              textOverflow="ellipsis"
              whiteSpace="nowrap"
              width="100%"
            >
              {lastMessage}
            </Text>
          )}
        </VStack>
        
        {/* Unread badge */}
        {unreadCount && unreadCount > 0 && (
          <Badge
            colorScheme="blue"
            borderRadius="full"
            px={2}
            fontSize="10px"
            position="absolute"
            right={2}
            top="50%"
            transform="translateY(-50%)"
          >
            {unreadCount}
          </Badge>
        )}

        {/* Actions */}
        {hasActions && (
          <IconButton
            aria-label="Delete"
            size="xs"
            variant="ghost"
            color="gray.800"
            position="absolute"
            right={2}
            opacity={0}
            transition="opacity 0.2s"
            _groupHover={{ opacity: 1 }}
            onClick={handleDelete}
          >
            <Trash2 size={16} />
          </IconButton>
        )}
      </HStack>
    </Box>
  )
}