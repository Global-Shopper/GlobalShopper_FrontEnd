import React from "react";
import {
	ShoppingCart,
	Globe,
	Star,
	Heart,
	Send,
	FileText,
	Truck,
	HelpCircle,
	MessageCircle,
	Shield,
	Users,
	Building2,
	Lock,
} from "lucide-react";
import { Link } from "react-router-dom";
import GShopLogo from "@/assets/LOGO_Gshop.png";

const Footer = () => {
	return (
		<footer className="relative overflow-hidden bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900 text-white">
			{/* Animated background elements */}
			<div className="absolute inset-0">
				<div className="absolute top-0 -left-4 w-72 h-72 bg-gradient-to-r from-blue-600/20 to-purple-600/20 rounded-full mix-blend-multiply filter blur-xl animate-pulse"></div>
				<div className="absolute top-0 -right-4 w-72 h-72 bg-gradient-to-r from-purple-600/20 to-pink-600/20 rounded-full mix-blend-multiply filter blur-xl animate-pulse delay-700"></div>
				<div className="absolute -bottom-8 left-20 w-72 h-72 bg-gradient-to-r from-green-600/20 to-blue-600/20 rounded-full mix-blend-multiply filter blur-xl animate-pulse delay-1000"></div>
			</div>

			{/* Mesh gradient overlay */}
			<div className="absolute inset-0 bg-gradient-to-t from-slate-900/50 to-transparent"></div>

			<div className="relative container mx-auto px-6 py-20">
				{/* Main footer content */}
				<div className="grid gap-16 lg:grid-cols-12 mb-16">
					{/* Brand section - takes more space */}
					<div className="lg:col-span-5 space-y-8">
						<Link
							to="/"
							className="group inline-flex items-center space-x-4 transition-all duration-300 hover:scale-105"
						>
							<div className="relative">
								<div className="absolute -inset-2 bg-gradient-to-r from-blue-500 to-purple-500 rounded-2xl opacity-20 group-hover:opacity-40 transition-opacity duration-300 blur"></div>
								<img
									src={GShopLogo || "/placeholder.svg"}
									alt="Global Shopper Logo"
									className="relative h-16 w-16 rounded-2xl shadow-2xl group-hover:shadow-blue-500/25 transition-shadow duration-300"
								/>
							</div>
							<div>
								<span className="text-3xl font-bold bg-gradient-to-r from-blue-400 via-purple-400 to-pink-400 bg-clip-text text-transparent">
									Global Shopper
								</span>
								<div className="text-sm text-slate-400 font-medium">
									Mua sắm toàn cầu
								</div>
							</div>
						</Link>

						<p className="text-lg text-slate-300 leading-relaxed max-w-md">
							Kết nối bạn với thế giới mua sắm không giới hạn.
							<span className="text-blue-400 font-medium">
								{" "}
								Gửi yêu cầu, nhận báo giá, theo dõi đơn hàng
							</span>{" "}
							một cách dễ dàng và chuyên nghiệp.
						</p>

						{/* Stats or features */}
						<div className="flex space-x-8">
							<div className="text-center">
								<div className="text-2xl font-bold text-blue-400">
									1000+
								</div>
								<div className="text-sm text-slate-400">
									Đơn hàng
								</div>
							</div>
							<div className="text-center">
								<div className="text-2xl font-bold text-purple-400">
									50+
								</div>
								<div className="text-sm text-slate-400">
									Quốc gia
								</div>
							</div>
							<div className="text-center">
								<div className="text-2xl font-bold text-pink-400">
									24/7
								</div>
								<div className="text-sm text-slate-400">
									Hỗ trợ
								</div>
							</div>
						</div>
					</div>

					{/* Navigation sections */}
					<div className="lg:col-span-7 grid gap-8 sm:grid-cols-3">
						{/* Services */}
						<div className="space-y-6">
							<h4 className="text-xl font-bold relative">
								<span className="bg-gradient-to-r from-blue-400 to-purple-400 bg-clip-text text-transparent">
									Dịch vụ
								</span>
								<div className="absolute -bottom-2 left-0 h-0.5 w-12 bg-gradient-to-r from-blue-400 to-purple-400 rounded-full"></div>
							</h4>
							<nav className="space-y-4">
								{[
									{
										to: "/app",
										text: "Gửi Yêu cầu",
										icon: Send,
									},
									{
										to: "/app?tab=requests",
										text: "Danh sách Yêu cầu",
										icon: FileText,
									},
									{
										to: "/app?tab=orders",
										text: "Theo dõi Đơn hàng",
										icon: Truck,
									},
								].map((item, index) => {
									const IconComponent = item.icon;
									return (
										<Link
											key={index}
											to={item.to}
											className="group flex items-center space-x-3 text-slate-300 hover:text-white transition-all duration-300 hover:translate-x-1"
										>
											<div className="p-1.5 bg-blue-500/10 rounded-lg group-hover:bg-blue-500/20 transition-colors duration-300">
												<IconComponent className="h-4 w-4 text-blue-400 group-hover:scale-110 transition-transform duration-300" />
											</div>
											<span className="group-hover:text-blue-400 transition-colors duration-300">
												{item.text}
											</span>
										</Link>
									);
								})}
							</nav>
						</div>

						{/* Support */}
						<div className="space-y-6">
							<h4 className="text-xl font-bold relative">
								<span className="bg-gradient-to-r from-green-400 to-blue-400 bg-clip-text text-transparent">
									Hỗ trợ
								</span>
								<div className="absolute -bottom-2 left-0 h-0.5 w-12 bg-gradient-to-r from-green-400 to-blue-400 rounded-full"></div>
							</h4>
							<nav className="space-y-4">
								{[
									{
										to: "#how-it-works",
										text: "Cách hoạt động",
										icon: HelpCircle,
									},
									{
										to: "/contact",
										text: "Liên hệ Hỗ trợ",
										icon: MessageCircle,
									},
									{
										to: "/warranty",
										text: "Chính sách Bảo hành",
										icon: Shield,
									},
								].map((item, index) => {
									const IconComponent = item.icon;
									return (
										<Link
											key={index}
											to={item.to}
											className="group flex items-center space-x-3 text-slate-300 hover:text-white transition-all duration-300 hover:translate-x-1"
										>
											<div className="p-1.5 bg-green-500/10 rounded-lg group-hover:bg-green-500/20 transition-colors duration-300">
												<IconComponent className="h-4 w-4 text-green-400 group-hover:scale-110 transition-transform duration-300" />
											</div>
											<span className="group-hover:text-green-400 transition-colors duration-300">
												{item.text}
											</span>
										</Link>
									);
								})}
							</nav>
						</div>

						{/* Info */}
						<div className="space-y-6">
							<h4 className="text-xl font-bold relative">
								<span className="bg-gradient-to-r from-purple-400 to-pink-400 bg-clip-text text-transparent">
									Thông tin
								</span>
								<div className="absolute -bottom-2 left-0 h-0.5 w-12 bg-gradient-to-r from-purple-400 to-pink-400 rounded-full"></div>
							</h4>
							<nav className="space-y-4">
								{[
									{
										to: "#testimonials",
										text: "Đánh giá Khách hàng",
										icon: Users,
									},
									{
										to: "/about",
										text: "Về chúng tôi",
										icon: Building2,
									},
									{
										to: "/privacy",
										text: "Chính sách Bảo mật",
										icon: Lock,
									},
								].map((item, index) => {
									const IconComponent = item.icon;
									return (
										<Link
											key={index}
											to={item.to}
											className="group flex items-center space-x-3 text-slate-300 hover:text-white transition-all duration-300 hover:translate-x-1"
										>
											<div className="p-1.5 bg-purple-500/10 rounded-lg group-hover:bg-purple-500/20 transition-colors duration-300">
												<IconComponent className="h-4 w-4 text-purple-400 group-hover:scale-110 transition-transform duration-300" />
											</div>
											<span className="group-hover:text-purple-400 transition-colors duration-300">
												{item.text}
											</span>
										</Link>
									);
								})}
							</nav>
						</div>
					</div>
				</div>

				{/* Bottom section */}
				<div className="border-t border-slate-700/50 pt-8">
					<div className="flex flex-col lg:flex-row justify-between items-center space-y-6 lg:space-y-0">
						<div className="text-center lg:text-left">
							<p className="text-slate-400">
								&copy; {new Date().getFullYear()}
								<span className="font-bold bg-gradient-to-r from-blue-400 to-purple-400 bg-clip-text text-transparent mx-2">
									GlobalShopper
								</span>
								Mua sắm toàn cầu, trải nghiệm địa phương.
							</p>
						</div>

						<div className="flex items-center space-x-8">
							<div className="flex items-center space-x-2 text-slate-400">
								<div className="p-2 bg-blue-500/10 rounded-full">
									<ShoppingCart className="h-4 w-4 text-blue-400" />
								</div>
								<span className="text-sm font-medium">
									Nền tảng Tin cậy
								</span>
							</div>

							<div className="h-6 w-px bg-slate-600"></div>

							<div className="flex items-center space-x-2 text-slate-400">
								<Heart className="h-4 w-4 text-red-400" />
								<span className="text-sm">
									Made with love in Vietnam
								</span>
							</div>
						</div>
					</div>
				</div>
			</div>
		</footer>
	);
};

export default Footer;
