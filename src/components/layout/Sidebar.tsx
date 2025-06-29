import { VStack, Box, Text, HStack, Avatar } from '@chakra-ui/react'
import { Logo, NewChatButton, ChatSearch, Navigation, ChatItem } from '../ui'
import type { Chat } from '../../types'

type SidebarProps = {
  chats?: Chat[]
  selectedChatId?: string
  onChatSelect?: (chatId: string) => void
  onNewChat?: () => void
}

// Моковые данные для демонстрации
const mockChats: Chat[] = [
  {
    id: '1',
    title: 'Create html game environment for website',
    lastMessage: '',
    avatar: ''
  },
  {
    id: '2',
    title: 'What is UX audit?',
    lastMessage: '',
    avatar: ''
  },
  {
    id: '3',
    title: 'Create POS syst...',
    lastMessage: '',
    avatar: '',
    isActive: true
  },
  {
    id: '4',
    title: 'Crypto Lending App Name',
    lastMessage: '',
    avatar: ''
  },
  {
    id: '5',
    title: 'Crypto Operator Grammar TypesLending App Name',
    lastMessage: '',
    avatar: ''
  },
  {
    id: '6',
    title: 'Crypto Operator Grammar TypesLending App Name',
    lastMessage: '',
    avatar: ''
  }
]

export const Sidebar = ({ 
  chats = mockChats, 
  selectedChatId = '3',
  onChatSelect,
  onNewChat
}: SidebarProps) => {
  return (
    <VStack 
      height="100vh" 
      bg="#e4e5ea" 
      p={0}
      gap={0}
      align="stretch"
      position="relative"
    >
      {/* Logo Section */}
      <Box py={6} px={0} alignSelf="center">
        <Logo />
      </Box>
      
      {/* Main Content Wrapper */}
      <VStack 
        flex={1} 
        px={4} 
        pt={6} 
        pb={4} 
        gap={6} 
        align="stretch"
        overflow="hidden"
      >
        {/* New Chat Button */}
        <NewChatButton onClick={onNewChat} />
        
        {/* Search */}
        <ChatSearch />
        
        {/* Navigation */}
        <Navigation />
        
        {/* Chats Section */}
        <VStack gap={3} align="stretch" flex={1} overflow="hidden" position="relative">
          <Text 
            fontSize="12px" 
            fontWeight="500" 
            color="#787f97" 
            textTransform="uppercase" 
            letterSpacing="0.1em"
            px={2.5}
          >
            CHATS
          </Text>
          
          {/* Chat List */}
          <VStack gap={0.5} align="stretch" overflow="auto" flex={1}>
            {chats.map((chat) => (
              <ChatItem
                key={chat.id}
                chat={chat}
                isSelected={chat.id === selectedChatId}
                onClick={() => onChatSelect?.(chat.id)}
              />
            ))}
          </VStack>
          
          {/* Gradient Overlay */}
          <Box
            position="absolute"
            bottom="0"
            left="0"
            right="0"
            height="99px"
            background="linear-gradient(to bottom, transparent 0%, #e4e5ea 100%)"
            pointerEvents="none"
          />
        </VStack>
      </VStack>
      
      {/* User Profile */}
      <HStack gap={2} p={5} borderTop="1px solid" borderColor="#d8d9e2">
        <Avatar.Root size="md">
          <Avatar.Fallback name="Mauro Sicard" bg="#f3e6ed" />
          <Avatar.Image src="https://bit.ly/dan-abramov" alt="Mauro Sicard" />
        </Avatar.Root>
        <VStack gap={0.5} align="flex-start" flex={1}>
          <Text fontSize="12px" fontWeight="500" color="#24262d">
            Mauro Sicard
          </Text>
          <Text fontSize="12px" fontWeight="500" color="#606679">
            contact@maurosicard.com
          </Text>
        </VStack>
        <Box fontSize="20px" color="#484c5b" cursor="pointer">
          ⚙️
        </Box>
      </HStack>
    </VStack>
  )
}