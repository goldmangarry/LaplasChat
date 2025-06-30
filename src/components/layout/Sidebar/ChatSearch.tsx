import { Input, Box, Icon } from "@chakra-ui/react";
import { FaSearch } from "react-icons/fa";

export const ChatSearch = () => {
  return (
    <Box position="relative" width="100%">
      <Icon
        as={FaSearch}
        color="gray.400"
        position="absolute"
        left={3}
        top="50%"
        transform="translateY(-50%)"
        pointerEvents="none"
      />
      <Input
        type="text"
        placeholder="Search for chats..."
        bg="#f5f5f5"
        borderColor="#d8d9e2"
        borderRadius="lg"
        pl={10}
        _placeholder={{ color: '#606679' }}
      />
    </Box>
  );
};