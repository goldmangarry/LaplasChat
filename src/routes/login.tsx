import { createFileRoute } from '@tanstack/react-router'
import { LoginPage } from '@/widgets/Auth/ui/auth'

export const Route = createFileRoute('/login')({
  component: LoginPage,
})
