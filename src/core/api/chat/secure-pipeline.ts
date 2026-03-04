import { ollamaChatCompletion, listOllamaModels } from "@/core/ollama";
import { useSecurePipelineStatus } from "@/core/chat/secure-pipeline-status";
import { sendChatCompletion } from "./completions";
import { useApiKeyStore } from "@/core/api-key";

type SecurePipelineParams = {
	userMessage: string;
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

/**
 * Pre-extract obvious PII using regex patterns.
 * Catches emails, phones, telegram handles, and URLs
 * that small LLMs often miss.
 */
// Common English words and abbreviations that should NOT be treated as company names
const STOP_WORDS = new Set([
	// Common words that start with caps
	"the", "and", "for", "with", "from", "into", "this", "that", "have", "will",
	"been", "were", "are", "was", "not", "but", "what", "all", "can", "had",
	"her", "his", "one", "our", "out", "its", "let", "may", "who", "boy", "did",
	"get", "has", "him", "how", "man", "new", "now", "old", "see", "way", "day",
	"too", "use", "she", "say", "each", "than", "them", "then", "some", "make",
	"like", "long", "look", "many", "over", "such", "take", "time", "very",
	"when", "come", "just", "know", "also", "back", "most", "much", "need",
	"only", "work", "year", "give", "good", "keep", "last", "same", "tell",
	"does", "call", "down", "find", "first", "well", "your", "more", "want",
	// Job titles and descriptions
	"Leader", "Manager", "Director", "Engineer", "Developer", "Designer",
	"Architect", "Analyst", "Consultant", "Specialist", "Senior", "Junior",
	"Lead", "Head", "Chief", "Principal", "Staff", "Team", "Product", "Project",
	"Technical", "Growth", "Mobile", "Frontend", "Backend", "Full", "Stack",
	"Software", "Data", "Business", "Marketing", "Sales", "Human", "Resources",
	// Tech terms
	"MVP", "SaaS", "DeFi", "API", "SDK", "CRM", "ERP", "CTO", "CEO", "CFO",
	"COO", "CMO", "CPO", "DevOps", "QA", "UX", "UI", "HTML", "CSS", "DNS",
	"SQL", "NoSQL", "REST", "HTTP", "HTTPS", "JSON", "XML", "PDF", "CSV",
	"GIT", "NPM", "CI", "CD", "TDD", "BDD", "ORM", "OOP", "MVC", "MVVM",
	// Countries / regions (too generic)
	"USA", "UAE", "EU",
	// Generic words that appear capitalized
	"Summary", "Overview", "Introduction", "Conclusion", "Note", "Notes",
	"Experience", "Education", "Skills", "About", "Contact", "Profile",
	"Remote", "Hybrid", "Office", "Part", "Time", "Month", "Year",
	"January", "February", "March", "April", "May", "June", "July",
	"August", "September", "October", "November", "December",
	// Common units / metrics / business abbreviations
	"DAU", "MAU", "ARR", "MRR", "ROI", "KPI", "OKR", "GMV",
	"ARPPU", "ARPU", "LTV", "CAC", "NPS", "SLA", "NDA", "TVL",
	"GPA", "JSD", "PnL", "P&L", "YoY", "MoM", "QoQ", "WoW",
	"ETH", "BTC", "USDT", "USDC",
	// Languages and frameworks
	"TypeScript", "JavaScript", "Python", "Kotlin", "Swift", "React",
	"Redux", "Node", "Docker", "Linux", "Windows", "Android", "iOS",
	"PostgreSQL", "MongoDB", "Redis", "Kafka", "Kubernetes",
	// Agile / methodology
	"Agile", "Scrum", "Kanban",
]);

function preExtractPII(text: string): Record<string, string> {
	const mapping: Record<string, string> = {};
	const existingValues = new Set<string>();
	const counters: Record<string, number> = {
		EMAIL: 1,
		PHONE: 1,
		ACCOUNT: 1,
		URL: 1,
		COMPANY: 1,
		ADDRESS: 1,
	};

	function addMapping(category: string, value: string) {
		const trimmed = value.trim();
		if (!trimmed || existingValues.has(trimmed.toLowerCase())) return;
		const key = `[${category}_${counters[category]}]`;
		mapping[key] = trimmed;
		counters[category]++;
		existingValues.add(trimmed.toLowerCase());
	}

	// Emails
	for (const match of text.matchAll(/[\w.+-]+@[\w.-]+\.\w{2,}/g)) {
		addMapping("EMAIL", match[0]);
	}

	// Phone numbers (international and local formats, 7-15 digits)
	for (const match of text.matchAll(/\+?\d[\d\s()-]{6,}\d/g)) {
		const digitCount = match[0].replace(/\D/g, "").length;
		if (digitCount >= 7 && digitCount <= 15) {
			addMapping("PHONE", match[0]);
		}
	}

	// Telegram / social handles (@username, min 3 chars)
	for (const match of text.matchAll(/(?<!\w)@[a-zA-Z]\w{2,}/g)) {
		addMapping("ACCOUNT", match[0]);
	}

	// URLs
	for (const match of text.matchAll(/https?:\/\/[^\s,;)\]]+/g)) {
		addMapping("URL", match[0]);
	}

	// ── Company-like patterns (regex-based heuristics) ──

	// ALL-CAPS abbreviations (3+ letters, e.g. EMCD, NASA)
	// Includes Cyrillic uppercase: А-Я
	for (const match of text.matchAll(/(?<![a-zA-Zа-яА-ЯёЁ])([A-ZА-ЯЁ]{3,})(?![a-zA-Zа-яА-ЯёЁ])/g)) {
		if (!STOP_WORDS.has(match[1])) {
			addMapping("COMPANY", match[1]);
		}
	}

	// Dot-separated org names (e.g. P2P.ORG, Mail.ru)
	// URLs are already caught above, so standalone dot-names are likely companies
	for (const match of text.matchAll(/(?<!\w)([A-Za-z0-9]{2,}\.[A-Za-z]{2,})(?!\w)/g)) {
		addMapping("COMPANY", match[1]);
	}

	// CamelCase / PascalCase multi-word company names (e.g. JetBrains, QuadCode, IdeaSpring)
	for (const match of text.matchAll(/\b([A-Z][a-z]+(?:[A-Z][a-z]+)+)\b/g)) {
		if (!STOP_WORDS.has(match[1])) {
			addMapping("COMPANY", match[1]);
		}
	}

	// Company names after prepositions "at/in/from" — catches single-word companies
	// like "at Monease", "in Quadcode", "from Google"
	for (const match of text.matchAll(/(?:^|\s)(?:at|in|from)\s+([A-ZА-ЯЁ][a-zа-яёA-Za-z]{2,}(?:\s+[A-ZА-ЯЁ][a-zа-яё]+){0,2})/gm)) {
		const candidate = match[1].trim();
		const words = candidate.split(/\s+/);
		const hasStopWord = words.some((w) => STOP_WORDS.has(w));
		if (!hasStopWord) {
			addMapping("COMPANY", candidate);
		}
	}

	// Company names with known suffixes (Ltd, Inc, Corp, etc.)
	for (const match of text.matchAll(/([A-Z][A-Za-z\s&]{1,30})\s+(?:Ltd|Inc|Corp|LLC|GmbH|AG|S\.A\.|PLC)\b/g)) {
		addMapping("COMPANY", match[0].trim());
	}

	// ── Major world cities (common ADDRESS PII) ──
	const MAJOR_CITIES = [
		"New York", "Los Angeles", "Chicago", "Houston", "Phoenix",
		"London", "Paris", "Berlin", "Tokyo", "Sydney",
		"Toronto", "Mumbai", "Dubai", "Singapore", "Seoul",
		"Moscow", "Beijing", "Shanghai", "Istanbul", "Cairo",
		"San Francisco", "Seattle", "Boston", "Miami", "Denver",
	];
	for (const city of MAJOR_CITIES) {
		if (text.includes(city)) {
			addMapping("ADDRESS", city);
		}
	}

	return mapping;
}

