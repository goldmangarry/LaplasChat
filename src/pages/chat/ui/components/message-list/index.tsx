import { useRef, useEffect } from "react";
import { useChatMessages, usePendingMessages, usePendingSecureMessages } from "@/core/api/chat/hooks";
import { useTranslation } from "react-i18next";
import { UserMessage } from "./components/user-message";
import { AssistantMessage } from "./components/assistant-message";
import { LoadingMessage } from "./components/loading-message";

type MessageListProps = {
  dialogId: string;
  onFactCheck: (message: string) => void;
};

export const MessageList = ({ dialogId, onFactCheck }: MessageListProps) => {
  const { t } = useTranslation();
  const loadingRef = useRef<HTMLDivElement>(null);
  const messagesRefs = useRef<{ [key: string]: HTMLDivElement | null }>({});
  const containerRef = useRef<HTMLDivElement>(null);
  const isFirstRender = useRef(true);
  const prevMessagesLength = useRef(0);
  
  // Получаем сообщения из React Query кеша
  const { 
    data: chatMessagesData, 
    error: messagesError,
    isLoading: isLoadingMessages,
    isFetching: isFetchingMessages
  } = useChatMessages(dialogId);

  // Получаем pending мутации для отображения оптимистичных обновлений
  const pendingMessages = usePendingMessages(dialogId);
  const pendingSecureMessages = usePendingSecureMessages(dialogId);
  
  const hasPendingMessage = pendingMessages.length > 0 || pendingSecureMessages.length > 0;
  
  const messages = chatMessagesData?.messages || [];
  
  // Показываем loader если есть pending мутации или идет фоновое обновление данных
  // НО только если у нас уже есть сообщения (чтобы не показывать loader при первой загрузке)
  const shouldShowLoader = hasPendingMessage || (isFetchingMessages && messages.length > 0);

  // Скролл к loader при его появлении
  useEffect(() => {
    if (shouldShowLoader && loadingRef.current) {
      loadingRef.current.scrollIntoView({ 
        behavior: 'smooth', 
        block: 'start'
      });
    }
  }, [shouldShowLoader]);

  // Скролл вниз при первом появлении сообщений
  useEffect(() => {
    if (messages.length > 0 && isFirstRender.current && containerRef.current) {
      containerRef.current.scrollTop = containerRef.current.scrollHeight;
      isFirstRender.current = false;
      prevMessagesLength.current = messages.length;
    }
  }, [messages.length > 0]);

  // Скролл к новому сообщению ИИ при его появлении (только когда добавляется новое сообщение)
  useEffect(() => {
    // Проверяем, что это не первая загрузка и добавилось новое сообщение
    if (isFirstRender.current || messages.length <= prevMessagesLength.current) {
      prevMessagesLength.current = messages.length;
      return;
    }
    
    // Найдем последнее сообщение от ассистента
    const lastMessage = messages[messages.length - 1];
    if (lastMessage?.role === 'assistant') {
      const messageRef = messagesRefs.current[lastMessage.id || `message-${messages.length - 1}`];
      if (messageRef) {
        messageRef.scrollIntoView({ 
          behavior: 'smooth', 
          block: 'start'
        });
      }
    }
    
    prevMessagesLength.current = messages.length;
  }, [messages]);

  if (messagesError) {
    return (
      <div className="flex h-full items-center justify-center">
        <div className="text-center">
          <p className="text-destructive">{t('chat.errorLoadingMessages')}</p>
          <p className="text-sm text-muted-foreground mt-2">{messagesError.message}</p>
        </div>
      </div>
    );
  }

  if (isLoadingMessages && messages.length === 0) {
    return (
      <div className="flex h-full items-center justify-center">
        <div className="text-center">
        </div>
      </div>
    );
  }

  return (
    <div ref={containerRef} className="flex flex-col space-y-4 h-full overflow-y-auto sm:px-4 sm:py-4">
      {/* Сообщения из кеша (включая оптимистичные) */}
      {messages.map((message, index) => {
        const messageKey = message.id || `message-${index}`;
        return (
          <div
            key={messageKey}
            ref={(el) => {
              if (message.role === "assistant") {
                messagesRefs.current[messageKey] = el;
              }
            }}
            className={`flex ${
              message.role === "user" ? "justify-end" : "justify-start"
            }`}
          >
            {message.role === "user" ? (
              <UserMessage message={message} />
            ) : (
              <AssistantMessage 
                message={message} 
                onFactCheck={onFactCheck}
              />
            )}
          </div>
        );
      })}
      
      {/* Loader для pending мутаций и фоновых запросов */}
      {shouldShowLoader && (
        <div ref={loadingRef} className="flex justify-start">
          <LoadingMessage dialogId={dialogId} />
        </div>
      )}
    </div>
  );
};