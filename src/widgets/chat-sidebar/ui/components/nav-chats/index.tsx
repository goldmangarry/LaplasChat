import {
  MoreHorizontal,
  ShieldCheck,
  Edit,
} from "lucide-react"
import { useTranslation } from "react-i18next"
import { Link, useNavigate, useParams } from "@tanstack/react-router"
import { useState } from "react"

import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import {
  SidebarGroup,
  SidebarGroupLabel,
  SidebarMenu,
  SidebarMenuAction,
  SidebarMenuButton,
  SidebarMenuItem,
  useSidebar,
} from "@/components/ui/sidebar"
import { DeleteChatModal } from "./delete-chat-modal"
import { useChatHistory, useDeleteChatHistory } from "@/core/api/chat/hooks"
import { useChatStore } from "@/core/chat/store"
import { DROPDOWN_MENU_WIDTH } from "./constants"
import { Trash2 } from "@/components/animate-ui/icons/trash-2"
import { AnimateIcon } from "@/components/animate-ui/icons/icon"

export function NavChats() {
  const { isMobile } = useSidebar()
  const { t } = useTranslation()
  const navigate = useNavigate()
  const params = useParams({ strict: false })
  const { data: chatHistory } = useChatHistory()
  const { activeDialogId, setActiveDialogId, applyChatSettingsFromDialog } = useChatStore()
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
          <SidebarMenuItem key={chat.id}>
            <SidebarMenuButton asChild>
              <Link 
                to="/chat/$dialogId" 
                params={{ dialogId: chat.id }}
                onClick={() => {
                  setActiveDialogId(chat.id);
                  applyChatSettingsFromDialog(chat);
                }}
              >
                {chat.has_encrypted_messages && (
                  <ShieldCheck className="text-stone-500" />
                )}
                <span>{chat.name}</span>
              </Link>
            </SidebarMenuButton>
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <SidebarMenuAction showOnHover>
                  <MoreHorizontal />
                  <span className="sr-only">More</span>
                </SidebarMenuAction>
              </DropdownMenuTrigger>
              <DropdownMenuContent
                className={`${DROPDOWN_MENU_WIDTH} rounded-lg`}
                side={isMobile ? "bottom" : "right"}
                align={isMobile ? "end" : "start"}
              >
                <DropdownMenuItem>
                  <Edit className="text-muted-foreground" />
                  <span>{t('chat.renameChat')}</span>
                </DropdownMenuItem>
                <DropdownMenuSeparator />
                <AnimateIcon animateOnHover animateOnTap>
                <DropdownMenuItem onClick={() => handleDeleteClick(chat.id, chat.name)}>
                    <div className="flex items-center gap-2">
                      <Trash2 className="text-destructive" />
                      <span className="text-destructive">{t('chat.deleteChat')}</span>
                    </div>
                </DropdownMenuItem>
                </AnimateIcon>
              </DropdownMenuContent>
            </DropdownMenu>
          </SidebarMenuItem>
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