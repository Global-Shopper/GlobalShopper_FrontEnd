import { useState, useMemo } from "react"
import { Link, useNavigate } from "react-router-dom"
import { Plus, ShoppingCart } from "lucide-react"
import RequestCard from "@/components/RequestCard"
import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { REQUEST_STATUS, REQUEST_TYPE, EXTRACTION_STATUS } from "@/const/purchaseReqStatus"

// Mock data for demonstration
const mockRequests = [
  {
    id: "REQ_001",
    type: REQUEST_TYPE.WITH_LINK,
    products: [
      {
        id: "p1",
        name: "Áo thun nam Nike Dri-FIT",
        image: "/placeholder.svg?height=100&width=100",
        quantity: 2,
        color: "Đen",
        size: "L",
        description: "Áo thun thể thao cao cấp",
        link: "https://amazon.com/product/123",
        extractionStatus: EXTRACTION_STATUS.SUCCESS,
      },
    ],
    contactInfo: { email: "user@example.com", phone: "0123456789" },
    shippingAddressId: "addr_1",
    status: REQUEST_STATUS.PROCESSING,
    createdAt: new Date("2024-01-15"),
    updatedAt: new Date("2024-01-16"),
    totalProducts: 1,
    estimatedValue: "1,700,000 VNĐ",
  },
  {
    id: "REQ_002",
    type: REQUEST_TYPE.WITHOUT_LINK,
    shopInfo: {
      name: "Nike Store Saigon Centre",
      address: "65 Lê Lợi, Quận 1, TP.HCM",
      email: "info@nike.com.vn",
      website: "https://nike.com.vn",
    },
    products: [
      {
        id: "p2",
        name: "Giày chạy bộ Nike Air Max",
        image: "/placeholder.svg?height=100&width=100",
        quantity: 1,
        color: "Trắng",
        size: "42",
        description: "Giày chạy bộ chuyên nghiệp",
        extractionStatus: EXTRACTION_STATUS.MANUAL,
      },
    ],
    contactInfo: { email: "customer@gmail.com", phone: "0987654321" },
    shippingAddressId: "addr_2",
    status: REQUEST_STATUS.SENT,
    createdAt: new Date("2024-01-10"),
    updatedAt: new Date("2024-01-10"),
    totalProducts: 1,
    estimatedValue: "2,500,000 VNĐ",
  },
  {
    id: "REQ_003",
    type: REQUEST_TYPE.WITH_LINK,
    products: [
      {
        id: "p3",
        name: "Áo khoác Adidas",
        image: "/placeholder.svg?height=100&width=100",
        quantity: 1,
        color: "Xanh navy",
        size: "M",
        description: "Áo khoác thể thao",
        link: "https://ebay.com/product/456",
        extractionStatus: EXTRACTION_STATUS.SUCCESS,
      },
      {
        id: "p4",
        name: "Quần short thể thao",
        image: "/placeholder.svg?height=100&width=100",
        quantity: 2,
        color: "Đen",
        size: "L",
        description: "Quần short tập gym",
        link: "https://walmart.com/product/789",
        extractionStatus: EXTRACTION_STATUS.SUCCESS,
      },
    ],
    contactInfo: { email: "sports@email.com", phone: "0111222333" },
    shippingAddressId: "addr_3",
    status: REQUEST_STATUS.COMPLETED,
    createdAt: new Date("2024-01-05"),
    updatedAt: new Date("2024-01-20"),
    totalProducts: 2,
    estimatedValue: "2,100,000 VNĐ",
  },
]

