import { Box, Button, Input, VStack } from '@chakra-ui/react';
import { Send } from 'lucide-react';
import { useState, type KeyboardEvent } from 'react';

export type ChatInputProps = {
  placeholder?: string;
  onSendMessage: (message: string) => void;
  disabled?: boolean;
};

export const ChatInput = ({
  placeholder = "How can I help you?",
  onSendMessage,
  disabled = false,
}: ChatInputProps) => {
  const [message, setMessage] = useState('');

  const handleSend = () => {
    if (message.trim() && !disabled) {
      onSendMessage(message.trim());
      setMessage('');
    }
  };

  const handleKeyPress = (e: KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSend();
    }
  };

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
        <Input
          placeholder={placeholder}
          value={message}
          onChange={(e) => setMessage(e.target.value)}
          onKeyPress={handleKeyPress}
          border="none"
          bg="transparent"
          p={0}
          fontSize="14px"
          color="gray.600"
          _placeholder={{ color: 'gray.500' }}
          _focus={{ 
            outline: 'none',
            boxShadow: 'none'
          }}
          disabled={disabled}
        />
        
        <Box 
          borderTop="1px solid"
          borderColor="gray.200"
          pt={4}
          display="flex"
          justifyContent="flex-end"
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
            disabled={disabled || !message.trim()}
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