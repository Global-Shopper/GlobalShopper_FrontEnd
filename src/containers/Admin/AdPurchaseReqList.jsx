import React, { useState } from 'react'
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table"
import { Button } from "@/components/ui/button"
import { Eye, PackageCheck, Receipt } from "lucide-react"
import { Tabs, TabsList, TabsTrigger, TabsContent } from "@/components/ui/tabs"
import { useCheckingPurchaseRequestMutation, useGetPurchaseRequestQuery } from '@/services/gshopApi'
import {
  Pagination,
  PaginationContent,
  PaginationItem,
  PaginationNext,
  PaginationPrevious
} from "@/components/ui/pagination"
import { generatePaginationItems, shouldShowPagination } from "@/utils/Pagination"
import { Select, SelectTrigger, SelectContent, SelectItem, SelectValue } from "@/components/ui/select"
import PageLoading from "@/components/PageLoading";
import { toast } from 'sonner'

const TABS = [
  { value: "assigned", label: "Yêu cầu đã nhận" },
  { value: "unassigned", label: "Yêu cầu đang chờ" },
]

const PAGE_SIZE_OPTIONS = [5, 10, 20, 50]

const AdPurchaseReqList = () => {
  const [tab, setTab] = useState("unassigned")
  const [currentPage, setCurrentPage] = useState(1)
  const [pageSize, setPageSize] = useState(10)

  const { data: requestsData, isFetching: isRequestLoading, isError: isRequestError } = useGetPurchaseRequestQuery({
    page: currentPage - 1,
    size: pageSize,
    type: tab
  })
  const [checking, { isLoading: isCheckLoading }] = useCheckingPurchaseRequestMutation()

  const handleChecking = async (requestId) => {
    try {
      await checking(requestId).unwrap()
        .then(() => {
          toast.success("Yêu cầu đã được kiểm tra thành công.")
        })
    } catch (error) {
      toast.error("Lỗi khi kiểm tra yêu cầu: " + (error?.data?.message || "Vui lòng thử lại."))
    }
  }

  // Helper functions
  const getStatusColor = (status) => {
    switch (status) {
      case 'SENT':
        return 'bg-blue-100 text-blue-800'
      case 'PROCESSING':
        return 'bg-yellow-100 text-yellow-800'
      case 'QUOTED':
        return 'bg-green-100 text-green-800'
      case 'CANCELLED':
        return 'bg-red-100 text-red-800'
      default:
        return 'bg-gray-100 text-gray-800'
    }
  }

  // Table rendering function
  const renderTable = (requests, assigned) => (
    <Table>
      <TableHeader>
        <TableRow>
          <TableHead>Tên Khách Hàng</TableHead>
          <TableHead>Số Điện Thoại</TableHead>
          <TableHead>Email</TableHead>
          <TableHead>Địa Chỉ Giao Hàng</TableHead>
          <TableHead>Trạng Thái</TableHead>
          <TableHead className="text-center">Số Sản Phẩm</TableHead>
          <TableHead className="text-center">Ngày tạo yêu cầu</TableHead>
          <TableHead className="text-center">Ngày hết hạn</TableHead>
          <TableHead className="text-center" colSpan={2}>Tiện ích</TableHead>
        </TableRow>
      </TableHeader>
      <TableBody>
        {requests.map((request) => (
          <TableRow key={request.id}>
            <TableCell className="font-medium">{request.customer?.name}</TableCell>
            <TableCell>{request.customer?.phone}</TableCell>
            <TableCell>{request.customer?.email}</TableCell>
            <TableCell className="max-w-[200px] truncate" title={request.shippingAddress?.location}>
              {request.shippingAddress?.location}
            </TableCell>
            <TableCell>
              <span className={`px-2 py-1 rounded-full text-xs font-medium ${getStatusColor(request.status)}`}>
                {request.status}
              </span>
            </TableCell>
            <TableCell className="text-center">
              <span className="text-sm font-medium">
                {request.requestItems?.length || 0}
              </span>
            </TableCell>
            <TableCell className="text-center">
              {request.createdAt
                ? new Date(Number(request.createdAt)).toLocaleDateString("vi-VN")
                : "-"}
            </TableCell>
            <TableCell className="text-center">
              {request.expiredAt
                ? new Date(Number(request.expiredAt)).toLocaleDateString("vi-VN")
                : "-"}
            </TableCell>
            <TableCell className="text-center" colSpan={2}>
              <div className="flex items-center justify-center gap-2">
                <Button
                  variant="ghost"
                  size="sm"
                  className="h-8 w-8 p-0"
                  title="Xem chi tiết"
                // onClick={() => handleViewDetails(request)}
                >
                  <Eye className="h-4 w-4" />
                  <span className="sr-only">Xem chi tiết</span>
                </Button>
                {assigned ? <Button
                  variant="ghost"
                  size="sm"
                  loading={isCheckLoading}
                  onClick={() => handleChecking(request.id)}
                  title="Nhận yêu cầu"
                  className="h-8 w-8 p-0"
                >
                  <Receipt className="h-4 w-4" />
                  <span className="sr-only">Nhận yêu cầu</span>
                </Button> :
                <Button
                  variant="ghost"
                  size="sm"
                  loading={isCheckLoading}
                  onClick={() => handleChecking(request.id)}
                  title="Nhận yêu cầu"
                  className="h-8 w-8 p-0"
                >
                  <PackageCheck className="h-4 w-4" />
                  <span className="sr-only">Tạo báo giá</span>
                </Button>
                }
              </div>
            </TableCell>
          </TableRow>
        ))}
      </TableBody>
    </Table>
  )

  // Pagination controls
  const totalPages = requestsData?.totalPages || 1
  const pageFromApi = requestsData?.number ?? (currentPage - 1)
  const currentPageDisplay = pageFromApi + 1

  const handleTabChange = (value) => {
    setTab(value)
    setCurrentPage(1) // Reset to first page on tab change
  }

  // When page size changes, reset to first page
  const handlePageSizeChange = (value) => {
    setPageSize(Number(value))
    setCurrentPage(1)
  }

  return (
    <div className="p-6">
      <Tabs value={tab} onValueChange={handleTabChange}>
        <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-2 mb-6">
          <TabsList>
            {TABS.map(t => (
              <TabsTrigger key={t.value} value={t.value}>
                {t.label}
              </TabsTrigger>
            ))}
          </TabsList>
          <div className="flex items-center gap-2">
            <label htmlFor="pageSize" className="text-sm">Số dòng/trang:</label>
            <Select value={String(pageSize)} onValueChange={handlePageSizeChange}>
              <SelectTrigger id="pageSize" className="w-24">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                {PAGE_SIZE_OPTIONS.map(size => (
                  <SelectItem key={size} value={String(size)}>{size}</SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
        </div>
        <TabsContent value="assigned">
          {isRequestLoading ? (
            <PageLoading />
          ) : isRequestError ? (
            <div>Lỗi khi tải dữ liệu.</div>
          ) : (
            <>
              {renderTable(requestsData?.content || [], true)}
              {shouldShowPagination(totalPages) && (
                <div className="flex justify-center mt-8">
                  <Pagination>
                    <PaginationContent>
                      <PaginationItem>
                        <PaginationPrevious
                          onClick={() => setCurrentPage(Math.max(1, currentPageDisplay - 1))}
                          className={currentPageDisplay === 1 ? "pointer-events-none opacity-50" : "cursor-pointer"}
                        />
                      </PaginationItem>

                      {generatePaginationItems(totalPages, currentPageDisplay - 1, (page) => setCurrentPage(page + 1))}

                      <PaginationItem>
                        <PaginationNext
                          onClick={() => setCurrentPage(Math.min(totalPages, currentPageDisplay + 1))}
                          className={currentPageDisplay === totalPages ? "pointer-events-none opacity-50" : "cursor-pointer"}
                        />
                      </PaginationItem>
                    </PaginationContent>
                  </Pagination>
                </div>
              )}
            </>
          )}
        </TabsContent>
        <TabsContent value="unassigned" className="">
          {isRequestLoading ? (
            <PageLoading disEnableFullScreen />
          ) : isRequestError ? (
            <div>Lỗi khi tải dữ liệu.</div>
          ) : (
            <>
              {renderTable(requestsData?.content || [])}
              {shouldShowPagination(totalPages) && (
                <div className="flex justify-center mt-8">
                  <Pagination>
                    <PaginationContent>
                      <PaginationItem>
                        <PaginationPrevious
                          onClick={() => setCurrentPage(Math.max(1, currentPageDisplay - 1))}
                          className={currentPageDisplay === 1 ? "pointer-events-none opacity-50" : "cursor-pointer"}
                        />
                      </PaginationItem>

                      {generatePaginationItems(totalPages, currentPageDisplay - 1, (page) => setCurrentPage(page + 1))}

                      <PaginationItem>
                        <PaginationNext
                          onClick={() => setCurrentPage(Math.min(totalPages, currentPageDisplay + 1))}
                          className={currentPageDisplay === totalPages ? "pointer-events-none opacity-50" : "cursor-pointer"}
                        />
                      </PaginationItem>
                    </PaginationContent>
                  </Pagination>
                </div>
              )}
            </>
          )}
        </TabsContent>
      </Tabs>
    </div>
  )
}

export default AdPurchaseReqList