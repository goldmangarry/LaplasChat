import { apiClient } from "../config";
import { CHAT_ENDPOINTS } from "./constants";
import type { ChatHistoryResponse } from "./types";

export const chatApi = {
	getHistory: async (): Promise<ChatHistoryResponse> => {
		const response = await apiClient.get<ChatHistoryResponse>(CHAT_ENDPOINTS.HISTORY);
		return response.data;
	},
};