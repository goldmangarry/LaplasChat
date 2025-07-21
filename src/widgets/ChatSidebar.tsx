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
import { ChatItem } from './ChatSidebar/ChatItem'
import { ChatTypeTab } from './ChatSidebar/ChatTypeTab'
import { UserInfo } from './ChatSidebar/UserInfo'
import { useState, useMemo } from 'react'
import type { Chat } from '@/core/types'

export default function ChatSidebar() {
  const { chats, currentChatId, createChat, selectChat, messagesByChat } = useChatStore()
  const [selectedType, setSelectedType] = useState<'chat' | 'image' | 'video'>('chat')

  const sortedChats = useMemo(() => {
    return chats.sort((a: Chat, b: Chat) => {
      const aTime = new Date(a.updatedAt).getTime()
      const bTime = new Date(b.updatedAt).getTime()
      return bTime - aTime
    })
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
            src="/assets/apilaplas-logo.svg"
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
            <Plus size={20} style={{ marginRight: '8px' }} />
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
              {sortedChats.map((chat: Chat) => (
                  <ChatItem
                    key={chat.id}
                    id={chat.id}
                    title={chat.title}
                    type={
                      chat.model.startsWith('openai/') ? 'openai' : 
                      chat.model.startsWith('anthropic/') ? 'anthropic' :
                      chat.model.startsWith('google/') ? 'google' :
                      chat.model.startsWith('x-ai/') ? 'xai' :
                      'openai'
                    }
                    isSelected={currentChatId === chat.id}
                    hasActions={true}
                    onClick={() => selectChat(chat.id)}
                  />
              ))}
              {sortedChats.length === 0 && (
                <Text 
                  fontSize="14px" 
                  color="gray.500" 
                  textAlign="center" 
                  py={4}
                >
                  No chats found
                </Text>
              )}
            </Stack>
          </Stack>
        </Stack>
      </Stack>

      {/* User Info */}
      <UserInfo
        name="Garry Goldman"
        email="garrygodzilla@gmail.com"
        avatarSrc="/assets/avatar.jpg"
      />
    </Stack>
  )
}