import { HStack, Text, Box } from '@chakra-ui/react'
import type { Chat } from '../../types'

type ChatItemProps = {
  chat: Chat
  isSelected?: boolean
  onClick?: () => void
}

const AIAvatar = ({ size = "28px" }: { size?: string }) => (
  <Box
    width={size}
    height={size}
    borderRadius="50%"
    background="linear-gradient(135deg, #FF6B6B 0%, #FF8E4F 100%)"
    display="flex"
    alignItems="center"
    justifyContent="center"
    color="white"
    fontSize="10px"
    fontWeight="600"
  >
    AI
  </Box>
)

const ClaudeAvatar = ({ size = "28px" }: { size?: string }) => (
  <Box
    width={size}
    height={size}
    borderRadius="50%"
    background="#4CAF50"
    display="flex"
    alignItems="center"
    justifyContent="center"
    color="white"
    fontSize="10px"
    fontWeight="600"
  >
    C
  </Box>
)

const ShareIcon = () => (
  <svg width="16" height="16" viewBox="0 0 16 16" fill="currentColor">
    <path d="M13 8.5a1.5 1.5 0 1 1-3 0 1.5 1.5 0 0 1 3 0ZM7.5 6a1.5 1.5 0 1 1-3 0 1.5 1.5 0 0 1 3 0Zm0 5a1.5 1.5 0 1 1-3 0 1.5 1.5 0 0 1 3 0Z"/>
    <path d="M8.5 6.5L10 8l-1.5 1.5M5.5 9.5L4 8l1.5-1.5"/>
  </svg>
)

const EditIcon = () => (
  <svg width="16" height="16" viewBox="0 0 16 16" fill="currentColor">
    <path d="M15.502 1.94a.5.5 0 0 1 0 .706L14.459 3.69l-2-2L13.502.646a.5.5 0 0 1 .707 0l1.293 1.293zm-1.75 2.456-2-2L4.939 9.21a.5.5 0 0 0-.121.196l-.805 2.414a.25.25 0 0 0 .316.316l2.414-.805a.5.5 0 0 0 .196-.12l6.813-6.814z"/>
    <path fillRule="evenodd" d="M1 13.5A1.5 1.5 0 0 0 2.5 15h11a1.5 1.5 0 0 0 1.5-1.5v-6a.5.5 0 0 0-1 0v6a.5.5 0 0 1-.5.5h-11a.5.5 0 0 1-.5-.5v-11a.5.5 0 0 1 .5-.5H9a.5.5 0 0 0 0-1H2.5A1.5 1.5 0 0 0 1 2.5v11z"/>
  </svg>
)

const DeleteIcon = () => (
  <svg width="16" height="16" viewBox="0 0 16 16" fill="currentColor">
    <path d="M6.5 1h3a.5.5 0 0 1 .5.5v1H6v-1a.5.5 0 0 1 .5-.5ZM11 2.5v-1A1.5 1.5 0 0 0 9.5 0h-3A1.5 1.5 0 0 0 5 1.5v1H2.506a.58.58 0 0 0-.01 0H1.5a.5.5 0 0 0 0 1h.538l.853 10.66A2 2 0 0 0 4.885 16h6.23a2 2 0 0 0 1.994-1.84L14.962 3.5H15.5a.5.5 0 0 0 0-1h-4.494ZM4.885 15a1 1 0 0 1-.997-.92L3.037 3.5h9.926l-.851 10.58a1 1 0 0 1-.997.92h-6.23Z"/>
  </svg>
)

export const ChatItem = ({ chat, isSelected, onClick }: ChatItemProps) => {
  const isCompareModeActive = chat.title === "Create POS syst...";
  
  return (
    <HStack
      gap={2}
      p={2}
      height="43px"
      borderRadius="8px"
      cursor="pointer"
      bg={isSelected ? "#f5f5f5" : "transparent"}
      _hover={{
        bg: isSelected ? "#f5f5f5" : "#f5f5f550"
      }}
      onClick={onClick}
      align="center"
      position="relative"
    >
      {/* Avatar(s) */}
      <Box position="relative" width="28px" height="28px">
        {isCompareModeActive ? (
          <>
            <Box position="absolute" left="0" top="-0.5px">
              <AIAvatar size="20px" />
            </Box>
            <Box position="absolute" right="0" bottom="0.5px">
              <ClaudeAvatar size="20px" />
            </Box>
          </>
        ) : (
          <AIAvatar />
        )}
      </Box>
      
      {/* Chat content */}
      <Text
        fontSize="14px"
        fontWeight="400"
        color={isCompareModeActive ? "#cc227e" : (isSelected ? "#24262d" : "#606679")}
        textOverflow="ellipsis"
        overflow="hidden"
        whiteSpace="nowrap"
        flex={1}
      >
        {chat.title}
      </Text>
      
      {/* Actions/Icons (из макета видны иконки справа) */}
      {isCompareModeActive && (
        <HStack gap={2}>
          <Box cursor="pointer" color="#9399ac" _hover={{ color: "#606679" }}>
            <ShareIcon />
          </Box>
          <Box cursor="pointer" color="#9399ac" _hover={{ color: "#606679" }}>
            <EditIcon />
          </Box>
          <Box cursor="pointer" color="#fe566b" _hover={{ color: "#ff3344" }}>
            <DeleteIcon />
          </Box>
        </HStack>
      )}
    </HStack>
  )
}