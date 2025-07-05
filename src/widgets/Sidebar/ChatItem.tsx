import { Box, Flex, Text } from "@chakra-ui/react";
import { MessageCircle, Share2, Edit3, Trash2 } from "lucide-react";
import { useState } from "react";

interface ChatItemProps {
  title: string;
  isActive?: boolean;
  isShared?: boolean;
}

export const ChatItem = ({ title, isActive, isShared }: ChatItemProps) => {
  const [isHovered, setIsHovered] = useState(false);

  return (
    <Box
      as="li"
      width="100%"
      p={2}
      borderRadius="lg"
      bg={isActive ? "#f5f5f5" : "transparent"}
      _hover={{ bg: "#f5f5f5" }}
      cursor="pointer"
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
    >
      <Flex justify="space-between" align="center">
        <Flex align="center" gap={2} overflow="hidden">
          <MessageCircle size={16} color="#9CA3AF" />
          <Text
            fontSize="sm"
            fontWeight="400"
            color={isActive ? "#24262d" : "#606679"}
            whiteSpace="nowrap"
            overflow="hidden"
            textOverflow="ellipsis"
          >
            {title}
          </Text>
        </Flex>
        {(isHovered || isActive) && (
          <Flex gap={2}>
            {isShared && <Share2 size={16} color="#9CA3AF" />}
            <Edit3 size={16} color="#9CA3AF" />
            <Trash2 size={16} color="#EF4444" />
          </Flex>
        )}
      </Flex>
    </Box>
  );
};