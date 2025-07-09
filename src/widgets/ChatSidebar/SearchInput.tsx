import { Box, Input } from '@chakra-ui/react'
import { Search } from 'lucide-react'

type SearchInputProps = {
  value: string
  onChange: (value: string) => void
}

export function SearchInput({ value, onChange }: SearchInputProps) {
  return (
    <Box position="relative" width="100%">
      <Box
        position="absolute"
        left="10px"
        top="50%"
        transform="translateY(-50%)"
        display="flex"
        alignItems="center"
        justifyContent="center"
        zIndex={1}
        pointerEvents="none"
      >
        <Search
          size={18}
          color="#27272a"
        />
      </Box>
      <Input
        placeholder="Search for chats..."
        value={value}
        onChange={(e) => onChange(e.target.value)}
        paddingLeft="36px"
        paddingRight="10px"
        height="36px"
        fontSize="14px"
        fontWeight="400"
        lineHeight="20px"
        bg="white"
        borderColor="#e4e4e7"
        borderWidth="1px"
        borderRadius="6px"
        color="#27272a"
        _placeholder={{
          color: "#a1a1aa",
          fontSize: "14px",
          fontWeight: "400",
          lineHeight: "20px"
        }}
        _focus={{
          borderColor: "#a1a1aa",
          boxShadow: "none"
        }}
      />
    </Box>
  )
}