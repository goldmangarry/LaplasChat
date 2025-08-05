import { Box, Button, Flex, HStack, Text, VStack } from '@chakra-ui/react';
import { Avatar } from '@chakra-ui/react';
import { Copy } from 'lucide-react';
import OpenAIIcon from '../../../assets/icons/openai.svg';
import { SecureLoadingStatus } from './SecureLoadingStatus';
import { LoadingStatus } from './LoadingStatus';

export type LoadingMessageProps = {
  userName?: string;
  userInitials?: string;
  timestamp?: string;
  isSecureMode?: boolean;
  onCopy?: () => void;
};

export const LoadingMessage = ({
  userName = "Assistant",
  timestamp = "now",
  isSecureMode = false,
  onCopy = () => {},
}: LoadingMessageProps) => {
  return (
    <VStack
      gap={2}
      p={2}
      bg="gray.50"
      borderRadius="12px"
      align="stretch"
      width="full"
    >
      <Flex justify="space-between" align="center" width="full">
        <HStack gap={4.5}>
          <HStack gap={2}>
            <Avatar.Root size="xs" color="white">
              <img
                src={OpenAIIcon}
                alt="OpenAI"
                width="32"
                height="32"
              />
            </Avatar.Root>
            <Text fontSize="14px" fontWeight="600" color="gray.800">
              {userName}
            </Text>
          </HStack>
          <Box width="0" height="23px" borderRight="1px solid" borderColor="gray.200" />
          <Text fontSize="14px" color="gray.600">
            {timestamp}
          </Text>
        </HStack>
        
        <HStack gap={4}>
          <Button
            variant="ghost"
            size="sm"
            p={0}
            minW="16px"
            h="16px"
            onClick={onCopy}
          >
            <Copy size={16} color="#A1A1AA" />
          </Button>
        </HStack>
      </Flex>
      
      <Box fontSize="14px" color="gray.600" lineHeight="1.43">
        {isSecureMode ? (
          <SecureLoadingStatus />
        ) : (
          <LoadingStatus />
        )}
      </Box>
    </VStack>
  );
};