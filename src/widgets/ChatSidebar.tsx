import { 
  Box, 
  Text, 
  Button, 
  Badge, 
  IconButton,
  Input,
  Avatar,
  Stack,
  Circle,
  HStack,
  VStack
} from '@chakra-ui/react'
import { 
  MessageCircle, 
  Plus, 
  Search, 
  Image, 
  Video, 
  Share2, 
  Edit3, 
  Trash2 
} from 'lucide-react'

type ChatSidebarProps = {
  selectedChat: string | null
  onSelectChat: (chatId: string) => void
}

type ChatItem = {
  id: string
  title: string
  type: 'general' | 'image' | 'video' | 'chat'
  badge?: string
  hasActions?: boolean
  aiLogos?: string[]
}

const mockChats: ChatItem[] = [
  { id: '1', title: 'Chat', type: 'general' },
  { id: '2', title: 'Image', type: 'image', badge: 'soon' },
  { id: '3', title: 'Video', type: 'video', badge: 'soon' },
  { id: '4', title: 'Create html game environment for website', type: 'chat' },
  { id: '5', title: 'Create html game environment for website', type: 'chat' },
  { id: '6', title: 'Create html game e...', type: 'chat', hasActions: true, aiLogos: ['ai1', 'ai2'] },
  { id: '7', title: 'Create html game environment for website', type: 'chat' },
  { id: '8', title: 'Create html game environment for website', type: 'chat' },
  { id: '9', title: 'Create html game environment for website', type: 'chat' },
  { id: '10', title: 'Create html game environment for website', type: 'chat' },
  { id: '11', title: 'Create html game environment for website', type: 'chat' },
  { id: '12', title: 'Create html game environment for website', type: 'chat' },
]

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
          <Box position="relative" width="100%">
            <Box
              position="absolute"
              left="10px"
              top="50%"
              transform="translateY(-50%)"
              display="flex"
              alignItems="center"
              justifyContent="center"
              zIndex={1}
              pointerEvents="none"
            >
              <Search
                size={18}
                color="#27272a"
              />
            </Box>
            <Input
              placeholder="Search for chats..."
              paddingLeft="36px"
              paddingRight="10px"
              height="36px"
              fontSize="14px"
              fontWeight="400"
              lineHeight="20px"
              bg="white"
              borderColor="#e4e4e7"
              borderWidth="1px"
              borderRadius="6px"
              color="#27272a"
              _placeholder={{
                color: "#a1a1aa",
                fontSize: "14px",
                fontWeight: "400",
                lineHeight: "20px"
              }}
              _focus={{
                borderColor: "#a1a1aa",
                boxShadow: "none"
              }}
            />
          </Box>

          {/* Chat type tabs */}
          <Stack direction="column" gap={1} alignSelf="stretch" position="relative">
            <Box
              px={2}
              py={1.5}
              borderRadius="md"
              bg={selectedChat === '1' ? '#e4e4e7' : 'transparent'}
              cursor="pointer"
              onClick={() => onSelectChat('1')}
              _hover={{ bg: '#e4e4e7' }}
            >
              <HStack gap={1.5}>
                <MessageCircle size={16} />
                <Text fontSize="14px" fontWeight="400" lineHeight="20px">Chat</Text>
              </HStack>
            </Box>

            <Box position="relative">
              <Box
                px={2}
                py={1.5}
                borderRadius="md"
                opacity={0.5}
                cursor="not-allowed"
                _hover={{ bg: 'gray.100' }}
              >
                <HStack gap={1.5}>
                  <Image size={16} />
                  <Text fontSize="14px" fontWeight="400" lineHeight="20px">Image</Text>
                </HStack>
              </Box>
              <Badge
                position="absolute"
                top="8px"
                right="16px"
                bg="#ec4899"
                color="#f5f5f5"
                fontSize="10px"
                fontWeight="700"
                lineHeight="14px"
                px="7px"
                pb="2px"
                borderRadius="16px"
              >
                soon
              </Badge>
            </Box>

            <Box position="relative">
              <Box
                px={2}
                py={1.5}
                borderRadius="md"
                opacity={0.5}
                cursor="not-allowed"
                _hover={{ bg: 'gray.100' }}
              >
                <HStack gap={1.5}>
                  <Video size={16} />
                  <Text fontSize="14px" fontWeight="400" lineHeight="20px">Video</Text>
                </HStack>
              </Box>
              <Badge
                position="absolute"
                top="8px"
                right="16px"
                bg="#ec4899"
                color="#f5f5f5"
                fontSize="10px"
                fontWeight="700"
                lineHeight="14px"
                px="7px"
                pb="2px"
                borderRadius="16px"
              >
                soon
              </Badge>
            </Box>
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
              {mockChats.slice(3).map((chat) => (
                <Box
                  key={chat.id}
                  px={2}
                  py={1.5}
                  borderRadius="4px"
                  bg={selectedChat === chat.id ? '#e4e4e7' : 'white'}
                  cursor="pointer"
                  onClick={() => onSelectChat(chat.id)}
                  _hover={{ bg: '#e4e4e7' }}
                  position="relative"
                  className="group"
                >
                  <HStack gap={2} align="center">
                    {/* AI Logo */}
                    {chat.aiLogos ? (
                      <Box position="relative" width="28px" height="28px">
                        <Circle size="20px" bg="#cc9b7a" position="absolute" top={0} left={0} />
                        <Circle size="20px" bg="#74aa9c" position="absolute" bottom={0} right={0} />
                      </Box>
                    ) : (
                      <Circle size="28px" bg="#cc9b7a" />
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
                    >
                      {chat.title}
                    </Text>

                    {/* Actions */}
                    {chat.hasActions && (
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
              ))}
            </Stack>
          </Stack>
        </Stack>
      </Stack>

      {/* User Info */}
      <HStack gap={2} paddingY="8px" alignSelf="stretch">
        <Avatar.Root size="md">
          <Avatar.Image 
            src="/assets/user-avatar.jpg" 
            alt="Segun Adebayo"
          />
          <Avatar.Fallback bg="gray.400" color="white">
            SA
          </Avatar.Fallback>
        </Avatar.Root>
        <VStack gap={0} align="flex-start" flex={1}>
          <Text fontSize="16px" lineHeight="24px" fontWeight="500" color="#000000">
            Segun Adebayo
          </Text>
          <Text fontSize="14px" lineHeight="20px" fontWeight="400" color="#52525b">
            segunadebayo@example.com
          </Text>
        </VStack>
      </HStack>
    </Stack>
  )
}