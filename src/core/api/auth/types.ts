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

export type RegisterRequest = {
	email: string;
	password: string;
	first_name: string;
	last_name: string;
};

export type RegisterResponse = {
	id: string;
	email: string;
	first_name: string;
	last_name: string;
	created_at: string;
};

export type ChangePasswordRequest = {
	current_password: string;
	new_password: string;
};
