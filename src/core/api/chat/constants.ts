export const CHAT_ENDPOINTS = {
  HISTORY: "/api/chat/history",
  CHAT_MESSAGES: (dialogId: string) => `/api/chat/history/${dialogId}`,
  DELETE_CHAT: (dialogId: string) => `/api/chat/history/${dialogId}`,
  UPDATE_CHAT: (dialogId: string) => `/api/chat/history/${dialogId}`,
} as const;