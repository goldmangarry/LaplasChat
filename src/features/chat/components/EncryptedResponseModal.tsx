import { Box, Portal } from '@chakra-ui/react';
import { Dialog } from '@chakra-ui/react';
import { parseMarkdown } from '../../../shared/lib/markdown.tsx';

type EncryptedResponseModalProps = {
  isOpen: boolean;
  onClose: () => void;
  content: string;
};

export const EncryptedResponseModal = ({
  isOpen,
  onClose,
  content,
}: EncryptedResponseModalProps) => {
  return (
    <Dialog.Root open={isOpen} onOpenChange={(e) => !e.open && onClose()} size="lg">
      <Portal>
        <Dialog.Backdrop />
        <Dialog.Positioner>
          <Dialog.Content>
            <Dialog.Header>
              <Dialog.Title>Encrypted Response</Dialog.Title>
            </Dialog.Header>
            <Dialog.CloseTrigger />
            <Dialog.Body>
              <Box
                maxHeight="400px"
                overflowY="auto"
                fontSize="14px"
                lineHeight="1.5"
              >
                {parseMarkdown(content)}
              </Box>
            </Dialog.Body>
          </Dialog.Content>
        </Dialog.Positioner>
      </Portal>
    </Dialog.Root>
  );
};