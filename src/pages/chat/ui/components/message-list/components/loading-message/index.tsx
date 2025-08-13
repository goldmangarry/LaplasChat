import { useState, useEffect } from "react";
import { useChatStore } from "@/core/chat/store";
import { useModels } from "@/core/api/models/hooks";
import { usePendingMessages, usePendingSecureMessages } from "@/core/api/chat/hooks";
import { getDisplayModelId } from "@/shared/lib/model-utils";
import type { SendMessageRequest } from "@/core/api/chat/types";
import { AnimatedShinyText } from "@/components/magicui/animated-shiny-text";

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

// Текстовки для обычных сообщений (смена каждые 5 секунд)
const NORMAL_LOADING_TEXTS = [
  'Генерирую ответ...',
  'Думаю...',
  'Обрабатываю запрос...',
  'Пишу для вас...',
  'Формулирую ответ...',
];

// Текстовки для secure сообщений (смена каждые 10 секунд)
const SECURE_LOADING_TEXTS = [
  'Сканирую на уязвимости...',
  'Шифрую запрос...', 
  'Отправляю запрос к внешней ИИ модели...',
  'Ожидаю ответ от ИИ модели...',
  'Расшифровываю ответ...',
  'Готовлю ответ...',
];

type LoadingMessageProps = {
  dialogId: string;
};

export const LoadingMessage = ({ dialogId }: LoadingMessageProps) => {
  const { getCurrentSettings } = useChatStore();
  const settings = getCurrentSettings();
  const [currentTextIndex, setCurrentTextIndex] = useState(0);

  // Получаем данные о доступных моделях
  const { data: modelsData } = useModels();
  const models = modelsData?.models || [];

  // Получаем pending запросы для этого диалога
  const pendingMessages = usePendingMessages(dialogId);
  const pendingSecureMessages = usePendingSecureMessages(dialogId);

  // Определяем, является ли это secure сообщением
  const isSecure = pendingSecureMessages.length > 0;

  // Получаем первый pending запрос (если есть)
  const pendingRequest: SendMessageRequest | undefined = 
    pendingMessages[0] || pendingSecureMessages[0];

  // Находим модель по ID из pending запроса или используем текущие настройки
  const modelId = pendingRequest?.model || settings.model;
  const displayModelId = getDisplayModelId(modelId);
  const targetModel = models.find(model => model.id === displayModelId);

  const modelName = targetModel?.name || displayModelId;
  const provider = targetModel?.provider || settings.provider;

  // Получаем текущее время
  const currentTime = new Date().toLocaleTimeString('ru-RU', { hour: '2-digit', minute: '2-digit' });

  const ProviderIcon = getProviderIcon(provider);
  const providerFallback = getProviderFallback(provider);

  // Выбираем соответствующий массив текстовок и интервал
  const loadingTexts = isSecure ? SECURE_LOADING_TEXTS : NORMAL_LOADING_TEXTS;
  const intervalTime = isSecure ? 10000 : 5000; // 10 сек для secure, 5 сек для обычных

  // Логика смены текстовок по таймеру
  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentTextIndex((prevIndex) => (prevIndex + 1) % loadingTexts.length);
    }, intervalTime);

    return () => clearInterval(interval);
  }, [loadingTexts.length, intervalTime]);

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
      
      {/* Анимированный текст лоадера */}
      <div className="flex justify-start">
        <AnimatedShinyText className="text-sm ml-0">
          {loadingTexts[currentTextIndex]}
        </AnimatedShinyText>
      </div>
    </div>
  );
};