import axios from "axios";

export const apiClient = axios.create({
	headers: {
		"Content-Type": "application/x-www-form-urlencoded",
	},
});

apiClient.interceptors.request.use((config) => {
	const token = localStorage.getItem("access_token");
	if (token) {
		config.headers.Authorization = `Bearer ${token}`;
	}
	return config;
});

apiClient.interceptors.response.use(
	(response) => response,
	(error) => {
		if (error.response?.status === 401) {
			// Don't redirect on login endpoint - let the form handle the error
			const isLoginRequest = error.config?.url?.includes("/api/auth/login");
			if (!isLoginRequest) {
				localStorage.removeItem("access_token");
				localStorage.removeItem("refresh_token");
				window.location.href = "/login";
			}
		}
		return Promise.reject(error);
	},
);
