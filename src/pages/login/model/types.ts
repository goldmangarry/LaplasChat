export type LoginRequest = {
	username: string; // email address
	password: string;
};

export type LoginResponse = {
	access_token: string;
	refresh_token: string;
	token_type: "bearer";
	expires_in: number;
};

export type RefreshTokenRequest = {
	refresh_token: string;
};

export type RefreshTokenResponse = {
	access_token: string;
	refresh_token: string;
	token_type: "bearer";
	expires_in: number;
};
