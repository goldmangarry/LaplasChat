import { createFileRoute } from "@tanstack/react-router";
import { SidebarInset } from "@/components/ui/sidebar";
import { ChatSidebar } from "@/widgets/chat-sidebar";
import { ChatPage } from "../pages/chat";

export const Route = createFileRoute("/chat/$dialogId")({
	component: ChatPageComponent,
});

function ChatPageComponent() {
	const { dialogId } = Route.useParams();

	return (
		<>
			<ChatSidebar />
			<SidebarInset className="overflow-x-hidden">
				<div className="flex max-h-screen flex-1 flex-col max-w-full">
					<ChatPage dialogId={dialogId} />
				</div>
			</SidebarInset>
		</>
	);
}
