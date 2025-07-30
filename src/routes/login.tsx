import { createFileRoute } from '@tanstack/react-router'
import { LoginPage } from '@/widgets/Auth/ui/auth'

export const Route = createFileRoute('/login')({
  component: LoginPage,
})

import { createFileRoute, redirect } from "@tanstack/react-router";
import { isCurrentTokenExpired } from "@/core/api/auth/helpers";
import { useUserStore } from "@/core/store/user/store";
import { LoginPage } from "@/pages/login";

export const Route = createFileRoute("/login")({
	beforeLoad: () => {
		const userStore = useUserStore.getState();
		const isTokenExpired = isCurrentTokenExpired();

		// Если пользователь авторизован и токен действителен - редирект на главную
		if (userStore.isAuthenticated && !isTokenExpired) {
			throw redirect({
				to: "/",
			});
		}
	},
	component: LoginPage,
});