import { useState, useCallback, useEffect } from "react";
import { useTranslation } from "react-i18next";
import { Info, ChevronDown, Check, Loader2, AlertCircle, Cpu, ExternalLink } from "lucide-react";
import type { SecureToggleProps } from "./types";
import { Switch } from "@/components/animate-ui/radix/switch";
import { Tooltip, TooltipContent, TooltipTrigger } from "@/components/ui/tooltip";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
  DialogFooter,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { useApiKeyStore, DEFAULT_ANONYMIZE_PROMPT } from "@/core/api-key";
import { checkOllamaHealth, listOllamaModels } from "@/core/ollama";
import type { OllamaModel } from "@/core/ollama/types";
import { useOllamaModalStore } from "@/core/ollama/modal-store";

export function SecureToggle({ isSecure, onToggle, disabled = false }: SecureToggleProps) {
  const { t } = useTranslation();
  const { open: openOllamaModal } = useOllamaModalStore();
  const { ollamaModel, setOllamaModel, anonymizePrompt, setAnonymizePrompt } = useApiKeyStore();

  const [popoverOpen, setPopoverOpen] = useState(false);
  const [installedModels, setInstalledModels] = useState<OllamaModel[]>([]);
  const [ollamaConnected, setOllamaConnected] = useState(false);
  const [loading, setLoading] = useState(false);
  const [ready, setReady] = useState(false);

  const [promptDialogOpen, setPromptDialogOpen] = useState(false);
  const [editedPrompt, setEditedPrompt] = useState("");

  const loadModels = useCallback(async () => {
    try {
      const healthy = await checkOllamaHealth();
      setOllamaConnected(healthy);
      if (healthy) {
        const models = await listOllamaModels();
        setInstalledModels(models);
        if (models.length > 0) {
          const isInstalled = models.some((m) => m.name === ollamaModel);
          if (!isInstalled) {
            setOllamaModel(models[0].name);
          }
        }
      }
    } catch {
      setOllamaConnected(false);
    } finally {
      setReady(true);
    }
  }, [ollamaModel, setOllamaModel]);

  // Load installed models on mount and auto-correct stored model
  useEffect(() => {
    loadModels();
  }, []); // eslint-disable-line react-hooks/exhaustive-deps

  const handleToggle = () => {
    if (!disabled) {
      onToggle(!isSecure);
    }
  };

  const handleOpenPopover = useCallback(async (e: React.MouseEvent) => {
    e.stopPropagation();
    setPopoverOpen(true);
    setLoading(true);
    try {
      const healthy = await checkOllamaHealth();
      setOllamaConnected(healthy);
      if (healthy) {
        const models = await listOllamaModels();
        setInstalledModels(models);
        const isInstalled = models.some((m) => m.name === ollamaModel);
        if (!isInstalled && models.length > 0) {
          setOllamaModel(models[0].name);
        }
      }
    } catch {
      setOllamaConnected(false);
    } finally {
      setLoading(false);
    }
  }, [ollamaModel, setOllamaModel]);

  const handleOpenPromptDialog = (e: React.MouseEvent) => {
    e.stopPropagation();
    setEditedPrompt(anonymizePrompt);
    setPromptDialogOpen(true);
  };

  const handleSavePrompt = () => {
    setAnonymizePrompt(editedPrompt);
    setPromptDialogOpen(false);
  };

  const currentModel = ollamaModel;
  const isModelInstalled = installedModels.some((m) => m.name === currentModel);

  const modelLabel = !ready
    ? "..."
    : !ollamaConnected
      ? t('ollama.notDetected')
      : currentModel || t('chatInput.noModelsInstalled');

  return (
    <>
      <div
        className={`flex items-center gap-2 px-3 rounded-xl h-10 transition-all border ${
          isSecure
            ? "bg-[#f0eeff] dark:bg-[#6c56f0]/15 border-[#6c56f0]/40 shadow-sm"
            : "bg-background border-border"
        }`}
      >
        <Switch checked={isSecure} onCheckedChange={handleToggle} />

        <button
          type="button"
          onClick={handleOpenPromptDialog}
          className={`text-sm font-medium select-none whitespace-nowrap transition-opacity hover:opacity-70 ${
            isSecure ? "text-[#6c56f0] dark:text-[#a78bfa]" : "text-foreground"
          }`}
        >
          {t('chatInput.secureMode')}
        </button>

        {/* Divider */}
        <div className={`w-px h-4 shrink-0 ${isSecure ? "bg-[#6c56f0]/30" : "bg-border"}`} />

        {/* Model Selector Chip */}
        <Popover open={popoverOpen} onOpenChange={setPopoverOpen}>
          <PopoverTrigger asChild>
            <button
              type="button"
              onClick={handleOpenPopover}
              className={`flex items-center gap-1.5 px-2 py-1 rounded-lg text-xs font-medium transition-colors ${
                !ready || !ollamaConnected
                  ? "text-muted-foreground hover:text-foreground"
                  : isModelInstalled
                    ? isSecure
                      ? "text-[#6c56f0] dark:text-[#a78bfa] hover:bg-[#6c56f0]/10"
                      : "text-muted-foreground hover:text-foreground hover:bg-muted"
                    : "text-destructive hover:bg-destructive/10"
              }`}
            >
              <Cpu className="w-3 h-3 shrink-0" />
              <span className="max-w-[96px] truncate">{modelLabel}</span>
              <ChevronDown className="w-3 h-3 shrink-0 opacity-60" />
            </button>
          </PopoverTrigger>
          <PopoverContent
            className="w-60 p-1.5"
            align="start"
            sideOffset={8}
            onClick={(e) => e.stopPropagation()}
          >
            <p className="text-xs font-semibold text-muted-foreground px-2 py-1.5">
              {t('chatInput.selectAnonymizationModel')}
            </p>
            {loading ? (
              <div className="flex items-center gap-2 px-2 py-3 text-sm text-muted-foreground">
                <Loader2 className="w-4 h-4 animate-spin" />
                <span>{t('common.loading')}</span>
              </div>
            ) : !ollamaConnected ? (
              <div className="flex items-center gap-2 px-2 py-3 text-sm text-destructive">
                <AlertCircle className="w-4 h-4 shrink-0" />
                <span>{t('ollama.notDetected')}</span>
              </div>
            ) : installedModels.length === 0 ? (
              <p className="px-2 py-3 text-sm text-muted-foreground">
                {t('chatInput.noModelsInstalled')}
              </p>
            ) : (
              <div className="flex flex-col gap-0.5">
                {installedModels.map((model) => (
                  <button
                    key={model.name}
                    type="button"
                    onClick={(e) => {
                      e.stopPropagation();
                      setOllamaModel(model.name);
                      setPopoverOpen(false);
                    }}
                    className={`flex items-center justify-between w-full px-2 py-2 rounded-md text-sm text-left transition-colors hover:bg-muted ${
                      currentModel === model.name ? "bg-muted" : ""
                    }`}
                  >
                    <div className="flex items-center gap-2 min-w-0">
                      <Cpu className="w-3.5 h-3.5 shrink-0 text-muted-foreground" />
                      <span className="font-medium truncate">{model.name}</span>
                    </div>
                    {currentModel === model.name && (
                      <Check className="w-4 h-4 shrink-0 text-[#6c56f0]" />
                    )}
                  </button>
                ))}
              </div>
            )}
            <div className="border-t border-border mt-1 pt-1">
              <button
                type="button"
                onClick={(e) => {
                  e.stopPropagation();
                  setPopoverOpen(false);
                  openOllamaModal();
                }}
                className="flex items-center gap-1.5 w-full px-2 py-1.5 text-xs text-muted-foreground hover:text-foreground transition-colors rounded-md hover:bg-muted"
              >
                <ExternalLink className="w-3 h-3 shrink-0" />
                <span>{t('ollama.installMoreModels')}</span>
              </button>
            </div>
          </PopoverContent>
        </Popover>

        {/* Info */}
        <Tooltip>
          <TooltipTrigger asChild>
            <Info
              onClick={(e) => e.stopPropagation()}
              className="w-4 h-4 shrink-0 text-muted-foreground opacity-40 cursor-help"
            />
          </TooltipTrigger>
          <TooltipContent className="max-w-xs">
            <p>{t('chatInput.secureModeTooltip')}</p>
          </TooltipContent>
        </Tooltip>
      </div>

      {/* Anonymization Prompt Editor */}
      <Dialog open={promptDialogOpen} onOpenChange={setPromptDialogOpen}>
        <DialogContent className="max-w-xl">
          <DialogHeader>
            <DialogTitle>{t('secureMode.editPromptTitle')}</DialogTitle>
            <DialogDescription>
              {t('secureMode.editPromptDescription')}
            </DialogDescription>
          </DialogHeader>
          <textarea
            value={editedPrompt}
            onChange={(e) => setEditedPrompt(e.target.value)}
            className="w-full h-64 p-3 text-xs font-mono bg-muted/40 border border-border rounded-md resize-y outline-none focus:ring-1 focus:ring-ring"
            spellCheck={false}
          />
          <DialogFooter className="flex-row items-center justify-between gap-2 sm:justify-between">
            <Button
              variant="ghost"
              size="sm"
              onClick={() => setEditedPrompt(DEFAULT_ANONYMIZE_PROMPT)}
            >
              {t('secureMode.editPromptReset')}
            </Button>
            <div className="flex gap-2">
              <Button variant="outline" size="sm" onClick={() => setPromptDialogOpen(false)}>
                {t('secureMode.editPromptCancel')}
              </Button>
              <Button size="sm" onClick={handleSavePrompt}>
                {t('secureMode.editPromptSave')}
              </Button>
            </div>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </>
  );
}
