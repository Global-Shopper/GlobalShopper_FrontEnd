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
	Plus,
	Edit,
	Ban,
	UserCheck,
	ChevronUp,
	ChevronDown,
	ArrowUpDown,
} from "lucide-react";
import { useGetAllAdminsQuery, useBanAdminMutation } from "@/services/gshopApi";
import { PaginationBar } from "@/utils/Pagination";
import PageLoading from "@/components/PageLoading";
import { toast } from "sonner";
import CreateAdminForm from "@/components/AccountForm";
import defaultAvt from "@/assets/defaultAvt.jpg";

const PAGE_SIZE_OPTIONS = [5, 10, 20, 50];

const AdminManagement = () => {
	const [searchParams, setSearchParams] = useSearchParams();
	const [searchTerm, setSearchTerm] = useState("");
	const [statusFilter, setStatusFilter] = useState("all");
	const [countryFilter, setCountryFilter] = useState("all");
	const [sortConfig, setSortConfig] = useState({
		key: null,
		direction: null,
	});

	// Form modal state
	const [isCreateFormOpen, setIsCreateFormOpen] = useState(false);
	const [isEditFormOpen, setIsEditFormOpen] = useState(false);
	const [editingAdmin, setEditingAdmin] = useState(null);

	// URL sync for pagination
	const page = parseInt(searchParams.get("page")) || 1;
	const size = parseInt(searchParams.get("size")) || 10;

	const {
		data: adminsData,
		isFetching: isLoading,
		isError,
		error,
		refetch,
	} = useGetAllAdminsQuery({
		page: page - 1,
		size,
	});

	// Debug logs
	console.log("AdminManagement Debug:", {
		apiEndpoint: "/admin",
		queryParams: {
			page: page - 1,
			size,
		},
		searchTerm,
		adminsData,
		dataType: typeof adminsData,
		isArray: Array.isArray(adminsData),
		hasContent: !!adminsData?.content,
		contentLength: adminsData?.content?.length,
		firstItem: adminsData?.content?.[0],
		allKeys: adminsData ? Object.keys(adminsData) : null,
		isLoading,
		isError,
		error,
	});

	const [banAdmin] = useBanAdminMutation();

	// Get all admins data
	const allAdmins = Array.isArray(adminsData)
		? adminsData
		: adminsData?.content || [];

	// Sort function
	const handleSort = (key) => {
		let direction = "asc";
		if (sortConfig.key === key) {
			if (sortConfig.direction === "asc") {
				direction = "desc";
			} else {
				direction = "asc"; // Keep cycling between asc and desc only
			}
		}
		setSortConfig({ key, direction });
	};

	// Sort icon component
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

	// Handler for successful admin creation
	const handleCreateSuccess = () => {
		refetch();
	};

	// Handler for edit admin
	const handleEditAdmin = (admin) => {
		setEditingAdmin(admin);
		setIsEditFormOpen(true);
	};

	// Handler for successful admin update
	const handleUpdateSuccess = () => {
		setEditingAdmin(null);
		setIsEditFormOpen(false);
		refetch();
	};

	// Filter and sort admins
	let filteredAdmins = allAdmins;

	console.log("Filter Debug:", {
		allAdmins: allAdmins.slice(0, 2), // Show first 2 admins
		statusFilter,
		countryFilter,
		searchTerm,
	});

	// Apply filters
	if (searchTerm) {
		filteredAdmins = filteredAdmins.filter((admin) =>
			admin.name?.toLowerCase().includes(searchTerm.toLowerCase())
		);
	}

	if (statusFilter && statusFilter !== "all") {
		filteredAdmins = filteredAdmins.filter((admin) => {
			console.log("Status filter check:", {
				adminStatus: admin.status,
				filterValue: statusFilter,
				match:
					statusFilter === "active"
						? admin.status === "ACTIVE"
						: admin.status === "BANNED",
			});
			if (statusFilter === "active") return admin.status === "ACTIVE";
			if (statusFilter === "banned") return admin.status === "BANNED";
			return true;
		});
	}

	if (countryFilter && countryFilter !== "all") {
		filteredAdmins = filteredAdmins.filter((admin) => {
			console.log("Country filter check:", {
				adminCountry: admin.country,
				filterValue: countryFilter,
				match: admin.country === countryFilter,
			});
			return admin.country === countryFilter;
		});
	}

	// Apply sorting
	if (sortConfig.key) {
		filteredAdmins = [...filteredAdmins].sort((a, b) => {
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
	}

	// Pagination for filtered data
	const totalPages = Math.ceil(filteredAdmins.length / size) || 1;
	const startIndex = (page - 1) * size;
	const endIndex = startIndex + size;
	const adminsList = filteredAdmins.slice(startIndex, endIndex);
	const handlePageChange = (newPage) => {
		setSearchParams((prev) => {
			prev.set("page", newPage + 1);
			return prev;
		});
	};

	const handlePageSizeChange = (value) => {
		setSearchParams((prev) => {
			prev.set("size", value);
			prev.set("page", 1);
			return prev;
		});
	};

	const handleSearch = () => {
		// Reset to first page when searching
		setSearchParams((prev) => {
			prev.set("page", 1);
			return prev;
		});
	};

	const handleBanAdmin = async (adminId, isCurrentlyActive) => {
		try {
			await banAdmin(adminId).unwrap();
			toast.success(
				isCurrentlyActive
					? "Admin đã được cấm thành công"
					: "Admin đã được kích hoạt lại"
			);
			refetch();
		} catch {
			toast.error("Có lỗi xảy ra khi thực hiện thao tác");
		}
	};

	if (isLoading) return <PageLoading />;

	if (isError) {
		return (
			<div className="p-6">
				<div className="mb-6">
					<h1 className="text-2xl font-bold text-gray-900">
						Quản lý Admin
					</h1>
				</div>
				<div className="text-center text-red-500 bg-red-50 p-4 rounded-lg">
					<p>Có lỗi xảy ra khi tải dữ liệu admin</p>
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
						Quản lý Admin
					</h1>
					<p className="text-gray-600 mt-2">
						Quản lý thông tin quản trị viên trong hệ thống
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
								placeholder="Tìm kiếm admin..."
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
								<SelectItem value="banned">Đã cấm</SelectItem>
							</SelectContent>
						</Select>
					</div>

					{/* Country Filter */}
					<div className="flex flex-col gap-1">
						<label className="text-xs text-gray-600 font-medium">
							Quốc gia
						</label>
						<Select
							value={countryFilter}
							onValueChange={setCountryFilter}
						>
							<SelectTrigger className="w-40">
								<SelectValue placeholder="Quốc gia" />
							</SelectTrigger>
							<SelectContent>
								<SelectItem value="all">Tất cả</SelectItem>
								<SelectItem value="Việt Nam">
									Việt Nam
								</SelectItem>
								<SelectItem value="Mỹ">Mỹ</SelectItem>
								<SelectItem value="Trung Quốc">
									Trung Quốc
								</SelectItem>
								<SelectItem value="Nhật Bản">
									Nhật Bản
								</SelectItem>
								<SelectItem value="Hàn Quốc">
									Hàn Quốc
								</SelectItem>
								<SelectItem value="Singapore">
									Singapore
								</SelectItem>
							</SelectContent>
						</Select>
					</div>
				</div>

				{/* Right side - Add Button */}
				<Button
					className="bg-blue-600 hover:bg-blue-700"
					onClick={() => setIsCreateFormOpen(true)}
				>
					<Plus className="h-4 w-4 mr-2" />
					Thêm Admin
				</Button>
			</div>

			{/* Create Admin Form Modal */}
			<CreateAdminForm
				isOpen={isCreateFormOpen}
				onClose={() => setIsCreateFormOpen(false)}
				onSuccess={handleCreateSuccess}
			/>

			{/* Edit Admin Form Modal */}
			<CreateAdminForm
				isOpen={isEditFormOpen}
				onClose={() => {
					setIsEditFormOpen(false);
					setEditingAdmin(null);
				}}
				onSuccess={handleUpdateSuccess}
				editingData={editingAdmin}
				isEditMode={true}
			/>

			{/* Admin Table */}
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
								onClick={() => handleSort("address")}
							>
								<div className="flex items-center">
									Địa chỉ
									<SortIcon column="address" />
								</div>
							</TableHead>
							<TableHead
								className="text-gray-700 font-semibold text-sm bg-blue-100 cursor-pointer hover:bg-blue-200 select-none"
								onClick={() => handleSort("country")}
							>
								<div className="flex items-center">
									Quốc gia
									<SortIcon column="country" />
								</div>
							</TableHead>
							<TableHead
								className="text-gray-700 font-semibold text-sm bg-blue-100 cursor-pointer hover:bg-blue-200 select-none"
								onClick={() => handleSort("status")}
							>
								<div className="flex items-center">
									Trạng thái
									<SortIcon column="status" />
								</div>
							</TableHead>
							<TableHead className="text-center text-gray-700 font-semibold text-sm bg-blue-100 rounded-tr-lg">
								Thao tác
							</TableHead>
						</TableRow>
					</TableHeader>
					<TableBody>
						{adminsList.map((admin) => (
							<TableRow
								key={admin.id}
								className="hover:bg-blue-50/70 transition-colors"
							>
								<TableCell className="py-3">
									<img
										src={admin.avatar || defaultAvt}
										alt="Avatar"
										className="w-10 h-10 rounded-full object-cover border-2 border-gray-200"
										onError={(e) => {
											e.target.src = defaultAvt;
										}}
									/>
								</TableCell>
								<TableCell className="font-medium py-3">
									{admin.name || "-"}
								</TableCell>
								<TableCell className="py-3">
									{admin.email || "-"}
								</TableCell>
								<TableCell className="py-3">
									{admin.phone || "-"}
								</TableCell>
								<TableCell className="py-3 max-w-xs truncate">
									{admin.address || "-"}
								</TableCell>
								<TableCell className="py-3">
									{admin.nation || "-"}
								</TableCell>
								<TableCell className="py-3">
									<span
										className={`px-2 py-1 rounded-full text-xs font-medium ${
											admin.isActive !== false
												? "bg-green-100 text-green-800"
												: "bg-red-100 text-red-800"
										}`}
									>
										{admin.isActive !== false
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
											onClick={() =>
												handleEditAdmin(admin)
											}
										>
											<Edit className="h-4 w-4" />
										</Button>
										<Button
											variant="outline"
											size="sm"
											className={`h-8 w-8 p-0 ${
												admin.isActive !== false
													? "text-red-600 hover:text-red-700 hover:bg-red-50"
													: "text-green-600 hover:text-green-700 hover:bg-green-50"
											}`}
											title={
												admin.isActive !== false
													? "Cấm admin"
													: "Kích hoạt admin"
											}
											onClick={() =>
												handleBanAdmin(
													admin.id,
													admin.isActive !== false
												)
											}
										>
											{admin.isActive !== false ? (
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
				{adminsList.length === 0 && (
					<div className="text-center py-8 text-gray-500">
						Không có admin nào được tìm thấy
					</div>
				)}

				{/* Pagination */}
				{totalPages > 1 && (
					<div className="px-6 py-4 border-t border-gray-200">
						<PaginationBar
							currentPage={page - 1}
							totalPages={totalPages}
							onPageChange={handlePageChange}
						/>
					</div>
				)}
			</div>
		</div>
	);
};

export default AdminManagement;
