import { Avatar, Flex, IconButton, Spacer, Text, VStack } from '@chakra-ui/react';
import { Settings } from 'lucide-react';

interface UserProps {
  avatarUrl: string;
  name: string;
  email: string;
}

const User: React.FC<UserProps> = ({ avatarUrl, name, email }) => {
  return (
    <Flex alignItems="center" width="100%" gap={2}>
      <Avatar.Root>
        <Avatar.Image src={avatarUrl} alt={name} boxSize="40px" borderRadius="full" />
        <Avatar.Fallback>{name.charAt(0)}</Avatar.Fallback>
      </Avatar.Root>
      <VStack alignItems="flex-start" gap={0.5} overflow="hidden">
        <Text fontWeight="medium" fontSize="12px" color="#24262d" whiteSpace="nowrap" overflow="hidden" textOverflow="ellipsis">
          {name}
        </Text>
        <Text fontWeight="medium" fontSize="12px" color="#606679" whiteSpace="nowrap" overflow="hidden" textOverflow="ellipsis">
          {email}
        </Text>
      </VStack>
      <Spacer />
      <IconButton
        aria-label="Settings"
        variant="ghost"
        size="sm"
      >
        <Settings size={16} />
      </IconButton>
    </Flex>
  );
};

export default User;