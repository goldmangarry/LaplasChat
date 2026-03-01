import { useTranslation } from "react-i18next"
import { useNavigate, useParams } from "@tanstack/react-router"
import { useState } from "react"

import {
  SidebarGroup,
  SidebarGroupLabel,
  SidebarMenu,
} from "@/components/ui/sidebar"
import { DeleteChatModal } from "./delete-chat-modal"
import { ChatItem } from "./chat-item"
import { useChatHistory, useDeleteChatHistory } from "@/core/api/chat/hooks"
import { useChatStore } from "@/core/chat/store"
import { isChatFromThisWeek } from "./utils"

export function NavChats() {
  const { t } = useTranslation()
  const navigate = useNavigate()
  const params = useParams({ strict: false })
  const { data: chatHistory } = useChatHistory()
  const { activeDialogId, setActiveDialogId } = useChatStore()
  const deleteChat = useDeleteChatHistory()
  
  const [chatToDelete, setChatToDelete] = useState<{ id: string; name: string } | null>(null)
  
  const chats = chatHistory?.dialogs || []
  
  // Group chats by time periods
  const thisWeekChats = chats.filter(chat => isChatFromThisWeek(chat.updated_at))
  const lastWeekChats = chats.filter(chat => !isChatFromThisWeek(chat.updated_at))
  
  // Get the current dialogId from the route or from the store
  const currentDialogId = (params as any)?.dialogId || activeDialogId

  const handleDeleteClick = (chatId: string, chatName: string) => {
    setChatToDelete({ id: chatId, name: chatName })
  }

  const handleDeleteConfirm = async () => {
    if (!chatToDelete) return
    
    const isCurrentChat = chatToDelete.id === currentDialogId
    const chatIdToDelete = chatToDelete.id
    
    // Close the modal immediately
    setChatToDelete(null)
    
    try {
      await deleteChat.mutateAsync(chatIdToDelete)
      
      // If the chat being deleted is the currently active chat
      if (isCurrentChat) {
        // Reset the active chat in the store
        setActiveDialogId(null)
        // Redirect to the main page
        navigate({ to: "/" })
      }
    } catch (error) {
      console.error("Failed to delete chat:", error)
      // On error, could show a toast or other notification
    }
  }

  const handleDeleteCancel = () => {
    setChatToDelete(null)
  }

  return (
    <SidebarGroup className="group-data-[collapsible=icon]:hidden">
      <SidebarGroupLabel>{t('chat.chats')}</SidebarGroupLabel>
      
      {/* This week's chats */}
      {thisWeekChats.length > 0 && (
        <>
          <SidebarGroupLabel className="opacity-70">{t('chat.thisWeek')}</SidebarGroupLabel>
          <SidebarMenu>
            {thisWeekChats.map((chat) => (
              <ChatItem
                key={chat.id}
                chat={chat}
                onDeleteClick={handleDeleteClick}
              />
            ))}
          </SidebarMenu>
        </>
      )}
      
      {/* Previous weeks' chats */}
      {lastWeekChats.length > 0 && (
        <>
          <SidebarGroupLabel className="opacity-70">{t('chat.lastWeek')}</SidebarGroupLabel>
          <SidebarMenu>
            {lastWeekChats.map((chat) => (
              <ChatItem
                key={chat.id}
                chat={chat}
                onDeleteClick={handleDeleteClick}
              />
            ))}
          </SidebarMenu>
        </>
      )}

      
      <DeleteChatModal
        isOpen={!!chatToDelete}
        chatName={chatToDelete?.name || ''}
        onConfirm={handleDeleteConfirm}
        onCancel={handleDeleteCancel}
      />
    </SidebarGroup>
  )
}