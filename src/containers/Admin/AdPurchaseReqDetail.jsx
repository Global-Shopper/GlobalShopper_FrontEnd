import { useState } from "react"
import { Card, CardHeader, CardTitle, CardContent, CardDescription } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Separator } from "@/components/ui/separator"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import {
  ChevronRight,
  Package,
  User,
  MapPin,
  Phone,
  Mail,
  ExternalLink,
  Calendar,
  Clock,
  CheckCircle2,
  Circle,
  Users,
} from "lucide-react"

const req = {
  id: "6d08cf8c-d552-475f-a72f-3ce2c3b1ab12",
  shippingAddress: {
    id: "9c91f37c-b46b-49ca-9c47-33dd5598d56b",
    name: "Dung SG Ne",
    tag: "Nhà riêng",
    phoneNumber: "0866123456",
    location: "S10.05, Long Binh, TP Thu Duc, TP Ho Chi Minh",
    default: true,
  },
  status: "SENT",
  requestItems: [
    {
      id: "4be23bb9-9ce8-47fe-a1af-cb4d4183b9be",
      productURL: "https://www.madsnorgaard.com/products/cosy-denim-rachel-jacket-vintage-blue",
      productName: "Cosy Denim Rachel Jacket",
      variants: [
        "Màu sắc: Vintage Blue",
        "Xuất xứ: Denmark",
        "Kích thước: 34",
        "Mô tả: Slim-fit cropped jacket in soft, lightweight denim with angled side seams and wide sleeves.",
        "Chất liệu: 100% Organic Cotton",
        "Thương hiệu: madsnorgaard",
      ],
      description: "Vintage Blue",
      quantity: 1,
    },
    {
      id: "c9b435ef-d0b8-4a10-9384-ce39529f8115",
      productURL: "https://www.madsnorgaard.com/products/cosy-denim-crane-shirt-dark-indigo",
      productName: "Cosy Denim Crane Shirt",
      variants: ["Màu sắc: Dark Indigo", "Chất liệu: 100% Cotton", "Kích thước: 36"],
      description: "Dark Indigo",
      quantity: 3,
    },
  ],
  admin: null,
  customer: {
    id: "3f87e8d1-9875-467c-829e-030420a06734",
    name: "Lee Chong Dung",
    email: "dungtdse172809@fpt.edu.vn",
    phone: "0912345678",
    gender: "MALE",
    dateOfBirth: 1751328000000,
    avatar: "https://res.cloudinary.com/gshop/image/upload/v1752470200/20250714051628_StudentID_Card.jpg",
    wallet: {
      id: "3fbb1f6a-351d-23b9-936b-ba30790ba866",
      balance: 5110000,
      bankAccounts: null,
    },
  },
  requestType: "OFFLINE",
  createdAt: "1752573476987",
  expiredAt: 1752659876975,
}

const getStatusColor = (status) => {
  switch (status) {
    case "SENT":
      return "bg-blue-100 text-blue-800 border-blue-200"
    case "PENDING":
      return "bg-yellow-100 text-yellow-800 border-yellow-200"
    case "APPROVED":
      return "bg-green-100 text-green-800 border-green-200"
    case "REJECTED":
      return "bg-red-100 text-red-800 border-red-200"
    default:
      return "bg-gray-100 text-gray-800 border-gray-200"
  }
}

const formatDate = (timestamp) => {
  return new Date(timestamp).toLocaleDateString("vi-VN", {
    year: "numeric",
    month: "short",
    day: "numeric",
    hour: "2-digit",
    minute: "2-digit",
  })
}

const formatCurrency = (amount) => {
  return new Intl.NumberFormat("vi-VN", {
    style: "currency",
    currency: "VND",
  }).format(amount)
}

// Mock API functions - replace with actual API calls
const assignRequest = async (requestId, adminId) => {
  return new Promise((resolve, reject) => {
    setTimeout(() => {
      // Simulate API call
      if (Math.random() > 0.1) {
        // 90% success rate
        resolve({ success: true, message: "Request assigned successfully" })
      } else {
        reject(new Error("Failed to assign request"))
      }
    }, 1000)
  })
}

