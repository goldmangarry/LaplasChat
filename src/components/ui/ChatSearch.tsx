import { Box, Input, HStack } from '@chakra-ui/react'

type ChatSearchProps = {
  value?: string
  onChange?: (value: string) => void
  placeholder?: string
}

export const ChatSearch = ({ 
  value, 
  onChange, 
  placeholder = "Search for chats..." 
}: ChatSearchProps) => {
  return (
    <Box position="relative">
      <HStack>
        <Box
          position="absolute"
          left={3}
          top="50%"
          transform="translateY(-50%)"
          zIndex={1}
          color="#787f97"
          fontSize="13px"
        >
          🔍
        </Box>
        <Input
          value={value}
          onChange={(e) => onChange?.(e.target.value)}
          placeholder={placeholder}
          pl="36px"
          pr={3}
          py={2.5}
          height="42px"
          bg="#f5f5f5"
          border="1px solid #d8d9e2"
          borderRadius="8px"
          fontSize="12px"
          color="#24262d"
          _placeholder={{
            color: "#606679"
          }}
          _focus={{
            bg: "white",
            borderColor: "#1458c9"
          }}
        />
      </HStack>
    </Box>
  )
}