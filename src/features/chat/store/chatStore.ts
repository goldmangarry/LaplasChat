import { create } from 'zustand'
import { persist } from 'zustand/middleware'
import { v4 as uuidv4 } from 'uuid'
import type { ChatStoreState, Chat, Message, ChatModel } from '@/core/types'
import { sendSecureMessage, sendMessage, checkFacts } from '@/shared/lib/api'

const createDefaultChat = (customSettings?: { model?: ChatModel; temperature?: number; maxTokens?: number }): Chat => ({
  id: uuidv4(),
  title: 'New Chat',
  model: customSettings?.model || 'openai/o4-mini-high',
  temperature: customSettings?.temperature || 0.5,
  maxTokens: customSettings?.maxTokens || 4096,
  secureMode: false,
  createdAt: new Date().toISOString(),
  updatedAt: new Date().toISOString(),
})

export const useChatStore = create<ChatStoreState>()(
  persist(
    (set, get) => {
      let defaultChatSettings = {
        model: 'openai/o4-mini-high' as ChatModel,
        temperature: 0.5,
        maxTokens: 4096
      }
      
      return {
        chats: [], // Изначально пустой массив чатов
        currentChatId: null, // Нет текущего чата
        messagesByChat: {},
        drafts: {},
        loadingChats: new Set(),
        factCheck: {
          isOpen: false,
          isLoading: false,
        },

        createChat: () => {
          const newChat = createDefaultChat(defaultChatSettings)
          set((state: ChatStoreState) => ({
            ...state,
            chats: [...state.chats, newChat],
            currentChatId: newChat.id,
          }))
          return newChat.id
        },

        setDefaultChatSettings: (settings: { model?: ChatModel; temperature?: number; maxTokens?: number }) => {
          defaultChatSettings = { ...defaultChatSettings, ...settings }
        },

        selectChat: (chatId: string) => {
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
            return
          }
          
          // Чат существует, можно выбрать
          set({ currentChatId: chatId })
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
          const { addMessage, clearDraft, setLoadingChat, createChat, selectChat } = get()
          
          // Если чата не существует, создаем новый
          const currentState = get()
          let chat = currentState.chats.find((c) => c.id === chatId)
          
          // Если чат не найден или нет чатов вообще, создаем новый
          if (!chat || currentState.chats.length === 0) {
            const newChatId = createChat()
            selectChat(newChatId)
            // Получаем обновленное состояние после создания чата
            const updatedState = get()
            chat = updatedState.chats.find((c) => c.id === newChatId)
            chatId = newChatId // Используем новый ID для отправки сообщения
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

            // Auto-generate chat title from first AI response
            const currentChat = get().chats.find((c) => c.id === chatId)
            const messagesCount = get().messagesByChat[chatId]?.length || 0
            if (currentChat && currentChat.title === 'New Chat' && messagesCount <= 2) {
              // Generate title from first 50 characters of AI response
              const newTitle = aiContent.length > 50 
                ? aiContent.substring(0, 50) + '...'
                : aiContent
              // Clean up the title (remove newlines, extra spaces)
              const cleanTitle = newTitle.replace(/\n/g, ' ').replace(/\s+/g, ' ').trim()
              get().updateChatTitle(chatId, cleanTitle)
            }

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

        deleteChat: (chatId: string) => {
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
        },

        updateChatTitle: (chatId: string, title: string) => {
          set((state: ChatStoreState) => ({
            ...state,
            chats: state.chats.map((chat: Chat) =>
              chat.id === chatId
                ? { ...chat, title, updatedAt: new Date().toISOString() }
                : chat
            ),
          }))
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
      partialize: (state) => ({
        chats: state.chats,
        currentChatId: state.currentChatId,
        messagesByChat: state.messagesByChat,
        drafts: state.drafts,
      }),
      onRehydrateStorage: () => (state) => {
        // Проверяем корректность восстановленного состояния
        if (state) {
          // Если нет чатов, оставляем пустое состояние - не создаем дефолтный чат
          if (!state.chats || state.chats.length === 0) {
            state.chats = []
            state.currentChatId = null
            state.messagesByChat = {}
            state.drafts = {}
            return
          }
          
          // Если currentChatId ссылается на несуществующий чат, исправляем это
          if (state.currentChatId && !state.chats.find(chat => chat.id === state.currentChatId)) {
            const newCurrentChatId = state.chats[0].id
            state.currentChatId = newCurrentChatId
          }
          
          // Если currentChatId null или undefined, устанавливаем на первый чат
          if (!state.currentChatId && state.chats.length > 0) {
            state.currentChatId = state.chats[0].id
          }
        }
      },
    }
  )
)