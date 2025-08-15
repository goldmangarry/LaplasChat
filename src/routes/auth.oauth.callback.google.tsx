import { createFileRoute, useNavigate } from "@tanstack/react-router";
import { useEffect } from "react";
import { useUserStore } from "@/core/user";
import { useTranslation } from "react-i18next";

function GoogleOAuthCallback() {
	const { t } = useTranslation();
	const navigate = useNavigate();
	const login = useUserStore((state) => state.login);

	useEffect(() => {
		const handleOAuthCallback = () => {
			try {
				// Extract tokens from URL hash fragment
				const hash = window.location.hash.substring(1);
				const params = new URLSearchParams(hash);

				const accessToken = params.get('access_token');
				const refreshToken = params.get('refresh_token');
				const tokenType = params.get('token_type');
				const expiresIn = params.get('expires_in');

				if (accessToken && refreshToken) {
					// Update user store with authentication data
					login({
						accessToken,
						refreshToken,
						tokenType: tokenType || 'bearer',
						expiresIn: expiresIn ? parseInt(expiresIn, 10) : 3600,
					});

					// Redirect to home page
					navigate({ to: '/' });
				} else {
					console.error('Missing required tokens in OAuth callback');
					// Redirect to login on error
					navigate({ to: '/login' });
				}
			} catch (error) {
				console.error('Error processing OAuth callback:', error);
				// Redirect to login on error
				navigate({ to: '/login' });
			}
		};

		handleOAuthCallback();
	}, [login, navigate]);

	return (
		<div className="flex items-center justify-center min-h-screen">
			<div className="text-center">
				<div className="animate-spin rounded-full h-8 w-8 border-b-2 border-gray-900 mx-auto mb-4"></div>
				<p className="text-muted-foreground">{t('login.processingAuthentication')}</p>
			</div>
		</div>
	);
}

export const Route = createFileRoute('/auth/oauth/callback/google')({
	component: GoogleOAuthCallback,
});