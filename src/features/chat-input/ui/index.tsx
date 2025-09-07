import { useQueryClient } from "@tanstack/react-query";
import { useNavigate } from "@tanstack/react-router";
import { useRef, useState } from "react";
import { useTranslation } from "react-i18next";
import { useSendMessage, useSendSecureMessage } from "@/core/api/chat/hooks";
import { useChatStore } from "@/core/chat/store";
import { useChatInputStore } from "../model/store";
import type { AttachedFile } from "@/core/api/chat/types";
import type { UploadedFileInfo } from "../model/types";
import { DisableSecureModeModal } from "./components/disable-secure-mode-modal";
import { FileUploadButton } from "./components/file-upload-button";
import { MobileOptionsMenu } from "./components/mobile-options-menu";
import { MobileSecureIndicator } from "./components/mobile-secure-indicator";
import { MobileWebSearchIndicator } from "./components/mobile-websearch-indicator";
import { SecureModeModal } from "./components/secure-mode-modal";
import { SecureToggle } from "./components/secure-toggle";
import { SendButton } from "./components/send-button";
import { UploadedFilesList } from "./components/uploaded-files-list";
import { WebSearchButton } from "./components/web-search-button";

// Helper функция для преобразования загруженных файлов в AttachedFile формат
const convertUploadedFilesToAttachedFiles = (uploadedFiles: UploadedFileInfo[]): AttachedFile[] => {
	return uploadedFiles.map(file => ({
		id: file.file_id,
		filename: file.filename,
		content_type: 'application/octet-stream', // Базовый тип, так как не храним его в UploadedFileInfo
		file_size: 0, // Размер не сохраняем в UploadedFileInfo
		created_at: new Date().toISOString(),
	}));
};

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

				// Преобразуем загруженные файлы в формат AttachedFile
				const attachedFiles = uploadedFiles.length > 0 
					? convertUploadedFilesToAttachedFiles(uploadedFiles)
					: undefined;

				// Предзаполняем кеш для временного чата
				queryClient.setQueryData(["chat", "messages", tempDialogId], {
					messages: [
						{
							id: `temp-user-${Date.now()}`,
							content: trimmedMessage,
							role: "user",
							timestamp: Date.now(),
							attached_files: attachedFiles,
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
			<div className="flex flex-col w-full">
				<div className="flex flex-col bg-background border border-border border-b-0 rounded-t-2xl shadow-sm">
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
						className="w-full p-4 text-xl resize-none bg-transparent outline-none placeholder:text-muted-foreground min-h-[80px] max-h-48 overflow-y-auto text-foreground"
					/>
				</div>

				{/* Bottom Controls */}
				<div className="flex items-center justify-between p-4 bg-background border border-border border-t-0 rounded-b-xl">
					{/* Desktop Controls */}
					<div className="hidden sm:flex items-center gap-2">
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

					{/* Mobile Controls */}
					<div className="flex sm:hidden items-center gap-2">
						<MobileOptionsMenu
							isSecure={isSecure}
							onSecureToggle={(secure) => {
								if (secure) {
									// Enabling secure mode - show info modal and update settings
									updateCurrentSettings({ has_encrypted_messages: secure });
									setShowSecureModal(true);
								} else {
									// Disabling secure mode - show confirmation modal first
									setShowDisableSecureModal(true);
								}
							}}
							webSearchEnabled={webSearchEnabled}
							onWebSearchToggle={setWebSearchEnabled}
							disabled={isLoading}
						/>
						
						{/* Mobile Mode Indicators */}
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
