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
				<div className="flex flex-1 max-h-[100dvh] flex-col max-w-full">
					<ChatPage dialogId={dialogId} />
				</div>
			</SidebarInset>
		</>
	);
}
