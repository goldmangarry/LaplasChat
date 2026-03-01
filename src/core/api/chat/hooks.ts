import {
	useMutation,
	useQuery,
	useQueryClient,
	useMutationState,
} from "@tanstack/react-query";
import { chatApi } from "./index";
import type {
	SendMessageRequest,
	ChatMessage,
	UpdateDialogNameRequest,
	ChatHistoryResponse,
	Dialog,
	ChatMessagesResponse,
	FactCheckRequest,
} from "./types";

export const useChatHistory = () => {
	return useQuery({
		queryKey: ["chat", "history"],
		queryFn: () => chatApi.getHistory(),
		refetchOnWindowFocus: true,
	});
};

export const useSendMessage = () => {
	const queryClient = useQueryClient();

	return useMutation({
		mutationFn: (messageData: SendMessageRequest) =>
			chatApi.sendMessage(messageData),
		mutationKey: ["sendMessage"],
		onMutate: async (messageData: SendMessageRequest) => {
			const dialogId = messageData.dialog_id;

			if (dialogId) {
				await queryClient.cancelQueries({
					queryKey: ["chat", "messages", dialogId],
				});

				const previousData = queryClient.getQueryData([
					"chat",
					"messages",
					dialogId,
				]);

				const optimisticUserMessage: ChatMessage = {
					id: `optimistic-user-${Date.now()}`,
					content: messageData.message,
					role: "user",
					timestamp: Date.now(),
				};

				queryClient.setQueryData(
					["chat", "messages", dialogId],
					(old: ChatMessagesResponse | undefined) => {
						if (!old) {
							return {
								messages: [optimisticUserMessage],
								has_encrypted_messages: false,
								last_model_info: null,
							};
						}
						return {
							...old,
							messages: [
								...(old.messages || []),
								optimisticUserMessage,
							],
						};
					},
				);

				return { previousData, dialogId, optimisticUserMessage };
			}

			return { messageData };
		},
		onError: (_err, _messageData, context) => {
			if (context?.dialogId && context.previousData) {
				queryClient.setQueryData(
					["chat", "messages", context.dialogId],
					context.previousData,
				);
			}
		},
		onSettled: async (data, _error, _messageData, context) => {
			// Invalidate messages for the dialog
			if (context?.dialogId) {
				queryClient.invalidateQueries({
					queryKey: ["chat", "messages", context.dialogId],
				});
			}

			if (data?.dialog_id) {
				// Refresh chat history sidebar
				queryClient.invalidateQueries({
					queryKey: ["chat", "history"],
				});

				// For new chats, also invalidate the new dialog's messages
				if (!context?.dialogId) {
					queryClient.invalidateQueries({
						queryKey: [
							"chat",
							"messages",
							data.dialog_id,
						],
					});
				}
			}
		},
	});
};

export const useChatMessages = (dialogId: string) => {
	return useQuery({
		queryKey: ["chat", "messages", dialogId],
		queryFn: async () => {
			const response = await chatApi.getChatMessages(dialogId);

			// Propagate last_model_info to assistant messages that don't have it
			const messagesWithModelInfo = response.messages.map((message) => {
				if (message.role === "assistant" && !message.last_model_info) {
					return {
						...message,
						last_model_info: response.last_model_info,
					};
				}
				return message;
			});

			return {
				...response,
				messages: messagesWithModelInfo,
			};
		},
		enabled: !!dialogId && !dialogId.startsWith("temp-"),
	});
};

// Unified send for both regular and secure mode
export const useSendSecureMessage = () => {
	// Secure mode now uses the same flow as regular messages
	// (secure_mode flag + system prompt is handled inside chatApi.sendMessage)
	return useSendMessage();
};

export const usePendingMessages = (dialogId: string) => {
	const pendingMutations = useMutationState({
		filters: {
			mutationKey: ["sendMessage"],
			status: "pending",
		},
		select: (mutation) => {
			const variables = mutation.state.variables as SendMessageRequest;
			if (dialogId.startsWith("temp-")) {
				return !variables?.dialog_id ? variables : undefined;
			}
			return variables?.dialog_id === dialogId ? variables : undefined;
		},
	});

	return pendingMutations.filter(
		(mutation): mutation is SendMessageRequest => mutation !== undefined,
	);
};

// Keep for backward compatibility — merged into usePendingMessages
export const usePendingSecureMessages = (dialogId: string) => {
	return usePendingMessages(dialogId);
};

export const useDeleteChatHistory = () => {
	const queryClient = useQueryClient();

	return useMutation({
		mutationFn: (dialogId: string) => chatApi.deleteChatHistory(dialogId),
		onSuccess: (_, dialogId) => {
			queryClient.removeQueries({
				queryKey: ["chat", "messages", dialogId],
			});
			queryClient.invalidateQueries({ queryKey: ["chat", "history"] });
		},
	});
};

export const useUpdateDialogName = () => {
	const queryClient = useQueryClient();

	return useMutation({
		mutationFn: ({
			dialogId,
			updateData,
		}: { dialogId: string; updateData: UpdateDialogNameRequest }) =>
			chatApi.updateDialogName(dialogId, updateData),
		onSuccess: (data, { dialogId }) => {
			queryClient.setQueryData(
				["chat", "history"],
				(old: ChatHistoryResponse | undefined) => {
					if (!old?.dialogs) return old;
					return {
						...old,
						dialogs: old.dialogs.map((dialog: Dialog) =>
							dialog.id === dialogId
								? { ...dialog, name: data.dialog_name }
								: dialog,
						),
					};
				},
			);
			queryClient.invalidateQueries({ queryKey: ["chat", "history"] });
		},
	});
};

export const useFactCheck = () => {
	return useMutation({
		mutationFn: (factCheckData: FactCheckRequest) =>
			chatApi.factCheck(factCheckData),
		mutationKey: ["factCheck"],
	});
};

export const useUploadFiles = () => {
	return useMutation({
		mutationFn: (files: File[]) => chatApi.uploadFiles(files),
		mutationKey: ["uploadFiles"],
	});
};
