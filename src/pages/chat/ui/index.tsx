import { useState, useEffect } from "react";
import { useChatStore } from "@/core/chat/store";
import { useChatHistory } from "@/core/api/chat/hooks";
import { ChatInput } from "@/features/chat-input";
import { ChatHeader } from "@/widgets/chat-header";
import { ChatSettingsDrawer } from "@/widgets/chat-settings-drawer";
import type { ChatPageProps } from "../types";
import { MessageList } from "./components/message-list";

export const ChatPage = ({ dialogId }: ChatPageProps) => {
	const { getCurrentSettings, updateCurrentSettings, setActiveDialogId, applyChatSettingsFromDialog } = useChatStore();
	const { data: chatHistory } = useChatHistory();
	const [isSettingsOpen, setIsSettingsOpen] = useState(false);

	// Применяем настройки чата при монтировании или изменении dialogId
	useEffect(() => {
		if (dialogId && chatHistory?.dialogs) {
			setActiveDialogId(dialogId);
			const currentChat = chatHistory.dialogs.find(dialog => dialog.id === dialogId);
			if (currentChat) {
				applyChatSettingsFromDialog(currentChat);
			}
		}
	}, [dialogId, chatHistory, setActiveDialogId, applyChatSettingsFromDialog]);

	const settings = getCurrentSettings();

	return (
		<div key={dialogId} className="flex h-full flex-col">
			<ChatHeader
				settings={settings}
				onOpenSettingsDrawer={() => setIsSettingsOpen(true)}
			/>

			<div className="flex-1 overflow-hidden px-[15%]">
				<MessageList dialogId={dialogId} />
			</div>

			<div className="p-4 px-[15%]">
				<ChatInput />
			</div>

			<ChatSettingsDrawer
				isOpen={isSettingsOpen}
				onClose={() => setIsSettingsOpen(false)}
				settings={settings}
				onSettingsChange={updateCurrentSettings}
			/>
		</div>
	);
};
