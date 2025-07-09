import { Flex } from '@chakra-ui/react'
import { useEffect } from 'react'
import { useChatStore } from '@/features/chat/store'
import ChatSidebar from '../widgets/ChatSidebar'
import ChatArea from '../features/chat/components/ChatArea'
import { Toaster } from '@/components/ui/toaster'

function App() {
  const { chats, currentChatId, selectChat } = useChatStore()

  useEffect(() => {
    if (chats.length > 0 && !currentChatId) {
      selectChat(chats[0].id)
    }
  }, [chats, currentChatId, selectChat])

  return (
    <Flex height="100vh" bg="gray.50">
      <ChatSidebar />
      <ChatArea />
      <Toaster />
    </Flex>
  )
}

export default App