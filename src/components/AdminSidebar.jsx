import {
	Banknote,
	Calendar,
	Home,
	Inbox,
	LogOut,
	Package,
	PackageSearch,
	Search,
	Settings,
	Undo2,
} from "lucide-react";

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
import { Link, useNavigate, useLocation } from "react-router-dom";
import { signout } from "@/features/user";
import { useDispatch } from "react-redux";
import adminLogo from "@/assets/logo_admin.png";
import defaultAvt from "@/assets/defaultAvt.jpg";
import gshopApi, { useLoginTokenQuery } from "@/services/gshopApi";

// Menu items.
const items = [
	{
		title: "Yêu cầu mua hàng",
		url: "/admin",
		icon: PackageSearch,
	},
	{
		title: "Đơn hàng",
		url: "/admin/orders",
		icon: Package,
	},
	{
		title: "Yêu cầu hoàn tiền",
		url: "/admin/refunds",
		icon: Undo2,
	},
	{
		title: "Yêu cầu rút tiền",
		url: "/admin/withdraw",
		icon: Banknote,
	},
	{
		title: "Tài khoản",
		url: "/admin/account",
		icon: Settings,
	},
	{
		title: "Đăng xuất",
		url: "/login",
		icon: LogOut,
	},
];

export function AdminSidebar() {
	const dispatch = useDispatch();
	const navigate = useNavigate();
	const location = useLocation();
	const { data: userInfo } = useLoginTokenQuery();

	return (
		<Sidebar className="border-r border-gray-200 bg-white">
			<SidebarContent className="bg-gradient-to-b from-gray-50 to-white">
				<SidebarGroup>
					<SidebarGroupLabel className="flex justify-center items-center py-6 px-2">
						<img
							src={adminLogo}
							alt="GSHOP Logo"
							className="h-24 w-auto"
						/>
					</SidebarGroupLabel>
					<SidebarGroupContent className="px-2 pt-4">
						<SidebarMenu className="space-y-2">
							{items
								.filter((item) => item.url !== "/login")
								.map((item) => (
									<SidebarMenuItem key={item.title}>
										<SidebarMenuButton
											asChild
											className={`rounded-lg px-2 py-3 transition-all duration-200 ${
												location.pathname === item.url
													? "bg-blue-600 text-white shadow-md"
													: "text-gray-700 hover:bg-blue-50 hover:text-blue-700 hover:shadow-sm"
											}`}
										>
											<Link to={item.url}>
												<item.icon
													className={`h-4 w-4 ${
														location.pathname ===
														item.url
															? "!text-white"
															: "text-gray-600"
													}`}
												/>
												<span className="font-medium text-sm">
													{item.title}
												</span>
											</Link>
										</SidebarMenuButton>
									</SidebarMenuItem>
								))}
						</SidebarMenu>
					</SidebarGroupContent>
				</SidebarGroup>
			</SidebarContent>
			{/* Bottom sticky user info and signout section */}
			<div className="sticky bottom-0 left-0 w-full bg-gradient-to-t from-white via-white to-gray-50/50 border-t border-gray-200 px-2 pt-4 pb-4 flex flex-col items-center select-none">
				<div className="bg-white rounded-xl shadow-lg border border-gray-100 p-3 w-full mb-3">
					<div className="flex flex-col items-center">
						<div className="relative mb-2">
							<img
								src={userInfo?.user?.avatar || defaultAvt}
								alt="Avatar"
								className="w-10 h-10 rounded-full border-2 border-orange-200 object-contain shadow-sm"
							/>
							<div className="absolute -bottom-1 -right-1 w-3 h-3 bg-green-500 border-2 border-white rounded-full"></div>
						</div>
						<div className="text-xs font-semibold text-gray-900 truncate w-full text-center">
							{userInfo?.user?.name || "Admin"}
						</div>
						<div
							className="text-xs text-gray-500 truncate w-full text-center mb-2"
							title={userInfo?.user?.email}
						>
							{userInfo?.user?.email || ""}
						</div>
					</div>
				</div>

				<button
					onClick={async () => {
						dispatch(gshopApi.util.resetApiState());
						setTimeout(() => navigate("/login"), 0); //note: important for waiting the navigate of private route
						dispatch(signout());
					}}
					className="flex items-center gap-2 px-3 py-2 rounded-lg bg-gradient-to-r from-red-500 to-red-600 hover:from-red-600 hover:to-red-700 text-white text-xs font-medium transition-all duration-200 w-full justify-center shadow-md hover:shadow-lg transform hover:scale-[1.02]"
				>
					<LogOut className="w-3.5 h-3.5" />
					<span>Đăng xuất</span>
				</button>
			</div>
		</Sidebar>
	);
}
