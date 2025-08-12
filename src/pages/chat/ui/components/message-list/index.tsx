import { useChatMessages, usePendingMessages, usePendingSecureMessages } from "@/core/api/chat/hooks";
import { useTranslation } from "react-i18next";
import { UserMessage } from "./components/user-message";
import { AssistantMessage } from "./components/assistant-message";
import { LoadingMessage } from "./components/loading-message";

type MessageListProps = {
  dialogId: string;
};

export const MessageList = ({ dialogId }: MessageListProps) => {
  const { t } = useTranslation();
  
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
    <div className="flex flex-col space-y-4 h-full overflow-y-auto">
      {/* Сообщения из кеша (включая оптимистичные) */}
      {messages.map((message, index) => (
        <div
          key={message.id || `message-${index}`}
          className={`flex ${
            message.role === "user" ? "justify-end" : "justify-start"
          }`}
        >
          {message.role === "user" ? (
            <UserMessage message={message} />
          ) : (
            <AssistantMessage message={message} />
          )}
        </div>
      ))}
      
      {/* Loader для pending мутаций и фоновых запросов */}
      {shouldShowLoader && (
        <div className="flex justify-start">
          <LoadingMessage dialogId={dialogId} />
        </div>
      )}
    </div>
  );
};