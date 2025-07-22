import { Home, Inbox, Package, RefreshCw, User } from "lucide-react";
import { Link, useLocation } from "react-router-dom";

// Menu items with proper routing
const items = [
	{
		title: "Hồ sơ cá nhân",
		url: "/account-center",
		icon: User,
	},
	{
		title: "Yêu cầu mua hàng",
		url: "/account-center/purchase-request-list",
		icon: Home,
	},
	{
		title: "Báo giá",
		url: "/account-center/quotes",
		icon: Inbox,
	},
	{
		title: "Đơn hàng",
		url: "/account-center/orders",
		icon: Package,
	},
	{
		title: "Yêu cầu hoàn tiền",
		url: "/account-center/refunds",
		icon: RefreshCw,
	},
];

export function CustomerSidebar() {
	const location = useLocation();

	return (
		<div className="h-full w-60 border-r border-slate-200/60 bg-gradient-to-b from-white via-slate-50/50 to-slate-100/30 backdrop-blur-md shadow-sm">
			<div className="px-3 py-4 h-full flex flex-col overflow-y-auto">
				<div className="space-y-1">
					{items.map((item) => (
						<Link
							key={item.title}
							to={item.url}
							className={`
								group flex items-center gap-3 px-3 py-2.5 rounded-lg transition-all duration-200 hover:scale-[1.01]
								${
									location.pathname === item.url
										? "bg-gradient-to-r from-sky-600 to-blue-600 text-white shadow-md"
										: "hover:bg-sky-50/60 hover:shadow-sm text-slate-700 hover:text-sky-700"
								}
							`}
						>
							<div
								className={`
									flex items-center justify-center w-8 h-8 rounded-lg transition-all duration-200
									${
										location.pathname === item.url
											? "bg-white/25 text-white"
											: "bg-slate-200/60 text-slate-600 group-hover:bg-sky-100/60 group-hover:text-sky-600"
									}
								`}
							>
								<item.icon className="w-4 h-4" />
							</div>
							<span
								className={`
									text-sm font-medium transition-all duration-200
									${
										location.pathname === item.url
											? "text-white"
											: "text-slate-700 group-hover:text-sky-700"
									}
								`}
							>
								{item.title}
							</span>
							{location.pathname === item.url && (
								<div className="ml-auto w-1 h-1 bg-white/80 rounded-full"></div>
							)}
						</Link>
					))}
				</div>
			</div>
		</div>
	);
}
