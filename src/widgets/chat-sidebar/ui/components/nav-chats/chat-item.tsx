import {
  MoreHorizontal,
  ShieldCheck,
  Edit,
} from "lucide-react"
import { useTranslation } from "react-i18next"
import { Link } from "@tanstack/react-router"
import { useState, useRef, useEffect } from "react"

import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import {
  SidebarMenuAction,
  SidebarMenuButton,
  SidebarMenuItem,
  useSidebar,
} from "@/components/ui/sidebar"
import { Input } from "@/components/ui/input"
import { useUpdateDialogName } from "@/core/api/chat/hooks"
import { useChatStore } from "@/core/chat/store"
import { DROPDOWN_MENU_WIDTH } from "./constants"
import { Trash2 } from "@/components/animate-ui/icons/trash-2"
import { AnimateIcon } from "@/components/animate-ui/icons/icon"
import type { Dialog } from "@/core/api/chat/types"

type ChatItemProps = {
  chat: Dialog
  onDeleteClick: (chatId: string, chatName: string) => void
}

export function ChatItem({ chat, onDeleteClick }: ChatItemProps) {
  const { isMobile, setOpenMobile } = useSidebar()
  const { t } = useTranslation()
  const { activeDialogId, setActiveDialogId, applyChatSettingsFromDialog } = useChatStore()
  const updateDialogName = useUpdateDialogName()
  const isActive = activeDialogId === chat.id
  
  const [isEditing, setIsEditing] = useState(false)
  const [editingName, setEditingName] = useState(chat.name)
  const inputRef = useRef<HTMLInputElement>(null)

  // Фокус на инпут при входе в режим редактирования
  useEffect(() => {
    if (isEditing && inputRef.current) {
      inputRef.current.focus()
      inputRef.current.select()
    }
  }, [isEditing])

  const handleRenameClick = () => {
    setEditingName(chat.name)
    setIsEditing(true)
  }

  const handleSubmitRename = async () => {
    if (editingName.trim() === "" || editingName === chat.name) {
      setIsEditing(false)
      setEditingName(chat.name)
      return
    }

    try {
      await updateDialogName.mutateAsync({
        dialogId: chat.id,
        updateData: { dialog_name: editingName.trim() }
      })
      setIsEditing(false)
    } catch (error) {
      console.error("Failed to rename chat:", error)
      // Возвращаем исходное имя при ошибке
      setEditingName(chat.name)
      setIsEditing(false)
    }
  }

  const handleCancelRename = () => {
    setIsEditing(false)
    setEditingName(chat.name)
  }

  const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === "Enter") {
      e.preventDefault()
      handleSubmitRename()
    } else if (e.key === "Escape") {
      e.preventDefault()
      handleCancelRename()
    }
  }

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setEditingName(e.target.value)
  }

  const handleInputBlur = () => {
    handleSubmitRename()
  }

  return (
    <SidebarMenuItem>
      <SidebarMenuButton asChild={!isEditing}>
        {isEditing ? (
          <div className="flex w-full items-center gap-2 rounded-md px-2 py-1.5">
            {chat.has_encrypted_messages && (
              <ShieldCheck className="h-4 w-4 text-stone-500 flex-shrink-0" />
            )}
            <Input
              ref={inputRef}
              value={editingName}
              onChange={handleInputChange}
              onKeyDown={handleKeyDown}
              onBlur={handleInputBlur}
              className="h-6 px-1 text-sm border-0 bg-transparent focus-visible:ring-1 focus-visible:ring-ring"
              disabled={updateDialogName.isPending}
            />
          </div>
        ) : (
          <Link 
            to="/chat/$dialogId" 
            params={{ dialogId: chat.id }}
            onClick={() => {
              setActiveDialogId(chat.id);
              applyChatSettingsFromDialog(chat);
              if (isMobile) {
                setOpenMobile(false);
              }
            }}
            className={`
              flex items-center gap-2 w-full px-2 py-1.5 rounded-md transition-colors duration-200
              ${isActive 
                ? 'bg-sidebar-accent' 
                : 'hover:bg-sidebar-accent'
              }
            `}
          >
            {chat.has_encrypted_messages && (
              <ShieldCheck className="h-4 w-4 flex-shrink-0 text-stone-500" />
            )}
            <span className="truncate">{chat.name}</span>
          </Link>
        )}
      </SidebarMenuButton>
      {!isEditing && (
        <DropdownMenu modal={false}>
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
            <DropdownMenuItem onClick={handleRenameClick}>
              <Edit className="text-muted-foreground" />
              <span>{t('chat.renameChat')}</span>
            </DropdownMenuItem>
            <DropdownMenuSeparator />
            <AnimateIcon animateOnHover animateOnTap>
              <DropdownMenuItem onClick={() => onDeleteClick(chat.id, chat.name)}>
                <div className="flex items-center gap-2">
                  <Trash2 className="text-destructive" />
                  <span className="text-destructive">{t('chat.deleteChat')}</span>
                </div>
              </DropdownMenuItem>
            </AnimateIcon>
          </DropdownMenuContent>
        </DropdownMenu>
      )}
    </SidebarMenuItem>
  )
}