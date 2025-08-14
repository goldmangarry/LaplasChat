import { create } from "zustand";
import { persist } from "zustand/middleware";
import type { UserStore } from "./types";

export const useUserStore = create<UserStore>()(
	persist(
		(set, get) => ({
			user: null,

			login: (tokens) => {
				const user = {
					...tokens,
					isAuthenticated: true,
				};

				localStorage.setItem("access_token", tokens.accessToken);
				localStorage.setItem("refresh_token", tokens.refreshToken);

				set({ user });
			},

			logout: () => {
				localStorage.removeItem("access_token");
				localStorage.removeItem("refresh_token");
				set({ user: null });
			},

			isAuthenticated: () => {
				const state = get();
				return state.user?.isAuthenticated ?? false;
			},
		}),
		{
			name: "user-store",
			partialize: (state) => ({ user: state.user }),
		},
	),
);
