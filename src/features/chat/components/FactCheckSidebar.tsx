import { parseMarkdown } from '@/shared/lib/markdown';
import { Box, Drawer, Flex, HStack, Link, Skeleton, Text, VStack } from '@chakra-ui/react';
import { ExternalLink, CheckCircle2 } from 'lucide-react';

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
  return (
    <Drawer.Root
      open={isOpen}
      onOpenChange={(e) => !e.open && onClose()}
      placement="end"
    >
      <Drawer.Backdrop />
      <Drawer.Positioner>
        <Drawer.Content maxWidth="400px" width="400px">
          <Drawer.Header>
            <Drawer.Title fontSize="lg" fontWeight="semibold">
              <Flex align="center" gap={2}>
                <CheckCircle2 size={20} color="#10B981" />
                Проверка фактов
              </Flex>
            </Drawer.Title>
            <Drawer.CloseTrigger />
          </Drawer.Header>
          <Drawer.Body>
            <Box p={4}>
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
          </Drawer.Body>
        </Drawer.Content>
      </Drawer.Positioner>
    </Drawer.Root>
  );
};