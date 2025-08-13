import { create } from "zustand";
import type { ChatInputState } from "./types";

export const useChatInputStore = create<ChatInputState>((set) => ({
	message: "",
	webSearchEnabled: false,

	setMessage: (message: string) => set({ message }),

	clearMessage: () => set({ message: "" }),

	setWebSearchEnabled: (enabled: boolean) => set({ webSearchEnabled: enabled }),
}));
