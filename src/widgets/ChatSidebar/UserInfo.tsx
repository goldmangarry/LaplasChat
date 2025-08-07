import { HStack, VStack, Text, Avatar } from '@chakra-ui/react'
import { LogOut, Key } from 'lucide-react'
import {
  Menu,
  Portal
} from '@chakra-ui/react'
import { useNavigate } from '@tanstack/react-router'
import { useUserStore } from '@/core/store/user/store'
import { useState } from 'react'
import { ChangePasswordModal } from './ChangePasswordModal'
import { authApi } from '@/core/api/auth'
import { toaster } from '@/components/ui/toast'

type UserInfoProps = {
  name: string
  email: string
  avatarSrc?: string
}

export function UserInfo({ name, email, avatarSrc }: UserInfoProps) {
  const navigate = useNavigate()
  const logout = useUserStore((state) => state.logout)
  const [isChangePasswordOpen, setIsChangePasswordOpen] = useState(false)

  const handleLogout = async () => {
    try {
      // Очищаем данные пользователя
      logout()
      // Перенаправляем на страницу логина
      await navigate({ to: '/login' })
    } catch (error) {
      console.error('Logout error:', error)
      // В случае ошибки навигации, обновляем страницу
      window.location.href = '/login'
    }
  }

  const handleChangePassword = async (currentPassword: string, newPassword: string) => {
    try {
      await authApi.changePassword({
        current_password: currentPassword,
        new_password: newPassword
      })
      
      toaster.create({
        title: 'Пароль успешно изменен',
        type: 'success',
        duration: 3000,
      })
      
      setIsChangePasswordOpen(false)
    } catch (error: unknown) {
      console.error('Change password error:', error)
      
      toaster.create({
        title: 'Ошибка при смене пароля',
        description: (error as { response?: { data?: { detail?: string } } })?.response?.data?.detail || 'Произошла ошибка. Попробуйте еще раз.',
        type: 'error',
        duration: 5000,
      })
      
      throw error
    }
  }

  return (
    <Menu.Root>
      <Menu.Trigger asChild>
        <HStack 
          gap={2} 
          paddingY="8px" 
          alignSelf="stretch" 
          cursor="pointer"
          _hover={{ bg: 'gray.50' }}
          borderRadius="md"
          px={2}
          transition="background 0.2s"
        >
          <Avatar.Root size="md">
            <Avatar.Image 
              src={avatarSrc} 
              alt={name}
            />
            <Avatar.Fallback color="black">
              {name.charAt(0).toUpperCase()}
            </Avatar.Fallback>
          </Avatar.Root>
          <VStack gap={0} align="flex-start" flex={1}>
            <Text fontSize="16px" lineHeight="24px" fontWeight="500" color="#000000">
              {name}
            </Text>
            <Text fontSize="14px" lineHeight="20px" fontWeight="400" color="#52525b">
              {email}
            </Text>
          </VStack>
        </HStack>
      </Menu.Trigger>

      <Portal>
        <Menu.Positioner>
          <Menu.Content 
            minWidth="200px"
            bg="white"
            borderRadius="md"
            boxShadow="lg"
            py={1}
          >
            <Menu.Item
              value="change-password"
              px={3}
              py={2}
              _hover={{ bg: 'gray.100' }}
              cursor="pointer"
              onClick={(e) => {
                e.preventDefault()
                setIsChangePasswordOpen(true)
              }}
            >
              <HStack 
                gap={2} 
              >
                <Key size={16} />
                <Text>Сменить пароль</Text>
              </HStack>
            </Menu.Item>
            <Menu.Item
              value="logout"
              px={3}
              py={2}
              _hover={{ bg: 'gray.100' }}
              cursor="pointer"
              onClick={async (e) => {
                e.preventDefault()
                await handleLogout()
              }}
            >
              <HStack 
                gap={2} 
              >
                <LogOut size={16} />
                <Text>Выйти</Text>
              </HStack>
            </Menu.Item>
          </Menu.Content>
        </Menu.Positioner>
      </Portal>
      <ChangePasswordModal
        isOpen={isChangePasswordOpen}
        onConfirm={handleChangePassword}
        onCancel={() => setIsChangePasswordOpen(false)}
      />
    </Menu.Root>
  )
}