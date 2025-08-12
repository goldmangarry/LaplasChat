import { useMutation, useQuery } from "@tanstack/react-query";
import { authApi } from "./index";
import type { LoginRequest } from "./types";

export const useLogin = () => {
	return useMutation({
		mutationFn: (credentials: LoginRequest) => authApi.login(credentials),
		onSuccess: (data) => {
			localStorage.setItem("access_token", data.access_token);
			localStorage.setItem("refresh_token", data.refresh_token);
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
