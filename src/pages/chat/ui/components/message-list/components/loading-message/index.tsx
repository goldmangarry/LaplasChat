import { useChatStore } from "@/core/chat/store";
import { useTranslation } from "react-i18next";
import { useModels } from "@/core/api/models/hooks";
import { usePendingMessages, usePendingSecureMessages } from "@/core/api/chat/hooks";
import type { SendMessageRequest } from "@/core/api/chat/types";

// Импорты иконок провайдеров
import AnthropicIcon from "@/assets/icons/anthropic.svg";
import DeepSeekIcon from "@/assets/icons/deepseek-color.svg";
import GoogleIcon from "@/assets/icons/google.svg";
import GrokIcon from "@/assets/icons/grok.svg";
import MetaIcon from "@/assets/icons/meta-color.svg";
import MistralIcon from "@/assets/icons/mistral-color.svg";
import OpenAIIcon from "@/assets/icons/openai.svg";
import PerplexityIcon from "@/assets/icons/perplexity.svg";
import QwenIcon from "@/assets/icons/qwen-color.svg";

// Получить иконку провайдера
const getProviderIcon = (provider: string) => {
  switch (provider) {
    case 'openai':
      return OpenAIIcon;
    case 'anthropic':
      return AnthropicIcon;
    case 'perplexity':
      return PerplexityIcon;
    case 'google':
      return GoogleIcon;
    case 'meta-llama':
      return MetaIcon;
    case 'mistralai':
      return MistralIcon;
    case 'deepseek':
      return DeepSeekIcon;
    case 'qwen':
      return QwenIcon;
    case 'grok':
      return GrokIcon;
    default:
      return null;
  }
};

// Получить фоллбэк текст для аватара
const getProviderFallback = (provider: string) => {
  switch (provider) {
    case 'openai':
      return 'OA';
    case 'anthropic':
      return 'AN';
    case 'perplexity':
      return 'PP';
    case 'google':
      return 'GO';
    case 'meta-llama':
      return 'ME';
    case 'mistralai':
      return 'MI';
    case 'deepseek':
      return 'DS';
    case 'qwen':
      return 'QW';
    case 'grok':
      return 'GR';
    default:
      return provider.substring(0, 2).toUpperCase();
  }
};

type LoadingMessageProps = {
  dialogId: string;
};

export const LoadingMessage = ({ dialogId }: LoadingMessageProps) => {
  const { t } = useTranslation();
  const { getCurrentSettings } = useChatStore();
  const settings = getCurrentSettings();

  // Получаем данные о доступных моделях
  const { data: modelsData } = useModels();
  const models = modelsData?.models || [];

  // Получаем pending запросы для этого диалога
  const pendingMessages = usePendingMessages(dialogId);
  const pendingSecureMessages = usePendingSecureMessages(dialogId);

  // Получаем первый pending запрос (если есть)
  const pendingRequest: SendMessageRequest | undefined = 
    pendingMessages[0] || pendingSecureMessages[0];

  // Находим модель по ID из pending запроса или используем текущие настройки
  const modelId = pendingRequest?.model || settings.model;
  const targetModel = models.find(model => model.id === modelId);

  const modelName = targetModel?.name || modelId;
  const provider = targetModel?.provider || settings.provider;

  // Получаем текущее время
  const currentTime = new Date().toLocaleTimeString('ru-RU', { hour: '2-digit', minute: '2-digit' });

  const ProviderIcon = getProviderIcon(provider);
  const providerFallback = getProviderFallback(provider);

  return (
    <div className="max-w-[100%] rounded-lg px-4 py-3 text-foreground min-w-0 break-words">
      {/* Хедер сообщения */}
      <div className="flex items-center gap-3 mb-3">
        <div className="flex items-center gap-2">
          {/* Аватар провайдера */}
          <div className="w-8 h-8 rounded-full flex items-center justify-center overflow-hidden">
            {ProviderIcon ? (
              <img 
                src={ProviderIcon} 
                alt={provider}
                className="w-8 h-8 object-contain"
              />
            ) : (
              <span className="text-xs font-medium text-stone-600">
                {providerFallback}
              </span>
            )}
          </div>
          
          {/* Название модели */}
          <span className="text-base font-medium text-stone-600">
            {modelName}
          </span>
        </div>
        
        {/* Разделитель */}
        <div className="w-px h-5 bg-stone-200"></div>
        
        {/* Время */}
        <span className="text-base text-stone-600">
          {currentTime}
        </span>
      </div>
      
      {/* Лоадер с анимацией */}
      <div className="flex items-center space-x-1">
        <div className="flex space-x-1">
          <div className="w-2 h-2 bg-current rounded-full animate-bounce"></div>
          <div className="w-2 h-2 bg-current rounded-full animate-bounce" style={{animationDelay: '0.1s'}}></div>
          <div className="w-2 h-2 bg-current rounded-full animate-bounce" style={{animationDelay: '0.2s'}}></div>
        </div>
        <span className="text-sm text-muted-foreground ml-2">
          {t('chat.typing')}
        </span>
      </div>
    </div>
  );
};