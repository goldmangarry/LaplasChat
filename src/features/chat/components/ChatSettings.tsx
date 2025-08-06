import { Box, Text, Stack, Flex, Icon, Slider, Input } from '@chakra-ui/react'
import { HiInformationCircle } from 'react-icons/hi2'
import { useCallback, useState, useEffect, useMemo } from 'react'
import type { ChatModel } from '@/core/types'
import { useChatStore } from '@/features/chat/store'
import { ClickTooltip } from '@/components/ui/tooltip'

type ChatSettingsProps = {
  model: ChatModel
  temperature: number
  maxTokens: number
  onTemperatureChange: (temperature: number) => void
  onMaxTokensChange: (tokens: number) => void
}

export function ChatSettings({
  model,
  temperature,
  maxTokens,
  onTemperatureChange,
  onMaxTokensChange
}: ChatSettingsProps) {
  const { models } = useChatStore()
  const [localTemperature, setLocalTemperature] = useState(temperature)
  const [tempInputValue, setTempInputValue] = useState(temperature.toString())
  const [localMaxTokens, setLocalMaxTokens] = useState(maxTokens)
  const [maxTokensInputValue, setMaxTokensInputValue] = useState(maxTokens.toString())

  // Находим выбранную модель из данных с бэкенда
  const selectedModel = useMemo(() => {
    return models.find(m => m.id === model) || null
  }, [models, model])

  // Получаем max_output выбранной модели
  const maxTokensLimit = useMemo(() => {
    return selectedModel?.max_output || 8192
  }, [selectedModel])

  // Обновляем maxTokens при изменении модели, если текущее значение больше max_output новой модели
  useEffect(() => {
    if (maxTokensLimit && localMaxTokens > maxTokensLimit) {
      const newValue = maxTokensLimit
      onMaxTokensChange(newValue)
      setLocalMaxTokens(newValue)
      setMaxTokensInputValue(newValue.toString())
    }
  }, [maxTokensLimit, localMaxTokens, onMaxTokensChange])

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
    const clampedValue = Math.max(0, Math.min(2, value))
    setLocalTemperature(clampedValue)
    setTempInputValue(clampedValue.toString())
    onTemperatureChange(clampedValue)
  }

  const handleMaxTokensInputCommit = () => {
    let value = parseInt(maxTokensInputValue, 10)
    if (isNaN(value) || maxTokensInputValue.trim() === '') {
      value = 1024
    }
    const clampedValue = Math.max(1024, Math.min(maxTokensLimit, value))
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
        {/* Parameters */}
        <Stack gap={6} align="stretch">
          <Text fontSize="sm" fontWeight="medium" color="gray.600">
            Параметры
          </Text>

          {/* Temperature */}
          <Stack gap={3} align="stretch">
            <Slider.Root
              min={0}
              max={2}
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
                    Температура
                  </Slider.Label>
                  <ClickTooltip interactive content="Температура — это параметр, который контролирует случайность ответов модели. Низкие значения делают ответы более сосредоточенными и предсказуемыми, в то время как высокие — более креативными и разнообразными.">
                    <Icon as={HiInformationCircle} boxSize={4} color="gray.400" />
                  </ClickTooltip>
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
              <Text fontSize="xs" color="gray.500">Больше точности</Text>
              <Text fontSize="xs" color="gray.500">Больше креативности</Text>
            </Flex>
          </Stack>

          {/* Max Tokens (Output Length) */}
          <Stack gap={3} align="stretch">
            <Slider.Root
              min={1024}
              max={maxTokensLimit}
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
                    Длина ответа
                  </Slider.Label>
                  <ClickTooltip interactive content="Длина ответа — это параметр, который контролирует длину ответов модели. Низкие значения делают ответы короче, в то время как высокие — длиннее.">
                    <Icon as={HiInformationCircle} boxSize={4} color="gray.400" />
                  </ClickTooltip>
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
              <Text fontSize="xs" color="gray.500">{Math.floor(maxTokensLimit / 1000)}K</Text>
            </Flex>
          </Stack>
        </Stack>
      </Stack>
    </Box>
  )
}

export type { ChatSettingsProps }