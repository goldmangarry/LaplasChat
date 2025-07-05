export type Chat = {
  id: string
  title: string
  lastMessage?: string
  timestamp?: string
  avatar?: string
  isActive?: boolean
}

export type Message = {
  id: string
  chatId: string
  content: string
  timestamp: string
  author: {
    name: string
    avatar?: string
  }
  isOwnMessage?: boolean
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