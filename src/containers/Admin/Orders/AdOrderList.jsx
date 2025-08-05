import React, { useState, useRef } from "react";
import { useNavigate, useSearchParams } from "react-router-dom";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Search } from "lucide-react";
import {
  Tabs,
  TabsList,
  TabsTrigger,
  TabsContent,
} from "@/components/ui/tabs";
import { PaginationBar } from "@/utils/Pagination";
import {
  Select,
  SelectTrigger,
  SelectContent,
  SelectItem,
  SelectValue,
} from "@/components/ui/select";
import { Input } from "@/components/ui/input";
import PageLoading from "@/components/PageLoading";
import PageError from "@/components/PageError";
import { useURLSync } from "@/hooks/useURLSync";
import { useGetAllOrdersQuery } from "@/services/gshopApi";
import { formatCurrency, formatVNDWithoutSymbol } from "@/utils/formatCurrency";
import { getStatusColor, getStatusText } from "@/utils/statusHandler";

const STATUS_OPTIONS = [
  { value: "ALL", label: "Tất cả" },
  { value: "ORDER_REQUESTED", label: "Đang yêu cầu" },
  { value: "PURCHASED", label: "Đã mua" },
  { value: "IN_TRANSIT", label: "Đang vận chuyển" },
  { value: "ARRIVED_IN_DESTINATION", label: "Đã đến nơi" },
  { value: "DELIVERED", label: "Đã giao hàng" },
  { value: "CANCELED", label: "Đã hủy" },
];

const PAGE_SIZE_OPTIONS = [5, 10, 20, 50];

const AdOrderList = () => {
  const navigate = useNavigate();
  const [searchParams, setSearchParams] = useSearchParams();
  const [searchTerm, setSearchTerm] = useState("");
  const [page, setPage] = useURLSync(searchParams, setSearchParams, "page", "number", 1);
  const [size, setSize] = useURLSync(searchParams, setSearchParams, "size", "number", 10);
  const [status, setStatus] = useURLSync(searchParams, setSearchParams, "status", "string", "ALL");
  // const [sort] = useURLSync(searchParams, setSearchParams, "sort", "array", ["createdAt,desc"]);
  const searchInputRef = useRef(null);

  // TODO: Replace DUMMY_DATA with API call
  const { data: ordersData, isLoading, isError } = useGetAllOrdersQuery({ page: page - 1, size, ...(status !== "ALL" && { status }) });

  // Table rendering function
  const renderTable = (orders) => (
    <Table className="w-full rounded-2xl shadow-md border border-gray-200">
      <TableHeader>
        <TableRow className="bg-blue-100 rounded-t-2xl">
          <TableHead className="w-24 text-gray-700 font-semibold text-sm rounded-tl-2xl bg-blue-100">
            Mã đơn hàng
          </TableHead>
          <TableHead className="text-gray-700 font-semibold text-sm bg-blue-100">
            Khách hàng
          </TableHead>
          <TableHead className="text-gray-700 font-semibold text-sm bg-blue-100">
            Cửa hàng
          </TableHead>
          <TableHead className="text-gray-700 font-semibold text-sm bg-blue-100">
            Trạng thái
          </TableHead>
          <TableHead className="text-gray-700 font-semibold text-sm bg-blue-100">
            Tổng tiền
          </TableHead>
          <TableHead className="text-center text-gray-700 font-semibold text-sm rounded-tr-2xl bg-blue-100">
            Ngày tạo
          </TableHead>
        </TableRow>
      </TableHeader>
      <TableBody>
        {orders.map((order) => (
          <TableRow
            className="cursor-pointer transition hover:bg-blue-50/70 group"
            key={order.id}
            onClick={() => navigate(`/admin/orders/${order.id}`)}
          >
            <TableCell className="font-medium text-xs w-24 py-3 group-hover:text-blue-700">
              <p>{order.orderCode || order.trackingNumber || order.id}</p>
            </TableCell>
            <TableCell className="font-medium py-3">
              {order.customer?.name || "-"}
            </TableCell>
            <TableCell className="py-3">
              {order.contactInfo?.find((info) => info.startsWith("Tên cửa hàng:"))?.split(": ")[1] || "-"}
            </TableCell>
            <TableCell className="py-3">
              <span
                className={`px-2 py-1 rounded-full text-xs font-medium ${getStatusColor(
                  order.status
                )} group-hover:shadow`}
              >
                {getStatusText(order.status)}
              </span>
            </TableCell>
            <TableCell className="py-3">
              {formatVNDWithoutSymbol(order.totalPrice)}
            </TableCell>
            <TableCell className="text-center py-3">
              {/* createdAt will be added in future API; for now, show null */}
              {null}
            </TableCell>
          </TableRow>
        ))}
      </TableBody>
    </Table>
  );

  // Pagination controls
  const totalPages = ordersData?.totalPages || 1;

  // Handle search input change
  const handleSearchChange = (e) => {
    setSearchTerm(e.target.value);
  };

  // On blur or Enter, do nothing for now
  const handleSearchAction = () => {
    // Not implemented yet
  };

  return (
    <div className="w-full px-2 md:px-6 flex flex-col flex-1 min-h-screen">
      <div className="flex flex-col gap-4 mb-6">
        <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4 bg-white rounded-xl shadow p-4">
          <div className="flex items-center gap-2">
            <label
              htmlFor="pageSize"
              className="text-sm text-gray-600 font-medium"
            >
              Số dòng/trang:
            </label>
            <Select value={String(size)} onValueChange={(value) => setSize(Number(value))}>
              <SelectTrigger
                id="pageSize"
                className="w-24 rounded-lg border-gray-300 focus:ring-2 focus:ring-blue-500"
              >
                <SelectValue />
              </SelectTrigger>
              <SelectContent className="rounded-lg shadow">
                {PAGE_SIZE_OPTIONS.map((size) => (
                  <SelectItem
                    key={size}
                    value={String(size)}
                    className="rounded-lg"
                  >
                    {size}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
            {/* Status filter dropdown */}
            <label
              htmlFor="statusFilter"
              className="text-sm text-gray-600 font-medium ml-4"
            >
              Trạng thái:
            </label>
            <Select
              value={status || ""}
              onValueChange={(value) => setStatus(value)}
            >
              <SelectTrigger
                id="statusFilter"
                className="w-40 rounded-lg border-gray-300 focus:ring-2 focus:ring-blue-500"
              >
                <SelectValue placeholder="Tất cả" />
              </SelectTrigger>
              <SelectContent className="rounded-lg shadow">
                {STATUS_OPTIONS.map((opt) => (
                  <SelectItem key={opt.value} value={opt.value} className="rounded-lg">
                    {opt.label}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

        </div>
          {/* Search Bar */}
          <div className="relative max-w-md mb-4">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-5 w-5 text-gray-400" />
            <Input
              ref={searchInputRef}
              type="text"
              placeholder="Tìm kiếm theo mã đơn hoặc tracking"
              value={searchTerm}
              onChange={handleSearchChange}
              onBlur={handleSearchAction}
              onKeyDown={(e) => {
                if (e.key === "Enter") {
                  handleSearchAction();
                }
              }}
              className="pl-10 rounded-lg border-gray-300 focus:ring-2 focus:ring-blue-500 py-2 text-base"
            />
          </div>
      </div>
      <div className="flex-1 flex flex-col">
        {isLoading ? (
          <PageLoading />
        ) : isError ? (
          <PageError />
        ) : (
          renderTable(ordersData?.content || [])
        )}
      </div>
      <PaginationBar totalPages={totalPages} page={page} setPage={setPage} />
    </div>
  );
};

export default AdOrderList;