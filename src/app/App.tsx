import { Flex, Drawer, IconButton } from '@chakra-ui/react'
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
  const [isSettingsOpen, setIsSettingsOpen] = useState(false)
  
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
      <ChatArea onOpenSettings={() => setIsSettingsOpen(true)} />

      {/* Settings Drawer */}
      {currentChat && (
        <Drawer.Root
          open={isSettingsOpen}
          onOpenChange={(e) => setIsSettingsOpen(e.open)}
          placement="end"
        >
          <Drawer.Backdrop />
          <Drawer.Positioner>
            <Drawer.Content maxWidth="320px" width="320px">
              <Drawer.Header>
                <Drawer.Title fontSize="lg" fontWeight="semibold">
                  <Flex align="center" gap={2}>
                    <HiCog6Tooth size={20} />
                    Chat Settings
                  </Flex>
                </Drawer.Title>
                <Drawer.CloseTrigger />
              </Drawer.Header>
              <Drawer.Body p={0}>
                <ChatSettings
                  key={currentChat.id}
                  model={currentChat.model}
                  temperature={currentChat.temperature}
                  maxTokens={currentChat.maxTokens}
                  onModelChange={handleModelChange}
                  onTemperatureChange={handleTemperatureChange}
                  onMaxTokensChange={handleMaxTokensChange}
                />
              </Drawer.Body>
            </Drawer.Content>
          </Drawer.Positioner>
        </Drawer.Root>
      )}
      <Toaster />
    </Flex>
  )
}

export default App