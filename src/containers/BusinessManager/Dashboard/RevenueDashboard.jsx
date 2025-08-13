import React, { useState } from "react";
import {
	DollarSign,
	TrendingUp,
	TrendingDown,
	Calendar,
	BarChart3,
	PieChart,
	ArrowUpRight,
	ArrowDownRight,
	Download,
	Filter,
	RefreshCcw,
} from "lucide-react";
import {
	Card,
	CardContent,
	CardDescription,
	CardHeader,
	CardTitle,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import {
	Select,
	SelectContent,
	SelectItem,
	SelectTrigger,
	SelectValue,
} from "@/components/ui/select";

const RevenueDashboard = () => {
	const [timeRange, setTimeRange] = useState("thisMonth");
	const [loading, setLoading] = useState(false);

	// Mock data - trong thực tế sẽ lấy từ API
	const revenueStats = {
		totalRevenue: 845650000,
		monthlyRevenue: 245000000,
		weeklyRevenue: 65000000,
		dailyRevenue: 8500000,
		monthlyGrowth: 15.2,
		weeklyGrowth: 8.7,
		dailyGrowth: -2.3,
		totalOrders: 8432,
		averageOrderValue: 100250,
		topSellingCategory: "Điện tử",
	};

	const monthlyData = [
		{ month: "T1", revenue: 180000000, orders: 5200 },
		{ month: "T2", revenue: 195000000, orders: 5800 },
		{ month: "T3", revenue: 220000000, orders: 6200 },
		{ month: "T4", revenue: 210000000, orders: 5900 },
		{ month: "T5", revenue: 235000000, orders: 6800 },
		{ month: "T6", revenue: 245000000, orders: 7100 },
		{ month: "T7", revenue: 260000000, orders: 7500 },
		{ month: "T8", revenue: 275000000, orders: 7800 },
	];

	const categoryRevenue = [
		{
			category: "Điện tử",
			revenue: 125000000,
			percentage: 51.0,
			color: "bg-blue-500",
		},
		{
			category: "Thời trang",
			revenue: 73500000,
			percentage: 30.0,
			color: "bg-green-500",
		},
		{
			category: "Gia dụng",
			revenue: 29400000,
			percentage: 12.0,
			color: "bg-yellow-500",
		},
		{
			category: "Khác",
			revenue: 17100000,
			percentage: 7.0,
			color: "bg-purple-500",
		},
	];

	const topRequests = [
		{
			type: "Điện tử & Công nghệ",
			requests: 1250,
			revenue: 45000000,
			avgValue: 36000,
			growth: 12.5,
		},
		{
			type: "Thời trang & Phụ kiện",
			requests: 980,
			revenue: 38500000,
			avgValue: 39285,
			growth: 8.3,
		},
		{
			type: "Mỹ phẩm & Làm đẹp",
			requests: 750,
			revenue: 32000000,
			avgValue: 42666,
			growth: 15.7,
		},
		{
			type: "Gia dụng & Nội thất",
			requests: 620,
			revenue: 28750000,
			avgValue: 46370,
			growth: -2.1,
		},
		{
			type: "Thể thao & Outdoor",
			requests: 540,
			revenue: 25600000,
			avgValue: 47407,
			growth: 22.4,
		},
	];

	const serviceStats = [
		{
			service: "Phí dịch vụ mua hộ",
			revenue: 89500000,
			percentage: 36.5,
			requests: 4200,
		},
		{
			service: "Phí vận chuyển quốc tế",
			revenue: 73500000,
			percentage: 30.0,
			requests: 3800,
		},
		{
			service: "Phí kiểm tra & đóng gói",
			revenue: 49000000,
			percentage: 20.0,
			requests: 3900,
		},
		{
			service: "Phí bảo hiểm hàng hóa",
			revenue: 33250000,
			percentage: 13.5,
			requests: 2100,
		},
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

	const handleRefresh = () => {
		setLoading(true);
		setTimeout(() => setLoading(false), 1000);
	};

	const getGrowthColor = (growth) => {
		return growth >= 0 ? "text-green-600" : "text-red-600";
	};

	const getGrowthIcon = (growth) => {
		return growth >= 0 ? ArrowUpRight : ArrowDownRight;
	};

	return (
		<div className="p-6 space-y-6">
			{/* Header */}
			<div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
				<div>
					<h1 className="text-3xl font-bold text-gray-900">
						Thống kê doanh thu
					</h1>
					<p className="text-gray-600 mt-1">
						Tổng quan chi tiết về doanh thu và hiệu quả kinh doanh
					</p>
				</div>
				<div className="flex items-center gap-3">
					<Select value={timeRange} onValueChange={setTimeRange}>
						<SelectTrigger className="w-40">
							<SelectValue />
						</SelectTrigger>
						<SelectContent>
							<SelectItem value="today">Hôm nay</SelectItem>
							<SelectItem value="thisWeek">Tuần này</SelectItem>
							<SelectItem value="thisMonth">Tháng này</SelectItem>
							<SelectItem value="thisYear">Năm này</SelectItem>
							<SelectItem value="custom">Tùy chỉnh</SelectItem>
						</SelectContent>
					</Select>
					<Button
						variant="outline"
						onClick={handleRefresh}
						disabled={loading}
					>
						<RefreshCcw
							className={`h-4 w-4 mr-2 ${
								loading ? "animate-spin" : ""
							}`}
						/>
						Làm mới
					</Button>
					<Button>
						<Download className="h-4 w-4 mr-2" />
						Xuất báo cáo
					</Button>
				</div>
			</div>

			{/* Revenue Stats Cards */}
			<div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
				{/* Total Revenue */}
				<Card className="hover:shadow-lg transition-shadow">
					<CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
						<CardTitle className="text-sm font-medium text-gray-600">
							Tổng doanh thu
						</CardTitle>
						<DollarSign className="h-5 w-5 text-green-600" />
					</CardHeader>
					<CardContent>
						<div className="text-2xl font-bold text-gray-900">
							{formatCurrency(revenueStats.totalRevenue)}
						</div>
						<div
							className={`flex items-center text-sm mt-1 ${getGrowthColor(
								revenueStats.monthlyGrowth
							)}`}
						>
							{React.createElement(
								getGrowthIcon(revenueStats.monthlyGrowth),
								{ className: "h-4 w-4 mr-1" }
							)}
							<span>
								+{revenueStats.monthlyGrowth}% từ tháng trước
							</span>
						</div>
					</CardContent>
				</Card>

				{/* Monthly Revenue */}
				<Card className="hover:shadow-lg transition-shadow">
					<CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
						<CardTitle className="text-sm font-medium text-gray-600">
							Doanh thu tháng này
						</CardTitle>
						<TrendingUp className="h-5 w-5 text-blue-600" />
					</CardHeader>
					<CardContent>
						<div className="text-2xl font-bold text-gray-900">
							{formatCurrency(revenueStats.monthlyRevenue)}
						</div>
						<div
							className={`flex items-center text-sm mt-1 ${getGrowthColor(
								revenueStats.weeklyGrowth
							)}`}
						>
							{React.createElement(
								getGrowthIcon(revenueStats.weeklyGrowth),
								{ className: "h-4 w-4 mr-1" }
							)}
							<span>
								+{revenueStats.weeklyGrowth}% từ tuần trước
							</span>
						</div>
					</CardContent>
				</Card>

				{/* Daily Revenue */}
				<Card className="hover:shadow-lg transition-shadow">
					<CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
						<CardTitle className="text-sm font-medium text-gray-600">
							Doanh thu hôm nay
						</CardTitle>
						<Calendar className="h-5 w-5 text-purple-600" />
					</CardHeader>
					<CardContent>
						<div className="text-2xl font-bold text-gray-900">
							{formatCurrency(revenueStats.dailyRevenue)}
						</div>
						<div
							className={`flex items-center text-sm mt-1 ${getGrowthColor(
								revenueStats.dailyGrowth
							)}`}
						>
							{React.createElement(
								getGrowthIcon(revenueStats.dailyGrowth),
								{ className: "h-4 w-4 mr-1" }
							)}
							<span>{revenueStats.dailyGrowth}% từ hôm qua</span>
						</div>
					</CardContent>
				</Card>

				{/* Average Order Value */}
				<Card className="hover:shadow-lg transition-shadow">
					<CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
						<CardTitle className="text-sm font-medium text-gray-600">
							Giá trị đơn hàng TB
						</CardTitle>
						<BarChart3 className="h-5 w-5 text-orange-600" />
					</CardHeader>
					<CardContent>
						<div className="text-2xl font-bold text-gray-900">
							{formatCurrency(revenueStats.averageOrderValue)}
						</div>
						<div className="text-sm text-gray-500 mt-1">
							Từ {formatNumber(revenueStats.totalOrders)} đơn hàng
						</div>
					</CardContent>
				</Card>
			</div>

			{/* Charts Row */}
			<div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
				{/* Monthly Revenue Chart */}
				<Card>
					<CardHeader>
						<CardTitle className="flex items-center gap-2">
							<BarChart3 className="h-5 w-5" />
							Doanh thu theo tháng
						</CardTitle>
						<CardDescription>
							Biểu đồ doanh thu 8 tháng gần nhất
						</CardDescription>
					</CardHeader>
					<CardContent>
						<div className="space-y-4">
							{monthlyData.map((item, index) => (
								<div
									key={index}
									className="flex items-center justify-between"
								>
									<div className="flex items-center gap-3">
										<div className="w-10 text-sm font-medium text-gray-600">
											{item.month}
										</div>
										<div className="flex-1">
											<div
												className="bg-blue-500 h-6 rounded-md flex items-center justify-end pr-2"
												style={{
													width: `${
														(item.revenue /
															Math.max(
																...monthlyData.map(
																	(d) =>
																		d.revenue
																)
															)) *
														100
													}%`,
													minWidth: "60px",
												}}
											>
												<span className="text-white text-xs font-medium">
													{formatCurrency(
														item.revenue
													)}
												</span>
											</div>
										</div>
									</div>
									<div className="text-sm text-gray-500 w-20 text-right">
										{formatNumber(item.orders)} đơn
									</div>
								</div>
							))}
						</div>
					</CardContent>
				</Card>

				{/* Category Revenue */}
				<Card>
					<CardHeader>
						<CardTitle className="flex items-center gap-2">
							<PieChart className="h-5 w-5" />
							Doanh thu theo danh mục
						</CardTitle>
						<CardDescription>
							Phân bổ doanh thu theo từng danh mục sản phẩm
						</CardDescription>
					</CardHeader>
					<CardContent>
						<div className="space-y-4">
							{categoryRevenue.map((item, index) => (
								<div key={index} className="space-y-2">
									<div className="flex items-center justify-between">
										<div className="flex items-center gap-3">
											<div
												className={`w-3 h-3 rounded-full ${item.color}`}
											></div>
											<span className="text-sm font-medium">
												{item.category}
											</span>
										</div>
										<div className="text-sm text-gray-500">
											{item.percentage}%
										</div>
									</div>
									<div className="w-full bg-gray-200 rounded-full h-2">
										<div
											className={`h-2 rounded-full ${item.color}`}
											style={{
												width: `${item.percentage}%`,
											}}
										></div>
									</div>
									<div className="text-sm font-medium text-gray-900">
										{formatCurrency(item.revenue)}
									</div>
								</div>
							))}
						</div>
					</CardContent>
				</Card>
			</div>

			{/* Top Request Categories & Service Revenue */}
			<div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
				{/* Top Request Categories */}
				<Card>
					<CardHeader>
						<CardTitle className="flex items-center gap-2">
							<TrendingUp className="h-5 w-5" />
							Danh mục yêu cầu hàng đầu
						</CardTitle>
						<CardDescription>
							Top 5 danh mục có nhiều yêu cầu mua hộ nhất
						</CardDescription>
					</CardHeader>
					<CardContent>
						<div className="space-y-4">
							{topRequests.map((request, index) => (
								<div
									key={index}
									className="flex items-center justify-between p-4 bg-gray-50 rounded-lg hover:bg-gray-100 transition-colors"
								>
									<div className="flex items-center gap-4">
										<div className="w-8 h-8 bg-blue-100 rounded-lg flex items-center justify-center">
											<span className="text-blue-600 font-bold text-sm">
												#{index + 1}
											</span>
										</div>
										<div>
											<div className="font-medium text-gray-900">
												{request.type}
											</div>
											<div className="text-sm text-gray-500">
												{formatNumber(request.requests)}{" "}
												yêu cầu • TB:{" "}
												{formatCurrency(
													request.avgValue
												)}
											</div>
										</div>
									</div>
									<div className="text-right">
										<div className="font-medium text-gray-900">
											{formatCurrency(request.revenue)}
										</div>
										<div
											className={`text-sm flex items-center justify-end ${getGrowthColor(
												request.growth
											)}`}
										>
											{React.createElement(
												getGrowthIcon(request.growth),
												{ className: "h-3 w-3 mr-1" }
											)}
											<span>
												{Math.abs(request.growth)}%
											</span>
										</div>
									</div>
								</div>
							))}
						</div>
					</CardContent>
				</Card>

				{/* Service Revenue Breakdown */}
				<Card>
					<CardHeader>
						<CardTitle className="flex items-center gap-2">
							<BarChart3 className="h-5 w-5" />
							Doanh thu theo dịch vụ
						</CardTitle>
						<CardDescription>
							Phân tích doanh thu từ các dịch vụ trung gian
						</CardDescription>
					</CardHeader>
					<CardContent>
						<div className="space-y-4">
							{serviceStats.map((service, index) => (
								<div key={index} className="space-y-2">
									<div className="flex items-center justify-between">
										<div className="flex items-center gap-3">
											<div className="w-3 h-3 rounded-full bg-gradient-to-r from-blue-500 to-purple-500"></div>
											<span className="text-sm font-medium">
												{service.service}
											</span>
										</div>
										<div className="text-sm text-gray-500">
											{service.percentage}%
										</div>
									</div>
									<div className="w-full bg-gray-200 rounded-full h-2">
										<div
											className="h-2 rounded-full bg-gradient-to-r from-blue-500 to-purple-500"
											style={{
												width: `${service.percentage}%`,
											}}
										></div>
									</div>
									<div className="flex justify-between text-sm">
										<span className="font-medium text-gray-900">
											{formatCurrency(service.revenue)}
										</span>
										<span className="text-gray-500">
											{formatNumber(service.requests)} yêu
											cầu
										</span>
									</div>
								</div>
							))}
						</div>
					</CardContent>
				</Card>
			</div>

			{/* Summary Insights */}
			<div className="grid grid-cols-1 md:grid-cols-3 gap-6">
				<Card className="border-l-4 border-l-green-500">
					<CardContent className="p-6">
						<div className="flex items-center gap-3">
							<div className="w-10 h-10 bg-green-100 rounded-lg flex items-center justify-center">
								<TrendingUp className="h-5 w-5 text-green-600" />
							</div>
							<div>
								<h3 className="font-semibold text-green-800">
									Xu hướng tích cực
								</h3>
								<p className="text-sm text-green-600">
									Doanh thu tăng 15.2% so với tháng trước
								</p>
							</div>
						</div>
					</CardContent>
				</Card>

				<Card className="border-l-4 border-l-blue-500">
					<CardContent className="p-6">
						<div className="flex items-center gap-3">
							<div className="w-10 h-10 bg-blue-100 rounded-lg flex items-center justify-center">
								<BarChart3 className="h-5 w-5 text-blue-600" />
							</div>
							<div>
								<h3 className="font-semibold text-blue-800">
									Dịch vụ hàng đầu
								</h3>
								<p className="text-sm text-blue-600">
									Phí mua hộ chiếm 36.5% tổng doanh thu
								</p>
							</div>
						</div>
					</CardContent>
				</Card>

				<Card className="border-l-4 border-l-purple-500">
					<CardContent className="p-6">
						<div className="flex items-center gap-3">
							<div className="w-10 h-10 bg-purple-100 rounded-lg flex items-center justify-center">
								<DollarSign className="h-5 w-5 text-purple-600" />
							</div>
							<div>
								<h3 className="font-semibold text-purple-800">
									Hiệu quả dịch vụ
								</h3>
								<p className="text-sm text-purple-600">
									4,200 yêu cầu được xử lý thành công
								</p>
							</div>
						</div>
					</CardContent>
				</Card>
			</div>
		</div>
	);
};

export default RevenueDashboard;
