import { useTranslation } from "react-i18next";
import {
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
} from "@/components/ui/sidebar"

import laplasLogo from '@/assets/icons/laplas-chat.svg'

export function TeamSwitcher() {
  const { t } = useTranslation();
  
  return (
    <SidebarMenu>
      <SidebarMenuItem>
        <SidebarMenuButton
          size="lg"
          className="data-[state=open]:bg-sidebar-accent data-[state=open]:text-sidebar-accent-foreground"
        >
          <div className={`size-8 text-sidebar-primary-foreground flex aspect-square items-center justify-center rounded-lg`}>
            <img src={laplasLogo} alt={t("common.laplasLogo")} className="w-full size-4 h-full flex-1" />
          </div>
          <div className="grid flex-1 text-left text-sm leading-tight">
            <span className="truncate text-[18px] font-bold leading-none tracking-normal">
              LaplasChat
            </span>
          </div>
        </SidebarMenuButton>
      </SidebarMenuItem>
    </SidebarMenu>
  )
}