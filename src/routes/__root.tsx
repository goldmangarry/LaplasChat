import {
	createRootRoute,
	Outlet,
	redirect,
	useRouterState,
} from "@tanstack/react-router";
import { SidebarProvider } from "@/components/ui/sidebar";
import "./index.css";

const PUBLIC_ROUTES = ["/onboarding", "/landing"];

function RootComponent() {
	const pathname = useRouterState({ select: (s) => s.location.pathname });
	const isPublicRoute = PUBLIC_ROUTES.includes(pathname);

	if (isPublicRoute) {
		return <Outlet />;
	}

	return (
		<SidebarProvider>
			<Outlet />
		</SidebarProvider>
	);
}

export const Route = createRootRoute({
	beforeLoad: ({ location }) => {
		const apiKey = localStorage.getItem("openrouter_api_key");
		if (!apiKey && !PUBLIC_ROUTES.includes(location.pathname)) {
			const isDesktop = "__TAURI_INTERNALS__" in window;
			throw redirect({ to: isDesktop ? "/onboarding" : "/landing" });
		}
	},
	component: RootComponent,
});
