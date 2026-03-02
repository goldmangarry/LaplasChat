import { ollamaChatCompletion, listOllamaModels } from "@/core/ollama";
import { useSecurePipelineStatus } from "@/core/chat/secure-pipeline-status";
import { sendChatCompletion } from "./completions";
import { useApiKeyStore } from "@/core/api-key";

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

	const setStep = useSecurePipelineStatus.getState().setStep;
	const anonymizePrompt = useApiKeyStore.getState().anonymizePrompt;

	// AbortController shared across the outer try/finally so we can cancel on timeout
	const abortController = new AbortController();

	try {
		// ── Preflight: verify model is installed (5s timeout → fails fast, no 2-min hang) ──
		setStep("anonymizing");
		const installedModels = await listOllamaModels().catch(() => []);
		const modelExists = installedModels.some((m) => m.name === ollamaModel);
		if (!modelExists) {
			throw new Error(
				`Ollama model "${ollamaModel}" is not installed. Select an installed model in the Secure Mode chip.`,
			);
		}

		// ── Step 1: Anonymize the current user message via local Ollama ──
		// Limit input to 5000 chars to cover full CVs / long documents while avoiding
		// extreme model load. A hard 60s AbortController timeout cancels the actual XHR
		// (unlike Promise.race which only rejects the Promise but leaves Ollama running).
		const MAX_ANONYMIZE_CHARS = 5000;
		const truncatedMessage = userMessage.length > MAX_ANONYMIZE_CHARS
			? userMessage.slice(0, MAX_ANONYMIZE_CHARS)
			: userMessage;
		const allTexts = `[user]: ${truncatedMessage}`;

		let mapping: Record<string, string> = {};

		console.group("[SecurePipeline] Step 1: Anonymization via Ollama");
		console.log("Ollama model:", ollamaModel);
		console.log("Original user message:", userMessage);
		console.log("Input chars sent to Ollama:", allTexts.length);
		console.log("Full text sent to Ollama for PII detection:", allTexts);

		try {
			// 60s hard limit — aborts the actual Axios XHR so Ollama stops processing immediately
			const ANONYMIZE_TIMEOUT_MS = 60_000;
			const timeoutId = setTimeout(() => abortController.abort(), ANONYMIZE_TIMEOUT_MS);
			let anonymizeResponse: string;
			try {
				anonymizeResponse = await ollamaChatCompletion(
					ollamaModel,
					[
						{ role: "system", content: anonymizePrompt },
						{ role: "user", content: allTexts },
					],
					{ signal: abortController.signal },
				);
			} finally {
				clearTimeout(timeoutId);
			}
			if (abortController.signal.aborted) {
				throw new Error(`Ollama anonymization timed out after ${ANONYMIZE_TIMEOUT_MS / 1000}s. Try a shorter message or a faster model.`);
			}

			console.log("Ollama raw response:", anonymizeResponse);

			const parsed = parseMappingResponse(anonymizeResponse);
			if (parsed && Object.keys(parsed).length > 0) {
				mapping = parsed;
			}

			console.log("Extracted PII mapping:", mapping);
		} catch (error) {
			console.error("Anonymization failed:", error);
			// Re-throw timeout/abort errors directly so the user sees the real reason
			if (
				error instanceof Error &&
				(error.name === "CanceledError" || error.name === "AbortError" || error.message.includes("timed out"))
			) {
				throw error;
			}
			throw new Error(
				"Secure mode: anonymization failed. Cannot send unprotected data. Check that Ollama is running and has the selected model.",
			);
		}
		console.groupEnd();

		// ── Step 2: Generate via commercial model (OpenRouter) ──
		setStep("processing");
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

		// ── Step 3: De-anonymize via fast string replacement ──
		// Uses direct placeholder → original substitution instead of a second Ollama call.
		// This is instant, 100% reliable, and avoids doubling the wait time.
		setStep("deanonymizing");
		const finalContent = Object.keys(mapping).length > 0
			? fallbackDeanonymize(aiResponse.content, mapping)
			: aiResponse.content;

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
	} finally {
		// Abort any in-flight Ollama request on error or cancellation
		abortController.abort();
		setStep(null);
	}
}
