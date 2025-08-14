import type { ModelProvider, Model } from "@/core/api/models/types";
import type { Dialog } from "../api/chat/types";

export type { ModelProvider };

export type ChatSettings = {
  model: string;
  provider: ModelProvider;
  max_tokens: number;
  temperature: number;
  has_encrypted_messages: boolean;
};

export type ChatState = {
  activeDialogId: string | null;
  defaultSettings: ChatSettings;
  chatSettings: Map<string, ChatSettings>;
  isSettingsDrawerOpen: boolean;
};

export type ChatActions = {
  setActiveDialogId: (id: string | null) => void;
  updateDefaultSettings: (settings: Partial<ChatSettings>) => void;
  updateChatSettings: (dialogId: string, settings: Partial<ChatSettings>) => void;
  getCurrentSettings: () => ChatSettings;
  updateCurrentSettings: (settings: Partial<ChatSettings>) => void;
  setSettingsDrawerOpen: (isOpen: boolean) => void;
  applyChatSettingsFromDialog: (dialog: Dialog) => void;
  updateModelWithTokensCorrection: (modelId: string, provider: string, availableModels: Model[]) => void;
};