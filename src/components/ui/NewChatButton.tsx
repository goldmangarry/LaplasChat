import { Button, HStack, Text, Box } from '@chakra-ui/react'

type NewChatButtonProps = {
  onClick?: () => void
}

export const NewChatButton = ({ onClick }: NewChatButtonProps) => {
  return (
    <Button
      onClick={onClick}
      bg="#191919"
      color="#f5f5f5"
      borderRadius="8px"
      py={3}
      px={4}
      width="full"
      border="1px solid #040404"
      boxShadow="0px 2px 5px 0px rgba(20, 88, 201, 0.17), inset 0px -2px 0.3px 0px rgba(14, 56, 125, 0.18), inset 0px 2px 1px 0px rgba(255, 255, 255, 0.22)"
      _hover={{
        bg: "#222"
      }}
      _active={{
        bg: "#111"
      }}
    >
      <HStack gap={2}>
        <Box fontSize="15px" fontWeight="500">
          +
        </Box>
        <Text fontSize="14px" fontWeight="500">
          Start new chat
        </Text>
      </HStack>
    </Button>
  )
}