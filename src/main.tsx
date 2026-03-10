import { QueryClientProvider } from "@tanstack/react-query";
import { createRouter, RouterProvider } from "@tanstack/react-router";
import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import { queryClient } from "@/core/api/query-client";
import { routeTree } from "@/routeTree.gen";
import { initializeTheme } from "@/core/theme";
import "@/shared/lib/i18n";
import "./routes/index.css";

// Polyfill crypto.randomUUID for non-secure contexts (HTTP)
if (typeof crypto !== "undefined" && !crypto.randomUUID) {
	crypto.randomUUID = () =>
		"10000000-1000-4000-8000-100000000000".replace(/[018]/g, (c) =>
			(+c ^ (crypto.getRandomValues(new Uint8Array(1))[0] & (15 >> (+c / 4)))).toString(16),
		) as `${string}-${string}-${string}-${string}-${string}`;
}

// Initialize theme
initializeTheme();

// Create a new router instance
const router = createRouter({ routeTree });

// Register the router instance for type safety
declare module "@tanstack/react-router" {
	interface Register {
		router: typeof router;
	}
}

const rootElement = document.getElementById("root");
if (!rootElement) throw new Error("Root element not found");

createRoot(rootElement).render(
	<StrictMode>
		<QueryClientProvider client={queryClient}>
			<RouterProvider router={router} />
		</QueryClientProvider>
	</StrictMode>,
);
