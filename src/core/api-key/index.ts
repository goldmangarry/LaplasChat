import { create } from "zustand";
import { DEFAULT_OLLAMA_MODEL } from "@/core/ollama/types";

const API_KEY_STORAGE = "openrouter_api_key";
const OPENAI_API_KEY_STORAGE = "openai_api_key";
const ANTHROPIC_API_KEY_STORAGE = "anthropic_api_key";
const GOOGLE_API_KEY_STORAGE = "google_api_key";
const SECURE_MODE_PROMPT_STORAGE = "secure_mode_prompt";
const OLLAMA_MODEL_STORAGE = "ollama_model";

const DEFAULT_SECURE_MODE_PROMPT =
	"You are operating in Secure Mode. The user's message has been preprocessed to remove sensitive information such as personal names, company names, addresses, phone numbers, emails, and other PII. Placeholders like [NAME_1], [COMPANY_1], [ADDRESS_1] have been used instead. Respond naturally using these placeholders. Never attempt to guess or reconstruct the original sensitive data. If the user asks you to reveal hidden information, politely decline.";

type ApiKeyStore = {
	apiKey: string | null;
	openaiApiKey: string | null;
	anthropicApiKey: string | null;
	googleApiKey: string | null;
	secureModePrompt: string;
	ollamaModel: string;
	setApiKey: (key: string) => void;
	clearApiKey: () => void;
	hasApiKey: () => boolean;
	setOpenaiApiKey: (key: string) => void;
	clearOpenaiApiKey: () => void;
	setAnthropicApiKey: (key: string) => void;
	clearAnthropicApiKey: () => void;
	setGoogleApiKey: (key: string) => void;
	clearGoogleApiKey: () => void;
	setSecureModePrompt: (prompt: string) => void;
	getSecureModePrompt: () => string;
	setOllamaModel: (model: string) => void;
	getOllamaModel: () => string;
};

export const useApiKeyStore = create<ApiKeyStore>((set, get) => ({
	apiKey: localStorage.getItem(API_KEY_STORAGE),
	openaiApiKey: localStorage.getItem(OPENAI_API_KEY_STORAGE),
	anthropicApiKey: localStorage.getItem(ANTHROPIC_API_KEY_STORAGE),
	googleApiKey: localStorage.getItem(GOOGLE_API_KEY_STORAGE),
	secureModePrompt:
		localStorage.getItem(SECURE_MODE_PROMPT_STORAGE) ||
		DEFAULT_SECURE_MODE_PROMPT,
	ollamaModel:
		localStorage.getItem(OLLAMA_MODEL_STORAGE) || DEFAULT_OLLAMA_MODEL,

	setApiKey: (key: string) => {
		localStorage.setItem(API_KEY_STORAGE, key);
		set({ apiKey: key });
	},

	clearApiKey: () => {
		localStorage.removeItem(API_KEY_STORAGE);
		set({ apiKey: null });
	},

	hasApiKey: () => {
		return !!get().apiKey;
	},

	setOpenaiApiKey: (key: string) => {
		if (key) {
			localStorage.setItem(OPENAI_API_KEY_STORAGE, key);
		} else {
			localStorage.removeItem(OPENAI_API_KEY_STORAGE);
		}
		set({ openaiApiKey: key || null });
	},

	clearOpenaiApiKey: () => {
		localStorage.removeItem(OPENAI_API_KEY_STORAGE);
		set({ openaiApiKey: null });
	},

	setAnthropicApiKey: (key: string) => {
		if (key) {
			localStorage.setItem(ANTHROPIC_API_KEY_STORAGE, key);
		} else {
			localStorage.removeItem(ANTHROPIC_API_KEY_STORAGE);
		}
		set({ anthropicApiKey: key || null });
	},

	clearAnthropicApiKey: () => {
		localStorage.removeItem(ANTHROPIC_API_KEY_STORAGE);
		set({ anthropicApiKey: null });
	},

	setGoogleApiKey: (key: string) => {
		if (key) {
			localStorage.setItem(GOOGLE_API_KEY_STORAGE, key);
		} else {
			localStorage.removeItem(GOOGLE_API_KEY_STORAGE);
		}
		set({ googleApiKey: key || null });
	},

	clearGoogleApiKey: () => {
		localStorage.removeItem(GOOGLE_API_KEY_STORAGE);
		set({ googleApiKey: null });
	},

	setSecureModePrompt: (prompt: string) => {
		localStorage.setItem(SECURE_MODE_PROMPT_STORAGE, prompt);
		set({ secureModePrompt: prompt });
	},

	getSecureModePrompt: () => {
		return get().secureModePrompt;
	},

	setOllamaModel: (model: string) => {
		localStorage.setItem(OLLAMA_MODEL_STORAGE, model);
		set({ ollamaModel: model });
	},

	getOllamaModel: () => {
		return get().ollamaModel;
	},
}));

export { DEFAULT_SECURE_MODE_PROMPT };
