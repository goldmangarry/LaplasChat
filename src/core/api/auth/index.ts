import { apiClient } from "../config";
import { AUTH_ENDPOINTS, LOGIN_FORM_CONFIG } from "./constants";
import type {
	ChangePasswordRequest,
	LoginRequest,
	LoginResponse,
	RefreshTokenRequest,
	RefreshTokenResponse,
	RegisterRequest,
} from "./types";

export const authApi = {
	async login(credentials: LoginRequest): Promise<LoginResponse> {
		const formData = new URLSearchParams({
			username: credentials.username,
			password: credentials.password,
			scope: LOGIN_FORM_CONFIG.SCOPE,
			client_id: LOGIN_FORM_CONFIG.CLIENT_ID,
			client_secret: LOGIN_FORM_CONFIG.CLIENT_SECRET,
		});

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

	async refreshToken(refreshToken: string): Promise<RefreshTokenResponse> {
		const response = await apiClient.post<RefreshTokenResponse>(
			AUTH_ENDPOINTS.REFRESH,
			{ refresh_token: refreshToken } satisfies RefreshTokenRequest,
			{
				headers: {
					"Content-Type": "application/json",
				},
			},
		);

		return response.data;
	},

	async register(userData: RegisterRequest): Promise<void> {
		await apiClient.post(AUTH_ENDPOINTS.REGISTER, userData, {
			headers: {
				"Content-Type": "application/json",
			},
		});
	},

	async changePassword(data: ChangePasswordRequest): Promise<void> {
		await apiClient.post(AUTH_ENDPOINTS.CHANGE_PASSWORD, data, {
			headers: {
				"Content-Type": "application/json",
			},
		});
	},
};

export * from "./constants";
export * from "./helpers";
export * from "./types";
