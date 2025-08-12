import { Check, ChevronsUpDown } from "lucide-react";
import { useTranslation } from "react-i18next";

import { cn } from "@/components/lib/utils";
import { Button } from "@/components/ui/button";
import {
  Command,
  CommandEmpty,
  CommandGroup,
  CommandInput,
  CommandItem,
  CommandList,
} from "@/components/ui/command";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { ProviderIcon } from "@/components/shared/provider-icon";
import { useModels } from "@/core/api/models/hooks";
import type { ModelSelectorProps } from "../../../types";
import { useState } from "react";
 
export const ModelSelector = ({ 
  selectedModel, 
  selectedProvider, 
  onModelChange 
}: ModelSelectorProps) => {
  const [open, setOpen] = useState(false);
  const { t } = useTranslation();
  const { data: modelsData, isLoading } = useModels();
  
  const models = modelsData?.models || [];
  
  const selectedModelData = models.find(model => model.id === selectedModel);
  
  return (
    <Popover open={open} onOpenChange={setOpen}>
      <PopoverTrigger asChild>
        <Button
          variant="outline"
          role="combobox"
          aria-expanded={open}
          className="w-[300px] justify-between"
          disabled={isLoading}
        >
          <div className="flex items-center gap-2">
            <ProviderIcon provider={selectedProvider} className="w-4 h-4" />
            <span className="truncate">
              {selectedModelData?.name || selectedModel}
            </span>
          </div>
          <ChevronsUpDown className="ml-2 h-4 w-4 opacity-50" />
        </Button>
      </PopoverTrigger>
      <PopoverContent className="w-[300px] p-0">
        <Command>
          <CommandInput 
            placeholder={t('chatHeader.searchModel')} 
            className="h-9" 
          />
          <CommandList>
            <CommandEmpty>{t('chatHeader.noModelFound')}</CommandEmpty>
            <CommandGroup>
              {models.map((model) => (
                <CommandItem
                  key={model.id}
                  value={model.id}
                  onSelect={(currentValue) => {
                    if (currentValue !== selectedModel) {
                      onModelChange(currentValue, model.provider);
                    }
                    setOpen(false);
                  }}
                >
                  <div className="flex items-center gap-2 flex-1">
                    <ProviderIcon provider={model.provider} className="w-4 h-4" />
                    <span className="truncate">{model.name}</span>
                  </div>
                  <Check
                    className={cn(
                      "ml-auto h-4 w-4",
                      selectedModel === model.id ? "opacity-100" : "opacity-0"
                    )}
                  />
                </CommandItem>
              ))}
            </CommandGroup>
          </CommandList>
        </Command>
      </PopoverContent>
    </Popover>
  );
};