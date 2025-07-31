import { Flex, Box, Text } from '@chakra-ui/react'
import { useEffect, useState } from 'react'
import { HiCog6Tooth } from 'react-icons/hi2'
import { useChatStore } from '@/features/chat/store'
import { useUserStore } from '@/core/store/user/store'
import ChatSidebar from '../widgets/ChatSidebar/ChatSidebar'
import ChatArea from '../features/chat/components/ChatArea'
import { ChatSettings } from '../features/chat/components/ChatSettings'

import type { ChatModel } from '@/core/types'

function App() {
  const { chats, currentChatId, updateChatSettings, fetchModels, models, fetchChatHistory } = useChatStore()
  const { fetchUserProfile } = useUserStore()
  const [isSettingsOpen, setIsSettingsOpen] = useState(true)
  
  // Get current chat
  const currentChat = chats.find(chat => chat.id === currentChatId)
  
  // Default settings for when there's no active chat
  const [defaultSettings, setDefaultSettings] = useState({
    model: 'openai/o4-mini-high' as ChatModel,
    temperature: 0.5,
    maxTokens: 4096
  })
  
  // Передаем дефолтные настройки в store при изменении
  const { setDefaultChatSettings } = useChatStore()

  // Загружаем модели, историю чатов и профиль пользователя при инициализации приложения
  useEffect(() => {
    fetchModels()
    fetchChatHistory()
    fetchUserProfile()
  }, [fetchModels, fetchChatHistory, fetchUserProfile])

  // Обновляем дефолтные настройки при загрузке моделей
  useEffect(() => {
    if (models.length > 0) {
      const firstModel = models[0]
      const newDefaultSettings = {
        model: firstModel.id as ChatModel,
        temperature: defaultSettings.temperature,
        maxTokens: firstModel.max_output
      }
      setDefaultSettings(newDefaultSettings)
    }
  }, [models, defaultSettings.temperature])


  useEffect(() => {
    setDefaultChatSettings(defaultSettings)
  }, [defaultSettings, setDefaultChatSettings])

  const handleModelChange = (model: ChatModel) => {
    // Находим выбранную модель в данных с бэкенда
    const selectedModel = models.find(m => m.id === model)
    const newMaxTokens = selectedModel?.max_output || 4096

    if (currentChatId) {
      updateChatSettings(currentChatId, { model, maxTokens: newMaxTokens })
    } else {
      // Сохраняем в дефолтные настройки для будущих чатов
      setDefaultSettings(prev => ({ ...prev, model, maxTokens: newMaxTokens }))
    }
  }

  const handleTemperatureChange = (temperature: number) => {
    if (currentChatId) {
      updateChatSettings(currentChatId, { temperature })
    } else {
      // Сохраняем в дефолтные настройки для будущих чатов
      setDefaultSettings(prev => ({ ...prev, temperature }))
    }
  }

  const handleMaxTokensChange = (maxTokens: number) => {
    if (currentChatId) {
      updateChatSettings(currentChatId, { maxTokens })
    } else {
      // Сохраняем в дефолтные настройки для будущих чатов
      setDefaultSettings(prev => ({ ...prev, maxTokens }))
    }
  }

  return (
    <Flex height="100vh" bg="gray.50">
      <ChatSidebar />
      <Flex flex={1} bg="white" margin="16px" borderRadius="16px" overflow="hidden" direction="column">      

        {/* Main content */}
        <Flex flex={1} overflow="hidden">
          <ChatArea onOpenSettings={() => setIsSettingsOpen(!isSettingsOpen)} />

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
                key={currentChat?.id || 'default'}
                model={currentChat?.model || defaultSettings.model}
                temperature={currentChat?.temperature || defaultSettings.temperature}
                maxTokens={currentChat?.maxTokens || defaultSettings.maxTokens}
                onModelChange={handleModelChange}
                onTemperatureChange={handleTemperatureChange}
                onMaxTokensChange={handleMaxTokensChange}
              />
            </Box>
          </Box>
        </Flex>
      </Flex>
    </Flex>
  )
}

export default App