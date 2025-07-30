export type Dialog = {
  dialog_id: string;
  dialog_name: string;
  llm_provider: string;
};

export type DialogHistoryResponse = {
  dialogs: Dialog[];
};

export type ChatMessage = {
  role: string;
  content: string;
};

export type ChatMessagesResponse = {
  messages: ChatMessage[];
};

export type UpdateDialogRequest = {
  dialog_name: string;
};

export type UpdateDialogResponse = {
  dialog_id: string;
  dialog_name: string;
  updated_at: string;
};