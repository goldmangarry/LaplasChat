export type ChatModel = 
  // OpenAI Models
  | 'openai/o3'
  | 'openai/o4-mini-high'
  | 'openai/o4-mini'
  | 'openai/gpt-4.1'
  | 'openai/gpt-4.1-mini'
  // xAI Models
  | 'x-ai/grok-4'
  // Anthropic Models
  | 'anthropic/claude-opus-4'
  | 'anthropic/claude-sonnet-4'
  | 'anthropic/claude-3.5-haiku'
  // Google Models
  | 'google/gemini-2.5-flash'
  | 'google/gemini-2.5-pro'

// Новые типы для моделей с бэкенда
export type ChatModelFromBackend = {
  id: string
  name: string
  provider: string
  context_window: number
  max_output: number
}

export type ModelsResponse = {
  models: ChatModelFromBackend[]
}

export type Chat = {
  id: string
  dialogId?: string
  title: string
  lastMessage?: string
  timestamp?: string
  avatar?: string
  isActive?: boolean
  model: ChatModel
  temperature: number
  maxTokens: number
  secureMode: boolean
  provider?: string // Провайдер из API для отображения иконки
}

// Тип для хранения настроек чата в localStorage
export type ChatSettings = {
  dialogId: string
  model: ChatModel
  temperature: number
  maxTokens: number
  secureMode: boolean
}

export type Message = {
  id: string
  chatId: string
  content: string
  timestamp: string
  author: {
    name: string
    avatar?: string
    avatarType?: 'user' | 'ai' | 'custom'
  }
  isOwnMessage?: boolean
  encryptedContent?: string
}

export type NavigationItem = {
  id: string
  label: string
  icon: React.ReactNode
  badge?: string
  isActive?: boolean
}

export type AppMode = 'secure' | 'compare'

export type User = {
  name: string
  email: string
  avatar?: string
}

export type Draft = {
  chatId: string
  content: string
  updatedAt: string
}

export type FactCheckData = {
  response: string
  urls: string[]
}

export type FactCheckState = {
  isOpen: boolean
  isLoading: boolean
  data?: FactCheckData
}

export type ChatDraft = {
  chatId: string
  content: string
  updatedAt: string
}

export type ChatStore = {
  chats: Chat[]
  currentChatId: string | null
  messagesByChat: Record<string, Message[]>
  drafts: Record<string, Draft>
  loadingChats: Set<string>
  models: ChatModelFromBackend[] // Новое поле для моделей с бэкенда
  isLoadingModels: boolean // Состояние загрузки моделей
  isLoadingHistory: boolean // Состояние загрузки истории
  factCheck: FactCheckState
}

interface ChatStoreActions {
  createChat: () => string
  selectChat: (chatId: string) => Promise<void>
  updateDraft: (chatId: string, content: string) => void
  clearDraft: (chatId: string) => void
  addMessage: (chatId: string, message: Message) => void
  sendMessage: (chatId: string, content: string) => Promise<void>
  deleteChat: (chatId: string) => Promise<void>
  updateChatTitle: (chatId: string, title: string) => Promise<void>
  updateChatSettings: (chatId: string, settings: { model?: ChatModel; temperature?: number; maxTokens?: number; secureMode?: boolean }) => void
  setDefaultChatSettings: (settings: { model?: ChatModel; temperature?: number; maxTokens?: number }) => void
  isLoadingChat: (chatId: string) => boolean
  setLoadingChat: (chatId: string, loading: boolean) => void
  openFactCheck: () => void
  closeFactCheck: () => void
  checkFacts: (message: string) => Promise<void>
  fetchModels: () => Promise<void> // Новый метод для загрузки моделей
  fetchChatHistory: () => Promise<void> // Новый метод для загрузки истории чатов
  fetchChatMessages: (chatId: string) => Promise<void> // Новый метод для загрузки сообщений чата
}

export type ChatStoreState = ChatStore & ChatStoreActions