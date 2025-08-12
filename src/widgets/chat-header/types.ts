import type { ModelProvider } from "@/core/api/models/types";

export type ChatSettings = {
	model: string; // для отправки на сервер (например: "gpt-4o-mini")
	provider: ModelProvider; // для отображения иконки провайдера ("openai" | "anthropic")
	max_tokens: number; // для отправки на сервер
	temperature: number; // для отправки на сервер (0.0 - 2.0)
	has_encrypted_messages: boolean; // Secure mode
};

export type ChatHeaderProps = {
	settings: ChatSettings;
	onSettingsChange: (settings: Partial<ChatSettings>) => void;
};

export type ModelSelectorProps = {
	selectedModel: string;
	selectedProvider: ModelProvider;
	onModelChange: (model: string, provider: ModelProvider) => void;
};
