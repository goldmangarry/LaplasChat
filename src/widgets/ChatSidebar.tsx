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
import { ChatItem } from './ChatSidebar/ChatItem'
import { ChatTypeTab } from './ChatSidebar/ChatTypeTab'
import { SearchInput } from './ChatSidebar/SearchInput'
import { UserInfo } from './ChatSidebar/UserInfo'

type ChatSidebarProps = {
  selectedChat: string | null
  onSelectChat: (chatId: string) => void
}

type Chat = {
  id: string
  title: string
  type: 'anthropic' | 'openai' | 'both'
  hasActions?: boolean
}

const mockChat: Chat = {
  id: '1',
  title: 'Help me build a React component',
  type: 'anthropic',
  hasActions: true
}

export default function ChatSidebar({ selectedChat, onSelectChat }: ChatSidebarProps) {
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
          >
            <Plus size={20} style={{ marginRight: '8px' }} />
            Start new chat
          </Button>

          {/* Search input */}
          <SearchInput />

          {/* Chat type tabs */}
          <Stack direction="column" gap={1} alignSelf="stretch" position="relative">
            <ChatTypeTab
              icon={MessageCircle}
              label="Chat"
              isSelected={selectedChat === '1'}
              onClick={() => onSelectChat('1')}
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
              Chats
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
              <ChatItem
                key={mockChat.id}
                id={mockChat.id}
                title={mockChat.title}
                type={mockChat.type}
                isSelected={selectedChat === mockChat.id}
                hasActions={mockChat.hasActions}
                onClick={() => onSelectChat(mockChat.id)}
              />
            </Stack>
          </Stack>
        </Stack>
      </Stack>

      {/* User Info */}
      <UserInfo
        name="Segun Adebayo"
        email="segunadebayo@example.com"
        avatarSrc="/assets/user-avatar.png"
      />
    </Stack>
  )
}