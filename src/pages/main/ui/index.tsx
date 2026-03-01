import { useTranslation } from "react-i18next";
import { useNavigate } from "@tanstack/react-router";
import { ChatInput } from "@/features/chat-input";
import { ChatHeader } from "@/widgets/chat-header";
import { ChatSettingsDrawer } from "@/widgets/chat-settings-drawer";
import { useChatStore } from "@/core/chat/store";
import { useChatInputStore } from "@/features/chat-input/model/store";
import { useApiKeyStore } from "@/core/api-key";
import { useSendMessage } from "@/core/api/chat/hooks";
import { useQueryClient } from "@tanstack/react-query";
import type { MainPageProps } from "../types";
import type { ChatSettings } from "@/core/chat/types";
import { PromptSuggestion } from "./components/prompt-suggestion";
import { createDefaultSuggestions } from "./components/prompt-suggestion/constants";
import type { PromptSuggestionItem } from "./components/prompt-suggestion/types";
export const MainPage = (_props: MainPageProps) => {
	const { t } = useTranslation();
	const navigate = useNavigate();
	const queryClient = useQueryClient();
	const {
		getCurrentSettings,
		updateDefaultSettings,
		isSettingsDrawerOpen,
		setSettingsDrawerOpen,
		setActiveDialogId,
	} = useChatStore();
	const { getSecureModePrompt, getOllamaModel } = useApiKeyStore();

	const { setMessage, clearMessage, webSearchEnabled } = useChatInputStore();
	const sendMessageMutation = useSendMessage();

	const settings = getCurrentSettings();
	const suggestions = createDefaultSuggestions(t);

	const handleSettingsChange = (newSettings: Partial<ChatSettings>) => {
		updateDefaultSettings(newSettings);
	};

	const handleSuggestionClick = async (suggestion: PromptSuggestionItem) => {
		setMessage(suggestion.text);
		clearMessage();

		const tempDialogId = `temp-${Date.now()}`;
		setActiveDialogId(tempDialogId);

		queryClient.setQueryData(['chat', 'messages', tempDialogId], {
			messages: [{
				id: `temp-user-${Date.now()}`,
				content: suggestion.text,
				role: "user",
				timestamp: Date.now(),
			}],
			has_encrypted_messages: settings.has_encrypted_messages,
			last_model_info: null
		});

		navigate({ to: `/chat/${tempDialogId}` });

		const modelId = webSearchEnabled && !settings.model.includes(':online')
			? `${settings.model}:online`
			: settings.model;

		const messageData = {
			model: modelId,
			message: suggestion.text,
			max_tokens: settings.max_tokens,
			temperature: settings.temperature,
			...(settings.has_encrypted_messages && {
				secure_mode: true,
				secure_mode_prompt: getSecureModePrompt(),
				ollama_model: getOllamaModel(),
			}),
		};

		try {
			const response = await sendMessageMutation.mutateAsync(messageData);
			if (response.dialog_id && response.dialog_id !== tempDialogId) {
				setActiveDialogId(response.dialog_id);
				navigate({ to: `/chat/${response.dialog_id}`, replace: true });
			}
		} catch (error) {
			console.error("Failed to send message:", error);
			setActiveDialogId(null);
			navigate({ to: "/", replace: true });
		}
	};

	const handleOpenSettingsDrawer = () => {
		setSettingsDrawerOpen(true);
	};

	const handleCloseSettingsDrawer = () => {
		setSettingsDrawerOpen(false);
	};

	return (
		<div className="flex flex-col h-full">
			<ChatHeader
				settings={settings}
				onOpenSettingsDrawer={handleOpenSettingsDrawer}
			/>

			<div className="flex-1 flex items-center justify-center p-4">
				<div className="flex flex-col items-center max-w-4xl w-full">
					<div className="flex flex-col items-center mb-10">
						<img src="/logo.svg" alt="LaplasChat" className="w-14 h-14 mb-4" />
						<h1 className="text-[46px] font-bold leading-none tracking-normal text-center">
							<span className="text-[#6c56f0]">Laplas</span>Chat
						</h1>
					</div>

					<div className="w-full max-w-4xl mb-4">
						<PromptSuggestion
							suggestions={suggestions}
							onSuggestionClick={handleSuggestionClick}
						/>
					</div>

					<div className="w-full max-w-4xl">
						<ChatInput />
					</div>
				</div>
			</div>

			<ChatSettingsDrawer
				isOpen={isSettingsDrawerOpen}
				onClose={handleCloseSettingsDrawer}
				settings={settings}
				onSettingsChange={handleSettingsChange}
			/>
		</div>
	);
};
