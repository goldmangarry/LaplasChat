import { create } from "zustand";
import type { ChatInputState } from "./types";

export const useChatInputStore = create<ChatInputState>((set) => ({
	message: "",

	setMessage: (message: string) => set({ message }),

	clearMessage: () => set({ message: "" }),
}));
