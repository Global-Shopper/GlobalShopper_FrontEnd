import {
	ChartLine,
	ChartPie,
	LogOut,
	Settings,
	User,
	Users,
	UserCog,
	ChevronRight,
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
	SidebarMenuSub,
	SidebarMenuSubButton,
	SidebarMenuSubItem,
} from "@/components/ui/sidebar";
import { Link, useNavigate, useLocation } from "react-router-dom";
import { signout } from "@/features/user";
import { useDispatch, useSelector } from "react-redux";
import { useState } from "react";
import logo from "@/assets/LOGO_Gshop.png";
import defaultAvt from "@/assets/defaultAvt.jpg";
import {
	Collapsible,
	CollapsibleContent,
	CollapsibleTrigger,
} from "@/components/ui/collapsible";

// Menu items.
const items = [
	{
		title: "Thống kê tổng quan",
		url: "/business-manager/overview",
		icon: ChartPie,
	},
	{
		title: "Thống kê doanh thu",
		url: "/business-manager/revenue",
		icon: ChartLine,
	},
	{
		title: "Cấu hình hệ thống",
		url: "/business-manager/config",
		icon: Settings,
	},
	{
		title: "Quản lý người dùng",
		icon: Users,
		submenu: [
			{
				title: "Quản lý khách hàng",
				url: "/business-manager/user-management/customer",
				icon: User,
			},
			{
				title: "Quản lý admin",
				url: "/business-manager/user-management/admin",
				icon: UserCog,
			},
		],
	},
	{
		title: "Đăng xuất",
		url: "/login",
		icon: LogOut,
	},
];

