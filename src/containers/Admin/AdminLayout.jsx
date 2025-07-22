import { SidebarProvider, SidebarTrigger } from "@/components/ui/sidebar";
import { AdminSidebar } from "@/components/AdminSidebar";
import { Outlet } from "react-router-dom";

export default function Layout() {
	return (
		<SidebarProvider className="flex w-full min-h-screen">
			<AdminSidebar />
			<main className="flex flex-col flex-1 w-full min-h-screen">
				<Outlet />
			</main>
		</SidebarProvider>
	);
}
