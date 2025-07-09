import { Box, Button, Flex, HStack, Text, VStack } from '@chakra-ui/react';
import { Avatar } from '@chakra-ui/react';
import { Edit, Copy, Check, Lock } from 'lucide-react';
import OpenAIIcon from '../../../assets/icons/openai.svg';
import { parseMarkdown } from '../../../shared/lib/markdown.tsx';

export type ChatMessageProps = {
  userName: string;
  userInitials: string;
  message: string;
  timestamp: string;
  isAI?: boolean;
  onEdit?: () => void;
  onCopy?: () => void;
  onCheck?: () => void;
  encryptedContent?: string;
  onShowEncrypted?: () => void;
};

export const ChatMessage = ({
  userName,
  userInitials,
  message,
  timestamp,
  isAI = false,
  onEdit,
  onCopy,
  onCheck,
  encryptedContent,
  onShowEncrypted,
}: ChatMessageProps) => {

  return (
    <VStack
      gap={2}
      p={2}
      bg={isAI ? "gray.50" : "transparent"}
      borderRadius="12px"
      align="stretch"
      width="full"
    >
      <Flex justify="space-between" align="center" width="full">
        <HStack gap={4.5}>
          <HStack gap={2}>
            <Avatar.Root size="xs" bg="gray.900" color="white">
              {isAI ? (
                <img
                  src={OpenAIIcon}
                  alt="OpenAI"
                  width="32"
                  height="32"
                />
              ) : (
                <>
                  <Avatar.Image src="/assets/user-avatar.png" alt={userName} />
                  <Avatar.Fallback fontSize="12px" fontWeight="500">
                    {userInitials}
                  </Avatar.Fallback>
                </>
              )}
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
          {!isAI && (
            <Button
              variant="ghost"
              size="sm"
              p={0}
              minW="16px"
              h="16px"
              onClick={onEdit}
            >
              <Edit size={16} color="#A1A1AA" />
            </Button>
          )}
          {isAI && (
            <Button
              variant="ghost"
              size="sm"
              p={0}
              minW="16px"
              h="16px"
              onClick={onCheck}
            >
              <Check size={16} color="#A1A1AA" />
            </Button>
          )}
          {!isAI && encryptedContent && (
            <Button
              variant="ghost"
              size="sm"
              p={0}
              minW="16px"
              h="16px"
              onClick={onShowEncrypted}
            >
              <Lock size={16} color="#A1A1AA" />
            </Button>
          )}
        </HStack>
      </Flex>
      
      <Box fontSize="14px" color="gray.600" lineHeight="1.43">
        {parseMarkdown(message)}
      </Box>
    </VStack>
  );
};