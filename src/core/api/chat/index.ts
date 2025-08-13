import { apiClient } from "../config";
import { CHAT_ENDPOINTS } from "./constants";
import type {
	ChatHistoryResponse,
	ChatMessagesResponse,
	SendMessageRequest,
	SendMessageResponse,
	SendSecureMessageResponse,
} from "./types";

export const chatApi = {
	getHistory: async (): Promise<ChatHistoryResponse> => {
		const response = await apiClient.get<ChatHistoryResponse>(
			CHAT_ENDPOINTS.HISTORY,
		);
		return response.data;
	},

	sendMessage: async (
		messageData: SendMessageRequest,
	): Promise<SendMessageResponse> => {
		const response = await apiClient.post<SendMessageResponse>(
			CHAT_ENDPOINTS.SEND_MESSAGE,
			messageData,
			{
				headers: {
					"Content-Type": "application/json",
				},
			},
		);
		return response.data;
	},

	getChatMessages: async (dialogId: string): Promise<ChatMessagesResponse> => {
		const response = await apiClient.get<ChatMessagesResponse>(
			CHAT_ENDPOINTS.CHAT_MESSAGES(dialogId),
		);
		return response.data;
	},

	sendSecureMessage: async (
		messageData: SendMessageRequest,
	): Promise<SendSecureMessageResponse> => {
		const response = await apiClient.post<SendSecureMessageResponse>(
			CHAT_ENDPOINTS.SEND_SECURE_MESSAGE,
			messageData,
			{
				headers: {
					"Content-Type": "application/json",
				},
			},
		);
		return response.data;
	},

	deleteChatHistory: async (dialogId: string): Promise<void> => {
		await apiClient.delete(CHAT_ENDPOINTS.DELETE_CHAT_HISTORY(dialogId));
	},
};
