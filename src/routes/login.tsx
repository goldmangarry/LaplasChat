import { createFileRoute, redirect } from '@tanstack/react-router'
import { useUserStore } from '@/core/store/user';
import { isCurrentTokenExpired } from '@/core/api/auth/helpers';
import { LoginPage } from '@/pages/login';

export const Route = createFileRoute("/login")({
	beforeLoad: ({ location }) => {
		const userStore = useUserStore.getState();
		const isTokenExpired = isCurrentTokenExpired();

		if (userStore.isAuthenticated && !isTokenExpired) {
			const searchParams = new URLSearchParams(location.search);
			const redirectTo = searchParams.get('redirect') || "/";
			throw redirect({
				to: redirectTo as "/",
			});
		}
	},
	component: LoginPage,
});