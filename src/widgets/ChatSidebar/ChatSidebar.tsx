import {
  Box,
  Text,
  Button,
  Stack,
  IconButton,
  HStack
} from '@chakra-ui/react'
import {
  MessageCircle,
  Plus,
  Image,
  Video,
  X
} from 'lucide-react'
import { useChatStore } from '@/features/chat/store'
import { useUserStore } from '@/core/store/user/store'
import { ChatItem } from './ChatItem'
import { ChatTypeTab } from './ChatTypeTab'
import { UserInfo } from './UserInfo'
import { ChatListSkeleton, UserProfileSkeleton } from '@/shared/ui'
import { useState, useMemo } from 'react'
import { useBreakpointValue } from '@chakra-ui/react'
import type { Chat } from '@/core/types'

type ChatSidebarProps = {
  onChatSelect?: () => void
}

export default function ChatSidebar({ onChatSelect }: ChatSidebarProps = {}) {
  const { chats, currentChatId, createChat, selectChat, isLoadingHistory } = useChatStore()
  const { user, isLoading: isLoadingUser } = useUserStore()
  const [selectedType, setSelectedType] = useState<'chat' | 'image' | 'video'>('chat')
  const isMobile = useBreakpointValue({ base: true, md: false })

  const sortedChats = useMemo(() => {
    // Возвращаем чаты как есть, без сортировки по времени
    // так как updatedAt больше нет
    return chats
  }, [chats])

  const handleCreateChat = () => {
    const newChatId = createChat()
    selectChat(newChatId)
    onChatSelect?.()
  }

  const handleSelectChat = (chatId: string) => {
    selectChat(chatId)
    onChatSelect?.()
  }


  return (
    <Stack
      width={{ base: "100%", md: "283px" }}
      height="100vh"
      bg="#fafafa"
      paddingX={{ base: "12px", md: "16px" }}
      paddingTop={{ base: "20px", md: "40px" }}
      paddingBottom="24px"
      justify="flex-start"
      align="flex-start"
      gap={0}
    >
      <Stack
        justify="flex-start"
        align="center"
        gap={{ base: "24px", md: "42px" }}
        overflow="hidden"
        flex="1"
        alignSelf="stretch"
      >
        {/* Header with Logo and Close Button */}
        <HStack justify="space-between" align="center" width="100%">
          <Box 
            width={{ base: "120px", md: "148px" }} 
            height={{ base: "32px", md: "40px" }}
          >
            <img
              src="/assets/logo-chat.svg"
              alt="apilaplas"
              width="148"
              height="40"
              style={{ 
                width: '100%', 
                height: '100%',
                objectFit: 'contain'
              }}
            />
          </Box>
          
          {/* Close Button - только на мобильных */}
          {isMobile && onChatSelect && (
            <IconButton
              aria-label="Close sidebar"
              variant="ghost"
              size="sm"
              onClick={onChatSelect}
              color="gray.600"
              _hover={{ bg: "gray.100" }}
            >
              <X size={20} />
            </IconButton>
          )}
        </HStack>

        <Stack
          justify="flex-start"
          align="center"
          gap={{ base: "20px", md: "33px" }}
          alignSelf="stretch"
        >
          {/* Start new chat button */}
          <Button
            height={{ base: "36px", md: "40px" }}
            alignSelf="stretch"
            bg="#18181b"
            color="white"
            _hover={{ bg: '#27272a' }}
            borderRadius="md"
            fontSize={{ base: "13px", md: "14px" }}
            fontWeight="600"
            onClick={handleCreateChat}
          >
            <Plus size={16} style={{ marginRight: '6px' }} />
            Start new chat
          </Button>

          {/* Chat type tabs */}
          <Stack direction="column" gap={1} alignSelf="stretch" position="relative">
            <ChatTypeTab
              icon={MessageCircle}
              label="Chat"
              isSelected={selectedType === 'chat'}
              onClick={() => setSelectedType('chat')}
            />
            <ChatTypeTab
              icon={Image}
              label="Image"
              isDisabled
              badge="soon"
              isSelected={false}
              onClick={() => {}}
            />
            <ChatTypeTab
              icon={Video}
              label="Video"
              isDisabled
              badge="soon"
              isSelected={false}
              onClick={() => {}}
            />
          </Stack>

          {/* Chats Container */}
          <Stack direction="column" gap={{ base: 2, md: 3 }} alignSelf="stretch" flex={1} overflow="hidden">
            <Text fontSize={{ base: "14px", md: "16px" }} lineHeight={{ base: "20px", md: "24px" }} fontWeight="400" color="#52525b">
              Chats ({sortedChats.length})
            </Text>

            {/* Chat Items */}
            <Stack
              direction="column"
              gap={1}
              flex={1}
              overflowY="auto"
              css={{
                '&::-webkit-scrollbar': {
                  width: '4px',
                },
                '&::-webkit-scrollbar-track': {
                  background: 'transparent',
                },
                '&::-webkit-scrollbar-thumb': {
                  background: '#CBD5E0',
                  borderRadius: '2px',
                },
                '&::-webkit-scrollbar-thumb:hover': {
                  background: '#A0AEC0',
                },
              }}
            >
              {isLoadingHistory ? (
                <ChatListSkeleton count={6} />
              ) : sortedChats.length > 0 ? (
                sortedChats.map((chat: Chat) => (
                  <ChatItem
                    key={chat.id}
                    id={chat.id}
                    title={chat.title}
                    isSelected={currentChatId === chat.id}
                    hasActions={true}
                    onClick={() => handleSelectChat(chat.id)}
                  />
                ))
              ) : (
                <Stack
                  position="absolute"
                  top="50%"
                  left="5%"
                  align="center"
                  justify="center"
                  gap="0"
                >
                  <Box
                    width={{ base: "40px", md: "48px" }}
                    height={{ base: "40px", md: "48px" }}
                    display="flex"
                    alignItems="center"
                    justifyContent="center"
                  >
                    <img src="/assets/not-chats.svg" alt="chat"
                      width="78"
                      height="78"
                      style={{ 
                        width: '100%', 
                        height: '100%',
                        objectFit: 'contain'
                      }} />
                  </Box>
                  <Text
                    fontSize={{ base: "16px", md: "18px" }}
                    fontWeight="700"
                    color="#A1A1AA"
                    textAlign="center"
                  >
                    No chats
                  </Text>
                </Stack>
              )}
            </Stack>
          </Stack>
        </Stack>
      </Stack>

      {/* User Info */}
      {isLoadingUser ? (
        <UserProfileSkeleton />
      ) : (
        <UserInfo
          name={user ? `${user.first_name} ${user.last_name}` : 'Loading...'}
          email={user?.email || ''}
          avatarSrc={user?.avatar_url}
        />
      )}
    </Stack>
  )
}
