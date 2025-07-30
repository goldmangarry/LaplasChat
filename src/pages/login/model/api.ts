import { authApi } from "../../../core/api";
import type { LoginResponse, RefreshTokenResponse } from "./types";

export const loginRequest = async (
	username: string,
	password: string,
): Promise<LoginResponse> => {
	return authApi.login({ username, password });
};

export const refreshTokenRequest = async (
	refreshToken: string,
): Promise<RefreshTokenResponse> => {
	return authApi.refreshToken(refreshToken);
};
