import { create } from "zustand";
import { persist } from "zustand/middleware";
import { authApi, setupApiInterceptors } from "../../api";
import type { AuthActions, AuthState, User } from "./types";

type UserStore = AuthState & AuthActions;

export const useUserStore = create<UserStore>()(
	persist(
		(set, get) => ({
			// State
			user: null,
			accessToken: null,
			refreshToken: null,
			isAuthenticated: false,
			isLoading: false,

			// Actions
			login: (accessToken: string, refreshToken: string, user: User) =>
				set({
					accessToken,
					refreshToken,
					user,
					isAuthenticated: true,
					isLoading: false,
				}),

			logout: () =>
				set({
					user: null,
					accessToken: null,
					refreshToken: null,
					isAuthenticated: false,
					isLoading: false,
				}),

			refreshTokens: async () => {
				const { refreshToken } = get();
				if (!refreshToken) {
					throw new Error("No refresh token available");
				}

				try {
					const response = await authApi.refreshToken(refreshToken);
					set({
						accessToken: response.access_token,
						refreshToken: response.refresh_token,
					});
				} catch (error) {
					// Если обновление токена не удалось, разлогиниваем пользователя
					set({
						user: null,
						accessToken: null,
						refreshToken: null,
						isAuthenticated: false,
						isLoading: false,
					});
					throw error;
				}
			},

			setLoading: (loading: boolean) => set({ isLoading: loading }),

			fetchUserProfile: async () => {
				const { accessToken } = get();
				if (!accessToken) {
					throw new Error("No access token available");
				}

				try {
					set({ isLoading: true });
					const userProfile = await authApi.getMe();
					set({
						user: userProfile,
						isLoading: false,
					});
				} catch (error) {
					set({ isLoading: false });
					throw error;
				}
			},
		}),
		{
			name: "user-storage",
			partialize: (state) => ({
				user: state.user,
				accessToken: state.accessToken,
				refreshToken: state.refreshToken,
				isAuthenticated: state.isAuthenticated,
			}),
		},
	),
);

// Настраиваем API interceptors
setupApiInterceptors(
	() => useUserStore.getState().accessToken,
	() => useUserStore.getState().refreshTokens(),
	() => useUserStore.getState().logout(),
);