export default function RequestDashboard() {
  const navigate = useNavigate()
  const [requests] = useState(mockRequests)
  const [filters, setFilters] = useState({
    status: "all",
    type: "all",
    dateRange: "all",
    search: "",
  })
  const [sort, setSort] = useState({
    field: "createdAt",
    direction: "desc",
  })

  const filteredAndSortedRequests = useMemo(() => {
    const filtered = requests.filter((request) => {
      // Status filter
      if (filters.status !== "all" && request.status !== filters.status) return false

      // Type filter
      if (filters.type !== "all" && request.type !== filters.type) return false

      // Search filter
      if (filters.search) {
        const searchLower = filters.search.toLowerCase()
        const matchesId = request.id.toLowerCase().includes(searchLower)
        const matchesProduct = request.products.some((p) => p.name.toLowerCase().includes(searchLower))
        const matchesShop = request.shopInfo?.name.toLowerCase().includes(searchLower)
        if (!matchesId && !matchesProduct && !matchesShop) return false
      }

      // Date range filter
      if (filters.dateRange !== "all") {
        const now = new Date()
        const requestDate = new Date(request.createdAt)
        const diffTime = now.getTime() - requestDate.getTime()
        const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24))

        switch (filters.dateRange) {
          case "today":
            if (diffDays > 1) return false
            break
          case "week":
            if (diffDays > 7) return false
            break
          case "month":
            if (diffDays > 30) return false
            break
        }
      }

      return true
    })

    // Sort
    filtered.sort((a, b) => {
      let aValue = a[sort.field]
      let bValue = b[sort.field]

      if (sort.field === "createdAt" || sort.field === "updatedAt") {
        aValue = new Date(aValue).getTime()
        bValue = new Date(bValue).getTime()
      }

      if (sort.direction === "asc") {
        return aValue > bValue ? 1 : -1
      } else {
        return aValue < bValue ? 1 : -1
      }
    })

    return filtered
  }, [requests, filters, sort])

  const stats = useMemo(() => {
    return {
      total: requests.length,
      sent: requests.filter((r) => r.status === REQUEST_STATUS.SENT).length,
      processing: requests.filter((r) => r.status === REQUEST_STATUS.PROCESSING).length,
      completed: requests.filter((r) => r.status === REQUEST_STATUS.COMPLETED).length,
      withLink: requests.filter((r) => r.type === REQUEST_TYPE.WITH_LINK).length,
      withoutLink: requests.filter((r) => r.type === REQUEST_TYPE.WITHOUT_LINK).length,
    }
  }, [requests])

  const handleCreateRequest = () => {
    navigate("/account-center/purchase-request-list/create-request")
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-indigo-50">
      <div className="max-w-7xl mx-auto p-6 space-y-8">
        {/* Header */}
        <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-6">
          <div className="space-y-2">
            <h1 className="text-3xl font-bold text-gray-900">Danh sách yêu cầu mua hàng</h1>
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

        {/* Stats Cards */}
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-4">
          <Card className="hover:shadow-md transition-shadow">
            <CardContent className="p-4 text-center">
              <div className="text-2xl font-bold text-blue-600">{stats.total}</div>
              <div className="text-sm text-gray-600">Tổng số</div>
            </CardContent>
          </Card>
          <Card className="hover:shadow-md transition-shadow">
            <CardContent className="p-4 text-center">
              <div className="text-2xl font-bold text-orange-600">{stats.sent}</div>
              <div className="text-sm text-gray-600">Đã gửi</div>
            </CardContent>
          </Card>
          <Card className="hover:shadow-md transition-shadow">
            <CardContent className="p-4 text-center">
              <div className="text-2xl font-bold text-yellow-600">{stats.processing}</div>
              <div className="text-sm text-gray-600">Đang xử lý</div>
            </CardContent>
          </Card>
          <Card className="hover:shadow-md transition-shadow">
            <CardContent className="p-4 text-center">
              <div className="text-2xl font-bold text-green-600">{stats.completed}</div>
              <div className="text-sm text-gray-600">Hoàn thành</div>
            </CardContent>
          </Card>
          <Card className="hover:shadow-md transition-shadow">
            <CardContent className="p-4 text-center">
              <div className="text-2xl font-bold text-purple-600">{stats.withLink}</div>
              <div className="text-sm text-gray-600">Có link</div>
            </CardContent>
          </Card>
          <Card className="hover:shadow-md transition-shadow">
            <CardContent className="p-4 text-center">
              <div className="text-2xl font-bold text-indigo-600">{stats.withoutLink}</div>
              <div className="text-sm text-gray-600">Không link</div>
            </CardContent>
          </Card>
        </div>

        {/* Filters and Search */}

        {/* Request List */}
        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <h2 className="text-xl font-semibold text-gray-900">
              Danh sách yêu cầu ({filteredAndSortedRequests.length})
            </h2>
          </div>

          {filteredAndSortedRequests.length === 0 ? (
            <Card className="shadow-sm">
              <CardContent className="p-12 text-center">
                <div className="w-20 h-20 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-6">
                  <ShoppingCart className="h-10 w-10 text-gray-400" />
                </div>
                <h3 className="text-xl font-medium text-gray-900 mb-3">Không có yêu cầu nào</h3>
                <p className="text-gray-600 mb-6 max-w-md mx-auto">
                  {filters.search || filters.status !== "all" || filters.type !== "all"
                    ? "Không tìm thấy yêu cầu phù hợp với bộ lọc hiện tại. Hãy thử điều chỉnh bộ lọc hoặc tìm kiếm khác."
                    : "Bạn chưa có yêu cầu mua hàng nào. Hãy tạo yêu cầu đầu tiên để bắt đầu!"}
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
            <div className="grid grid-cols-1 lg:grid-cols-2 xl:grid-cols-3 gap-6">
              {filteredAndSortedRequests.map((request) => (
                <RequestCard key={request.id} request={request} />
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  )
}
