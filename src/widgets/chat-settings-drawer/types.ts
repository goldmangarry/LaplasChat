import type { ChatSettings } from "@/core/chat/types";

export type ChatSettingsDrawerProps = {
	isOpen: boolean;
	onClose: () => void;
	settings: ChatSettings;
	onSettingsChange: (settings: Partial<ChatSettings>) => void;
};