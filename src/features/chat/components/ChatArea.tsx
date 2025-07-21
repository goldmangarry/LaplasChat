import { Box, Flex, Stack, Center, Text } from '@chakra-ui/react'
import { useState, useEffect, useRef, useMemo } from 'react'
import { useChatStore } from '@/features/chat/store'
import type { Message } from '@/core/types'
import ChatHeader from './ChatHeader'
import { ChatMessage } from './ChatMessage'
import { ChatInput } from './ChatInput'
import { EncryptedResponseModal } from './EncryptedResponseModal'
import { FactCheckSidebar } from './FactCheckSidebar'
import { toaster } from '@/components/ui/toast'

type ChatAreaProps = {
  onOpenSettings?: () => void
}

export default function ChatArea({ onOpenSettings }: ChatAreaProps) {
  const { currentChatId, messagesByChat, isLoadingChat, factCheck, checkFacts, closeFactCheck } = useChatStore()
  const [secureMode, setSecureMode] = useState(true)
  const [encryptedContent, setEncryptedContent] = useState<string | null>(null)
  const messagesEndRef = useRef<HTMLDivElement>(null)

  const messages = useMemo(() => {
    return currentChatId ? messagesByChat[currentChatId] || [] : []
  }, [currentChatId, messagesByChat])

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' })
  }, [messages])

  const handleCopyMessage = (content: string) => {
    navigator.clipboard.writeText(content)
    toaster.create({
      title: 'Message copied!',
      type: 'success',
      duration: 2000,
    })
  }

  if (!currentChatId) {
    return (
      <Flex flex={1} direction="column" bg="white">
        <Center flex={1}>
          <Text color="gray.500" fontSize="lg">
            Select a chat to start messaging
          </Text>
        </Center>
      </Flex>
    )
  }

  return (
    <Flex flex={1} direction="column" bg="white" margin='16px' borderRadius='16px' >
      {/* Header */}
      <ChatHeader
        secureMode={secureMode}
        onSecureModeChange={setSecureMode}
        onOpenSettings={onOpenSettings}
      />

      {/* Messages Area */}
      <Box flex={1} overflowY="auto" px="10%" py={6}>
        <Stack direction="column" gap={6} align="stretch">
          {messages.map((msg: Message) => (
            <ChatMessage
              key={msg.id}
              userName={msg.author.name}
              userInitials={msg.author.avatar || msg.author.name.slice(0, 2).toUpperCase()}
              message={msg.content}
              timestamp={new Date(msg.timestamp).toLocaleTimeString('en-US', { 
                hour: '2-digit', 
                minute: '2-digit' 
              })}
              isAI={!msg.isOwnMessage}
              onCopy={() => handleCopyMessage(msg.content)}
              encryptedContent={msg.encryptedContent}
              onShowEncrypted={() => setEncryptedContent(msg.encryptedContent || null)}
              onFactCheck={!msg.isOwnMessage ? () => checkFacts(msg.content) : undefined}
            />
          ))}
          {isLoadingChat(currentChatId) && (
            <ChatMessage
              userName="Assistant"
              userInitials="AI"
              message="Thinking..."
              timestamp="now"
              isAI={true}
              onCopy={() => {}}
            />
          )}
          <div ref={messagesEndRef} />
        </Stack>
      </Box>

      {/* Input Area */}
      <Box px="10%" py={4}>
        <ChatInput
          placeholder="How can I help you?"
          disabled={isLoadingChat(currentChatId)}
        />
      </Box>

      {/* Encrypted Response Modal */}
      <EncryptedResponseModal
        isOpen={!!encryptedContent}
        onClose={() => setEncryptedContent(null)}
        content={encryptedContent || ''}
      />

      {/* Fact Check Sidebar */}
      <FactCheckSidebar
        isOpen={factCheck.isOpen}
        onClose={closeFactCheck}
        data={factCheck.data}
        isLoading={factCheck.isLoading}
      />
    </Flex>
  )
}