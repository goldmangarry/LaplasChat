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
import type { SecureModeModalProps } from "./types";

export function SecureModeModal({ isOpen, onClose }: SecureModeModalProps) {
  const { t } = useTranslation();

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent 
        className="max-w-sm sm:max-w-md shadow-lg"
        showCloseButton={false}
      >
        <DialogHeader className="gap-2">
          <DialogTitle className="text-lg font-semibold">
            {t('secureMode.title')}
          </DialogTitle>
          <DialogDescription className="text-sm text-left leading-relaxed">
            {t('secureMode.description')}
          </DialogDescription>
        </DialogHeader>
        
        <DialogFooter className="flex justify-end pt-4">
          <Button
            onClick={onClose}
            className="w-full sm:w-auto text-sm font-medium px-4 py-2 h-9 shadow-sm"
          >
            {t('secureMode.understood')}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}