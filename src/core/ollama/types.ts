export type OllamaModel = {
	name: string;
	size: number;
	modified_at: string;
	digest: string;
};

export type OllamaStatus = "not_installed" | "not_running" | "running" | "ready";

export type PullProgress = {
	status: string;
	completedBytes: number;
	totalBytes: number;
	percent: number;
};

export type RecommendedModel = {
	id: string;
	name: string;
	params: string;
	sizeBytes: number;
	description: string;
};

export const RECOMMENDED_MODELS: RecommendedModel[] = [
	{
		id: "qwen2.5:3b",
		name: "Qwen 2.5 3B",
		params: "3B",
		sizeBytes: 2_000_000_000,
		description: "Best for anonymization: structured JSON, multilingual",
	},
	{
		id: "gemma3:4b",
		name: "Gemma 3 4B",
		params: "4B",
		sizeBytes: 3_000_000_000,
		description: "Strong NER accuracy, good alternative",
	},
	{
		id: "phi4-mini",
		name: "Phi-4 Mini",
		params: "3.8B",
		sizeBytes: 2_500_000_000,
		description: "Best quality/size, strong reasoning",
	},
	{
		id: "llama3.2:3b",
		name: "Llama 3.2 3B",
		params: "3B",
		sizeBytes: 2_000_000_000,
		description: "Strong general-purpose, fast",
	},
	{
		id: "gemma3:1b",
		name: "Gemma 3 1B",
		params: "1B",
		sizeBytes: 815_000_000,
		description: "Ultra-light, fast on any hardware",
	},
	{
		id: "llama3.2:1b",
		name: "Llama 3.2 1B",
		params: "1B",
		sizeBytes: 1_300_000_000,
		description: "Compact and fast general-purpose",
	},
];

export const DEFAULT_OLLAMA_MODEL = "qwen2.5:3b";

export function formatBytes(bytes: number): string {
	if (bytes === 0) return "0 B";
	if (bytes < 1_000_000) return `${(bytes / 1_000).toFixed(0)} KB`;
	if (bytes < 1_000_000_000) return `${(bytes / 1_000_000).toFixed(0)} MB`;
	return `${(bytes / 1_000_000_000).toFixed(1)} GB`;
}

export type OllamaPlatform = "windows" | "mac" | "linux" | "unknown";

export function detectPlatform(): OllamaPlatform {
	const ua = navigator.userAgent.toLowerCase();
	if (ua.includes("win")) return "windows";
	if (ua.includes("mac")) return "mac";
	if (ua.includes("linux")) return "linux";
	return "unknown";
}

const OLLAMA_DOWNLOAD_URLS: Record<OllamaPlatform, string> = {
	windows: "https://github.com/ollama/ollama/releases/",
	mac: "https://github.com/ollama/ollama/releases/",
	linux: "https://github.com/ollama/ollama/releases/",
	unknown: "https://github.com/ollama/ollama/releases/",
};

const OLLAMA_PLATFORM_LABELS: Record<OllamaPlatform, string> = {
	windows: "Windows",
	mac: "macOS",
	linux: "Linux",
	unknown: "",
};

export function getOllamaDownloadUrl(): string {
	return OLLAMA_DOWNLOAD_URLS[detectPlatform()];
}

export function getOllamaPlatformLabel(): string {
	return OLLAMA_PLATFORM_LABELS[detectPlatform()];
}
