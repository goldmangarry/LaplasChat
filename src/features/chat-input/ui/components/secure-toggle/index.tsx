import { useTranslation } from "react-i18next";
import { Info } from "lucide-react";
import type { SecureToggleProps } from "./types";
import { Switch } from "@/components/animate-ui/radix/switch";
import { Label } from "@/components/ui/label";

export function SecureToggle({ isSecure, onToggle, disabled = false }: SecureToggleProps) {
  const { t } = useTranslation();
  
  const handleToggle = () => {
    if (!disabled) {
      onToggle(!isSecure);
    }
  };

  return (
    <div className="flex items-center gap-3 p-2 bg-white border border-gray-200 rounded-lg shadow-sm h-10">
      {/* Toggle Switch */}
      <Switch checked={isSecure} onCheckedChange={handleToggle} />
      <Label>{t('chatInput.secureMode')}</Label>
      {/* Info Icon */}
      <Info className="w-4 h-4 text-stone-800 opacity-50" />
    </div>
  );
}