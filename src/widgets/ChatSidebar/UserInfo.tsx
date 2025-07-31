import { HStack, VStack, Text, Avatar } from '@chakra-ui/react'
import { LogOut } from 'lucide-react'
import {
  Menu,
  Portal
} from '@chakra-ui/react'
import { useRouter } from '@tanstack/react-router'
import { useUserStore } from '@/core/store/user/store'

type UserInfoProps = {
  name: string
  email: string
  avatarSrc?: string
}

export function UserInfo({ name, email, avatarSrc }: UserInfoProps) {
  const router = useRouter()
  const logout = useUserStore((state) => state.logout)

  const handleLogout = () => {
    // Используем logout из userStore для очистки токенов
    logout()
    // Перенаправляем на страницу логина
    router.navigate({ to: '/login' })
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
              value="logout"
              px={3}
              py={2}
              _hover={{ bg: 'gray.100' }}
              cursor="pointer"
            >
              <HStack 
                gap={2} 
                onClick={(e) => {
                  e.preventDefault()
                  handleLogout()
                }}
              >
                <LogOut size={16} />
                <Text>Log out</Text>
              </HStack>
            </Menu.Item>
          </Menu.Content>
        </Menu.Positioner>
      </Portal>
    </Menu.Root>
  )
}