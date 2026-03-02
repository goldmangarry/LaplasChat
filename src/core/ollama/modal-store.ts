import { create } from "zustand";

type OllamaModalStore = {
	isOpen: boolean;
	open: () => void;
	close: () => void;
};

export const useOllamaModalStore = create<OllamaModalStore>((set) => ({
	isOpen: false,
	open: () => set({ isOpen: true }),
	close: () => set({ isOpen: false }),
}));
