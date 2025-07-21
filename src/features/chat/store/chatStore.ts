import { create } from 'zustand'
import { persist } from 'zustand/middleware'
import { v4 as uuidv4 } from 'uuid'
import type { ChatStoreState, Chat, Message, ChatModel } from '@/core/types'
import { sendSecureMessage, checkFacts } from '@/shared/lib/api'

const createDefaultChat = (): Chat => ({
  id: uuidv4(),
  title: 'New Chat',
  model: 'openai/o4-mini-high',
  temperature: 0.5,
  maxTokens: 4096,
  createdAt: new Date().toISOString(),
  updatedAt: new Date().toISOString(),
})

export const useChatStore = create<ChatStoreState>()(
  persist(
    (set, get) => ({
      chats: [createDefaultChat()],
      currentChatId: null,
      messagesByChat: {},
      drafts: {},
      loadingChats: new Set(),
      factCheck: {
        isOpen: false,
        isLoading: false,
      },

      createChat: () => {
        const newChat = createDefaultChat()
        set((state: ChatStoreState) => ({
          ...state,
          chats: [...state.chats, newChat],
          currentChatId: newChat.id,
        }))
        return newChat.id
      },

      selectChat: (chatId: string) => {
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
        const { addMessage, clearDraft, setLoadingChat } = get()
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
          const chat = get().chats.find((c) => c.id === chatId)
          
          // For first message: send without dialog_id (undefined)
          // For subsequent messages: send with existing dialog_id
          const isFirstMessage = !chat?.dialogId
          console.log('Sending message:', { chatId, isFirstMessage, existingDialogId: chat?.dialogId })
          
          const response = await sendSecureMessage(
            content,
            chat?.dialogId, // Send undefined for first message, existing dialog_id for subsequent
            {
              model: chat?.model,
              temperature: chat?.temperature,
              maxTokens: chat?.maxTokens
            }
          )

          const aiMessage: Message = {
            id: uuidv4(),
            chatId,
            content: response.reply,
            timestamp: new Date().toISOString(),
            author: {
              name: 'Assistant',
              avatar: '/assistant-avatar.png',
            },
            isOwnMessage: false,
          }

          addMessage(chatId, aiMessage)

          // Update the user message with encrypted content if available
          if (response.encrypted_response) {
            set((state: ChatStoreState) => ({
              ...state,
              messagesByChat: {
                ...state.messagesByChat,
                [chatId]: state.messagesByChat[chatId].map((msg: Message) =>
                  msg.id === userMessage.id
                    ? { ...msg, encryptedContent: response.encrypted_response }
                    : msg
                ),
              },
            }))
          }

          // Save dialog_id from server response (for first message or if updated)
          const dialogId = response.dialogId || response.dialog_id
          if (dialogId && !chat?.dialogId) {
            console.log('Saving dialog_id from server:', dialogId)
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
          
          if (filteredChats.length === 0) {
            const newChat = createDefaultChat()
            return {
              chats: [newChat],
              currentChatId: newChat.id,
              messagesByChat: restMessages,
              drafts: restDrafts,
            }
          }

          const newCurrentChatId = state.currentChatId === chatId
            ? filteredChats[0].id
            : state.currentChatId

          return {
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

      updateChatSettings: (chatId: string, settings: { model?: ChatModel; temperature?: number; maxTokens?: number }) => {
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
    }),
    {
      name: 'laplas-chat-store',
      partialize: (state) => ({
        chats: state.chats,
        currentChatId: state.currentChatId,
        messagesByChat: state.messagesByChat,
        drafts: state.drafts,
      }),
    }
  )
)