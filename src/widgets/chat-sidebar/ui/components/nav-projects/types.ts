import { type LucideIcon } from "lucide-react"

export type NavProjectsProps = {
  projects: {
    name: string
    url: string
    icon: LucideIcon
  }[]
}