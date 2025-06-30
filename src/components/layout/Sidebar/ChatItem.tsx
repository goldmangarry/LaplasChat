import { Box, Flex, Icon, Text } from "@chakra-ui/react";
import { FaComment, FaShare, FaEdit, FaTrash } from "react-icons/fa";
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
          <Icon as={FaComment} color="gray.500" />
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
            {isShared && <Icon as={FaShare} color="gray.500" />}
            <Icon as={FaEdit} color="gray.500" />
            <Icon as={FaTrash} color="red.500" />
          </Flex>
        )}
      </Flex>
    </Box>
  );
};