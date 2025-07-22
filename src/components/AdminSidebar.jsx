import { Calendar, Home, Inbox, LogOut, Search, Settings } from "lucide-react";

import {
	Sidebar,
	SidebarContent,
	SidebarGroup,
	SidebarGroupContent,
	SidebarGroupLabel,
	SidebarMenu,
	SidebarMenuButton,
	SidebarMenuItem,
} from "@/components/ui/sidebar";
import { Link } from "react-router-dom";
import { signout } from "@/features/user";
import { useDispatch } from "react-redux";
import logo from "@/assets/LOGO_Gshop.png";

// Menu items.
const items = [
	{
		title: "Yêu cầu mua hàng",
		url: "/admin",
		icon: Home,
	},
	{
		title: "Báo giá",
		url: "/quotes",
		icon: Inbox,
	},
	{
		title: "Đơn hàng",
		url: "/orders",
		icon: Calendar,
	},
	{
		title: "Yêu cầu hoàn tiền",
		url: "/refunds-list",
		icon: Search,
	},
	{
		title: "Đăng xuất",
		url: "/login",
		icon: LogOut,
	},
];

export function AdminSidebar() {
	const dispatch = useDispatch();
	return (
		<Sidebar>
			<SidebarContent>
				<SidebarGroup>
					<SidebarGroupLabel className="flex justify-center items-center py-10">
						<img
							src={logo}
							alt="GSHOP Logo"
							className="h-20 w-auto"
						/>
					</SidebarGroupLabel>
					<SidebarGroupContent>
						<SidebarMenu>
							{items.map((item) => (
								<SidebarMenuItem key={item.title}>
									<SidebarMenuButton
										asChild
										isActive={
											location.pathname === item.url
										}
									>
										{item.url === "/login" ? (
											<Link
												onClick={() =>
													dispatch(signout())
												}
												to={item.url}
											>
												<item.icon />
												<span>{item.title}</span>
											</Link>
										) : (
											<Link to={item.url}>
												<item.icon />
												<span>{item.title}</span>
											</Link>
										)}
									</SidebarMenuButton>
								</SidebarMenuItem>
							))}
						</SidebarMenu>
					</SidebarGroupContent>
				</SidebarGroup>
			</SidebarContent>
		</Sidebar>
	);
}
