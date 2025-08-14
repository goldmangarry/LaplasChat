export type LoginRequest = {
	username: string;
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

export type UserProfile = {
	id: string;
	email: string;
	first_name: string;
	last_name: string;
	avatar_url: string;
};

export type ChangePasswordRequest = {
	current_password: string;
	new_password: string;
};

export type ChangePasswordResponse = {
	success: boolean;
	message: string;
};
