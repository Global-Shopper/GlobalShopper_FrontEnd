import { useState } from "react"
import { useNavigate } from "react-router-dom"
import { Plus, ShoppingCart } from "lucide-react"
import RequestCard from "@/components/RequestCard"
import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { 
  Pagination, 
  PaginationContent, 
  PaginationItem, 
  PaginationNext, 
  PaginationPrevious 
} from "@/components/ui/pagination"
import { useGetPurchaseRequestQuery } from "@/services/gshopApi"
import { generatePaginationItems, getPaginationInfo, shouldShowPagination } from "@/utils/Pagination"

export default function RequestDashboard() {
  const navigate = useNavigate()
  const [currentPage, setCurrentPage] = useState(0)
  const [pageSize] = useState(3)
  
  // Get purchase requests with pagination
  const { data: purchaseRequestsData, isLoading: isRequestLoading, isError: isRequestError } = useGetPurchaseRequestQuery({
    page: currentPage,
    size: pageSize,
    type: "assigned"
  })

  // Extract data from API response
  const requests = purchaseRequestsData?.content || []
  const pagination = purchaseRequestsData?.pageable || {}
  const totalPages = purchaseRequestsData?.totalPages || 0
  const totalElements = purchaseRequestsData?.totalElements || 0

  // Get pagination info
  const paginationInfo = getPaginationInfo(pagination, totalPages, totalElements)
  const handleCreateRequest = () => {
    navigate("/account-center/create-request")
  }

  const handlePageChange = (page) => {
    setCurrentPage(page)
  }

  // Loading state
  if (isRequestLoading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-indigo-50">
        <div className="max-w-7xl mx-auto p-6 space-y-8">
          <div className="animate-pulse space-y-4">
            <div className="h-8 bg-gray-200 rounded w-1/3"></div>
            <div className="h-4 bg-gray-200 rounded w-1/2"></div>
            <div className="grid grid-cols-1 lg:grid-cols-2 xl:grid-cols-3 gap-6">
              {[...Array(6)].map((_, i) => (
                <div key={i} className="h-64 bg-gray-200 rounded-lg"></div>
              ))}
            </div>
          </div>
        </div>
      </div>
    )
  }

  // Error state
  if (isRequestError) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-indigo-50">
        <div className="max-w-7xl mx-auto p-6">
          <Card className="shadow-sm">
            <CardContent className="p-12 text-center">
              <div className="w-20 h-20 bg-red-100 rounded-full flex items-center justify-center mx-auto mb-6">
                <ShoppingCart className="h-10 w-10 text-red-400" />
              </div>
              <h3 className="text-xl font-medium text-gray-900 mb-3">Có lỗi xảy ra</h3>
              <p className="text-gray-600 mb-6 max-w-md mx-auto">
                Không thể tải danh sách yêu cầu mua hàng. Vui lòng thử lại sau.
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
    )
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-indigo-50">
      <div className="max-w-7xl mx-auto p-6 space-y-8">
        {/* Header */}
        <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-6">
          <div className="space-y-2">
            <h1 className="text-3xl font-bold text-gray-900">
              Danh sách yêu cầu mua hàng ({paginationInfo.currentPage + 1}/{paginationInfo.totalPages})
            </h1>
            <p className="text-gray-600">Theo dõi tất cả yêu cầu mua hàng của bạn</p>
          </div>
          <Button
            onClick={handleCreateRequest}
            className="bg-gradient-to-r from-blue-600 to-blue-700 hover:from-blue-700 hover:to-blue-800 h-12 px-6 shadow-lg hover:shadow-xl transition-all duration-200"
          >
            <Plus className="h-5 w-5 mr-2" />
            Tạo yêu cầu mới
          </Button>
        </div>

        {/* Request List */}
        <div className="space-y-4">
          {requests.length === 0 ? (
            <Card className="shadow-sm">
              <CardContent className="p-12 text-center">
                <div className="w-20 h-20 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-6">
                  <ShoppingCart className="h-10 w-10 text-gray-400" />
                </div>
                <h3 className="text-xl font-medium text-gray-900 mb-3">Không có yêu cầu nào</h3>
                <p className="text-gray-600 mb-6 max-w-md mx-auto">
                  Bạn chưa có yêu cầu mua hàng nào. Hãy tạo yêu cầu đầu tiên để bắt đầu!
                </p>
                <Button
                  onClick={handleCreateRequest}
                  className="bg-gradient-to-r from-blue-600 to-blue-700 hover:from-blue-700 hover:to-blue-800 h-12 px-6 shadow-lg hover:shadow-xl transition-all duration-200"
                >
                  <Plus className="h-5 w-5 mr-2" />
                  Tạo yêu cầu mới
                </Button>
              </CardContent>
            </Card>
          ) : (
            <>
              <div className="grid grid-cols-1 lg:grid-cols-2 xl:grid-cols-3 gap-6">
                {requests.map((request) => (
                  <RequestCard key={request.id} request={request} />
                ))}
              </div>

              {/* Pagination */}
              {shouldShowPagination(totalPages) && (
                <div className="flex justify-center mt-8">
                  <Pagination>
                    <PaginationContent>
                      <PaginationItem>
                        <PaginationPrevious 
                          onClick={() => handlePageChange(Math.max(0, currentPage - 1))}
                          className={currentPage === 0 ? "pointer-events-none opacity-50" : "cursor-pointer"}
                        />
                      </PaginationItem>
                      
                      {generatePaginationItems(totalPages, currentPage, handlePageChange)}
                      
                      <PaginationItem>
                        <PaginationNext 
                          onClick={() => handlePageChange(Math.min(totalPages - 1, currentPage + 1))}
                          className={currentPage === totalPages - 1 ? "pointer-events-none opacity-50" : "cursor-pointer"}
                        />
                      </PaginationItem>
                    </PaginationContent>
                  </Pagination>
                </div>
              )}
            </>
          )}
        </div>
      </div>
    </div>
  )
}
