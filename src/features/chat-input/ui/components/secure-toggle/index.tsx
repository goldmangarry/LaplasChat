import { useTranslation } from "react-i18next";
import { Info } from "lucide-react";
import type { SecureToggleProps } from "./types";
import { Switch } from "@/components/animate-ui/radix/switch";
import { Label } from "@/components/ui/label";
import { Tooltip, TooltipContent, TooltipTrigger } from "@/components/ui/tooltip";

export function SecureToggle({ isSecure, onToggle, disabled = false }: SecureToggleProps) {
  const { t } = useTranslation();
  
  const handleToggle = () => {
    if (!disabled) {
      onToggle(!isSecure);
    }
  };

  return (
    <div onClick={handleToggle} className="flex cursor-pointer items-center gap-3 p-2 bg-background border border-border rounded-lg shadow-sm h-10 hover:bg-muted transition-colors">
      {/* Toggle Switch */}
      <Switch checked={isSecure} onCheckedChange={handleToggle} />
      <Label className="cursor-pointer">{t('chatInput.secureMode')}</Label>
      {/* Info Icon with Tooltip */}
      <Tooltip>
        <TooltipTrigger asChild>
          <Info onClick={(e) => e.stopPropagation()} className="w-4 h-4 text-muted-foreground opacity-50 cursor-help" />
        </TooltipTrigger>
        <TooltipContent className="max-w-xs">
          <p>{t('chatInput.secureModeTooltip')}</p>
        </TooltipContent>
      </Tooltip>
    </div>
  );
}