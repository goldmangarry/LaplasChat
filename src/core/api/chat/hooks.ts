import { useMutation, useQuery, useQueryClient, useMutationState } from "@tanstack/react-query";
import { chatApi } from "./index";
import type { SendMessageRequest, ChatMessage } from "./types";

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
				queryClient.setQueryData(['chat', 'messages', dialogId], (old: any) => {
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
		onSettled: (data, _error, _messageData, context) => {
			if (context?.dialogId) {
				// Инвалидируем запрос сообщений для этого чата
				queryClient.invalidateQueries({ queryKey: ['chat', 'messages', context.dialogId] });
			}
			
			// Если получили новый dialog_id, инвалидируем историю чатов
			if (data?.dialog_id) {
				queryClient.invalidateQueries({ queryKey: ['chat', 'history'] });
				
				// Если это был новый чат (без dialog_id), устанавливаем данные для реального чата
				if (!context?.dialogId) {
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
							// Ответ ассистента из сервера
							{
								id: `assistant-${Date.now()}`,
								content: data.response,
								role: "assistant" as const,
								timestamp: Date.now(),
							}
						],
						has_encrypted_messages: false,
						last_model_info: null
					});
				}
			}
		},
	});
};

export const useChatMessages = (dialogId: string) => {
	return useQuery({
		queryKey: ["chat", "messages", dialogId],
		queryFn: () => chatApi.getChatMessages(dialogId),
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

				queryClient.setQueryData(['chat', 'messages', dialogId], (old: any) => {
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
		onSettled: (data, _error, _messageData, context) => {
			if (context?.dialogId) {
				queryClient.invalidateQueries({ queryKey: ['chat', 'messages', context.dialogId] });
			}
			
			// Если получили новый dialog_id, инвалидируем историю чатов
			if (data?.dialog_id) {
				queryClient.invalidateQueries({ queryKey: ['chat', 'history'] });
				
				// Если это был новый чат (без dialog_id), устанавливаем данные для реального чата
				if (!context?.dialogId) {
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
							// Ответ ассистента из сервера (для secure используем decrypted_response)
							{
								id: `assistant-${Date.now()}`,
								content: data.decrypted_response,
								role: "assistant" as const,
								timestamp: Date.now(),
							}
						],
						has_encrypted_messages: true,
						last_model_info: null
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
