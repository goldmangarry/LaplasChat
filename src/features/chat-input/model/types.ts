export type ChatInputState = {
	message: string;
	isLoading: boolean;
	setMessage: (message: string) => void;
	setLoading: (loading: boolean) => void;
	sendMessage: (message: string) => Promise<void>;
	clearMessage: () => void;
};
