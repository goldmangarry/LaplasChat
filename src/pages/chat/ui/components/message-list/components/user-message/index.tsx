import { useState } from "react";
import { Lock } from "lucide-react";
import { useTranslation } from "react-i18next";
import type { ChatMessage } from "@/core/api/chat/types";
import MarkdownRenderer from "@/components/ui/markdown-renderer";
import { CopyButton } from "@/components/ui/copy-button";
import { Button } from "@/components/ui/button";
import { EncryptedContentModal } from "@/components/ui/encrypted-content-modal";
import { AttachedFilesPreview } from "./components/attached-files-preview";

type UserMessageProps = {
  message: ChatMessage;
};

export const UserMessage = ({ message }: UserMessageProps) => {
  const { t } = useTranslation();
  const [isModalOpen, setIsModalOpen] = useState(false);

  const handleOpenModal = () => setIsModalOpen(true);
  const handleCloseModal = () => setIsModalOpen(false);

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
              {message.encrypted_content && (
                <Button
                  variant="ghost"
                  size="icon"
                  className="h-6 w-6"
                  aria-label={t("message.encryptedContent.viewEncryptedContent")}
                  onClick={handleOpenModal}
                >
                  <Lock className="h-4 w-4" />
                </Button>
              )}
            </div>
            <div className="flex-1"></div>
          </div>
        </div>
      </div>

      {message.encrypted_content && (
        <EncryptedContentModal
          isOpen={isModalOpen}
          encryptedContent={message.encrypted_content}
          onClose={handleCloseModal}
        />
      )}
    </div>
  );
};