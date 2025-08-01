import { createFileRoute, redirect } from '@tanstack/react-router'
import { z } from 'zod'
import { useUserStore } from '@/core/store/user';
import { isCurrentTokenExpired } from '@/core/api/auth/helpers';
import { LoginPage } from '@/pages/login';

const loginSearchSchema = z.object({
	redirect: z.string().optional(),
})

export const Route = createFileRoute("/login")({
	validateSearch: loginSearchSchema,
	beforeLoad: ({ search }) => {
		const userStore = useUserStore.getState();
		const isTokenExpired = isCurrentTokenExpired();

		if (userStore.isAuthenticated && !isTokenExpired) {
			const redirectTo = search.redirect || "/";
			throw redirect({
				to: redirectTo as "/",
			});
		}
	},
	component: LoginPage,
});