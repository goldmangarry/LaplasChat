import { Box, Flex, Text, Stack } from '@chakra-ui/react'
import { useState } from 'react'
import ChatHeader from './ChatHeader'
import { ChatMessage } from './ChatMessage'
import { ChatInput } from './ChatInput'

type Message = {
  id: string
  sender: string
  content: string
  timestamp: string
  avatar?: string
  isAI?: boolean
}

type ChatAreaProps = {
  messages: Message[]
  onSendMessage: (content: string, isSecure: boolean) => void
  isLoading?: boolean
}


export default function ChatArea({ messages, onSendMessage, isLoading = false }: ChatAreaProps) {
  const [secureMode, setSecureMode] = useState(true)
  const [compareMode, setCompareMode] = useState(false)

  const handleSend = (message: string) => {
    if (message.trim() && !isLoading) {
      onSendMessage(message, secureMode)
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
          {messages.map((msg) => (
            <ChatMessage
              key={msg.id}
              userName={msg.sender}
              userInitials={msg.avatar || msg.sender.slice(0, 2).toUpperCase()}
              message={msg.content}
              timestamp={msg.timestamp}
              isAI={msg.isAI ?? (msg.sender.toLowerCase().includes('languagegui') || msg.sender.toLowerCase().includes('ai') || msg.sender.toLowerCase().includes('bot'))}
              onEdit={() => console.log('Edit clicked for', msg.id)}
              onCopy={() => navigator.clipboard.writeText(msg.content)}
              onCheck={() => console.log('Check clicked for', msg.id)}
            />
          ))}
          {isLoading && (
            <ChatMessage
              userName="LanguageGUI"
              userInitials="AI"
              message="Thinking..."
              timestamp="now"
              isAI={true}
              onEdit={() => {}}
              onCopy={() => {}}
              onCheck={() => {}}
            />
          )}
        </Stack>
      </Box>

      {/* Input Area */}
      <Box p={4}>
        <ChatInput
          placeholder="How can I help you?"
          onSendMessage={handleSend}
          disabled={isLoading}
        />
      </Box>
    </Flex>
  )
}