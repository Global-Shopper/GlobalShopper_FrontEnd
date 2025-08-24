import React, { useState, useMemo } from "react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import {
	useGetBMDashboardQuery,
	useGetBMCustomerQuery,
} from "@/services/gshopApi";
import {
	Users,
	ShoppingCart,
	Package,
	Calendar,
	AlertCircle,
	FileText,
	Target,
	Star,
	CreditCard,
	RefreshCw,
	ThumbsUp,
	Wallet,
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
	Area,
	AreaChart,
	PieChart,
	Pie,
	ComposedChart,
	Cell,
} from "recharts";
import {
	Card,
	CardContent,
	CardDescription,
	CardHeader,
	CardTitle,
} from "@/components/ui/card";

const BMDashboard = () => {
	// Year filter state
	const [selectedYear, setSelectedYear] = useState(new Date().getFullYear());

	// Date state for dashboard filtering with localStorage persistence
	const [dateRange, setDateRange] = useState(() => {
		// Try to get saved date range from localStorage
		try {
			const savedDateRange = localStorage.getItem(
				"bm-dashboard-daterange"
			);
			if (savedDateRange) {
				const parsed = JSON.parse(savedDateRange);
				// Validate dates
				if (
					parsed.startDate &&
					parsed.endDate &&
					new Date(parsed.startDate).getTime() &&
					new Date(parsed.endDate).getTime()
				) {
					return parsed;
				}
			}
		} catch (error) {
			console.warn("Error loading saved date range:", error);
		}

		// Default to last 30 days
		const now = new Date();
		const oneMonthAgo = new Date();
		oneMonthAgo.setMonth(now.getMonth() - 1);

		return {
			startDate: oneMonthAgo.toISOString().split("T")[0],
			endDate: now.toISOString().split("T")[0],
		};
	});

	// Save dateRange to localStorage when it changes
	React.useEffect(() => {
		try {
			localStorage.setItem(
				"bm-dashboard-daterange",
				JSON.stringify(dateRange)
			);
		} catch (error) {
			console.warn("Error saving date range:", error);
		}
	}, [dateRange]);

	// Convert dates to timestamps for API
	const apiParams = useMemo(() => {
		// Handle empty or invalid dates
		const startDate =
			dateRange.startDate ||
			new Date(Date.now() - 30 * 24 * 60 * 60 * 1000)
				.toISOString()
				.split("T")[0];
		const endDate =
			dateRange.endDate || new Date().toISOString().split("T")[0];

		const startTimestamp = new Date(startDate).getTime();
		const endTimestamp = new Date(endDate).getTime();

		// Check if timestamps are valid
		if (isNaN(startTimestamp) || isNaN(endTimestamp)) {
			console.warn("Invalid date range, using default values");
			const defaultEnd = Date.now();
			const defaultStart = defaultEnd - 30 * 24 * 60 * 60 * 1000; // 30 days ago
			return {
				startDate: defaultStart,
				endDate: defaultEnd,
			};
		}

		return {
			startDate: startTimestamp,
			endDate: endTimestamp,
		};
	}, [dateRange]);

	// API call for dashboard data
	const {
		data: dashboardData,
		isLoading,
		isError,
		error,
		refetch,
	} = useGetBMDashboardQuery(apiParams);

	// API call for customer data
	const { data: customerData } = useGetBMCustomerQuery({
		page: 0,
		size: 1, // We only need total count
		startDate: apiParams.startDate,
		endDate: apiParams.endDate,
	});

	// Helper function to get month range for API calls
	const getMonthRange = (year, month) => {
		const startDate = new Date(year, month - 1, 1);
		const endDate = new Date(year, month, 0, 23, 59, 59, 999);
		return {
			start: startDate.getTime(),
			end: endDate.getTime(),
		};
	};

	// API calls for monthly data based on selected year
	const { data: janData } = useGetBMDashboardQuery({
		startDate: getMonthRange(selectedYear, 1).start,
		endDate: getMonthRange(selectedYear, 1).end,
	});

	const { data: febData } = useGetBMDashboardQuery({
		startDate: getMonthRange(selectedYear, 2).start,
		endDate: getMonthRange(selectedYear, 2).end,
	});

	const { data: marData } = useGetBMDashboardQuery({
		startDate: getMonthRange(selectedYear, 3).start,
		endDate: getMonthRange(selectedYear, 3).end,
	});

	const { data: aprData } = useGetBMDashboardQuery({
		startDate: getMonthRange(selectedYear, 4).start,
		endDate: getMonthRange(selectedYear, 4).end,
	});

	const { data: mayData } = useGetBMDashboardQuery({
		startDate: getMonthRange(selectedYear, 5).start,
		endDate: getMonthRange(selectedYear, 5).end,
	});

	const { data: junData } = useGetBMDashboardQuery({
		startDate: getMonthRange(selectedYear, 6).start,
		endDate: getMonthRange(selectedYear, 6).end,
	});

	const { data: julData } = useGetBMDashboardQuery({
		startDate: getMonthRange(selectedYear, 7).start,
		endDate: getMonthRange(selectedYear, 7).end,
	});

	const { data: augData } = useGetBMDashboardQuery({
		startDate: getMonthRange(selectedYear, 8).start,
		endDate: getMonthRange(selectedYear, 8).end,
	});

	const { data: sepData } = useGetBMDashboardQuery({
		startDate: getMonthRange(selectedYear, 9).start,
		endDate: getMonthRange(selectedYear, 9).end,
	});

	const { data: octData } = useGetBMDashboardQuery({
		startDate: getMonthRange(selectedYear, 10).start,
		endDate: getMonthRange(selectedYear, 10).end,
	});

	const { data: novData } = useGetBMDashboardQuery({
		startDate: getMonthRange(selectedYear, 11).start,
		endDate: getMonthRange(selectedYear, 11).end,
	});

	const { data: decData } = useGetBMDashboardQuery({
		startDate: getMonthRange(selectedYear, 12).start,
		endDate: getMonthRange(selectedYear, 12).end,
	});

	// Use real data if available, otherwise fallback to mock data
	const stats = useMemo(() => {
		const mockStats = {
			totalUsers: 12547,
			totalRequests: 5847,
			totalOrders: 4234,
			totalRevenue: 245000000,
			activeRequests: 234,
			pendingRequests: 189,
			completedRequests: 4956,
			totalRefund: 156,
			completedRefund: 89,
			totalWithdraw: 78,
			completedWithdraw: 67,
			monthlyGrowth: 12.5,
			userGrowth: 8.3,
			requestGrowth: 18.7,
		};

		if (dashboardData?.dashBoardList) {
			// Map API data to expected format
			const purchaseRequest = dashboardData.dashBoardList.find(
				(item) => item.dashBoardName === "PurchaseRequest"
			);
			const refundTicket = dashboardData.dashBoardList.find(
				(item) => item.dashBoardName === "RefundTicket"
			);
			const withdrawTicket = dashboardData.dashBoardList.find(
				(item) => item.dashBoardName === "WithdrawTicket"
			);

			// Extract status counts for purchase requests
			const totalRequests = purchaseRequest?.total || 0;
			const completedRequests =
				purchaseRequest?.statusList?.find((s) => s.status === "PAID")
					?.count || 0;
			const activeRequests =
				purchaseRequest?.statusList?.find(
					(s) => s.status === "CHECKING"
				)?.count || 0;
			const pendingRequests =
				purchaseRequest?.statusList?.find((s) => s.status === "SENT")
					?.count || 0;

			// Extract refund data
			const totalRefund = refundTicket?.total || 0;
			const completedRefund =
				(refundTicket?.statusList?.find((s) => s.status === "COMPLETED")
					?.count || 0) +
				(refundTicket?.statusList?.find((s) => s.status === "APPROVED")
					?.count || 0);

			// Extract withdraw data
			const totalWithdraw = withdrawTicket?.total || 0;
			const completedWithdraw =
				(withdrawTicket?.statusList?.find(
					(s) => s.status === "COMPLETED"
				)?.count || 0) +
				(withdrawTicket?.statusList?.find(
					(s) => s.status === "APPROVED"
				)?.count || 0);

			return {
				totalUsers: customerData?.totalElements || mockStats.totalUsers,
				totalRequests: totalRequests,
				totalOrders: completedRequests,
				totalRevenue: mockStats.totalRevenue, // This might come from another API
				activeRequests: activeRequests,
				pendingRequests: pendingRequests,
				completedRequests: completedRequests,
				totalRefund: totalRefund,
				completedRefund: completedRefund,
				totalWithdraw: totalWithdraw,
				completedWithdraw: completedWithdraw,
			};
		}
		return {
			totalUsers: 12547,
			totalRequests: 5847,
			totalOrders: 4234,
			totalRevenue: 245000000,
			activeRequests: 234,
			pendingRequests: 189,
			completedRequests: 4956,
			totalRefund: 156,
			completedRefund: 89,
			totalWithdraw: 78,
			completedWithdraw: 67,
			monthlyGrowth: 12.5,
			userGrowth: 8.3,
			requestGrowth: 18.7,
		};
	}, [dashboardData, customerData]);

	// Handle date range change
	const handleDateChange = (field, value) => {
		// Allow empty values, will be handled in apiParams
		setDateRange((prev) => ({
			...prev,
			[field]: value,
		}));
	};

	// Handle clear date ranges
	const handleClearDates = () => {
		const now = new Date();
		const oneMonthAgo = new Date();
		oneMonthAgo.setMonth(now.getMonth() - 1);

		setDateRange({
			startDate: oneMonthAgo.toISOString().split("T")[0],
			endDate: now.toISOString().split("T")[0],
		});
	};

	// Helper functions for status display
	const getStatusLabel = (status) => {
		const statusLabels = {
			SENT: "Đã gửi",
			PAID: "Đã thanh toán",
			INSUFFICIENT: "Cập nhật",
			CHECKING: "Đang kiểm tra",
			CANCELLED: "Đã hủy",
			QUOTED: "Đã báo giá",
			APPROVED: "Đã duyệt",
			COMPLETED: "Hoàn thành",
			FAILED: "Thất bại",
			PENDING: "Chờ xử lý",
			REJECTED: "Từ chối",
		};
		return statusLabels[status] || status;
	};

	const getStatusColor = (status) => {
		const statusColors = {
			SENT: "#3b82f6",
			PAID: "#10b981",
			INSUFFICIENT: "#f59e0b",
			CHECKING: "#8b5cf6",
			CANCELLED: "#ef4444",
			QUOTED: "#06b6d4",
			APPROVED: "#10b981",
			COMPLETED: "#22c55e",
			FAILED: "#ef4444",
			PENDING: "#f59e0b",
			REJECTED: "#ef4444",
		};
		return statusColors[status] || "#6b7280";
	};

	// Process dashboard data from API
	const dashboardStats = useMemo(() => {
		if (!dashboardData?.dashBoardList) {
			return {
				purchaseRequest: null,
				purchaseRequestType: null,
				refundTicket: null,
				withdrawTicket: null,
				order: null,
			};
		}

		const dashboards = {};
		dashboardData.dashBoardList.forEach((item) => {
			dashboards[item.dashBoardName] = item;
		});

		return {
			purchaseRequest: dashboards.PurchaseRequest,
			purchaseRequestType: dashboards.PurchaseRequestType,
			refundTicket: dashboards.RefundTicket,
			withdrawTicket: dashboards.WithdrawTicket,
			order: dashboards.Order,
		};
	}, [dashboardData]);

	// Data cho biểu đồ tròn Purchase Request Type (Online/Offline)
	const purchaseTypeData = useMemo(() => {
		if (!dashboardStats.purchaseRequestType?.statusList) return [];

		return dashboardStats.purchaseRequestType.statusList.map((item) => ({
			name: item.status === "ONLINE" ? "Online" : "Offline",
			value: item.count,
			color: item.status === "ONLINE" ? "#10b981" : "#f59e0b",
		}));
	}, [dashboardStats.purchaseRequestType]);

	// Helper function to extract online/offline counts from monthly data
	const extractMonthlyOnlineOffline = (monthData) => {
		if (!monthData?.dashBoardList) return { online: 0, offline: 0 };

		const purchaseRequestType = monthData.dashBoardList.find(
			(item) => item.dashBoardName === "PurchaseRequestType"
		);

		if (!purchaseRequestType?.statusList) return { online: 0, offline: 0 };

		const online =
			purchaseRequestType.statusList.find((s) => s.status === "ONLINE")
				?.count || 0;
		const offline =
			purchaseRequestType.statusList.find((s) => s.status === "OFFLINE")
				?.count || 0;

		return { online, offline };
	};

	// Data cho biểu đồ xu hướng tháng từ API
	const monthlyTrendData = useMemo(() => {
		const monthsData = [
			{ month: "T1", data: janData },
			{ month: "T2", data: febData },
			{ month: "T3", data: marData },
			{ month: "T4", data: aprData },
			{ month: "T5", data: mayData },
			{ month: "T6", data: junData },
			{ month: "T7", data: julData },
			{ month: "T8", data: augData },
			{ month: "T9", data: sepData },
			{ month: "T10", data: octData },
			{ month: "T11", data: novData },
			{ month: "T12", data: decData },
		];

		return monthsData.map(({ month, data }) => {
			const { online, offline } = extractMonthlyOnlineOffline(data);
			return { month, online, offline };
		});
	}, [
		janData,
		febData,
		marData,
		aprData,
		mayData,
		junData,
		julData,
		augData,
		sepData,
		octData,
		novData,
		decData,
	]);

	// Colors for pie chart
	const PIE_COLORS = ["#10b981", "#f59e0b"]; // Data cho biểu đồ tròn theo danh mục

	const formatNumber = (num) => {
		return new Intl.NumberFormat("vi-VN").format(num);
	};

	return (
		<div className="p-6 space-y-8 bg-gray-50 min-h-screen">
			{/* Header */}
			<div className="bg-white rounded-xl shadow-sm p-6 flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
				<div>
					<h1 className="text-3xl font-bold text-gray-900">
						Dashboard Tổng Quan
					</h1>
					<p className="text-gray-600 mt-1">
						Hệ thống trung gian mua hộ hàng nước ngoài
					</p>
				</div>

				{/* Date Range Controls */}
				<div className="flex flex-col sm:flex-row items-start sm:items-center gap-3">
					<div className="flex items-center gap-2 text-sm text-gray-500">
						<Calendar className="h-4 w-4" />
						<span>Thời gian:</span>
					</div>
					<div className="flex flex-col sm:flex-row gap-2">
						<div className="flex items-center gap-2">
							<label className="text-sm font-medium text-gray-700">
								Từ:
							</label>
							<Input
								type="date"
								value={dateRange.startDate}
								onChange={(e) =>
									handleDateChange(
										"startDate",
										e.target.value
									)
								}
								className="w-40"
							/>
						</div>
						<div className="flex items-center gap-2">
							<label className="text-sm font-medium text-gray-700">
								Đến:
							</label>
							<Input
								type="date"
								value={dateRange.endDate}
								onChange={(e) =>
									handleDateChange("endDate", e.target.value)
								}
								className="w-40"
							/>
						</div>
						<div className="flex gap-2">
							<Button
								onClick={() => refetch()}
								variant="outline"
								size="sm"
								disabled={isLoading}
								className="flex items-center gap-2"
							>
								<RefreshCw
									className={`h-4 w-4 ${
										isLoading ? "animate-spin" : ""
									}`}
								/>
								{isLoading ? "Đang tải..." : "Cập nhật"}
							</Button>
							<Button
								onClick={handleClearDates}
								variant="outline"
								size="sm"
								className="flex items-center gap-2"
							>
								Đặt lại
							</Button>
						</div>
					</div>
				</div>
			</div>

			{/* Loading State */}
			{isLoading && (
				<div className="flex items-center justify-center py-8">
					<div className="text-center">
						<RefreshCw className="h-8 w-8 animate-spin text-blue-600 mx-auto mb-2" />
						<p className="text-gray-600">
							Đang tải dữ liệu dashboard...
						</p>
					</div>
				</div>
			)}

			{/* Error State */}
			{isError && (
				<div className="bg-red-50 border border-red-200 rounded-lg p-4">
					<div className="flex items-center gap-2 text-red-800">
						<AlertCircle className="h-5 w-5" />
						<span className="font-medium">
							Có lỗi xảy ra khi tải dữ liệu
						</span>
					</div>
					<p className="text-red-600 text-sm mt-1">
						{error?.data?.message ||
							error?.message ||
							"Vui lòng thử lại sau"}
					</p>
					<Button
						onClick={() => refetch()}
						variant="outline"
						size="sm"
						className="mt-3"
					>
						<RefreshCw className="h-4 w-4 mr-2" />
						Thử lại
					</Button>
				</div>
			)}

			{/* Stats Cards */}
			<div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 xl:grid-cols-5 gap-4">
				{/* Total Users */}
				<Card className="hover:shadow-lg transition-all duration-300 border-l-2 border-l-blue-500">
					<CardHeader className="flex flex-row items-center justify-between space-y-0 pb-3">
						<CardTitle className="text-sm font-medium text-gray-600">
							Tổng người dùng
						</CardTitle>
						<Users className="h-5 w-5 text-blue-600" />
					</CardHeader>
					<CardContent className="pb-4">
						<div className="text-3xl font-bold text-gray-900 leading-none">
							{formatNumber(stats.totalUsers)}
						</div>
					</CardContent>
				</Card>

				{/* Total Requests */}
				<Card className="hover:shadow-lg transition-all duration-300 border-l-2 border-l-purple-500">
					<CardHeader className="flex flex-row items-center justify-between space-y-0 pb-3">
						<CardTitle className="text-sm font-medium text-gray-600">
							Tổng yêu cầu mua hộ
						</CardTitle>
						<FileText className="h-5 w-5 text-purple-600" />
					</CardHeader>
					<CardContent className="pb-4">
						<div className="text-3xl font-bold text-gray-900 leading-none">
							{formatNumber(stats.totalRequests)}
						</div>
						<div className="mt-1 text-xs text-gray-500">
							{formatNumber(stats.completedRequests)} hoàn thành
						</div>
					</CardContent>
				</Card>

				{/* Total Orders */}
				<Card className="hover:shadow-lg transition-all duration-300 border-l-2 border-l-green-500">
					<CardHeader className="flex flex-row items-center justify-between space-y-0 pb-3">
						<CardTitle className="text-sm font-medium text-gray-600">
							Đơn hàng thành công
						</CardTitle>
						<ShoppingCart className="h-5 w-5 text-green-600" />
					</CardHeader>
					<CardContent className="pb-4">
						<div className="text-3xl font-bold text-gray-900 leading-none">
							{formatNumber(stats.totalOrders)}
						</div>
					</CardContent>
				</Card>

				{/* Total Refund */}
				<Card className="hover:shadow-lg transition-all duration-300 border-l-2 border-l-orange-500">
					<CardHeader className="flex flex-row items-center justify-between space-y-0 pb-3">
						<CardTitle className="text-sm font-medium text-gray-600">
							Tổng hoàn tiền
						</CardTitle>
						<RefreshCw className="h-5 w-5 text-orange-600" />
					</CardHeader>
					<CardContent className="pb-4">
						<div className="text-3xl font-bold text-gray-900 leading-none">
							{formatNumber(stats.totalRefund)}
						</div>
						<div className="mt-1 text-xs text-gray-500">
							{formatNumber(stats.completedRefund)} đã xử lý
						</div>
					</CardContent>
				</Card>

				{/* Total Withdraw */}
				<Card className="hover:shadow-lg transition-all duration-300 border-l-2 border-l-red-500">
					<CardHeader className="flex flex-row items-center justify-between space-y-0 pb-3">
						<CardTitle className="text-sm font-medium text-gray-600">
							Tổng rút tiền
						</CardTitle>
						<CreditCard className="h-5 w-5 text-red-600" />
					</CardHeader>
					<CardContent className="pb-4">
						<div className="text-3xl font-bold text-gray-900 leading-none">
							{formatNumber(stats.totalWithdraw)}
						</div>
						<div className="mt-1 text-xs text-gray-500">
							{formatNumber(stats.completedWithdraw)} đã xử lý
						</div>
					</CardContent>
				</Card>
			</div>

			{/* Charts Section */}
			<div className="space-y-8">
				{/* Purchase Request Charts - Row 1 */}
				<div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
					{/* Purchase Request Status Chart */}
					{dashboardStats.purchaseRequest && (
						<Card className="hover:shadow-lg transition-all duration-300">
							<CardHeader className="flex flex-row items-center justify-between">
								<div>
									<CardTitle className="flex items-center gap-2 text-lg">
										<ShoppingCart className="h-5 w-5 text-blue-600" />
										Yêu cầu mua hàng
									</CardTitle>
									<CardDescription>
										Tổng:{" "}
										{dashboardStats.purchaseRequest.total}{" "}
										yêu cầu
									</CardDescription>
								</div>
							</CardHeader>
							<CardContent>
								<ResponsiveContainer width="100%" height={300}>
									<BarChart
										data={dashboardStats.purchaseRequest.statusList.map(
											(item) => ({
												name: getStatusLabel(
													item.status
												),
												value: item.count,
												fill: getStatusColor(
													item.status
												),
											})
										)}
										margin={{
											top: 20,
											right: 10,
											left: -40,
											bottom: 5,
										}}
									>
										<CartesianGrid
											strokeDasharray="3 3"
											stroke="#f0f0f0"
										/>
										<XAxis
											dataKey="name"
											fontSize={11}
											tick={{ fill: "#6b7280" }}
										/>
										<YAxis
											fontSize={11}
											tick={{ fill: "#6b7280" }}
										/>
										<Tooltip
											formatter={(value) => [
												value,
												"Số lượng",
											]}
											contentStyle={{
												backgroundColor: "#fff",
												border: "1px solid #e5e7eb",
												borderRadius: "8px",
												boxShadow:
													"0 4px 6px -1px rgba(0, 0, 0, 0.1)",
											}}
										/>
										<Bar
											dataKey="value"
											radius={[4, 4, 0, 0]}
										/>
									</BarChart>
								</ResponsiveContainer>
							</CardContent>
						</Card>
					)}

					{/* Purchase Request Type Pie Chart */}
					{dashboardStats.purchaseRequestType && (
						<Card className="hover:shadow-lg transition-all duration-300 overflow-hidden">
							<CardHeader className="pb-2">
								<CardTitle className="flex items-center gap-2 text-lg">
									<Target className="h-5 w-5 text-blue-600" />
									Loại yêu cầu mua hàng
								</CardTitle>
								<p className="text-sm text-gray-500">
									Tổng:{" "}
									{dashboardStats.purchaseRequestType.total}{" "}
									yêu cầu
								</p>
							</CardHeader>
							<CardContent className="p-6 pt-2">
								<div className="grid grid-cols-1 lg:grid-cols-2 gap-6 items-center">
									{/* Left Side - Statistics with Single Progress Bar */}
									<div className="space-y-4">
										{/* Statistics Display */}
										<div className="space-y-3">
											{purchaseTypeData.map(
												(item, index) => {
													const percentage = (
														(item.value /
															dashboardStats
																.purchaseRequestType
																.total) *
														100
													).toFixed(1);
													return (
														<div
															key={index}
															className="flex items-center justify-between"
														>
															<div className="flex items-center gap-3">
																<div
																	className="w-4 h-4 rounded-full"
																	style={{
																		backgroundColor:
																			item.color,
																	}}
																></div>
																<span className="text-sm font-semibold text-gray-800">
																	{item.name}
																</span>
															</div>
															<div className="text-right">
																<div className="text-lg font-bold text-gray-900">
																	{item.value}
																</div>
																<div className="text-xs text-gray-500">
																	{percentage}
																	%
																</div>
															</div>
														</div>
													);
												}
											)}
										</div>

										{/* Single Combined Progress Bar */}
										<div className="space-y-2">
											<div className="flex justify-between text-xs text-gray-600">
												<span>Online</span>
												<span>Offline</span>
											</div>
											<div className="w-full bg-gray-200 rounded-full h-3 overflow-hidden">
												{purchaseTypeData.length >=
													2 && (
													<div className="h-full flex">
														{/* Online part - always green */}
														<div
															className="h-full transition-all duration-500 ease-out"
															style={{
																backgroundColor:
																	"#10b981", // Online = green
																width: `${(
																	((purchaseTypeData.find(
																		(
																			item
																		) =>
																			item.name ===
																			"Online"
																	)?.value ||
																		0) /
																		dashboardStats
																			.purchaseRequestType
																			.total) *
																	100
																).toFixed(1)}%`,
															}}
														></div>
														{/* Offline part - always orange */}
														<div
															className="h-full transition-all duration-500 ease-out"
															style={{
																backgroundColor:
																	"#f59e0b", // Offline = orange
																width: `${(
																	((purchaseTypeData.find(
																		(
																			item
																		) =>
																			item.name ===
																			"Offline"
																	)?.value ||
																		0) /
																		dashboardStats
																			.purchaseRequestType
																			.total) *
																	100
																).toFixed(1)}%`,
															}}
														></div>
													</div>
												)}
											</div>
										</div>

										{/* Summary Stats */}
										<div className="mt-6 p-4 bg-gradient-to-r from-blue-50 to-green-50 rounded-lg border border-gray-200">
											<div className="grid grid-cols-2 gap-4 text-center">
												<div>
													<div className="text-2xl font-bold text-blue-600">
														{purchaseTypeData.find(
															(item) =>
																item.name ===
																"Online"
														)?.value || 0}
													</div>
													<div className="text-xs text-gray-600">
														Online
													</div>
												</div>
												<div>
													<div className="text-2xl font-bold text-amber-600">
														{purchaseTypeData.find(
															(item) =>
																item.name ===
																"Offline"
														)?.value || 0}
													</div>
													<div className="text-xs text-gray-600">
														Offline
													</div>
												</div>
											</div>
										</div>
									</div>

									{/* Right Side - Pie Chart */}
									<div className="flex justify-center">
										<ResponsiveContainer
											width={240}
											height={240}
										>
											<PieChart>
												<Pie
													data={purchaseTypeData}
													cx="50%"
													cy="50%"
													labelLine={false}
													outerRadius={100}
													innerRadius={50}
													fill="#8884d8"
													dataKey="value"
													stroke="#fff"
													strokeWidth={3}
												>
													{purchaseTypeData.map(
														(entry, index) => (
															<Cell
																key={`cell-${index}`}
																fill={
																	entry.color
																}
															/>
														)
													)}
												</Pie>
												<Tooltip
													formatter={(
														value,
														name
													) => [
														`${value} yêu cầu`,
														name,
													]}
													contentStyle={{
														backgroundColor: "#fff",
														border: "1px solid #e5e7eb",
														borderRadius: "8px",
														boxShadow:
															"0 4px 12px rgba(0, 0, 0, 0.1)",
														fontSize: "13px",
													}}
												/>
											</PieChart>
										</ResponsiveContainer>
									</div>
								</div>
							</CardContent>
						</Card>
					)}
				</div>

				{/* Monthly Request Trend Chart - Row 2 */}
				<Card className="hover:shadow-lg transition-all duration-300">
					<CardHeader className="flex flex-row items-center justify-between">
						<div>
							<CardTitle className="flex items-center gap-2 text-lg">
								<FileText className="h-5 w-5 text-purple-600" />
								Xu hướng yêu cầu theo tháng
							</CardTitle>
							<CardDescription>
								Biểu đồ số lượng yêu cầu Online/Offline theo
								tháng
							</CardDescription>
						</div>
						{/* Year Filter */}
						<div className="flex items-center gap-2">
							<label className="text-sm font-medium text-gray-700">
								Năm:
							</label>
							<select
								value={selectedYear}
								onChange={(e) =>
									setSelectedYear(parseInt(e.target.value))
								}
								className="px-3 py-1 border border-gray-300 rounded-md text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
							>
								<option value={2025}>2025</option>
								<option value={2024}>2024</option>
								<option value={2023}>2023</option>
							</select>
						</div>
					</CardHeader>
					<CardContent>
						<ResponsiveContainer width="100%" height={400}>
							<BarChart
								data={monthlyTrendData.map((item) => ({
									...item,
									total: item.online + item.offline,
								}))}
								margin={{
									top: 20,
									right: 30,
									left: 20,
									bottom: 20,
								}}
								barCategoryGap="20%"
							>
								{/* Simple Clean Grid */}
								<CartesianGrid
									strokeDasharray="2 2"
									stroke="#e2e8f0"
									opacity={0.5}
									horizontal={true}
									vertical={false}
								/>

								{/* Clean Axes */}
								<XAxis
									dataKey="month"
									tick={{
										fontSize: 12,
										fill: "#64748b",
									}}
									axisLine={{
										stroke: "#cbd5e1",
										strokeWidth: 1,
									}}
									tickLine={{ stroke: "#cbd5e1" }}
								/>
								<YAxis
									tick={{
										fontSize: 12,
										fill: "#64748b",
									}}
									axisLine={{
										stroke: "#cbd5e1",
										strokeWidth: 1,
									}}
									tickLine={{ stroke: "#cbd5e1" }}
								/>

								{/* Clean Tooltip */}
								<Tooltip
									formatter={(value, name) => {
										const displayName =
											name === "online"
												? "Online"
												: name === "offline"
												? "Offline"
												: "Tổng";
										return [
											new Intl.NumberFormat(
												"vi-VN"
											).format(value),
											displayName,
										];
									}}
									labelFormatter={(label) => `Tháng ${label}`}
									contentStyle={{
										backgroundColor: "#ffffff",
										border: "1px solid #e2e8f0",
										borderRadius: "8px",
										boxShadow:
											"0 4px 6px -1px rgba(0, 0, 0, 0.1)",
										fontSize: "14px",
									}}
									cursor={{
										fill: "rgba(148, 163, 184, 0.08)",
									}}
								/>

								{/* Simple Stacked Bars */}
								<Bar
									dataKey="online"
									stackId="requests"
									fill="#10b981"
									radius={[0, 0, 3, 3]}
								/>
								<Bar
									dataKey="offline"
									stackId="requests"
									fill="#f59e0b"
									radius={[3, 3, 0, 0]}
								/>
							</BarChart>
						</ResponsiveContainer>

						{/* Simple Legend */}
						<div className="flex justify-center items-center gap-6 mt-4">
							<div className="flex items-center gap-2">
								<div className="w-3 h-3 rounded bg-emerald-500"></div>
								<span className="text-sm text-gray-600">
									Online
								</span>
							</div>
							<div className="flex items-center gap-2">
								<div className="w-3 h-3 rounded bg-amber-500"></div>
								<span className="text-sm text-gray-600">
									Offline
								</span>
							</div>
						</div>
					</CardContent>
				</Card>

				{/* Refund and Withdraw Charts - Row 3 */}
				<div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
					{/* Refund Ticket Dashboard */}
					{dashboardStats.refundTicket && (
						<Card className="hover:shadow-lg transition-all duration-300">
							<CardHeader>
								<CardTitle className="flex items-center gap-2 text-lg">
									<RefreshCw className="h-5 w-5 text-green-600" />
									Yêu cầu hoàn tiền
								</CardTitle>
								<CardDescription>
									Tổng: {dashboardStats.refundTicket.total} vé
								</CardDescription>
							</CardHeader>
							<CardContent>
								<ResponsiveContainer width="100%" height={300}>
									<BarChart
										data={dashboardStats.refundTicket.statusList.map(
											(item) => ({
												name: getStatusLabel(
													item.status
												),
												value: item.count,
												fill: getStatusColor(
													item.status
												),
											})
										)}
										margin={{
											top: 20,
											right: 10,
											left: -40,
											bottom: 5,
										}}
									>
										<CartesianGrid
											strokeDasharray="3 3"
											stroke="#f0f0f0"
										/>
										<XAxis
											dataKey="name"
											fontSize={11}
											tick={{ fill: "#6b7280" }}
										/>
										<YAxis
											fontSize={11}
											tick={{ fill: "#6b7280" }}
										/>
										<Tooltip
											formatter={(value) => [
												value,
												"Số lượng",
											]}
											contentStyle={{
												backgroundColor: "#fff",
												border: "1px solid #e5e7eb",
												borderRadius: "8px",
												boxShadow:
													"0 4px 6px -1px rgba(0, 0, 0, 0.1)",
											}}
										/>
										<Bar
											dataKey="value"
											radius={[4, 4, 0, 0]}
										/>
									</BarChart>
								</ResponsiveContainer>
							</CardContent>
						</Card>
					)}

					{/* Withdraw Ticket Dashboard */}
					{dashboardStats.withdrawTicket && (
						<Card className="hover:shadow-lg transition-all duration-300">
							<CardHeader>
								<CardTitle className="flex items-center gap-2 text-lg">
									<CreditCard className="h-5 w-5 text-purple-600" />
									Yêu cầu rút tiền
								</CardTitle>
								<CardDescription>
									Tổng: {dashboardStats.withdrawTicket.total}{" "}
									vé
								</CardDescription>
							</CardHeader>
							<CardContent>
								<ResponsiveContainer width="100%" height={300}>
									<BarChart
										data={dashboardStats.withdrawTicket.statusList.map(
											(item) => ({
												name: getStatusLabel(
													item.status
												),
												value: item.count,
												fill: getStatusColor(
													item.status
												),
											})
										)}
										margin={{
											top: 20,
											right: 10,
											left: -30,
											bottom: 5,
										}}
									>
										<CartesianGrid
											strokeDasharray="3 3"
											stroke="#f0f0f0"
										/>
										<XAxis
											dataKey="name"
											fontSize={11}
											tick={{ fill: "#6b7280" }}
										/>
										<YAxis
											fontSize={11}
											tick={{ fill: "#6b7280" }}
										/>
										<Tooltip
											formatter={(value) => [
												value,
												"Số lượng",
											]}
											contentStyle={{
												backgroundColor: "#fff",
												border: "1px solid #e5e7eb",
												borderRadius: "8px",
												boxShadow:
													"0 4px 6px -1px rgba(0, 0, 0, 0.1)",
											}}
										/>
										<Bar
											dataKey="value"
											radius={[4, 4, 0, 0]}
										/>
									</BarChart>
								</ResponsiveContainer>
							</CardContent>
						</Card>
					)}
				</div>
			</div>
		</div>
	);
};

export default BMDashboard;
