import { useQueryClient } from "@tanstack/react-query";
import { useNavigate } from "@tanstack/react-router";
import { useRef, useState } from "react";
import { useTranslation } from "react-i18next";
import { useSendMessage, useSendSecureMessage } from "@/core/api/chat/hooks";
import { useChatStore } from "@/core/chat/store";
import { useChatInputStore } from "../model/store";
import { FileUploadButton } from "./components/file-upload-button";
import { SecureToggle } from "./components/secure-toggle";
import { SecureModeModal } from "./components/secure-mode-modal";
import { DisableSecureModeModal } from "./components/disable-secure-mode-modal";
import { SendButton } from "./components/send-button";
import { UploadedFilesList } from "./components/uploaded-files-list";
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
		uploadedFiles,
		clearUploadedFiles,
	} = useChatInputStore();
	const {
		getCurrentSettings,
		updateCurrentSettings,
		activeDialogId,
		setActiveDialogId,
	} = useChatStore();

	const settings = getCurrentSettings();
	const isSecure = settings.has_encrypted_messages;

	const sendMessageMutation = useSendMessage();
	const sendSecureMessageMutation = useSendSecureMessage();

	const isLoading =
		sendMessageMutation.isPending || sendSecureMessageMutation.isPending;

	const handleSend = async () => {
		if (message.trim() && !isLoading) {
			const trimmedMessage = message.trim();

			// Очищаем input сразу
			clearMessage();

			// Сохраняем file_ids для текущего сообщения
			const fileIds = uploadedFiles.map((file) => file.file_id);

			// Очищаем загруженные файлы после начала отправки
			clearUploadedFiles();

			// Проверяем, нужно ли создать новый чат
			const isNewChat = !activeDialogId;
			let currentDialogId = activeDialogId;

			// Если это новый чат, создаем временный ID и сразу навигируем
			if (isNewChat) {
				const tempDialogId = `temp-${Date.now()}`;
				currentDialogId = tempDialogId;
				setActiveDialogId(tempDialogId);

				// Предзаполняем кеш для временного чата
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

			// Подготавливаем данные для запроса
			const modelId =
				webSearchEnabled && !settings.model.includes(":online")
					? `${settings.model}:online`
					: settings.model;

			const messageData = {
				model: modelId,
				message: trimmedMessage,
				max_tokens: settings.max_tokens,
				temperature: settings.temperature,
				// Добавляем dialog_id если есть активный диалог (но не временный)
				...(activeDialogId &&
					!activeDialogId.startsWith("temp-") && { dialog_id: activeDialogId }),
				// Добавляем file_ids если есть загруженные файлы
				...(fileIds.length > 0 && { file_ids: fileIds }),
			};

			try {
				if (isSecure) {
					const response =
						await sendSecureMessageMutation.mutateAsync(messageData);

					// Если это новый диалог и получили реальный dialog_id
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
				} else {
					const response = await sendMessageMutation.mutateAsync(messageData);

					// Если это новый диалог и получили реальный dialog_id
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
				}
			} catch (error) {
				console.error("Failed to send message:", error);
				// При ошибке в новом чате возвращаемся на главную
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
		// User confirmed - actually disable secure mode
		updateCurrentSettings({ has_encrypted_messages: false });
		setShowDisableSecureModal(false);
	};

	const handleCancelDisableSecureMode = () => {
		// User cancelled - keep secure mode enabled and close modal
		setShowDisableSecureModal(false);
	};

	return (
		<>
			<div className="flex flex-col w-full max-w-4xl">
				{/* Main Input Area */}
				<div className="flex flex-col bg-white border border-gray-200 border-b-0 rounded-t-2xl shadow-sm">
					<UploadedFilesList />
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
					<div className="flex items-center gap-2">
						<FileUploadButton disabled={isLoading} />
						<SecureToggle
							isSecure={isSecure}
							onToggle={(secure) => {
								if (secure) {
									// Enabling secure mode - show info modal and update settings
									updateCurrentSettings({ has_encrypted_messages: secure });
									setShowSecureModal(true);
								} else {
									// Disabling secure mode - show confirmation modal first
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

					<SendButton
						onSend={handleSend}
						disabled={!message.trim()}
						loading={isLoading}
					/>
				</div>
			</div>

			{/* Secure Mode Modal */}
			<SecureModeModal
				isOpen={showSecureModal}
				onClose={() => setShowSecureModal(false)}
			/>

			{/* Disable Secure Mode Confirmation Modal */}
			<DisableSecureModeModal
				isOpen={showDisableSecureModal}
				onCancel={handleCancelDisableSecureMode}
				onConfirm={handleDisableSecureMode}
			/>
		</>
	);
}
