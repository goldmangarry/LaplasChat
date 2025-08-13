import { create } from "zustand";
import type { ChatInputState } from "./types";

export const useChatInputStore = create<ChatInputState>((set) => ({
	message: "",
	webSearchEnabled: false,
	uploadedFiles: [],

	setMessage: (message: string) => set({ message }),

	clearMessage: () => set({ message: "" }),

	setWebSearchEnabled: (enabled: boolean) => set({ webSearchEnabled: enabled }),

	addUploadedFiles: (files) => set((state) => ({
		uploadedFiles: [...state.uploadedFiles, ...files]
	})),

	removeUploadedFile: (fileId: string) => set((state) => ({
		uploadedFiles: state.uploadedFiles.filter(file => file.file_id !== fileId)
	})),

	clearUploadedFiles: () => set({ uploadedFiles: [] }),
}));
