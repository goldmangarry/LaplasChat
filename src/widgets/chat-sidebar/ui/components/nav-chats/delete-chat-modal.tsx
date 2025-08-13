import { useTranslation } from "react-i18next"

import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog"
import { Button } from "@/components/ui/button"

type DeleteChatModalProps = {
  isOpen: boolean
  chatName: string
  onConfirm: () => void
  onCancel: () => void
}

export function DeleteChatModal({ 
  isOpen, 
  chatName, 
  onConfirm, 
  onCancel
}: DeleteChatModalProps) {
  const { t } = useTranslation()

  return (
    <Dialog open={isOpen} onOpenChange={(open) => !open && onCancel()}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>{t('chat.deleteChatModal.title')}</DialogTitle>
          <DialogDescription>
            {t('chat.deleteChatModal.description', { chatName })}
          </DialogDescription>
        </DialogHeader>
        <DialogFooter>
          <Button variant="outline" onClick={onCancel}>
            {t('chat.deleteChatModal.cancelButton')}
          </Button>
          <Button variant="destructive" onClick={onConfirm}>
            {t('chat.deleteChatModal.deleteButton')}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  )
}