import { ollamaChatCompletion } from "@/core/ollama";
import { sendChatCompletion } from "./completions";

type SecurePipelineParams = {
	userMessage: string;
	conversationHistory: Array<{ role: string; content: string }>;
	mainModel: string;
	ollamaModel: string;
	temperature: number;
	maxTokens: number;
	apiKey: string;
};

type SecurePipelineResult = {
	content: string;
	cleanedMessage: string;
	mapping: Record<string, string>;
};

const ANONYMIZE_SYSTEM_PROMPT = `You are a strict PII/NER extraction engine. Extract ALL named entities and sensitive data from the text. You MUST catch every instance.

CATEGORIES (extract ALL of these):
- [PERSON_N] — any person name, first name, last name, patronymic, nickname, username
- [COMPANY_N] — any company, organization, brand, startup, product name, service name, app name
- [ADDRESS_N] — any address, city, street, country, region, building number
- [PHONE_N] — any phone number
- [EMAIL_N] — any email address
- [AMOUNT_N] — any monetary amount with currency
- [DATE_N] — any specific date (not relative like "yesterday")
- [ACCOUNT_N] — any account number, card number, ID number, SSN, passport number
- [URL_N] — any URL or website address
- [DATA_N] — any other identifiable information not in the above categories

RULES:
1. Extract from ALL messages in the input
2. Same value = same placeholder everywhere
3. When in doubt — EXTRACT IT. It is better to over-extract than to miss something
4. Product names and brand names ARE companies: Google, iPhone, Tesla, Slack, Notion — all are [COMPANY_N]
5. Output ONLY valid JSON. No text before or after. No markdown.

EXAMPLE INPUT:
[user]: Привет, меня зовут Алексей Смирнов, я работаю в Яндексе. Мой email alex@yandex.ru

EXAMPLE OUTPUT:
{"mapping":{"[PERSON_1]":"Алексей Смирнов","[COMPANY_1]":"Яндексе","[EMAIL_1]":"alex@yandex.ru","[COMPANY_2]":"Яндексе"}}

EXAMPLE INPUT:
[user]: We use Slack and Notion at Acme Corp. Contact John at john@acme.com or +1-555-0123

EXAMPLE OUTPUT:
{"mapping":{"[COMPANY_1]":"Slack","[COMPANY_2]":"Notion","[COMPANY_3]":"Acme Corp","[PERSON_1]":"John","[EMAIL_1]":"john@acme.com","[PHONE_1]":"+1-555-0123"}}

Now extract ALL entities from the following text. Output ONLY JSON:`;

const DEANONYMIZE_SYSTEM_PROMPT = `You are a text restoration engine. Your ONLY task: replace every placeholder like [PERSON_1], [COMPANY_1], etc. with the original value from the mapping provided.

RULES:
- Replace ALL placeholders with their original values
- Keep everything else EXACTLY as-is
- Output ONLY the restored text, nothing else
- No explanations, no markdown, no extra words

EXAMPLE:
Text: "Hello [PERSON_1], your order from [COMPANY_1] is ready."
Mapping: {"[PERSON_1]": "John", "[COMPANY_1]": "Amazon"}
Output: "Hello John, your order from Amazon is ready."

Now restore the following text:`;

const SECURE_GENERATION_SYSTEM_PROMPT = `The user's message uses privacy placeholders (like [PERSON_1], [COMPANY_1], etc.) to protect sensitive data. Respond naturally and use the SAME placeholders in your response. Do NOT try to guess the real values behind placeholders.

CRITICAL: You MUST detect the language of the user's message and respond in the SAME language. If the user writes in Russian — respond in Russian. If in English — respond in English. If in any other language — respond in that language. Never switch languages unless the user explicitly asks.`;

/**
 * Attempt to fix common JSON errors produced by small LLMs:
 * - Missing quotes around keys/values
 * - Trailing commas
 * - Single quotes instead of double
 */
function repairJson(raw: string): string {
	let s = raw.trim();
	// Replace single quotes with double quotes
	s = s.replace(/'/g, '"');
	// Fix missing closing quote before colon: "[KEY_1]: → "[KEY_1]":
	s = s.replace(/"(\[[A-Z_]+\d*\]):/g, '"$1":');
	// Remove trailing commas before } or ]
	s = s.replace(/,\s*([}\]])/g, "$1");
	return s;
}

