import { Box, Text, Stack, Flex, Icon, Menu, Button, Slider } from '@chakra-ui/react'
import { HiInformationCircle, HiCog6Tooth, HiChevronDown } from 'react-icons/hi2'
import { useCallback, useMemo, useState } from 'react'
import type { ChatModel } from '@/core/types'
import anthropicIcon from '@/assets/icons/anthropic.svg'
import openaiIcon from '@/assets/icons/openai.svg'
import googleIcon from '@/assets/icons/google.svg'
import xaiIcon from '@/assets/icons/xai.svg'

type ChatSettingsProps = {
  model: ChatModel
  temperature: number
  maxTokens: number
  onModelChange: (model: ChatModel) => void
  onTemperatureChange: (temperature: number) => void
  onMaxTokensChange: (tokens: number) => void
}

const models: { value: ChatModel; label: string; icon: string }[] = [
  // OpenAI Models
  { value: 'openai/o3', label: 'o3', icon: openaiIcon },
  { value: 'openai/o4-mini-high', label: 'o4 Mini High', icon: openaiIcon },
  { value: 'openai/o4-mini', label: 'o4 Mini', icon: openaiIcon },
  { value: 'openai/gpt-4.1', label: 'GPT-4.1', icon: openaiIcon },
  { value: 'openai/gpt-4.1-mini', label: 'GPT-4.1 Mini', icon: openaiIcon },
  
  // xAI Models
  { value: 'x-ai/grok-4', label: 'Grok 4', icon: xaiIcon },
  
  // Anthropic Models
  { value: 'anthropic/claude-opus-4', label: 'Claude Opus 4', icon: anthropicIcon },
  { value: 'anthropic/claude-sonnet-4', label: 'Claude Sonnet 4', icon: anthropicIcon },
  { value: 'anthropic/claude-3.5-haiku', label: 'Claude 3.5 Haiku', icon: anthropicIcon },
  
  // Google Models
  { value: 'google/gemini-2.5-flash', label: 'Gemini 2.5 Flash', icon: googleIcon },
  { value: 'google/gemini-2.5-pro', label: 'Gemini 2.5 Pro', icon: googleIcon }
]


