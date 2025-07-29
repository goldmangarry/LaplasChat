import { Box, HStack, Text, Switch, IconButton, Button } from '@chakra-ui/react'
import { PanelRight } from 'lucide-react'
import { Link } from '@tanstack/react-router'

type ChatHeaderProps = {
  secureMode?: boolean;
  onSecureModeChange?: (enabled: boolean) => void;
  onOpenSettings?: () => void;
};

export default function ChatHeader({
  secureMode = true,
  onSecureModeChange,
  onOpenSettings,
}: ChatHeaderProps) {
  return (
    <Box 
      borderBottom="1px solid" 
      borderColor="gray.200" 
      px={6} 
      py={4}
    >
      <HStack justify="space-between" align="center">
        <HStack gap={2.5}>
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
            Secure mode
          </Text>
        </HStack>

        <HStack gap={2}>
          <Button asChild variant="outline" size="sm">
            <Link to="/login">
              Вход
            </Link>
          </Button>
          
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