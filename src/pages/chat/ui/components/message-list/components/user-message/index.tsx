import type { ChatMessage } from "@/core/api/chat/types";
import MarkdownRenderer from "@/components/ui/markdown-renderer";
import { CopyButton } from "@/components/ui/copy-button";

type UserMessageProps = {
  message: ChatMessage;
};

export const UserMessage = ({ message }: UserMessageProps) => {
  return (
    <div className="max-w-[100%] bg-muted border border-input rounded-[10px] p-4 min-w-0 break-words">
      <div className="flex flex-col items-center gap-2">
        <MarkdownRenderer>{message.content}</MarkdownRenderer>
        <div className="flex justify-between items-center w-full">
          <div className="flex items-center gap-1">
            <CopyButton content={message.content} />
          </div>
          <div className="flex-1"></div> {/* Spacer для выравнивания */}
        </div>
      </div>
    </div>
  );
};