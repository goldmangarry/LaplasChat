import { VStack } from "@chakra-ui/react";
import { ChatItem } from "./ChatItem";

// Mock data for demonstration
const chats = [
  { id: 1, title: "Create html game environment for website", isActive: true },
  { id: 2, title: "What is UX audit?", isActive: false },
  { id: 3, title: "Create POS system", isActive: false, isShared: true },
  { id: 4, title: "Crypto Lending App Name", isActive: false },
];

export const ChatList = () => {
  return (
    <VStack gap={1} width="100%" as="ul">
      {chats.map((chat) => (
        <ChatItem
          key={chat.id}
          title={chat.title}
          isActive={chat.isActive}
          isShared={chat.isShared}
        />
      ))}
    </VStack>
  );
};