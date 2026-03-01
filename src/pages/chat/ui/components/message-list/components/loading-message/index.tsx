import { useState, useEffect } from "react";
import { useChatStore } from "@/core/chat/store";
import { useModels } from "@/core/api/models/hooks";
import { usePendingMessages } from "@/core/api/chat/hooks";
import { getDisplayModelId } from "@/shared/lib/model-utils";
import type { SendMessageRequest } from "@/core/api/chat/types";
import { AnimatedShinyText } from "@/components/magicui/animated-shiny-text";
import { ProviderIcon } from "@/components/shared/provider-icon";

const NORMAL_LOADING_TEXTS = [
  'Generating response...',
  'Thinking...',
  'Processing request...',
  'Writing for you...',
  'Composing response...',
];

const SECURE_LOADING_TEXTS = [
  'Scanning for vulnerabilities...',
  'Encrypting request...',
  'Sending request to AI model...',
  'Waiting for AI model response...',
  'Decrypting response...',
  'Preparing response...',
];

type LoadingMessageProps = {
  dialogId: string;
};

export const LoadingMessage = ({ dialogId }: LoadingMessageProps) => {
  const { getCurrentSettings } = useChatStore();
  const settings = getCurrentSettings();
  const [currentTextIndex, setCurrentTextIndex] = useState(0);

  const { data: modelsData } = useModels();
  const models = modelsData?.models || [];

  const pendingMessages = usePendingMessages(dialogId);

  const pendingRequest: SendMessageRequest | undefined = pendingMessages[0];
  const isSecure = !!pendingRequest?.secure_mode;

  const modelId = pendingRequest?.model || settings.model;
  const displayModelId = getDisplayModelId(modelId);
  const targetModel = models.find(model => model.id === displayModelId);

  const modelName = targetModel?.name || displayModelId;
  const provider = targetModel?.provider || settings.provider;

  const currentTime = new Date().toLocaleTimeString('en-US', { hour: '2-digit', minute: '2-digit' });

  const loadingTexts = isSecure ? SECURE_LOADING_TEXTS : NORMAL_LOADING_TEXTS;
  const intervalTime = isSecure ? 10000 : 5000;

  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentTextIndex((prevIndex) => (prevIndex + 1) % loadingTexts.length);
    }, intervalTime);

    return () => clearInterval(interval);
  }, [loadingTexts.length, intervalTime]);

  return (
    <div className="max-w-[100%] rounded-lg px-4 py-3 text-foreground min-w-0 break-words">
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

        <div className="w-px h-5 bg-border"></div>

        <span className="text-base text-muted-foreground">
          {currentTime}
        </span>
      </div>

      <div className="flex justify-start">
        <AnimatedShinyText className="text-sm ml-0">
          {loadingTexts[currentTextIndex]}
        </AnimatedShinyText>
      </div>
    </div>
  );
};
