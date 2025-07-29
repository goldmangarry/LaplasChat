import { Box, Button, Textarea, VStack } from '@chakra-ui/react';
import { Send } from 'lucide-react';
import { useState, useEffect, type KeyboardEvent } from 'react';
import { useChatStore } from '@/features/chat/store';
import { useAutoResize } from '@/features/chat/hooks';


export type ChatInputProps = {
  placeholder?: string;
  disabled?: boolean;
};

export const ChatInput = ({
  placeholder = "How can I help you?",
  disabled = false,
}: ChatInputProps) => {
  const { currentChatId, drafts, updateDraft, sendMessage, isLoadingChat } = useChatStore();
  const [localValue, setLocalValue] = useState('');

  const draft = currentChatId ? drafts[currentChatId]?.content || '' : '';
  const textareaRef = useAutoResize(localValue, { minHeight: 40, maxHeight: 160 });

  useEffect(() => {
    setLocalValue(draft);
  }, [draft, currentChatId]);

  const handleInputChange = (value: string) => {
    setLocalValue(value);
    if (currentChatId) {
      updateDraft(currentChatId, value);
    }
  };

  const handleSend = async () => {
    if (localValue.trim() && !disabled && !isLoadingChat(currentChatId || '') && currentChatId) {
      await sendMessage(currentChatId, localValue.trim());
      setLocalValue('');
    }
  };

  const handleKeyPress = (e: KeyboardEvent<HTMLTextAreaElement>) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSend();
    }
  };


  const isDisabled = disabled || isLoadingChat(currentChatId || '') || !currentChatId;

  return (
    <Box
      bg="gray.50"
      border="1px solid"
      borderColor="gray.200"
      borderRadius="12px"
      p={4}
      boxShadow="0px 2px 4px 0px rgba(24, 24, 27, 0.1), 0px 0px 1px 0px rgba(24, 24, 27, 0.3)"
    >
      <VStack gap={5} align="stretch">
        <Box position="relative">
          <Textarea
            ref={textareaRef}
            placeholder={placeholder}
            value={localValue}
            onChange={(e) => handleInputChange(e.target.value)}
            onKeyDown={handleKeyPress}
            border="none"
            bg="transparent"
            p={0}
            fontSize="14px"
            color="gray.600"
            resize="none"
            minH="40px"
            overflow="hidden"
            _placeholder={{ color: 'gray.500' }}
            _focus={{
              outline: 'none',
              boxShadow: 'none'
            }}
            disabled={isDisabled}
            aria-label="Message input"
            style={{ transition: 'height 0.2s ease' }}
          />
        </Box>

        <Box
          borderTop="1px solid"
          borderColor="gray.200"
          pt={4}
          display="flex"
          justifyContent="flex-end"
          alignItems="center"
        >
          <Button
            bg="gray.900"
            color="white"
            size="xs"
            borderRadius="4px"
            px={2.5}
            h="32px"
            fontSize="12px"
            fontWeight="500"
            onClick={handleSend}
            disabled={isDisabled || !localValue.trim()}
            _hover={{ bg: 'gray.800' }}
            _disabled={{
              bg: 'gray.400',
              cursor: 'not-allowed'
            }}
          >
            Send message
            <Send size={16} style={{ marginLeft: '4px' }} />
          </Button>
        </Box>
      </VStack>

    </Box>
  );
};
