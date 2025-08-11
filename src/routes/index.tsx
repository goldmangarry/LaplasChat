import { createFileRoute } from "@tanstack/react-router";
import { SidebarInset, SidebarTrigger } from "@/components/ui/sidebar";
import { ChatSidebar } from "@/widgets/chat-sidebar";

function HomePage() {
	return (
		<>
			<ChatSidebar />
			<SidebarInset>
				<header className="flex h-16 shrink-0 items-center gap-2 px-4">
					<SidebarTrigger className="-ml-1" />
				</header>
				<div className="flex flex-1 flex-col gap-4 p-4">
					<h1 className="text-2xl font-bold">Privet</h1>
				</div>
			</SidebarInset>
		</>
	);
}

export const Route = createFileRoute("/")({
	component: HomePage,
});
