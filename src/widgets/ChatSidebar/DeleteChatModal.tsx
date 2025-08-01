import { Dialog, Button, Text, HStack } from '@chakra-ui/react'
import { useEffect } from 'react'

type DeleteChatModalProps = {
  isOpen: boolean
  chatTitle: string
  onConfirm: () => void
  onCancel: () => void
}

export const DeleteChatModal = ({
  isOpen,
  chatTitle,
  onConfirm,
  onCancel
}: DeleteChatModalProps) => {
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Enter' && isOpen) {
        e.preventDefault()
        onConfirm()
      }
    }

    if (isOpen) {
      document.addEventListener('keydown', handleKeyDown)
    }

    return () => {
      document.removeEventListener('keydown', handleKeyDown)
    }
  }, [isOpen, onConfirm])
  return (
    <Dialog.Root open={isOpen} onOpenChange={(e) => !e.open && onCancel()} size="sm">
      <Dialog.Backdrop />
      <Dialog.Positioner>
        <Dialog.Content>
          <Dialog.Header>
            <Dialog.Title>Delete Chat</Dialog.Title>
          </Dialog.Header>
          <Dialog.CloseTrigger />
          <Dialog.Body>
            <Text fontSize="sm" color="gray.600">
              Are you sure you want to delete "{chatTitle}"? This action cannot be undone.
            </Text>
          </Dialog.Body>
          <Dialog.Footer>
            <HStack gap={3}>
              <Button
                variant="ghost"
                size="sm"
                onClick={onCancel}
              >
                Cancel
              </Button>
              <Button
                colorScheme="red"
                size="sm"
                onClick={onConfirm}
              >
                Delete
              </Button>
            </HStack>
          </Dialog.Footer>
        </Dialog.Content>
      </Dialog.Positioner>
    </Dialog.Root>
  )
}
