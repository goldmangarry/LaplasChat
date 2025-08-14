import type { ChatMessage } from "@/core/api/chat/types";
import MarkdownRenderer from "@/components/ui/markdown-renderer";
import { CopyButton } from "@/components/ui/copy-button";
import { AttachedFilesPreview } from "./components/attached-files-preview";

type UserMessageProps = {
  message: ChatMessage;
};

export const UserMessage = ({ message }: UserMessageProps) => {
  return (
    <div className="flex flex-col max-w-[100%]">
    {message.attached_files && message.attached_files.length > 0 && (
          <div className="w-full flex">
            <AttachedFilesPreview files={message.attached_files} />
          </div>
        )}
    <div className="max-w-[100%] bg-muted border border-input rounded-[10px] p-4 min-w-0 break-words">
      <div className="flex flex-col gap-2">
        <MarkdownRenderer>{message.content}</MarkdownRenderer>
        <div className="flex justify-between items-center w-full">
          <div className="flex items-center gap-1">
            <CopyButton content={message.content} />
          </div>
          <div className="flex-1"></div> 
        </div>
      </div>
    </div>
    </div>
  );
};