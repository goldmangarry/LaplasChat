import axios from "axios";
import type { OllamaModel, PullProgress } from "./types";

const OLLAMA_BASE = "http://localhost:11434";

export async function checkOllamaHealth(): Promise<boolean> {
	try {
		const response = await axios.get(OLLAMA_BASE, { timeout: 3000 });
		return response.status === 200;
	} catch {
		return false;
	}
}

export async function listOllamaModels(): Promise<OllamaModel[]> {
	const response = await axios.get<{ models: OllamaModel[] }>(
		`${OLLAMA_BASE}/api/tags`,
		{ timeout: 5000 },
	);
	return response.data.models || [];
}

export async function pullOllamaModel(
	name: string,
	onProgress?: (progress: PullProgress) => void,
): Promise<void> {
	const response = await fetch(`${OLLAMA_BASE}/api/pull`, {
		method: "POST",
		headers: { "Content-Type": "application/json" },
		body: JSON.stringify({ name, stream: true }),
	});

	if (!response.ok) {
		throw new Error(`Failed to pull model: ${response.statusText}`);
	}

	const reader = response.body?.getReader();
	if (!reader) throw new Error("No response body");

	const decoder = new TextDecoder();
	let buffer = "";

	while (true) {
		const { done, value } = await reader.read();
		if (done) break;

		buffer += decoder.decode(value, { stream: true });
		const lines = buffer.split("\n");
		buffer = lines.pop() || "";

		for (const line of lines) {
			if (!line.trim()) continue;
			try {
				const data = JSON.parse(line);
				if (data.error) {
					throw new Error(data.error);
				}
				if (onProgress) {
					const completed = data.completed || 0;
					const total = data.total || 0;
					onProgress({
						status: data.status || "",
						completedBytes: completed,
						totalBytes: total,
						percent: total > 0 ? Math.round((completed / total) * 100) : 0,
					});
				}
			} catch (e) {
				if (e instanceof SyntaxError) continue;
				throw e;
			}
		}
	}
}

export async function deleteOllamaModel(name: string): Promise<void> {
	await axios.delete(`${OLLAMA_BASE}/api/delete`, {
		data: { name },
		timeout: 10000,
	});
}

export async function ollamaChatCompletion(
	model: string,
	messages: Array<{ role: string; content: string }>,
	options?: { temperature?: number },
): Promise<string> {
	const response = await axios.post(
		`${OLLAMA_BASE}/v1/chat/completions`,
		{
			model,
			messages,
			temperature: options?.temperature ?? 0.1,
			stream: false,
		},
		{ timeout: 120000 },
	);

	const content = response.data.choices?.[0]?.message?.content;
	if (!content) {
		throw new Error("No response from Ollama model");
	}
	return content;
}
