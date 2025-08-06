import { create } from 'zustand'
import { persist } from 'zustand/middleware'
import { v4 as uuidv4 } from 'uuid'
import type { ChatStoreState, Chat, Message, ChatModel, ChatSettings } from '@/core/types'
import { sendSecureMessage, sendMessage, checkFacts, fetchModels } from '@/shared/lib/api'
import { chatApi, type ChatMessage } from '@/core/api'

const createDefaultChat = (customSettings?: { model?: ChatModel; temperature?: number; maxTokens?: number; secureMode?: boolean; title?: string }): Chat => ({
  id: uuidv4(),
  title: customSettings?.title || 'New Chat',
  model: customSettings?.model || 'openai/o4-mini-high',
  temperature: customSettings?.temperature || 0.5,
  maxTokens: customSettings?.maxTokens || 4096,
  secureMode: customSettings?.secureMode ?? false,
})

export const useChatStore = create<ChatStoreState>()(
  persist(
    (set, get) => {
      let defaultChatSettings = {
        model: 'openai/o4-mini-high' as ChatModel,
        temperature: 0.5,
        maxTokens: 4096,
        secureMode: false
      }
      
      return {
        chats: [], // Изначально пустой массив чатов
        currentChatId: null, // Нет текущего чата
        messagesByChat: {},
        drafts: {},
        loadingChats: new Set(),
        models: [], // Новое состояние для моделей с бэкенда
        isLoadingModels: false, // Состояние загрузки моделей
        isLoadingHistory: false, // Состояние загрузки истории
        factCheck: {
          isOpen: false,
          isLoading: false,
        },

        // Функция для загрузки моделей с бэкенда
        fetchModels: async () => {
          set((state: ChatStoreState) => ({
            ...state,
            isLoadingModels: true,
          }))

          try {
            const response = await fetchModels()
            const models = response.models
            
            // Устанавливаем первую модель как дефолтную, если модели загружены и нет текущего чата
            let newDefaultSettings = defaultChatSettings
            if (models.length > 0) {
              const firstModel = models[0]
              newDefaultSettings = {
                model: firstModel.id as ChatModel,
                temperature: defaultChatSettings.temperature,
                maxTokens: firstModel.max_output,
                secureMode: defaultChatSettings.secureMode
              }
              defaultChatSettings = newDefaultSettings
            }
            
            set((state: ChatStoreState) => ({
              ...state,
              models: models,
              isLoadingModels: false,
            }))
          } catch (error) {
            console.error('Failed to fetch models:', error)
            set((state: ChatStoreState) => ({
              ...state,
              isLoadingModels: false,
            }))
          }
        },

        // Функция для загрузки истории чатов с бэкенда
        fetchChatHistory: async () => {
          set((state: ChatStoreState) => ({
            ...state,
            isLoadingHistory: true,
          }))

          try {
            const response = await chatApi.getHistory()
            const dialogs = response.dialogs
            
            // Получаем сохранённые настройки чатов
            const savedChatSettings = (get() as ChatStoreState & { savedChatSettings?: Record<string, ChatSettings> }).savedChatSettings || {}
            
            // Преобразуем диалоги из API в формат чатов
            const chats: Chat[] = dialogs.map(dialog => {
              // Ищем сохранённые настройки для этого чата по dialogId
              const savedSettings = savedChatSettings[dialog.dialog_id]
              
              return {
                id: dialog.dialog_id,
                dialogId: dialog.dialog_id,
                title: dialog.dialog_name,
                provider: dialog.llm_provider, // Сохраняем провайдер для иконки
                // Используем сохранённые настройки или дефолтные
                model: savedSettings?.model || defaultChatSettings.model,
                temperature: savedSettings?.temperature || defaultChatSettings.temperature,
                maxTokens: savedSettings?.maxTokens || defaultChatSettings.maxTokens,
                secureMode: savedSettings?.secureMode ?? false,
              }
            })
            
            set((state: ChatStoreState) => ({
              ...state,
              chats: chats,
              isLoadingHistory: false,
              // Не выбираем автоматически никакой чат при загрузке
              currentChatId: null,
            }))
          } catch (error) {
            console.error('Failed to fetch chat history:', error)
            set((state: ChatStoreState) => ({
              ...state,
              isLoadingHistory: false,
            }))
          }
        },

        // Функция для загрузки сообщений конкретного чата
        fetchChatMessages: async (chatId: string) => {
          const chat = get().chats.find(c => c.id === chatId)
          if (!chat || !chat.dialogId) {
            console.warn('Chat not found or no dialogId:', chatId)
            return
          }

          // Не загружаем сообщения повторно, если они уже есть
          const existingMessages = get().messagesByChat[chatId]
          if (existingMessages && existingMessages.length > 0) {
            return
          }

          try {
            const response = await chatApi.getChatMessages(chat.dialogId)
            const apiMessages = response.messages

            // Преобразуем сообщения из API в формат приложения
            const messages: Message[] = apiMessages.map((apiMsg: ChatMessage) => ({
              id: uuidv4(),
              chatId: chatId,
              content: apiMsg.content,
              timestamp: new Date().toISOString(),
              author: {
                name: apiMsg.role === 'user' ? 'You' : 'Assistant',
                avatar: apiMsg.role === 'assistant' ? '/assistant-avatar.png' : undefined,
              },
              isOwnMessage: apiMsg.role === 'user',
            }))

            // Сохраняем сообщения в store
            set((state: ChatStoreState) => ({
              ...state,
              messagesByChat: {
                ...state.messagesByChat,
                [chatId]: messages,
              },
            }))
          } catch (error) {
            console.error('Failed to fetch chat messages:', error)
          }
        },

        createChat: () => {
          const newChat = createDefaultChat(defaultChatSettings)
          set((state: ChatStoreState) => ({
            ...state,
            chats: [newChat, ...state.chats],
            currentChatId: newChat.id,
          }))
          return newChat.id
        },

        setDefaultChatSettings: (settings: { model?: ChatModel; temperature?: number; maxTokens?: number; secureMode?: boolean }) => {
          defaultChatSettings = { ...defaultChatSettings, ...settings }
        },

        getDefaultSecureMode: () => {
          return defaultChatSettings.secureMode
        },

        selectChat: async (chatId: string) => {
          const { fetchChatMessages } = get()
          
          // Проверяем, существует ли чат с таким ID
          const currentState = get()
          const chatExists = currentState.chats.find(chat => chat.id === chatId)
          
          if (!chatExists) {
            // Если нет чатов вообще, ничего не делаем
            if (currentState.chats.length === 0) {
              set({ currentChatId: null })
              return
            }
            
            // Иначе выбираем первый доступный чат
            const fallbackChatId = currentState.chats[0].id
            set({ currentChatId: fallbackChatId })
            // Загружаем сообщения для fallback чата
            await fetchChatMessages(fallbackChatId)
            return
          }
          
          // Чат существует, можно выбрать
          set({ currentChatId: chatId })
          // Загружаем сообщения для выбранного чата
          await fetchChatMessages(chatId)
        },

        updateDraft: (chatId: string, content: string) => {
          set((state: ChatStoreState) => ({
            ...state,
            drafts: {
              ...state.drafts,
              [chatId]: {
                chatId,
                content,
                updatedAt: new Date().toISOString(),
              },
            },
          }))
        },

        clearDraft: (chatId: string) => {
          set((state: ChatStoreState) => {
            const { [chatId]: _, ...rest } = state.drafts
            void _ // Explicitly ignore the unused variable
            return { ...state, drafts: rest }
          })
        },

        addMessage: (chatId: string, message: Message) => {
          set((state: ChatStoreState) => {
            const chatMessages = state.messagesByChat[chatId] || []
            return {
              ...state,
              messagesByChat: {
                ...state.messagesByChat,
                [chatId]: [...chatMessages, message],
              },
              chats: state.chats.map((chat: Chat) =>
                chat.id === chatId
                  ? {
                      ...chat,
                      lastMessage: message.content,
                      timestamp: message.timestamp,
                      updatedAt: new Date().toISOString(),
                    }
                  : chat
              ),
            }
          })
        },

        sendMessage: async (chatId: string, content: string) => {
          const { addMessage, clearDraft, setLoadingChat, selectChat } = get()
          
          // Функция для создания названия чата из промпта
          const createChatTitle = (userMessage: string) => {
            const newTitle = userMessage.length > 50 
              ? userMessage.substring(0, 50) + '...'
              : userMessage
            return newTitle.replace(/\n/g, ' ').replace(/\s+/g, ' ').trim()
          }
          
          // Если чата не существует, создаем новый
          const currentState = get()
          let chat = currentState.chats.find((c) => c.id === chatId)
          
          // Если чат не найден или нет чатов вообще, создаем новый
          if (!chat || currentState.chats.length === 0) {
            // Создаем чат сразу с правильным названием из промпта
            const chatTitle = createChatTitle(content)
            const newChat = createDefaultChat({ ...defaultChatSettings, title: chatTitle })
            set((state: ChatStoreState) => ({
              ...state,
              chats: [newChat, ...state.chats],
              currentChatId: newChat.id,
            }))
            selectChat(newChat.id)
            chat = newChat
            chatId = newChat.id // Используем новый ID для отправки сообщения
          } else if (chat.title === 'New Chat') {
            // Если это существующий чат с названием "New Chat", обновляем его название
            const chatTitle = createChatTitle(content)
            set((state: ChatStoreState) => ({
              ...state,
              chats: state.chats.map((c: Chat) =>
                c.id === chatId ? { ...c, title: chatTitle } : c
              ),
            }))
            chat = { ...chat, title: chatTitle }
          }
          
          if (!chat) {
            console.error('Failed to create or find chat')
            throw new Error('Failed to create chat')
          }
          
          const userMessage: Message = {
            id: uuidv4(),
            chatId,
            content,
            timestamp: new Date().toISOString(),
            author: {
              name: 'You',
            },
            isOwnMessage: true,
          }

          addMessage(chatId, userMessage)
          clearDraft(chatId)
          setLoadingChat(chatId, true)

          try {
            // For first message: send without dialog_id (undefined)
            // For subsequent messages: send with existing dialog_id
            
            let aiContent: string
            let encryptedResponse: string | undefined
            let dialogId: string | undefined
            
            if (chat.secureMode) {
              const response = await sendSecureMessage(
                content,
                chat.dialogId,
                {
                  model: chat.model,
                  temperature: chat.temperature,
                  maxTokens: chat.maxTokens
                }
              )
              aiContent = response.reply
              encryptedResponse = response.encrypted_response
              dialogId = response.dialogId || response.dialog_id
            } else {
              const response = await sendMessage(
                content,
                chat.dialogId,
                {
                  model: chat.model,
                  temperature: chat.temperature,
                  maxTokens: chat.maxTokens
                }
              )
              aiContent = response.response
              dialogId = response.dialog_id
            }

            const aiMessage: Message = {
              id: uuidv4(),
              chatId,
              content: aiContent,
              timestamp: new Date().toISOString(),
              author: {
                name: 'Assistant',
                avatar: '/assistant-avatar.png',
              },
              isOwnMessage: false,
            }

            addMessage(chatId, aiMessage)

            // Update the user message with encrypted content if available (only in secure mode)
            if (chat.secureMode && encryptedResponse) {
              set((state: ChatStoreState) => ({
                ...state,
                messagesByChat: {
                  ...state.messagesByChat,
                  [chatId]: state.messagesByChat[chatId].map((msg: Message) =>
                    msg.id === userMessage.id
                      ? { ...msg, encryptedContent: encryptedResponse }
                      : msg
                  ),
                },
              }))
            }

            // Save dialog_id from server response (for first message or if updated)
            if (dialogId && !chat.dialogId) {
              set((state: ChatStoreState) => ({
                ...state,
                chats: state.chats.map((c: Chat) =>
                  c.id === chatId ? { ...c, dialogId } : c
                ),
              }))
            }
          } catch (error) {
            console.error('Failed to send message:', error)
            const errorMessage: Message = {
              id: uuidv4(),
              chatId,
              content: 'Failed to send message. Please try again.',
              timestamp: new Date().toISOString(),
              author: {
                name: 'System',
              },
              isOwnMessage: false,
            }
            addMessage(chatId, errorMessage)
          } finally {
            setLoadingChat(chatId, false)
          }
        },

        deleteChat: async (chatId: string) => {
          const chat = get().chats.find(c => c.id === chatId)
          if (!chat) {
            console.error('Chat not found:', chatId)
            return
          }

          // Функция для удаления чата из локального состояния
          const deleteLocalChat = () => {
            set((state: ChatStoreState) => {
              const { [chatId]: _1, ...restMessages } = state.messagesByChat
              const { [chatId]: _2, ...restDrafts } = state.drafts
              void _1 // Explicitly ignore the unused variable
              void _2 // Explicitly ignore the unused variable
              const filteredChats = state.chats.filter((chat: Chat) => chat.id !== chatId)

              // Если больше нет чатов, оставляем пустое состояние
              if (filteredChats.length === 0) {
                return {
                  ...state,
                  chats: [],
                  currentChatId: null,
                  messagesByChat: {},
                  drafts: {},
                }
              }

              // Определяем новый currentChatId
              let newCurrentChatId = state.currentChatId
              
              // Если удаляемый чат был текущим, выбираем первый из оставшихся
              if (state.currentChatId === chatId) {
                newCurrentChatId = filteredChats[0].id
              }

              return {
                ...state,
                chats: filteredChats,
                currentChatId: newCurrentChatId,
                messagesByChat: restMessages,
                drafts: restDrafts,
              }
            })
          }

          // Если у чата нет dialogId (он создан локально, но еще не синхронизирован с бэкендом)
          if (!chat.dialogId) {
            console.log('Deleting local-only chat:', chatId)
            deleteLocalChat()
            return
          }

          try {
            // Отправляем запрос на удаление
            await chatApi.deleteChat(chat.dialogId)
            // Если успешно, удаляем локально
            deleteLocalChat()
          } catch (error) {
            console.error('Failed to delete chat on backend:', error)
            // Если ошибка "чат не найден" или любая другая, все равно удаляем локально
            deleteLocalChat()
          }
        },

        updateChatTitle: async (chatId: string, title: string) => {
          const chat = get().chats.find(c => c.id === chatId)
          if (!chat || !chat.dialogId) {
            console.error('Chat not found or no dialogId:', chatId)
            return
          }

          // Сразу обновляем название в локальном состоянии (оптимистичное обновление)
          const oldTitle = chat.title
          set((state: ChatStoreState) => ({
            ...state,
            chats: state.chats.map((chat: Chat) =>
              chat.id === chatId
                ? { ...chat, title }
                : chat
            ),
          }))

          try {
            // Отправляем запрос на обновление названия в фоне
            await chatApi.updateChat(chat.dialogId, {
              dialog_name: title
            })
          } catch (error) {
            console.error('Failed to update chat title:', error)
            // В случае ошибки откатываем изменения
            set((state: ChatStoreState) => ({
              ...state,
              chats: state.chats.map((chat: Chat) =>
                chat.id === chatId
                  ? { ...chat, title: oldTitle }
                  : chat
              ),
            }))
            throw error
          }
        },

        updateChatSettings: (chatId: string, settings: { model?: ChatModel; temperature?: number; maxTokens?: number; secureMode?: boolean }) => {
          set((state: ChatStoreState) => ({
            ...state,
            chats: state.chats.map((chat: Chat) =>
              chat.id === chatId
                ? { 
                    ...chat, 
                    ...settings,
                    updatedAt: new Date().toISOString() 
                  }
                : chat
            ),
          }))
        },

        isLoadingChat: (chatId: string) => get().loadingChats.has(chatId),

        setLoadingChat: (chatId: string, loading: boolean) => {
          set((state: ChatStoreState) => {
            const newLoadingChats = new Set(state.loadingChats)
            if (loading) {
              newLoadingChats.add(chatId)
            } else {
              newLoadingChats.delete(chatId)
            }
            return {
              ...state,
              loadingChats: newLoadingChats,
            }
          })
        },

        openFactCheck: () => {
          set((state: ChatStoreState) => ({
            ...state,
            factCheck: {
              ...state.factCheck,
              isOpen: true,
            },
          }))
        },

        closeFactCheck: () => {
          set((state: ChatStoreState) => ({
            ...state,
            factCheck: {
              isOpen: false,
              isLoading: false,
              data: undefined,
            },
          }))
        },

        checkFacts: async (message: string) => {
          set((state: ChatStoreState) => ({
            ...state,
            factCheck: {
              ...state.factCheck,
              isOpen: true,
              isLoading: true,
              data: undefined,
            },
          }))

          try {
            const data = await checkFacts(message)
            set((state: ChatStoreState) => ({
              ...state,
              factCheck: {
                ...state.factCheck,
                isLoading: false,
                data,
              },
            }))
          } catch (error) {
            console.error('Failed to check facts:', error)
            set((state: ChatStoreState) => ({
              ...state,
              factCheck: {
                ...state.factCheck,
                isLoading: false,
                data: undefined,
              },
            }))
          }
        },
      }
    },
    {
      name: 'laplas-chat-store',
      partialize: (state) => {
        // Сохраняем только настройки чатов, а не все данные
        const chatSettings: Record<string, ChatSettings> = {}
        
        state.chats.forEach(chat => {
          if (chat.dialogId) {
            chatSettings[chat.dialogId] = {
              dialogId: chat.dialogId,
              model: chat.model,
              temperature: chat.temperature,
              maxTokens: chat.maxTokens,
              secureMode: chat.secureMode,
            }
          }
        })
        
        return {
          chatSettings,
          currentChatId: state.currentChatId,
          drafts: state.drafts,
        }
      },
      onRehydrateStorage: () => (state) => {
        if (state) {
          // Получаем сохранённые данные из localStorage
          const persistedData = localStorage.getItem('laplas-chat-store')
          if (persistedData) {
            try {
              const parsedData = JSON.parse(persistedData)
              const persistedState = parsedData.state
              
              // Инициализируем пустые массивы/объекты
              state.chats = []
              state.messagesByChat = {}
              
              // Восстанавливаем настройки чатов в отдельное поле для последующего использования
              if (persistedState?.chatSettings) {
                // Сохраняем настройки для использования при загрузке истории
                (state as ChatStoreState & { savedChatSettings?: Record<string, ChatSettings> }).savedChatSettings = persistedState.chatSettings
              }
              
              // Восстанавливаем drafts
              if (persistedState?.drafts) {
                state.drafts = persistedState.drafts
              }
              
              // currentChatId не восстанавливаем, так как чаты будут загружены с сервера
              state.currentChatId = null
            } catch (error) {
              console.error('Failed to parse persisted state:', error)
            }
          }
        }
      },
    }
  )
)