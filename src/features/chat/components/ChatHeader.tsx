import { Box, HStack, Text, Switch, Separator } from '@chakra-ui/react'

type ChatHeaderProps = {
  secureMode?: boolean;
  compareMode?: boolean;
  onSecureModeChange?: (enabled: boolean) => void;
  onCompareModeChange?: (enabled: boolean) => void;
};

export default function ChatHeader({
  secureMode = true,
  compareMode = false,
  onSecureModeChange,
  onCompareModeChange,
}: ChatHeaderProps) {
  return (
    <Box 
      borderBottom="1px solid" 
      borderColor="gray.200" 
      px={6} 
      py={4}
    >
      <HStack justify="space-between" align="center">
        <HStack gap={3}>
          <HStack gap={2.5}>
            <Switch.Root
              checked={secureMode}
              onCheckedChange={(e) => onSecureModeChange?.(e.checked)}
              colorPalette="pink"
              size="sm"
            >
              <Switch.Control>
                <Switch.Thumb />
              </Switch.Control>
            </Switch.Root>
            <Text fontSize="xs" fontWeight="normal" color="black">
              Secure mode
            </Text>
          </HStack>
          
          <Separator orientation="vertical" height="32px" />
          
          <HStack gap={2.5}>
            <Switch.Root
              checked={compareMode}
              onCheckedChange={(e) => onCompareModeChange?.(e.checked)}
              size="sm"
            >
              <Switch.Control>
                <Switch.Thumb />
              </Switch.Control>
            </Switch.Root>
            <Text fontSize="xs" fontWeight="normal" color="black">
              Compare mode
            </Text>
          </HStack>
        </HStack>

      </HStack>
    </Box>
  );
}