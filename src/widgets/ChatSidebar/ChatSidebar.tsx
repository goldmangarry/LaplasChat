import {
  Box,
  Text,
  Button,
  Stack
} from '@chakra-ui/react'
import {
  MessageCircle,
  Plus,
  Image,
  Video
} from 'lucide-react'
import { useChatStore } from '@/features/chat/store'
import { useUserStore } from '@/core/store/user/store'
import { ChatItem } from './ChatItem'
import { ChatTypeTab } from './ChatTypeTab'
import { UserInfo } from './UserInfo'
import { ChatListSkeleton, UserProfileSkeleton } from '@/shared/ui'
import { useState, useMemo } from 'react'
import type { Chat } from '@/core/types'

export default function ChatSidebar() {
  const { chats, currentChatId, createChat, selectChat, isLoadingHistory } = useChatStore()
  const { user, isLoading: isLoadingUser } = useUserStore()
  const [selectedType, setSelectedType] = useState<'chat' | 'image' | 'video'>('chat')

  const sortedChats = useMemo(() => {
    // Возвращаем чаты как есть, без сортировки по времени
    // так как updatedAt больше нет
    return chats
  }, [chats])

  const handleCreateChat = () => {
    const newChatId = createChat()
    selectChat(newChatId)
  }


  return (
    <Stack
      width="283px"
      height="100vh"
      bg="#fafafa"
      paddingX="16px"
      paddingTop="40px"
      paddingBottom="24px"
      justify="flex-start"
      align="flex-start"
      gap={0}
    >
      <Stack
        justify="flex-start"
        align="center"
        gap="42px"
        overflow="hidden"
        flex="1"
        alignSelf="stretch"
      >
        {/* Logo */}
        <Box width="148px" height="40px">
          <img
            src="/assets/logo-chat.svg"
            alt="apilaplas"
            width="148"
            height="40"
            style={{ width: '148px', height: '40px' }}
          />
        </Box>

        <Stack
          justify="flex-start"
          align="center"
          gap="33px"
          alignSelf="stretch"
        >
          {/* Start new chat button */}
          <Button
            height="40px"
            alignSelf="stretch"
            bg="#18181b"
            color="white"
            _hover={{ bg: '#27272a' }}
            borderRadius="md"
            fontSize="14px"
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
          <Stack direction="column" gap={3} alignSelf="stretch" flex={1} overflow="hidden">
            <Text fontSize="16px" lineHeight="24px" fontWeight="400" color="#52525b">
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
                    onClick={() => selectChat(chat.id)}
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
                    width="48px"
                    height="48px"
                    display="flex"
                    alignItems="center"
                    justifyContent="center"
                  >
                    <img src="/assets/not-chats.svg" alt="chat"
                      width="78"
                      height="78"
                      style={{ width: '78px', height: '78px' }} />
                  </Box>
                  <Text
                    fontSize="18px"
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
