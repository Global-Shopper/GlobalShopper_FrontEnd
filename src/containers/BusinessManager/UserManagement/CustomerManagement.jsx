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
import { Search, Edit, Ban, UserCheck } from "lucide-react";
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

	// URL sync for pagination
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

	const [banCustomer] = useBanCustomerMutation();

	// Get all customers data
	const allCustomers = Array.isArray(customersData)
		? customersData
		: customersData?.content || [];

	// Filter customers based on search term (search by name)
	const filteredCustomers = searchTerm
		? allCustomers.filter((customer) =>
				customer.name?.toLowerCase().includes(searchTerm.toLowerCase())
		  )
		: allCustomers;

	// Client-side pagination for filtered data
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
		// Reset to first page when searching
		setSearchParams((prev) => {
			prev.set("page", 1);
			return prev;
		});
	};

	const handleBanCustomer = async (customerId, isCurrentlyActive) => {
		try {
			await banCustomer(customerId).unwrap();
			toast.success(
				isCurrentlyActive
					? "Customer đã được cấm thành công"
					: "Customer đã được kích hoạt lại"
			);
			refetch();
		} catch {
			toast.error("Có lỗi xảy ra khi thực hiện thao tác");
		}
	};

	// Format date of birth
	const formatDate = (dateString) => {
		if (!dateString) return "-";
		try {
			const date = new Date(dateString);
			return date.toLocaleDateString("vi-VN");
		} catch {
			return "-";
		}
	};

	// Format gender
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

			{/* Controls */}
			<div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6 mb-6">
				{/* Search */}
				<div className="flex gap-2 max-w-md">
					<Input
						placeholder="Tìm kiếm customer..."
						value={searchTerm}
						onChange={(e) => setSearchTerm(e.target.value)}
						onKeyPress={(e) => e.key === "Enter" && handleSearch()}
						className="flex-1"
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

			{/* Customer Table */}
			<div className="bg-white rounded-lg shadow-sm border border-gray-200">
				<Table className="w-full">
					<TableHeader>
						<TableRow className="bg-blue-100">
							<TableHead className="text-gray-700 font-semibold text-sm bg-blue-100 rounded-tl-lg">
								Avatar
							</TableHead>
							<TableHead className="text-gray-700 font-semibold text-sm bg-blue-100">
								Tên
							</TableHead>
							<TableHead className="text-gray-700 font-semibold text-sm bg-blue-100">
								Giới tính
							</TableHead>
							<TableHead className="text-gray-700 font-semibold text-sm bg-blue-100">
								Email
							</TableHead>
							<TableHead className="text-gray-700 font-semibold text-sm bg-blue-100">
								Điện thoại
							</TableHead>
							<TableHead className="text-gray-700 font-semibold text-sm bg-blue-100">
								Ngày sinh
							</TableHead>
							<TableHead className="text-gray-700 font-semibold text-sm bg-blue-100">
								Trạng thái
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
											customer.isActive !== false
												? "bg-green-100 text-green-800"
												: "bg-red-100 text-red-800"
										}`}
									>
										{customer.isActive !== false
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
												customer.isActive !== false
													? "text-red-600 hover:text-red-700 hover:bg-red-50"
													: "text-green-600 hover:text-green-700 hover:bg-green-50"
											}`}
											title={
												customer.isActive !== false
													? "Cấm customer"
													: "Kích hoạt customer"
											}
											onClick={() =>
												handleBanCustomer(
													customer.id,
													customer.isActive !== false
												)
											}
										>
											{customer.isActive !== false ? (
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
		</div>
	);
};

export default CustomerManagement;
