import { ChevronsUpDown } from "lucide-react";
import { useState } from "react";
import { useTranslation } from "react-i18next";

import { cn } from "@/components/lib/utils";
import { Button } from "@/components/ui/button";
import {
  Command,
  CommandList,
} from "@/components/ui/command";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import {
  Drawer,
  DrawerContent,
} from "@/components/ui/drawer";
import { ProviderIcon } from "@/components/shared/provider-icon";
import { useModels } from "@/core/api/models/hooks";
import { getDisplayModelId } from "@/shared/lib/model-utils";
import { useIsMobile } from "@/components/hooks/use-mobile";
import type { ModelSelectorProps } from "../../../types";
import type { ModelProvider } from "@/core/api/models/types";


// Компонент одной модели
type ModelItemProps = {
  model: {
    id: string;
    name: string;
    provider: ModelProvider;
  };
  isSelected: boolean;
  onClick: () => void;
};

const ModelItem = ({ model, isSelected, onClick }: ModelItemProps) => {
  const { t } = useTranslation();
  const description = t(`modelDescriptions.${model.id}`, t("modelDescriptions.unavailable"));
  
  return (
    <button
      className={cn(
        "w-full text-left p-2 rounded-md transition-colors border-0 bg-transparent",
        "hover:bg-muted focus:outline-none",
        isSelected && "bg-muted"
      )}
      onClick={onClick}
    >
      <div className="space-y-1">
        <div className="flex items-center">
          <span className={cn(
            "font-medium text-sm truncate",
            isSelected ? "text-foreground" : "text-foreground"
          )}>
            {model.name}
          </span>
        </div>
        {/* Описание модели */}
        <p className="text-xs text-muted-foreground leading-relaxed">
          {description}
        </p>
      </div>
    </button>
  );
};

// Компонент блока провайдера
type ProviderBlockProps = {
  provider: ModelProvider;
  models: Array<{
    id: string;
    name: string;
    provider: ModelProvider;
  }>;
  selectedModel: string;
  onModelChange: (model: string, provider: ModelProvider) => void;
};

const ProviderBlock = ({ provider, models, selectedModel, onModelChange }: ProviderBlockProps) => {
  const { t } = useTranslation();
  const displaySelectedModel = getDisplayModelId(selectedModel);
  return (
    <div className="space-y-2">
      {/* Заголовок провайдера */}
      <div className="flex items-center gap-2 px-1 py-1">
        <div className="w-6 h-6 rounded-full overflow-hidden flex items-center justify-center">
          <ProviderIcon provider={provider} className="w-6 h-6" />
        </div>
        <span className="font-medium text-sm text-foreground">
          {t(`providers.${provider}`, provider)}
        </span>
      </div>
      
      {/* Модели провайдера */}
      <div className="space-y-1">
        {models.map((model) => (
          <ModelItem
            key={model.id}
            model={model}
            isSelected={displaySelectedModel === model.id}
            onClick={() => onModelChange(model.id, model.provider)}
          />
        ))}
      </div>
    </div>
  );
};
 
export const ModelSelector = ({ 
  selectedModel, 
  selectedProvider, 
  onModelChange 
}: ModelSelectorProps) => {
  const [open, setOpen] = useState(false);
  const { data: modelsData, isLoading } = useModels();
  const isMobile = useIsMobile();
  
  const models = modelsData?.models || [];
  const displayModelId = getDisplayModelId(selectedModel);
  const selectedModelData = models.find(model => model.id === displayModelId);
  
  // Группировка моделей по провайдерам
  const modelsByProvider = models.reduce((acc, model) => {
    if (!acc[model.provider]) {
      acc[model.provider] = [];
    }
    acc[model.provider].push(model);
    return acc;
  }, {} as Record<ModelProvider, typeof models>);

  const providerEntries = Object.entries(modelsByProvider);
  
  // Для мобильных - одна колонка, для десктопа - две колонки
  const leftColumnProviders = isMobile 
    ? [] 
    : providerEntries.filter(([provider]) => 
        ['openai', 'anthropic', 'perplexity'].includes(provider)
      );
  
  const rightColumnProviders = isMobile 
    ? providerEntries // Все провайдеры в одну колонку
    : providerEntries.filter(([provider]) => 
        !['openai', 'anthropic', 'perplexity'].includes(provider)
      );
  
  const handleModelSelect = (modelId: string, provider: ModelProvider) => {
    if (selectedModel !== modelId) {
      onModelChange(modelId, provider);
    }
    setOpen(false);
  };

  const triggerButton = (
    <Button
      variant="outline"
      role="combobox"
      aria-expanded={open}
      className="w-[250px] sm:w-[300px] justify-between"
      disabled={isLoading}
      onClick={() => setOpen(true)}
    >
      <div className="flex items-center gap-2">
        <ProviderIcon provider={selectedProvider} className="w-4 h-4" />
        <span className="truncate">
          {selectedModelData?.name || displayModelId}
        </span>
      </div>
      <ChevronsUpDown className="ml-2 h-4 w-4 opacity-50" />
    </Button>
  );

  const content = (
    <Command className="border-none p-0" shouldFilter={false}>
      <CommandList className="max-h-[600px] overflow-y-auto" tabIndex={-1}>
        <div className={cn(
          isMobile ? "space-y-4" : "grid grid-cols-2 gap-3"
        )}>
          {!isMobile && (
            <div className="space-y-4">
              {leftColumnProviders.map(([provider, providerModels]) => (
                <ProviderBlock
                  key={provider}
                  provider={provider as ModelProvider}
                  models={providerModels}
                  selectedModel={selectedModel}
                  onModelChange={handleModelSelect}
                />
              ))}
            </div>
          )}
          
          <div className="space-y-4">
            {rightColumnProviders.map(([provider, providerModels]) => (
              <ProviderBlock
                key={provider}
                provider={provider as ModelProvider}
                models={providerModels}
                selectedModel={selectedModel}
                onModelChange={handleModelSelect}
              />
            ))}
          </div>
        </div>
      </CommandList>
    </Command>
  );
  
  if (isMobile) {
    return (
      <Drawer open={open} onOpenChange={setOpen}>
        {triggerButton}
        <DrawerContent className="max-h-[80vh]">
          <div className="px-4 pt-4 pb-4">
            {content}
          </div>
        </DrawerContent>
      </Drawer>
    );
  }

  return (
    <Popover open={open} onOpenChange={setOpen}>
      <PopoverTrigger asChild>
        {triggerButton}
      </PopoverTrigger>
      <PopoverContent className="w-[680px] p-3" align="start">
        {content}
      </PopoverContent>
    </Popover>
  );
};