export type ChatInputState = {
	message: string;
	webSearchEnabled: boolean;
	setMessage: (message: string) => void;
	clearMessage: () => void;
	setWebSearchEnabled: (enabled: boolean) => void;
};
