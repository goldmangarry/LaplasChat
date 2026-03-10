import { create } from "zustand";
import { DEFAULT_OLLAMA_MODEL } from "@/core/ollama/types";

const API_KEY_STORAGE = "openrouter_api_key";
const OPENAI_API_KEY_STORAGE = "openai_api_key";
const ANTHROPIC_API_KEY_STORAGE = "anthropic_api_key";
const GOOGLE_API_KEY_STORAGE = "google_api_key";
const SECURE_MODE_PROMPT_STORAGE = "secure_mode_prompt";
const OLLAMA_MODEL_STORAGE = "ollama_model";
const ANONYMIZE_PROMPT_STORAGE = "anonymize_prompt";
const OLLAMA_BASE_URL_STORAGE = "ollama_base_url";
const OLLAMA_API_KEY_STORAGE = "ollama_api_key";

export const DEFAULT_OLLAMA_BASE_URL = "http://localhost:11434";

export const DEFAULT_ANONYMIZE_PROMPT = `You are a PII extractor. Extract ALL named entities from the text between ---BEGIN TEXT--- and ---END TEXT--- markers.

Output ONLY valid JSON: {"mapping":{"[TYPE_N]":"original_value"}}

Entity types to extract:
- PERSON: full names, first names, last names (e.g. John Smith, Jane Doe)
- COMPANY: companies, brands, organizations, universities, platforms, products, services (e.g. Google, MIT, Acme Corp, IQ Option)
- ADDRESS: cities, countries, regions, street addresses (e.g. New York, London)

DO NOT extract: emails, phones, @handles, URLs — they are already handled separately.
DO NOT extract: numbers, amounts, dates, job titles, descriptions, statistics.
DO NOT extract text from this prompt or from any instructions before ---BEGIN TEXT---.

RULES:
- Extract ONLY from the text between the markers
- Same entity appearing multiple times → same placeholder
- When unsure if something is a name or company → extract it
- Output ONLY JSON, no markdown, no explanation

Example:
Input: ---BEGIN TEXT---\nXperson1 worked at Xcompany1 in Xcity1\n---END TEXT---
Output: {"mapping":{"[PERSON_1]":"Xperson1","[COMPANY_1]":"Xcompany1","[ADDRESS_1]":"Xcity1"}}`;

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
	ollamaBaseUrl: string;
	setOllamaBaseUrl: (url: string) => void;
	getOllamaBaseUrl: () => string;
	ollamaApiKey: string | null;
	setOllamaApiKey: (key: string) => void;
	anonymizePrompt: string;
	setAnonymizePrompt: (prompt: string) => void;
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
	ollamaBaseUrl:
		localStorage.getItem(OLLAMA_BASE_URL_STORAGE) || DEFAULT_OLLAMA_BASE_URL,
	ollamaApiKey: localStorage.getItem(OLLAMA_API_KEY_STORAGE),
	anonymizePrompt:
		localStorage.getItem(ANONYMIZE_PROMPT_STORAGE) || DEFAULT_ANONYMIZE_PROMPT,

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

	setOllamaBaseUrl: (url: string) => {
		const trimmed = url.replace(/\/+$/, "");
		if (trimmed) {
			localStorage.setItem(OLLAMA_BASE_URL_STORAGE, trimmed);
			set({ ollamaBaseUrl: trimmed });
		} else {
			localStorage.removeItem(OLLAMA_BASE_URL_STORAGE);
			set({ ollamaBaseUrl: DEFAULT_OLLAMA_BASE_URL });
		}
	},

	getOllamaBaseUrl: () => {
		return get().ollamaBaseUrl || DEFAULT_OLLAMA_BASE_URL;
	},

	setOllamaApiKey: (key: string) => {
		if (key) {
			localStorage.setItem(OLLAMA_API_KEY_STORAGE, key);
		} else {
			localStorage.removeItem(OLLAMA_API_KEY_STORAGE);
		}
		set({ ollamaApiKey: key || null });
	},

	setAnonymizePrompt: (prompt: string) => {
		localStorage.setItem(ANONYMIZE_PROMPT_STORAGE, prompt);
		set({ anonymizePrompt: prompt });
	},
}));

export { DEFAULT_SECURE_MODE_PROMPT };
