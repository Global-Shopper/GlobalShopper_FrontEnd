// import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Separator } from "@/components/ui/separator"
import { ArrowRight, ArrowLeft, Loader2, PackageCheck, Plus } from "lucide-react"
import { useCreateWithoutLinkPurchaseRequestMutation, useGetShippingAddressQuery } from "@/services/gshopApi"
import { toast } from "sonner"
import { useState } from "react"
import { Popover, PopoverTrigger } from "@/components/ui/popover"
import CreateAddressForm from "../CustomerProfile/CreateAddressForm"
import { selectShippingAddressId, setShippingAddressId } from "@/features/onlineReq"
import { useSelector } from "react-redux"
import { useDispatch } from "react-redux"

export default function RequestConfirmation({ linkItem, contactInfo, onNext, onBack }) {
  const dispatch = useDispatch()
  const { data: isLoadingCreate } = useCreateWithoutLinkPurchaseRequestMutation()
  const {
		data: addresses,
		isLoading: isAddressLoading,
		isError: isAddressError,
	} = useGetShippingAddressQuery();
	const [isPopoverOpen, setIsPopoverOpen] = useState(false);

  const shippingAddressId = useSelector(selectShippingAddressId);
  const selectedAddress = addresses?.find(addr => addr.id == shippingAddressId);

  const handleAddAddress = () => {
		setIsPopoverOpen(true);
	};

  const handleClosePopover = () => {
		setIsPopoverOpen(false);
	};

  const handleSubmit = async () => {
    if (!shippingAddressId) {
      toast.error("Vui lòng chọn địa chỉ giao hàng trước khi gửi yêu cầu.");
      return;
    }
    onNext({
      shippingAddressId,
      contactInfo: contactInfo,
      linkItem,
    });
  }

  return (
    <div className="space-y-6">
      <Card className="shadow-lg p-2 py-4">
        <CardHeader className="bg-gradient-to-r from-orange-600 to-orange-700 text-white rounded-lg">
          <CardTitle className="flex items-center gap-3 text-xl">
            <PackageCheck />
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
                  className={`cursor-pointer border rounded-2xl p-4 transition-all ${address.id == shippingAddressId
                      ? "ring-2 ring-primary/80 bg-primary/5 border-primary"
                      : "hover:ring-2 hover:ring-primary/30"
                    }`}
                  onClick={() => dispatch(setShippingAddressId(address.id))}
                  tabIndex={0}
                  role="button"
                  aria-pressed={address.id == shippingAddressId}
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
              <Popover
                open={isPopoverOpen}
                onOpenChange={setIsPopoverOpen}
              >
                <PopoverTrigger asChild>
                  <Button
                    onClick={handleAddAddress}
                    className="flex items-center gap-2 bg-sky-500 hover:bg-sky-600 text-white rounded-lg transition-all duration-200"
                    disabled={isPopoverOpen || isAddressLoading}
                  >
                    <Plus className="h-4 w-4" />
                    Thêm địa chỉ mới
                  </Button>
                </PopoverTrigger>
                <CreateAddressForm
                  onClose={handleClosePopover}
                  onSuccess={() => {
                    handleClosePopover();
                  }}
                />
              </Popover>
            </div>
          </div>

          <Separator />

          {/* Request Summary */}
          <div className="space-y-6">
            <h4 className="font-bold text-lg text-gray-900">Sản phẩm yêu cầu</h4>

            {selectedAddress && (
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

            <div className="bg-gray-50 p-6 rounded-2xl border">
              <h5 className="font-semibold mb-4 text-gray-800">Danh sách sản phẩm ({linkItem?.length})</h5>
              <div className="space-y-4">
                {/* Future: branch by type for offline/online */}
                {linkItem?.map((item, index) => {
                  // For online requests, item.product is always present
                  // For offline, adapt as needed in the future
                  const product = item.product || {};
                  return (
                    <div key={item.id || index} className="bg-white p-4 rounded-2xl border">
                      <div className="flex items-start gap-4">
                        {/* Image preview section */}
                        {product.images && product.images.length > 0 && (
                          <div className="flex-shrink-0 flex flex-wrap gap-2">
                            {product.images.map((img, idx) => (
                              <img
                                key={img}
                                src={img}
                                alt={`Product preview ${idx + 1}`}
                                className="w-16 h-16 object-cover rounded-lg border"
                              />
                            ))}
                          </div>
                        )}
                        <div className="flex-1 flex flex-col gap-2">
                          <div>
                            <span className="font-medium text-gray-900">{index + 1}. {product.name || "(Chưa có tên)"}</span>
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
                            <strong>Số lượng:</strong> {product.quantity || 1}
                          </div>
                          {product.variantRows && product.variantRows.length > 0 && (
                            <ul className="mt-1 space-y-1">
                              {product.variantRows.map((variant, vIdx) => (
                                <li key={vIdx} className="text-sm text-gray-700 pl-2 border-l-2 border-orange-300">
                                  {variant?.attributeName}: {variant?.fieldValue}
                                </li>
                              ))}
                            </ul>
                          )}
                          {product.description && (
                            <div className="text-sm text-gray-600 bg-gray-50 p-2 rounded">
                              <strong>Ghi chú:</strong> {product.description}
                            </div>
                          )}
                        </div>
                      </div>
                    </div>
                  );
                })}
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
