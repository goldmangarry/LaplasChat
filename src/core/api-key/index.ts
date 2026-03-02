import { create } from "zustand";
import { DEFAULT_OLLAMA_MODEL } from "@/core/ollama/types";

const API_KEY_STORAGE = "openrouter_api_key";
const OPENAI_API_KEY_STORAGE = "openai_api_key";
const ANTHROPIC_API_KEY_STORAGE = "anthropic_api_key";
const GOOGLE_API_KEY_STORAGE = "google_api_key";
const SECURE_MODE_PROMPT_STORAGE = "secure_mode_prompt";
const OLLAMA_MODEL_STORAGE = "ollama_model";
const ANONYMIZE_PROMPT_STORAGE = "anonymize_prompt";

export const DEFAULT_ANONYMIZE_PROMPT = `Extract ALL named entities (PII) from the INPUT TEXT BELOW. Output ONLY valid JSON, no markdown, no extra text.
Format: {"mapping":{"[TYPE_N]":"original_value"}}

Types:
- PERSON: any person name (first, last, patronymic, nickname, social handle like @username)
- COMPANY: ANY company, brand, organization, university, platform, service, app, product
- EMAIL: email addresses
- PHONE: phone numbers only (digits, +, -, spaces — NOT emails, NOT text)
- ADDRESS: specific addresses, cities, countries, regions
- URL: website URLs and domain names found in the text (do NOT invent URLs)
- ACCOUNT: account/card/ID/passport numbers

RULES:
- Extract ONLY from the input text — do NOT include entities from this prompt or examples
- Do NOT invent values that are not present in the text
- Do NOT extract: numbers, amounts, currencies, percentages, statistics, dates, job titles, descriptions
- Same value → same placeholder number
- When unsure about a name or company → extract it

Example (do NOT copy these values into output):
[user]: "Hello, I'm Bob from Acme Ltd. Email: bob@acme.io, phone +1-800-555-0100"
Output: {"mapping":{"[PERSON_1]":"Bob","[COMPANY_1]":"Acme Ltd","[EMAIL_1]":"bob@acme.io","[PHONE_1]":"+1-800-555-0100"}}

Now extract ALL entities from the INPUT TEXT ONLY. Output ONLY JSON:`;

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

	setAnonymizePrompt: (prompt: string) => {
		localStorage.setItem(ANONYMIZE_PROMPT_STORAGE, prompt);
		set({ anonymizePrompt: prompt });
	},
}));

export { DEFAULT_SECURE_MODE_PROMPT };