/**
 * Normalize placeholder keys to standard format.
 * E.g., PHONE_NUMBER_1 → PHONE_1, NAME_1 → PERSON_1
 */
function normalizeMapping(mapping: Record<string, string>): Record<string, string> {
	const counters: Record<string, number> = {};
	const normalized: Record<string, string> = {};

	const categoryMap: Record<string, string> = {
		PHONE_NUMBER: "PHONE",
		TELEPHONE: "PHONE",
		TEL: "PHONE",
		NAME: "PERSON",
		FULL_NAME: "PERSON",
		FIRST_NAME: "PERSON",
		LAST_NAME: "PERSON",
		ORG: "COMPANY",
		ORGANIZATION: "COMPANY",
		BRAND: "COMPANY",
		PRODUCT: "COMPANY",
		CITY: "ADDRESS",
		LOCATION: "ADDRESS",
		PLACE: "ADDRESS",
		MONEY: "AMOUNT",
		PRICE: "AMOUNT",
		WEBSITE: "URL",
		LINK: "URL",
	};

	for (const [placeholder, original] of Object.entries(mapping)) {
		// Extract category and number from placeholder like [PHONE_NUMBER_1]
		const match = placeholder.match(/\[([A-Z_]+?)_?(\d+)?\]/);
		if (!match) {
			normalized[placeholder] = original;
			continue;
		}

		let category = match[1];
		// Normalize category name
		if (categoryMap[category]) {
			category = categoryMap[category];
		}

		// Assign sequential number
		if (!counters[category]) {
			counters[category] = 1;
		}
		const key = `[${category}_${counters[category]}]`;
		counters[category]++;
		normalized[key] = original;
	}

	return normalized;
}

function parseMappingResponse(response: string): Record<string, string> | null {
	const attempts = [response, repairJson(response)];

	for (const attempt of attempts) {
		// Try parsing raw JSON
		try {
			const parsed = JSON.parse(attempt);
			if (typeof parsed.mapping === "object") {
				return normalizeMapping(parsed.mapping);
			}
			if (parsed.cleaned_message && typeof parsed.mapping === "object") {
				return normalizeMapping(parsed.mapping);
			}
		} catch {
			// Not direct JSON
		}

		// Try extracting JSON from markdown code block
		const jsonMatch = attempt.match(/```(?:json)?\s*([\s\S]*?)```/);
		if (jsonMatch?.[1]) {
			try {
				const parsed = JSON.parse(repairJson(jsonMatch[1].trim()));
				if (typeof parsed.mapping === "object") {
					return normalizeMapping(parsed.mapping);
				}
			} catch {
				// Failed to parse extracted JSON
			}
		}

		// Try finding JSON object with mapping in the response
		const braceMatch = attempt.match(/\{[\s\S]*"mapping"[\s\S]*\}/);
		if (braceMatch?.[0]) {
			try {
				const parsed = JSON.parse(repairJson(braceMatch[0]));
				if (typeof parsed.mapping === "object") {
					return normalizeMapping(parsed.mapping);
				}
			} catch {
				// Failed
			}
		}
	}

	return null;
}

function fallbackDeanonymize(
	text: string,
	mapping: Record<string, string>,
): string {
	let result = text;
	// Sort by placeholder length descending to avoid partial replacements
	const entries = Object.entries(mapping).sort(
		(a, b) => b[0].length - a[0].length,
	);
	for (const [placeholder, original] of entries) {
		result = result.replaceAll(placeholder, original);
	}
	return result;
}

/**
 * Apply a PII mapping to text: replace original values with placeholders.
 * Sorts by original value length descending to avoid partial replacements.
 */
function applyAnonymization(
	text: string,
	mapping: Record<string, string>,
): string {
	if (Object.keys(mapping).length === 0) return text;
	let result = text;
	// mapping is { "[PERSON_1]": "John Doe" } — we need to replace "John Doe" → "[PERSON_1]"
	// Sort by original value length descending to avoid partial replacements
	const entries = Object.entries(mapping).sort(
		(a, b) => b[1].length - a[1].length,
	);
	for (const [placeholder, original] of entries) {
		result = result.replaceAll(original, placeholder);
	}
	return result;
}

