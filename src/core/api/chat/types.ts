import type { ModelProvider } from "../models/types";

export type ModelInfo = {
	id: string;
	name: string;
	provider: ModelProvider;
	max_output: number;
	temperature: number;
};

export type Dialog = {
	id: string;
	name: string;
	has_encrypted_messages: boolean;
	last_model_info: ModelInfo;
};

export type ChatHistoryResponse = {
	dialogs: Dialog[];
};

export type SendMessageRequest = {
	model: string;
	message: string;
	max_tokens: number;
	temperature: number;
	dialog_id: string;
};

export type SendMessageResponse = {
	response: string;
	dialog_id: string;
};

export type MessageRole = "assistant" | "user";

export type ChatMessage = {
	role: MessageRole;
	content: string;
	created_at: string;
	encrypted_content?: string;
	last_model_info?: ModelInfo;
};

export type ChatMessagesResponse = {
	messages: ChatMessage[];
	has_encrypted_messages: boolean;
	last_model_info: ModelInfo;
};

export type SecretReplacement = {
	original: string;
	replacement: string;
	type: string;
};

export type SendSecureMessageResponse = {
	encrypted_response: string;
	decrypted_response: string;
	secrets: SecretReplacement[];
	content_type: string;
	dialog_id: string;
};
