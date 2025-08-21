import React, { useState } from "react";
import { useSearchParams } from "react-router-dom";
import {
	Table,
	TableBody,
	TableCell,
	TableHead,
	TableHeader,
	TableRow,
} from "@/components/ui/table";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
	Select,
	SelectContent,
	SelectItem,
	SelectTrigger,
	SelectValue,
} from "@/components/ui/select";
import {
	Search,
	Edit,
	Ban,
	UserCheck,
	ChevronUp,
	ChevronDown,
	ArrowUpDown,
} from "lucide-react";
import {
	useGetAllCustomersQuery,
	useBanCustomerMutation,
} from "@/services/gshopApi";
import { PaginationBar } from "@/utils/Pagination";
import PageLoading from "@/components/PageLoading";
import { toast } from "sonner";

const PAGE_SIZE_OPTIONS = [5, 10, 20, 50];

const CustomerManagement = () => {
	const [searchParams, setSearchParams] = useSearchParams();
	const [searchTerm, setSearchTerm] = useState("");
	const [statusFilter, setStatusFilter] = useState("all");
	const [sortConfig, setSortConfig] = useState({
		key: null,
		direction: null,
	});

	const [showBanConfirm, setShowBanConfirm] = useState(false);
	const [customerToBan, setCustomerToBan] = useState(null);

	const page = parseInt(searchParams.get("page")) || 1;
	const size = parseInt(searchParams.get("size")) || 10;

	const {
		data: customersData,
		isFetching: isLoading,
		isError,
		error,
		refetch,
	} = useGetAllCustomersQuery({
		page: page - 1,
		size,
	});

	const [banCustomer, { isLoading: isToggling }] = useBanCustomerMutation();

	// Sort function
	const handleSort = (key) => {
		let direction = "asc";
		if (sortConfig.key === key) {
			if (sortConfig.direction === "asc") {
				direction = "desc";
			} else {
				direction = "asc";
			}
		}
		setSortConfig({ key, direction });
	};

	const SortIcon = ({ column }) => {
		if (sortConfig.key !== column) {
			return <ArrowUpDown className="h-4 w-4 ml-1 opacity-50" />;
		}
		return sortConfig.direction === "asc" ? (
			<ChevronUp className="h-4 w-4 ml-1 text-blue-600" />
		) : (
			<ChevronDown className="h-4 w-4 ml-1 text-blue-600" />
		);
	};

	const allCustomers = Array.isArray(customersData)
		? customersData
		: customersData?.content || [];

	let filteredCustomers = allCustomers;

	if (searchTerm) {
		filteredCustomers = filteredCustomers.filter(
			(customer) =>
				customer.name
					?.toLowerCase()
					.includes(searchTerm.toLowerCase()) ||
				customer.email?.toLowerCase().includes(searchTerm.toLowerCase())
		);
	}

	if (statusFilter && statusFilter !== "all") {
		filteredCustomers = filteredCustomers.filter((customer) => {
			if (statusFilter === "active") return customer.active !== false;
			if (statusFilter === "banned") return customer.active === false;
			return true;
		});
	}

	// Apply sorting
	if (sortConfig.key) {
		filteredCustomers = [...filteredCustomers].sort((a, b) => {
			let aValue = a[sortConfig.key];
			let bValue = b[sortConfig.key];

			// Handle null/undefined values
			if (aValue == null) aValue = "";
			if (bValue == null) bValue = "";

			// Convert to string for comparison
			aValue = aValue.toString().toLowerCase();
			bValue = bValue.toString().toLowerCase();

			if (aValue < bValue) {
				return sortConfig.direction === "asc" ? -1 : 1;
			}
			if (aValue > bValue) {
				return sortConfig.direction === "asc" ? 1 : -1;
			}
			return 0;
		});
	} else {
		filteredCustomers = [...filteredCustomers].sort((a, b) => {
			const aActive = a.active !== false ? 1 : 0;
			const bActive = b.active !== false ? 1 : 0;
			if (aActive !== bActive) {
				return bActive - aActive;
			}
			return (a.id || 0) - (b.id || 0);
		});
	}

	const totalPages = Math.ceil(filteredCustomers.length / size) || 1;
	const startIndex = (page - 1) * size;
	const endIndex = startIndex + size;
	const customersList = filteredCustomers.slice(startIndex, endIndex);

	const handlePageSizeChange = (value) => {
		setSearchParams((prev) => {
			prev.set("size", value);
			prev.set("page", 1);
			return prev;
		});
	};

	const handleSearch = () => {
		setSearchParams((prev) => {
			prev.set("page", 1);
			return prev;
		});
	};

	const handleBanCustomer = (customer) => {
		setCustomerToBan(customer);
		setShowBanConfirm(true);
	};

	const handleConfirmToggleActive = async () => {
		if (!customerToBan) return;

		try {
			await banCustomer(customerToBan.id).unwrap();
			toast.success(
				customerToBan.active !== false
					? "Customer đã được vô hiệu hóa thành công"
					: "Customer đã được kích hoạt thành công"
			);
			refetch();
		} catch (error) {
			console.error("Toggle active error:", error);
			toast.error(
				"Có lỗi xảy ra khi thực hiện thao tác: " +
					(error?.data?.message || error.message)
			);
		} finally {
			setShowBanConfirm(false);
			setCustomerToBan(null);
		}
	};

	const formatDate = (dateString) => {
		if (!dateString) return "-";
		try {
			const date = new Date(dateString);
			return date.toLocaleDateString("vi-VN");
		} catch {
			return "-";
		}
	};

	const formatGender = (gender) => {
		if (!gender) return "-";
		const genderMap = {
			MALE: "Nam",
			FEMALE: "Nữ",
			OTHER: "Khác",
			male: "Nam",
			female: "Nữ",
			other: "Khác",
		};
		return genderMap[gender] || gender;
	};

	if (isLoading) return <PageLoading />;

	if (isError) {
		return (
			<div className="p-6">
				<div className="mb-6">
					<h1 className="text-2xl font-bold text-gray-900">
						Quản lý Customer
					</h1>
				</div>
				<div className="text-center text-red-500 bg-red-50 p-4 rounded-lg">
					<p>Có lỗi xảy ra khi tải dữ liệu customer</p>
					<p className="text-sm mt-2">
						Chi tiết lỗi: {JSON.stringify(error)}
					</p>
					<button
						onClick={() => refetch()}
						className="mt-2 px-4 py-2 bg-red-500 text-white rounded hover:bg-red-600"
					>
						Thử lại
					</button>
				</div>
			</div>
		);
	}

	return (
		<div className="p-6">
			{/* Header */}
			<div className="mb-6 flex justify-between items-start">
				<div>
					<h1 className="text-2xl font-bold text-gray-900">
						Quản lý Customer
					</h1>
					<p className="text-gray-600 mt-2">
						Quản lý thông tin khách hàng trong hệ thống
					</p>
				</div>

				{/* Page Size Selector - Góc phải trên */}
				<div className="flex items-center gap-2">
					<span className="text-sm text-gray-600">Hiển thị:</span>
					<Select
						value={size.toString()}
						onValueChange={handlePageSizeChange}
					>
						<SelectTrigger className="w-20">
							<SelectValue />
						</SelectTrigger>
						<SelectContent>
							{PAGE_SIZE_OPTIONS.map((option) => (
								<SelectItem
									key={option}
									value={option.toString()}
								>
									{option}
								</SelectItem>
							))}
						</SelectContent>
					</Select>
					<span className="text-sm text-gray-600">mục</span>
				</div>
			</div>

			{/* Controls - No border, compact layout */}
			<div className="flex flex-col lg:flex-row gap-4 justify-between items-start lg:items-center mb-6">
				{/* Left side - Search and Filters */}
				<div className="flex flex-col sm:flex-row gap-3 flex-1">
					{/* Search */}
					<div className="flex flex-col gap-1">
						<label className="text-xs text-gray-600 font-medium">
							Tìm kiếm
						</label>
						<div className="flex gap-2">
							<Input
								placeholder="Tìm kiếm tên hoặc email..."
								value={searchTerm}
								onChange={(e) => setSearchTerm(e.target.value)}
								onKeyPress={(e) =>
									e.key === "Enter" && handleSearch()
								}
								className="w-64"
							/>
							<Button
								onClick={handleSearch}
								variant="outline"
								size="icon"
							>
								<Search className="h-4 w-4" />
							</Button>
						</div>
					</div>

					{/* Status Filter */}
					<div className="flex flex-col gap-1">
						<label className="text-xs text-gray-600 font-medium">
							Trạng thái
						</label>
						<Select
							value={statusFilter}
							onValueChange={setStatusFilter}
						>
							<SelectTrigger className="w-40">
								<SelectValue placeholder="Trạng thái" />
							</SelectTrigger>
							<SelectContent>
								<SelectItem value="all">Tất cả</SelectItem>
								<SelectItem value="active">
									Hoạt động
								</SelectItem>
								<SelectItem value="banned">Bị cấm</SelectItem>
							</SelectContent>
						</Select>
					</div>
				</div>
			</div>

			{/* Customer Table */}
			<div className="bg-white rounded-lg shadow-sm border border-gray-200">
				<Table className="w-full">
					<TableHeader>
						<TableRow className="bg-blue-100">
							<TableHead className="text-gray-700 font-semibold text-sm bg-blue-100 rounded-tl-lg">
								Avatar
							</TableHead>
							<TableHead
								className="text-gray-700 font-semibold text-sm bg-blue-100 cursor-pointer hover:bg-blue-200 select-none"
								onClick={() => handleSort("name")}
							>
								<div className="flex items-center">
									Tên
									<SortIcon column="name" />
								</div>
							</TableHead>
							<TableHead
								className="text-gray-700 font-semibold text-sm bg-blue-100 cursor-pointer hover:bg-blue-200 select-none"
								onClick={() => handleSort("gender")}
							>
								<div className="flex items-center">
									Giới tính
									<SortIcon column="gender" />
								</div>
							</TableHead>
							<TableHead
								className="text-gray-700 font-semibold text-sm bg-blue-100 cursor-pointer hover:bg-blue-200 select-none"
								onClick={() => handleSort("email")}
							>
								<div className="flex items-center">
									Email
									<SortIcon column="email" />
								</div>
							</TableHead>
							<TableHead
								className="text-gray-700 font-semibold text-sm bg-blue-100 cursor-pointer hover:bg-blue-200 select-none"
								onClick={() => handleSort("phone")}
							>
								<div className="flex items-center">
									Điện thoại
									<SortIcon column="phone" />
								</div>
							</TableHead>
							<TableHead
								className="text-gray-700 font-semibold text-sm bg-blue-100 cursor-pointer hover:bg-blue-200 select-none"
								onClick={() => handleSort("dateOfBirth")}
							>
								<div className="flex items-center">
									Ngày sinh
									<SortIcon column="dateOfBirth" />
								</div>
							</TableHead>
							<TableHead
								className="text-gray-700 font-semibold text-sm bg-blue-100 cursor-pointer hover:bg-blue-200 select-none"
								onClick={() => handleSort("active")}
							>
								<div className="flex items-center">
									Trạng thái
									<SortIcon column="active" />
								</div>
							</TableHead>
							<TableHead className="text-center text-gray-700 font-semibold text-sm bg-blue-100 rounded-tr-lg">
								Thao tác
							</TableHead>
						</TableRow>
					</TableHeader>
					<TableBody>
						{customersList.map((customer) => (
							<TableRow
								key={customer.id}
								className="hover:bg-blue-50/70 transition-colors"
							>
								<TableCell className="py-3">
									<img
										src={
											customer.avatar ||
											"/src/assets/defaultAvt.jpg"
										}
										alt="Avatar"
										className="w-10 h-10 rounded-full object-cover border-2 border-gray-200"
									/>
								</TableCell>
								<TableCell className="font-medium py-3">
									{customer.name || "-"}
								</TableCell>
								<TableCell className="py-3">
									{formatGender(customer.gender)}
								</TableCell>
								<TableCell className="py-3">
									{customer.email || "-"}
								</TableCell>
								<TableCell className="py-3">
									{customer.phone || "-"}
								</TableCell>
								<TableCell className="py-3">
									{formatDate(customer.dateOfBirth)}
								</TableCell>
								<TableCell className="py-3">
									<span
										className={`px-2 py-1 rounded-full text-xs font-medium ${
											customer.active !== false
												? "bg-green-100 text-green-800"
												: "bg-red-100 text-red-800"
										}`}
									>
										{customer.active !== false
											? "Hoạt động"
											: "Bị cấm"}
									</span>
								</TableCell>
								<TableCell className="py-3">
									<div className="flex gap-2 justify-center">
										<Button
											variant="outline"
											size="sm"
											className="h-8 w-8 p-0"
											title="Chỉnh sửa"
										>
											<Edit className="h-4 w-4" />
										</Button>
										<Button
											variant="outline"
											size="sm"
											className={`h-8 w-8 p-0 ${
												customer.active !== false
													? "text-red-600 hover:text-red-700 hover:bg-red-50"
													: "text-green-600 hover:text-green-700 hover:bg-green-50"
											}`}
											title={
												customer.active !== false
													? "Vô hiệu hóa customer"
													: "Kích hoạt customer"
											}
											onClick={() =>
												handleBanCustomer(customer)
											}
											disabled={isToggling}
										>
											{customer.active !== false ? (
												<Ban className="h-4 w-4" />
											) : (
												<UserCheck className="h-4 w-4" />
											)}
										</Button>
									</div>
								</TableCell>
							</TableRow>
						))}
					</TableBody>
				</Table>

				{/* Empty State */}
				{customersList.length === 0 && (
					<div className="text-center py-8 text-gray-500">
						Không có customer nào được tìm thấy
					</div>
				)}

				{/* Pagination */}
				{totalPages > 1 && (
					<div className="px-6 py-4 border-t border-gray-200">
						<PaginationBar
							page={page}
							totalPages={totalPages}
							setPage={(newPage) => {
								setSearchParams((prev) => {
									prev.set("page", newPage);
									return prev;
								});
							}}
						/>
					</div>
				)}
			</div>

			{/* Ban Confirmation Popup */}
			{showBanConfirm && customerToBan && (
				<div className="fixed inset-0 z-50 bg-black/50 flex items-center justify-center p-4">
					<div className="bg-white rounded-lg shadow-xl w-full max-w-md">
						<div className="p-6">
							<h3 className="text-lg font-semibold text-gray-900 mb-4">
								{customerToBan.active !== false
									? "Xác nhận vô hiệu hóa customer"
									: "Xác nhận kích hoạt customer"}
							</h3>
							<p className="text-gray-600 mb-6">
								Bạn có chắc chắn muốn{" "}
								{customerToBan.active !== false
									? "vô hiệu hóa"
									: "kích hoạt"}
								tài khoản customer{" "}
								<strong>{customerToBan.name}</strong>?
							</p>
							<div className="flex gap-3 justify-end">
								<Button
									variant="outline"
									onClick={() => {
										setShowBanConfirm(false);
										setCustomerToBan(null);
									}}
									disabled={isToggling}
								>
									Hủy bỏ
								</Button>
								<Button
									className={
										customerToBan.active !== false
											? "bg-red-600 hover:bg-red-700"
											: "bg-green-600 hover:bg-green-700"
									}
									onClick={handleConfirmToggleActive}
									disabled={isToggling}
								>
									{isToggling
										? "Đang xử lý..."
										: customerToBan.active !== false
										? "Vô hiệu hóa"
										: "Kích hoạt"}
								</Button>
							</div>
						</div>
					</div>
				</div>
			)}
		</div>
	);
};

export default CustomerManagement;
