import { Box, Flex, VStack, Spacer, Heading } from "@chakra-ui/react";
import Logo from "./Logo";
import Navigation from "./Navigation";
import User from "./User";
import ThemeSwitcher from "./ThemeSwitcher";
import { NewChatButton } from "./NewChatButton";
import { ChatSearch } from "./ChatSearch";
import { ChatList } from "./ChatList";

const Sidebar = () => {
  return (
    <Flex
      as="aside"
      width="280px"
      height="100vh"
      bg="#E4E5EA"
      p={4}
      direction="column"
    >
      <Box mb={6}>
        <Logo />
      </Box>

      <Box mb={6}>
        <NewChatButton />
      </Box>
      <Box mb={6}>
        <ChatSearch />
      </Box>
      <Box mb={6}>
        <Navigation />
      </Box>
      <Heading as="h3" size="xs" color="gray.500" textTransform="uppercase" letterSpacing="wider" mb={3}>
        Chats
      </Heading>
      <ChatList />

      <Spacer />

      <VStack gap={4} align="stretch">
        <ThemeSwitcher />
        <User
          name="Mauro Sicard"
          email="contact@maurosicard.com"
          avatarUrl="https://bit.ly/dan-abramov"
        />
      </VStack>
    </Flex>
  );
};

export default Sidebar;