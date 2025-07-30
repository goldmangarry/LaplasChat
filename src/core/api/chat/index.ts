import { apiClient } from "../config";
import { CHAT_ENDPOINTS } from "./constants";
import type { 
  DialogHistoryResponse, 
  ChatMessagesResponse,
  UpdateDialogRequest,
  UpdateDialogResponse 
} from "./types";

export const chatApi = {
  async getHistory(): Promise<DialogHistoryResponse> {
    const response = await apiClient.get<DialogHistoryResponse>(
      CHAT_ENDPOINTS.HISTORY
    );
    return response.data;
  },

  async getChatMessages(dialogId: string): Promise<ChatMessagesResponse> {
    const response = await apiClient.get<ChatMessagesResponse>(
      CHAT_ENDPOINTS.CHAT_MESSAGES(dialogId)
    );
    return response.data;
  },

  async deleteChat(dialogId: string): Promise<void> {
    await apiClient.delete(CHAT_ENDPOINTS.DELETE_CHAT(dialogId));
  },

  async updateChat(dialogId: string, data: UpdateDialogRequest): Promise<UpdateDialogResponse> {
    const response = await apiClient.put<UpdateDialogResponse>(
      CHAT_ENDPOINTS.UPDATE_CHAT(dialogId),
      data
    );
    return response.data;
  },
};

export * from "./constants";
export * from "./types";