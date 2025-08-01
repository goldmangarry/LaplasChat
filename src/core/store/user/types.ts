export type User = {
	id: string;
	email: string;
	first_name: string;
	last_name: string;
	avatar_url?: string;
	created_at: string;
	updated_at: string;
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
	fetchUserProfile: () => Promise<void>;
};
