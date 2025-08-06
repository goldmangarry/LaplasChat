import { Box, HStack, Text, Switch, IconButton, Menu, Button, Flex, Icon, useBreakpointValue } from '@chakra-ui/react'
import { PanelRight, Menu as MenuIcon } from 'lucide-react'
import { HiChevronDown, HiInformationCircle } from 'react-icons/hi2'
import type { ChatModel, ChatModelFromBackend } from '@/core/types'
import anthropicIcon from '@/assets/icons/anthropic.svg'
import openaiIcon from '@/assets/icons/openai.svg'
import googleIcon from '@/assets/icons/google.svg'
import grokIcon from '@/assets/icons/grok.svg'
import metaColorIcon from '@/assets/icons/meta-color.svg'
import mistralColorIcon from '@/assets/icons/mistral-color.svg'
import deepseekColorIcon from '@/assets/icons/deepseek-color.svg'
import qwenColorIcon from '@/assets/icons/qwen-color.svg'
import { ClickTooltip } from '@/components/ui/tooltip'

// Объект соответствия provider → иконка
const providerIcons: Record<string, string> = {
  openai: openaiIcon,
  anthropic: anthropicIcon,
  google: googleIcon,
  'x-ai': grokIcon,
  'meta-llama': metaColorIcon,
  mistralai: mistralColorIcon,
  deepseek: deepseekColorIcon,
  qwen: qwenColorIcon,
}

type ChatHeaderProps = {
  secureMode?: boolean;
  onSecureModeChange?: (enabled: boolean) => void;
  onOpenSettings?: () => void;
  onOpenSidebar?: () => void;
  model?: ChatModel;
  models?: ChatModelFromBackend[];
  isLoadingModels?: boolean;
  onModelChange?: (model: ChatModel) => void;
};

export default function ChatHeader({
  secureMode = false,
  onSecureModeChange,
  onOpenSettings,
  onOpenSidebar,
  model,
  models = [],
  isLoadingModels = false,
  onModelChange,
}: ChatHeaderProps) {
  // Находим выбранную модель из данных с бэкенда
  const selectedModel = models.find(m => m.id === model) || null
  const isMobile = useBreakpointValue({ base: true, md: false })
  
  return (
    <Box 
      borderBottom="1px solid" 
      borderColor="gray.200" 
      px={{ base: 4, md: 6 }} 
      py={4}
    >
      <HStack justify="space-between" align="center">
        <HStack gap={{ base: 2, md: 4 }}>
          {/* Mobile Menu Button */}
          {isMobile && onOpenSidebar && (
            <IconButton
              aria-label="Open menu"
              variant="ghost"
              size="sm"
              onClick={onOpenSidebar}
            >
              <MenuIcon size={20} />
            </IconButton>
          )}
          {/* Model Selection */}
          {models.length > 0 && (
            <Menu.Root>
              <Menu.Trigger asChild>
                <Button
                  variant="ghost"
                  size="sm"
                  bg="transparent"
                  _hover={{ bg: "gray.50" }}
                  display="flex"
                  justifyContent="space-between"
                  alignItems="center"
                  aria-label="Select AI model"
                  loading={isLoadingModels}
                  px={{ base: 1, md: 2 }}
                >
                  <Flex align="center" gap={{ base: 1, md: 2 }}>
                    {selectedModel && (
                      <Box w={4} h={4}>
                        <img 
                          src={providerIcons[selectedModel.provider] || openaiIcon} 
                          alt={selectedModel.name}
                          style={{ width: '100%', height: '100%', objectFit: 'contain' }}
                        />
                      </Box>
                    )}
                    <Text fontSize="xs" fontWeight="medium" display={{ base: "block", md: "block" }}>
                      {selectedModel?.name || 'Выберите модель'}
                    </Text>
                    <Icon as={HiChevronDown} boxSize={3} />
                  </Flex>
                </Button>
              </Menu.Trigger>
              
              <Menu.Positioner>
                <Menu.Content zIndex={10} maxHeight="200px" overflowY="auto">
                  {models.map((modelOption) => (
                    <Menu.Item
                      key={modelOption.id}
                      value={modelOption.id}
                      _hover={{ bg: "gray.50" }}
                      cursor="pointer"
                      onClick={() => onModelChange?.(modelOption.id as ChatModel)}
                    >
                      <Flex align="center" gap={2} p={1}>
                        <Box w={4} h={4}>
                          <img 
                            src={providerIcons[modelOption.provider] || openaiIcon} 
                            alt={modelOption.name}
                            style={{ width: '100%', height: '100%', objectFit: 'contain' }}
                          />
                        </Box>
                        <Text fontSize="xs">{modelOption.name}</Text>
                      </Flex>
                    </Menu.Item>
                  ))}
                </Menu.Content>
              </Menu.Positioner>
            </Menu.Root>
          )}
          
          {/* Secure Mode */}
          <HStack gap={{ base: 1, md: 2 }}>
            <Switch.Root
              checked={secureMode}
              onCheckedChange={(e) => onSecureModeChange?.(e.checked)}
              colorPalette="pink"
              size="sm"
            >
              <Switch.HiddenInput />
              <Switch.Control>
                <Switch.Thumb />
              </Switch.Control>
            </Switch.Root>
            <Text fontSize="xs" fontWeight="normal" color="black">
              Безопасный режим
            </Text>
            <ClickTooltip interactive content="При включении Безопасного режима конфиденциальные данные, включая название компании, персональные данные и так далее, не передаются во внешние ИИ модели. Советуем работать с чувствительными данными в этом режиме">
              <Icon as={HiInformationCircle} boxSize={4} color="gray.400" />
            </ClickTooltip>
          </HStack>
        </HStack>

        <HStack gap={2}>    
          <IconButton
          borderRadius='16px'
          aria-label="Open settings"
          variant="ghost"
          size="sm"
          onClick={onOpenSettings}
        >
          <PanelRight size={20} />
        </IconButton>
        </HStack>
      </HStack>
    </Box>
  );
}