export function BusinessSidebar() {
	const dispatch = useDispatch();
	const navigate = useNavigate();
	const location = useLocation();
	const [openSubmenu, setOpenSubmenu] = useState({});
	const { avatar, name, email } = useSelector(
		(state) => state.rootReducer.user
	);

	const toggleSubmenu = (itemTitle) => {
		setOpenSubmenu((prev) => ({
			...prev,
			[itemTitle]: !prev[itemTitle],
		}));
	};

	const isSubmenuActive = (submenuItems) => {
		return submenuItems?.some((item) => location.pathname === item.url);
	};

	return (
		<Sidebar className="border-r border-gray-200 bg-white">
			<SidebarContent className="bg-gradient-to-b from-gray-50 to-white">
				<SidebarGroup>
					<SidebarGroupLabel className="flex justify-center items-center py-6 px-4">
						<div className="bg-white rounded-xl shadow-sm p-4 border border-gray-100">
							<img
								src={logo}
								alt="GSHOP Logo"
								className="h-16 w-auto"
							/>
						</div>
					</SidebarGroupLabel>
					<SidebarGroupContent className="px-3">
						<SidebarMenu className="space-y-2">
							{items
								.filter((item) => item.url !== "/login")
								.map((item) => (
									<SidebarMenuItem key={item.title}>
										{item.submenu ? (
											<Collapsible
												open={
													openSubmenu[item.title] ||
													isSubmenuActive(
														item.submenu
													)
												}
												onOpenChange={() =>
													toggleSubmenu(item.title)
												}
											>
												<CollapsibleTrigger asChild>
													<SidebarMenuButton
														className={`w-full justify-between rounded-lg px-3 py-3 transition-all duration-200 hover:bg-orange-50 hover:text-orange-700 ${
															isSubmenuActive(
																item.submenu
															)
																? "bg-orange-100 text-orange-700 shadow-sm border border-orange-200"
																: "text-gray-700 hover:shadow-sm"
														}`}
													>
														<div className="flex items-center gap-3">
															<div
																className={`p-1.5 rounded-lg transition-colors ${
																	isSubmenuActive(
																		item.submenu
																	)
																		? "bg-orange-200 text-orange-700"
																		: "bg-gray-100 text-gray-600"
																}`}
															>
																<item.icon className="h-4 w-4" />
															</div>
															<span className="font-medium">
																{item.title}
															</span>
														</div>
														<ChevronRight
															className={`h-4 w-4 transition-all duration-200 ${
																openSubmenu[
																	item.title
																] ||
																isSubmenuActive(
																	item.submenu
																)
																	? "rotate-90 text-orange-600"
																	: "text-gray-400"
															}`}
														/>
													</SidebarMenuButton>
												</CollapsibleTrigger>
												<CollapsibleContent className="mt-1">
													<SidebarMenuSub className="ml-6 border-l-2 border-gray-200 pl-3 space-y-1">
														{item.submenu.map(
															(subItem) => (
																<SidebarMenuSubItem
																	key={
																		subItem.title
																	}
																>
																	<SidebarMenuSubButton
																		asChild
																		className={`rounded-lg px-3 py-2.5 transition-all duration-200 ${
																			location.pathname ===
																			subItem.url
																				? "bg-orange-600 text-white shadow-md"
																				: "text-gray-600 hover:bg-orange-50 hover:text-orange-700"
																		}`}
																	>
																		<Link
																			to={
																				subItem.url
																			}
																		>
																			<div
																				className={`p-1 rounded-md transition-colors ${
																					location.pathname ===
																					subItem.url
																						? "bg-orange-500 text-white"
																						: "bg-gray-100 text-gray-500"
																				}`}
																			>
																				<subItem.icon className="h-3.5 w-3.5" />
																			</div>
																			<span className="font-medium text-sm">
																				{
																					subItem.title
																				}
																			</span>
																		</Link>
																	</SidebarMenuSubButton>
																</SidebarMenuSubItem>
															)
														)}
													</SidebarMenuSub>
												</CollapsibleContent>
											</Collapsible>
										) : (
											<SidebarMenuButton
												asChild
												className={`rounded-lg px-3 py-3 transition-all duration-200 ${
													location.pathname ===
													item.url
														? "bg-orange-600 text-white shadow-md"
														: "text-gray-700 hover:bg-orange-50 hover:text-orange-700 hover:shadow-sm"
												}`}
											>
												<Link to={item.url}>
													<div
														className={`p-1.5 rounded-lg transition-colors ${
															location.pathname ===
															item.url
																? "bg-orange-500 text-white"
																: "bg-gray-100 text-gray-600"
														}`}
													>
														<item.icon className="h-4 w-4" />
													</div>
													<span className="font-medium">
														{item.title}
													</span>
												</Link>
											</SidebarMenuButton>
										)}
									</SidebarMenuItem>
								))}
						</SidebarMenu>
					</SidebarGroupContent>
				</SidebarGroup>
			</SidebarContent>
			{/* Bottom sticky user info and signout section */}
			<div className="sticky bottom-0 left-0 w-full bg-gradient-to-t from-white via-white to-gray-50/50 border-t border-gray-200 px-3 pt-4 pb-4 flex flex-col items-center select-none">
				<div className="bg-white rounded-xl shadow-lg border border-gray-100 p-3 w-full mb-3">
					<div className="flex flex-col items-center">
						<div className="relative mb-2">
							<img
								src={avatar || defaultAvt}
								alt="Avatar"
								className="w-10 h-10 rounded-full border-2 border-orange-200 object-cover shadow-sm"
							/>
							<div className="absolute -bottom-1 -right-1 w-3 h-3 bg-green-500 border-2 border-white rounded-full"></div>
						</div>
						<div className="text-xs font-semibold text-gray-900 truncate w-full text-center">
							{name || "Business Manager"}
						</div>
						<div
							className="text-xs text-gray-500 truncate w-full text-center mb-2"
							title={email}
						>
							{email || "admin@gshop.com"}
						</div>
					</div>
				</div>

				<button
					onClick={() => {
						dispatch(signout());
						navigate("/login");
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
