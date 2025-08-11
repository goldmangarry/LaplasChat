export type User = {
	accessToken: string;
	refreshToken: string;
	tokenType: string;
	expiresIn: number;
	isAuthenticated: boolean;
};

export type UserStore = {
	user: User | null;
	login: (tokens: Omit<User, "isAuthenticated">) => void;
	logout: () => void;
	isAuthenticated: () => boolean;
};
