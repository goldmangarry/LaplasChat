import { Box, Text, Grid, HStack } from '@chakra-ui/react';
import { Building2, Heart, Banknote } from 'lucide-react';

const suggestions = [
  { text: 'Как крупные компании масштабируют ИИ в ключевых бизнес-процессах?', bg: '#F5F5F5', icon: Building2 },
  { text: 'Какие ИИ-решения применяют медорганизации для диагностики и лечения?', bg: '#F5F5F5', icon: Heart },
  { text: 'Как ИИ помогает банкам и финтеху управлять рисками и повышать доходность?', bg: '#F5F5F5', icon: Banknote },
];

type ChatSuggestionsProps = {
  onSuggestionClick: (text: string) => void;
};

export function ChatSuggestions({ onSuggestionClick }: ChatSuggestionsProps) {
  return (
    <Box>
      <Grid templateColumns={{ base: '1fr', md: 'repeat(3, 1fr)' }} gap={4}>
        {suggestions.map((suggestion, index) => {
          const Icon = suggestion.icon;
          return (
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
              <HStack gap={2} align="flex-start">
                <Icon style={{ minWidth: '16px', marginTop: '2px' }} size={16} color="#4A5568" />
                <Text fontSize="sm" color="gray.800">
                  {suggestion.text}
                </Text>
              </HStack>
            </Box>
          );
        })}
      </Grid>
    </Box>
  );
} 