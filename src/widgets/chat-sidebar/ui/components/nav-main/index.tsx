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
    setActiveDialogId(null)
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
            className="w-60 h-10 gap-2 rounded-md py-3 px-2 bg-[#6c56f0] text-white hover:bg-[#5b46e0] transition-colors font-sans font-medium text-sm leading-none tracking-normal"
          >
            <MessageCircleMore className="text-white" />
            <span>{t("chat.newChat")}</span>
          </SidebarMenuButton>
          </AnimateIcon>
        </SidebarMenuItem>
      </SidebarMenu>
    </SidebarGroup>
  )
}
