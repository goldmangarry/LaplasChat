import { useQuery } from "@tanstack/react-query";
import { chatApi } from "./index";

export const useChatHistory = () => {
	return useQuery({
		queryKey: ["chat", "history"],
		queryFn: () => chatApi.getHistory(),
		refetchOnWindowFocus: true, // Refetch when user returns to tab
	});
};