export async function sendSecureMessage(
	params: SecurePipelineParams,
): Promise<SecurePipelineResult> {
	const {
		userMessage,
		conversationHistory,
		mainModel,
		ollamaModel,
		temperature,
		maxTokens,
		apiKey,
	} = params;

	// ── Step 1: Anonymize ALL messages via local Ollama ──
	// Build full conversation text so Ollama can detect PII across the entire context
	const allTexts = [
		...conversationHistory.map(
			(m) => `[${m.role}]: ${m.content}`,
		),
		`[user]: ${userMessage}`,
	].join("\n\n");

	let mapping: Record<string, string> = {};

	console.group("[SecurePipeline] Step 1: Anonymization via Ollama");
	console.log("Ollama model:", ollamaModel);
	console.log("Original user message:", userMessage);
	console.log("Conversation history length:", conversationHistory.length);
	console.log("Full text sent to Ollama for PII detection:", allTexts);

	try {
		const anonymizeResponse = await ollamaChatCompletion(ollamaModel, [
			{ role: "system", content: ANONYMIZE_SYSTEM_PROMPT },
			{ role: "user", content: allTexts },
		]);

		console.log("Ollama raw response:", anonymizeResponse);

		const parsed = parseMappingResponse(anonymizeResponse);
		if (parsed && Object.keys(parsed).length > 0) {
			mapping = parsed;
		}

		console.log("Extracted PII mapping:", mapping);
	} catch (error) {
		console.error("Anonymization failed:", error);
		throw new Error(
			"Secure mode: anonymization failed. Cannot send unprotected data. Check that Ollama is running and has the selected model.",
		);
	}
	console.groupEnd();

	// ── Step 2: Generate via commercial model (OpenRouter) ──
	const messagesForApi: Array<{
		role: "system" | "user" | "assistant";
		content: string;
	}> = [];

	// Add system prompt for placeholder-aware generation
	if (Object.keys(mapping).length > 0) {
		messagesForApi.push({
			role: "system",
			content: SECURE_GENERATION_SYSTEM_PROMPT,
		});
	}

	// Add ANONYMIZED conversation history
	for (const msg of conversationHistory) {
		messagesForApi.push({
			role: msg.role as "user" | "assistant",
			content: applyAnonymization(msg.content, mapping),
		});
	}

	// Add the ANONYMIZED user message
	const anonymizedUserMessage = applyAnonymization(userMessage, mapping);
	messagesForApi.push({ role: "user", content: anonymizedUserMessage });

	console.group("[SecurePipeline] Step 2: Sending to OpenRouter");
	console.log("Messages sent to OpenRouter:", JSON.parse(JSON.stringify(messagesForApi)));
	console.groupEnd();

	const aiResponse = await sendChatCompletion({
		messages: messagesForApi,
		model: mainModel,
		temperature,
		maxTokens,
		apiKey,
	});

	// ── Step 3: De-anonymize via local Ollama ──
	let finalContent = aiResponse.content;

	if (Object.keys(mapping).length > 0) {
		try {
			const deanonymizePrompt = `Text to restore:\n${aiResponse.content}\n\nMapping:\n${JSON.stringify(mapping, null, 2)}`;

			finalContent = await ollamaChatCompletion(ollamaModel, [
				{ role: "system", content: DEANONYMIZE_SYSTEM_PROMPT },
				{ role: "user", content: deanonymizePrompt },
			]);

			// Verify all placeholders are gone; if not, do string replacement
			const remainingPlaceholders = Object.keys(mapping).filter(
				(p) => finalContent.includes(p),
			);
			if (remainingPlaceholders.length > 0) {
				finalContent = fallbackDeanonymize(finalContent, mapping);
			}
		} catch (error) {
			console.error("De-anonymization failed, using fallback:", error);
			finalContent = fallbackDeanonymize(aiResponse.content, mapping);
		}
	}

	console.group("[SecurePipeline] Step 3: De-anonymization result");
	console.log("OpenRouter raw response:", aiResponse.content);
	console.log("Final de-anonymized response:", finalContent);
	console.groupEnd();

	// Save debug info to window for easy console inspection
	(window as unknown as Record<string, unknown>).__SECURE_PIPELINE_DEBUG__ = {
		timestamp: new Date().toISOString(),
		ollamaModel,
		originalMessage: userMessage,
		mapping,
		anonymizedMessage: anonymizedUserMessage,
		sentToOpenRouter: messagesForApi,
		openRouterResponse: aiResponse.content,
		finalResponse: finalContent,
		mappingCount: Object.keys(mapping).length,
	};

	return {
		content: finalContent,
		cleanedMessage: anonymizedUserMessage,
		mapping,
	};
}
