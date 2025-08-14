import { apiClient } from "../config";
import { AUTH_ENDPOINTS } from "./constants";
import type { LoginRequest, LoginResponse, UserProfile, RefreshTokenRequest, RefreshTokenResponse, ChangePasswordRequest, ChangePasswordResponse } from "./types";

export const authApi = {
	login: async (credentials: LoginRequest): Promise<LoginResponse> => {
		const formData = new URLSearchParams();
		formData.append("username", credentials.username);
		formData.append("password", credentials.password);
		formData.append("grant_type", "password");

		const response = await apiClient.post<LoginResponse>(
			AUTH_ENDPOINTS.LOGIN,
			formData,
			{
				headers: {
					"Content-Type": "application/x-www-form-urlencoded",
				},
			},
		);

		return response.data;
	},

	me: async (): Promise<UserProfile> => {
		const response = await apiClient.get<UserProfile>(AUTH_ENDPOINTS.ME);
		return response.data;
	},

	refreshToken: async (request: RefreshTokenRequest): Promise<RefreshTokenResponse> => {
		const response = await apiClient.post<RefreshTokenResponse>(
			AUTH_ENDPOINTS.REFRESH,
			request,
			{
				headers: {
					"Content-Type": "application/json",
				},
			},
		);
		return response.data;
	},

	changePassword: async (request: ChangePasswordRequest): Promise<ChangePasswordResponse> => {
		const response = await apiClient.post<ChangePasswordResponse>(
			AUTH_ENDPOINTS.CHANGE_PASSWORD,
			request,
			{
				headers: {
					"Content-Type": "application/json",
				},
			},
		);
		return response.data;
	},
};
