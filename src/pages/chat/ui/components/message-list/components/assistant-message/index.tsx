import { useChatStore } from "@/core/chat/store";
import type { ChatMessage } from "@/core/api/chat/types";
import { MessageFooter } from "./components/message-footer";

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
import MarkdownRenderer from "@/components/ui/markdown-renderer";

type AssistantMessageProps = {
  message: ChatMessage;
  onFactCheck: (message: string) => void;
};

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

export const AssistantMessage = ({ message, onFactCheck }: AssistantMessageProps) => {
  const { getCurrentSettings } = useChatStore();
  const settings = getCurrentSettings();

  // Получаем данные модели из сообщения или из настроек как fallback
  const modelInfo = message.last_model_info;
  const modelName = modelInfo?.name || `${settings.provider}: ${settings.model}`;
  const provider = modelInfo?.provider || settings.provider;

  // Получаем время сообщения из created_at
  const messageTime = message.created_at 
    ? new Date(message.created_at).toLocaleTimeString('ru-RU', { hour: '2-digit', minute: '2-digit' })
    : message.timestamp 
    ? new Date(message.timestamp).toLocaleTimeString('ru-RU', { hour: '2-digit', minute: '2-digit' })
    : '';

  const ProviderIcon = getProviderIcon(provider);
  const providerFallback = getProviderFallback(provider);

  // Обработчики для кнопок футера
  const handleCopy = () => {
    navigator.clipboard.writeText(message.content);
  };

  const handleFactCheck = () => {
    onFactCheck(message.content);
  };

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
        
        {messageTime && (
          <>
            {/* Разделитель */}
            <div className="w-px h-5 bg-stone-200"></div>
            
            {/* Время */}
            <span className="text-base text-stone-600">
              {messageTime}
            </span>
          </>
        )}
      </div>
      
      {/* Содержимое сообщения */}
      <MarkdownRenderer>{message.content}</MarkdownRenderer>
      
      {/* Отступ 16px перед футером */}
      <div className="mt-4">
        <MessageFooter 
          onCopy={handleCopy}
          onFactCheck={handleFactCheck}
        />
      </div>
    </div>
  );
};