export function ChatSettings({
  model,
  temperature,
  maxTokens,
  onModelChange,
  onTemperatureChange,
  onMaxTokensChange
}: ChatSettingsProps) {
  const selectedModel = useMemo(() => models.find(m => m.value === model), [model])
  const [localTemperature, setLocalTemperature] = useState(temperature)
  const [localMaxTokens, setLocalMaxTokens] = useState(maxTokens)

  const handleTemperatureChangeEnd = useCallback((details: { value: number[] }) => {
    onTemperatureChange(details.value[0])
  }, [onTemperatureChange])

  const handleMaxTokensChangeEnd = useCallback((details: { value: number[] }) => {
    onMaxTokensChange(details.value[0])
  }, [onMaxTokensChange])

  return (
    <Box 
      width="280px" 
      height="100vh" 
      bg="white" 
      borderLeft="1px solid" 
      borderColor="gray.200"
      p={4}
    >
      <Stack gap={6} align="stretch">
        {/* Header */}
        <Flex align="center" gap={2}>
          <Icon as={HiCog6Tooth} boxSize={5} color="gray.600" />
          <Text fontSize="lg" fontWeight="semibold" color="gray.800">
            Chat settings
          </Text>
        </Flex>

        {/* Model Selection */}
        <Stack gap={3} align="stretch">
          <Text fontSize="sm" fontWeight="medium" color="gray.600">
            Model
          </Text>
          
          <Menu.Root>
            <Menu.Trigger asChild>
              <Button
                variant="outline"
                width="100%"
                bg="white"
                borderColor="gray.200"
                _hover={{ borderColor: "gray.300" }}
                display="flex"
                justifyContent="space-between"
                alignItems="center"
                aria-label="Select AI model"
              >
                <Flex align="center" gap={2} width="100%" justifyContent="space-between">
                  <Flex align="center" gap={2}>
                    {selectedModel && (
                      <Box w={6} h={6}>
                        <img 
                          src={selectedModel.icon} 
                          alt={selectedModel.label}
                          style={{ width: '100%', height: '100%', objectFit: 'contain' }}
                        />
                      </Box>
                    )}
                    <Text>{selectedModel?.label || 'Select model'}</Text>
                  </Flex>
                  <Icon as={HiChevronDown} />
                </Flex>
              </Button>
            </Menu.Trigger>
            
            <Menu.Positioner>
              <Menu.Content zIndex={10}>
                {models.map((modelOption) => (
                  <Menu.Item
                    key={modelOption.value}
                    value={modelOption.value}
                    _hover={{ bg: "gray.50" }}
                    cursor="pointer"
                    onClick={() => onModelChange(modelOption.value)}
                  >
                    <Flex align="center" gap={2} p={1}>
                      <Box w={6} h={6}>
                        <img 
                          src={modelOption.icon} 
                          alt={modelOption.label}
                          style={{ width: '100%', height: '100%', objectFit: 'contain' }}
                        />
                      </Box>
                      <Text>{modelOption.label}</Text>
                    </Flex>
                  </Menu.Item>
                ))}
              </Menu.Content>
            </Menu.Positioner>
          </Menu.Root>
        </Stack>

        {/* Parameters */}
        <Stack gap={6} align="stretch">
          <Text fontSize="sm" fontWeight="medium" color="gray.600">
            Parameters
          </Text>

          {/* Temperature */}
          <Stack gap={3} align="stretch">
            <Slider.Root
              min={0}
              max={1}
              step={0.01}
              value={[localTemperature]}
              onValueChange={(value) => setLocalTemperature(value.value[0])}
              onValueChangeEnd={handleTemperatureChangeEnd}
            >
              <Flex justify="space-between" align="center" mb={2}>
                <Flex align="center" gap={1}>
                  <Slider.Label fontSize="sm" fontWeight="medium" color="gray.800">
                    Temperature
                  </Slider.Label>
                  <Icon as={HiInformationCircle} boxSize={4} color="gray.400" />
                </Flex>
                <Slider.ValueText fontSize="sm" color="gray.600" />
              </Flex>
              
              <Slider.Control>
                <Slider.Track bg="gray.200" height="6px" borderRadius="3px">
                  <Slider.Range bg="gray.700" />
                </Slider.Track>
                <Slider.Thumb index={0} boxSize="4" bg="white" boxShadow="sm" border="1px solid" borderColor="gray.300">
                  <Slider.HiddenInput />
                </Slider.Thumb>
              </Slider.Control>
            </Slider.Root>
            
            <Flex justify="space-between">
              <Text fontSize="xs" color="gray.500">More accuracy</Text>
              <Text fontSize="xs" color="gray.500">More creativity</Text>
            </Flex>
          </Stack>

          {/* Max Tokens (Output Length) */}
          <Stack gap={3} align="stretch">
            <Slider.Root
              min={1024}
              max={100000}
              step={1024}
              value={[localMaxTokens]}
              onValueChange={(value) => setLocalMaxTokens(value.value[0])}
              onValueChangeEnd={handleMaxTokensChangeEnd}
            >
              <Flex justify="space-between" align="center" mb={2}>
                <Flex align="center" gap={1}>
                  <Slider.Label fontSize="sm" fontWeight="medium" color="gray.800">
                    Output Length
                  </Slider.Label>
                  <Icon as={HiInformationCircle} boxSize={4} color="gray.400" />
                </Flex>
                <Slider.ValueText fontSize="sm" color="gray.600" />
              </Flex>
              
              <Slider.Control>
                <Slider.Track bg="gray.200" height="6px" borderRadius="3px">
                  <Slider.Range bg="gray.700" />
                </Slider.Track>
                <Slider.Thumb index={0} boxSize="4" bg="white" boxShadow="sm" border="1px solid" borderColor="gray.300">
                  <Slider.HiddenInput />
                </Slider.Thumb>
              </Slider.Control>
            </Slider.Root>
            
            <Flex justify="space-between">
              <Text fontSize="xs" color="gray.500">1K</Text>
              <Text fontSize="xs" color="gray.500">100K</Text>
            </Flex>
          </Stack>
        </Stack>
      </Stack>
    </Box>
  )
}

export type { ChatSettingsProps }