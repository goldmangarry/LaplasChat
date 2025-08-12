"use client"

import { useTranslation } from "react-i18next"
import { useNavigate } from "@tanstack/react-router"

import {
  SidebarGroup,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
} from "@/components/ui/sidebar"
import { MessageCircleMore } from "@/components/animate-ui/icons/message-circle-more"
import { AnimateIcon } from "@/components/animate-ui/icons/icon"
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

  return (
    <SidebarGroup>
      <SidebarMenu>
        <SidebarMenuItem>
          <AnimateIcon animateOnHover animateOnTap>
            <SidebarMenuButton 
            onClick={handleNewChat} 
            tooltip={t("chat.newChat")}
            className="w-60 h-10 gap-2 rounded-md py-3 px-2 hover:bg-[#F3F0EE] transition-colors font-sans font-normal text-sm leading-none tracking-normal text-stone-800"
          >
            <MessageCircleMore className="text-stone-500" />
            <span>{t("chat.newChat")}</span>
          </SidebarMenuButton>
          </AnimateIcon>
        </SidebarMenuItem>
      </SidebarMenu>
    </SidebarGroup>
  )
}