import { useTranslation } from "react-i18next"

import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog"
import MarkdownRenderer from "@/components/ui/markdown-renderer"

type EncryptedContentModalProps = {
  isOpen: boolean
  encryptedContent: string
  onClose: () => void
}

export function EncryptedContentModal({ 
  isOpen, 
  encryptedContent, 
  onClose
}: EncryptedContentModalProps) {
  const { t } = useTranslation()

  return (
    <Dialog open={isOpen} onOpenChange={(open) => !open && onClose()}>
      <DialogContent className="max-w-4xl max-h-[80vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle>{t('message.encryptedContent.title')}</DialogTitle>
        </DialogHeader>
        <div className="mt-4">
          <MarkdownRenderer>{encryptedContent}</MarkdownRenderer>
        </div>
      </DialogContent>
    </Dialog>
  )
}