import React, { useState, useMemo } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
	Select,
	SelectContent,
	SelectItem,
	SelectTrigger,
	SelectValue,
} from "@/components/ui/select";
import { Badge } from "@/components/ui/badge";
import { Calendar } from "@/components/ui/calendar";
import {
	Popover,
	PopoverContent,
	PopoverTrigger,
} from "@/components/ui/popover";
import {
	CalendarDays,
	Search,
	Filter,
	Download,
	RefreshCw,
	TrendingUp,
	TrendingDown,
	DollarSign,
	Clock,
	CheckCircle,
	XCircle,
	AlertCircle,
	Calendar as CalendarIcon,
	ArrowUpDown,
} from "lucide-react";
import { format, startOfMonth, endOfMonth } from "date-fns";
import { vi } from "date-fns/locale";
import { useGetTransactionsQuery } from "@/services/gshopApi";
import PageLoading from "@/components/PageLoading";
import PageError from "@/components/PageError";

const TransactionList = () => {
	// State cho filters
	const [filters, setFilters] = useState({
		from: startOfMonth(new Date()).getTime(),
		to: endOfMonth(new Date()).getTime(),
		type: "ALL",
		page: 0,
		size: 10,
		direction: "DESC",
	});

	// State cho search và UI
	const [searchTerm, setSearchTerm] = useState("");
	const [fromDate, setFromDate] = useState(new Date(filters.from));
	const [toDate, setToDate] = useState(new Date(filters.to));

	// API call với conversion cho "ALL" type
	const apiFilters = {
		...filters,
		type: filters.type === "ALL" ? "" : filters.type,
	};

	const {
		data: transactionData,
		isLoading,
		isError,
		error,
		refetch,
	} = useGetTransactionsQuery(apiFilters);

	// Debug log
	console.log("Filters:", filters);
	console.log("Transaction Data:", transactionData);

	// Transaction types cho filter
	const transactionTypes = [
		{ value: "ALL", label: "Tất cả loại giao dịch" },
		{ value: "DEPOSIT", label: "Nạp tiền" },
		{ value: "CHECKOUT", label: "Thanh toán" },
		{ value: "REFUND", label: "Hoàn tiền" },
		{ value: "WITHDRAW", label: "Rút tiền" },
	];

	// Page sizes
	const pageSizes = [10, 20, 50, 100];

	// Handle filter changes
	const handleFilterChange = (key, value) => {
		console.log(`Changing filter ${key} to:`, value);
		setFilters((prev) => ({
			...prev,
			[key]: value,
			page: key === "page" ? value : 0, // Only reset page if not changing page itself
		}));
	};

	// Handle pagination specifically
	const handlePageChange = (newPage) => {
		console.log("Changing page to:", newPage);
		setFilters((prev) => ({
			...prev,
			page: newPage,
		}));
	};

	// Get transaction status badge
	const getStatusBadge = (status) => {
		const statusConfig = {
			SUCCESS: {
				label: "Thành công",
				variant: "default",
				className: "bg-green-100 text-green-800 border-green-200",
				icon: CheckCircle,
			},
			PENDING: {
				label: "Đang xử lý",
				variant: "secondary",
				className: "bg-yellow-100 text-yellow-800 border-yellow-200",
				icon: Clock,
			},
			FAILED: {
				label: "Thất bại",
				variant: "destructive",
				className: "bg-red-100 text-red-800 border-red-200",
				icon: XCircle,
			},
			CANCELLED: {
				label: "Đã hủy",
				variant: "outline",
				className: "bg-gray-100 text-gray-800 border-gray-200",
				icon: XCircle,
			},
		};

		const config = statusConfig[status] || statusConfig.PENDING;
		const IconComponent = config.icon;

		return (
			<Badge className={`flex items-center gap-1 ${config.className}`}>
				<IconComponent className="h-3 w-3" />
				{config.label}
			</Badge>
		);
	};

	// Get transaction type badge
	const getTypeBadge = (type) => {
		const typeConfig = {
			DEPOSIT: {
				label: "Nạp tiền",
				className: "bg-blue-100 text-blue-800 border-blue-200",
				icon: TrendingUp,
			},
			WITHDRAW: {
				label: "Rút tiền",
				className: "bg-purple-100 text-purple-800 border-purple-200",
				icon: TrendingDown,
			},
			CHECKOUT: {
				label: "Thanh toán",
				className: "bg-orange-100 text-orange-800 border-orange-200",
				icon: DollarSign,
			},
			REFUND: {
				label: "Hoàn tiền",
				className: "bg-green-100 text-green-800 border-green-200",
				icon: TrendingUp,
			},
		};

		const config = typeConfig[type] || {
			label: type,
			className: "bg-gray-100 text-gray-800 border-gray-200",
			icon: AlertCircle,
		};
		const IconComponent = config.icon;

		return (
			<Badge
				variant="outline"
				className={`flex items-center gap-1 ${config.className}`}
			>
				<IconComponent className="h-3 w-3" />
				{config.label}
			</Badge>
		);
	};

	// Format currency
	const formatCurrency = (amount) => {
		return new Intl.NumberFormat("vi-VN", {
			style: "currency",
			currency: "VND",
		}).format(amount);
	};

	// Format date
	const formatDate = (dateString) => {
		return format(new Date(dateString), "dd/MM/yyyy HH:mm", { locale: vi });
	};

	// Filter transactions based on search
	const filteredTransactions = useMemo(() => {
		// Handle different API response structures
		const transactions =
			transactionData?.content ||
			transactionData?.data?.content ||
			transactionData?.data ||
			[];

		if (!searchTerm) {
			return transactions;
		}

		return transactions.filter(
			(transaction) =>
				transaction.description
					?.toLowerCase()
					.includes(searchTerm.toLowerCase()) ||
				transaction.id
					?.toLowerCase()
					.includes(searchTerm.toLowerCase()) ||
				transaction.type
					?.toLowerCase()
					.includes(searchTerm.toLowerCase())
		);
	}, [transactionData, searchTerm]);

	if (isLoading) return <PageLoading />;
	if (isError) return <PageError error={error} onRetry={refetch} />;

	// Test UI is working
	console.log("TransactionList component is rendering with new UI");

	return (
		<div className="container mx-auto p-6 space-y-6">
			{/* Header */}
			<div className="flex items-center justify-between">
				<div>
					<h1 className="text-3xl font-bold text-gray-900">
						Lịch sử giao dịch
					</h1>
					<p className="text-gray-600 mt-1">
						Quản lý và theo dõi tất cả giao dịch của hệ thống
					</p>
				</div>
				<div className="flex gap-2">
					<Button
						variant="outline"
						onClick={refetch}
						className="flex items-center gap-2"
					>
						<RefreshCw className="h-4 w-4" />
						Làm mới
					</Button>
					<Button className="flex items-center gap-2">
						<Download className="h-4 w-4" />
						Xuất Excel
					</Button>
				</div>
			</div>

			{/* Summary Cards */}
			<div className="grid grid-cols-1 md:grid-cols-4 gap-4">
				<Card>
					<CardContent className="p-4">
						<div className="flex items-center justify-between">
							<div>
								<p className="text-sm text-gray-600">
									Tổng giao dịch
								</p>
								<p className="text-2xl font-bold">
									{transactionData?.totalElements || 0}
								</p>
							</div>
							<div className="h-8 w-8 bg-blue-100 rounded-full flex items-center justify-center">
								<DollarSign className="h-4 w-4 text-blue-600" />
							</div>
						</div>
					</CardContent>
				</Card>
				<Card>
					<CardContent className="p-4">
						<div className="flex items-center justify-between">
							<div>
								<p className="text-sm text-gray-600">
									Thành công
								</p>
								<p className="text-2xl font-bold text-green-600">
									{
										filteredTransactions.filter(
											(t) => t.status === "SUCCESS"
										).length
									}
								</p>
							</div>
							<div className="h-8 w-8 bg-green-100 rounded-full flex items-center justify-center">
								<CheckCircle className="h-4 w-4 text-green-600" />
							</div>
						</div>
					</CardContent>
				</Card>
				<Card>
					<CardContent className="p-4">
						<div className="flex items-center justify-between">
							<div>
								<p className="text-sm text-gray-600">
									Đang xử lý
								</p>
								<p className="text-2xl font-bold text-yellow-600">
									{
										filteredTransactions.filter(
											(t) => t.status === "PENDING"
										).length
									}
								</p>
							</div>
							<div className="h-8 w-8 bg-yellow-100 rounded-full flex items-center justify-center">
								<Clock className="h-4 w-4 text-yellow-600" />
							</div>
						</div>
					</CardContent>
				</Card>
				<Card>
					<CardContent className="p-4">
						<div className="flex items-center justify-between">
							<div>
								<p className="text-sm text-gray-600">
									Thất bại
								</p>
								<p className="text-2xl font-bold text-red-600">
									{
										filteredTransactions.filter(
											(t) => t.status === "FAILED"
										).length
									}
								</p>
							</div>
							<div className="h-8 w-8 bg-red-100 rounded-full flex items-center justify-center">
								<XCircle className="h-4 w-4 text-red-600" />
							</div>
						</div>
					</CardContent>
				</Card>
			</div>

			{/* Filters */}
			<Card>
				<CardHeader>
					<CardTitle className="flex items-center gap-2">
						<Filter className="h-5 w-5" />
						Bộ lọc nâng cao
					</CardTitle>
				</CardHeader>
				<CardContent className="space-y-4">
					{/* Quick Date Range Selector */}
					<div className="space-y-2">
						<label className="text-sm font-medium">
							Khoảng thời gian nhanh
						</label>
						<div className="flex flex-wrap gap-2">
							<Button
								variant="outline"
								size="sm"
								onClick={() => {
									const today = new Date();
									const startOfToday = new Date(
										today.getFullYear(),
										today.getMonth(),
										today.getDate()
									);
									setFromDate(startOfToday);
									setToDate(today);
									handleFilterChange(
										"from",
										startOfToday.getTime()
									);
									handleFilterChange("to", today.getTime());
								}}
							>
								Hôm nay
							</Button>
							<Button
								variant="outline"
								size="sm"
								onClick={() => {
									const today = new Date();
									const yesterday = new Date(
										today.getTime() - 24 * 60 * 60 * 1000
									);
									const startOfYesterday = new Date(
										yesterday.getFullYear(),
										yesterday.getMonth(),
										yesterday.getDate()
									);
									const endOfYesterday = new Date(
										yesterday.getFullYear(),
										yesterday.getMonth(),
										yesterday.getDate(),
										23,
										59,
										59,
										999
									);
									setFromDate(startOfYesterday);
									setToDate(endOfYesterday);
									handleFilterChange(
										"from",
										startOfYesterday.getTime()
									);
									handleFilterChange(
										"to",
										endOfYesterday.getTime()
									);
								}}
							>
								Hôm qua
							</Button>
							<Button
								variant="outline"
								size="sm"
								onClick={() => {
									const today = new Date();
									const startOfWeek = new Date(
										today.getTime() -
											today.getDay() * 24 * 60 * 60 * 1000
									);
									startOfWeek.setHours(0, 0, 0, 0);
									setFromDate(startOfWeek);
									setToDate(today);
									handleFilterChange(
										"from",
										startOfWeek.getTime()
									);
									handleFilterChange("to", today.getTime());
								}}
							>
								Tuần này
							</Button>
							<Button
								variant="outline"
								size="sm"
								onClick={() => {
									const today = new Date();
									const startOfMonth = new Date(
										today.getFullYear(),
										today.getMonth(),
										1
									);
									setFromDate(startOfMonth);
									setToDate(today);
									handleFilterChange(
										"from",
										startOfMonth.getTime()
									);
									handleFilterChange("to", today.getTime());
								}}
							>
								Tháng này
							</Button>
							<Button
								variant="outline"
								size="sm"
								onClick={() => {
									const today = new Date();
									const lastMonth = new Date(
										today.getFullYear(),
										today.getMonth() - 1,
										1
									);
									const endOfLastMonth = new Date(
										today.getFullYear(),
										today.getMonth(),
										0,
										23,
										59,
										59,
										999
									);
									setFromDate(lastMonth);
									setToDate(endOfLastMonth);
									handleFilterChange(
										"from",
										lastMonth.getTime()
									);
									handleFilterChange(
										"to",
										endOfLastMonth.getTime()
									);
								}}
							>
								Tháng trước
							</Button>
						</div>
					</div>

					<div className="grid grid-cols-1 md:grid-cols-5 gap-4">
						{/* From Date */}
						<div className="space-y-2">
							<label className="text-sm font-medium">
								Từ ngày
							</label>
							<Popover>
								<PopoverTrigger asChild>
									<Button
										variant="outline"
										className={`w-full justify-start text-left font-normal ${
											!fromDate && "text-muted-foreground"
										}`}
									>
										<CalendarIcon className="mr-2 h-4 w-4" />
										{fromDate
											? format(fromDate, "dd/MM/yyyy", {
													locale: vi,
											  })
											: "Chọn ngày"}
									</Button>
								</PopoverTrigger>
								<PopoverContent
									className="w-auto p-0"
									align="start"
								>
									<Calendar
										mode="single"
										selected={fromDate}
										onSelect={(date) => {
											setFromDate(date);
											if (date) {
												handleFilterChange(
													"from",
													date.getTime()
												);
											}
										}}
										disabled={(date) =>
											date > new Date() ||
											date < new Date("1900-01-01")
										}
										initialFocus
									/>
								</PopoverContent>
							</Popover>
						</div>

						{/* To Date */}
						<div className="space-y-2">
							<label className="text-sm font-medium">
								Đến ngày
							</label>
							<Popover>
								<PopoverTrigger asChild>
									<Button
										variant="outline"
										className={`w-full justify-start text-left font-normal ${
											!toDate && "text-muted-foreground"
										}`}
									>
										<CalendarIcon className="mr-2 h-4 w-4" />
										{toDate
											? format(toDate, "dd/MM/yyyy", {
													locale: vi,
											  })
											: "Chọn ngày"}
									</Button>
								</PopoverTrigger>
								<PopoverContent
									className="w-auto p-0"
									align="start"
								>
									<Calendar
										mode="single"
										selected={toDate}
										onSelect={(date) => {
											setToDate(date);
											if (date) {
												// Set to end of day
												const endOfDay = new Date(date);
												endOfDay.setHours(
													23,
													59,
													59,
													999
												);
												handleFilterChange(
													"to",
													endOfDay.getTime()
												);
											}
										}}
										disabled={(date) =>
											date > new Date() ||
											date < new Date("1900-01-01")
										}
										initialFocus
									/>
								</PopoverContent>
							</Popover>
						</div>

						{/* Transaction Type */}
						<div className="space-y-2">
							<label className="text-sm font-medium">
								Loại giao dịch
							</label>
							<Select
								value={filters.type}
								onValueChange={(value) =>
									handleFilterChange("type", value)
								}
							>
								<SelectTrigger>
									<SelectValue placeholder="Chọn loại giao dịch" />
								</SelectTrigger>
								<SelectContent>
									{transactionTypes.map((type) => (
										<SelectItem
											key={type.value}
											value={type.value}
										>
											{type.label}
										</SelectItem>
									))}
								</SelectContent>
							</Select>
						</div>

						{/* Page Size */}
						<div className="space-y-2">
							<label className="text-sm font-medium">
								Số bản ghi
							</label>
							<Select
								value={filters.size.toString()}
								onValueChange={(value) =>
									handleFilterChange("size", parseInt(value))
								}
							>
								<SelectTrigger>
									<SelectValue />
								</SelectTrigger>
								<SelectContent>
									{pageSizes.map((size) => (
										<SelectItem
											key={size}
											value={size.toString()}
										>
											{size} bản ghi
										</SelectItem>
									))}
								</SelectContent>
							</Select>
						</div>

						{/* Sort Direction */}
						<div className="space-y-2">
							<label className="text-sm font-medium">
								Sắp xếp
							</label>
							<Select
								value={filters.direction}
								onValueChange={(value) =>
									handleFilterChange("direction", value)
								}
							>
								<SelectTrigger>
									<SelectValue />
								</SelectTrigger>
								<SelectContent>
									<SelectItem value="DESC">
										<div className="flex items-center gap-2">
											<ArrowUpDown className="h-4 w-4 rotate-180" />
											Mới nhất
										</div>
									</SelectItem>
									<SelectItem value="ASC">
										<div className="flex items-center gap-2">
											<ArrowUpDown className="h-4 w-4" />
											Cũ nhất
										</div>
									</SelectItem>
								</SelectContent>
							</Select>
						</div>
					</div>
				</CardContent>
			</Card>

			{/* Transaction List */}
			<Card>
				<CardHeader>
					<div className="flex items-center justify-between gap-4">
						<div className="flex-1 max-w-md">
							<div className="relative">
								<Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
								<Input
									placeholder="Tìm kiếm theo mã giao dịch, mô tả..."
									value={searchTerm}
									onChange={(e) =>
										setSearchTerm(e.target.value)
									}
									className="pl-10"
								/>
							</div>
						</div>
						<div className="text-sm text-gray-500">
							{filteredTransactions.length} giao dịch
						</div>
					</div>
				</CardHeader>
				<CardContent>
					{filteredTransactions.length === 0 ? (
						<div className="text-center py-8">
							<DollarSign className="mx-auto h-12 w-12 text-gray-400" />
							<h3 className="mt-2 text-sm font-medium text-gray-900">
								Không có giao dịch
							</h3>
							<p className="mt-1 text-sm text-gray-500">
								Chưa có giao dịch nào được tìm thấy với bộ lọc
								hiện tại.
							</p>
						</div>
					) : (
						<div className="overflow-x-auto">
							<table className="w-full border-collapse">
								<thead>
									<tr className="border-b border-gray-200">
										<th className="text-left py-3 px-4 font-semibold text-gray-700">
											Mã GD
										</th>
										<th className="text-left py-3 px-4 font-semibold text-gray-700">
											Loại
										</th>
										<th className="text-left py-3 px-4 font-semibold text-gray-700">
											Mô tả
										</th>
										<th className="text-left py-3 px-4 font-semibold text-gray-700">
											Số tiền
										</th>
										<th className="text-left py-3 px-4 font-semibold text-gray-700">
											Trạng thái
										</th>
										<th className="text-left py-3 px-4 font-semibold text-gray-700">
											Ngày tạo
										</th>
									</tr>
								</thead>
								<tbody>
									{filteredTransactions.map((transaction) => (
										<tr
											key={transaction.id}
											className="border-b border-gray-100 hover:bg-gray-50 transition-colors"
										>
											<td className="py-3 px-4">
												<span className="font-medium text-gray-900">
													#{transaction.id}
												</span>
											</td>
											<td className="py-3 px-4">
												{getTypeBadge(transaction.type)}
											</td>
											<td className="py-3 px-4">
												<span className="text-gray-600">
													{transaction.description ||
														"Không có mô tả"}
												</span>
											</td>
											<td className="py-3 px-4">
												<span
													className={`font-bold ${
														transaction.type ===
															"DEPOSIT" ||
														transaction.type ===
															"REFUND"
															? "text-green-600"
															: "text-red-600"
													}`}
												>
													{transaction.type ===
														"DEPOSIT" ||
													transaction.type ===
														"REFUND"
														? "+"
														: "-"}
													{formatCurrency(
														transaction.amount
													)}
												</span>
												{transaction.fee && (
													<div className="text-sm text-gray-500">
														Phí:{" "}
														{formatCurrency(
															transaction.fee
														)}
													</div>
												)}
											</td>
											<td className="py-3 px-4">
												{getStatusBadge(
													transaction.status
												)}
											</td>
											<td className="py-3 px-4">
												<span className="text-gray-600">
													{formatDate(
														transaction.createdAt
													)}
												</span>
												{transaction.updatedAt && (
													<div className="text-sm text-gray-500">
														Cập nhật:{" "}
														{formatDate(
															transaction.updatedAt
														)}
													</div>
												)}
											</td>
										</tr>
									))}
								</tbody>
							</table>
						</div>
					)}
				</CardContent>
			</Card>

			{/* Pagination */}
			{(transactionData?.totalPages ||
				transactionData?.data?.totalPages ||
				0) > 1 && (
				<Card>
					<CardContent className="p-4">
						<div className="flex items-center justify-between">
							<div className="text-sm text-gray-500">
								Hiển thị {filters.page * filters.size + 1} -{" "}
								{Math.min(
									(filters.page + 1) * filters.size,
									transactionData?.totalElements ||
										transactionData?.data?.totalElements ||
										0
								)}
								của{" "}
								{transactionData?.totalElements ||
									transactionData?.data?.totalElements ||
									0}{" "}
								giao dịch
							</div>
							<div className="flex gap-2 items-center">
								<Button
									variant="outline"
									size="sm"
									disabled={filters.page === 0}
									onClick={(e) => {
										e.preventDefault();
										handlePageChange(filters.page - 1);
									}}
									className="cursor-pointer hover:bg-gray-100 disabled:cursor-not-allowed"
									type="button"
								>
									Trước
								</Button>

								{/* Page numbers */}
								{Array.from(
									{
										length: Math.min(
											5,
											transactionData?.totalPages ||
												transactionData?.data
													?.totalPages ||
												1
										),
									},
									(_, i) => {
										const totalPages =
											transactionData?.totalPages ||
											transactionData?.data?.totalPages ||
											1;
										const startPage = Math.max(
											0,
											Math.min(
												totalPages - 5,
												filters.page - 2
											)
										);
										const page = startPage + i;

										if (page >= totalPages) return null;

										return (
											<Button
												key={page}
												variant={
													page === filters.page
														? "default"
														: "outline"
												}
												size="sm"
												onClick={(e) => {
													e.preventDefault();
													handlePageChange(page);
												}}
												className="cursor-pointer min-w-[40px] hover:bg-gray-100"
											>
												{page + 1}
											</Button>
										);
									}
								)}

								<Button
									variant="outline"
									size="sm"
									disabled={
										filters.page >=
										(transactionData?.totalPages ||
											transactionData?.data?.totalPages ||
											1) -
											1
									}
									onClick={(e) => {
										e.preventDefault();
										handlePageChange(filters.page + 1);
									}}
									className="cursor-pointer hover:bg-gray-100 disabled:cursor-not-allowed"
								>
									Sau
								</Button>
							</div>
						</div>
					</CardContent>
				</Card>
			)}
		</div>
	);
};

export default TransactionList;
