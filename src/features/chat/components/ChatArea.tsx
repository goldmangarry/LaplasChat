import { Box, Flex, Text, Input, Button, Stack, Avatar, IconButton } from '@chakra-ui/react'
import { Send, Paperclip, MoreHorizontal, Copy, Download, ZoomIn } from 'lucide-react'
import { useState } from 'react'
import ChatHeader from './ChatHeader'

type Message = {
  id: string
  sender: string
  content: string
  timestamp: string
  avatar?: string
}

type ChatAreaProps = {
  messages: Message[]
  onSendMessage: (content: string, isSecure: boolean) => void
  isLoading?: boolean
}

const mockMessages: Message[] = [
  {
    id: '1',
    sender: 'Mauro Sicard',
    content: 'Lorem ipsum dolor sit amet consectetur adipiscing elit sed do eiusmod tempor incididunt ut labore et dolore magna aliqua ut enim ad minim veniam',
    timestamp: '2:45 PM',
    avatar: 'MS'
  },
  {
    id: '2',
    sender: 'LanguageGUI',
    content: 'Lorem ipsum dolor sit amet consectetur adipiscing elit sed do eiusmod tempor incididunt ut labore et dolore magna aliqua ut enim ad minim veniam quis nostrud exercitation ullamco',
    timestamp: '4:21 PM',
    avatar: 'AI'
  }
]

export default function ChatArea({ messages, onSendMessage, isLoading = false }: ChatAreaProps) {
  const [message, setMessage] = useState('')
  const [secureMode, setSecureMode] = useState(true)
  const [compareMode, setCompareMode] = useState(false)

  const handleSend = () => {
    if (message.trim() && !isLoading) {
      onSendMessage(message, secureMode)
      setMessage('')
    }
  }

  return (
    <Flex flex={1} direction="column" bg="white">
      {/* Header */}
      <ChatHeader
        secureMode={secureMode}
        compareMode={compareMode}
        onSecureModeChange={setSecureMode}
        onCompareModeChange={setCompareMode}
        onSettingsClick={() => console.log('Settings clicked')}
      />

      {/* Messages Area */}
      <Box flex={1} overflowY="auto" px={8} py={6}>
        <Text fontSize="sm" color="gray.500" textAlign="center" mb={6}>
          Today 2:45 PM
        </Text>
        
        <Stack direction="column" gap={6} align="stretch">
          {messages.length === 0 ? (
            mockMessages.map((msg) => (
              <Stack direction="row" key={msg.id} align="start" gap={4}>
                <Avatar.Root size="sm">
                  <Avatar.Fallback bg={msg.sender === 'LanguageGUI' ? 'orange.400' : 'purple.400'}>
                    {msg.avatar}
                  </Avatar.Fallback>
                </Avatar.Root>
                <Stack direction="column" align="start" flex={1} gap={1}>
                  <Stack direction="row">
                    <Text fontWeight="medium" fontSize="sm">{msg.sender}</Text>
                    <Text fontSize="xs" color="gray.500">{msg.timestamp}</Text>
                  </Stack>
                  <Text fontSize="sm" color="gray.700">{msg.content}</Text>
                </Stack>
                <Stack direction="row" opacity={0} _hover={{ opacity: 1 }} transition="opacity 0.2s">
                  <IconButton
                    aria-label="Copy"
                    size="xs"
                    variant="ghost"
                  >
                    <Copy size={16} />
                  </IconButton>
                  <IconButton
                    aria-label="Download"
                    size="xs"
                    variant="ghost"
                  >
                    <Download size={16} />
                  </IconButton>
                  <IconButton
                    aria-label="Zoom"
                    size="xs"
                    variant="ghost"
                  >
                    <ZoomIn size={16} />
                  </IconButton>
                  <IconButton
                    aria-label="More"
                    size="xs"
                    variant="ghost"
                  >
                    <MoreHorizontal size={16} />
                  </IconButton>
                </Stack>
              </Stack>
            ))
          ) : (
            messages.map((msg) => (
              <Stack direction="row" key={msg.id} align="start" gap={4}>
                <Avatar.Root size="sm">
                  <Avatar.Fallback bg={
                    msg.sender === 'LanguageGUI' ? 'orange.400' : 
                    msg.sender === 'System' ? 'red.400' :
                    'purple.400'
                  }>
                    {msg.avatar}
                  </Avatar.Fallback>
                </Avatar.Root>
                <Stack direction="column" align="start" flex={1} gap={1}>
                  <Stack direction="row">
                    <Text fontWeight="medium" fontSize="sm">{msg.sender}</Text>
                    <Text fontSize="xs" color="gray.500">{msg.timestamp}</Text>
                  </Stack>
                  <Text fontSize="sm" color="gray.700">{msg.content}</Text>
                </Stack>
                <Stack direction="row" opacity={0} _hover={{ opacity: 1 }} transition="opacity 0.2s">
                  <IconButton
                    aria-label="Copy"
                    size="xs"
                    variant="ghost"
                  >
                    <Copy size={16} />
                  </IconButton>
                  <IconButton
                    aria-label="Download"
                    size="xs"
                    variant="ghost"
                  >
                    <Download size={16} />
                  </IconButton>
                  <IconButton
                    aria-label="Zoom"
                    size="xs"
                    variant="ghost"
                  >
                    <ZoomIn size={16} />
                  </IconButton>
                  <IconButton
                    aria-label="More"
                    size="xs"
                    variant="ghost"
                  >
                    <MoreHorizontal size={16} />
                  </IconButton>
                </Stack>
              </Stack>
            ))
          )}
          {isLoading && (
            <Stack direction="row" align="start" gap={4}>
              <Avatar.Root size="sm">
                <Avatar.Fallback bg="orange.400">AI</Avatar.Fallback>
              </Avatar.Root>
              <Stack direction="column" align="start" flex={1} gap={1}>
                <Text fontWeight="medium" fontSize="sm">LanguageGUI</Text>
                <Text fontSize="sm" color="gray.500">Thinking...</Text>
              </Stack>
            </Stack>
          )}
        </Stack>
      </Box>

      {/* Input Area */}
      <Box p={4} borderTop="1px solid" borderColor="gray.200">
        <Stack direction="column" gap={3}>
          <Input
            placeholder="How can I help you?"
            value={message}
            onChange={(e) => setMessage(e.target.value)}
            onKeyPress={(e) => e.key === 'Enter' && handleSend()}
            bg="gray.50"
            border="1px solid"
            borderColor="gray.200"
            borderRadius="lg"
            py={6}
            px={4}
            _focus={{ borderColor: 'gray.400' }}
          />
          <Stack direction="row" justify="space-between" width="100%">
            <IconButton
              aria-label="Attach file"
              variant="ghost"
              size="sm"
            >
              <Paperclip size={16} />
            </IconButton>
            <Button
              bg="black"
              color="white"
              size="sm"
              _hover={{ bg: 'gray.800' }}
              onClick={handleSend}
              disabled={isLoading || !message.trim()}
            >
              <Send size={16} style={{ marginRight: '4px' }} />
              Send message
            </Button>
          </Stack>
        </Stack>
      </Box>
    </Flex>
  )
}