import { useRef, useEffect } from "react";
import { useChatMessages, usePendingMessages } from "@/core/api/chat/hooks";
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
  const allMessageRefs = useRef<{ [key: string]: HTMLDivElement | null }>({});
  const containerRef = useRef<HTMLDivElement>(null);
  const isFirstRender = useRef(true);
  const prevMessagesLength = useRef(0);
  
  // Get messages from React Query cache
  const { 
    data: chatMessagesData, 
    error: messagesError,
    isLoading: isLoadingMessages,
    isFetching: isFetchingMessages
  } = useChatMessages(dialogId);

  // Get pending mutations for displaying optimistic updates
  const pendingMessages = usePendingMessages(dialogId);

  const hasPendingMessage = pendingMessages.length > 0;
  
  const messages = chatMessagesData?.messages || [];
  
  // Show loader if there are pending mutations or background data refresh is in progress
  // BUT only if we already have messages (to avoid showing loader on initial load)
  const shouldShowLoader = hasPendingMessage || (isFetchingMessages && messages.length > 0);

  // Scroll to loader when it appears
  useEffect(() => {
    if (shouldShowLoader && loadingRef.current) {
      loadingRef.current.scrollIntoView({ 
        behavior: 'smooth', 
        block: 'start'
      });
    }
  }, [shouldShowLoader]);

  // Scroll to bottom on first appearance of messages
  useEffect(() => {
    if (messages.length > 0 && isFirstRender.current && containerRef.current) {
      containerRef.current.scrollTop = containerRef.current.scrollHeight;
      isFirstRender.current = false;
      prevMessagesLength.current = messages.length;
    }
  }, [messages.length > 0]);

  // Scroll to show beginning of AI response when it appears
  useEffect(() => {
    // Verify this is not the initial load and a new message has been added
    if (isFirstRender.current || messages.length <= prevMessagesLength.current) {
      prevMessagesLength.current = messages.length;
      return;
    }

    const lastMessage = messages[messages.length - 1];
    if (lastMessage?.role === 'assistant') {
      // Wait for DOM to settle after React render, then scroll
      requestAnimationFrame(() => {
        const messageKey = lastMessage.id || `message-${messages.length - 1}`;
        const messageRef = messagesRefs.current[messageKey];
        if (messageRef) {
          messageRef.scrollIntoView({
            behavior: 'smooth',
            block: 'start'
          });
        }
      });
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
      {/* Messages from cache (including optimistic) */}
      {messages.map((message, index) => {
        const messageKey = message.id || `message-${index}`;
        return (
          <div
            key={messageKey}
            ref={(el) => {
              allMessageRefs.current[messageKey] = el;
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
      
      {/* Loader for pending mutations and background requests */}
      {shouldShowLoader && (
        <div ref={loadingRef} className="flex justify-start">
          <LoadingMessage dialogId={dialogId} />
        </div>
      )}
    </div>
  );
};