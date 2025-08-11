export type ModelProvider = 'openai' | 'anthropic';

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