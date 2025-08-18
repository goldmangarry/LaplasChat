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
	created_at: string;
	updated_at: string;
};

export type ChatHistoryResponse = {
	dialogs: Dialog[];
};

export type SendMessageRequest = {
	model: string;
	message: string;
	max_tokens: number;
	temperature: number;
	dialog_id?: string;
	file_ids?: string[];
};

export type SendMessageResponse = {
	response: string;
	dialog_id: string;
};

export type MessageRole = "assistant" | "user";

export type AttachedFile = {
	id: string;
	filename: string;
	content_type: string;
	file_size: number;
	created_at: string;
};

export type ChatMessage = {
	id?: string;
	role: MessageRole;
	content: string;
	created_at?: string;
	timestamp?: number;
	encrypted_content?: string;
	last_model_info?: ModelInfo;
	attached_files?: AttachedFile[];
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

export type DeleteChatHistoryRequest = {
	dialog_id: string;
};

export type UpdateDialogNameRequest = {
	dialog_name: string;
};

export type UpdateDialogNameResponse = {
	dialog_id: string;
	dialog_name: string;
	updated_at: string;
};

export type FactCheckRequest = {
	message: string;
};

export type FactCheckAnnotation = {
	url: string;
	text: string;
	header: string;
};

export type FactCheckResponse = {
	response: string;
	annotations: FactCheckAnnotation[];
};

export type UploadedFile = {
	file_id: string;
	filename: string;
	download_url: string;
	expires_at: string;
	text_extracted: boolean;
};

export type UploadFilesResponse = {
	files: UploadedFile[];
};

export type FileDownloadResponse = {
	download_url: string;
	expires_in: string;
};
