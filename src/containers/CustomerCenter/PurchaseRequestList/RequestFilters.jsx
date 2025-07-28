import { Search, SortAsc, SortDesc } from "lucide-react";
import { REQUEST_STATUS, REQUEST_TYPE } from "@/const/purchaseReqStatus";
import { Input } from "@/components/ui/input";
import {
	Select,
	SelectContent,
	SelectItem,
	SelectTrigger,
	SelectValue,
} from "@/components/ui/select";
import { Button } from "@/components/ui/button";

export default function RequestFilters({
	filters,
	onFiltersChange,
	sort,
	onSortChange,
}) {
	const updateFilter = (key, value) => {
		onFiltersChange({ ...filters, [key]: value });
	};

	const toggleSortDirection = () => {
		onSortChange({
			...sort,
			direction: sort.direction === "asc" ? "desc" : "asc",
		});
	};

	return (
		<div className="bg-white border border-gray-200 rounded-lg p-2 shadow-sm">
			<div className="flex flex-wrap items-center gap-3">
				{/* Search */}
				<div className="relative flex-1 min-w-[280px]">
					<Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
					<Input
						placeholder="Tìm kiếm theo mã, sản phẩm, cửa hàng..."
						value={filters.search}
						onChange={(e) => updateFilter("search", e.target.value)}
						className="pl-10 h-10 border-gray-300 focus:border-blue-500"
					/>
				</div>

				{/* Status Filter */}
				<Select
					value={filters.status}
					onValueChange={(value) => updateFilter("status", value)}
				>
					<SelectTrigger className="h-10 w-[140px] border-gray-300 focus:border-blue-500">
						<SelectValue placeholder="Trạng thái" />
					</SelectTrigger>
					<SelectContent>
						<SelectItem value="all">Tất cả trạng thái</SelectItem>
						<SelectItem value={REQUEST_STATUS.DRAFT}>
							Nháp
						</SelectItem>
						<SelectItem value={REQUEST_STATUS.SENT}>
							Đã gửi
						</SelectItem>
						<SelectItem value={REQUEST_STATUS.PROCESSING}>
							Đang xử lý
						</SelectItem>
						<SelectItem value={REQUEST_STATUS.COMPLETED}>
							Hoàn thành
						</SelectItem>
						<SelectItem value={REQUEST_STATUS.CANCELLED}>
							Đã hủy
						</SelectItem>
					</SelectContent>
				</Select>

				{/* Type Filter */}
				<Select
					value={filters.type}
					onValueChange={(value) => updateFilter("type", value)}
				>
					<SelectTrigger className="h-10 w-[140px] border-gray-300 focus:border-blue-500">
						<SelectValue placeholder="Loại yêu cầu" />
					</SelectTrigger>
					<SelectContent>
						<SelectItem value="all">Tất cả loại</SelectItem>
						<SelectItem value={REQUEST_TYPE.WITH_LINK}>
							Có link sản phẩm
						</SelectItem>
						<SelectItem value={REQUEST_TYPE.WITHOUT_LINK}>
							Không có link
						</SelectItem>
					</SelectContent>
				</Select>

				{/* Date Range Filter */}
				<Select
					value={filters.dateRange}
					onValueChange={(value) => updateFilter("dateRange", value)}
				>
					<SelectTrigger className="h-10 w-[130px] border-gray-300 focus:border-blue-500">
						<SelectValue placeholder="Thời gian" />
					</SelectTrigger>
					<SelectContent>
						<SelectItem value="all">Tất cả thời gian</SelectItem>
						<SelectItem value="today">Hôm nay</SelectItem>
						<SelectItem value="week">7 ngày qua</SelectItem>
						<SelectItem value="month">30 ngày qua</SelectItem>
					</SelectContent>
				</Select>

				{/* Divider */}
				<div className="h-6 w-px bg-gray-300"></div>

				{/* Sort Field */}
				<Select
					value={sort.field}
					onValueChange={(value) =>
						onSortChange({ ...sort, field: value })
					}
				>
					<SelectTrigger className="h-10 w-[130px] border-gray-300 focus:border-blue-500">
						<SelectValue />
					</SelectTrigger>
					<SelectContent>
						<SelectItem value="createdAt">Ngày tạo</SelectItem>
						<SelectItem value="updatedAt">Ngày cập nhật</SelectItem>
						<SelectItem value="totalProducts">
							Số sản phẩm
						</SelectItem>
						<SelectItem value="status">Trạng thái</SelectItem>
					</SelectContent>
				</Select>

				{/* Sort Direction */}
				<Button
					variant="outline"
					size="sm"
					onClick={toggleSortDirection}
					className="h-10 w-10 p-0 border-gray-300 hover:border-blue-500 hover:bg-blue-50"
				>
					{sort.direction === "asc" ? (
						<SortAsc className="h-4 w-4" />
					) : (
						<SortDesc className="h-4 w-4" />
					)}
				</Button>
			</div>
		</div>
	);
}
