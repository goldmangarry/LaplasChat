import { Box } from '@chakra-ui/react'

export const Logo = () => {
  return (
    <Box width="173px" height="46px" position="relative">
      {/* Векторные элементы логотипа из Figma */}
      <svg width="173" height="46" viewBox="0 0 173 46" fill="none" xmlns="http://www.w3.org/2000/svg">
        {/* Основные векторные элементы */}
        <path d="M30 8L30 38L0 38L0 8L30 8Z" fill="url(#gradient1)"/>
        <path d="M8.5 15L21.5 15L21.5 31L8.5 31L8.5 15Z" fill="white"/>
        <path d="M15 19L19 25L11 25L15 19Z" fill="url(#gradient1)"/>
        
        {/* Текстовые элементы */}
        <text x="35" y="32" fontSize="18" fontWeight="600" fill="#24262d">
          api<tspan fill="#FF6B6B">laplas</tspan>
        </text>
        
        <defs>
          <linearGradient id="gradient1" x1="0%" y1="0%" x2="100%" y2="100%">
            <stop offset="0%" stopColor="#FF6B6B"/>
            <stop offset="100%" stopColor="#FF8E4F"/>
          </linearGradient>
        </defs>
      </svg>
    </Box>
  )
}