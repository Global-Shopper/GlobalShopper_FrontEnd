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
	status,
	setStatus,
	sort,
	setSort,
}) {
	const updateFilter = (key, value) => {
		setStatus({ ...status, [key]: value });
	};
	return (
		<div className="bg-white border border-gray-200 rounded-lg p-2 shadow-sm">
			<div className="flex flex-wrap items-end gap-3">
				{/* Search */}
				<div className="flex-1 min-w-[280px]">
					<label className="block text-xs font-medium text-gray-700 mb-1">
						Tìm kiếm nhanh
					</label>
					<div className="relative">
						<Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
						<Input
							placeholder="Tìm kiếm theo mã, sản phẩm, cửa hàng..."
							value={status.search}
							onChange={(e) =>
								updateFilter("search", e.target.value)
							}
							className="pl-10 h-10 border-gray-300 focus:border-blue-500"
						/>
					</div>
				</div>

				{/* Status Filter */}
				<div>
					<label className="block text-xs font-medium text-gray-700 mb-1">
						Trạng thái
					</label>
					<Select
						value={status.status}
						onValueChange={(value) => updateFilter("status", value)}
					>
						<SelectTrigger className="h-10 w-[140px] border-gray-300 focus:border-blue-500">
							<SelectValue placeholder="Trạng thái" />
						</SelectTrigger>
						<SelectContent>
							<SelectItem value="all">Tất cả </SelectItem>
							<SelectItem value="DRAFT">Nháp</SelectItem>
							<SelectItem value="SENT">Đã gửi</SelectItem>
							<SelectItem value="CHECKING">Đang xử lý</SelectItem>
							<SelectItem value="INSUFFICIENT">
								Cập nhật thông tin
							</SelectItem>
							<SelectItem value="QUOTED">Đã báo giá</SelectItem>
							<SelectItem value="CONFIRMED">
								Đã xác nhận
							</SelectItem>
							<SelectItem value="CANCELLED">Đã hủy</SelectItem>
						</SelectContent>
					</Select>
				</div>

				{/* Type Filter */}
				<div>
					<label className="block text-xs font-medium text-gray-700 mb-1">
						Loại
					</label>
					<Select
						value={status.type}
						onValueChange={(value) => updateFilter("type", value)}
					>
						<SelectTrigger className="h-10 w-[140px] border-gray-300 focus:border-blue-500">
							<SelectValue placeholder="Loại yêu cầu" />
						</SelectTrigger>
						<SelectContent>
							<SelectItem value="all">Tất cả</SelectItem>
							<SelectItem value={REQUEST_TYPE.WITH_LINK}>
								Có link sản phẩm
							</SelectItem>
							<SelectItem value={REQUEST_TYPE.WITHOUT_LINK}>
								Không có link
							</SelectItem>
						</SelectContent>
					</Select>
				</div>

				{/* Date Range Filter */}
				<div>
					<label className="block text-xs font-medium text-gray-700 mb-1">
						Thời gian
					</label>
					<Select
						value={status.dateRange}
						onValueChange={(value) =>
							updateFilter("dateRange", value)
						}
					>
						<SelectTrigger className="h-10 w-[130px] border-gray-300 focus:border-blue-500">
							<SelectValue placeholder="Thời gian" />
						</SelectTrigger>
						<SelectContent>
							<SelectItem value="all">Tất cả</SelectItem>
							<SelectItem value="today">Hôm nay</SelectItem>
							<SelectItem value="week">7 ngày qua</SelectItem>
							<SelectItem value="month">30 ngày qua</SelectItem>
						</SelectContent>
					</Select>
				</div>

				{/* Divider */}
				<div className="h-6 w-px bg-gray-300 mb-2"></div>

				{/* Sort Section */}
				<div>
					<label className="block text-xs font-medium text-gray-700 mb-1">
						Sắp xếp
					</label>
					<div className="flex flex-col gap-2 min-w-[250px]">
						{/* {sort?.map((sortItem, idx) => {
							const [field, direction] = sortItem.split(",");
							return (
								<div key={idx} className="flex items-center gap-2">
									<Select
										value={field}
										onValueChange={(value) => {
											const newSort = [...sort];
											newSort[idx] = `${value},${direction}`;
											setSort(newSort);
										}}
									>
										<SelectTrigger className="h-10 w-[130px] border-gray-300 focus:border-blue-500">
											<SelectValue />
										</SelectTrigger>
										<SelectContent>
											<SelectItem value="createdAt">Ngày tạo</SelectItem>
											<SelectItem value="updatedAt">Ngày cập nhật</SelectItem>
											<SelectItem value="expiredAt">Ngày hết hạn</SelectItem>
											<SelectItem value="totalProducts">Số sản phẩm</SelectItem>
											<SelectItem value="status">Trạng thái</SelectItem>
										</SelectContent>
									</Select>
									<Button
										variant="outline"
										size="sm"
										onClick={() => {
											const newSort = [...sort];
											newSort[idx] = `${field},${direction === "asc" ? "desc" : "asc"}`;
											setSort(newSort);
										}}
										className="h-10 w-10 p-0 border-gray-300 hover:border-blue-500 hover:bg-blue-50"
									>
										{direction === "asc" ? (
											<SortAsc className="h-4 w-4" />
										) : (
											<SortDesc className="h-4 w-4" />
										)}
									</Button>
									{sort.length > 1 && (
										<Button
											variant="ghost"
											size="sm"
											onClick={() => {
												const newSort = sort.filter((_, i) => i !== idx);
												setSort(newSort);
											}}
											className="text-red-500"
										>
											X
										</Button>
									)}
								</div>
							);
						})} */}
						<Button
							variant="outline"
							size="sm"
							onClick={() => {
								// Add a new sort field, default to createdAt,desc
								setSort([...sort, "createdAt,desc"]);
							}}
							className="h-8 px-2 mt-1"
						>
							+ Thêm sắp xếp
						</Button>
					</div>
				</div>
			</div>
		</div>
	);
}
