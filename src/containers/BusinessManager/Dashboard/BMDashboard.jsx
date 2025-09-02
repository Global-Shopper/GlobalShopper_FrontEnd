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
	Legend,
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

	// Unified color scheme for consistent status colors across all charts
	const STATUS_COLORS = {
		// Pending/Waiting states - Yellow/Orange
		PENDING: "#fbbf24", // amber-400
		SENT: "#f59e0b", // amber-500
		CHECKING: "#d97706", // amber-600

		// Approved states - Blue
		APPROVED: "#3b82f6", // blue-500
		QUOTED: "#1d4ed8", // blue-700

		// Completed/Success states - Green
		COMPLETED: "#10b981", // emerald-500
		PAID: "#059669", // emerald-600

		// Failed/Rejected states - Red
		FAILED: "#ef4444", // red-500
		CANCELLED: "#dc2626", // red-600
		REJECTED: "#b91c1c", // red-700

		// Update states - Purple
		INSUFFICIENT: "#8b5cf6", // violet-500

		// Default
		DEFAULT: "#6b7280", // gray-500
	};

	// Helper functions for status display
	const getStatusLabel = (status) => {
		const statusLabels = {
			// Purchase Request Status
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
			// Order Status
			PROCESSING: "Đang xử lý",
			SHIPPED: "Đã gửi",
			DELIVERED: "Đã giao",
			RETURNED: "Đã trả lại",
			CANCELED: "Đã hủy",
			IN_TRANSIT: "Đang thông quan",
			ORDER_REQUESTED: "Yêu cầu đặt hàng",
			PURCHASED: "Đã mua",
			AWAITING_PAYMENT: "Đợi thanh toán",
		};
		return statusLabels[status] || status;
	};

	const getStatusColor = (status) => {
		return STATUS_COLORS[status] || STATUS_COLORS.DEFAULT;
	};

	// Function to get representative color for status categories (for monthly charts)
	const getCategoryColor = (category) => {
		switch (category) {
			case "pending":
				return STATUS_COLORS.PENDING; // "#fbbf24"
			case "approved":
				return STATUS_COLORS.APPROVED; // "#3b82f6"
			case "completed":
				// Use same green color for both refund and withdraw completed
				return STATUS_COLORS.COMPLETED; // "#10b981" for both
			case "rejected":
				return STATUS_COLORS.REJECTED; // "#ef4444"
			case "insufficient":
				return STATUS_COLORS.INSUFFICIENT; // "#8b5cf6"
			default:
				return STATUS_COLORS.DEFAULT;
		}
	};

	// Function to get consistent color for individual status (to match grouped categories)
	const getConsistentStatusColor = (status) => {
		// Map individual status to category color for consistency
		switch (status) {
			case "PENDING":
			case "SENT":
			case "CHECKING":
			case "PROCESSING": // Order status
			case "ORDER_REQUESTED": // Order status
			case "AWAITING_PAYMENT": // Order status
				return getCategoryColor("pending");
			case "APPROVED":
			case "QUOTED":
			case "SHIPPED": // Order status
			case "IN_TRANSIT": // Order status
			case "PURCHASED": // Order status
				return getCategoryColor("approved");
			case "COMPLETED":
			case "PAID":
			case "DELIVERED": // Order status
				return getCategoryColor("completed");
			case "REJECTED":
			case "CANCELLED":
			case "CANCELED": // Order status (different spelling)
			case "FAILED":
			case "RETURNED": // Order status
				return getCategoryColor("rejected");
			case "INSUFFICIENT":
				return getCategoryColor("insufficient");
			default:
				return STATUS_COLORS.DEFAULT;
		}
	};

	// Unified colors for status categories (used in stacked charts)
	const CATEGORY_COLORS = {
		pending: "#fbbf24", // amber-400 - for pending/waiting states
		approved: "#3b82f6", // blue-500 - for approved states
		completed: "#10b981", // emerald-500 - for completed states
		rejected: "#ef4444", // red-500 - for failed/rejected states
		insufficient: "#8b5cf6", // violet-500 - for insufficient/update states
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

	// Helper function to extract monthly refund status data
	const extractMonthlyRefundStatus = (monthData) => {
		if (!monthData?.dashBoardList)
			return {
				pending: 0,
				approved: 0,
				completed: 0,
				rejected: 0,
				insufficient: 0,
			};

		const refundData = monthData.dashBoardList.find(
			(item) => item.dashBoardName === "RefundTicket"
		);
		if (!refundData?.statusList)
			return {
				pending: 0,
				approved: 0,
				completed: 0,
				rejected: 0,
				insufficient: 0,
			};

		const statusBreakdown = {
			pending: 0,
			approved: 0,
			completed: 0,
			rejected: 0,
			insufficient: 0,
		};

		refundData.statusList.forEach((status) => {
			switch (status.status) {
				case "PENDING":
				case "SENT":
				case "CHECKING":
					statusBreakdown.pending += status.count;
					break;
				case "APPROVED":
				case "QUOTED":
					statusBreakdown.approved += status.count;
					break;
				case "COMPLETED":
				case "PAID":
					statusBreakdown.completed += status.count;
					break;
				case "REJECTED":
				case "CANCELLED":
				case "FAILED":
					statusBreakdown.rejected += status.count;
					break;
				case "INSUFFICIENT":
					statusBreakdown.insufficient += status.count;
					break;
			}
		});

		return statusBreakdown;
	};

	// Helper function to extract monthly withdraw status data
	const extractMonthlyWithdrawStatus = (monthData) => {
		if (!monthData?.dashBoardList)
			return { pending: 0, approved: 0, completed: 0 };

		const withdrawData = monthData.dashBoardList.find(
			(item) => item.dashBoardName === "WithdrawTicket"
		);
		if (!withdrawData?.statusList)
			return { pending: 0, approved: 0, completed: 0 };

		const statusBreakdown = {
			pending: 0,
			approved: 0,
			completed: 0,
		};

		withdrawData.statusList.forEach((status) => {
			switch (status.status) {
				case "PENDING":
				case "SENT":
				case "CHECKING":
					statusBreakdown.pending += status.count;
					break;
				case "APPROVED":
				case "QUOTED":
					statusBreakdown.approved += status.count;
					break;
				case "COMPLETED":
				case "PAID":
					statusBreakdown.completed += status.count;
					break;
				// Withdraw không có rejected status
			}
		});

		return statusBreakdown;
	};

	// Helper function to extract monthly refund data
	const extractMonthlyRefund = (monthData) => {
		if (!monthData?.dashBoardList) return 0;
		const refundTicket = monthData.dashBoardList.find(
			(item) => item.dashBoardName === "RefundTicket"
		);
		return refundTicket?.total || 0;
	};

	// Helper function to extract monthly withdraw data
	const extractMonthlyWithdraw = (monthData) => {
		if (!monthData?.dashBoardList) return 0;
		const withdrawTicket = monthData.dashBoardList.find(
			(item) => item.dashBoardName === "WithdrawTicket"
		);
		return withdrawTicket?.total || 0;
	};

	// Helper function to extract monthly order data
	const extractMonthlyOrder = (monthData) => {
		if (!monthData?.dashBoardList) return 0;
		const orderData = monthData.dashBoardList.find(
			(item) => item.dashBoardName === "Order"
		);
		return orderData?.total || 0;
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

	// Data cho biểu đồ xu hướng hoàn tiền theo tháng
	const monthlyRefundData = useMemo(() => {
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

		return monthsData.map(({ month, data }) => ({
			month,
			count: extractMonthlyRefund(data),
		}));
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

	// Data cho biểu đồ xu hướng rút tiền theo tháng
	const monthlyWithdrawData = useMemo(() => {
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

		return monthsData.map(({ month, data }) => ({
			month,
			count: extractMonthlyWithdraw(data),
		}));
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

	// Data cho biểu đồ trạng thái hoàn tiền theo tháng
	const monthlyRefundStatusData = useMemo(() => {
		const monthsData = [
			{ month: 1, data: janData },
			{ month: 2, data: febData },
			{ month: 3, data: marData },
			{ month: 4, data: aprData },
			{ month: 5, data: mayData },
			{ month: 6, data: junData },
			{ month: 7, data: julData },
			{ month: 8, data: augData },
			{ month: 9, data: sepData },
			{ month: 10, data: octData },
			{ month: 11, data: novData },
			{ month: 12, data: decData },
		];

		return monthsData.map(({ month, data }) => ({
			month,
			...extractMonthlyRefundStatus(data),
		}));
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

	// Data cho biểu đồ trạng thái rút tiền theo tháng
	const monthlyWithdrawStatusData = useMemo(() => {
		const monthsData = [
			{ month: 1, data: janData },
			{ month: 2, data: febData },
			{ month: 3, data: marData },
			{ month: 4, data: aprData },
			{ month: 5, data: mayData },
			{ month: 6, data: junData },
			{ month: 7, data: julData },
			{ month: 8, data: augData },
			{ month: 9, data: sepData },
			{ month: 10, data: octData },
			{ month: 11, data: novData },
			{ month: 12, data: decData },
		];

		return monthsData.map(({ month, data }) => ({
			month,
			...extractMonthlyWithdrawStatus(data),
		}));
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

	// Data cho biểu đồ tổng đơn hàng theo tháng
	const monthlyOrderData = useMemo(() => {
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

		return monthsData.map(({ month, data }) => ({
			month,
			count: extractMonthlyOrder(data),
		}));
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

	// Data cho biểu đồ so sánh CANCELLED vs DELIVERED theo tháng
	const monthlyOrderComparisonData = useMemo(() => {
		console.log("=== DEBUGGING ORDER COMPARISON DATA ===");
		console.log("Full dashboardData:", dashboardData);

		// Lấy Order data từ main dashboard data
		const extractOrderStatus = () => {
			console.log("🔍 Checking dashboardData structure...");

			// Trường hợp 1: dashboardData.data.dashBoardList
			if (dashboardData?.data?.dashBoardList) {
				console.log("✅ Found dashboardData.data.dashBoardList");
				console.log(
					"Available dashboard names:",
					dashboardData.data.dashBoardList.map(
						(item) => item.dashBoardName
					)
				);

				const orderItem = dashboardData.data.dashBoardList.find(
					(item) => item.dashBoardName === "Order"
				);

				if (orderItem?.statusList) {
					console.log(
						"✅ Found Order item with statusList:",
						orderItem.statusList
					);

					let cancelled = 0;
					let delivered = 0;

					orderItem.statusList.forEach((statusItem) => {
						const { status, count } = statusItem;
						console.log(
							`📊 Processing status: ${status}, count: ${count}`
						);

						if (status === "CANCELLED") {
							cancelled = count;
							console.log(`🔴 Set cancelled to: ${cancelled}`);
						}
						if (status === "DELIVERED") {
							delivered = count;
							console.log(`🟢 Set delivered to: ${delivered}`);
						}
					});

					return { cancelled, delivered };
				}
			}

			// Trường hợp 2: dashboardData.dashBoardList (không có .data)
			if (dashboardData?.dashBoardList) {
				console.log("✅ Found dashboardData.dashBoardList (no .data)");
				console.log(
					"Available dashboard names:",
					dashboardData.dashBoardList.map(
						(item) => item.dashBoardName
					)
				);

				const orderItem = dashboardData.dashBoardList.find(
					(item) => item.dashBoardName === "Order"
				);

				if (orderItem?.statusList) {
					console.log(
						"✅ Found Order item with statusList:",
						orderItem.statusList
					);

					let cancelled = 0;
					let delivered = 0;

					orderItem.statusList.forEach((statusItem) => {
						const { status, count } = statusItem;
						console.log(
							`📊 Processing status: ${status}, count: ${count}`
						);

						if (status === "CANCELLED") {
							cancelled = count;
							console.log(`🔴 Set cancelled to: ${cancelled}`);
						}
						if (status === "DELIVERED") {
							delivered = count;
							console.log(`🟢 Set delivered to: ${delivered}`);
						}
					});

					return { cancelled, delivered };
				}
			}

			console.log("❌ No Order data found in any structure");
			console.log(
				"Full dashboardData structure:",
				JSON.stringify(dashboardData, null, 2)
			);
			return { cancelled: 0, delivered: 0 };
		};

		const orderStatus = extractOrderStatus();
		console.log("🎯 Extracted order status:", orderStatus);

		// Tạo data cho 12 tháng (hiện tại chỉ có data tháng hiện tại)
		const currentMonth = new Date().getMonth() + 1;
		console.log(`📅 Current month: ${currentMonth}`);
		const result = [];

		for (let i = 1; i <= 12; i++) {
			const monthData = {
				month: `T${i}`,
				cancelled: i === currentMonth ? orderStatus.cancelled : 0,
				delivered: i === currentMonth ? orderStatus.delivered : 0,
			};
			result.push(monthData);

			if (i === currentMonth) {
				console.log(`📊 Current month (T${i}) data:`, monthData);
			}
		}

		console.log("🎯 Generated monthly comparison data:", result);
		console.log("=== END DEBUGGING ===");
		return result;
	}, [dashboardData]);

	// Colors for pie chart
	const PIE_COLORS = ["#10b981", "#f59e0b"]; // Data cho biểu đồ tròn theo danh mục

	const formatNumber = (num) => {
		return new Intl.NumberFormat("vi-VN").format(num);
	};

	// Debug: Log tất cả API data để kiểm tra
	console.log("All API data loaded:", {
		jan: janData?.data ? "loaded" : "no data",
		feb: febData?.data ? "loaded" : "no data",
		mar: marData?.data ? "loaded" : "no data",
		comparison: monthlyOrderComparisonData,
	});

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
							Tổng đơn hàng
						</CardTitle>
						<ShoppingCart className="h-5 w-5 text-green-600" />
					</CardHeader>
					<CardContent className="pb-4">
						<div className="text-3xl font-bold text-gray-900 leading-none">
							{formatNumber(dashboardStats.order?.total || 0)}
						</div>
						<div className="mt-1 text-xs text-gray-500">
							{formatNumber(
								dashboardStats.order?.statusList?.find(
									(s) => s.status === "DELIVERED"
								)?.count || 0
							)}{" "}
							giao thành công
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

				{/* Order Charts - Row 3 */}
				{dashboardStats.order && (
					<div className="space-y-6">
						{/* Order Charts Row 1 - Status Distribution and Monthly Total */}
						<div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
							{/* Order Status Distribution */}
							<Card className="hover:shadow-lg transition-all duration-300">
								<CardHeader>
									<CardTitle className="flex items-center gap-2 text-lg">
										<ShoppingCart className="h-5 w-5 text-blue-600" />
										Phân bố trạng thái đơn hàng
									</CardTitle>
									<CardDescription>
										Tổng: {dashboardStats.order.total} đơn
										hàng
									</CardDescription>
								</CardHeader>
								<CardContent>
									<ResponsiveContainer
										width="100%"
										height={300}
									>
										<BarChart
											data={dashboardStats.order.statusList.map(
												(item) => ({
													name: getStatusLabel(
														item.status
													),
													value: item.count,
													fill: getConsistentStatusColor(
														item.status
													),
												})
											)}
											margin={{
												top: 20,
												right: 30,
												left: 20,
												bottom: 5,
											}}
										>
											<CartesianGrid strokeDasharray="3 3" />
											<XAxis
												dataKey="name"
												tick={{
													fontSize: 12,
													fill: "#64748b",
												}}
												angle={-45}
												textAnchor="end"
												height={80}
											/>
											<YAxis
												tick={{
													fontSize: 12,
													fill: "#64748b",
												}}
											/>
											<Tooltip
												formatter={(value) => [
													value,
													"Số đơn hàng",
												]}
												labelFormatter={(label) =>
													`Trạng thái: ${label}`
												}
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
											>
												{dashboardStats.order.statusList.map(
													(item, index) => (
														<Cell
															key={`cell-${index}`}
															fill={getConsistentStatusColor(
																item.status
															)}
														/>
													)
												)}
											</Bar>
										</BarChart>
									</ResponsiveContainer>
								</CardContent>
							</Card>

							{/* Monthly Order Total */}
							<Card className="hover:shadow-lg transition-all duration-300">
								<CardHeader>
									<CardTitle className="flex items-center gap-2 text-lg">
										<ShoppingCart className="h-5 w-5 text-green-600" />
										Số lượng đơn hàng theo tháng
									</CardTitle>
									<CardDescription className="flex items-center gap-4">
										<span>Tổng quan theo từng tháng</span>
										<select
											value={selectedYear}
											onChange={(e) =>
												setSelectedYear(
													Number(e.target.value)
												)
											}
											className="ml-auto px-3 py-1 border rounded-md text-sm"
										>
											{Array.from(
												{ length: 5 },
												(_, i) => {
													const year =
														new Date().getFullYear() -
														i;
													return (
														<option
															key={year}
															value={year}
														>
															{year}
														</option>
													);
												}
											)}
										</select>
									</CardDescription>
								</CardHeader>
								<CardContent>
									<ResponsiveContainer
										width="100%"
										height={300}
									>
										<AreaChart
											data={monthlyOrderData}
											margin={{
												top: 20,
												right: 30,
												left: 20,
												bottom: 5,
											}}
										>
											<defs>
												<linearGradient
													id="orderGradient"
													x1="0"
													y1="0"
													x2="0"
													y2="1"
												>
													<stop
														offset="5%"
														stopColor="#3b82f6"
														stopOpacity={0.8}
													/>
													<stop
														offset="95%"
														stopColor="#3b82f6"
														stopOpacity={0.1}
													/>
												</linearGradient>
											</defs>
											<CartesianGrid
												strokeDasharray="2 2"
												stroke="#e2e8f0"
												opacity={0.5}
											/>
											<XAxis
												dataKey="month"
												tick={{
													fontSize: 12,
													fill: "#64748b",
												}}
											/>
											<YAxis
												tick={{
													fontSize: 12,
													fill: "#64748b",
												}}
											/>
											<Tooltip
												formatter={(value) => [
													value,
													"Số đơn hàng",
												]}
												labelFormatter={(label) =>
													`Tháng ${label}`
												}
												contentStyle={{
													backgroundColor: "#ffffff",
													border: "1px solid #e2e8f0",
													borderRadius: "8px",
													boxShadow:
														"0 4px 6px -1px rgba(0, 0, 0, 0.1)",
													fontSize: "14px",
												}}
											/>
											<Area
												type="monotone"
												dataKey="count"
												stroke="#3b82f6"
												strokeWidth={2}
												fill="url(#orderGradient)"
											/>
										</AreaChart>
									</ResponsiveContainer>
								</CardContent>
							</Card>
						</div>
					</div>
				)}

				{/* Refund and Withdraw Charts - Row 4 */}
				<div className="space-y-6">
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
								<div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
									{/* Left Side - Status Chart */}
									<div>
										<h4 className="text-sm font-medium text-gray-700 mb-3">
											Phân bố theo trạng thái
										</h4>
										<ResponsiveContainer
											width="100%"
											height={280}
										>
											<PieChart>
												<Pie
													data={dashboardStats.refundTicket.statusList.map(
														(item) => ({
															name: getStatusLabel(
																item.status
															),
															value: item.count,
															fill: getConsistentStatusColor(
																item.status
															),
														})
													)}
													cx="50%"
													cy="50%"
													outerRadius={80}
													dataKey="value"
													labelLine={false}
													label={({
														name,
														percent,
													}) =>
														`${name}: ${(
															percent * 100
														).toFixed(0)}%`
													}
												>
													{dashboardStats.refundTicket.statusList.map(
														(item, index) => (
															<Cell
																key={`cell-${index}`}
																fill={getConsistentStatusColor(
																	item.status
																)}
															/>
														)
													)}
												</Pie>
												<Tooltip
													formatter={(
														value,
														name
													) => [value, name]}
													contentStyle={{
														backgroundColor: "#fff",
														border: "1px solid #e5e7eb",
														borderRadius: "8px",
														boxShadow:
															"0 4px 6px -1px rgba(0, 0, 0, 0.1)",
													}}
												/>
											</PieChart>
										</ResponsiveContainer>
									</div>

									{/* Middle - Monthly Trend */}
									<div>
										<h4 className="text-sm font-medium text-gray-700 mb-3">
											Xu hướng theo tháng ({selectedYear})
										</h4>
										<ResponsiveContainer
											width="100%"
											height={280}
										>
											<AreaChart
												data={monthlyRefundData}
												margin={{
													top: 20,
													right: 30,
													left: 20,
													bottom: 5,
												}}
											>
												<defs>
													<linearGradient
														id="refundGradient"
														x1="0"
														y1="0"
														x2="0"
														y2="1"
													>
														<stop
															offset="5%"
															stopColor="#10b981"
															stopOpacity={0.8}
														/>
														<stop
															offset="95%"
															stopColor="#10b981"
															stopOpacity={0.1}
														/>
													</linearGradient>
												</defs>
												<CartesianGrid
													strokeDasharray="2 2"
													stroke="#e2e8f0"
													opacity={0.5}
												/>
												<XAxis
													dataKey="month"
													tick={{
														fontSize: 12,
														fill: "#64748b",
													}}
												/>
												<YAxis
													tick={{
														fontSize: 12,
														fill: "#64748b",
													}}
												/>
												<Tooltip
													formatter={(value) => [
														value,
														"Yêu cầu hoàn tiền",
													]}
													labelFormatter={(label) =>
														`Tháng ${label}`
													}
													contentStyle={{
														backgroundColor:
															"#ffffff",
														border: "1px solid #e2e8f0",
														borderRadius: "8px",
														boxShadow:
															"0 4px 6px -1px rgba(0, 0, 0, 0.1)",
														fontSize: "14px",
													}}
												/>
												<Area
													type="monotone"
													dataKey="count"
													stroke="#10b981"
													strokeWidth={3}
													fill="url(#refundGradient)"
													dot={{
														fill: "#10b981",
														strokeWidth: 2,
														r: 5,
													}}
													activeDot={{
														r: 7,
														stroke: "#10b981",
														strokeWidth: 2,
														fill: "#fff",
													}}
												/>
											</AreaChart>
										</ResponsiveContainer>
									</div>

									{/* Right Side - Monthly Status Breakdown */}
									<div>
										<h4 className="text-sm font-medium text-gray-700 mb-3">
											Trạng thái theo tháng (
											{selectedYear})
										</h4>
										<ResponsiveContainer
											width="100%"
											height={280}
										>
											<BarChart
												data={monthlyRefundStatusData}
												margin={{
													top: 20,
													right: 10,
													left: -20,
													bottom: 5,
												}}
											>
												<CartesianGrid
													strokeDasharray="2 2"
													stroke="#e2e8f0"
													opacity={0.5}
												/>
												<XAxis
													dataKey="month"
													fontSize={10}
													tick={{ fill: "#6b7280" }}
												/>
												<YAxis
													fontSize={10}
													tick={{ fill: "#6b7280" }}
												/>
												<Tooltip
													contentStyle={{
														backgroundColor: "#fff",
														border: "1px solid #e5e7eb",
														borderRadius: "8px",
														boxShadow:
															"0 4px 6px -1px rgba(0, 0, 0, 0.1)",
													}}
												/>
												<Bar
													dataKey="pending"
													stackId="refundStatus"
													fill={getCategoryColor(
														"pending"
													)}
													name="Chờ xử lý"
												/>
												<Bar
													dataKey="approved"
													stackId="refundStatus"
													fill={getCategoryColor(
														"approved"
													)}
													name="Đã duyệt"
												/>
												<Bar
													dataKey="completed"
													stackId="refundStatus"
													fill={getCategoryColor(
														"completed"
													)}
													name="Hoàn thành"
												/>
												<Bar
													dataKey="rejected"
													stackId="refundStatus"
													fill={getCategoryColor(
														"rejected"
													)}
													name="Từ chối"
												/>
												<Bar
													dataKey="insufficient"
													stackId="refundStatus"
													fill={getCategoryColor(
														"insufficient"
													)}
													name="Cập nhật"
													radius={[2, 2, 0, 0]}
												/>
											</BarChart>
										</ResponsiveContainer>

										{/* Legend for Refund Status */}
										<div className="flex justify-center items-center gap-3 mt-2 text-xs">
											<div className="flex items-center gap-1">
												<div
													className="w-3 h-3 rounded"
													style={{
														backgroundColor:
															getCategoryColor(
																"pending"
															),
													}}
												></div>
												<span>Chờ xử lý</span>
											</div>
											<div className="flex items-center gap-1">
												<div
													className="w-3 h-3 rounded"
													style={{
														backgroundColor:
															getCategoryColor(
																"approved"
															),
													}}
												></div>
												<span>Đã duyệt</span>
											</div>
											<div className="flex items-center gap-1">
												<div
													className="w-3 h-3 rounded"
													style={{
														backgroundColor:
															getCategoryColor(
																"completed"
															),
													}}
												></div>
												<span>Hoàn thành</span>
											</div>
											<div className="flex items-center gap-1">
												<div
													className="w-3 h-3 rounded"
													style={{
														backgroundColor:
															getCategoryColor(
																"rejected"
															),
													}}
												></div>
												<span>Từ chối</span>
											</div>
											<div className="flex items-center gap-1">
												<div
													className="w-3 h-3 rounded"
													style={{
														backgroundColor:
															getCategoryColor(
																"insufficient"
															),
													}}
												></div>
												<span>Cập nhật</span>
											</div>
										</div>
									</div>
								</div>
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
								<div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
									{/* Left Side - Status Chart */}
									<div>
										<h4 className="text-sm font-medium text-gray-700 mb-3">
											Phân bố theo trạng thái
										</h4>
										<ResponsiveContainer
											width="100%"
											height={280}
										>
											<PieChart>
												<Pie
													data={dashboardStats.withdrawTicket.statusList.map(
														(item) => ({
															name: getStatusLabel(
																item.status
															),
															value: item.count,
															fill: getConsistentStatusColor(
																item.status
															),
														})
													)}
													cx="50%"
													cy="50%"
													outerRadius={80}
													dataKey="value"
													labelLine={false}
													label={({
														name,
														percent,
													}) =>
														`${name}: ${(
															percent * 100
														).toFixed(0)}%`
													}
												>
													{dashboardStats.withdrawTicket.statusList.map(
														(item, index) => (
															<Cell
																key={`cell-${index}`}
																fill={getConsistentStatusColor(
																	item.status
																)}
															/>
														)
													)}
												</Pie>
												<Tooltip
													formatter={(
														value,
														name
													) => [value, name]}
													contentStyle={{
														backgroundColor: "#fff",
														border: "1px solid #e5e7eb",
														borderRadius: "8px",
														boxShadow:
															"0 4px 6px -1px rgba(0, 0, 0, 0.1)",
													}}
												/>
											</PieChart>
										</ResponsiveContainer>
									</div>

									{/* Middle - Monthly Trend */}
									<div>
										<h4 className="text-sm font-medium text-gray-700 mb-3">
											Xu hướng theo tháng ({selectedYear})
										</h4>
										<ResponsiveContainer
											width="100%"
											height={280}
										>
											<AreaChart
												data={monthlyWithdrawData}
												margin={{
													top: 20,
													right: 30,
													left: 20,
													bottom: 5,
												}}
											>
												<defs>
													<linearGradient
														id="withdrawGradient"
														x1="0"
														y1="0"
														x2="0"
														y2="1"
													>
														<stop
															offset="5%"
															stopColor="#7c3aed"
															stopOpacity={0.8}
														/>
														<stop
															offset="95%"
															stopColor="#7c3aed"
															stopOpacity={0.1}
														/>
													</linearGradient>
												</defs>
												<CartesianGrid
													strokeDasharray="2 2"
													stroke="#e2e8f0"
													opacity={0.5}
												/>
												<XAxis
													dataKey="month"
													tick={{
														fontSize: 12,
														fill: "#64748b",
													}}
												/>
												<YAxis
													tick={{
														fontSize: 12,
														fill: "#64748b",
													}}
												/>
												<Tooltip
													formatter={(value) => [
														value,
														"Yêu cầu rút tiền",
													]}
													labelFormatter={(label) =>
														`Tháng ${label}`
													}
													contentStyle={{
														backgroundColor:
															"#ffffff",
														border: "1px solid #e2e8f0",
														borderRadius: "8px",
														boxShadow:
															"0 4px 6px -1px rgba(0, 0, 0, 0.1)",
														fontSize: "14px",
													}}
												/>
												<Area
													type="monotone"
													dataKey="count"
													stroke="#7c3aed"
													strokeWidth={3}
													fill="url(#withdrawGradient)"
													dot={{
														fill: "#7c3aed",
														strokeWidth: 2,
														r: 5,
													}}
													activeDot={{
														r: 7,
														stroke: "#7c3aed",
														strokeWidth: 2,
														fill: "#fff",
													}}
												/>
											</AreaChart>
										</ResponsiveContainer>
									</div>

									{/* Right Side - Monthly Status Breakdown */}
									<div>
										<h4 className="text-sm font-medium text-gray-700 mb-3">
											Trạng thái theo tháng (
											{selectedYear})
										</h4>
										<ResponsiveContainer
											width="100%"
											height={280}
										>
											<BarChart
												data={monthlyWithdrawStatusData}
												margin={{
													top: 20,
													right: 10,
													left: -20,
													bottom: 5,
												}}
											>
												<CartesianGrid
													strokeDasharray="2 2"
													stroke="#e2e8f0"
													opacity={0.5}
												/>
												<XAxis
													dataKey="month"
													fontSize={10}
													tick={{ fill: "#6b7280" }}
												/>
												<YAxis
													fontSize={10}
													tick={{ fill: "#6b7280" }}
												/>
												<Tooltip
													contentStyle={{
														backgroundColor: "#fff",
														border: "1px solid #e5e7eb",
														borderRadius: "8px",
														boxShadow:
															"0 4px 6px -1px rgba(0, 0, 0, 0.1)",
													}}
												/>
												<Bar
													dataKey="pending"
													stackId="withdrawStatus"
													fill={getCategoryColor(
														"pending"
													)}
													name="Chờ xử lý"
												/>
												<Bar
													dataKey="approved"
													stackId="withdrawStatus"
													fill={getCategoryColor(
														"approved"
													)}
													name="Đã duyệt"
												/>
												<Bar
													dataKey="completed"
													stackId="withdrawStatus"
													fill={getCategoryColor(
														"completed"
													)}
													name="Hoàn thành"
													radius={[2, 2, 0, 0]}
												/>
											</BarChart>
										</ResponsiveContainer>

										{/* Legend for Withdraw Status */}
										<div className="flex justify-center items-center gap-4 mt-2 text-xs">
											<div className="flex items-center gap-1">
												<div
													className="w-3 h-3 rounded"
													style={{
														backgroundColor:
															getCategoryColor(
																"pending"
															),
													}}
												></div>
												<span>Chờ xử lý</span>
											</div>
											<div className="flex items-center gap-1">
												<div
													className="w-3 h-3 rounded"
													style={{
														backgroundColor:
															getCategoryColor(
																"approved"
															),
													}}
												></div>
												<span>Đã duyệt</span>
											</div>
											<div className="flex items-center gap-1">
												<div
													className="w-3 h-3 rounded"
													style={{
														backgroundColor:
															getCategoryColor(
																"completed"
															),
													}}
												></div>
												<span>Hoàn thành</span>
											</div>
										</div>
									</div>
								</div>
							</CardContent>
						</Card>
					)}
				</div>
			</div>
		</div>
	);
};

export default BMDashboard;
