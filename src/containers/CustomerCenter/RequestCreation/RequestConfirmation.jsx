"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Separator } from "@/components/ui/separator"
import { CheckCircle, ArrowRight, ArrowLeft, ExternalLink, Loader2 } from "lucide-react"

// Helper function to get status text
const getStatusText = (status) => {
  switch (status) {
    case 'SENT':
      return 'Đã gửi'
    case 'PROCESSING':
      return 'Đang xử lý'
    case 'COMPLETED':
      return 'Hoàn thành'
    case 'CANCELLED':
      return 'Đã hủy'
    default:
      return status
  }
}

// Helper function to get request type text
const getRequestTypeText = (type) => {
  switch (type) {
    case 'ONLINE':
      return 'Có link'
    case 'OFFLINE':
      return 'Không có link'
    default:
      return type
  }
}

const savedAddresses = [
  { id: "addr_1", label: "🏠 Nhà riêng", address: "123 Đường Nguyễn Huệ, Quận 1, TP.HCM" },
  { id: "addr_2", label: "🏢 Văn phòng", address: "456 Đường Lê Lợi, Quận 3, TP.HCM" },
  { id: "addr_3", label: "👨‍👩‍👧‍👦 Nhà gia đình", address: "789 Đường Trần Hưng Đạo, Quận 5, TP.HCM" },
]

export default function RequestConfirmation({ type, products, shopInfo, onNext, onBack }) {
  const [contactInfo, setContactInfo] = useState({ email: "", phone: "" })
  const [shippingAddressId, setShippingAddressId] = useState("")
  const [isLoading, setIsLoading] = useState(false)

  const handleSubmit = async () => {
    if (!contactInfo.email || !contactInfo.phone || !shippingAddressId) {
      alert("Vui lòng điền đầy đủ thông tin")
      return
    }

    setIsLoading(true)
    // Simulate API call
    await new Promise((resolve) => setTimeout(resolve, 2000))

    const mockRequest = {
      id: `REQ_${Date.now().toString().slice(-8)}`,
      type,
      products,
      shopInfo,
      contactInfo,
      shippingAddressId,
      status: 'sent',
      createdAt: new Date(),
      updatedAt: new Date(),
      totalProducts: products.length,
      estimatedValue: "2,500,000 VNĐ",
    }

    setIsLoading(false)
    onNext(mockRequest)
  }

  return (
    <div className="space-y-6">
      <Card className="shadow-lg">
        <CardHeader className="bg-gradient-to-r from-indigo-600 to-indigo-700 text-white">
          <CardTitle className="flex items-center gap-3 text-xl">
            <CheckCircle className="h-6 w-6" />
            Xác nhận thông tin yêu cầu
          </CardTitle>
        </CardHeader>
        <CardContent className="p-8 space-y-8">
          {/* Contact Info */}
          <div className="space-y-4">
            <h4 className="font-bold text-lg text-gray-900">Thông tin liên hệ</h4>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="email" className="text-base font-medium">
                  Email *
                </Label>
                <Input
                  id="email"
                  type="email"
                  value={contactInfo.email}
                  onChange={(e) => setContactInfo((prev) => ({ ...prev, email: e.target.value }))}
                  placeholder="your@email.com"
                  className="h-12"
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="phone" className="text-base font-medium">
                  Số điện thoại *
                </Label>
                <Input
                  id="phone"
                  type="tel"
                  value={contactInfo.phone}
                  onChange={(e) => setContactInfo((prev) => ({ ...prev, phone: e.target.value }))}
                  placeholder="0123 456 789"
                  className="h-12"
                />
              </div>
            </div>
          </div>

          {/* Shipping Address */}
          <div className="space-y-4">
            <h4 className="font-bold text-lg text-gray-900">Địa chỉ giao hàng</h4>
            <Select value={shippingAddressId} onValueChange={setShippingAddressId}>
              <SelectTrigger className="h-12">
                <SelectValue placeholder="Chọn địa chỉ giao hàng" />
              </SelectTrigger>
              <SelectContent>
                {savedAddresses.map((address) => (
                  <SelectItem key={address.id} value={address.id}>
                    <div className="flex flex-col">
                      <span className="font-medium">{address.label}</span>
                      <span className="text-sm text-gray-500">{address.address}</span>
                    </div>
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          <Separator />

          {/* Request Summary */}
          <div className="space-y-6">
            <h4 className="font-bold text-lg text-gray-900">Tóm tắt yêu cầu</h4>

            {type === "without-link" && shopInfo && (
              <div className="bg-orange-50 p-6 rounded-lg border border-orange-200">
                <h5 className="font-semibold mb-3 text-orange-800">Thông tin cửa hàng</h5>
                <div className="space-y-2 text-sm">
                  <p>
                    <strong>Tên cửa hàng:</strong> {shopInfo.name}
                  </p>
                  <p>
                    <strong>Địa chỉ:</strong> {shopInfo.address}
                  </p>
                  {shopInfo.email && (
                    <p>
                      <strong>Email:</strong> {shopInfo.email}
                    </p>
                  )}
                  {shopInfo.website && (
                    <p>
                      <strong>Website:</strong> {shopInfo.website}
                    </p>
                  )}
                </div>
              </div>
            )}

            <div className="bg-gray-50 p-6 rounded-lg border">
              <h5 className="font-semibold mb-4 text-gray-800">Danh sách sản phẩm ({products.length})</h5>
              <div className="space-y-4">
                {products.map((product, index) => (
                  <div key={product.id} className="bg-white p-4 rounded border">
                    <div className="flex items-start justify-between gap-4">
                      <div className="flex-1">
                        <h6 className="font-medium text-gray-900 mb-2">
                          {index + 1}. {product.name}
                        </h6>
                        <div className="grid grid-cols-2 md:grid-cols-3 gap-2 text-sm text-gray-600">
                          <p>
                            <strong>Số lượng:</strong> {product.quantity}
                          </p>
                          <p>
                            <strong>Màu sắc:</strong> {product.color}
                          </p>
                          <p>
                            <strong>Size:</strong> {product.size}
                          </p>
                        </div>
                        {product.description && (
                          <p className="text-sm text-gray-600 mt-2 bg-gray-50 p-2 rounded">
                            <strong>Mô tả:</strong> {product.description}
                          </p>
                        )}
                        {product.link && (
                          <div className="mt-2">
                            <a
                              href={product.link}
                              target="_blank"
                              rel="noopener noreferrer"
                              className="text-blue-600 hover:underline text-sm flex items-center gap-1"
                            >
                              <ExternalLink className="h-3 w-3" />
                              Xem sản phẩm gốc
                            </a>
                          </div>
                        )}
                      </div>
                      {product.image && (
                        <img
                          src={product.image || "/placeholder.svg"}
                          alt={product.name}
                          className="w-16 h-16 object-cover rounded"
                        />
                      )}
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>

          <div className="flex gap-4 pt-4">
            <Button variant="outline" onClick={onBack} className="flex-1 h-12 bg-transparent">
              <ArrowLeft className="h-4 w-4 mr-2" />
              Quay lại
            </Button>
            <Button
              onClick={handleSubmit}
              className="flex-1 h-12 bg-gradient-to-r from-green-600 to-green-700 hover:from-green-700 hover:to-green-800"
              disabled={!contactInfo.email || !contactInfo.phone || !shippingAddressId || isLoading}
            >
              {isLoading ? (
                <>
                  <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                  Đang gửi yêu cầu...
                </>
              ) : (
                <>
                  Gửi yêu cầu mua hàng
                  <ArrowRight className="h-4 w-4 ml-2" />
                </>
              )}
            </Button>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
