import { ChevronsUpDown } from "lucide-react";
import { useState } from "react";

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
import { ProviderIcon } from "@/components/shared/provider-icon";
import { useModels } from "@/core/api/models/hooks";
import { getDisplayModelId } from "@/shared/lib/model-utils";
import type { ModelSelectorProps } from "../../../types";
import type { ModelProvider } from "@/core/api/models/types";

// Мапа переводов названий провайдеров
const providerLabels: Record<ModelProvider, string> = {
  openai: "Open AI",
  anthropic: "Anthropic",
  perplexity: "Perplexity",
  google: "Google",
  "meta-llama": "Meta",
  mistralai: "Mistral",
  deepseek: "DeepSeek",
  qwen: "Qwen",
  grok: "Grok",
};

// Мапа описаний моделей согласно предоставленной таблице
const modelDescriptions: Record<string, string> = {
  // OpenAI модели
  "openai/gpt-5-chat": "Превосходна для самых сложных задач в бизнесе; работает с многоступенчатыми процессами и глубоким анализом; справляется с комплексным решением проблем компании.",
  "openai/gpt-5-mini": "Оптимальна для быстрых решений в высоконагруженных системах; работает с потоковой обработкой и мгновенными ответами; справляется с массовыми запросами в реальном времени.",
  "openai/gpt-4o": "Уместна для повседневных задач в бизнесе; работает с текстом и изображениями; справляется с точными ответами в процессах компании.",
  "openai/gpt-4o-mini": "Хороша для массовых чатов и ботов; работает быстро при высокой нагрузке; справляется с типовыми запросами.",
  "openai/gpt-4-turbo": "Эффективна для стабильных сервисов; работает с шаблонами и формами; справляется с автоматизацией рутин.",
  
  // Anthropic модели
  "anthropic/claude-sonnet-4": "Пригодна для длинных документов и четких выводов; работает с договорами и правилами; справляется с аккуратным суммированием.",
  "anthropic/claude-opus-4": "Оптимальна для сложной аналитики и материалов для руководства; работает с разнородными материалами; справляется, когда нужна высокая точность.",
  "anthropic/claude-3.5-haiku": "Полезна для быстрых черновиков и вариантов текстов; работает с короткими запросами; справляется там, где важна скорость.",
  
  // Perplexity модели
  "perplexity/sonar": "Идеальна для поиска актуальной информации в интернете; работает с реальными данными и свежими новостями; справляется с быстрым анализом текущих событий.",
  "perplexity/sonar-deep-research": "Превосходна для глубокого исследовательского анализа; работает с множественными источниками и детальной проверкой; справляется с комплексными исследовательскими задачами.",
  
  // Google модели
  "google/gemini-2.5-pro": "Рекомендуется для больших наборов файлов; работает с текстом, таблицами и медиа; справляется с анализом презентаций и записей встреч.",
  "google/gemini-2.5-flash": "Удобна для потоковых задач; работает с классификацией, тегами и типовыми ответами; справляется в реальном времени.",
  
  // Meta модели
  "meta-llama/llama-4-maverick": "Целесообразна для обработки целых документов; работает с большими объемами текста; справляется с настройкой под задачи компании.",
  "meta-llama/llama-3.3-70b-instruct": "Предпочтительна для работы на собственных серверах; работает с внутренними данными; справляется с адаптацией под лексику и правила компании.",
  
  // Mistral модели
  "mistralai/mistral-small-3.2-24b-instruct": "Практична для ограниченных ресурсов; работает быстро на обычных серверах; справляется со стандартными офисными задачами.",
  
  // DeepSeek модели
  "deepseek/deepseek-chat-v3-0324": "Рекомендуется для инженерных задач; работает с кодом и вычислениями; справляется с автотестами и расчетами.",
  "deepseek/deepseek-r1:free": "Идеальна для экспериментов и пилотов; работает с задачами, где нужно подробное рассуждение; справляется с быстрой проверкой гипотез.",
  "deepseek/deepseek-r1": "Оптимальна для важной нагрузки; работает стабильно при длинных рассуждениях; справляется, когда нужен предсказуемый результат.",
  "deepseek/deepseek-chat-v3-0324:free": "Хороша для прототипов поддержки и FAQ; работает в базовом режиме; справляется с типовыми вопросами клиентов.",
  
  // Qwen модели
  "qwen/qwen3-coder": "Пригодна для разработки; работает с большими проектами кода; справляется с чисткой кода, обновлениями и примерами.",
};

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
  const description = modelDescriptions[model.id] || "Описание недоступно";
  
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
  const displaySelectedModel = getDisplayModelId(selectedModel);
  return (
    <div className="space-y-2">
      {/* Заголовок провайдера */}
      <div className="flex items-center gap-2 px-1 py-1">
        <div className="w-6 h-6 rounded-full overflow-hidden flex items-center justify-center">
          <ProviderIcon provider={provider} className="w-6 h-6" />
        </div>
        <span className="font-medium text-sm text-foreground">
          {providerLabels[provider] || provider}
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

  // Разделение на две колонки с явным размещением провайдеров
  const providerEntries = Object.entries(modelsByProvider);
  
  // Левая колонка: OpenAI, Anthropic, Perplexity
  const leftColumnProviders = providerEntries.filter(([provider]) => 
    ['openai', 'anthropic', 'perplexity'].includes(provider)
  );
  
  // Правая колонка: все остальные (включая Google)
  const rightColumnProviders = providerEntries.filter(([provider]) => 
    !['openai', 'anthropic', 'perplexity'].includes(provider)
  );
  
  const handleModelSelect = (modelId: string, provider: ModelProvider) => {
    if (selectedModel !== modelId) {
      onModelChange(modelId, provider);
    }
    setOpen(false);
  };
  
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
              {selectedModelData?.name || displayModelId}
            </span>
          </div>
          <ChevronsUpDown className="ml-2 h-4 w-4 opacity-50" />
        </Button>
      </PopoverTrigger>
      <PopoverContent className="w-[680px] p-3" align="start">
        <Command className="border-none p-0" shouldFilter={false}>
          <CommandList className="max-h-[600px] overflow-y-auto" tabIndex={-1}>
            <div className="grid grid-cols-2 gap-3">
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
      </PopoverContent>
    </Popover>
  );
};