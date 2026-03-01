import { useQuery } from "@tanstack/react-query";
import { modelsApi } from "./index";

export const useModels = () => {
	return useQuery({
		queryKey: ["models"],
		queryFn: () => modelsApi.getModels(),
		staleTime: 30 * 60 * 1000,
	});
};
