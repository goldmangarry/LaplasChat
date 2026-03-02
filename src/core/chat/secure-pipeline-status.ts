import { create } from "zustand";

export type SecurePipelineStep = "anonymizing" | "processing" | "deanonymizing" | null;

type SecurePipelineStatusStore = {
	step: SecurePipelineStep;
	setStep: (step: SecurePipelineStep) => void;
};

export const useSecurePipelineStatus = create<SecurePipelineStatusStore>((set) => ({
	step: null,
	setStep: (step) => set({ step }),
}));
