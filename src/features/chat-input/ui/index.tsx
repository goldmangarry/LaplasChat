import { useRef, useState } from "react";
import { useTranslation } from "react-i18next";
import { useChatInputStore } from "../model/store";
import { SecureToggle } from "./components/secure-toggle";
import { SendButton } from "./components/send-button";

export function ChatInput() {
	const { t } = useTranslation();
	const [isSecure, setIsSecure] = useState(false);
	const textareaRef = useRef<HTMLTextAreaElement>(null);

	const { message, isLoading, setMessage, sendMessage } = useChatInputStore();

	const handleSend = async () => {
		if (message.trim() && !isLoading) {
			await sendMessage(message.trim());
		}
	};

	const handleKeyDown = (e: React.KeyboardEvent) => {
		if (e.key === "Enter" && !e.shiftKey) {
			e.preventDefault();
			handleSend();
		}
	};

	const adjustTextareaHeight = () => {
		const textarea = textareaRef.current;
		if (textarea) {
			textarea.style.height = "auto";
			textarea.style.height = `${textarea.scrollHeight}px`;
		}
	};

	return (
		<div className="flex flex-col w-full max-w-4xl">
			{/* Main Input Area */}
			<div className="flex flex-col bg-white border border-gray-200 border-b-0 rounded-t-2xl shadow-sm">
				<textarea
					ref={textareaRef}
					value={message}
					onChange={(e) => {
						setMessage(e.target.value);
						adjustTextareaHeight();
					}}
					onKeyDown={handleKeyDown}
					placeholder={t("chatInput.placeholder", "Спросите что-нибудь....")}
					disabled={isLoading}
					className="w-full p-4 text-xl resize-none bg-transparent outline-none placeholder:text-neutral-500 min-h-[80px] max-h-48 overflow-y-auto"
				/>
			</div>

			{/* Bottom Controls */}
			<div className="flex items-center justify-between p-4 bg-white border border-gray-200 border-t-0 rounded-b-xl">
				<div className="flex items-center gap-1">
					<SecureToggle
						isSecure={isSecure}
						onToggle={setIsSecure}
						disabled={isLoading}
					/>
				</div>

				<SendButton
					onSend={handleSend}
					disabled={!message.trim()}
					loading={isLoading}
				/>
			</div>
		</div>
	);
}
