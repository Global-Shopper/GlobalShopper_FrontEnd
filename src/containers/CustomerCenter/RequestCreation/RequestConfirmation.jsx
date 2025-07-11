import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Separator } from "@/components/ui/separator"
import { ArrowRight, ArrowLeft, Loader2 } from "lucide-react"
import { useCreateWithoutLinkPurchaseRequestMutation, useGetShippingAddressQuery } from "@/services/gshopApi"

export default function RequestConfirmation({ type, items, contactInfo, onNext, onBack, setShippingAddressId, shippingAddressId }) {
  const { data: addresses } = useGetShippingAddressQuery()
  const { data: isLoadingCreate } = useCreateWithoutLinkPurchaseRequestMutation()

  const selectedAddress = addresses?.find(addr => addr.id === shippingAddressId)

  const handleSubmit = async () => {
    if (!shippingAddressId) {
      alert("Vui lòng chọn địa chỉ giao hàng")
      return
    }
    onNext({
      shippingAddressId,
      contactInfo: contactInfo,
      items,
    })
  }

  return (
    <div className="space-y-6">
      <Card className="shadow-lg">
        <CardHeader className="bg-gradient-to-r from-indigo-600 to-indigo-700 text-white">
          <CardTitle className="flex items-center gap-3 text-xl">
            Xác nhận thông tin yêu cầu
          </CardTitle>
        </CardHeader>
        <CardContent className="p-8 space-y-8">
          {/* Shipping Address */}
          <div className="space-y-4">
            <h4 className="font-bold text-lg text-gray-900">Địa chỉ giao hàng</h4>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {addresses?.map((address) => (
                <div
                  key={address.id}
                  className={`cursor-pointer border rounded p-4 transition-all ${
                    address.id === shippingAddressId
                      ? "ring-2 ring-primary/80 bg-primary/5 border-primary"
                      : "hover:ring-2 hover:ring-primary/30"
                  }`}
                  onClick={() => setShippingAddressId(address.id)}
                  tabIndex={0}
                  role="button"
                  aria-pressed={address.id === shippingAddressId}
                >
                  <div className="flex items-center gap-2 mb-2">
                    <span className="font-semibold">{address.name}</span>
                    <span className="text-xs px-2 py-0.5 rounded bg-gray-200 text-gray-700">{address.tag}</span>
                    {address.default && (
                      <span className="ml-2 text-xs px-2 py-0.5 rounded bg-primary text-white">Mặc định</span>
                    )}
                  </div>
                  <div className="text-sm text-gray-600">{address.location}</div>
                  <div className="text-sm text-gray-600">SĐT: {address.phoneNumber}</div>
                </div>
              ))}
            </div>
          </div>

          <Separator />

          {/* Request Summary */}
          <div className="space-y-6">
            <h4 className="font-bold text-lg text-gray-900">Sản phẩm yêu cầu</h4>

            {type === "without-link" && selectedAddress && (
              <div className="bg-orange-50 p-6 rounded-lg border border-orange-200">
                <h5 className="font-semibold mb-3 text-orange-800">Thông tin nhận hàng</h5>
                <div className="space-y-2 text-sm">
                  <p>
                    <strong>Người nhận:</strong> {selectedAddress.name}
                  </p>
                  <p>
                    <strong>Loại địa chỉ:</strong> {selectedAddress.tag}
                  </p>
                  <p>
                    <strong>Địa chỉ:</strong> {selectedAddress.location}
                  </p>
                  <p>
                    <strong>Số điện thoại:</strong> {selectedAddress.phoneNumber}
                  </p>
                </div>
              </div>
            )}

            <div className="bg-gray-50 p-6 rounded-lg border">
              <h5 className="font-semibold mb-4 text-gray-800">Danh sách sản phẩm ({items.length})</h5>
              <div className="space-y-4">
                {items.map((product, index) => (
                  <div key={product.id || index} className="bg-white p-4 rounded border">
                    <div className="flex flex-col gap-2">
                      <div>
                        <span className="font-medium text-gray-900">{index + 1}. {product.name}</span>
                        {product.link && (
                          <span className="ml-2 text-blue-600 text-sm">
                            <a
                              href={product.link}
                              target="_blank"
                              rel="noopener noreferrer"
                              className="hover:underline"
                            >
                              Xem sản phẩm
                            </a>
                          </span>
                        )}
                      </div>
                      <div className="text-sm text-gray-600">
                        <strong>Số lượng:</strong> {product.quantity}
                      </div>
                      {product.variants && product.variants.length > 0 && (
                        <ul className="mt-1 space-y-1">
                          {product.variants.map((variant, vIdx) => (
                            <li key={vIdx} className="text-sm text-gray-700 pl-2 border-l-2 border-orange-300">
                              {variant}
                            </li>
                          ))}
                        </ul>
                      )}
                      {product.note && (
                        <div className="text-sm text-gray-600 bg-gray-50 p-2 rounded">
                          <strong>Ghi chú:</strong> {product.note}
                        </div>
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
            >
              {isLoadingCreate ? (
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
