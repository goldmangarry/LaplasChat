import { Box, Flex, Stack, Center, Text } from '@chakra-ui/react'
import { useState, useEffect, useRef, useMemo, useCallback } from 'react'
import { useChatStore } from '@/features/chat/store'
import type { Message } from '@/core/types'
import ChatHeader from './ChatHeader'
import { ChatMessage } from './ChatMessage'
import { ChatInput } from './ChatInput'
import { EncryptedResponseModal } from './EncryptedResponseModal'
import { FactCheckSidebar } from './FactCheckSidebar'
import { toaster } from '@/components/ui/toast'
import { ChatSuggestions } from './ChatSuggestions'

type ChatAreaProps = {
  onOpenSettings?: () => void
}

export default function ChatArea({ onOpenSettings }: ChatAreaProps) {
  const {
    currentChatId,
    messagesByChat,
    isLoadingChat,
    factCheck,
    checkFacts,
    closeFactCheck,
    chats,
    updateChatSettings,
    sendMessage,
    selectChat,
  } = useChatStore()
  const [encryptedContent, setEncryptedContent] = useState<string | null>(null)
  const messagesEndRef = useRef<HTMLDivElement>(null)
  
  const currentChat = chats.find(chat => chat.id === currentChatId)
  
  // Проверяем корректность currentChatId и исправляем при необходимости
  useEffect(() => {
    if (currentChatId && !currentChat && chats.length > 0) {
      console.warn('Current chat not found, selecting first available chat')
      selectChat(chats[0].id)
    }
  }, [currentChatId, currentChat, chats, selectChat])
  
  const handleSecureModeChange = useCallback((enabled: boolean) => {
    if (currentChatId && currentChat) {
      updateChatSettings(currentChatId, { secureMode: enabled })
    }
    // Если нет активного чата, ничего не делаем - настройка применится к новому чату
  }, [currentChatId, currentChat, updateChatSettings])

  const messages = useMemo(() => {
    return currentChatId ? messagesByChat[currentChatId] || [] : []
  }, [currentChatId, messagesByChat])

  useEffect(() => {
    if (messages.length > 0) {
      messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' })
    }
  }, [messages])

  const handleCopyMessage = (content: string) => {
    navigator.clipboard.writeText(content)
    toaster.create({
      title: 'Message copied!',
      type: 'success',
      duration: 2000,
    })
  }

  const handleSuggestionClick = (text: string) => {
    // Отправляем сообщение даже если нет активного чата (будет создан автоматически)
    if (currentChatId && currentChat) {
      sendMessage(currentChatId, text)
    } else {
      // Если нет чата, sendMessage создаст новый автоматически
      sendMessage('temp-id', text)
    }
  }

  // Если нет чатов вообще, показываем экран с предложениями
  if (chats.length === 0) {
    return (
      <Flex flex={1} direction="column" bg="white">
        {/* Header для состояния без чатов */}
        <ChatHeader
          secureMode={true}
          onSecureModeChange={handleSecureModeChange}
          onOpenSettings={onOpenSettings}
        />

        {/* Центрированный контент с предложениями и инпутом */}
        <Flex
          flex={1}
          direction="column"
          justifyContent="center"
          overflowY="auto"
        >
          <Box px="10%" pb={6} flexShrink={0}>
            <Box
              mx="auto"
              width={{ base: '100%', md: '80%', lg: '75%' }}
            >
              <Box mb={4}>
                <ChatSuggestions onSuggestionClick={handleSuggestionClick} />
              </Box>
              <ChatInput
                placeholder="How can I help you?"
                disabled={false}
              />
            </Box>
          </Box>
        </Flex>
      </Flex>
    )
  }

  // Если чат выбран неправильно, но чаты есть
  if (!currentChatId || !currentChat) {
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
    <Flex flex={1} direction="column" bg="white">
      {/* Header */}
      <ChatHeader
        secureMode={currentChat?.secureMode ?? true}
        onSecureModeChange={handleSecureModeChange}
        onOpenSettings={onOpenSettings}
      />

      {/* Messages and Input Area */}
      <Flex
        flex={1}
        direction="column"
        justifyContent={
          messages.length > 0 || isLoadingChat(currentChatId)
            ? 'space-between'
            : 'center'
        }
        overflowY="auto"
      >
        {/* Messages Area */}
        <Box
          flex={messages.length > 0 || isLoadingChat(currentChatId) ? 1 : 0}
          overflowY="auto"
          px="10%"
          py={6}
        >
          <Stack direction="column" gap={6} align="stretch">
            {messages.map((msg: Message) => (
              <ChatMessage
                key={msg.id}
                userName={msg.author.name}
                userInitials={
                  msg.author.avatar || msg.author.name.slice(0, 2).toUpperCase()
                }
                message={msg.content}
                timestamp={new Date(msg.timestamp).toLocaleTimeString('en-US', {
                  hour: '2-digit',
                  minute: '2-digit',
                })}
                isAI={!msg.isOwnMessage}
                onCopy={() => handleCopyMessage(msg.content)}
                encryptedContent={msg.encryptedContent}
                onShowEncrypted={() =>
                  setEncryptedContent(msg.encryptedContent || null)
                }
                onFactCheck={
                  !msg.isOwnMessage ? () => checkFacts(msg.content) : undefined
                }
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

        {/* Suggestions and Input Area */}
        <Box px="10%" pt={4} pb={6} flexShrink={0}>
          <Box
            mx="auto"
            width={
              messages.length > 0 || isLoadingChat(currentChatId)
                ? '100%'
                : { base: '100%', md: '80%', lg: '75%' }
            }
          >
            {messages.length === 0 && !isLoadingChat(currentChatId) && (
              <Box mb={4}>
                <ChatSuggestions onSuggestionClick={handleSuggestionClick} />
              </Box>
            )}
            <ChatInput
              placeholder="How can I help you?"
              disabled={isLoadingChat(currentChatId)}
            />
          </Box>
        </Box>
      </Flex>

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