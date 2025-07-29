import { Flex, Box, Text } from '@chakra-ui/react'
import { useEffect, useState } from 'react'
import { HiCog6Tooth } from 'react-icons/hi2'
import { useChatStore } from '@/features/chat/store'
import ChatSidebar from '../widgets/ChatSidebar'
import ChatArea from '../features/chat/components/ChatArea'
import { ChatSettings } from '../features/chat/components/ChatSettings'
import { Toaster } from '@/components/ui/toaster'
import type { ChatModel } from '@/core/types'

function App() {
  const { chats, currentChatId, selectChat, updateChatSettings } = useChatStore()
  const [isSettingsOpen, setIsSettingsOpen] = useState(true)
  
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
      <Flex flex={1} bg="white" margin="16px" borderRadius="16px" overflow="hidden">
        <ChatArea onOpenSettings={() => setIsSettingsOpen(!isSettingsOpen)} />

        {currentChat && (
          <Box
            width={isSettingsOpen ? '320px' : '0'}
            flexShrink={0}
            overflow="hidden"
            transition="width 0.3s ease-in-out"
            borderLeftWidth={isSettingsOpen ? '1px' : '0'}
            borderLeftStyle="solid"
            borderColor="gray.200"
          >
            <Box width="320px" p={4} height="100%">
              <Flex align="center" gap={2} mb={4}>
                <HiCog6Tooth size={20} />
                <Text fontSize="lg" fontWeight="semibold">
                  Chat Settings
                </Text>
              </Flex>
              <ChatSettings
                key={currentChat.id}
                model={currentChat.model}
                temperature={currentChat.temperature}
                maxTokens={currentChat.maxTokens}
                onModelChange={handleModelChange}
                onTemperatureChange={handleTemperatureChange}
                onMaxTokensChange={handleMaxTokensChange}
              />
            </Box>
          </Box>
        )}
      </Flex>
      <Toaster />
    </Flex>
  )
}

export default App