import type { ChatSettings } from "@/widgets/chat-header";

export type MainPageProps = Record<string, never>;

export const DEFAULT_CHAT_SETTINGS: ChatSettings = {
	model: "openai/gpt-5-chat",
	provider: "openai",
	max_tokens: 4000,
	temperature: 0.7,
	has_encrypted_messages: false,
};
