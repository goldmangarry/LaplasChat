import { HStack, VStack, Text, Avatar } from '@chakra-ui/react'

type UserInfoProps = {
  name: string
  email: string
  avatarSrc?: string
}

export function UserInfo({ name, email, avatarSrc }: UserInfoProps) {
  return (
    <HStack gap={2} paddingY="8px" alignSelf="stretch">
      <Avatar.Root size="md">
        <Avatar.Image 
          src={avatarSrc} 
          alt={name}
        />
        <Avatar.Fallback bg="gray.400" color="white">
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
  )
}