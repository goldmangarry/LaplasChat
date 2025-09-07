"use client"

import { useTranslation } from "react-i18next"
import { useNavigate } from "@tanstack/react-router"

import {
  SidebarGroup,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
} from "@/components/ui/sidebar"
import { Badge } from "@/components/ui/badge"
import { MessageCircleMore } from "@/components/animate-ui/icons/message-circle-more"
import { AnimateIcon } from "@/components/animate-ui/icons/icon"
import { Workflow } from "lucide-react"
import { useChatStore } from "@/core/chat/store"

export function NavMain() {
  const { t } = useTranslation()
  const navigate = useNavigate()
  const { setActiveDialogId } = useChatStore()

  const handleNewChat = () => {
    // Убираем активный чат из состояния
    setActiveDialogId(null)
    // Переходим на главную страницу
    navigate({ to: "/" })
  }

  const handleWorkflow = () => {
    // Переходим на страницу workflow
    navigate({ to: "/workflow" })
  }

  return (
    <SidebarGroup>
      <SidebarMenu>
        <SidebarMenuItem>
          <AnimateIcon animateOnHover animateOnTap>
            <SidebarMenuButton 
            onClick={handleNewChat} 
            tooltip={t("chat.newChat")}
            className="w-60 h-10 gap-2 rounded-md py-3 px-2 hover:bg-sidebar-accent transition-colors font-sans font-normal text-sm leading-none tracking-normal"
          >
            <MessageCircleMore className="text-muted-foreground" />
            <span>{t("chat.newChat")}</span>
          </SidebarMenuButton>
          </AnimateIcon>
        </SidebarMenuItem>
        <SidebarMenuItem>
            <SidebarMenuButton 
            onClick={handleWorkflow} 
            tooltip={t("chat.workflow")}
            className="w-60 h-10 gap-2 rounded-md py-3 px-2 hover:bg-sidebar-accent transition-colors font-sans font-normal text-sm leading-none tracking-normal"
          >
            <Workflow className="text-muted-foreground" size={16} />
            <span className="flex items-center gap-2">
              {t("chat.workflow")}
              <Badge variant="secondary" className="text-xs">
                {t("chat.soon")}
              </Badge>
            </span>
          </SidebarMenuButton>
        </SidebarMenuItem>
      </SidebarMenu>
    </SidebarGroup>
  )
}