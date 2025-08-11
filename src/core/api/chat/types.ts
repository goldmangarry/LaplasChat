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