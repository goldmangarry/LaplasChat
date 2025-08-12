import { create } from "zustand";
import type { ChatSettings, ChatState, ChatActions } from "./types";
import type { Model } from "../api/models/types";

const DEFAULT_CHAT_SETTINGS: ChatSettings = {
  model: "openai/gpt-5-chat",
  provider: "openai",
  max_tokens: 4000,
  temperature: 0.7,
  has_encrypted_messages: false,
};

export const useChatStore = create<ChatState & ChatActions>((set, get) => ({
  // State
  activeDialogId: null,
  defaultSettings: DEFAULT_CHAT_SETTINGS,
  chatSettings: new Map(),
  isSettingsDrawerOpen: false,

  // Actions
  setActiveDialogId: (id) => {
    set({ activeDialogId: id });
  },

  updateDefaultSettings: (settings) => {
    set((state) => ({
      defaultSettings: { ...state.defaultSettings, ...settings },
    }));
  },

  updateChatSettings: (dialogId, settings) => {
    set((state) => {
      const newChatSettings = new Map(state.chatSettings);
      const currentSettings = newChatSettings.get(dialogId) || state.defaultSettings;
      newChatSettings.set(dialogId, { ...currentSettings, ...settings });
      return { chatSettings: newChatSettings };
    });
  },

  getCurrentSettings: () => {
    const state = get();
    const { activeDialogId, chatSettings, defaultSettings } = state;

    // Если есть активный чат - возвращаем его настройки или дефолтные
    if (activeDialogId && chatSettings.has(activeDialogId)) {
      const chatSettings_ = chatSettings.get(activeDialogId);
      if (chatSettings_) {
        return chatSettings_;
      }
    }

    // Нет активного чата → дефолтные настройки
    return defaultSettings;
  },

  updateCurrentSettings: (settings) => {
    const state = get();
    const { activeDialogId } = state;

    if (!activeDialogId) {
      // Нет активного чата → обновляем дефолтные настройки
      get().updateDefaultSettings(settings);
    } else {
      // Существующий чат → обновляем настройки чата
      get().updateChatSettings(activeDialogId, settings);
    }
  },

  setSettingsDrawerOpen: (isOpen) => {
    set({ isSettingsDrawerOpen: isOpen });
  },

  // Применить настройки чата из данных диалога
  applyChatSettingsFromDialog: (dialog) => {
    const { id, last_model_info, has_encrypted_messages } = dialog;
    
    if (last_model_info) {
      const chatSettings: ChatSettings = {
        model: last_model_info.id,
        provider: last_model_info.provider,
        max_tokens: last_model_info.max_output, // Используем max_output модели как max_tokens
        temperature: last_model_info.temperature,
        has_encrypted_messages,
      };
      
      get().updateChatSettings(id, chatSettings);
    }
  },

  // Корректировать max_tokens при изменении модели
  updateModelWithTokensCorrection: (modelId: string, provider: string, availableModels: Model[]) => {
    const selectedModel = availableModels.find(model => model.id === modelId);
    const state = get();
    const currentSettings = state.getCurrentSettings();
    
    if (selectedModel) {
      // Корректируем max_tokens если текущее значение превышает максимум новой модели
      const correctedMaxTokens = Math.min(currentSettings.max_tokens, selectedModel.max_output);
      
      const updatedSettings = {
        model: modelId,
        provider: provider as ChatSettings['provider'],
        max_tokens: correctedMaxTokens,
      };
      
      state.updateCurrentSettings(updatedSettings);
    } else {
      // Если модель не найдена, обновляем только модель и провайдер
      state.updateCurrentSettings({ model: modelId, provider: provider as ChatSettings['provider'] });
    }
  },
}));