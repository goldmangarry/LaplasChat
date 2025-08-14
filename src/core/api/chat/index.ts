import { apiClient } from "../config";
import { CHAT_ENDPOINTS } from "./constants";
import type {
	ChatHistoryResponse,
	ChatMessagesResponse,
	SendMessageRequest,
	SendMessageResponse,
	SendSecureMessageResponse,
	UpdateDialogNameRequest,
	UpdateDialogNameResponse,
	FactCheckRequest,
	FactCheckResponse,
	UploadFilesResponse,
	FileDownloadResponse,
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

	updateDialogName: async (
		dialogId: string,
		updateData: UpdateDialogNameRequest,
	): Promise<UpdateDialogNameResponse> => {
		const response = await apiClient.put<UpdateDialogNameResponse>(
			CHAT_ENDPOINTS.UPDATE_DIALOG_NAME(dialogId),
			updateData,
			{
				headers: {
					"Content-Type": "application/json",
				},
			},
		);
		return response.data;
	},

	factCheck: async (
		factCheckData: FactCheckRequest,
	): Promise<FactCheckResponse> => {
		const response = await apiClient.post<FactCheckResponse>(
			CHAT_ENDPOINTS.FACT_CHECK,
			factCheckData,
			{
				headers: {
					"Content-Type": "application/json",
				},
			},
		);
		return response.data;
	},

	uploadFiles: async (files: File[]): Promise<UploadFilesResponse> => {
		const formData = new FormData();
		
		files.forEach((file) => {
			formData.append("files", file);
		});

		const response = await apiClient.post<UploadFilesResponse>(
			CHAT_ENDPOINTS.UPLOAD,
			formData,
			{
				headers: {
					"Content-Type": "multipart/form-data",
				},
			},
		);
		return response.data;
	},

	getFileDownloadUrl: async (fileId: string): Promise<FileDownloadResponse> => {
		const response = await apiClient.get<FileDownloadResponse>(
			CHAT_ENDPOINTS.FILE_DOWNLOAD(fileId),
		);
		return response.data;
	},
};
