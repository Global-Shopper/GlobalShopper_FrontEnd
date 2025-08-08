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
import { Tabs, TabsList, TabsTrigger, TabsContent } from "@/components/ui/tabs";
import { useGetPurchaseRequestQuery } from "@/services/gshopApi";
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
import { getStatusColor, getStatusText } from "@/utils/statusHandler";

const TABS = [
  { value: "assigned", label: "Yêu cầu đã nhận" },
  { value: "unassigned", label: "Yêu cầu đang chờ" },
];

const PAGE_SIZE_OPTIONS = [5, 10, 20, 50];

const AdPurchaseReqList = () => {
  const navigate = useNavigate();
  const [searchParams, setSearchParams] = useSearchParams();
  const [searchTerm, setSearchTerm] = useState("");
  const [page, setPage] = useURLSync(searchParams, setSearchParams, "page", "number", 1);
  const [size] = useURLSync(searchParams, setSearchParams, "size", "number", 10);
  const [type] = useURLSync(searchParams, setSearchParams, "type", "string", "assigned");
  const [status] = useURLSync(searchParams, setSearchParams, "status", "string", "ALL");
  const [sort] = useURLSync(searchParams, setSearchParams, "sort", "arraySort", ["createdAt,desc"]);
  const searchInputRef = useRef(null);

  const {
    data: requestsData,
    isFetching: isRequestLoading,
    isError: isRequestError,
  } = useGetPurchaseRequestQuery({
    page: page - 1,
    size,
    type,
    sort,
    ...(status !== "ALL" && { status }),
  });

  // Pagination controls
  const totalPages = requestsData?.totalPages || 1;

  const handleTabChange = (value) => {
    setSearchParams((searchParams) => {
      searchParams.set("status", "ALL");
      searchParams.set("page", 1);
      searchParams.set("type", value);
      return searchParams;
    });
  };

  const handlePageSizeChange = (value) => {
    setSearchParams((searchParams) => {
      searchParams.set("size", value);
      searchParams.set("page", 1);
      return searchParams;
    });
  };

  const handleStatusChange = (value) => {
    setSearchParams((searchParams) => {
      searchParams.set("page", 1);
      searchParams.set("status", value);
      return searchParams;
    });
  };

  // Handle search input change
  const handleSearchChange = (e) => {
    setSearchTerm(e.target.value);
  };

  // On blur or Enter, navigate to /purchase-request/{id}
  const handleSearchAction = () => {
    const value = searchInputRef.current?.value?.trim();
    if (value) {
      navigate(`purchase-request/${value}`);
    }
  };

    // Table rendering function
    const PurchaseRequestTable = ({requests, type}) => (
      <Table className="w-full shadow-md border border-gray-200">
        <TableHeader>
          <TableRow className="bg-blue-100 rounded-t-2xl">
            <TableHead className="w-20 text-gray-700 font-semibold text-sm rounded-tl-2xl bg-blue-100">
              Mã yêu cầu
            </TableHead>
            <TableHead className="text-gray-700 font-semibold text-sm bg-blue-100">
              Khách hàng
            </TableHead>
            <TableHead className="text-gray-700 font-semibold text-sm bg-blue-100">
              Cửa hàng
            </TableHead>
            <TableHead className="text-gray-700 font-semibold text-sm bg-blue-100">
              Nền tảng
            </TableHead>
            <TableHead className="text-gray-700 font-semibold text-sm bg-blue-100">
              Số điện thoại
            </TableHead>
            <TableHead className="text-gray-700 font-semibold text-sm bg-blue-100">
              Email
            </TableHead>
            {type === "assigned" && <TableHead className="text-gray-700 font-semibold text-sm bg-blue-100">
              Trạng thái
            </TableHead>}
            <TableHead className="text-center text-gray-700 font-semibold text-sm bg-blue-100">
              Ngày tạo
            </TableHead>
            <TableHead className="text-center text-gray-700 font-semibold text-sm rounded-tr-2xl bg-blue-100">
              Ngày hết hạn
            </TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {requests.map((request) => (
            <TableRow
              className="cursor-pointer transition hover:bg-blue-50/70 group"
              key={request.id}
              onClick={() => navigate(`purchase-request/${request.id}`)}
            >
              <TableCell className="font-medium text-xs w-20 py-3 group-hover:text-blue-700">
                <p>{request.id.length > 8 ? request.id.slice(0, 8) + "..." : request.id}</p>
              </TableCell>
              <TableCell className="font-medium py-3">
                {request.customer?.name || "-"}
              </TableCell>
              <TableCell className="py-3">
                {request.subRequests?.map((sub) => sub?.seller ? sub?.seller : sub?.contactInfo?.[0]?.split(":")[1])?.join(", ") || "-"}
              </TableCell>
              <TableCell className="py-3">
                {request.subRequests?.map((sub) => sub?.ecommercePlatform || "-")?.join(", ") || "-"}
              </TableCell>
              <TableCell className="py-3">{request.customer?.phone || "-"}</TableCell>
              <TableCell className="py-3">{request.customer?.email || "-"}</TableCell>
              {type === "assigned" && <TableCell className="py-3">
                <span
                  className={`px-2 py-1 rounded-full text-xs font-medium ${getStatusColor(
                    request.status
                  )} group-hover:shadow`}
                >
                  {getStatusText(request.status)}{" "}{(request?.status === "QUOTED") ? `(${request?.itemsHasQuotation}/${request?.totalItems})` : ""}
                </span>
              </TableCell>}
              <TableCell className="text-center py-3">
                {request.createdAt
                  ? new Date(request.createdAt).toLocaleDateString("vi-VN")
                  : "-"}
              </TableCell>
              <TableCell className="text-center py-3">
                {request.expiredAt
                  ? new Date(request.expiredAt).toLocaleDateString("vi-VN")
                  : "-"}
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    );

  return (
    <div className="w-full px-2 md:px-6 flex flex-col flex-1 min-h-screen">
      <Tabs
        value={type}
        onValueChange={handleTabChange}
        className="flex-1 flex flex-col"
      >
        <div className="flex flex-col gap-4 mb-6">
          <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4 bg-white rounded-xl shadow p-4">
            <TabsList className="rounded-lg bg-gray-100">
              {TABS.map((t) => (
                <TabsTrigger
                  key={t.value}
                  value={t.value}
                  className="rounded-lg data-[state=active]:bg-blue-600 data-[state=active]:text-white text-gray-700 font-semibold"
                >
                  {t.label}
                </TabsTrigger>
              ))}
            </TabsList>
            <div className="flex items-center gap-2">
              <label
                htmlFor="pageSize"
                className="text-sm text-gray-600 font-medium"
              >
                Số dòng/trang:
              </label>
              <Select value={String(size)} onValueChange={handlePageSizeChange}>
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
              {type === "assigned" && <>
                <label
                  htmlFor="statusFilter"
                  className="text-sm text-gray-600 font-medium ml-4"
                >
                  Trạng thái:
                </label>
                <Select
                  value={status || ""}
                  onValueChange={(value) => handleStatusChange(value)}
                >
                  <SelectTrigger
                    id="statusFilter"
                    className="w-40 rounded-lg border-gray-300 focus:ring-2 focus:ring-blue-500"
                  >
                    <SelectValue placeholder="Tất cả" />
                  </SelectTrigger>
                  <SelectContent className="rounded-lg shadow">
                    <SelectItem value="ALL" className="rounded-lg">Tất cả</SelectItem>
                    <SelectItem value="CHECKING" className="rounded-lg">Đang xử lý</SelectItem>
                    <SelectItem value="QUOTED" className="rounded-lg">Đã báo giá</SelectItem>
                    <SelectItem value="CANCELLED" className="rounded-lg">Đã hủy</SelectItem>
                    <SelectItem value="INSUFFICIENT" className="rounded-lg">Chờ cập nhật lại</SelectItem>
                  </SelectContent>
                </Select>
              </>}
            </div>
          </div>

          {/* Search Bar */}
          <div className="relative max-w-md mb-4">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-5 w-5 text-gray-400" />
            <Input
              ref={searchInputRef}
              type="text"
              placeholder="Tìm kiếm theo ID"
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
          <TabsContent value="assigned">
            {isRequestLoading ? (
              <PageLoading />
            ) : isRequestError ? (
              <PageError />
            ) : (
              <PurchaseRequestTable requests={requestsData?.content || []} type="assigned" />
            )}
          </TabsContent>
          <TabsContent value="unassigned">
            {isRequestLoading ? (
              <PageLoading disEnableFullScreen />
            ) : isRequestError ? (
              <PageError />
            ) : (
              <PurchaseRequestTable requests={requestsData?.content || []} type="unassigned" />
            )}
          </TabsContent>
        </div>
        <PaginationBar totalPages={totalPages} page={page} setPage={setPage} />
      </Tabs>
    </div>
  );
};

export default AdPurchaseReqList;