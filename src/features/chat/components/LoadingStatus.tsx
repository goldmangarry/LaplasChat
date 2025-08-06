import { HStack, Text } from '@chakra-ui/react'
import { useEffect, useState } from 'react'
import { Lightbulb } from 'lucide-react'

const LOADING_STATUSES = [
  'Генерирую ответ...',
  'Думаю...',
  'Обрабатываю запрос...',
  'Пишу для вас...',
  'Формулирую ответ...'
] as const

export const LoadingStatus = () => {
  const [currentStatusIndex, setCurrentStatusIndex] = useState(0)

  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentStatusIndex((prev) => (prev + 1) % LOADING_STATUSES.length)
    }, 5000) // Change every 3 seconds

    return () => clearInterval(interval)
  }, [])

  const currentStatus = LOADING_STATUSES[currentStatusIndex]

  return (
    <HStack gap={1} align="center">
      <Lightbulb size={20} color="#6b7280" />
      <Text 
        fontSize="14px" 
        color="gray.600" 
        className="shiny-text"
        fontWeight="500"
        display='inline'
      >
        {currentStatus}
      </Text>
    </HStack>
  )
}