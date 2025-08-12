import type { ChatSettings } from "@/core/chat/types";

export type ChatSettingsPanelProps = {
	settings: ChatSettings;
	onSettingsChange: (settings: Partial<ChatSettings>) => void;
};