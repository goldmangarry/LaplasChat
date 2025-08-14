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

export function NavChats() {
  const { t } = useTranslation()
  const navigate = useNavigate()
  const params = useParams({ strict: false })
  const { data: chatHistory } = useChatHistory()
  const { activeDialogId, setActiveDialogId } = useChatStore()
  const deleteChat = useDeleteChatHistory()
  
  const [chatToDelete, setChatToDelete] = useState<{ id: string; name: string } | null>(null)
  
  const chats = chatHistory?.dialogs || []
  
  // Получаем текущий dialogId из роута или из store
  const currentDialogId = (params as any)?.dialogId || activeDialogId

  const handleDeleteClick = (chatId: string, chatName: string) => {
    setChatToDelete({ id: chatId, name: chatName })
  }

  const handleDeleteConfirm = async () => {
    if (!chatToDelete) return
    
    const isCurrentChat = chatToDelete.id === currentDialogId
    const chatIdToDelete = chatToDelete.id
    
    // Закрываем модалку сразу
    setChatToDelete(null)
    
    try {
      await deleteChat.mutateAsync(chatIdToDelete)
      
      // Если удаляемый чат - текущий активный чат
      if (isCurrentChat) {
        // Сбрасываем активный чат в store
        setActiveDialogId(null)
        // Перенаправляем на главную страницу
        navigate({ to: "/" })
      }
    } catch (error) {
      console.error("Failed to delete chat:", error)
      // При ошибке можно показать toast или другое уведомление
    }
  }

  const handleDeleteCancel = () => {
    setChatToDelete(null)
  }

  return (
    <SidebarGroup className="group-data-[collapsible=icon]:hidden">
      <SidebarGroupLabel>{t('chat.chats')}</SidebarGroupLabel>
      <SidebarMenu>
        {chats.map((chat) => (
          <ChatItem
            key={chat.id}
            chat={chat}
            onDeleteClick={handleDeleteClick}
          />
        ))}
      </SidebarMenu>

      <DeleteChatModal
        isOpen={!!chatToDelete}
        chatName={chatToDelete?.name || ''}
        onConfirm={handleDeleteConfirm}
        onCancel={handleDeleteCancel}
      />
    </SidebarGroup>
  )
}