import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { Plus, ShoppingCart } from "lucide-react";
import RequestCard from "@/components/RequestCard";
import RequestFilters from "./RequestFilters";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { useGetPurchaseRequestQuery } from "@/services/gshopApi";
import { PaginationBar } from "@/utils/Pagination";

export default function RequestDashboard() {
	const navigate = useNavigate();
	const [currentPage, setCurrentPage] = useState(0);
	const [pageSize] = useState(10);

	// Filter states
	const [filters, setFilters] = useState({
		search: "",
		status: "all",
		type: "all",
		dateRange: "all",
	});

	// Sort states
	const [sort, setSort] = useState({
		field: "createdAt",
		direction: "desc",
	});

	const {
		data: purchaseRequestsData,
		isLoading: isRequestLoading,
		isError: isRequestError,
	} = useGetPurchaseRequestQuery({
		page: currentPage,
		size: Number(pageSize),
		type: "assigned",
	});

	const allRequests = purchaseRequestsData?.content || [];

	// Client-side filtering (temporary solution until backend filtering is confirmed)
	const filteredRequests = allRequests.filter((request) => {
		// Search filter
		if (filters.search) {
			const searchLower = filters.search.toLowerCase();
			const matchesSearch =
				request.id?.toString().includes(searchLower) ||
				request.requestItems?.some((item) =>
					item.productName?.toLowerCase().includes(searchLower)
				) ||
				request.shippingAddress?.name
					?.toLowerCase()
					.includes(searchLower);
			if (!matchesSearch) return false;
		}

		// Status filter
		if (filters.status !== "all" && request.status !== filters.status) {
			return false;
		}

		// Type filter
		if (filters.type !== "all" && request.requestType !== filters.type) {
			return false;
		}

		// Date range filter (simplified)
		if (filters.dateRange !== "all") {
			const requestDate = new Date(parseInt(request.createdAt));
			const now = new Date();

			switch (filters.dateRange) {
				case "today": {
					if (requestDate.toDateString() !== now.toDateString())
						return false;
					break;
				}
				case "week": {
					const weekAgo = new Date(
						now.getTime() - 7 * 24 * 60 * 60 * 1000
					);
					if (requestDate < weekAgo) return false;
					break;
				}
				case "month": {
					const monthAgo = new Date(
						now.getTime() - 30 * 24 * 60 * 60 * 1000
					);
					if (requestDate < monthAgo) return false;
					break;
				}
			}
		}

		return true;
	});

	// Client-side sorting
	const sortedRequests = [...filteredRequests].sort((a, b) => {
		let aValue, bValue;

		switch (sort.field) {
			case "createdAt":
			case "updatedAt":
				aValue = new Date(parseInt(a[sort.field]));
				bValue = new Date(parseInt(b[sort.field]));
				break;
			case "totalProducts":
				aValue = a.requestItems?.length || 0;
				bValue = b.requestItems?.length || 0;
				break;
			case "status":
				aValue = a.status || "";
				bValue = b.status || "";
				break;
			default:
				aValue = a[sort.field] || "";
				bValue = b[sort.field] || "";
		}

		if (sort.direction === "asc") {
			return aValue > bValue ? 1 : -1;
		} else {
			return aValue < bValue ? 1 : -1;
		}
	});

	const requests = sortedRequests;

	const handleCreateRequest = () => {
		navigate("/account-center/create-request");
	};

	// Reset page when filters change
	useEffect(() => {
		setCurrentPage(0);
	}, [filters, sort]);

	// Loading state
	if (isRequestLoading) {
		return (
			<div className="min-h-screen bg-white">
				<div className="max-w-7xl mx-auto px-3 py-6 space-y-4">
					<div className="animate-pulse space-y-4">
						<div className="h-8 bg-gray-200 rounded w-1/3"></div>
						<div className="h-4 bg-gray-200 rounded w-1/2"></div>
						<div className="space-y-4">
							{[...Array(6)].map((_, i) => (
								<div
									key={i}
									className="h-20 bg-gray-200 rounded-lg"
								></div>
							))}
						</div>
					</div>
				</div>
			</div>
		);
	}

	// Error state
	if (isRequestError) {
		return (
			<div className="min-h-screen bg-white">
				<div className="max-w-7xl mx-auto px-3 py-6">
					<Card className="shadow-sm">
						<CardContent className="p-12 text-center">
							<div className="w-20 h-20 bg-red-100 rounded-full flex items-center justify-center mx-auto mb-6">
								<ShoppingCart className="h-10 w-10 text-red-400" />
							</div>
							<h3 className="text-xl font-medium text-gray-900 mb-3">
								Có lỗi xảy ra
							</h3>
							<p className="text-gray-600 mb-6 max-w-md mx-auto">
								Không thể tải danh sách yêu cầu mua hàng. Vui
								lòng thử lại sau.
							</p>
							<Button
								onClick={() => window.location.reload()}
								className="bg-gradient-to-r from-blue-600 to-blue-700 hover:from-blue-700 hover:to-blue-800"
							>
								Thử lại
							</Button>
						</CardContent>
					</Card>
				</div>
			</div>
		);
	}

	return (
		<div className="min-h-screen bg-white">
			<div className="max-w-7xl mx-auto px-3 py-6 space-y-4">
				{/* Header */}
				<div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-6">
					<div className="space-y-2">
						<h1 className="text-3xl font-bold text-gray-900">
							Yêu cầu mua hàng
						</h1>
						<p className="text-gray-600">
							Theo dõi tất cả yêu cầu mua hàng của bạn
						</p>
					</div>
					<Button
						onClick={handleCreateRequest}
						className="bg-gradient-to-r from-blue-600 to-blue-700 hover:from-blue-700 hover:to-blue-800 h-12 px-6 shadow-lg hover:shadow-xl transition-all duration-200"
					>
						<Plus className="h-5 w-5 mr-2" />
						Tạo yêu cầu mới
					</Button>
				</div>

				{/* Filters */}
				<RequestFilters
					filters={filters}
					onFiltersChange={setFilters}
					sort={sort}
					onSortChange={setSort}
				/>

				{/* Request List */}
				<div className="space-y-4">
					{requests.length === 0 ? (
						<Card className="shadow-sm">
							<CardContent className="p-12 text-center">
								<div className="w-20 h-20 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-6">
									<ShoppingCart className="h-10 w-10 text-gray-400" />
								</div>
								<h3 className="text-xl font-medium text-gray-900 mb-3">
									Không có yêu cầu nào
								</h3>
								<p className="text-gray-600 mb-6 max-w-md mx-auto">
									Bạn chưa có yêu cầu mua hàng nào. Hãy tạo
									yêu cầu đầu tiên để bắt đầu!
								</p>
							</CardContent>
						</Card>
					) : (
						<>
							<div className="space-y-4">
								{requests.map((request) => (
									<RequestCard
										key={request.id}
										request={request}
										listView={true}
									/>
								))}
							</div>

							{/* Pagination */}
							<PaginationBar
								totalPages={purchaseRequestsData.totalPages}
								currentPage={currentPage}
								handlePageChange={setCurrentPage}
							/>
						</>
					)}
				</div>
			</div>
		</div>
	);
}
