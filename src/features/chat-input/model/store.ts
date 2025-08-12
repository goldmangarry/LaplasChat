import { create } from "zustand";
import type { ChatInputState } from "./types";

export const useChatInputStore = create<ChatInputState>((set, get) => ({
	message: "",
	isLoading: false,

	setMessage: (message: string) => set({ message }),

	setLoading: (loading: boolean) => set({ isLoading: loading }),

	sendMessage: async (message: string) => {
		const { setLoading, clearMessage } = get();

		try {
			setLoading(true);
			// TODO: Implement actual message sending logic
			console.log("Sending message:", message);

			// Simulate API call
			await new Promise((resolve) => setTimeout(resolve, 1000));

			clearMessage();
		} catch (error) {
			console.error("Failed to send message:", error);
		} finally {
			setLoading(false);
		}
	},

	clearMessage: () => set({ message: "" }),
}));
