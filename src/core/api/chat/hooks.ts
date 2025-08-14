import { useMutation, useQuery, useQueryClient, useMutationState } from "@tanstack/react-query";
import { chatApi } from "./index";
import { modelsApi } from "../models/index";
import { getDisplayModelId } from "@/shared/lib/model-utils";
import type { SendMessageRequest, ChatMessage, ModelInfo, UpdateDialogNameRequest, ChatHistoryResponse, Dialog, ChatMessagesResponse, FactCheckRequest } from "./types";

export const useChatHistory = () => {
	return useQuery({
		queryKey: ["chat", "history"],
		queryFn: () => chatApi.getHistory(),
		refetchOnWindowFocus: true, // Refetch when user returns to tab
	});
};

export const useSendMessage = () => {
	const queryClient = useQueryClient();

	return useMutation({
		mutationFn: (messageData: SendMessageRequest) =>
			chatApi.sendMessage(messageData),
		mutationKey: ['sendMessage'],
		// Оптимистичные обновления
		onMutate: async (messageData: SendMessageRequest) => {
			const dialogId = messageData.dialog_id;
			
			// Если есть dialogId, обновляем существующий чат
			if (dialogId) {
				// Отменяем исходящие запросы для этого чата
				await queryClient.cancelQueries({ queryKey: ['chat', 'messages', dialogId] });

				// Сохраняем предыдущие данные чата
				const previousData = queryClient.getQueryData(['chat', 'messages', dialogId]);

				// Создаем оптимистичное сообщение пользователя
				const optimisticUserMessage: ChatMessage = {
					id: `optimistic-user-${Date.now()}`,
					content: messageData.message,
					role: "user",
					timestamp: Date.now(),
				};

				// Добавляем оптимистичное сообщение в кеш
				queryClient.setQueryData(['chat', 'messages', dialogId], (old: ChatMessagesResponse | undefined) => {
					if (!old) {
						// Если данных нет, создаем базовую структуру
						return {
							messages: [optimisticUserMessage],
							has_encrypted_messages: false,
							last_model_info: null
						};
					}
					
					// Если есть данные, добавляем к существующим сообщениям
					return {
						...old,
						messages: [...(old.messages || []), optimisticUserMessage]
					};
				});

				return { previousData, dialogId, optimisticUserMessage };
			}

			// Для новых чатов просто возвращаем данные сообщения
			return { messageData };
		},
		// При ошибке откатываем изменения
		onError: (_err, _messageData, context) => {
			if (context?.dialogId && context.previousData) {
				queryClient.setQueryData(['chat', 'messages', context.dialogId], context.previousData);
			}
		},
		// После успеха или ошибки обновляем данные
		onSettled: async (data, _error, _messageData, context) => {
			if (context?.dialogId) {
				// Инвалидируем запрос сообщений для этого чата
				queryClient.invalidateQueries({ queryKey: ['chat', 'messages', context.dialogId] });
			}
			
			// Если получили новый dialog_id, инвалидируем историю чатов
			if (data?.dialog_id) {
				queryClient.invalidateQueries({ queryKey: ['chat', 'history'] });
				
				// Если это был новый чат (без dialog_id), устанавливаем данные для реального чата
				if (!context?.dialogId) {
					// Получаем информацию о модели из запроса
					let modelInfo: ModelInfo | null = null;
					try {
						const modelsData = await modelsApi.getModels();
						const displayModelId = getDisplayModelId(_messageData.model);
						const targetModel = modelsData.models.find(model => model.id === displayModelId);
						if (targetModel) {
							modelInfo = {
								id: targetModel.id,
								name: targetModel.name,
								provider: targetModel.provider,
								max_output: _messageData.max_tokens,
								temperature: _messageData.temperature
							};
						}
					} catch (error) {
						console.warn('Failed to fetch model info for new chat:', error);
					}

					// Создаем данные для нового чата с ответом сервера
					queryClient.setQueryData(['chat', 'messages', data.dialog_id], {
						messages: [
							// Сообщение пользователя
							{
								id: `user-${Date.now()}`,
								content: _messageData.message,
								role: "user" as const,
								timestamp: Date.now(),
							},
							// Ответ ассистента из сервера с информацией о модели
							{
								id: `assistant-${Date.now()}`,
								content: data.response,
								role: "assistant" as const,
								timestamp: Date.now(),
								last_model_info: modelInfo
							}
						],
						has_encrypted_messages: false,
						last_model_info: modelInfo
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
			
			// Прокидываем last_model_info в каждое сообщение ассистента
			const messagesWithModelInfo = response.messages.map(message => {
				if (message.role === 'assistant' && !message.last_model_info) {
					return {
						...message,
						last_model_info: response.last_model_info
					};
				}
				return message;
			});
			
			return {
				...response,
				messages: messagesWithModelInfo
			};
		},
		enabled: !!dialogId && !dialogId.startsWith('temp-'), // Отключаем запросы для временных чатов
	});
};

export const useSendSecureMessage = () => {
	const queryClient = useQueryClient();

	return useMutation({
		mutationFn: (messageData: SendMessageRequest) =>
			chatApi.sendSecureMessage(messageData),
		mutationKey: ['sendSecureMessage'],
		// Аналогичная логика оптимистичных обновлений
		onMutate: async (messageData: SendMessageRequest) => {
			const dialogId = messageData.dialog_id;
			
			if (dialogId) {
				await queryClient.cancelQueries({ queryKey: ['chat', 'messages', dialogId] });
				const previousData = queryClient.getQueryData(['chat', 'messages', dialogId]);

				const optimisticUserMessage: ChatMessage = {
					id: `optimistic-user-${Date.now()}`,
					content: messageData.message,
					role: "user",
					timestamp: Date.now(),
				};

				queryClient.setQueryData(['chat', 'messages', dialogId], (old: ChatMessagesResponse | undefined) => {
					if (!old) {
						return {
							messages: [optimisticUserMessage],
							has_encrypted_messages: false,
							last_model_info: null
						};
					}
					
					return {
						...old,
						messages: [...(old.messages || []), optimisticUserMessage]
					};
				});

				return { previousData, dialogId, optimisticUserMessage };
			}

			return { messageData };
		},
		onError: (_err, _messageData, context) => {
			if (context?.dialogId && context.previousData) {
				queryClient.setQueryData(['chat', 'messages', context.dialogId], context.previousData);
			}
		},
		onSettled: async (data, _error, _messageData, context) => {
			if (context?.dialogId) {
				// Для существующих чатов с secure сообщениями
				if (data && !_error && 'encrypted_response' in data) {
					// Получаем информацию о модели
					let modelInfo: ModelInfo | null = null;
					try {
						const modelsData = await modelsApi.getModels();
						const displayModelId = getDisplayModelId(_messageData.model);
						const targetModel = modelsData.models.find(model => model.id === displayModelId);
						if (targetModel) {
							modelInfo = {
								id: targetModel.id,
								name: targetModel.name,
								provider: targetModel.provider,
								max_output: _messageData.max_tokens,
								temperature: _messageData.temperature
							};
						}
					} catch (error) {
						console.warn('Failed to fetch model info for existing secure chat:', error);
					}

					// Обновляем кеш: добавляем encrypted_content к пользовательскому сообщению и ответ ассистента
					queryClient.setQueryData(['chat', 'messages', context.dialogId], (old: ChatMessagesResponse | undefined) => {
						if (!old) return old;
						
						const updatedMessages = [...old.messages];
						
						// Находим последнее сообщение пользователя (оптимистичное) и добавляем к нему encrypted_content
						let userMessageIndex = -1;
						for (let i = updatedMessages.length - 1; i >= 0; i--) {
							if (updatedMessages[i].role === 'user') {
								userMessageIndex = i;
								break;
							}
						}
						if (userMessageIndex !== -1) {
							updatedMessages[userMessageIndex] = {
								...updatedMessages[userMessageIndex],
								encrypted_content: data.encrypted_response
							};
						}
						
						// Добавляем ответ ассистента
						const assistantMessage: ChatMessage = {
							id: `assistant-${Date.now()}`,
							content: data.decrypted_response,
							role: "assistant",
							timestamp: Date.now(),
							last_model_info: modelInfo || undefined
						};
						
						updatedMessages.push(assistantMessage);
						
						return {
							...old,
							messages: updatedMessages,
							last_model_info: modelInfo || old.last_model_info
						};
					});
				} else {
					// При ошибке или для обычных сообщений - инвалидируем
					queryClient.invalidateQueries({ queryKey: ['chat', 'messages', context.dialogId] });
				}
			}
			
			// Если получили новый dialog_id, инвалидируем историю чатов
			if (data?.dialog_id) {
				queryClient.invalidateQueries({ queryKey: ['chat', 'history'] });
				
				// Если это был новый чат (без dialog_id), устанавливаем данные для реального чата
				if (!context?.dialogId) {
					// Получаем информацию о модели из запроса
					let modelInfo: ModelInfo | null = null;
					try {
						const modelsData = await modelsApi.getModels();
						const displayModelId = getDisplayModelId(_messageData.model);
						const targetModel = modelsData.models.find(model => model.id === displayModelId);
						if (targetModel) {
							modelInfo = {
								id: targetModel.id,
								name: targetModel.name,
								provider: targetModel.provider,
								max_output: _messageData.max_tokens,
								temperature: _messageData.temperature
							};
						}
					} catch (error) {
						console.warn('Failed to fetch model info for secure new chat:', error);
					}

					// Создаем данные для нового чата с ответом сервера
					queryClient.setQueryData(['chat', 'messages', data.dialog_id], {
						messages: [
							// Сообщение пользователя с encrypted_content
							{
								id: `user-${Date.now()}`,
								content: _messageData.message,
								role: "user" as const,
								timestamp: Date.now(),
								encrypted_content: 'encrypted_response' in data ? data.encrypted_response : undefined,
							},
							// Ответ ассистента из сервера (для secure используем decrypted_response) с информацией о модели
							{
								id: `assistant-${Date.now()}`,
								content: data.decrypted_response,
								role: "assistant" as const,
								timestamp: Date.now(),
								last_model_info: modelInfo
							}
						],
						has_encrypted_messages: true,
						last_model_info: modelInfo
					});
				}
			}
		},
	});
};

// Хук для получения pending мутаций отправки сообщений
export const usePendingMessages = (dialogId: string) => {
	const pendingMutations = useMutationState({
		filters: { 
			mutationKey: ['sendMessage'], 
			status: 'pending' 
		},
		select: (mutation) => {
			const variables = mutation.state.variables as SendMessageRequest;
			// Для временных чатов проверяем мутации без dialog_id (новые чаты)
			// Для обычных чатов - только с соответствующим dialog_id
			if (dialogId.startsWith('temp-')) {
				return !variables?.dialog_id ? variables : undefined;
			} else {
				return variables?.dialog_id === dialogId ? variables : undefined;
			}
		},
	});
	
	return pendingMutations.filter((mutation): mutation is SendMessageRequest => mutation !== undefined);
};

// Аналогично для secure сообщений
export const usePendingSecureMessages = (dialogId: string) => {
	const pendingMutations = useMutationState({
		filters: { 
			mutationKey: ['sendSecureMessage'], 
			status: 'pending' 
		},
		select: (mutation) => {
			const variables = mutation.state.variables as SendMessageRequest;
			// Для временных чатов проверяем мутации без dialog_id (новые чаты)
			// Для обычных чатов - только с соответствующим dialog_id
			if (dialogId.startsWith('temp-')) {
				return !variables?.dialog_id ? variables : undefined;
			} else {
				return variables?.dialog_id === dialogId ? variables : undefined;
			}
		},
	});
	
	return pendingMutations.filter((mutation): mutation is SendMessageRequest => mutation !== undefined);
};

export const useDeleteChatHistory = () => {
	const queryClient = useQueryClient();

	return useMutation({
		mutationFn: (dialogId: string) => chatApi.deleteChatHistory(dialogId),
		onSuccess: (_, dialogId) => {
			// Удаляем данные чата из кеша
			queryClient.removeQueries({ queryKey: ["chat", "messages", dialogId] });
			
			// Инвалидируем историю чатов для обновления списка
			queryClient.invalidateQueries({ queryKey: ["chat", "history"] });
		},
	});
};

export const useUpdateDialogName = () => {
	const queryClient = useQueryClient();

	return useMutation({
		mutationFn: ({ dialogId, updateData }: { dialogId: string; updateData: UpdateDialogNameRequest }) =>
			chatApi.updateDialogName(dialogId, updateData),
		onSuccess: (data, { dialogId }) => {
			// Обновляем кеш истории чатов с новым именем диалога
			queryClient.setQueryData(['chat', 'history'], (old: ChatHistoryResponse | undefined) => {
				if (!old?.dialogs) return old;
				
				return {
					...old,
					dialogs: old.dialogs.map((dialog: Dialog) =>
						dialog.id === dialogId
							? { ...dialog, name: data.dialog_name }
							: dialog
					),
				};
			});
			
			// Инвалидируем историю чатов для обновления
			queryClient.invalidateQueries({ queryKey: ["chat", "history"] });
		},
	});
};

export const useFactCheck = () => {
	return useMutation({
		mutationFn: (factCheckData: FactCheckRequest) => chatApi.factCheck(factCheckData),
		mutationKey: ['factCheck'],
	});
};

export const useUploadFiles = () => {
	return useMutation({
		mutationFn: (files: File[]) => chatApi.uploadFiles(files),
		mutationKey: ['uploadFiles'],
	});
};

export const useFileDownloadUrl = (fileId: string) => {
	return useQuery({
		queryKey: ["chat", "file", "download", fileId],
		queryFn: () => chatApi.getFileDownloadUrl(fileId),
		enabled: !!fileId,
		staleTime: 0, // Всегда запрашиваем свежую ссылку
		gcTime: 0, // Не кешируем результат
	});
};
