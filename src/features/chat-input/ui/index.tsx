import { useQueryClient } from "@tanstack/react-query";
import { useNavigate } from "@tanstack/react-router";
import { useRef, useState } from "react";
import { useTranslation } from "react-i18next";
import { useSendMessage } from "@/core/api/chat/hooks";
import { useApiKeyStore } from "@/core/api-key";
import { useChatStore } from "@/core/chat/store";
import { useChatInputStore } from "../model/store";
import { DisableSecureModeModal } from "./components/disable-secure-mode-modal";
import { MobileOptionsMenu } from "./components/mobile-options-menu";
import { MobileSecureIndicator } from "./components/mobile-secure-indicator";
import { MobileWebSearchIndicator } from "./components/mobile-websearch-indicator";
import { SecureModeModal } from "./components/secure-mode-modal";
import { SecureToggle } from "./components/secure-toggle";
import { SendButton } from "./components/send-button";
import { WebSearchButton } from "./components/web-search-button";

export function ChatInput() {
	const { t } = useTranslation();
	const navigate = useNavigate();
	const queryClient = useQueryClient();
	const textareaRef = useRef<HTMLTextAreaElement>(null);
	const [showSecureModal, setShowSecureModal] = useState(false);
	const [showDisableSecureModal, setShowDisableSecureModal] = useState(false);

	const {
		message,
		setMessage,
		clearMessage,
		webSearchEnabled,
		setWebSearchEnabled,
	} = useChatInputStore();
	const {
		getCurrentSettings,
		updateCurrentSettings,
		activeDialogId,
		setActiveDialogId,
	} = useChatStore();
	const { getSecureModePrompt, getOllamaModel } = useApiKeyStore();

	const settings = getCurrentSettings();
	const isSecure = settings.has_encrypted_messages;

	const sendMessageMutation = useSendMessage();

	const isLoading = sendMessageMutation.isPending;

	const handleSend = async () => {
		if (message.trim() && !isLoading) {
			const trimmedMessage = message.trim();

			// Clear input immediately
			clearMessage();

			// Check if we need to create a new chat
			const isNewChat = !activeDialogId;
			let currentDialogId = activeDialogId;

			// If this is a new chat, create a temporary ID and navigate immediately
			if (isNewChat) {
				const tempDialogId = `temp-${Date.now()}`;
				currentDialogId = tempDialogId;
				setActiveDialogId(tempDialogId);

				queryClient.setQueryData(["chat", "messages", tempDialogId], {
					messages: [
						{
							id: `temp-user-${Date.now()}`,
							content: trimmedMessage,
							role: "user",
							timestamp: Date.now(),
						},
					],
					has_encrypted_messages: settings.has_encrypted_messages,
					last_model_info: null,
				});

				navigate({ to: `/chat/${tempDialogId}` as any });
			}

			// Prepare request data
			const modelId =
				webSearchEnabled && !settings.model.includes(":online")
					? `${settings.model}:online`
					: settings.model;

			const messageData = {
				model: modelId,
				message: trimmedMessage,
				max_tokens: settings.max_tokens,
				temperature: settings.temperature,
				...(activeDialogId &&
					!activeDialogId.startsWith("temp-") && { dialog_id: activeDialogId }),
				// Pass secure mode flag and prompt
				...(isSecure && {
					secure_mode: true,
					secure_mode_prompt: getSecureModePrompt(),
					ollama_model: getOllamaModel(),
				}),
			};

			try {
				const response = await sendMessageMutation.mutateAsync(messageData);

				if (
					isNewChat &&
					response.dialog_id &&
					response.dialog_id !== currentDialogId
				) {
					setActiveDialogId(response.dialog_id);
					navigate({
						to: `/chat/${response.dialog_id}`,
						replace: true,
					} as any);
				}
			} catch (error) {
				console.error("Failed to send message:", error);
				if (isNewChat) {
					setActiveDialogId(null);
					navigate({ to: "/", replace: true } as any);
				}
			}
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

	const handleDisableSecureMode = () => {
		updateCurrentSettings({ has_encrypted_messages: false });
		setShowDisableSecureModal(false);
	};

	const handleCancelDisableSecureMode = () => {
		setShowDisableSecureModal(false);
	};

	return (
		<>
			<div className="flex flex-col w-full">
				<div className="flex flex-col bg-background border border-border border-b-0 rounded-t-2xl shadow-sm">
					<textarea
						ref={textareaRef}
						value={message}
						onChange={(e) => {
							setMessage(e.target.value);
							adjustTextareaHeight();
						}}
						onKeyDown={handleKeyDown}
						placeholder={isSecure ? t("chatInput.securePlaceholder", "Ask something privately....") : t("chatInput.placeholder", "Ask something....")}
						disabled={isLoading}
						className="w-full p-4 text-base resize-none bg-transparent outline-none placeholder:text-muted-foreground min-h-[80px] max-h-48 overflow-y-auto text-foreground"
					/>
				</div>

				{/* Bottom Controls */}
				<div className="flex items-center justify-between p-4 bg-background border border-border border-t-0 rounded-b-xl">
					{/* Desktop Controls */}
					<div className="hidden sm:flex items-center gap-2">
						<SecureToggle
							isSecure={isSecure}
							onToggle={(secure) => {
								if (secure) {
									updateCurrentSettings({ has_encrypted_messages: secure });
									setShowSecureModal(true);
								} else {
									setShowDisableSecureModal(true);
								}
							}}
							disabled={isLoading}
						/>
						<WebSearchButton
							isActive={webSearchEnabled}
							onToggle={setWebSearchEnabled}
							disabled={isLoading}
						/>
					</div>

					{/* Mobile Controls */}
					<div className="flex sm:hidden items-center gap-2">
						<MobileOptionsMenu
							isSecure={isSecure}
							onSecureToggle={(secure) => {
								if (secure) {
									updateCurrentSettings({ has_encrypted_messages: secure });
									setShowSecureModal(true);
								} else {
									setShowDisableSecureModal(true);
								}
							}}
							webSearchEnabled={webSearchEnabled}
							onWebSearchToggle={setWebSearchEnabled}
							disabled={isLoading}
						/>

						{isSecure && (
							<MobileSecureIndicator
								onClose={() => setShowDisableSecureModal(true)}
								disabled={isLoading}
							/>
						)}
						{webSearchEnabled && (
							<MobileWebSearchIndicator
								onClose={() => setWebSearchEnabled(false)}
								disabled={isLoading}
							/>
						)}
					</div>

					<SendButton
						onSend={handleSend}
						disabled={!message.trim()}
						loading={isLoading}
					/>
				</div>
			</div>

			<SecureModeModal
				isOpen={showSecureModal}
				onClose={() => setShowSecureModal(false)}
			/>

			<DisableSecureModeModal
				isOpen={showDisableSecureModal}
				onCancel={handleCancelDisableSecureMode}
				onConfirm={handleDisableSecureMode}
			/>
		</>
	);
}
