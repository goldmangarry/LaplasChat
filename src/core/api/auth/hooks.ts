import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { useNavigate } from "@tanstack/react-router";
import { authApi } from "./index";
import type { LoginRequest, ChangePasswordRequest } from "./types";

export const useLogin = () => {
	return useMutation({
		mutationFn: (credentials: LoginRequest) => authApi.login(credentials),
		onSuccess: (data) => {
			localStorage.setItem("access_token", data.access_token);
			localStorage.setItem("refresh_token", data.refresh_token);
		},
	});
};

export const useRefreshToken = () => {
	return useMutation({
		mutationFn: async () => {
			const refreshToken = localStorage.getItem("refresh_token");
			if (!refreshToken) {
				throw new Error("No refresh token available");
			}
			
			const response = await authApi.refreshToken({ refresh_token: refreshToken });
			
			// Сохраняем новые токены
			localStorage.setItem("access_token", response.access_token);
			localStorage.setItem("refresh_token", response.refresh_token);
			
			return response;
		},
	});
};

export const useLogout = () => {
	const queryClient = useQueryClient();
	const navigate = useNavigate();

	return useMutation({
		mutationFn: async () => {
			// Очищаем токены
			localStorage.removeItem("access_token");
			localStorage.removeItem("refresh_token");
			
			// Очищаем кеш React Query
			queryClient.clear();
		},
		onSuccess: () => {
			// Перенаправляем на страницу логина
			navigate({ to: "/login" });
		},
	});
};

export const useUserProfile = () => {
	return useQuery({
		queryKey: ["auth", "me"],
		queryFn: () => authApi.me(),
		enabled: !!localStorage.getItem("access_token"),
	});
};

export const useChangePassword = () => {
	return useMutation({
		mutationFn: (request: ChangePasswordRequest) => authApi.changePassword(request),
	});
};
