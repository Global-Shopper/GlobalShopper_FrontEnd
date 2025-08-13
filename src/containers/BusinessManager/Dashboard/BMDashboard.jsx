import React from "react";
import {
	Users,
	ShoppingCart,
	DollarSign,
	TrendingUp,
	Package,
	Activity,
	Clock,
	BarChart3,
	Calendar,
	ArrowUpRight,
	AlertCircle,
	FileText,
	Target,
	Star,
} from "lucide-react";
import {
	Card,
	CardContent,
	CardDescription,
	CardHeader,
	CardTitle,
} from "@/components/ui/card";

const BMDashboard = () => {
	// Mock data cho dashboard trung gian mua hộ
	const stats = {
		totalUsers: 12547,
		totalRequests: 5847,
		totalOrders: 4234,
		totalRevenue: 245000000,
		activeRequests: 234,
		pendingRequests: 189,
		completedRequests: 4956,
		monthlyGrowth: 12.5,
		userGrowth: 8.3,
		requestGrowth: 18.7,
	};

	const recentRequests = [
		{
			id: "REQ001",
			customer: "Nguyễn Văn A",
			category: "Điện tử",
			amount: 2500000,
			status: "Completed",
			time: "2 giờ trước",
		},
		{
			id: "REQ002",
			customer: "Trần Thị B",
			category: "Thời trang",
			amount: 1800000,
			status: "Processing",
			time: "4 giờ trước",
		},
		{
			id: "REQ003",
			customer: "Lê Văn C",
			category: "Mỹ phẩm",
			amount: 950000,
			status: "Pending",
			time: "6 giờ trước",
		},
		{
			id: "REQ004",
			customer: "Phạm Thị D",
			category: "Gia dụng",
			amount: 1200000,
			status: "Quote",
			time: "8 giờ trước",
		},
	];

	// Data cho biểu đồ cột doanh thu theo tháng
	const monthlyRevenue = [
		{ month: "T1", revenue: 180, requests: 520 },
		{ month: "T2", revenue: 195, requests: 580 },
		{ month: "T3", revenue: 220, requests: 620 },
		{ month: "T4", revenue: 210, requests: 590 },
		{ month: "T5", revenue: 235, requests: 680 },
		{ month: "T6", revenue: 245, requests: 710 },
	];

	// Data cho biểu đồ tròn theo danh mục
	const categoryData = [
		{ name: "Điện tử", value: 35, amount: 85750000, color: "bg-blue-500" },
		{
			name: "Thời trang",
			value: 25,
			amount: 61250000,
			color: "bg-green-500",
		},
		{
			name: "Mỹ phẩm",
			value: 20,
			amount: 49000000,
			color: "bg-purple-500",
		},
		{
			name: "Gia dụng",
			value: 12,
			amount: 29400000,
			color: "bg-yellow-500",
		},
		{ name: "Khác", value: 8, amount: 19600000, color: "bg-gray-500" },
	];

	const formatCurrency = (amount) => {
		return new Intl.NumberFormat("vi-VN", {
			style: "currency",
			currency: "VND",
			notation: "compact",
			compactDisplay: "short",
		}).format(amount);
	};

	const formatNumber = (num) => {
		return new Intl.NumberFormat("vi-VN").format(num);
	};

	const getStatusColor = (status) => {
		switch (status) {
			case "Completed":
				return "bg-green-100 text-green-800";
			case "Processing":
				return "bg-blue-100 text-blue-800";
			case "Pending":
				return "bg-yellow-100 text-yellow-800";
			case "Quote":
				return "bg-purple-100 text-purple-800";
			default:
				return "bg-gray-100 text-gray-800";
		}
	};

	const maxRevenue = Math.max(...monthlyRevenue.map((item) => item.revenue));

	return (
		<div className="p-6 space-y-6">
			{/* Header */}
			<div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
				<div>
					<h1 className="text-3xl font-bold text-gray-900">
						Dashboard Tổng Quan
					</h1>
					<p className="text-gray-600 mt-1">
						Hệ thống trung gian mua hộ hàng nước ngoài
					</p>
				</div>
				<div className="flex items-center gap-2 text-sm text-gray-500">
					<Calendar className="h-4 w-4" />
					<span>
						Cập nhật: {new Date().toLocaleDateString("vi-VN")} -{" "}
						{new Date().toLocaleTimeString("vi-VN")}
					</span>
				</div>
			</div>

			{/* Stats Cards */}
			<div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-6">
				{/* Total Users */}
				<Card className="hover:shadow-lg transition-all duration-300 border-l-4 border-l-blue-500">
					<CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
						<CardTitle className="text-sm font-medium text-gray-600">
							Tổng người dùng
						</CardTitle>
						<Users className="h-5 w-5 text-blue-600" />
					</CardHeader>
					<CardContent>
						<div className="text-2xl font-bold text-gray-900">
							{formatNumber(stats.totalUsers)}
						</div>
						<div className="flex items-center text-sm text-green-600 mt-1">
							<ArrowUpRight className="h-4 w-4 mr-1" />
							<span>+{stats.userGrowth}% từ tháng trước</span>
						</div>
					</CardContent>
				</Card>

				{/* Total Requests */}
				<Card className="hover:shadow-lg transition-all duration-300 border-l-4 border-l-purple-500">
					<CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
						<CardTitle className="text-sm font-medium text-gray-600">
							Tổng yêu cầu mua hộ
						</CardTitle>
						<FileText className="h-5 w-5 text-purple-600" />
					</CardHeader>
					<CardContent>
						<div className="text-2xl font-bold text-gray-900">
							{formatNumber(stats.totalRequests)}
						</div>
						<div className="flex items-center text-sm text-green-600 mt-1">
							<ArrowUpRight className="h-4 w-4 mr-1" />
							<span>+{stats.requestGrowth}% từ tháng trước</span>
						</div>
						<div className="mt-2 text-xs text-gray-500">
							{formatNumber(stats.completedRequests)} hoàn thành
						</div>
					</CardContent>
				</Card>

				{/* Total Orders */}
				<Card className="hover:shadow-lg transition-all duration-300 border-l-4 border-l-green-500">
					<CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
						<CardTitle className="text-sm font-medium text-gray-600">
							Đơn hàng thành công
						</CardTitle>
						<ShoppingCart className="h-5 w-5 text-green-600" />
					</CardHeader>
					<CardContent>
						<div className="text-2xl font-bold text-gray-900">
							{formatNumber(stats.totalOrders)}
						</div>
						<div className="flex items-center text-sm text-green-600 mt-1">
							<ArrowUpRight className="h-4 w-4 mr-1" />
							<span>+{stats.monthlyGrowth}% từ tháng trước</span>
						</div>
					</CardContent>
				</Card>

				{/* Total Revenue */}
				<Card className="hover:shadow-lg transition-all duration-300 border-l-4 border-l-yellow-500">
					<CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
						<CardTitle className="text-sm font-medium text-gray-600">
							Doanh thu tháng
						</CardTitle>
						<DollarSign className="h-5 w-5 text-yellow-600" />
					</CardHeader>
					<CardContent>
						<div className="text-2xl font-bold text-gray-900">
							{formatCurrency(stats.totalRevenue)}
						</div>
						<div className="flex items-center text-sm text-green-600 mt-1">
							<TrendingUp className="h-4 w-4 mr-1" />
							<span>+15.2% từ tháng trước</span>
						</div>
						<div className="mt-3 flex items-center justify-between text-xs">
							<span className="text-gray-500">
								Mục tiêu: 300M
							</span>
							<span className="text-green-600 font-medium">
								82%
							</span>
						</div>
						<div className="mt-2">
							<div className="w-full bg-gray-200 rounded-full h-1.5">
								<div
									className="bg-yellow-500 h-1.5 rounded-full transition-all duration-500"
									style={{ width: "82%" }}
								></div>
							</div>
						</div>
					</CardContent>
				</Card>

				{/* Active Requests */}
				<Card className="hover:shadow-lg transition-all duration-300 border-l-4 border-l-orange-500">
					<CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
						<CardTitle className="text-sm font-medium text-gray-600">
							Đang xử lý
						</CardTitle>
						<Activity className="h-5 w-5 text-orange-600" />
					</CardHeader>
					<CardContent>
						<div className="text-2xl font-bold text-gray-900">
							{formatNumber(stats.activeRequests)}
						</div>
						<div className="flex items-center text-sm text-orange-600 mt-1">
							<Clock className="h-4 w-4 mr-1" />
							<span>Cần xử lý trong 24h</span>
						</div>
					</CardContent>
				</Card>
			</div>

			{/* Charts Section */}
			<div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
				{/* Request Status Chart */}
				<Card className="lg:col-span-1">
					<CardHeader>
						<CardTitle className="flex items-center gap-2">
							<Package className="h-5 w-5" />
							Trạng thái yêu cầu
						</CardTitle>
						<CardDescription>
							Tổng quan theo trạng thái xử lý
						</CardDescription>
					</CardHeader>
					<CardContent className="space-y-4">
						<div className="flex items-center justify-between p-3 bg-green-50 rounded-lg hover:bg-green-100 transition-colors">
							<div className="flex items-center gap-3">
								<div className="w-3 h-3 bg-green-500 rounded-full"></div>
								<span className="text-sm font-medium">
									Hoàn thành
								</span>
							</div>
							<span className="text-sm font-bold text-green-700">
								{formatNumber(stats.completedRequests)}
							</span>
						</div>
						<div className="flex items-center justify-between p-3 bg-blue-50 rounded-lg hover:bg-blue-100 transition-colors">
							<div className="flex items-center gap-3">
								<div className="w-3 h-3 bg-blue-500 rounded-full"></div>
								<span className="text-sm font-medium">
									Đang xử lý
								</span>
							</div>
							<span className="text-sm font-bold text-blue-700">
								{formatNumber(stats.activeRequests)}
							</span>
						</div>
						<div className="flex items-center justify-between p-3 bg-yellow-50 rounded-lg hover:bg-yellow-100 transition-colors">
							<div className="flex items-center gap-3">
								<div className="w-3 h-3 bg-yellow-500 rounded-full"></div>
								<span className="text-sm font-medium">
									Chờ báo giá
								</span>
							</div>
							<span className="text-sm font-bold text-yellow-700">
								{formatNumber(stats.pendingRequests)}
							</span>
						</div>
						<div className="flex items-center justify-between p-3 bg-purple-50 rounded-lg hover:bg-purple-100 transition-colors">
							<div className="flex items-center gap-3">
								<div className="w-3 h-3 bg-purple-500 rounded-full"></div>
								<span className="text-sm font-medium">
									Chờ thanh toán
								</span>
							</div>
							<span className="text-sm font-bold text-purple-700">
								67
							</span>
						</div>
						<div className="flex items-center justify-between p-3 bg-red-50 rounded-lg hover:bg-red-100 transition-colors">
							<div className="flex items-center gap-3">
								<div className="w-3 h-3 bg-red-500 rounded-full"></div>
								<span className="text-sm font-medium">
									Đã hủy
								</span>
							</div>
							<span className="text-sm font-bold text-red-700">
								23
							</span>
						</div>
					</CardContent>
				</Card>

				{/* Monthly Revenue Chart */}
				<Card className="lg:col-span-2">
					<CardHeader>
						<CardTitle className="flex items-center gap-2">
							<BarChart3 className="h-5 w-5" />
							Doanh thu 6 tháng gần nhất
						</CardTitle>
						<CardDescription>
							Xu hướng doanh thu và số lượng yêu cầu
						</CardDescription>
					</CardHeader>
					<CardContent>
						<div className="space-y-4">
							{monthlyRevenue.map((item, index) => (
								<div
									key={index}
									className="flex items-center gap-4"
								>
									<div className="w-8 text-sm font-medium text-gray-600">
										{item.month}
									</div>
									<div className="flex-1 flex items-center gap-2">
										<div className="flex-1">
											<div
												className="bg-gradient-to-r from-blue-500 to-purple-600 h-8 rounded-lg flex items-center justify-end pr-3 transition-all duration-500 hover:shadow-lg"
												style={{
													width: `${
														(item.revenue /
															maxRevenue) *
														100
													}%`,
													minWidth: "80px",
												}}
											>
												<span className="text-white text-xs font-medium">
													{item.revenue}M
												</span>
											</div>
										</div>
										<div className="text-sm text-gray-500 w-16 text-right">
											{formatNumber(item.requests)} YC
										</div>
									</div>
								</div>
							))}
						</div>
					</CardContent>
				</Card>
			</div>

			{/* Category Distribution & Recent Requests */}
			<div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
				{/* Category Distribution Chart */}
				<Card>
					<CardHeader>
						<CardTitle className="flex items-center gap-2">
							<Target className="h-5 w-5" />
							Phân bổ theo danh mục
						</CardTitle>
						<CardDescription>
							Doanh thu theo từng danh mục sản phẩm
						</CardDescription>
					</CardHeader>
					<CardContent>
						<div className="space-y-4">
							{categoryData.map((category, index) => (
								<div key={index} className="space-y-2">
									<div className="flex items-center justify-between">
										<div className="flex items-center gap-3">
											<div
												className={`w-4 h-4 rounded-full ${category.color}`}
											></div>
											<span className="text-sm font-medium">
												{category.name}
											</span>
										</div>
										<span className="text-sm text-gray-500">
											{category.value}%
										</span>
									</div>
									<div className="w-full bg-gray-200 rounded-full h-2">
										<div
											className={`h-2 rounded-full transition-all duration-700 ${category.color}`}
											style={{
												width: `${category.value}%`,
											}}
										></div>
									</div>
									<div className="text-sm font-medium text-gray-900">
										{formatCurrency(category.amount)}
									</div>
								</div>
							))}
						</div>
					</CardContent>
				</Card>

				{/* Recent Requests */}
				<Card>
					<CardHeader>
						<CardTitle className="flex items-center gap-2">
							<FileText className="h-5 w-5" />
							Yêu cầu gần đây
						</CardTitle>
						<CardDescription>
							Các yêu cầu mua hộ mới nhất
						</CardDescription>
					</CardHeader>
					<CardContent>
						<div className="space-y-3">
							{recentRequests.map((request, index) => (
								<div
									key={index}
									className="flex items-center justify-between p-3 bg-gray-50 rounded-lg hover:bg-gray-100 transition-colors cursor-pointer"
								>
									<div className="flex items-center gap-3">
										<div className="w-10 h-10 bg-blue-100 rounded-lg flex items-center justify-center">
											<FileText className="h-5 w-5 text-blue-600" />
										</div>
										<div>
											<div className="font-medium text-sm">
												{request.id}
											</div>
											<div className="text-xs text-gray-500">
												{request.customer} •{" "}
												{request.category}
											</div>
										</div>
									</div>
									<div className="text-right">
										<div className="font-medium text-sm">
											{formatCurrency(request.amount)}
										</div>
										<div className="text-xs text-gray-500">
											{request.time}
										</div>
									</div>
									<span
										className={`px-2 py-1 rounded-full text-xs font-medium ${getStatusColor(
											request.status
										)}`}
									>
										{request.status}
									</span>
								</div>
							))}
						</div>
					</CardContent>
				</Card>
			</div>

			{/* Quick Actions */}
			<div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
				<Card className="hover:shadow-lg transition-all duration-300 cursor-pointer border-2 hover:border-blue-200 group">
					<CardContent className="p-6 text-center">
						<Users className="h-8 w-8 text-blue-600 mx-auto mb-3 group-hover:scale-110 transition-transform" />
						<h3 className="font-semibold text-gray-900 mb-1">
							Quản lý người dùng
						</h3>
						<p className="text-sm text-gray-600">
							Quản lý khách hàng và admin
						</p>
					</CardContent>
				</Card>

				<Card className="hover:shadow-lg transition-all duration-300 cursor-pointer border-2 hover:border-green-200 group">
					<CardContent className="p-6 text-center">
						<Package className="h-8 w-8 text-green-600 mx-auto mb-3 group-hover:scale-110 transition-transform" />
						<h3 className="font-semibold text-gray-900 mb-1">
							Quản lý yêu cầu
						</h3>
						<p className="text-sm text-gray-600">
							Xử lý yêu cầu mua hộ
						</p>
					</CardContent>
				</Card>

				<Card className="hover:shadow-lg transition-all duration-300 cursor-pointer border-2 hover:border-yellow-200 group">
					<CardContent className="p-6 text-center">
						<BarChart3 className="h-8 w-8 text-yellow-600 mx-auto mb-3 group-hover:scale-110 transition-transform" />
						<h3 className="font-semibold text-gray-900 mb-1">
							Thống kê doanh thu
						</h3>
						<p className="text-sm text-gray-600">
							Xem báo cáo chi tiết
						</p>
					</CardContent>
				</Card>

				<Card className="hover:shadow-lg transition-all duration-300 cursor-pointer border-2 hover:border-purple-200 group">
					<CardContent className="p-6 text-center">
						<Star className="h-8 w-8 text-purple-600 mx-auto mb-3 group-hover:scale-110 transition-transform" />
						<h3 className="font-semibold text-gray-900 mb-1">
							Cấu hình hệ thống
						</h3>
						<p className="text-sm text-gray-600">
							Thiết lập và cấu hình
						</p>
					</CardContent>
				</Card>
			</div>

			{/* System Alerts */}
			<Card className="border-l-4 border-l-orange-500">
				<CardHeader>
					<CardTitle className="flex items-center gap-2 text-orange-700">
						<AlertCircle className="h-5 w-5" />
						Thông báo hệ thống
					</CardTitle>
				</CardHeader>
				<CardContent>
					<div className="space-y-3">
						<div className="flex items-start gap-3 p-3 bg-orange-50 rounded-lg hover:bg-orange-100 transition-colors">
							<div className="w-2 h-2 bg-orange-500 rounded-full mt-2"></div>
							<div>
								<p className="text-sm font-medium text-orange-800">
									Có {stats.activeRequests} yêu cầu đang chờ
									xử lý
								</p>
								<p className="text-xs text-orange-600">
									Cần xem xét và báo giá trong 24 giờ tới
								</p>
							</div>
						</div>
						<div className="flex items-start gap-3 p-3 bg-blue-50 rounded-lg hover:bg-blue-100 transition-colors">
							<div className="w-2 h-2 bg-blue-500 rounded-full mt-2"></div>
							<div>
								<p className="text-sm font-medium text-blue-800">
									Hệ thống thanh toán đang hoạt động bình
									thường
								</p>
								<p className="text-xs text-blue-600">
									Tất cả giao dịch được xử lý thành công
								</p>
							</div>
						</div>
						<div className="flex items-start gap-3 p-3 bg-green-50 rounded-lg hover:bg-green-100 transition-colors">
							<div className="w-2 h-2 bg-green-500 rounded-full mt-2"></div>
							<div>
								<p className="text-sm font-medium text-green-800">
									Doanh thu tháng này tăng 15.2%
								</p>
								<p className="text-xs text-green-600">
									Đạt 82% mục tiêu đề ra cho tháng này
								</p>
							</div>
						</div>
					</div>
				</CardContent>
			</Card>
		</div>
	);
};

export default BMDashboard;
