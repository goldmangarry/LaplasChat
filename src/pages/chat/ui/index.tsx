import { useEffect, useState } from "react";
import { useChatHistory, useFactCheck } from "@/core/api/chat/hooks";
import { useChatStore } from "@/core/chat/store";
import { ChatInput } from "@/features/chat-input";
import { ChatHeader } from "@/widgets/chat-header";
import { ChatSettingsDrawer } from "@/widgets/chat-settings-drawer";
import { FactCheckDrawer } from "@/widgets/fact-check-drawer";
import type { ChatPageProps } from "../types";
import { MessageList } from "./components/message-list";

export const ChatPage = ({ dialogId }: ChatPageProps) => {
	const {
		getCurrentSettings,
		updateCurrentSettings,
		setActiveDialogId,
		applyChatSettingsFromDialog,
	} = useChatStore();
	const { data: chatHistory } = useChatHistory();
	const [isSettingsOpen, setIsSettingsOpen] = useState(false);
	const [factCheckMessage, setFactCheckMessage] = useState("");
	const factCheckMutation = useFactCheck();

	// Применяем настройки чата при монтировании или изменении dialogId
	useEffect(() => {
		if (dialogId && chatHistory?.dialogs) {
			setActiveDialogId(dialogId);
			const currentChat = chatHistory.dialogs.find(
				(dialog) => dialog.id === dialogId,
			);
			if (currentChat) {
				applyChatSettingsFromDialog(currentChat);
			}
		}
	}, [dialogId, chatHistory, setActiveDialogId, applyChatSettingsFromDialog]);

	const settings = getCurrentSettings();

	// Обработчик для fact check
	const handleFactCheck = (message: string) => {
		setFactCheckMessage(message);
		factCheckMutation.mutate({ message });
	};

	return (
		<div key={dialogId} className="flex h-full flex-col">
			<ChatHeader
				settings={settings}
				onOpenSettingsDrawer={() => setIsSettingsOpen(true)}
			/>

			<div className="flex flex-col flex-1 px-4 sm:px-[10%] min-h-0">
				<div className="flex-1 overflow-hidden">
					<MessageList
						key={dialogId} 
						dialogId={dialogId} 
						onFactCheck={handleFactCheck}
					/>
				</div>

				<div className="flex-shrink-0 p-0 sm:px-4 py-4">
					<ChatInput />
				</div>
			</div>

			<ChatSettingsDrawer
				isOpen={isSettingsOpen}
				onClose={() => setIsSettingsOpen(false)}
				settings={settings}
				onSettingsChange={updateCurrentSettings}
			/>

			<FactCheckDrawer
				isOpen={factCheckMessage !== ""}
				onClose={() => setFactCheckMessage("")}
				factCheckMutation={factCheckMutation}
			/>
		</div>
	);
};
