export const CHAT_ENDPOINTS = {
	HISTORY: "/api/chat/history",
	SEND_MESSAGE: "/api/chat",
	SEND_SECURE_MESSAGE: "/api/chat/secure-mode",
	FACT_CHECK: "/api/chat/fact-check",
	UPLOAD: "/api/chat/upload",
	CHAT_MESSAGES: (dialogId: string) => `/api/chat/history/${dialogId}`,
	DELETE_CHAT_HISTORY: (dialogId: string) => `/api/chat/history/${dialogId}`,
	UPDATE_DIALOG_NAME: (dialogId: string) => `/api/chat/history/${dialogId}`,
	FILE_DOWNLOAD: (fileId: string) => `/api/chat/files/${fileId}/download`,
} as const;
