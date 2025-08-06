import { Box, Text, HStack, IconButton, Input, Menu, Portal } from '@chakra-ui/react'
import { MoreHorizontal, Check, X, Edit2, Trash2, ShieldCheck } from 'lucide-react'
import { useChatStore } from '@/features/chat/store'
import { useState, useRef, useEffect } from 'react'
import { DeleteChatModal } from './DeleteChatModal'

type ChatItemProps = {
  id: string
  title: string
  isSelected: boolean
  hasActions?: boolean
  hasEncryptedMessages?: boolean
  onClick: () => void
}

export function ChatItem({ id, title, isSelected, hasActions, hasEncryptedMessages, onClick }: ChatItemProps) {
  const { deleteChat, updateChatTitle } = useChatStore()
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false)
  const [isEditing, setIsEditing] = useState(false)
  const [editTitle, setEditTitle] = useState(title)
  const [isMenuOpen, setIsMenuOpen] = useState(false)
  const inputRef = useRef<HTMLInputElement>(null)

  useEffect(() => {
    if (isEditing && inputRef.current) {
      inputRef.current.focus()
      inputRef.current.select()
    }
  }, [isEditing])

  const handleDelete = () => {
    setIsMenuOpen(false)
    setIsDeleteModalOpen(true)
  }

  const handleConfirmDelete = () => {
    deleteChat(id)
    setIsDeleteModalOpen(false)
  }

  const handleCancelDelete = () => {
    setIsDeleteModalOpen(false)
  }

  const handleRename = () => {
    setIsMenuOpen(false)
    setIsEditing(true)
    setEditTitle(title)
  }

  const handleSaveRename = () => {
    if (editTitle.trim() && editTitle !== title) {
      updateChatTitle(id, editTitle.trim())
    }
    setIsEditing(false)
  }

  const handleCancelRename = () => {
    setEditTitle(title)
    setIsEditing(false)
  }

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter') {
      handleSaveRename()
    } else if (e.key === 'Escape') {
      handleCancelRename()
    }
  }
  return (
    <Box
      px="8px"
      py="6px"
      borderRadius="4px"
      bg={isSelected ? '#e4e4e7' : 'transparent'}
      cursor="pointer"
      onClick={!isEditing ? onClick : undefined}
      _hover={{ bg: '#e4e4e7' }}
      position="relative"
      className="group"
    >
      <HStack gap="6px" align="center" position="relative">
        {/* Title or Edit Input */}
        {isEditing ? (
          <HStack flex={1} gap="4px">
            <Input
              ref={inputRef}
              value={editTitle}
              onChange={(e) => setEditTitle(e.target.value)}
              onKeyDown={handleKeyDown}
              fontSize="12px"
              height="20px"
              padding="2px 4px"
              borderRadius="4px"
              flex={1}
              onClick={(e) => e.stopPropagation()}
            />
            <IconButton
              aria-label="Save"
              size="xs"
              variant="ghost"
              onClick={(e) => {
                e.stopPropagation()
                handleSaveRename()
              }}
              minWidth="20px"
              height="20px"
            >
              <Check size={14} />
            </IconButton>
            <IconButton
              aria-label="Cancel"
              size="xs"
              variant="ghost"
              onClick={(e) => {
                e.stopPropagation()
                handleCancelRename()
              }}
              minWidth="20px"
              height="20px"
            >
              <X size={14} />
            </IconButton>
          </HStack>
        ) : (
          <HStack gap="4px" flex={1} overflow="hidden" maxWidth={hasActions && title !== 'New Chat' ? "calc(100% - 32px)" : "100%"}>
            <Text 
              fontSize="12px" 
              lineHeight="16px"
              fontWeight="400"
              color="#000000"
              overflow="hidden"
              textOverflow="ellipsis"
              whiteSpace="nowrap"
            >
              {title}
            </Text>
            {hasEncryptedMessages && (
              <ShieldCheck style={{ minWidth: '16px' }} size={16} color="#666666" />
            )}
          </HStack>
        )}

        {/* Menu Action */}
        {hasActions && !isEditing && title !== 'New Chat' && (
          <Menu.Root
            open={isMenuOpen}
            onOpenChange={(e) => setIsMenuOpen(e.open)}
            positioning={{
              placement: "bottom-end",
              strategy: "fixed",
              gutter: 4
            }}
          >
            <Menu.Trigger asChild>
              <IconButton
                aria-label="Menu"
                size="xs"
                variant="ghost"
                color="gray.600"
                opacity={isMenuOpen ? 1 : 0}
                transition="opacity 0.2s"
                _groupHover={{ opacity: 1 }}
                onClick={(e) => {
                  e.stopPropagation()
                }}
                minWidth="20px"
                height="20px"
                padding="2px"
              >
                <MoreHorizontal size={16} />
              </IconButton>
            </Menu.Trigger>
            <Portal>
              <Menu.Positioner>
                <Menu.Content
                  bg="white"
                  borderRadius="8px"
                  boxShadow="0 2px 8px rgba(0, 0, 0, 0.15)"
                  border="1px solid"
                  borderColor="gray.200"
                  minWidth="160px"
                  overflow="hidden"
                >
                  <Menu.Item
                    value="rename"
                    px="12px"
                    py="8px"
                    cursor="pointer"
                    _hover={{ bg: 'gray.50' }}
                    onClick={(e) => {
                      e.stopPropagation()
                      handleRename()
                    }}
                  >
                    <HStack gap="8px">
                      <Edit2 size={14} />
                      <Text fontSize="14px">Переименовать</Text>
                    </HStack>
                  </Menu.Item>
                  <Menu.Item
                    value="delete"
                    px="12px"
                    py="8px"
                    cursor="pointer"
                    _hover={{ bg: 'red.50' }}
                    color="red.600"
                    onClick={(e) => {
                      e.stopPropagation()
                      handleDelete()
                    }}
                  >
                    <HStack gap="8px">
                      <Trash2 size={14} />
                      <Text fontSize="14px">Удалить</Text>
                    </HStack>
                  </Menu.Item>
                </Menu.Content>
              </Menu.Positioner>
            </Portal>
          </Menu.Root>
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