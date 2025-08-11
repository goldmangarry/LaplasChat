import {
  MoreHorizontal,
  Trash2,
  ShieldCheck,
  Edit,
} from "lucide-react"
import { useTranslation } from "react-i18next"

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
import { useChatHistory } from "@/core/api/chat/hooks"
import { DROPDOWN_MENU_WIDTH } from "./constants"

export function NavChats() {
  const { isMobile } = useSidebar()
  const { t } = useTranslation()
  const { data: chatHistory } = useChatHistory()
  
  const chats = chatHistory?.dialogs || []

  return (
    <SidebarGroup className="group-data-[collapsible=icon]:hidden">
      <SidebarGroupLabel>{t('chat.chats')}</SidebarGroupLabel>
      <SidebarMenu>
        {chats.map((chat) => (
          <SidebarMenuItem key={chat.id}>
            <SidebarMenuButton asChild>
              <a href={`/chat/${chat.id}`}>
                {chat.has_encrypted_messages && (
                  <ShieldCheck className="text-stone-500" />
                )}
                <span>{chat.name}</span>
              </a>
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
                <DropdownMenuItem>
                  <Trash2 className="text-destructive" />
                  <span className="text-destructive">{t('chat.deleteChat')}</span>
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          </SidebarMenuItem>
        ))}
      </SidebarMenu>
    </SidebarGroup>
  )
}