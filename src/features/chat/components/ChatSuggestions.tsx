import { Box, Text, Grid } from '@chakra-ui/react';

const suggestions = [
  { text: 'Give me a rundown of AI startups', bg: '#FEE2F4' },
  { text: 'AI-driven healthcare solutions improving diagnostics and patient care.', bg: '#E9D8FD' },
  { text: 'Natural language processing startups enhancing customer service through chatbots.', bg: '#FEF08A' },
];

type ChatSuggestionsProps = {
  onSuggestionClick: (text: string) => void;
};

export function ChatSuggestions({ onSuggestionClick }: ChatSuggestionsProps) {
  return (
    <Box>
      <Grid templateColumns={{ base: '1fr', md: 'repeat(3, 1fr)' }} gap={4}>
        {suggestions.map((suggestion, index) => (
          <Box
            key={index}
            p={4}
            bg={suggestion.bg}
            borderRadius="lg"
            cursor="pointer"
            onClick={() => onSuggestionClick(suggestion.text)}
            _hover={{ filter: 'brightness(0.95)' }}
            height="100%"
            transition="filter 0.2s"
          >
            <Text fontSize="sm" color="gray.800">
              {suggestion.text}
            </Text>
          </Box>
        ))}
      </Grid>
    </Box>
  );
} 