/**
 * Generate a temporary chat when sending the first message
 */
export const generateTempChat = (userMessage: string) => {
  const tempDialogId = `temp-${crypto.randomUUID()}`;
  const tempChatName = userMessage.slice(0, 50) + (userMessage.length > 50 ? '...' : '');
  return { tempDialogId, tempChatName };
};

/**
 * Update URL from temporary ID to real ID without page reload
 */
export const updateUrlWithRealId = (tempId: string, realId: string) => {
  if (window.location.pathname === `/chat/${tempId}`) {
    window.history.replaceState(null, '', `/chat/${realId}`);
  }
};

/**
 * Check if the ID is temporary
 */
export const isTempDialogId = (dialogId: string): boolean => {
  return dialogId.startsWith('temp-');
};

/**
 * Extract UUID from temporary ID
 */
export const extractTempUuid = (tempId: string): string | null => {
  if (!isTempDialogId(tempId)) {
    return null;
  }
  return tempId.replace('temp-', '');
};