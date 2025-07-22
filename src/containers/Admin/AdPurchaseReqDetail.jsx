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
import { Link, useParams } from "react-router-dom"
import { useCheckingPurchaseRequestMutation, useGetPurchaseRequestDetailQuery } from "@/services/gshopApi"
import React from "react"
import PageLoading from "@/components/PageLoading"
import { toast } from "sonner"
import { getStatusText } from "@/utils/statusHandler"

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
const requestCustomerUpdate = async (requestId) => {
 console.log("first")
}

function AdPurchaseReqDetail() {
  const { id } = useParams();
  const { data: req, isLoading: isReqLoading, isError: isRequestError } = useGetPurchaseRequestDetailQuery(id)
  const [selectedProductId, setSelectedProductId] = useState(undefined)
  const [quotePrices, setQuotePrices] = useState({})
  const [notes, setNotes] = useState("")
  const [selectedProducts, setSelectedProducts] = useState(new Set())
  const [showCreateGroupModal, setShowCreateGroupModal] = useState(false)
  const [groupSeller, setGroupSeller] = useState("")
  const [groupPlatform, setGroupPlatform] = useState("")
  const [groupAddress, setGroupAddress] = useState("")
  const [isRequestingUpdate, setIsRequestingUpdate] = useState(false)
  const [updateRequested, setUpdateRequested] = useState(false)
  const [checking, { isLoading: isCheckLoading }] = useCheckingPurchaseRequestMutation();

  const selectedProduct = req && req.requestItems ? req.requestItems.find((item) => item.id === selectedProductId) : undefined

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
  }

  const handleCreateGroup = () => {
    /* logic here */
  }

  const handleAssignToMe = async () => {
    try {
      await checking(req.id).unwrap()
      .then(() => {
        toast.success("Yêu cầu đã được tiếp nhận thành công.");
      })
    } catch (error) {
      toast.error(`Lỗi khi tiếp nhận yêu cầu: ${error.message}`);
    }
  }

  const handleRequestCustomerUpdate = async () => {
    setIsRequestingUpdate(true)

    try {
      await requestCustomerUpdate(req.id)
      setUpdateRequested(true)
    } catch (error) {
      toast.error(`Lỗi khi gửi yêu cầu cập nhật: ${error.message}`);
    } finally {
      setIsRequestingUpdate(false)
    }
  }

  if (isReqLoading) {
    return <PageLoading />;
  }
  if (isRequestError || !req) {
    return <div className="min-h-screen flex requestItems-center justify-center text-lg text-red-600">Không thể tải dữ liệu yêu cầu.</div>;
  }
  return (
    <div className="min-h-screen bg-gray-50/30">
      <div className="max-w-7xl mx-auto p-6 space-y-6">
        {/* Header */}
        <div className="space-y-4">
          {/* Breadcrumb */}
          <div className="flex requestItems-center text-sm text-muted-foreground">
            <span>
              <Link to="/admin">Danh sách yêu cầu mua hàng</Link>
            </span>
            <ChevronRight className="h-4 w-4 mx-2" />
            <span className="text-foreground font-medium">
              Yêu cầu #{req.id}
            </span>
          </div>

          {/* Title and Actions */}
          <div className="flex flex-col lg:flex-row lg:requestItems-center lg:justify-between gap-4">
            <div className="space-?y-2">
              <div className="flex requestItems-center gap-3">
                <h1 className="text-2xl font-bold">Yêu cầu mua hàng</h1>
                <span className={`px-2 py-2 rounded-full text-xs font-medium ${getStatusColor(req.status)}`}>
                {getStatusText(req.status)}
              </span>
                {req.status == "CHECKING" && (
                  <Badge variant="outline" className="text-xs">
                    Assigned to: {req?.admin?.name}
                  </Badge>
                )}
              </div>
              <div className="flex requestItems-center gap-4 text-sm text-muted-foreground">
                <div className="flex requestItems-center gap-1">
                  <Calendar className="h-4 w-4" />
                  <span>Tạo: {formatDate(req.createdAt)}</span>
                </div>
                <div className="flex requestItems-center gap-1">
                  <Clock className="h-4 w-4" />
                  <span>Hết hạn: {formatDate(req.expiredAt)}</span>
                </div>
              </div>
            </div>

            <div className="flex gap-2">
              {req.status === "SENT" && (
                <>
                  <Button
                    variant="default"
                    size="sm"
                    onClick={handleAssignToMe}
                    disabled={isCheckLoading}
                  >
                    {isCheckLoading ? "Đang tiếp nhận..." : "Tiếp nhận yêu cầu"}
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
                disabled={req.status === "SENT"}
                onClick={() => setShowCreateGroupModal(true)}
              >
                <Users className="h-4 w-4 mr-2" />
                Tạo Nhóm
              </Button>
              <Button size="sm" disabled={req.status === "SENT"}>
                Gửi Báo Giá
              </Button>
            </div>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
          <div className="lg:col-span-2 space-y-4">
            <Card>
              <CardHeader>
                <CardTitle className="flex requestItems-center gap-2">
                  <Package className="h-5 w-5" />
                  Danh sách sản phẩm
                </CardTitle>
                <CardDescription>
                  {req.status === "SENT"
                    ? "Xem thông tin sản phẩm trong yêu cầu mua hàng"
                    : "Chọn sản phẩm để xem chi tiết và nhập giá báo giá"}
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-3">
                {req?.requestItems?.length > 0 ? (
                  req?.requestItems.map(item => (
                    <Card
                      key={item.id}
                      className={`cursor-pointer transition-all hover:shadow-md py-2 ${selectedProductId === item.id
                          ? "ring-2 ring-primary border-primary bg-primary/5"
                          : "hover:border-gray-300"
                        }`}
                      onClick={() => handleProductClick(item.id)}
                    >
                      <CardContent className="p-4">
                        <div className="flex items-center justify-between">
                          {/* Left: Index and Name */}
                          <div className="flex items-center gap-2 min-w-0">
                            <span className="text-xs bg-gray-100 text-gray-600 px-2 py-1 rounded shrink-0">#{req.requestItems.indexOf(item) + 1}</span>
                            <span className="font-semibold text-base truncate">{item.productName}</span>
                          </div>
                          {/* Right: Quantity and Select */}
                          <div className="flex items-center gap-3">
                            <span className="font-bold text-lg">×{item.quantity}</span>
                            <button
                              onClick={(e) => toggleProductSelection(item.id, e)}
                              className={`p-1 hover:bg-gray-100 rounded-full transition-colors ${req.status === "SENT" ? "opacity-50 cursor-not-allowed" : ""}`}
                              disabled={req.status === "SENT"}
                            >
                              {selectedProducts.has(item.id) ? (
                                <CheckCircle2 className="h-5 w-5 text-green-600" />
                              ) : (
                                <Circle className="h-5 w-5 text-gray-400 hover:text-gray-600" />
                              )}
                            </button>
                          </div>
                        </div>
                        {/* Link below */}
                        <div className="mt-2">
                          <a
                            href={item.productURL}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="flex items-center gap-1 text-blue-600 hover:underline text-sm"
                            onClick={(e) => e.stopPropagation()}
                          >
                            <ExternalLink className="h-4 w-4" />
                            Xem sản phẩm
                          </a>
                        </div>
                      </CardContent>
                    </Card>
                  ))
                ) : (
                  //render subrequests if no request items
                  req.subRequests?.map((sub) => (
                    
                    <div key={sub} className="mb-6">
                      {/* Items */}
                      {sub.requestItems?.map(item => (
                        <Card
                          key={item.id}
                          className={`cursor-pointer transition-all hover:shadow-md py-2 ${selectedProductId === item.id
                              ? "ring-2 ring-primary border-primary bg-primary/5"
                              : "hover:border-gray-300"
                            }`}
                          onClick={() => handleProductClick(item.id)}
                        >
                          <CardContent className="p-4">
                            <div className="flex items-center justify-between">
                              <div className="flex items-center gap-2 min-w-0">
                                <span className="text-xs bg-gray-100 text-gray-600 px-2 py-1 rounded shrink-0">#{sub.requestItems.indexOf(item) + 1}</span>
                                <span className="font-semibold text-base truncate">{item.productName}</span>
                              </div>
                              <div className="flex items-center gap-3">
                                <span className="font-bold text-lg">×{item.quantity}</span>
                                <button
                                  onClick={(e) => toggleProductSelection(item.id, e)}
                                  className={`p-1 hover:bg-gray-100 rounded-full transition-colors ${req.status === "SENT" ? "opacity-50 cursor-not-allowed" : ""}`}
                                  disabled={req.status === "SENT"}
                                >
                                  {selectedProducts.has(item.id) ? (
                                    <CheckCircle2 className="h-5 w-5 text-green-600" />
                                  ) : (
                                    <Circle className="h-5 w-5 text-gray-400 hover:text-gray-600" />
                                  )}
                                </button>
                              </div>
                            </div>
                            {/* Link below */}
                            <div className="mt-2">
                              <a
                                href={item.productURL}
                                target="_blank"
                                rel="noopener noreferrer"
                                className="flex items-center gap-1 text-blue-600 hover:underline text-sm"
                                onClick={(e) => e.stopPropagation()}
                              >
                                <ExternalLink className="h-4 w-4" />
                                Xem sản phẩm
                              </a>
                            </div>
                          </CardContent>
                        </Card>
                      ))}
                    </div>
                  ))
                )}
              </CardContent>
            </Card>
          </div>

          <div className="space-y-4 grid grid-cols-2 col-span-2 gap-6">
            <Card className="col-span-1">
              <CardHeader>
                <CardTitle className="flex requestItems-center gap-2">
                  <User className="h-5 w-5" />
                  Thông tin khách hàng
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="flex requestItems-center gap-3">
                  <Avatar className="h-12 w-12">
                    <AvatarImage src={req.customer.avatar || "/placeholder.svg"} alt={req.customer.name} />
                    <AvatarFallback>{req.customer.name.charAt(0)}</AvatarFallback>
                  </Avatar>
                  <div>
                    <div className="font-semibold">{req.customer.name}</div>
                  </div>
                </div>

                <Separator />
                {/* customer info */}
                <div className="space-y-3 text-sm">
                  <div className="flex requestItems-center gap-2">
                    <Mail className="h-4 w-4 text-muted-foreground" />
                    <span>{req.customer.email}</span>
                  </div>
                  <div className="flex requestItems-center gap-2">
                    <Phone className="h-4 w-4 text-muted-foreground" />
                    <span>{req.customer.phone}</span>
                  </div>
                  <div className="flex requestItems-start gap-2">
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
                    {formatCurrency(req.customer?.wallet?.balance)}
                  </div>
                </div>
              </CardContent>
            </Card>
            {
              selectedProduct && (
                <Card>
                  <CardHeader>
                      <CardTitle className="flex requestItems-center gap-2">
                        <Package className="h-5 w-5" />
                        Chi tiết và báo giá
                      </CardTitle>
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

                    {req.status === "CHECKING" && (
                      <>
                        <div className="space-y-3">
                          <Label htmlFor="quote-price" className="text-sm font-medium">
                            Báo giá (VND/sản phẩm)
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
                        </div>
                      </>
                    )}

                    {req.status === "SENT" && (
                      <div className="bg-yellow-50 border border-yellow-200 text-yellow-700 px-4 py-3 rounded-md">
                        <p className="text-sm font-medium">Chức năng báo giá chưa khả dụng</p>
                        <p className="text-sm">Vui lòng assign yêu cầu này để bắt đầu quá trình báo giá.</p>
                      </div>
                    )}
                  </CardContent>
                </Card>
              )
            }

            {/* Notes */}
            <Card>
              <CardHeader>
                <CardTitle className="text-base">Ghi chú</CardTitle>
              </CardHeader>
              <CardContent>
                <Textarea
                  placeholder={req.status === "SENT" ? "Xem ghi chú..." : "Thêm ghi chú cho báo giá..."}
                  value={notes}
                  onChange={(e) => setNotes(e.target.value)}
                  rows={3}
                  disabled={req.status === "SENT"}
                />
              </CardContent>
            </Card>
          </div>
        </div>

        {showCreateGroupModal && (
          <div className="fixed inset-0 bg-black bg-opacity-50 flex requestItems-center justify-center z-50">
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
  );
}

export default AdPurchaseReqDetail
