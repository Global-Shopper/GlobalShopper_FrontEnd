import React, { useState } from "react";
import {
	DollarSign,
	TrendingUp,
	TrendingDown,
	Calendar,
	BarChart3,
	ArrowUpRight,
	ArrowDownRight,
	Download,
	Filter,
	RefreshCcw,
} from "lucide-react";
import {
	BarChart,
	Bar,
	XAxis,
	YAxis,
	CartesianGrid,
	Tooltip,
	ResponsiveContainer,
	LineChart,
	Line,
} from "recharts";
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
import { useExportRevenueMutation, useGetRevenueQuery } from "@/services/gshopApi";

const RevenueDashboard = () => {
	// State cho year filter
	const [exportRevenue, { isLoading: isExporting }] = useExportRevenueMutation()
	const [selectedYear, setSelectedYear] = useState(new Date().getFullYear());

	// Helper functions để tạo date ranges
	const getDateRanges = () => {
		const now = new Date();

		// Today range
		const startOfToday = new Date();
		startOfToday.setHours(0, 0, 0, 0);
		const endOfToday = new Date();
		endOfToday.setHours(23, 59, 59, 999);

		// This month range
		const startOfThisMonth = new Date(now.getFullYear(), now.getMonth(), 1);
		const endOfThisMonth = new Date(
			now.getFullYear(),
			now.getMonth() + 1,
			0
		);
		endOfThisMonth.setHours(23, 59, 59, 999);

		// Last month range
		const startOfLastMonth = new Date(
			now.getFullYear(),
			now.getMonth() - 1,
			1
		);
		const endOfLastMonth = new Date(now.getFullYear(), now.getMonth(), 0);
		endOfLastMonth.setHours(23, 59, 59, 999);

		// All time range - từ đầu năm 2024
		const systemStartDate = new Date(2024, 0, 1); // 1/1/2024
		const currentDate = new Date();

		return {
			today: {
				start: startOfToday.getTime(),
				end: endOfToday.getTime(),
			},
			thisMonth: {
				start: startOfThisMonth.getTime(),
				end: endOfThisMonth.getTime(),
			},
			lastMonth: {
				start: startOfLastMonth.getTime(),
				end: endOfLastMonth.getTime(),
			},
			allTime: {
				start: systemStartDate.getTime(),
				end: currentDate.getTime(),
			},
		};
	};

	const dateRanges = getDateRanges();

	// API calls cho các khoảng thời gian khác nhau
	const { data: totalRevenueData } = useGetRevenueQuery({
		startDate: dateRanges.allTime.start,
		endDate: dateRanges.allTime.end,
	});

	const { data: todayRevenueData } = useGetRevenueQuery({
		startDate: dateRanges.today.start,
		endDate: dateRanges.today.end,
	});

	const { data: thisMonthRevenueData } = useGetRevenueQuery({
		startDate: dateRanges.thisMonth.start,
		endDate: dateRanges.thisMonth.end,
	});

	const { data: lastMonthRevenueData } = useGetRevenueQuery({
		startDate: dateRanges.lastMonth.start,
		endDate: dateRanges.lastMonth.end,
	});

	// API calls cho biểu đồ monthly (tất cả 12 tháng)
	const getMonthRange = (year, month) => {
		const startDate = new Date(year, month - 1, 1);
		const endDate = new Date(year, month, 0, 23, 59, 59, 999);
		return {
			start: startDate.getTime(),
			end: endDate.getTime(),
		};
	};

	// API calls cho tất cả 12 tháng của năm được chọn
	const { data: jan2024Data } = useGetRevenueQuery({
		startDate: getMonthRange(selectedYear, 1).start,
		endDate: getMonthRange(selectedYear, 1).end,
	});

	const { data: feb2024Data } = useGetRevenueQuery({
		startDate: getMonthRange(selectedYear, 2).start,
		endDate: getMonthRange(selectedYear, 2).end,
	});

	const { data: mar2024Data } = useGetRevenueQuery({
		startDate: getMonthRange(selectedYear, 3).start,
		endDate: getMonthRange(selectedYear, 3).end,
	});

	const { data: apr2024Data } = useGetRevenueQuery({
		startDate: getMonthRange(selectedYear, 4).start,
		endDate: getMonthRange(selectedYear, 4).end,
	});

	const { data: may2024Data } = useGetRevenueQuery({
		startDate: getMonthRange(selectedYear, 5).start,
		endDate: getMonthRange(selectedYear, 5).end,
	});

	const { data: june2024Data } = useGetRevenueQuery({
		startDate: getMonthRange(selectedYear, 6).start,
		endDate: getMonthRange(selectedYear, 6).end,
	});

	const { data: july2024Data } = useGetRevenueQuery({
		startDate: getMonthRange(selectedYear, 7).start,
		endDate: getMonthRange(selectedYear, 7).end,
	});

	const { data: aug2024Data } = useGetRevenueQuery({
		startDate: getMonthRange(selectedYear, 8).start,
		endDate: getMonthRange(selectedYear, 8).end,
	});

	const { data: sep2024Data } = useGetRevenueQuery({
		startDate: getMonthRange(selectedYear, 9).start,
		endDate: getMonthRange(selectedYear, 9).end,
	});

	const { data: oct2024Data } = useGetRevenueQuery({
		startDate: getMonthRange(selectedYear, 10).start,
		endDate: getMonthRange(selectedYear, 10).end,
	});

	const { data: nov2024Data } = useGetRevenueQuery({
		startDate: getMonthRange(selectedYear, 11).start,
		endDate: getMonthRange(selectedYear, 11).end,
	});

	const { data: dec2024Data } = useGetRevenueQuery({
		startDate: getMonthRange(selectedYear, 12).start,
		endDate: getMonthRange(selectedYear, 12).end,
	}); // Tính toán growth rates
	const calculateGrowth = (current, previous) => {
		const currentVal = parseFloat(current) || 0;
		const previousVal = parseFloat(previous) || 0;
		if (previousVal === 0) return 0;
		return (((currentVal - previousVal) / previousVal) * 100).toFixed(1);
	};

	// Revenue stats từ API data
	const revenueStats = {
		// Fallback: nếu totalRevenue không có, dùng tổng của thisMonth + lastMonth
		totalRevenue:
			parseFloat(totalRevenueData?.total) ||
			parseFloat(thisMonthRevenueData?.total || 0) +
				parseFloat(lastMonthRevenueData?.total || 0),
		totalOnline:
			parseFloat(totalRevenueData?.totalOnline) ||
			parseFloat(thisMonthRevenueData?.totalOnline || 0) +
				parseFloat(lastMonthRevenueData?.totalOnline || 0),
		totalOffline:
			parseFloat(totalRevenueData?.totalOffline) ||
			parseFloat(thisMonthRevenueData?.totalOffline || 0) +
				parseFloat(lastMonthRevenueData?.totalOffline || 0),
		todayRevenue: parseFloat(todayRevenueData?.total || 0),
		thisMonthRevenue: parseFloat(thisMonthRevenueData?.total || 0),
		lastMonthRevenue: parseFloat(lastMonthRevenueData?.total || 0),
		monthlyGrowth: calculateGrowth(
			thisMonthRevenueData?.total,
			lastMonthRevenueData?.total
		),
	};

	// Tạo dữ liệu biểu đồ monthly - tất cả 12 tháng
	const monthlyData = [
		{
			month: "T1",
			revenue: parseFloat(jan2024Data?.total || 0),
			online: parseFloat(jan2024Data?.totalOnline || 0),
			offline: parseFloat(jan2024Data?.totalOffline || 0),
			orders: 0,
		},
		{
			month: "T2",
			revenue: parseFloat(feb2024Data?.total || 0),
			online: parseFloat(feb2024Data?.totalOnline || 0),
			offline: parseFloat(feb2024Data?.totalOffline || 0),
			orders: 0,
		},
		{
			month: "T3",
			revenue: parseFloat(mar2024Data?.total || 0),
			online: parseFloat(mar2024Data?.totalOnline || 0),
			offline: parseFloat(mar2024Data?.totalOffline || 0),
			orders: 0,
		},
		{
			month: "T4",
			revenue: parseFloat(apr2024Data?.total || 0),
			online: parseFloat(apr2024Data?.totalOnline || 0),
			offline: parseFloat(apr2024Data?.totalOffline || 0),
			orders: 0,
		},
		{
			month: "T5",
			revenue: parseFloat(may2024Data?.total || 0),
			online: parseFloat(may2024Data?.totalOnline || 0),
			offline: parseFloat(may2024Data?.totalOffline || 0),
			orders: 0,
		},
		{
			month: "T6",
			revenue: parseFloat(june2024Data?.total || 0),
			online: parseFloat(june2024Data?.totalOnline || 0),
			offline: parseFloat(june2024Data?.totalOffline || 0),
			orders: 0,
		},
		{
			month: "T7",
			revenue: parseFloat(july2024Data?.total || 0),
			online: parseFloat(july2024Data?.totalOnline || 0),
			offline: parseFloat(july2024Data?.totalOffline || 0),
			orders: 0,
		},
		{
			month: "T8",
			revenue: parseFloat(aug2024Data?.total || 0),
			online: parseFloat(aug2024Data?.totalOnline || 0),
			offline: parseFloat(aug2024Data?.totalOffline || 0),
			orders: 0,
		},
		{
			month: "T9",
			revenue: parseFloat(sep2024Data?.total || 0),
			online: parseFloat(sep2024Data?.totalOnline || 0),
			offline: parseFloat(sep2024Data?.totalOffline || 0),
			orders: 0,
		},
		{
			month: "T10",
			revenue: parseFloat(oct2024Data?.total || 0),
			online: parseFloat(oct2024Data?.totalOnline || 0),
			offline: parseFloat(oct2024Data?.totalOffline || 0),
			orders: 0,
		},
		{
			month: "T11",
			revenue: parseFloat(nov2024Data?.total || 0),
			online: parseFloat(nov2024Data?.totalOnline || 0),
			offline: parseFloat(nov2024Data?.totalOffline || 0),
			orders: 0,
		},
		{
			month: "T12",
			revenue: parseFloat(dec2024Data?.total || 0),
			online: parseFloat(dec2024Data?.totalOnline || 0),
			offline: parseFloat(dec2024Data?.totalOffline || 0),
			orders: 0,
		},
	];

	const formatCurrency = (amount) => {
		// Chuyển đổi sang triệu và giữ 1 chữ số thập phân
		const millions = amount / 1000000;
		if (millions >= 1) {
			return `${millions.toFixed(1)}M`;
		} else if (amount >= 1000) {
			const thousands = amount / 1000;
			return `${thousands.toFixed(1)}K`;
		} else {
			return `${amount.toFixed(0)} `;
		}
	};

	const handleRefresh = () => {
		// Force refresh component
		window.location.reload();
	};

	const handleExport = async () => {
		try {
			const blob = await exportRevenue({ year: selectedYear }).unwrap();
			const url = window.URL.createObjectURL(blob);
			const a = document.createElement("a");
			a.href = url;
			a.download = `revenue-report-${selectedYear}.xlsx`;
			document.body.appendChild(a);
			a.click();
			a.remove();
			window.URL.revokeObjectURL(url);
		} catch (e) {
			// Optional: surface error to user
			console.warn("Export revenue failed", e);
		}
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
					<Button
						variant="outline"
						onClick={handleRefresh}
						disabled={false}
					>
						<RefreshCcw className="h-4 w-4 mr-2" />
						Làm mới
					</Button>
					<Button onClick={handleExport} disabled={isExporting}>
						<Download className="h-4 w-4 mr-2" />
						{isExporting ? "Đang xuất..." : "Xuất báo cáo"}
					</Button>
				</div>
			</div>

			{/* Revenue Stats Cards */}
			<div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-6">
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
						<div className="text-sm text-gray-500 mt-1">
							Tổng doanh thu toàn thời gian
						</div>
					</CardContent>
				</Card>

				{/* Online Revenue */}
				<Card className="hover:shadow-lg transition-shadow">
					<CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
						<CardTitle className="text-sm font-medium text-gray-600">
							Đơn từ các sàn thương mại
						</CardTitle>
						<TrendingUp className="h-5 w-5 text-green-600" />
					</CardHeader>
					<CardContent>
						<div className="text-2xl font-bold text-gray-900">
							{formatCurrency(revenueStats.totalOnline)}
						</div>
						<div className="text-sm text-gray-500 mt-1">
							{(
								(revenueStats.totalOnline /
									revenueStats.totalRevenue) *
								100
							).toFixed(1)}
							% tổng doanh thu
						</div>
					</CardContent>
				</Card>

				{/* Offline Revenue */}
				<Card className="hover:shadow-lg transition-shadow">
					<CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
						<CardTitle className="text-sm font-medium text-gray-600">
							Đơn nội địa quốc tế
						</CardTitle>
						<BarChart3 className="h-5 w-5 text-orange-600" />
					</CardHeader>
					<CardContent>
						<div className="text-2xl font-bold text-gray-900">
							{formatCurrency(revenueStats.totalOffline)}
						</div>
						<div className="text-sm text-gray-500 mt-1">
							{(
								(revenueStats.totalOffline /
									revenueStats.totalRevenue) *
								100
							).toFixed(1)}
							% tổng doanh thu
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
							{formatCurrency(revenueStats.thisMonthRevenue)}
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
								{revenueStats.monthlyGrowth >= 0 ? "+" : ""}
								{revenueStats.monthlyGrowth}% từ tháng trước
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
							{formatCurrency(revenueStats.todayRevenue)}
						</div>
						<div className="flex items-center text-sm mt-1 text-gray-500">
							<Calendar className="h-4 w-4 mr-1" />
							<span>Doanh thu trong ngày</span>
						</div>
					</CardContent>
				</Card>
			</div>

			{/* Revenue Trend Line Chart */}
			<div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
				<Card>
					<CardHeader className="flex flex-row items-center justify-between">
						<div>
							<CardTitle className="flex items-center gap-2">
								<TrendingUp className="h-5 w-5" />
								Doanh thu theo tháng
							</CardTitle>
							<CardDescription>
								Biểu đồ doanh thu theo tháng trong năm
							</CardDescription>
						</div>
						<Select
							value={selectedYear.toString()}
							onValueChange={(value) =>
								setSelectedYear(parseInt(value))
							}
						>
							<SelectTrigger className="w-32">
								<SelectValue />
							</SelectTrigger>
							<SelectContent>
								<SelectItem value="2025">2025</SelectItem>
								<SelectItem value="2024">2024</SelectItem>
								<SelectItem value="2023">2023</SelectItem>
							</SelectContent>
						</Select>
					</CardHeader>
					<CardContent>
						<ResponsiveContainer width="100%" height={350}>
							<LineChart data={monthlyData}>
								<CartesianGrid
									strokeDasharray="3 3"
									stroke="#f0f0f0"
								/>
								<XAxis dataKey="month" />
								<YAxis
									tickFormatter={(value) =>
										formatCurrency(value)
									}
								/>
								<Tooltip
									formatter={(value) => [
										formatCurrency(value),
										"Doanh thu",
									]}
									labelFormatter={(label) => `Tháng ${label}`}
								/>
								<Line
									type="monotone"
									dataKey="revenue"
									stroke="#3b82f6"
									strokeWidth={3}
									dot={{
										fill: "#3b82f6",
										strokeWidth: 2,
										r: 5,
									}}
									activeDot={{ r: 7 }}
								/>
							</LineChart>
						</ResponsiveContainer>
					</CardContent>
				</Card>

				{/* Online vs Offline Revenue Chart */}
				<Card>
					<CardHeader className="flex flex-row items-center justify-between">
						<div>
							<CardTitle className="flex items-center gap-2">
								<BarChart3 className="h-5 w-5" />
								Loại đơn hàng
							</CardTitle>
							<CardDescription>
								Doanh thu loại đơn hàng theo tháng trong năm
							</CardDescription>
						</div>
						<Select
							value={selectedYear.toString()}
							onValueChange={(value) =>
								setSelectedYear(parseInt(value))
							}
						>
							<SelectTrigger className="w-32">
								<SelectValue />
							</SelectTrigger>
							<SelectContent>
								<SelectItem value="2025">2025</SelectItem>
								<SelectItem value="2024">2024</SelectItem>
								<SelectItem value="2023">2023</SelectItem>
							</SelectContent>
						</Select>
					</CardHeader>
					<CardContent>
						<ResponsiveContainer width="100%" height={350}>
							<BarChart data={monthlyData}>
								<CartesianGrid
									strokeDasharray="3 3"
									stroke="#f0f0f0"
								/>
								<XAxis dataKey="month" />
								<YAxis
									tickFormatter={(value) =>
										formatCurrency(value)
									}
								/>
								<Tooltip
									formatter={(value, name) => [
										formatCurrency(value),
										name === "online"
											? "Online"
											: "Offline",
									]}
									labelFormatter={(label) => `Tháng ${label}`}
								/>
								<Bar
									dataKey="online"
									fill="#10b981"
									name="online"
									radius={[2, 2, 0, 0]}
								/>
								<Bar
									dataKey="offline"
									fill="#f59e0b"
									name="offline"
									radius={[2, 2, 0, 0]}
								/>
							</BarChart>
						</ResponsiveContainer>
					</CardContent>
				</Card>
			</div>
		</div>
	);
};

export default RevenueDashboard;
