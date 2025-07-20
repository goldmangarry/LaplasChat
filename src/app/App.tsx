import { Flex } from '@chakra-ui/react'
import { useEffect } from 'react'
import { useChatStore } from '@/features/chat/store'
import ChatSidebar from '../widgets/ChatSidebar'
import ChatArea from '../features/chat/components/ChatArea'
import { ChatSettings } from '../features/chat/components/ChatSettings'
import { Toaster } from '@/components/ui/toaster'
import type { ChatModel } from '@/core/types'

function App() {
  const { chats, currentChatId, selectChat, updateChatSettings } = useChatStore()
  
  // Get current chat
  const currentChat = chats.find(chat => chat.id === currentChatId)

  useEffect(() => {
    if (chats.length > 0 && !currentChatId) {
      selectChat(chats[0].id)
    }
  }, [chats, currentChatId, selectChat])

  const handleModelChange = (model: ChatModel) => {
    if (currentChatId) {
      updateChatSettings(currentChatId, { model })
    }
  }

  const handleTemperatureChange = (temperature: number) => {
    if (currentChatId) {
      updateChatSettings(currentChatId, { temperature })
    }
  }

  const handleMaxTokensChange = (maxTokens: number) => {
    if (currentChatId) {
      updateChatSettings(currentChatId, { maxTokens })
    }
  }

  return (
    <Flex height="100vh" bg="gray.50">
      <ChatSidebar />
      <ChatArea />
      {currentChat && (
        <ChatSettings
          key={currentChat.id}
          model={currentChat.model}
          temperature={currentChat.temperature}
          maxTokens={currentChat.maxTokens}
          onModelChange={handleModelChange}
          onTemperatureChange={handleTemperatureChange}
          onMaxTokensChange={handleMaxTokensChange}
        />
      )}
      <Toaster />
    </Flex>
  )
}

export default App