/**
 * Check if a value extracted by Ollama is a valid PII entity.
 * Filters out garbage like dates, numbers, job titles, and placeholder references.
 */
function isValidPiiValue(value: string): boolean {
	const trimmed = value.trim();
	if (trimmed.length < 2) return false;
	// Is a placeholder reference (e.g. [COMPANY_8])
	if (/\[[A-Z]+_\d+\]/.test(trimmed)) return false;
	// Is a plain number
	if (/^\d+([.,]\d+)?%?$/.test(trimmed)) return false;
	// Too long to be a name/company (likely a sentence or job title)
	if (trimmed.length > 50) return false;
	// Starts with a date month
	if (/^(january|february|march|april|may|june|july|august|september|october|november|december)/i.test(trimmed)) return false;
	// Starts with a year
	if (/^\d{4}\s*[-–—]/.test(trimmed)) return false;
	// Starts with a job title or education term
	if (/^(manager|director|lead|head|chief|senior|junior|engineer|analyst|specialist|consultant|architect|developer|intern|faculty|university|school|college)/i.test(trimmed)) return false;
	return true;
}

/**
 * Merge two PII mappings, re-keying entries from the second mapping
 * to avoid key collisions. Filters out invalid values and duplicates.
 */
function mergeMappings(
	baseMapping: Record<string, string>,
	newMapping: Record<string, string>,
): Record<string, string> {
	const merged = { ...baseMapping };
	const existingValues = new Set(
		Object.values(baseMapping).map((v) => v.toLowerCase()),
	);

	// Find max counter for each category in base mapping
	const maxCounters: Record<string, number> = {};
	for (const key of Object.keys(baseMapping)) {
		const match = key.match(/\[([A-Z]+)_(\d+)\]/);
		if (match) {
			const num = parseInt(match[2], 10);
			maxCounters[match[1]] = Math.max(maxCounters[match[1]] || 0, num);
		}
	}

	for (const [key, value] of Object.entries(newMapping)) {
		// Skip duplicates (case-insensitive)
		if (existingValues.has(value.toLowerCase())) continue;
		// Skip invalid values (garbage from Ollama)
		if (!isValidPiiValue(value)) continue;

		// Re-key to avoid collisions with base mapping
		const catMatch = key.match(/\[([A-Z]+)_\d+\]/);
		if (catMatch) {
			const category = catMatch[1];
			const nextNum = (maxCounters[category] || 0) + 1;
			maxCounters[category] = nextNum;
			merged[`[${category}_${nextNum}]`] = value;
		} else {
			merged[key] = value;
		}
		existingValues.add(value.toLowerCase());
	}

	return merged;
}

