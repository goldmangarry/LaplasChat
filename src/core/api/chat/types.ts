export type Dialog = {
  id: string;
  name: string;
  llm_provider: string;
  has_encrypted_messages: boolean;
  last_model_info: {
    id: string;
    name: string;
    provider: string;
    max_tokens: number;
    temperature: number;
  };
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