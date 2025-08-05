import { createRootRoute, Outlet, redirect } from '@tanstack/react-router'
import { Toaster } from '@/components/ui/toaster'
import { useUserStore } from '@/core/store/user'
import { isCurrentTokenExpired } from '@/core/api/auth/helpers'
import { useEffect } from 'react'

export const Route = createRootRoute({
  beforeLoad: async ({ location }) => {
    // Исключаем страницу логина и OAuth callback из проверки авторизации
    if (location.pathname === '/login' || location.pathname.startsWith('/auth/oauth/callback')) {
      return
    }

    const userStore = useUserStore.getState()
    const isTokenExpired = isCurrentTokenExpired()
    
    // Если пользователь не авторизован или токен истек
    if (!userStore.isAuthenticated || isTokenExpired) {
      // Если есть refresh token, пытаемся обновить токены
      if (userStore.refreshToken) {
        try {
          await userStore.refreshTokens()
          // Если обновление успешно, продолжаем
          return
        } catch {
          // Если обновление не удалось, редиректим на логин
          userStore.logout()
          throw redirect({
            to: '/login',
            search: {
              redirect: location.pathname,
            },
          })
        }
      } else {
        throw redirect({
          to: '/login',
          search: {
            redirect: location.pathname,
          },
        })
      }
    }
  },
  component: RootComponent,
})

function RootComponent() {
  const { isAuthenticated, refreshToken } = useUserStore()
  
  useEffect(() => {
    if (!isAuthenticated || !refreshToken) return
    
    const interval = setInterval(async () => {
      try {
        await useUserStore.getState().refreshTokens()
      } catch {
        useUserStore.getState().logout()
      }
    }, 5 * 60 * 1000) 
    
    return () => clearInterval(interval)
  }, [isAuthenticated, refreshToken])

  return (
    <>
      <Outlet />
      <Toaster />
    </>
  )
}
