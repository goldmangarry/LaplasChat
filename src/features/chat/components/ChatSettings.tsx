import { Box, Text, Stack, Flex, Icon, Menu, Button, Slider, Input } from '@chakra-ui/react'
import { HiInformationCircle, HiChevronDown } from 'react-icons/hi2'
import { useCallback, useMemo, useState, useEffect } from 'react'
import type { ChatModel, ChatModelFromBackend } from '@/core/types'
import { useChatStore } from '@/features/chat/store'
import anthropicIcon from '@/assets/icons/anthropic.svg'
import openaiIcon from '@/assets/icons/openai.svg'
import googleIcon from '@/assets/icons/google.svg'
import grokIcon from '@/assets/icons/grok.svg'
// import llamaIcon from '@/assets/icons/llama.svg'
// import qwenIcon from '@/assets/icons/qwen.svg'
// import deepseekIcon from '@/assets/icons/deepseek.svg'
type ChatSettingsProps = {
  model: ChatModel
  temperature: number
  maxTokens: number
  onModelChange: (model: ChatModel) => void
  onTemperatureChange: (temperature: number) => void
  onMaxTokensChange: (tokens: number) => void
}

// Объект соответствия provider → иконка
const providerIcons: Record<string, string> = {
  openai: openaiIcon,
  anthropic: anthropicIcon,
  google: googleIcon,
  'x-ai': grokIcon,
  // llama: llamaIcon,
  // qwen: qwenIcon,
  // deepseek: deepseekIcon,
}

