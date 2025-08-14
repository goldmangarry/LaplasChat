/**
 * Генерация временного чата при отправке первого сообщения
 */
export const generateTempChat = (userMessage: string) => {
  const tempDialogId = `temp-${crypto.randomUUID()}`;
  const tempChatName = userMessage.slice(0, 50) + (userMessage.length > 50 ? '...' : '');
  return { tempDialogId, tempChatName };
};

/**
 * Обновление URL с временного ID на реальный без перезагрузки страницы
 */
export const updateUrlWithRealId = (tempId: string, realId: string) => {
  if (window.location.pathname === `/chat/${tempId}`) {
    window.history.replaceState(null, '', `/chat/${realId}`);
  }
};

/**
 * Проверка является ли ID временным
 */
export const isTempDialogId = (dialogId: string): boolean => {
  return dialogId.startsWith('temp-');
};

/**
 * Извлечение UUID из временного ID
 */
export const extractTempUuid = (tempId: string): string | null => {
  if (!isTempDialogId(tempId)) {
    return null;
  }
  return tempId.replace('temp-', '');
};