const updateRequestStatus = async (requestId, newStatus) => {
  return new Promise((resolve, reject) => {
    setTimeout(() => {
      // Simulate API call
      if (Math.random() > 0.1) {
        // 90% success rate
        resolve({ success: true, message: "Status updated successfully" })
      } else {
        reject(new Error("Failed to update status"))
      }
    }, 1000)
  })
}

const requestCustomerUpdate = async (requestId) => {
  return new Promise((resolve, reject) => {
    setTimeout(() => {
      // Simulate API call
      if (Math.random() > 0.1) {
        // 90% success rate
        resolve({ success: true, message: "Customer update request sent" })
      } else {
        reject(new Error("Failed to send update request"))
      }
    }, 1000)
  })
}

// Mock current admin - replace with actual admin data
const currentAdmin = {
  id: "admin-123",
  name: "Admin User",
}

function AdPurchaseReqDetail() {
  const [selectedProductId, setSelectedProductId] = useState(req.requestItems[0]?.id)
  const [quotePrices, setQuotePrices] = useState({})
  const [notes, setNotes] = useState("")
  const [selectedProducts, setSelectedProducts] = useState(new Set())
  const [showDetailPanel, setShowDetailPanel] = useState(false)
  const [showCreateGroupModal, setShowCreateGroupModal] = useState(false)
  const [groupSeller, setGroupSeller] = useState("")
  const [groupPlatform, setGroupPlatform] = useState("")
  const [groupAddress, setGroupAddress] = useState("")

  const [isAssigning, setIsAssigning] = useState(false)
  const [isRequestingUpdate, setIsRequestingUpdate] = useState(false)
  const [assignmentError, setAssignmentError] = useState("")
  const [updateRequestError, setUpdateRequestError] = useState("")
  const [updateRequested, setUpdateRequested] = useState(false)
  const [currentStatus, setCurrentStatus] = useState(req.status)
  const [assignedAdmin, setAssignedAdmin] = useState(req.admin)

  const selectedProduct = req.requestItems.find((item) => item.id === selectedProductId)
  const completedQuotes = Object.keys(quotePrices).filter((id) => quotePrices[id]).length

  const handlePriceChange = (productId, price) => {
    setQuotePrices((prev) => ({
      ...prev,
      [productId]: price,
    }))
  }

  const toggleProductSelection = (productId, e) => {
    e.stopPropagation()
    setSelectedProducts((prev) => {
      const newSet = new Set(prev)
      if (newSet.has(productId)) {
        newSet.delete(productId)
      } else {
        newSet.add(productId)
      }
      return newSet
    })
  }

  const handleProductClick = (productId) => {
    setSelectedProductId(productId)
    setShowDetailPanel(true)
  }

  const closeDetailPanel = () => {
    setShowDetailPanel(false)
  }

  const handleCreateGroup = () => {
    /* logic here */
  }

  const handleAssignToMe = async () => {
    setIsAssigning(true)
    setAssignmentError("")

    try {
      await assignRequest(req.id, currentAdmin.id)
      await updateRequestStatus(req.id, "CHECKING")

      setCurrentStatus("CHECKING")
      setAssignedAdmin(currentAdmin)
    } catch (error) {
      setAssignmentError(error.message)
    } finally {
      setIsAssigning(false)
    }
  }

  const handleRequestCustomerUpdate = async () => {
    setIsRequestingUpdate(true)
    setUpdateRequestError("")

    try {
      await requestCustomerUpdate(req.id)
      setUpdateRequested(true)
    } catch (error) {
      setUpdateRequestError(error.message)
    } finally {
      setIsRequestingUpdate(false)
    }
  }

  return (
    <div className="min-h-screen bg-gray-50/30">
      <div className="max-w-7xl mx-auto p-6 space-y-6">
        {/* Header */}
        <div className="space-y-4">
          {/* Breadcrumb */}
          <div className="flex items-center text-sm text-muted-foreground">
            <span>Danh sách yêu cầu mua hàng</span>
            <ChevronRight className="h-4 w-4 mx-2" />
            <span className="text-foreground font-medium">
              Yêu cầu #{req.id} ({completedQuotes}/{req.requestItems.length})
            </span>
          </div>

          {/* Title and Actions */}
          <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-4">
            <div className="space-y-2">
              <div className="flex items-center gap-3">
                <h1 className="text-2xl font-bold">Yêu cầu mua hàng</h1>
                <Badge className={getStatusColor(currentStatus)}>{currentStatus}</Badge>
                {assignedAdmin && (
                  <Badge variant="outline" className="text-xs">
                    Assigned to: {assignedAdmin.name}
                  </Badge>
                )}
              </div>
              <div className="flex items-center gap-4 text-sm text-muted-foreground">
                <div className="flex items-center gap-1">
                  <Calendar className="h-4 w-4" />
                  <span>Tạo: {formatDate(req.createdAt)}</span>
                </div>
                <div className="flex items-center gap-1">
                  <Clock className="h-4 w-4" />
                  <span>Hết hạn: {formatDate(req.expiredAt)}</span>
                </div>
              </div>
            </div>

            <div className="flex gap-2">
              {currentStatus === "SENT" && (
                <>
                  <Button
                    variant="default"
                    size="sm"
                    onClick={handleAssignToMe}
                    disabled={isAssigning || (assignedAdmin && assignedAdmin.id !== currentAdmin.id)}
                  >
                    {isAssigning ? "Đang tiếp nhận..." : "Tiếp nhận yêu cầu"}
                  </Button>
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={handleRequestCustomerUpdate}
                    disabled={isRequestingUpdate || updateRequested}
                  >
                    {isRequestingUpdate
                      ? "Requesting..."
                      : updateRequested
                        ? "Update Requested"
                        : "Yêu cầu khách cập nhật thông tin"}
                  </Button>
                </>
              )}

              <Button
                variant="outline"
                size="sm"
                disabled={currentStatus === "SENT"}
                onClick={() => setShowCreateGroupModal(true)}
              >
                <Users className="h-4 w-4 mr-2" />
                Tạo Nhóm
              </Button>
              <Button size="sm" disabled={currentStatus === "SENT" || completedQuotes !== req.requestItems.length}>
                Gửi Báo Giá
              </Button>
            </div>
          </div>

          {/* Error Messages */}
          {assignmentError && (
            <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-md">
              <p className="text-sm font-medium">Assignment Error:</p>
              <p className="text-sm">{assignmentError}</p>
            </div>
          )}

          {updateRequestError && (
            <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-md">
              <p className="text-sm font-medium">Update Request Error:</p>
              <p className="text-sm">{updateRequestError}</p>
            </div>
          )}

          {updateRequested && (
            <div className="bg-green-50 border border-green-200 text-green-700 px-4 py-3 rounded-md">
              <p className="text-sm font-medium">Update Request Sent</p>
              <p className="text-sm">Customer has been notified to update the product information.</p>
            </div>
          )}

          {currentStatus === "SENT" && assignedAdmin && assignedAdmin.id !== currentAdmin.id && (
            <div className="bg-yellow-50 border border-yellow-200 text-yellow-700 px-4 py-3 rounded-md">
              <p className="text-sm font-medium">Request Already Assigned</p>
              <p className="text-sm">This request is already assigned to {assignedAdmin.name}.</p>
            </div>
          )}
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Left Column - Product List */}
          <div className="lg:col-span-2 space-y-4">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Package className="h-5 w-5" />
                  Danh sách sản phẩm ({req.requestItems.length})
                </CardTitle>
                <CardDescription>
                  {currentStatus === "SENT"
                    ? "Xem thông tin sản phẩm trong yêu cầu mua hàng"
                    : "Chọn sản phẩm để xem chi tiết và nhập giá báo giá"}
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-3">
                {req.requestItems.map((item, index) => (
                  <Card
                    key={item.id}
                    className={`cursor-pointer transition-all hover:shadow-md ${
                      selectedProductId === item.id
                        ? "ring-2 ring-primary border-primary bg-primary/5"
                        : "hover:border-gray-300"
                    }`}
                    onClick={() => handleProductClick(item.id)}
                  >
                    <CardContent className="p-4">
                      <div className="flex items-start justify-between">
                        <div className="flex-1 space-y-2">
                          <div className="flex items-center gap-2">
                            <span className="text-xs bg-gray-100 text-gray-600 px-2 py-1 rounded">#{index + 1}</span>
                            <h3 className="font-semibold text-sm">{item.productName}</h3>
                          </div>
                          <p className="text-sm text-muted-foreground">{item.description}</p>
                          <div className="flex items-center gap-4 text-xs text-muted-foreground">
                            <span>Số lượng: {item.quantity}</span>
                            <a
                              href={item.productURL}
                              target="_blank"
                              rel="noopener noreferrer"
                              className="flex items-center gap-1 text-blue-600 hover:underline"
                              onClick={(e) => e.stopPropagation()}
                            >
                              <ExternalLink className="h-3 w-3" />
                              Xem sản phẩm
                            </a>
                          </div>
                        </div>
                        <div className="flex items-center gap-3">
                          <button
                            onClick={(e) => toggleProductSelection(item.id, e)}
                            className={`p-1 hover:bg-gray-100 rounded-full transition-colors ${
                              currentStatus === "SENT" ? "opacity-50 cursor-not-allowed" : ""
                            }`}
                            disabled={currentStatus === "SENT"}
                          >
                            {selectedProducts.has(item.id) ? (
                              <CheckCircle2 className="h-5 w-5 text-green-600" />
                            ) : (
                              <Circle className="h-5 w-5 text-gray-400 hover:text-gray-600" />
                            )}
                          </button>
                          <div className="text-right">
                            <div className="text-lg font-bold">×{item.quantity}</div>
                            {quotePrices[item.id] && (
                              <div className="text-sm text-green-600 font-medium">
                                {formatCurrency(Number(quotePrices[item.id]) * item.quantity)}
                              </div>
                            )}
                          </div>
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                ))}
              </CardContent>
            </Card>
          </div>

          {/* Right Column */}
          <div className="space-y-4">
            {!showDetailPanel ? (
              /* Customer Info */
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <User className="h-5 w-5" />
                    Thông tin khách hàng
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="flex items-center gap-3">
                    <Avatar className="h-12 w-12">
                      <AvatarImage src={req.customer.avatar || "/placeholder.svg"} alt={req.customer.name} />
                      <AvatarFallback>{req.customer.name.charAt(0)}</AvatarFallback>
                    </Avatar>
                    <div>
                      <div className="font-semibold">{req.customer.name}</div>
                      <div className="text-sm text-muted-foreground">ID: {req.customer.id.slice(0, 8)}...</div>
                    </div>
                  </div>

                  <Separator />

                  <div className="space-y-3 text-sm">
                    <div className="flex items-center gap-2">
                      <Mail className="h-4 w-4 text-muted-foreground" />
                      <span>{req.customer.email}</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <Phone className="h-4 w-4 text-muted-foreground" />
                      <span>{req.customer.phone}</span>
                    </div>
                    <div className="flex items-start gap-2">
                      <MapPin className="h-4 w-4 text-muted-foreground mt-0.5" />
                      <div>
                        <div className="font-medium">{req.shippingAddress.name}</div>
                        <div className="text-muted-foreground">{req.shippingAddress.location}</div>
                        <div className="text-muted-foreground">{req.shippingAddress.phoneNumber}</div>
                        <Badge variant="secondary" className="mt-1 text-xs">
                          {req.shippingAddress.tag}
                        </Badge>
                      </div>
                    </div>
                  </div>

                  <Separator />

                  <div className="bg-green-50 p-3 rounded-lg">
                    <div className="text-sm font-medium text-green-800">Số dư ví</div>
                    <div className="text-lg font-bold text-green-600">
                      {formatCurrency(req.customer.wallet.balance)}
                    </div>
                  </div>
                </CardContent>
              </Card>
            ) : (
              /* Detail Panel */
              selectedProduct && (
                <Card>
                  <CardHeader>
                    <div className="flex items-center justify-between">
                      <CardTitle className="flex items-center gap-2">
                        <Package className="h-5 w-5" />
                        Chi tiết và báo giá
                      </CardTitle>
                      <Button variant="ghost" size="sm" onClick={closeDetailPanel}>
                        ✕
                      </Button>
                    </div>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    <div>
                      <h3 className="font-semibold mb-2">{selectedProduct.productName}</h3>
                      <p className="text-sm text-muted-foreground mb-3">{selectedProduct.description}</p>

                      <div className="space-y-2 text-sm">
                        <div>
                          <span className="font-medium">Số lượng:</span> {selectedProduct.quantity}
                        </div>

                        {selectedProduct.variants && selectedProduct.variants.length > 0 && (
                          <div>
                            <span className="font-medium">Thông số:</span>
                            <ul className="mt-1 space-y-1 text-xs">
                              {selectedProduct.variants.map((variant, idx) => (
                                <li key={idx} className="bg-gray-50 px-2 py-1 rounded">
                                  {variant}
                                </li>
                              ))}
                            </ul>
                          </div>
                        )}
                      </div>
                    </div>

                    <Separator />

                    {currentStatus === "CHECKING" && (
                      <>
                        <div className="space-y-3">
                          <Label htmlFor="quote-price" className="text-sm font-medium">
                            Giá báo giá (VND/sản phẩm)
                          </Label>
                          <Input
                            id="quote-price"
                            type="number"
                            placeholder="Nhập giá..."
                            value={quotePrices[selectedProduct.id] || ""}
                            onChange={(e) => handlePriceChange(selectedProduct.id, e.target.value)}
                          />
                          {quotePrices[selectedProduct.id] && (
                            <div className="text-sm">
                              <span className="text-muted-foreground">Tổng: </span>
                              <span className="font-semibold text-green-600">
                                {formatCurrency(Number(quotePrices[selectedProduct.id]) * selectedProduct.quantity)}
                              </span>
                            </div>
                          )}
                        </div>

                        <Separator />

                        <div className="space-y-3">
                          <Label className="text-sm font-medium">Ghi chú sản phẩm</Label>
                          <Textarea placeholder="Thêm ghi chú cho sản phẩm này..." rows={3} />
                        </div>

                        <div className="flex gap-2 pt-2">
                          <Button size="sm" className="flex-1">
                            Lưu báo giá
                          </Button>
                          <Button variant="outline" size="sm" onClick={closeDetailPanel}>
                            Đóng
                          </Button>
                        </div>
                      </>
                    )}

                    {currentStatus === "SENT" && (
                      <div className="bg-yellow-50 border border-yellow-200 text-yellow-700 px-4 py-3 rounded-md">
                        <p className="text-sm font-medium">Chức năng báo giá chưa khả dụng</p>
                        <p className="text-sm">Vui lòng assign yêu cầu này để bắt đầu quá trình báo giá.</p>
                      </div>
                    )}
                  </CardContent>
                </Card>
              )
            )}

            {/* Notes */}
            <Card>
              <CardHeader>
                <CardTitle className="text-base">Ghi chú</CardTitle>
              </CardHeader>
              <CardContent>
                <Textarea
                  placeholder={currentStatus === "SENT" ? "Xem ghi chú..." : "Thêm ghi chú cho báo giá..."}
                  value={notes}
                  onChange={(e) => setNotes(e.target.value)}
                  rows={3}
                  disabled={currentStatus === "SENT"}
                />
              </CardContent>
            </Card>
          </div>
        </div>

        {showCreateGroupModal && (
          <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
            <Card className="w-96 max-w-md">
              <CardHeader>
                <CardTitle>Thông tin của đơn hàng</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="space-y-2">
                  <Label>Seller</Label>
                  <Input
                    placeholder="Loreal Paris"
                    value={groupSeller}
                    onChange={(e) => setGroupSeller(e.target.value)}
                  />
                </div>
                <div className="space-y-2">
                  <Label>Platform</Label>
                  <Input
                    placeholder="Amazon"
                    value={groupPlatform}
                    onChange={(e) => setGroupPlatform(e.target.value)}
                  />
                </div>
                <div className="space-y-2">
                  <Label>Address</Label>
                  <Input placeholder="Paris" value={groupAddress} onChange={(e) => setGroupAddress(e.target.value)} />
                </div>
                <div className="flex gap-2 pt-4">
                  <Button onClick={handleCreateGroup} className="flex-1">
                    Tạo nhóm
                  </Button>
                  <Button variant="outline" onClick={() => setShowCreateGroupModal(false)}>
                    Hủy
                  </Button>
                </div>
              </CardContent>
            </Card>
          </div>
        )}
      </div>
    </div>
  )
}

export default AdPurchaseReqDetail
