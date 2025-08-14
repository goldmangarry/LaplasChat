import { apiClient } from "../config";
import { MODELS_ENDPOINTS } from "./constants";
import type { ModelsResponse } from "./types";

export const modelsApi = {
	getModels: async (): Promise<ModelsResponse> => {
		const response = await apiClient.get<ModelsResponse>(MODELS_ENDPOINTS.LIST);
		return response.data;
	},
};
