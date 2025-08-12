export const CHAT_ENDPOINTS = {
	HISTORY: "/api/chat/history",
	SEND_MESSAGE: "/api/chat",
	SEND_SECURE_MESSAGE: "/api/chat/secure-mode",
	CHAT_MESSAGES: (dialogId: string) => `/api/chat/history/${dialogId}`,
} as const;
