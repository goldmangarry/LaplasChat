export type User = {
	id: string;
	username: string;
	email?: string;
};

export type AuthState = {
	user: User | null;
	accessToken: string | null;
	refreshToken: string | null;
	isAuthenticated: boolean;
	isLoading: boolean;
};

export type AuthActions = {
	login: (accessToken: string, refreshToken: string, user: User) => void;
	logout: () => void;
	setLoading: (loading: boolean) => void;
	refreshTokens: () => Promise<void>;
};