/**
 * Separate the user's instruction from the content to anonymize.
 * Prevents the instruction itself from being treated as PII.
 */
function separateInstructionFromContent(message: string): {
	instruction: string;
	content: string;
} {
	const patterns = [
		/^(summarize\s+[^\n]*)\n/i,
		/^(translate\s+[^\n]*)\n/i,
		/^(analyze\s+[^\n]*)\n/i,
		/^(write\s+[^\n]*)\n/i,
		/^(explain\s+[^\n]*)\n/i,
		/^(review\s+[^\n]*)\n/i,
		/^(make\s+(?:a\s+)?(?:summary|analysis|review)[^\n]*)\n/i,
	];

	for (const pattern of patterns) {
		const match = message.match(pattern);
		if (match) {
			return {
				instruction: match[1].trim(),
				content: message.slice(match[0].length).trim(),
			};
		}
	}

	return { instruction: "", content: message };
}

export async function sendSecureMessage(
	params: SecurePipelineParams,
): Promise<SecurePipelineResult> {
	const {
		userMessage,
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

		// ── Step 1: Anonymize via regex pre-extraction + Ollama LLM ──
		// Hybrid approach: regex catches obvious patterns (email, phone, telegram, URL),
		// Ollama catches semantic entities (person names, companies, addresses).
		const { instruction, content: contentToScan } = separateInstructionFromContent(userMessage);

		// 1a. Regex pre-extraction (instant, deterministic)
		const regexMapping = preExtractPII(contentToScan);

		console.group("[SecurePipeline] Step 1: Anonymization");
		console.log("Ollama model:", ollamaModel);
		console.log("Original user message:", userMessage);
		if (instruction) console.log("Separated instruction:", instruction);
		console.log("Regex pre-extracted PII:", regexMapping);

		// 1b. Send content to Ollama in chunks for semantic PII extraction.
		// Small models lose accuracy on long texts, so we split into ~2000-char chunks.
		const CHUNK_SIZE = 2000;

		// Pre-anonymize regex-found items so Ollama doesn't waste time on them
		let textForOllama = contentToScan;
		for (const [placeholder, original] of Object.entries(regexMapping)) {
			textForOllama = textForOllama.replaceAll(original, placeholder);
		}

		// Split into chunks, trying to break at newlines
		const chunks: string[] = [];
		let remaining = textForOllama;
		while (remaining.length > 0) {
			if (remaining.length <= CHUNK_SIZE) {
				chunks.push(remaining);
				break;
			}
			// Try to break at a newline near the chunk boundary
			let breakAt = remaining.lastIndexOf("\n", CHUNK_SIZE);
			if (breakAt < CHUNK_SIZE * 0.5) breakAt = CHUNK_SIZE; // No good newline, hard-break
			chunks.push(remaining.slice(0, breakAt));
			remaining = remaining.slice(breakAt);
		}

		let ollamaMapping: Record<string, string> = {};

		try {
			const ANONYMIZE_TIMEOUT_MS = 60_000;
			const timeoutId = setTimeout(() => abortController.abort(), ANONYMIZE_TIMEOUT_MS);

			try {
				for (let i = 0; i < chunks.length; i++) {
					if (abortController.signal.aborted) break;

					console.log(`Ollama chunk ${i + 1}/${chunks.length} (${chunks[i].length} chars)`);

					const anonymizeResponse = await ollamaChatCompletion(
						ollamaModel,
						[
							{ role: "system", content: anonymizePrompt },
							{
								role: "user",
								content: `---BEGIN TEXT---\n${chunks[i]}\n---END TEXT---`,
							},
						],
						{ signal: abortController.signal },
					);

					console.log(`Ollama chunk ${i + 1} response:`, anonymizeResponse);

					const parsed = parseMappingResponse(anonymizeResponse);
					if (parsed && Object.keys(parsed).length > 0) {
						ollamaMapping = mergeMappings(ollamaMapping, parsed);
					}
				}
			} finally {
				clearTimeout(timeoutId);
			}

			if (abortController.signal.aborted) {
				throw new Error(`Ollama anonymization timed out after ${ANONYMIZE_TIMEOUT_MS / 1000}s. Try a shorter message or a faster model.`);
			}

			console.log("Ollama extracted PII (all chunks merged):", ollamaMapping);
		} catch (error) {
			console.error("Ollama anonymization failed:", error);
			// Re-throw timeout/abort errors
			if (
				error instanceof Error &&
				(error.name === "CanceledError" || error.name === "AbortError" || error.message.includes("timed out"))
			) {
				throw error;
			}
			// If Ollama fails but regex found PII, continue with regex-only results
			if (Object.keys(regexMapping).length > 0) {
				console.warn("Falling back to regex-only PII extraction");
			} else {
				throw new Error(
					"Secure mode: anonymization failed. Cannot send unprotected data. Check that Ollama is running and has the selected model.",
				);
			}
		}

		// 1c. Merge regex + Ollama results
		const mapping = mergeMappings(regexMapping, ollamaMapping);
		console.log("Final merged PII mapping:", mapping, `(${Object.keys(mapping).length} entities)`);
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

		// In Secure Mode, send ONLY the current anonymized message — no conversation history.
		// Each message is independently anonymized with its own mapping, so previous messages'
		// PII would leak if re-sent with a different mapping. Privacy > context continuity.
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
