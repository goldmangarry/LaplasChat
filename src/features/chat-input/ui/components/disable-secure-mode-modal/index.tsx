import { useTranslation } from "react-i18next";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import type { DisableSecureModeModalProps } from "./types";

export function DisableSecureModeModal({ 
  isOpen, 
  onCancel, 
  onConfirm 
}: DisableSecureModeModalProps) {
  const { t } = useTranslation();

  return (
    <Dialog open={isOpen} onOpenChange={onCancel}>
      <DialogContent 
        className="max-w-lg w-full mx-4 bg-white border border-gray-200 shadow-lg"
        showCloseButton={false}
      >
        <DialogHeader className="gap-2">
          <DialogTitle className="text-lg font-semibold text-gray-900">
            {t('disableSecureMode.title')}
          </DialogTitle>
          <DialogDescription className="text-sm text-gray-600 text-left leading-relaxed">
            {t('disableSecureMode.description')}
          </DialogDescription>
        </DialogHeader>
        
        <DialogFooter className="flex flex-row justify-end gap-2 pt-4">
          <Button
            variant="outline"
            onClick={onCancel}
            className="bg-white hover:bg-gray-50 text-gray-900 text-sm font-medium px-4 py-2 h-9 border border-gray-200 shadow-sm"
          >
            {t('disableSecureMode.cancel')}
          </Button>
          <Button
            onClick={onConfirm}
            className="bg-gray-900 hover:bg-gray-800 text-white text-sm font-medium px-4 py-2 h-9 shadow-sm"
          >
            {t('disableSecureMode.confirm')}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}