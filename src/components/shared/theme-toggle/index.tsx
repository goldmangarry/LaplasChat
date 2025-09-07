"use client"

import { Moon, Sun } from "lucide-react"
import { useTranslation } from "react-i18next"
import { useTheme } from "@/core/theme"
import { DropdownMenuItem } from "@/components/ui/dropdown-menu"

export function ThemeToggle() {
  const { t } = useTranslation()
  const { theme, toggleTheme } = useTheme()

  const handleToggle = () => {
    toggleTheme()
  }

  return (
    <DropdownMenuItem onClick={handleToggle}>
      {theme === 'light' ? <Moon /> : <Sun />}
      {t('user.toggleTheme')}
    </DropdownMenuItem>
  )
}