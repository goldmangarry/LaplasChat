import { parseMarkdown } from '@/shared/lib/markdown';
import { Box, Button, Flex, HStack, Link, Skeleton, Text, VStack } from '@chakra-ui/react';
import { X, ExternalLink, CheckCircle2 } from 'lucide-react';

type FactCheckData = {
  response: string;
  urls: string[];
};

type FactCheckSidebarProps = {
  isOpen: boolean;
  onClose: () => void;
  data?: FactCheckData;
  isLoading: boolean;
};

export const FactCheckSidebar = ({
  isOpen,
  onClose,
  data,
  isLoading,
}: FactCheckSidebarProps) => {
  if (!isOpen) return null;

  return (
    <Box
      position="fixed"
      top="0"
      right="0"
      width="400px"
      height="100vh"
      bg="white"
      borderLeft="1px solid"
      borderColor="gray.200"
      zIndex="1000"
      overflow="hidden"
      display="flex"
      flexDirection="column"
    >
      {/* Header */}
      <Flex
        justify="space-between"
        align="center"
        p={5}
        borderBottom="1px solid"
        borderColor="gray.200"
      >
        <HStack gap={2}>
          <CheckCircle2 size={20} color="#10B981" />
          <Text fontSize="16px" fontWeight="600" color="gray.800">
            Проверка фактов
          </Text>
        </HStack>
        <Button
          variant="ghost"
          size="sm"
          p={0}
          minW="24px"
          h="24px"
          onClick={onClose}
        >
          <X size={20} color="#6B7280" />
        </Button>
      </Flex>

      {/* Content */}
      <Box flex="1" p={4} overflow="auto">
        {isLoading ? (
          <VStack gap={4} align="stretch">
            <Skeleton height="20px" />
            <Skeleton height="60px" />
            <Skeleton height="40px" />
            <Skeleton height="40px" />
            <Skeleton height="40px" />
          </VStack>
        ) : data ? (
          <VStack gap={6} align="stretch">
            {/* Response */}
            <Box>
              <Text fontSize="14px" fontWeight="600" color="gray.800" mb={3}>
                Результат проверки
              </Text>
              <Text fontSize="14px" color="gray.600" lineHeight="1.5">
                {parseMarkdown(data.response)}
              </Text>
            </Box>

            {/* Sources */}
            {data.urls && data.urls.length > 0 && (
              <Box>
                <Text fontSize="14px" fontWeight="600" color="gray.800" mb={3}>
                  Источники
                </Text>
                <VStack gap={2} align="stretch">
                  {data.urls.map((url, index) => (
                    <Link
                      key={index}
                      href={url}
                      target="_blank"
                      rel="noopener noreferrer"
                      p={3}
                      bg="gray.50"
                      borderRadius="8px"
                      fontSize="14px"
                      color="blue.600"
                      _hover={{
                        bg: "gray.100",
                        textDecoration: "none",
                      }}
                      display="flex"
                      alignItems="center"
                      justifyContent="space-between"
                    >
                      <Text 
                        flex="1" 
                        overflow="hidden" 
                        textOverflow="ellipsis" 
                        whiteSpace="nowrap"
                        mr={2}
                      >
                        {url}
                      </Text>
                      <ExternalLink size={14} color="#2563EB" />
                    </Link>
                  ))}
                </VStack>
              </Box>
            )}
          </VStack>
        ) : (
          <Text fontSize="14px" color="gray.500">
            Произошла ошибка при проверке фактов
          </Text>
        )}
      </Box>
    </Box>
  );
};