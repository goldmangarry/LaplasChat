export type ModelProvider =
	| "openai"
	| "anthropic"
	| "perplexity"
	| "google"
	| "meta-llama"
	| "mistralai"
	| "deepseek"
	| "qwen"
	| "x-ai";

export type Model = {
	id: string;
	name: string;
	provider: ModelProvider;
	context_window: number;
	max_output: number;
};

export type ModelsResponse = {
	models: Model[];
};

export type OpenRouterModel = {
	id: string;
	name: string;
	context_length: number;
	top_provider: {
		context_length: number;
		max_completion_tokens: number | null;
		is_moderated: boolean;
	} | null;
	architecture: {
		modality: string;
		input_modalities: string[];
		output_modalities: string[];
	} | null;
	pricing: {
		prompt: string;
		completion: string;
	} | null;
};

export type OpenRouterModelsResponse = {
	data: OpenRouterModel[];
};
