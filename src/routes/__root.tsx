import { createRootRoute, Outlet } from "@tanstack/react-router";
import { SidebarProvider } from "@/components/ui/sidebar";
import "./index.css";

export const Route = createRootRoute({
	component: () => (
		<SidebarProvider>
			<Outlet />
		</SidebarProvider>
	),
});
