"use client"

import {
  ChevronsUpDown,
  LogOut,
  KeyRound,
} from "lucide-react"
import { useTranslation } from "react-i18next"

import {
  Avatar,
  AvatarFallback,
  AvatarImage,
} from "@/components/ui/avatar"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuGroup,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import {
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
  useSidebar,
} from "@/components/ui/sidebar"
import { useUserProfile, useLogout } from "@/core/api/auth/hooks"
import { AVATAR_SIZE, DROPDOWN_MENU_WIDTH, DEFAULT_AVATAR_FALLBACK, SIDE_OFFSET } from "./constants"

export function NavUser() {
  const { isMobile } = useSidebar()
  const { t } = useTranslation()
  const { data: user, isLoading } = useUserProfile()
  const logoutMutation = useLogout()

  const handleLogout = () => {
    logoutMutation.mutate()
  }

  if (isLoading || !user) {
    return null
  }

  return (
    <SidebarMenu>
      <SidebarMenuItem>
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <SidebarMenuButton
              size="lg"
              className="data-[state=open]:bg-sidebar-accent data-[state=open]:text-sidebar-accent-foreground"
            >
              <Avatar className={AVATAR_SIZE}>
                <AvatarImage src={user.avatar_url} alt={`${user.first_name} ${user.last_name}`} />
                <AvatarFallback className="rounded-lg">{DEFAULT_AVATAR_FALLBACK}</AvatarFallback>
              </Avatar>
              <div className="grid flex-1 text-left text-sm leading-tight">
                <span className="truncate font-medium">{`${user.first_name} ${user.last_name}`.trim()}</span>
                <span className="truncate text-xs">{user.email}</span>
              </div>
              <ChevronsUpDown className="ml-auto size-4" />
            </SidebarMenuButton>
          </DropdownMenuTrigger>
          <DropdownMenuContent
            className={DROPDOWN_MENU_WIDTH}
            side={isMobile ? "bottom" : "right"}
            align="end"
            sideOffset={SIDE_OFFSET}
          >
            <DropdownMenuLabel className="p-0 font-normal">
              <div className="flex items-center gap-2 px-1 py-1.5 text-left text-sm">
                <Avatar className={AVATAR_SIZE}>
                  <AvatarImage src={user.avatar_url} alt={`${user.first_name} ${user.last_name}`} />
                  <AvatarFallback className="rounded-lg">{DEFAULT_AVATAR_FALLBACK}</AvatarFallback>
                </Avatar>
                <div className="grid flex-1 text-left text-sm leading-tight">
                  <span className="truncate font-medium">{`${user.first_name} ${user.last_name}`.trim()}</span>
                  <span className="truncate text-xs">{user.email}</span>
                </div>
              </div>
            </DropdownMenuLabel>
            <DropdownMenuSeparator />
            <DropdownMenuGroup>
              <DropdownMenuItem>
                <KeyRound />
                {t('user.changePassword')}
              </DropdownMenuItem>
            </DropdownMenuGroup>
            <DropdownMenuSeparator />
            <DropdownMenuItem onClick={handleLogout} disabled={logoutMutation.isPending}>
              <LogOut />
              {logoutMutation.isPending ? t('user.loggingOut') : t('user.logout')}
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      </SidebarMenuItem>
    </SidebarMenu>
  )
}