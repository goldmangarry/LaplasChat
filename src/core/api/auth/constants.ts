export const AUTH_ENDPOINTS = {
	LOGIN: "/api/auth/login",
	REFRESH: "/api/auth/refresh",
	REGISTER: "/api/auth/register",
	CHANGE_PASSWORD: "/api/auth/change-password",
} as const;

export const LOGIN_FORM_CONFIG = {
	SCOPE: "read write",
	CLIENT_ID: "laplas-admin",
	CLIENT_SECRET: "secret",
} as const;
