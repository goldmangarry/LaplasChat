import { parseMarkdown } from '@/shared/lib/markdown';
import { Box, Drawer, Flex, Link, Skeleton, Text, VStack } from '@chakra-ui/react';
import { ExternalLink, CheckCircle2 } from 'lucide-react';
import deepseekColorIcon from '@/assets/icons/deepseek-color.svg';

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
                  Fact Check
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
                  {/* Model Information */}
                  <Box textAlign="center" py={4}>
                    <VStack gap={3}>
                      <Box 
                        width="60px" 
                        height="60px" 
                        borderRadius="full" 
                        display="flex"
                        alignItems="center"
                        justifyContent="center"
                      >
                        <img 
                          src={deepseekColorIcon} 
                          alt="DeepSeek" 
                          style={{ width: '32px', height: '32px' }}
                        />
                      </Box>
                      <Text fontSize="20px" fontWeight="semibold" color="gray.800">
                        DeepSeek V3 Model
                      </Text>
                      <Text fontSize="14px" color="gray.600" textAlign="center" px={2}>
                        Advanced reasoning model with enhanced fact-checking capabilities,
                        comprehensive knowledge base, and reliable source verification.
                      </Text>
                    </VStack>
                  </Box>

                  {/* Response */}
                  <Box>
                    <Text fontSize="14px" fontWeight="600" color="gray.800" mb={3}>
                      Fact Check Result
                    </Text>
                    <Text fontSize="14px" color="gray.600" lineHeight="1.5">
                      {parseMarkdown(data.response)}
                    </Text>
                  </Box>

                  {/* Sources */}
                  {data.urls && data.urls.length > 0 && (
                    <Box>
                      <Text fontSize="14px" fontWeight="600" color="gray.800" mb={3}>
                        Sources
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
                  An error occurred while checking the facts
                </Text>
              )}
            </Box>
          </Drawer.Body>
        </Drawer.Content>
      </Drawer.Positioner>
    </Drawer.Root>
  );
};