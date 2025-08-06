import { HStack, Text } from '@chakra-ui/react'
import { useEffect, useState } from 'react'
import { Lightbulb } from 'lucide-react'

const SECURITY_STATUSES = [
  'Сканирую на уязвимости...',
  'Шифрую запрос...', 
  'Отправляю запрос к внешней ИИ модели...',
  'Ожидаю ответ от ИИ модели...',
  'Расшифровываю ответ...',
  'Готовлю ответ...'
] as const

export const SecureLoadingStatus = () => {
  const [currentStatusIndex, setCurrentStatusIndex] = useState(0)
 
  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentStatusIndex((prev) => (prev + 1) % SECURITY_STATUSES.length)
    }, 10000) // Change every 5 seconds

    return () => clearInterval(interval)
  }, [])

  const currentStatus = SECURITY_STATUSES[currentStatusIndex]

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