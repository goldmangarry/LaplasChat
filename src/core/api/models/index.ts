import axios from "axios";
import type {
	Model,
	ModelsResponse,
	OpenRouterModelsResponse,
	ModelProvider,
} from "./types";

const OPENROUTER_MODELS_URL = "https://openrouter.ai/api/v1/models";
const OPENAI_MODELS_URL = "https://api.openai.com/v1/models";
const GOOGLE_MODELS_URL =
	"https://generativelanguage.googleapis.com/v1beta/models";

const SUPPORTED_PROVIDERS: ModelProvider[] = [
	"openai",
	"anthropic",
	"google",
	"meta-llama",
	"deepseek",
	"mistralai",
	"perplexity",
	"qwen",
	"x-ai",
];

const EXCLUDED_PATTERNS = [
	"guard",
	"safeguard",
	"embed",
	"moderation",
	"tts",
	"whisper",
	"dall-e",
];

function cleanModelName(name: string): string {
	const colonIndex = name.indexOf(": ");
	if (colonIndex !== -1) {
		return name.slice(colonIndex + 2);
	}
	return name;
}

async function fetchOpenRouterModels(apiKey: string): Promise<Model[]> {
	const response = await axios.get<OpenRouterModelsResponse>(
		OPENROUTER_MODELS_URL,
		{ headers: { Authorization: `Bearer ${apiKey}` } },
	);

	const models: Model[] = [];
	for (const m of response.data.data) {
		const providerSlug = m.id.split("/")[0];

		if (!SUPPORTED_PROVIDERS.includes(providerSlug as ModelProvider))
			continue;

		const idLower = m.id.toLowerCase();
		if (EXCLUDED_PATTERNS.some((p) => idLower.includes(p))) continue;
		if (m.id.includes(":exacto") || m.id.includes(":extended")) continue;

		models.push({
			id: m.id,
			name: cleanModelName(m.name),
			provider: providerSlug as ModelProvider,
			context_window: m.context_length,
			max_output: m.top_provider?.max_completion_tokens ?? 8192,
		});
	}

	return models;
}

async function fetchOpenAIModels(apiKey: string): Promise<Model[]> {
	const response = await axios.get<{
		data: Array<{ id: string; created: number }>;
	}>(OPENAI_MODELS_URL, {
		headers: { Authorization: `Bearer ${apiKey}` },
	});

	const chatModels = response.data.data.filter(
		(m) =>
			m.id.startsWith("gpt-") ||
			m.id.startsWith("o1") ||
			m.id.startsWith("o3") ||
			m.id.startsWith("o4"),
	);

	return chatModels.map((m) => ({
		id: m.id,
		name: m.id.startsWith("gpt-")
			? m.id.replace("gpt-", "GPT-")
			: m.id.toUpperCase(),
		provider: "openai" as ModelProvider,
		context_window: 128000,
		max_output: 16384,
	}));
}

const ANTHROPIC_MODELS: Model[] = [
	{ id: "claude-sonnet-4-6-20250925", name: "Claude Sonnet 4.6", provider: "anthropic", context_window: 1000000, max_output: 128000 },
	{ id: "claude-opus-4-6-20250925", name: "Claude Opus 4.6", provider: "anthropic", context_window: 1000000, max_output: 128000 },
	{ id: "claude-sonnet-4-5-20250929", name: "Claude Sonnet 4.5", provider: "anthropic", context_window: 1000000, max_output: 64000 },
	{ id: "claude-opus-4-5-20250822", name: "Claude Opus 4.5", provider: "anthropic", context_window: 200000, max_output: 64000 },
	{ id: "claude-haiku-4-5-20251001", name: "Claude Haiku 4.5", provider: "anthropic", context_window: 200000, max_output: 64000 },
	{ id: "claude-sonnet-4-20250514", name: "Claude Sonnet 4", provider: "anthropic", context_window: 1000000, max_output: 64000 },
	{ id: "claude-opus-4-20250514", name: "Claude Opus 4", provider: "anthropic", context_window: 200000, max_output: 32000 },
	{ id: "claude-3-5-haiku-20241022", name: "Claude 3.5 Haiku", provider: "anthropic", context_window: 200000, max_output: 8192 },
];

async function fetchGoogleModels(apiKey: string): Promise<Model[]> {
	const response = await axios.get<{
		models: Array<{
			name: string;
			displayName: string;
			inputTokenLimit: number;
			outputTokenLimit: number;
			supportedGenerationMethods: string[];
		}>;
	}>(`${GOOGLE_MODELS_URL}?key=${apiKey}`);

	return response.data.models
		.filter(
			(m) =>
				m.supportedGenerationMethods?.includes("generateContent") &&
				m.name.includes("gemini"),
		)
		.map((m) => ({
			id: m.name.replace("models/", ""),
			name: m.displayName,
			provider: "google" as ModelProvider,
			context_window: m.inputTokenLimit ?? 1000000,
			max_output: m.outputTokenLimit ?? 8192,
		}));
}

export const modelsApi = {
	getModels: async (): Promise<ModelsResponse> => {
		const openrouterKey = localStorage.getItem("openrouter_api_key");
		const openaiKey = localStorage.getItem("openai_api_key");
		const anthropicKey = localStorage.getItem("anthropic_api_key");
		const googleKey = localStorage.getItem("google_api_key");

		const fetches: Promise<Model[]>[] = [];

		if (openrouterKey) {
			fetches.push(fetchOpenRouterModels(openrouterKey).catch(() => []));
		}
		if (openaiKey) {
			fetches.push(fetchOpenAIModels(openaiKey).catch(() => []));
		}
		if (anthropicKey) {
			fetches.push(Promise.resolve(ANTHROPIC_MODELS));
		}
		if (googleKey) {
			fetches.push(fetchGoogleModels(googleKey).catch(() => []));
		}

		const results = await Promise.all(fetches);
		const allModels = results.flat();

		// Deduplicate by id
		const seen = new Set<string>();
		const unique: Model[] = [];
		for (const model of allModels) {
			if (!seen.has(model.id)) {
				seen.add(model.id);
				unique.push(model);
			}
		}

		return { models: unique };
	},
};
