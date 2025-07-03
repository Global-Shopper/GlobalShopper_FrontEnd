import { Calendar, Eye, Edit, Package, Store, Link, ExternalLink } from "lucide-react"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader } from "@/components/ui/card"
import { Separator } from "@/components/ui/separator"
import { REQUEST_STATUS, REQUEST_TYPE } from "@/const/purchaseReqStatus"

const statusConfig = {
  [REQUEST_STATUS.DRAFT]: { label: "Nháp", color: "bg-gray-500" },
  [REQUEST_STATUS.SENT]: { label: "Đã gửi", color: "bg-orange-500" },
  [REQUEST_STATUS.PROCESSING]: { label: "Đang xử lý", color: "bg-yellow-500" },
  [REQUEST_STATUS.COMPLETED]: { label: "Hoàn thành", color: "bg-green-500" },
  [REQUEST_STATUS.CANCELLED]: { label: "Đã hủy", color: "bg-red-500" },
}

const typeConfig = {
  [REQUEST_TYPE.WITH_LINK]: { label: "Có link", icon: Link, color: "text-blue-600 bg-blue-50" },
  [REQUEST_TYPE.WITHOUT_LINK]: { label: "Không link", icon: Store, color: "text-orange-600 bg-orange-50" },
}

export default function RequestCard({ request }) {
  const statusInfo = statusConfig[request.status]
  const typeInfo = typeConfig[request.type]
  const TypeIcon = typeInfo.icon

  return (
    <Card className="hover:shadow-lg transition-all duration-200 border-0 shadow-md">
      <CardHeader className="pb-3">
        <div className="flex items-start justify-between">
          <div className="space-y-2">
            <div className="flex items-center gap-2">
              <h3 className="font-semibold text-lg text-gray-900">{request.id}</h3>
              <Badge className={statusInfo.color}>{statusInfo.label}</Badge>
            </div>
            <div className="flex items-center gap-2">
              <TypeIcon className="h-4 w-4" />
              <Badge variant="outline" className={typeInfo.color}>
                {typeInfo.label}
              </Badge>
            </div>
          </div>
          <div className="flex gap-1">
            <Button variant="ghost" size="sm">
              <Eye className="h-4 w-4" />
            </Button>
            <Button variant="ghost" size="sm">
              <Edit className="h-4 w-4" />
            </Button>
          </div>
        </div>
      </CardHeader>

      <CardContent className="space-y-4">
        {/* Shop Info for without-link requests */}
        {request.type === REQUEST_TYPE.WITHOUT_LINK && request.shopInfo && (
          <div className="bg-orange-50 p-3 rounded-lg">
            <div className="flex items-center gap-2 mb-2">
              <Store className="h-4 w-4 text-orange-600" />
              <span className="font-medium text-orange-800">Thông tin cửa hàng</span>
            </div>
            <p className="text-sm text-orange-700 font-medium">{request.shopInfo.name}</p>
            <p className="text-xs text-orange-600 truncate">{request.shopInfo.address}</p>
          </div>
        )}

        {/* Products Summary */}
        <div className="space-y-3">
          <div className="flex items-center gap-2">
            <Package className="h-4 w-4 text-gray-600" />
            <span className="font-medium text-gray-900">
              {request.totalProducts} sản phẩm
              {request.estimatedValue && (
                <span className="text-green-600 font-semibold ml-2">({request.estimatedValue})</span>
              )}
            </span>
          </div>

          <div className="space-y-2">
            {request.products.slice(0, 2).map((product) => (
              <div key={product.id} className="flex items-center gap-3 p-2 bg-gray-50 rounded">
                <img
                  src={product.image || "/placeholder.svg"}
                  alt={product.name}
                  className="w-10 h-10 object-cover rounded"
                />
                <div className="flex-1 min-w-0">
                  <p className="text-sm font-medium text-gray-900 truncate">{product.name}</p>
                  <div className="flex items-center gap-2 text-xs text-gray-600">
                    <span>SL: {product.quantity}</span>
                    {product.color && <span>• {product.color}</span>}
                    {product.size && <span>• {product.size}</span>}
                  </div>
                </div>
                {product.link && <ExternalLink className="h-3 w-3 text-blue-600 flex-shrink-0" />}
              </div>
            ))}

            {request.products.length > 2 && (
              <div className="text-center">
                <Badge variant="outline" className="text-xs">
                  +{request.products.length - 2} sản phẩm khác
                </Badge>
              </div>
            )}
          </div>
        </div>

        <Separator />

        {/* Footer */}
        <div className="flex items-center justify-between text-sm text-gray-600">
          <div className="flex items-center gap-1">
            <Calendar className="h-3 w-3" />
            <span>{new Date(request.createdAt).toLocaleDateString("vi-VN")}</span>
          </div>
          <div className="text-xs">Cập nhật: {new Date(request.updatedAt).toLocaleDateString("vi-VN")}</div>
        </div>
      </CardContent>
    </Card>
  )
}
