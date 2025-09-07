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
        className="max-w-sm sm:max-w-md shadow-lg"
        showCloseButton={false}
      >
        <DialogHeader className="gap-2">
          <DialogTitle className="text-lg font-semibold">
            {t('disableSecureMode.title')}
          </DialogTitle>
          <DialogDescription className="text-sm text-left leading-relaxed">
            {t('disableSecureMode.description')}
          </DialogDescription>
        </DialogHeader>
        
        <DialogFooter className="flex flex-col sm:flex-row justify-end gap-2 pt-4">
          <Button
            variant="outline"
            onClick={onCancel}
            className="w-full sm:w-auto text-sm font-medium px-4 py-2 h-9 shadow-sm"
          >
            {t('disableSecureMode.cancel')}
          </Button>
          <Button
            onClick={onConfirm}
            className="w-full sm:w-auto text-sm font-medium px-4 py-2 h-9 shadow-sm"
          >
            {t('disableSecureMode.confirm')}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}