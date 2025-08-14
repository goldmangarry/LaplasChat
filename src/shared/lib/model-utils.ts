/**
 * Removes the :online suffix from model ID for display purposes
 * @param modelId - The model ID that may contain :online suffix
 * @returns The model ID without :online suffix
 */
export const getDisplayModelId = (modelId: string): string => {
	return modelId.replace(':online', '');
};

/**
 * Checks if model ID has online suffix
 * @param modelId - The model ID to check
 * @returns True if model has :online suffix
 */
export const isOnlineModel = (modelId: string): boolean => {
	return modelId.includes(':online');
};