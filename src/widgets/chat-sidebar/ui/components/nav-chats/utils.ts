/**
 * Utility functions for chat navigation
 */

/**
 * Checks if a chat was updated within the last 7 days (this week)
 * @param updatedAt - ISO string date from the chat's updated_at field
 * @returns true if the chat was updated within the last 7 days, false otherwise
 */
export const isChatFromThisWeek = (updatedAt: string): boolean => {
  const chatDate = new Date(updatedAt);
  const now = new Date();
  const sevenDaysAgo = new Date(now.getTime() - 7 * 24 * 60 * 60 * 1000);
  
  return chatDate >= sevenDaysAgo;
};