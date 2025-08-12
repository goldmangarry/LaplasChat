import type * as React from "react";
import {
	Sidebar,
	SidebarContent,
	SidebarFooter,
	SidebarHeader,
	SidebarRail,
} from "@/components/ui/sidebar";
import { NavChats } from "./components/nav-chats";
import { NavMain } from "./components/nav-main";
import { NavUser } from "./components/nav-user";
import { TeamSwitcher } from "./components/team-switcher";

export function ChatSidebar({
	...props
}: React.ComponentProps<typeof Sidebar>) {
	return (
		<Sidebar collapsible="icon" {...props} className="flex flex-col">
			<SidebarHeader className="sticky top-0 z-10 bg-sidebar">
				<TeamSwitcher />
			</SidebarHeader>
			<SidebarContent className="flex flex-col overflow-hidden">
				<div className="sticky top-0 z-10 bg-sidebar">
					<NavMain />
				</div>
				<div className="flex-1 overflow-y-auto">
					<NavChats />
				</div>
			</SidebarContent>
			<SidebarFooter className="sticky bottom-0 z-10 bg-sidebar">
				<NavUser />
			</SidebarFooter>
			<SidebarRail />
		</Sidebar>
	);
}
