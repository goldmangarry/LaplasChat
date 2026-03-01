import { motion } from "motion/react";
import { useChatStore } from "@/core/chat/store";
import { getDisplayModelId } from "@/shared/lib/model-utils";
import type { ChatMessage } from "@/core/api/chat/types";
import { MessageFooter } from "./components/message-footer";
import { ProviderIcon } from "@/components/shared/provider-icon";
import MarkdownRenderer from "@/components/ui/markdown-renderer";

type AssistantMessageProps = {
  message: ChatMessage;
  onFactCheck: (message: string) => void;
};

export const AssistantMessage = ({ message, onFactCheck }: AssistantMessageProps) => {
  const { getCurrentSettings } = useChatStore();
  const settings = getCurrentSettings();

  const modelInfo = message.last_model_info;
  const displayModelId = getDisplayModelId(settings.model);
  const modelName = modelInfo?.name || `${settings.provider}: ${displayModelId}`;
  const provider = modelInfo?.provider || settings.provider;

  const messageTime = message.created_at
    ? new Date(message.created_at).toLocaleTimeString('en-US', { hour: '2-digit', minute: '2-digit' })
    : message.timestamp
    ? new Date(message.timestamp).toLocaleTimeString('en-US', { hour: '2-digit', minute: '2-digit' })
    : '';

  const handleCopy = () => {
    navigator.clipboard.writeText(message.content);
  };

  const handleFactCheck = () => {
    onFactCheck(message.content);
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 12 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.4, ease: "easeOut" }}
      className="max-w-[100%] rounded-lg px-4 py-3 text-foreground min-w-0 break-words"
    >
      <div className="flex items-center gap-3 mb-3">
        <div className="flex items-center gap-2">
          <div className="w-8 h-8 rounded-full flex items-center justify-center overflow-hidden">
            <ProviderIcon
              provider={provider as any}
              className="w-8 h-8 object-contain"
            />
          </div>

          <span className="text-base font-medium text-muted-foreground">
            {modelName}
          </span>
        </div>

        {messageTime && (
          <>
            <div className="w-px h-5 bg-border"></div>

            <span className="text-base text-muted-foreground">
              {messageTime}
            </span>
          </>
        )}
      </div>

      <MarkdownRenderer>{message.content}</MarkdownRenderer>

      <div className="mt-4">
        <MessageFooter
          onCopy={handleCopy}
          onFactCheck={handleFactCheck}
        />
      </div>
    </motion.div>
  );
};
