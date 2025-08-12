import { useState } from "react";
import { useTranslation } from "react-i18next";
import { ChatInput } from "@/features/chat-input";
import type { ChatSettings } from "@/widgets/chat-header";
import { ChatHeader } from "@/widgets/chat-header";
import { DEFAULT_CHAT_SETTINGS, type MainPageProps } from "../types";
import { PromptSuggestion } from "./components/prompt-suggestion";
import { createDefaultSuggestions } from "./components/prompt-suggestion/constants";
import type { PromptSuggestionItem } from "./components/prompt-suggestion/types";

export const MainPage = (_props: MainPageProps) => {
	const { t } = useTranslation();
	const [settings, setSettings] = useState<ChatSettings>(DEFAULT_CHAT_SETTINGS);

	const suggestions = createDefaultSuggestions(t);

	const handleSettingsChange = (newSettings: Partial<ChatSettings>) => {
		setSettings((prev) => ({ ...prev, ...newSettings }));
	};

	const handleSuggestionClick = (suggestion: PromptSuggestionItem) => {
		console.log("Clicked suggestion:", suggestion);
		// TODO: Здесь будет логика отправки сообщения
	};

	return (
		<div className="flex flex-col h-full">
			{/* Chat Header */}
			<ChatHeader settings={settings} onSettingsChange={handleSettingsChange} />

			{/* Main Welcome Content Area */}
			<div className="flex-1 flex items-center justify-center p-4">
				<div className="flex flex-col items-center max-w-4xl w-full">
					{/* LaplasChat Title */}
					<h1 className="text-[46px] font-bold leading-none tracking-normal text-center mb-10">
						LaplasChat
					</h1>

					{/* Prompt Suggestions */}
					<div className="w-full max-w-4xl mb-4">
						<PromptSuggestion
							suggestions={suggestions}
							onSuggestionClick={handleSuggestionClick}
						/>
					</div>

					{/* Chat Input */}
					<div className="w-full max-w-4xl">
						<ChatInput />
					</div>
				</div>
			</div>
		</div>
	);
};
