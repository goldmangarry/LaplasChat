import { VStack, HStack, Text, Badge, Box } from '@chakra-ui/react'
import type { NavigationItem } from '../../types'

type NavigationProps = {
  items?: NavigationItem[]
  activeId?: string
  onItemClick?: (id: string) => void
}

const MessageIcon = () => (
  <svg width="24" height="24" viewBox="0 0 24 24" fill="currentColor">
    <path d="M12 2C6.48 2 2 6.48 2 12c0 1.54.36 3 .97 4.29L1 23l6.71-1.97C9 21.64 10.46 22 12 22c5.52 0 10-4.48 10-10S17.52 2 12 2z"/>
  </svg>
)

const ImageIcon = () => (
  <svg width="24" height="24" viewBox="0 0 24 24" fill="currentColor">
    <path d="M19 3H5c-1.1 0-2 .9-2 2v14c0 1.1.9 2 2 2h14c1.1 0 2-.9 2-2V5c0-1.1-.9-2-2-2zM9 17l2.5-3.21L14.5 17H9zm0-5c1.1 0 2-.9 2-2s-.9-2-2-2-2 .9-2 2 .9 2 2 2z"/>
  </svg>
)

const VideoIcon = () => (
  <svg width="24" height="24" viewBox="0 0 24 24" fill="currentColor">
    <path d="M17 10.5V7c0-.55-.45-1-1-1H4c-.55 0-1 .45-1 1v10c0 .55.45 1 1 1h12c.55 0 1-.45 1-1v-3.5l4 4v-11l-4 4z"/>
  </svg>
)

const defaultItems: NavigationItem[] = [
  { id: 'chat', label: 'Chat', icon: <MessageIcon />, isActive: true },
  { id: 'image', label: 'Image', icon: <ImageIcon />, badge: 'soon' },
  { id: 'video', label: 'Video', icon: <VideoIcon />, badge: 'soon' }
]

export const Navigation = ({ 
  items = defaultItems, 
  activeId,
  onItemClick 
}: NavigationProps) => {
  return (
    <VStack gap={0.5} align="stretch">
      {items.map((item) => {
        const isActive = activeId ? item.id === activeId : item.isActive
        
        return (
          <HStack
            key={item.id}
            gap={2}
            p={2}
            height="43px"
            borderRadius="8px"
            cursor={item.badge ? "not-allowed" : "pointer"}
            bg={isActive ? "#f5f5f5" : "transparent"}
            color={isActive ? "#24262d" : "#606679"}
            _hover={!item.badge ? {
              bg: isActive ? "#f5f5f5" : "#f5f5f550"
            } : {}}
            onClick={() => !item.badge && onItemClick?.(item.id)}
            opacity={item.badge ? 0.4 : 1}
            position="relative"
          >
            <Box width="24px" height="24px" display="flex" alignItems="center" justifyContent="center">
              {item.icon}
            </Box>
            
            <Text fontSize="14px" fontWeight="400" flex={1}>
              {item.label}
            </Text>
            
            {item.badge && (
              <Box position="absolute" right="-20px" top="50%" transform="translateY(-50%)">
                <Badge
                  bg="#ff55b1"
                  color="#f5f5f5"
                  fontSize="10px"
                  px={2}
                  py={0.5}
                  pt={1}
                  pb={1.5}
                  borderRadius="16px"
                  fontWeight="600"
                >
                  {item.badge}
                </Badge>
              </Box>
            )}
          </HStack>
        )
      })}
    </VStack>
  )
}