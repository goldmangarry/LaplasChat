import { createFileRoute } from "@tanstack/react-router";
import { SidebarInset } from "@/components/ui/sidebar";
import { MainPage } from "@/pages/main";
import { ChatSidebar } from "@/widgets/chat-sidebar";

function HomePage() {
	return (
		<>
			<ChatSidebar />
			<SidebarInset>
				<div className="flex flex-1 flex-col">
					<MainPage />
				</div>
			</SidebarInset>
		</>
	);
}

export const Route = createFileRoute("/")({
	component: HomePage,
});
