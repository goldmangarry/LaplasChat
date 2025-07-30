/**
 * Проверяет, истек ли срок действия JWT токена
 */
export const isTokenExpired = (token: string): boolean => {
	try {
		// Декодируем payload токена
		const payload = JSON.parse(atob(token.split(".")[1]));
		const currentTime = Math.floor(Date.now() / 1000);

		// Проверяем срок действия (exp - expiration time)
		return payload.exp < currentTime;
	} catch {
		// Если токен невалидный, считаем его истекшим
		return true;
	}
};

/**
 * Проверяет, истек ли срок действия текущего токена пользователя
 */
export const isCurrentTokenExpired = (): boolean => {
	// Получаем токен из localStorage напрямую для избежания циркулярных зависимостей
	const storedData = localStorage.getItem("user-storage");
	if (!storedData) return true;

	try {
		const { state } = JSON.parse(storedData);
		const { accessToken } = state;

		if (!accessToken) return true;

		return isTokenExpired(accessToken);
	} catch {
		return true;
	}
};
