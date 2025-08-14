import type { UseMutationResult } from "@tanstack/react-query";
import type { FactCheckRequest, FactCheckResponse } from "@/core/api/chat/types";

export type FactCheckDrawerProps = {
	isOpen: boolean;
	onClose: () => void;
	factCheckMutation: UseMutationResult<FactCheckResponse, Error, FactCheckRequest, unknown>;
};