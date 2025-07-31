import { Box, Flex, Stack } from '@chakra-ui/react'
import { useState, useEffect, useLayoutEffect, useRef, useMemo, useCallback } from 'react'
import { useChatStore } from '@/features/chat/store'
import { useUserStore } from '@/core/store/user/store'
import type { Message, ChatModel } from '@/core/types'
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
    setDefaultChatSettings,
    getDefaultSecureMode,
    models,
    isLoadingModels,
  } = useChatStore()
  const { user } = useUserStore()
  const [encryptedContent, setEncryptedContent] = useState<string | null>(null)
  const [defaultSecureMode, setDefaultSecureMode] = useState(false)
  const [defaultModel, setDefaultModel] = useState<ChatModel>('openai/o4-mini-high')
  const messagesEndRef = useRef<HTMLDivElement>(null)
  const prevMessagesCountRef = useRef(0)
  
  const currentChat = chats.find(chat => chat.id === currentChatId)
  
  // Синхронизируем локальное состояние с дефолтным значением из store
  useEffect(() => {
    setDefaultSecureMode(getDefaultSecureMode())
  }, [getDefaultSecureMode])
  
  const handleSecureModeChange = useCallback((enabled: boolean) => {
    if (currentChatId && currentChat) {
      updateChatSettings(currentChatId, { secureMode: enabled })
    } else {
      // Если нет активного чата, сохраняем как настройку по умолчанию для новых чатов
      setDefaultChatSettings({ secureMode: enabled })
      setDefaultSecureMode(enabled)
    }
  }, [currentChatId, currentChat, updateChatSettings, setDefaultChatSettings])

  const handleModelChange = useCallback((model: ChatModel) => {
    if (currentChatId && currentChat) {
      updateChatSettings(currentChatId, { model })
    } else {
      // Если нет активного чата, сохраняем как настройку по умолчанию для новых чатов
      setDefaultChatSettings({ model })
      setDefaultModel(model)
    }
  }, [currentChatId, currentChat, updateChatSettings, setDefaultChatSettings])

  const messages = useMemo(() => {
    return currentChatId ? messagesByChat[currentChatId] || [] : []
  }, [currentChatId, messagesByChat])

  // Используем useLayoutEffect для немедленного скролла без анимации при загрузке сообщений
  useLayoutEffect(() => {
    if (messages.length > 0) {
      messagesEndRef.current?.scrollIntoView({ behavior: 'instant' })
    }
  }, [currentChatId, messages.length])

  // Плавный скролл при добавлении новых сообщений (не при смене чата)
  useEffect(() => {
    if (messages.length > prevMessagesCountRef.current && prevMessagesCountRef.current > 0) {
      messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' })
    }
    
    prevMessagesCountRef.current = messages.length
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

  // Если нет выбранного чата (независимо от того, есть ли чаты), показываем экран с предложениями
  if (!currentChatId || !currentChat) {
    return (
      <Flex flex={1} direction="column" bg="white">
        {/* Header для состояния без выбранного чата */}
        <ChatHeader
          secureMode={defaultSecureMode}
          onSecureModeChange={handleSecureModeChange}
          onOpenSettings={onOpenSettings}
          model={defaultModel}
          models={models}
          isLoadingModels={isLoadingModels}
          onModelChange={handleModelChange}
        />

        {/* Центрированный контент с предложениями и инпутом */}
        <Flex
          flex={1}
          direction="column"
          justifyContent="center"
          overflowY="auto"
        >
          <Box px="5%" pb={6} flexShrink={0}>
            <Box
              mx="auto"
              width={{ base: '100%', '2xl': '75%' }}
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

  return (
    <Flex flex={1} direction="column" bg="white">
      {/* Header */}
      <ChatHeader
        secureMode={currentChat?.secureMode ?? true}
        onSecureModeChange={handleSecureModeChange}
        onOpenSettings={onOpenSettings}
        model={currentChat?.model}
        models={models}
        isLoadingModels={isLoadingModels}
        onModelChange={handleModelChange}
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
          px="5%"
          py={6}
        >
          <Stack direction="column" gap={6} align="stretch">
            {messages.map((msg: Message) => (
              <ChatMessage
                key={msg.id}
                userName={msg.isOwnMessage ? 'You' : msg.author.name}
                userInitials={
                  msg.isOwnMessage && user 
                    ? user.first_name.charAt(0).toUpperCase()
                    : (msg.author.avatar || msg.author.name.slice(0, 2).toUpperCase())
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
        <Box px="5%" pt={4} pb={6} flexShrink={0}>
          <Box
            mx="auto"
            width={
              messages.length > 0 || isLoadingChat(currentChatId)
                ? '100%'
                : { base: '100%'}
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