import { Button, HStack, Icon } from "@chakra-ui/react";
import { FaPlus } from "react-icons/fa";

export const NewChatButton = () => {
  return (
    <Button
      colorScheme="blue"
      variant="solid"
      width="100%"
      bg="#191919"
      color="#f5f5f5"
      _hover={{ bg: "#2d2d2d" }}
      borderRadius="lg"
      fontSize="14px"
      fontWeight="500"
      py={3}
      px={4}
      boxShadow="0px 2px 5px 0px rgba(20,88,201,0.17)"
    >
      <HStack gap={2}>
        <Icon as={FaPlus} />
        <span>Start new chat</span>
      </HStack>
    </Button>
  );
};