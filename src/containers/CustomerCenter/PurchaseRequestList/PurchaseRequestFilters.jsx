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

export default function PurchaseRequestFilters({
	status,
	setStatus,
	sort,
	setSort,
}) {

	return (
		<div className="bg-white border border-gray-200 rounded-lg p-2 shadow-sm">
			<div className="flex flex-wrap items-end gap-3">
				{/* Status Filter */}
				<div>
					<label className="block text-xs font-medium text-gray-700 mb-1">
						Trạng thái
					</label>
					<Select
						value={status}
						onValueChange={setStatus}
					>
						<SelectTrigger className="h-10 w-[140px] border-gray-300 focus:border-blue-500">
							<SelectValue placeholder="Trạng thái" />
						</SelectTrigger>
						<SelectContent>
							<SelectItem value="all">Tất cả</SelectItem>
							<SelectItem value="SENT">Đã gửi</SelectItem>
							<SelectItem value="CHECKING">Đang xử lý</SelectItem>
							<SelectItem value="QUOTED">Đã báo giá</SelectItem>
							<SelectItem value="CANCELLED">Đã hủy</SelectItem>
							<SelectItem value="INSUFFICIENT">Thiếu thông tin</SelectItem>
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
					<div className="flex gap-2 min-w-[250px]">
						{sort.map((sortItem, idx) => {
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
											<SelectItem value="expiredAt">Ngày hết hạn</SelectItem>
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
								</div>
							);
						})}
					</div>
				</div>
			</div>
		</div>
	);
}
