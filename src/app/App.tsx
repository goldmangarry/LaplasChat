import { Flex } from '@chakra-ui/react'
import { useState } from 'react'
import ChatSidebar from '../widgets/ChatSidebar'
import ChatArea from '../features/chat/components/ChatArea'
import { sendSecureMessage } from '../shared/lib/api'

type Message = {
  id: string
  sender: string
  content: string
  timestamp: string
  avatar?: string
}

// type Chat = {
//   id: string
//   title: string
//   lastMessage?: string
//   icon?: string
//   tags?: string[]
// }

function App() {
  const [selectedChat, setSelectedChat] = useState<string | null>(null)
  const [messages, setMessages] = useState<Message[]>([])
  const [isLoading, setIsLoading] = useState(false)

  const handleSendMessage = async (content: string, isSecure: boolean) => {
    const userMessage: Message = {
      id: Date.now().toString(),
      sender: 'User',
      content,
      timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
      avatar: 'U'
    }
    
    setMessages(prev => [...prev, userMessage])
    setIsLoading(true)

    try {
      // Use isSecure parameter for future secure/normal mode logic
      console.log('Secure mode:', isSecure)
      const response = await sendSecureMessage(content)
      
      const aiMessage: Message = {
        id: (Date.now() + 1).toString(),
        sender: 'LanguageGUI',
        content: response.llm_response,
        timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
        avatar: 'AI'
      }
      
      setMessages(prev => [...prev, aiMessage])
    } catch (error) {
      console.error('Failed to send message:', error)
      const errorMessage: Message = {
        id: (Date.now() + 1).toString(),
        sender: 'System',
        content: 'Failed to send message. Please try again.',
        timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
        avatar: 'S'
      }
      setMessages(prev => [...prev, errorMessage])
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <Flex height="100vh" bg="gray.50">
      <ChatSidebar 
        selectedChat={selectedChat}
        onSelectChat={setSelectedChat}
      />
      <ChatArea 
        messages={messages}
        onSendMessage={handleSendMessage}
        isLoading={isLoading}
      />
    </Flex>
  )
}

export default App