export function ChatSettings({
  model,
  temperature,
  maxTokens,
  onModelChange,
  onTemperatureChange,
  onMaxTokensChange
}: ChatSettingsProps) {
  const { models, isLoadingModels, fetchModels } = useChatStore()
  const [localTemperature, setLocalTemperature] = useState(temperature)
  const [tempInputValue, setTempInputValue] = useState(temperature.toString())
  const [localMaxTokens, setLocalMaxTokens] = useState(maxTokens)
  const [maxTokensInputValue, setMaxTokensInputValue] = useState(maxTokens.toString())

  // Находим выбранную модель из данных с бэкенда
  const selectedModel = useMemo(() => {
    return models.find(m => m.id === model) || null
  }, [models, model])

  // Загружаем модели при монтировании компонента
  useEffect(() => {
    if (models.length === 0) {
      fetchModels()
    }
  }, [models.length, fetchModels])

  // Автоматически выбираем первую модель при загрузке, если модель не выбрана
  useEffect(() => {
    if (models.length > 0 && !selectedModel) {
      const firstModel = models[0]
      onModelChange(firstModel.id as ChatModel)
    }
  }, [models, selectedModel, onModelChange])

  // Получаем max_output выбранной модели
  const selectedModelMaxOutput = useMemo(() => {
    return selectedModel?.max_output || 4096
  }, [selectedModel])

  // Обновляем maxTokens при изменении модели, если maxTokens больше max_output новой модели
  useEffect(() => {
    if (selectedModelMaxOutput && maxTokens > selectedModelMaxOutput) {
      onMaxTokensChange(selectedModelMaxOutput)
      setLocalMaxTokens(selectedModelMaxOutput)
      setMaxTokensInputValue(selectedModelMaxOutput.toString())
    }
  }, [selectedModelMaxOutput, maxTokens, onMaxTokensChange])

  // Формируем опции для селектора из данных с бэкенда
  const modelOptions = useMemo(() => {
    return models.map((modelData: ChatModelFromBackend) => ({
      value: modelData.id,
      label: modelData.name,
      icon: providerIcons[modelData.provider] || openaiIcon, // fallback на openai иконку
      max_output: modelData.max_output
    }))
  }, [models])

  const handleTemperatureChangeEnd = useCallback((details: { value: number[] }) => {
    onTemperatureChange(details.value[0])
  }, [onTemperatureChange])

  const handleMaxTokensChangeEnd = useCallback((details: { value: number[] }) => {
    onMaxTokensChange(details.value[0])
  }, [onMaxTokensChange])

  const handleTempInputCommit = () => {
    let value = parseFloat(tempInputValue)
    if (isNaN(value) || tempInputValue.trim() === '') {
      value = 0
    }
    const clampedValue = Math.max(0, Math.min(1, value))
    setLocalTemperature(clampedValue)
    setTempInputValue(clampedValue.toString())
    onTemperatureChange(clampedValue)
  }

  const handleMaxTokensInputCommit = () => {
    let value = parseInt(maxTokensInputValue, 10)
    if (isNaN(value) || maxTokensInputValue.trim() === '') {
      value = 1024
    }
    const clampedValue = Math.max(1024, Math.min(selectedModelMaxOutput, value))
    setLocalMaxTokens(clampedValue)
    setMaxTokensInputValue(clampedValue.toString())
    onMaxTokensChange(clampedValue)
  }

  return (
    <Box 
      width="100%"
      height="100%"
      bg="white"
    >
      <Stack gap={6} align="stretch">
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
                loading={isLoadingModels}
              >
                <Flex align="center" gap={2} width="100%" justifyContent="space-between">
                  <Flex align="center" gap={2}>
                    {selectedModel && (
                      <Box w={6} h={6}>
                        <img 
                          src={providerIcons[selectedModel.provider] || openaiIcon} 
                          alt={selectedModel.name}
                          style={{ width: '100%', height: '100%', objectFit: 'contain' }}
                        />
                      </Box>
                    )}
                    <Text>{selectedModel?.name || 'Select model'}</Text>
                  </Flex>
                  <Icon as={HiChevronDown} />
                </Flex>
              </Button>
            </Menu.Trigger>
            
            <Menu.Positioner>
              <Menu.Content zIndex={10}>
                {modelOptions.map((modelOption) => (
                  <Menu.Item
                    key={modelOption.value}
                    value={modelOption.value}
                    _hover={{ bg: "gray.50" }}
                    cursor="pointer"
                    onClick={() => onModelChange(modelOption.value as ChatModel)}
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
              onValueChange={(value) => {
                const newValue = value.value[0]
                setLocalTemperature(newValue)
                setTempInputValue(newValue.toString())
              }}
              onValueChangeEnd={handleTemperatureChangeEnd}
            >
              <Flex justify="space-between" align="center" mb={2}>
                <Flex align="center" gap={1}>
                  <Slider.Label fontSize="sm" fontWeight="medium" color="gray.800">
                    Temperature
                  </Slider.Label>
                  <Icon as={HiInformationCircle} boxSize={4} color="gray.400" />
                </Flex>
                <Input
                  width="64px"
                  height="28px"
                  textAlign="center"
                  value={tempInputValue}
                  onChange={(e) => setTempInputValue(e.target.value)}
                  onBlur={handleTempInputCommit}
                  onKeyDown={(e) => {
                    if (e.key === 'Enter') {
                      handleTempInputCommit();
                      (e.target as HTMLInputElement).blur()
                    }
                  }}
                  size="sm"
                  variant="outline"
                  borderColor="gray.200"
                />
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
              max={selectedModelMaxOutput}
              step={1024}
              value={[localMaxTokens]}
              onValueChange={(value) => {
                const newValue = value.value[0]
                setLocalMaxTokens(newValue)
                setMaxTokensInputValue(newValue.toString())
              }}
              onValueChangeEnd={handleMaxTokensChangeEnd}
            >
              <Flex justify="space-between" align="center" mb={2}>
                <Flex align="center" gap={1}>
                  <Slider.Label fontSize="sm" fontWeight="medium" color="gray.800">
                    Output Length
                  </Slider.Label>
                  <Icon as={HiInformationCircle} boxSize={4} color="gray.400" />
                </Flex>
                <Input
                  width="64px"
                  height="28px"
                  textAlign="center"
                  value={maxTokensInputValue}
                  onChange={(e) => setMaxTokensInputValue(e.target.value)}
                  onBlur={handleMaxTokensInputCommit}
                  onKeyDown={(e) => {
                    if (e.key === 'Enter') {
                      handleMaxTokensInputCommit()
                      ;(e.target as HTMLInputElement).blur()
                    }
                  }}
                  size="sm"
                  variant="outline"
                  borderColor="gray.200"
                />
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
              <Text fontSize="xs" color="gray.500">{Math.floor(selectedModelMaxOutput / 1000)}K</Text>
            </Flex>
          </Stack>
        </Stack>
      </Stack>
    </Box>
  )
}

export type { ChatSettingsProps }