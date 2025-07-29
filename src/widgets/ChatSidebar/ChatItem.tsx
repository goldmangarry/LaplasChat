import { Box, Text, HStack, IconButton } from '@chakra-ui/react'
import { Trash2 } from 'lucide-react'
import { useChatStore } from '@/features/chat/store'
import { useState } from 'react'
import { DeleteChatModal } from './DeleteChatModal'
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
}

export function ChatItem({ id, title, type, isSelected, hasActions, onClick }: ChatItemProps) {
  const { deleteChat } = useChatStore()
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false)

  const handleDelete = (e: React.MouseEvent) => {
    e.stopPropagation()
    setIsDeleteModalOpen(true)
  }

  const handleConfirmDelete = () => {
    deleteChat(id)
    setIsDeleteModalOpen(false)
  }

  const handleCancelDelete = () => {
    setIsDeleteModalOpen(false)
  }
  return (
    <Box
      px="8px"
      py="6px"
      borderRadius="4px"
      bg={isSelected ? '#e4e4e7' : 'transparent'}
      cursor="pointer"
      onClick={onClick}
      _hover={{ bg: '#e4e4e7' }}
      position="relative"
      className="group"
    >
      <HStack gap="6px" align="center" position="relative">
        {/* AI Logo */}
        <Box width="20px" height="20px" flexShrink={0}>
          {type === 'both' ? (
            <Box position="relative" width="20px" height="20px">
              <img src={anthropicIcon} alt="Anthropic" width="14" height="14" />
              <Box
                position="absolute"
                bottom={0}
                right={0}
                width="14px"
                height="14px"
                borderRadius="full"
                overflow="hidden"
                display="flex"
                alignItems="center"
                justifyContent="center"
              >
                <img src={openaiIcon} alt="OpenAI" width="14" height="14" />
              </Box>
            </Box>
          ) : type === 'anthropic' ? (
            <img src={anthropicIcon} alt="Anthropic" width="20" height="20" />
          ) : type === 'google' ? (
            <img src={googleIcon} alt="Google" width="20" height="20" />
          ) : type === 'xai' ? (
            <img src={grokIcon} alt="Grok" width="20" height="20" />
          ) : (
            <img src={openaiIcon} alt="OpenAI" width="20" height="20" />
          )}
        </Box>
        
        {/* Title */}
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
            maxWidth: "calc(100% - 32px)"
          } : {}}
        >
          {title}
        </Text>

        {/* Delete Action */}
        {hasActions && (
          <IconButton
            aria-label="Delete"
            size="xs"
            variant="ghost"
            color="gray.600"
            position="absolute"
            right="4px"
            opacity={0}
            transition="opacity 0.2s"
            _groupHover={{ opacity: 1 }}
            onClick={handleDelete}
            minWidth="auto"
            height="auto"
            padding="4px"
          >
            <Trash2 size={14} />
          </IconButton>
        )}
      </HStack>
      
      {/* Delete Confirmation Modal */}
      <DeleteChatModal
        isOpen={isDeleteModalOpen}
        chatTitle={title}
        onConfirm={handleConfirmDelete}
        onCancel={handleCancelDelete}
      />
    </Box>
  )
}