import { Search, SortAsc, SortDesc } from "lucide-react"
import { REQUEST_STATUS, REQUEST_TYPE } from "@/const/purchaseReqStatus"
import { Input } from "@/components/ui/input"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Button } from "@/components/ui/button"

export default function RequestFilters({ filters, onFiltersChange, sort, onSortChange }) {
  const updateFilter = (key, value) => {
    onFiltersChange({ ...filters, [key]: value })
  }

  const toggleSortDirection = () => {
    onSortChange({
      ...sort,
      direction: sort.direction === "asc" ? "desc" : "asc",
    })
  }

  return (
    <div className="space-y-4">
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        {/* Search */}
        <div className="relative">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
          <Input
            placeholder="Tìm kiếm theo mã, sản phẩm, cửa hàng..."
            value={filters.search}
            onChange={(e) => updateFilter("search", e.target.value)}
            className="pl-10 h-10"
          />
        </div>

        {/* Status Filter */}
        <Select value={filters.status} onValueChange={(value) => updateFilter("status", value)}>
          <SelectTrigger className="h-10">
            <SelectValue placeholder="Trạng thái" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">Tất cả trạng thái</SelectItem>
            <SelectItem value={REQUEST_STATUS.DRAFT}>Nháp</SelectItem>
            <SelectItem value={REQUEST_STATUS.SENT}>Đã gửi</SelectItem>
            <SelectItem value={REQUEST_STATUS.PROCESSING}>Đang xử lý</SelectItem>
            <SelectItem value={REQUEST_STATUS.COMPLETED}>Hoàn thành</SelectItem>
            <SelectItem value={REQUEST_STATUS.CANCELLED}>Đã hủy</SelectItem>
          </SelectContent>
        </Select>

        {/* Type Filter */}
        <Select value={filters.type} onValueChange={(value) => updateFilter("type", value)}>
          <SelectTrigger className="h-10">
            <SelectValue placeholder="Loại yêu cầu" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">Tất cả loại</SelectItem>
            <SelectItem value={REQUEST_TYPE.WITH_LINK}>Có link sản phẩm</SelectItem>
            <SelectItem value={REQUEST_TYPE.WITHOUT_LINK}>Không có link</SelectItem>
          </SelectContent>
        </Select>

        {/* Date Range Filter */}
        <Select value={filters.dateRange} onValueChange={(value) => updateFilter("dateRange", value)}>
          <SelectTrigger className="h-10">
            <SelectValue placeholder="Thời gian" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">Tất cả thời gian</SelectItem>
            <SelectItem value="today">Hôm nay</SelectItem>
            <SelectItem value="week">7 ngày qua</SelectItem>
            <SelectItem value="month">30 ngày qua</SelectItem>
          </SelectContent>
        </Select>
      </div>

      {/* Sort Controls */}
      <div className="flex items-center gap-4">
        <span className="text-sm font-medium text-gray-700">Sắp xếp theo:</span>
        <Select value={sort.field} onValueChange={(value) => onSortChange({ ...sort, field: value })}>
          <SelectTrigger className="w-40 h-9">
            <SelectValue />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="createdAt">Ngày tạo</SelectItem>
            <SelectItem value="updatedAt">Ngày cập nhật</SelectItem>
            <SelectItem value="totalProducts">Số sản phẩm</SelectItem>
            <SelectItem value="status">Trạng thái</SelectItem>
          </SelectContent>
        </Select>
        <Button variant="outline" size="sm" onClick={toggleSortDirection} className="h-9 bg-transparent">
          {sort.direction === "asc" ? <SortAsc className="h-4 w-4" /> : <SortDesc className="h-4 w-4" />}
          {sort.direction === "asc" ? "Tăng dần" : "Giảm dần"}
        </Button>
      </div>
    </div>
  )
}
