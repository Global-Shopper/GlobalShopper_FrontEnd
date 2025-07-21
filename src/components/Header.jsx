import { Link, useNavigate } from "react-router-dom";
import { Button } from "./ui/button";
import GShopLogo from "@/assets/LOGO_Gshop.png";
import { useDispatch, useSelector } from "react-redux";
import {
	DropdownMenu,
	DropdownMenuContent,
	DropdownMenuItem,
	DropdownMenuLabel,
	DropdownMenuSeparator,
	DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import {
	User,
	Package,
	LogOut,
	CalendarIcon as CalendarArrowUp,
	ArrowDownUp,
	Wallet,
	Plus,
	Undo2,
} from "lucide-react";
import { signout } from "@/features/user";
import defaultAvt from "@/assets/defaultAvt.jpg";
import { useGetWalletQuery } from "@/services/gshopApi";
import { Skeleton } from "@/components/ui/skeleton";

const Header = () => {
	const dispatch = useDispatch();
	const navigate = useNavigate();
	const { data: wallet, isLoading: isWalletLoading } = useGetWalletQuery();
	const isLoggedIn = useSelector(
		(state) => state.rootReducer?.user?.isLoggedIn
	);
	const name =
		useSelector((state) => state.rootReducer?.user?.name) || "Người dùng";
	const email = useSelector((state) => state.rootReducer?.user?.email);
	const avatar = useSelector((state) => state.rootReducer?.user?.avatar);

	const handleSignout = () => {
		dispatch(signout());
	};

	const formatCurrency = (amount) => {
		return new Intl.NumberFormat("vi-VN", {
			style: "currency",
			currency: "VND",
		}).format(amount || 0);
	};

	return (
		<header className="sticky top-0 z-50 w-full border-b border-white/10 bg-white/80 backdrop-blur-xl supports-[backdrop-filter]:bg-white/60 shadow-lg shadow-black/5">
			<div className="container flex h-20 items-center justify-between px-6 md:px-32">
				{/* Logo Section */}
				<Link
					to="/"
					className="group flex items-center space-x-3 transition-transform hover:scale-105 duration-300"
				>
					<div className="relative">
						<div className="absolute -inset-1 bg-gradient-to-r from-blue-500 to-purple-500 rounded-xl opacity-20 group-hover:opacity-40 transition-opacity duration-300 blur"></div>
						<img
							src={GShopLogo || "/placeholder.svg"}
							alt="Global Shopper Logo"
							className="relative h-12 w-12 rounded-xl shadow-lg group-hover:shadow-xl transition-shadow duration-300"
						/>
					</div>
					<div className="hidden md:block">
						<span className="text-xl font-bold bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
							Global Shopper
						</span>
						<div className="text-xs text-slate-500 font-medium">
							Mua sắm toàn cầu
						</div>
					</div>
				</Link>

				{/* Navigation */}
				<nav className="hidden lg:flex items-center space-x-8">
					{[
						{ to: "/", text: "Trang chủ" },
						{ to: "/services", text: "Dịch vụ" },
						{ to: "/orders", text: "Đơn hàng" },
						{ to: "/contact", text: "Liên hệ" },
					].map((item, index) => (
						<Link
							key={index}
							to={item.to}
							className="relative text-sm font-medium text-slate-700 hover:text-blue-600 transition-all duration-300 group py-2"
						>
							{item.text}
							<span className="absolute -bottom-1 left-0 w-0 h-0.5 bg-gradient-to-r from-blue-500 to-purple-500 group-hover:w-full transition-all duration-300 rounded-full"></span>
						</Link>
					))}
				</nav>

				{/* Auth Section */}
				<div className="flex items-center space-x-4">
					{!isLoggedIn ? (
						<div className="flex items-center space-x-3">
							<Button
								variant="ghost"
								size="sm"
								className="hidden sm:inline-flex hover:bg-blue-50 hover:text-blue-600 transition-colors duration-300"
								asChild
							>
								<Link to="/login">Đăng nhập</Link>
							</Button>
							<Button
								size="sm"
								className="bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 text-white shadow-lg hover:shadow-xl transition-all duration-300"
								asChild
							>
								<Link to="/signup">Đăng ký</Link>
							</Button>
						</div>
					) : (
						<DropdownMenu>
							<DropdownMenuTrigger asChild>
								<div className="flex items-center space-x-3 cursor-pointer group">
									{/* Wallet Balance Preview */}
									<div className="hidden md:flex items-center space-x-2 px-3 py-2 bg-gradient-to-r from-blue-50 to-purple-50 rounded-full border border-blue-100/50 group-hover:shadow-md transition-all duration-300">
										<Wallet className="h-4 w-4 text-blue-600" />
										<div className="text-sm font-semibold text-blue-700">
											{isWalletLoading ? (
												<Skeleton className="h-4 w-16" />
											) : (
												formatCurrency(wallet?.balance)
											)}
										</div>
									</div>

									{/* Avatar */}
									<div className="relative">
										<div className="absolute -inset-0.5 bg-gradient-to-r from-blue-500 to-purple-500 rounded-full opacity-0 group-hover:opacity-100 transition-opacity duration-300 blur-sm"></div>
										<img
											src={avatar ? avatar : defaultAvt}
											alt="User Avatar"
											width={40}
											height={40}
											className="relative h-10 w-10 rounded-full border-2 border-white object-cover shadow-lg group-hover:shadow-xl transition-all duration-300"
										/>
										<div className="absolute -bottom-1 -right-1 h-4 w-4 bg-green-500 border-2 border-white rounded-full"></div>
									</div>
								</div>
							</DropdownMenuTrigger>
							<DropdownMenuContent
								className="w-80 mt-2 border-0 shadow-2xl bg-white/95 backdrop-blur-xl"
								align="end"
								forceMount
							>
								{/* User Info Header */}
								<div className="p-4 bg-gradient-to-r from-blue-50 to-purple-50 border-b border-slate-100">
									<div className="flex items-center space-x-3">
										<img
											src={avatar ? avatar : defaultAvt}
											alt="User Avatar"
											className="h-12 w-12 rounded-full border-2 border-white shadow-lg object-cover"
										/>
										<div className="flex-1">
											<p className="text-sm font-semibold text-slate-800">
												{name}
											</p>
											<p className="text-xs text-slate-500">
												{email}
											</p>
										</div>
									</div>
								</div>

								{/* Wallet Section */}
								<div className="p-4 border-b border-slate-100">
									<div className="flex items-center justify-between p-3 rounded-xl bg-gradient-to-r from-blue-500/10 to-purple-500/10 border border-blue-200/50">
										<div className="flex items-center space-x-3">
											<div className="p-2 rounded-full bg-blue-100">
												<Wallet className="h-5 w-5 text-blue-600" />
											</div>
											<div>
												<p className="text-xs text-slate-500 font-medium">
													Số dư ví
												</p>
												{isWalletLoading ? (
													<Skeleton className="h-5 w-24 mt-1" />
												) : (
													<p className="text-lg font-bold text-blue-700">
														{formatCurrency(
															wallet?.balance
														)}
													</p>
												)}
											</div>
										</div>
										<Button
											size="sm"
											className="h-10 w-10 p-0 bg-gradient-to-r from-blue-500 to-purple-500 hover:from-blue-600 hover:to-purple-600 shadow-lg hover:shadow-xl transition-all duration-300"
											asChild
										>
											<Link to="/wallet/deposit">
												<Plus className="h-4 w-4" />
											</Link>
										</Button>
									</div>
								</div>
								{/* Navigation Items */}
								<div className="py-2">
									{[
										{
											to: "/account-center/purchase-request-list",
											text: "Yêu cầu mua hàng",
											icon: CalendarArrowUp,
											color: "text-blue-600",
										},
										{
											to: "/orders",
											text: "Đơn hàng của tôi",
											icon: Package,
											color: "text-green-600",
										},
										{
											to: "/account-center",
											text: "Quản lý tài khoản",
											icon: User,
											color: "text-purple-600",
										},
										{
											to: "/wallet/transactions",
											text: "Lịch sử thanh toán",
											icon: ArrowDownUp,
											color: "text-orange-600",
										},
										{
											to: "/wallet",
											text: "Quản lý ví",
											icon: Wallet,
											color: "text-teal-600",
										},
										{
											to: "/account-center",
											text: "Yêu cầu trả hàng & hoàn tiền",
											icon: Undo2,
											color: "text-red-600",
										},
									].map((item, index) => {
										const IconComponent = item.icon;
										return (
											<DropdownMenuItem
												key={index}
												asChild
											>
												<Link
													to={item.to}
													className="flex items-center px-4 py-3 hover:bg-slate-50 transition-colors duration-200"
												>
													<div
														className={`p-2 rounded-lg bg-slate-100 mr-3`}
													>
														<IconComponent
															className={`h-4 w-4 ${item.color}`}
														/>
													</div>
													<span className="text-sm font-medium text-slate-700">
														{item.text}
													</span>
												</Link>
											</DropdownMenuItem>
										);
									})}
								</div>

								{/* Logout */}
								<div className="border-t border-slate-100 pt-2">
									<DropdownMenuItem
										onClick={handleSignout}
										className="mx-2 mb-2 text-red-600 hover:text-red-700 hover:bg-red-50 focus:text-red-700 focus:bg-red-50 rounded-lg transition-colors duration-200"
									>
										<div className="p-2 rounded-lg bg-red-100 mr-3">
											<LogOut className="h-4 w-4 text-red-600" />
										</div>
										<span className="text-sm font-medium">
											Đăng xuất
										</span>
									</DropdownMenuItem>
								</div>
							</DropdownMenuContent>
						</DropdownMenu>
					)}
				</div>
			</div>
		</header>
	);
};

export default Header;
