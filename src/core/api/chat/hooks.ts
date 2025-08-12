import { useMutation, useQuery } from "@tanstack/react-query";
import { chatApi } from "./index";
import type { SendMessageRequest } from "./types";

export const useChatHistory = () => {
	return useQuery({
		queryKey: ["chat", "history"],
		queryFn: () => chatApi.getHistory(),
		refetchOnWindowFocus: true, // Refetch when user returns to tab
	});
};

export const useSendMessage = () => {
	return useMutation({
		mutationFn: (messageData: SendMessageRequest) =>
			chatApi.sendMessage(messageData),
	});
};

export const useChatMessages = (dialogId: string) => {
	return useQuery({
		queryKey: ["chat", "messages", dialogId],
		queryFn: () => chatApi.getChatMessages(dialogId),
		enabled: !!dialogId, // Only run if dialogId is provided
	});
};

export const useSendSecureMessage = () => {
	return useMutation({
		mutationFn: (messageData: SendMessageRequest) =>
			chatApi.sendSecureMessage(messageData),
	});
};
