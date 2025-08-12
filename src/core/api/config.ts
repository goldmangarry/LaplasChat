import axios from "axios";

export const apiClient = axios.create({
	headers: {
		"Content-Type": "application/x-www-form-urlencoded",
	},
});

// Флаг для предотвращения множественных попыток обновления токена
let isRefreshing = false;
// Очередь запросов, ожидающих обновления токена
let failedQueue: Array<{
	resolve: (value: string | null) => void;
	reject: (error: unknown) => void;
}> = [];

const processQueue = (error: unknown, token: string | null = null) => {
	failedQueue.forEach(({ resolve, reject }) => {
		if (error) {
			reject(error);
		} else {
			resolve(token);
		}
	});
	
	failedQueue = [];
};

apiClient.interceptors.request.use((config) => {
	const token = localStorage.getItem("access_token");
	if (token) {
		config.headers.Authorization = `Bearer ${token}`;
	}
	return config;
});

apiClient.interceptors.response.use(
	(response) => response,
	async (error) => {
		const originalRequest = error.config;

		if (error.response?.status === 401 && !originalRequest._retry) {
			// Исключаем эндпоинты аутентификации
			const isAuthRequest = originalRequest.url?.includes("/api/auth/login") || 
								  originalRequest.url?.includes("/api/auth/refresh");
			
			if (isAuthRequest) {
				return Promise.reject(error);
			}

			if (isRefreshing) {
				// Если токен уже обновляется, добавляем запрос в очередь
				return new Promise((resolve, reject) => {
					failedQueue.push({ resolve, reject });
				}).then(token => {
					originalRequest.headers.Authorization = `Bearer ${token}`;
					return apiClient(originalRequest);
				}).catch(err => {
					return Promise.reject(err);
				});
			}

			originalRequest._retry = true;
			isRefreshing = true;

			const refreshToken = localStorage.getItem("refresh_token");
			
			if (!refreshToken) {
				processQueue(error, null);
				localStorage.removeItem("access_token");
				localStorage.removeItem("refresh_token");
				window.location.href = "/login";
				return Promise.reject(error);
			}

			try {
				const response = await apiClient.post("/api/auth/refresh", {
					refresh_token: refreshToken,
				}, {
					headers: {
						"Content-Type": "application/json",
					},
				});

				const { access_token, refresh_token: new_refresh_token } = response.data;
				
				// Сохраняем новые токены
				localStorage.setItem("access_token", access_token);
				localStorage.setItem("refresh_token", new_refresh_token);
				
				// Обновляем заголовок авторизации для исходного запроса
				originalRequest.headers.Authorization = `Bearer ${access_token}`;
				
				processQueue(null, access_token);
				
				return apiClient(originalRequest);
			} catch (refreshError) {
				processQueue(refreshError, null);
				localStorage.removeItem("access_token");
				localStorage.removeItem("refresh_token");
				window.location.href = "/login";
				return Promise.reject(refreshError);
			} finally {
				isRefreshing = false;
			}
		}

		return Promise.reject(error);
	},
);
