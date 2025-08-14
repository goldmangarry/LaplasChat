import type { ChatSettings, ModelProvider } from "@/core/chat/types";

export type ChatHeaderProps = {
	settings: ChatSettings;
	onSettingsChange: (settings: Partial<ChatSettings>) => void;
	onOpenSettingsDrawer?: () => void;
};

export type ModelSelectorProps = {
	selectedModel: string;
	selectedProvider: ModelProvider;
	onModelChange: (model: string, provider: ModelProvider) => void;
};
