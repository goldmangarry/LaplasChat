import axios from "axios";

const OPENROUTER_CHAT_URL = "https://openrouter.ai/api/v1/chat/completions";

type ChatCompletionMessage = {
	role: "system" | "user" | "assistant";
	content: string;
};

type ChatCompletionParams = {
	messages: ChatCompletionMessage[];
	model: string;
	temperature: number;
	maxTokens: number;
	apiKey: string;
};

type ChatCompletionResult = {
	content: string;
	model: string;
};

export async function sendChatCompletion(
	params: ChatCompletionParams,
): Promise<ChatCompletionResult> {
	const { messages, model, temperature, maxTokens, apiKey } = params;

	// Strip non-ASCII characters from API key (fixes copy-paste issues with hidden unicode)
	const cleanApiKey = apiKey.replace(/[^\x20-\x7E]/g, "").trim();

	const response = await axios.post(
		OPENROUTER_CHAT_URL,
		{
			model,
			messages,
			max_tokens: maxTokens,
			temperature,
		},
		{
			headers: {
				Authorization: `Bearer ${cleanApiKey}`,
				"Content-Type": "application/json",
				"HTTP-Referer": "https://laplaschat.com",
				"X-Title": "LaplasChat",
			},
			timeout: 300000, // 5 minutes for long responses
		},
	);

	const choice = response.data.choices?.[0];
	if (!choice?.message?.content) {
		throw new Error("No response content from model");
	}

	return {
		content: choice.message.content,
		model: response.data.model || model,
	};
}

// Fact check using Perplexity model via OpenRouter
export async function sendFactCheck(
	message: string,
	apiKey: string,
): Promise<{ response: string; annotations: Array<{ url: string; text: string; header: string }> }> {
	const result = await axios.post(
		OPENROUTER_CHAT_URL,
		{
			model: "perplexity/sonar",
			messages: [
				{
					role: "system",
					content:
						"You are a fact-checking assistant. Analyze the following text for factual accuracy. Provide your analysis and cite sources with URLs where possible. Format your response clearly.",
				},
				{ role: "user", content: message },
			],
			temperature: 0.1,
			max_tokens: 4000,
		},
		{
			headers: {
				Authorization: `Bearer ${apiKey}`,
				"Content-Type": "application/json",
				"HTTP-Referer": "https://laplaschat.com",
				"X-Title": "LaplasChat",
			},
			timeout: 120000,
		},
	);

	const content = result.data.choices?.[0]?.message?.content || "";

	// Parse citations from OpenRouter response (Perplexity includes these)
	const citations: string[] = result.data.citations || [];
	const annotations = citations.map((url: string) => {
		let hostname = "";
		try {
			hostname = new URL(url).hostname;
		} catch {
			hostname = url;
		}
		return { url, text: "", header: hostname };
	});

	return { response: content, annotations };
}
