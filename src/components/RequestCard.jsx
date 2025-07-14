import { Calendar, MapPin, User, Package, ExternalLink } from "lucide-react"
import { Card, CardContent } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"

// Helper function to format date
const formatDate = (dateString) => {
  const date = new Date(parseInt(dateString))
  return date.toLocaleDateString('vi-VN', {
    year: 'numeric',
    month: 'short',
    day: 'numeric',
    hour: '2-digit',
    minute: '2-digit'
  })
}

// Helper function to get status badge variant
const getStatusBadgeVariant = (status) => {
  switch (status) {
    case 'SENT':
      return 'default'
    case 'PROCESSING':
      return 'secondary'
    case 'COMPLETED':
      return 'default'
    case 'CANCELLED':
      return 'destructive'
    default:
      return 'outline'
  }
}

// Helper function to get status text
const getStatusText = (status) => {
  switch (status) {
    case 'SENT':
      return 'Đã gửi'
    case 'CHECKING':
      return 'Đang xử lý'
    case 'QUOTED':
      return 'Đã báo giá'
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

const RequestCard = ({ request }) => {
  return (
    <Card className="shadow-sm hover:shadow-md transition-shadow">
      <CardContent className="p-6">
        {/* Header */}
        <div className="flex items-start justify-between mb-4">
          <div className="space-y-1">
            <div className="flex items-center gap-2">
              <Badge variant={getStatusBadgeVariant(request.status)}>
                {getStatusText(request.status)}
              </Badge>
              <Badge variant="outline">
                {getRequestTypeText(request.requestType)}
              </Badge>
            </div>
          </div>
        </div>

        {/* Customer Info */}
        <div className="flex items-center gap-2 mb-4">
          <User className="h-4 w-4 text-gray-400" />
          <span className="text-sm font-medium">{request.customer?.name}</span>
        </div>

        {/* Shipping Address */}
        <div className="flex items-start gap-2 mb-4">
          <MapPin className="h-4 w-4 text-gray-400 mt-0.5" />
          <div className="text-sm">
            <p className="font-medium">{request.shippingAddress?.name}</p>
            <p className="text-gray-600">{request.shippingAddress?.location}</p>
            <p className="text-gray-500">{request.shippingAddress?.phoneNumber}</p>
          </div>
        </div>

        {/* Request Items */}
        <div className="space-y-3 mb-4">
          <div className="flex items-center gap-2">
            <Package className="h-4 w-4 text-gray-400" />
            <span className="text-sm font-medium">Sản phẩm ({request.requestItems.length})</span>
          </div>
          {request.requestItems.map((item, index) => (
            <div key={item.id} className="pl-6 space-y-1">
              <div className="flex items-center justify-between">
                <p className="text-sm font-medium">{item.productName}</p>
                <span className="text-sm text-gray-500">x{item.quantity}</span>
              </div>
              {item.productURL && (
                <div className="flex items-center gap-1">
                  <ExternalLink className="h-3 w-3 text-gray-400" />
                  <a 
                    href={item.productURL} 
                    target="_blank" 
                    rel="noopener noreferrer"
                    className="text-xs text-blue-600 hover:underline"
                  >
                    Xem link sản phẩm
                  </a>
                </div>
              )}
              {item.variants && item.variants.length > 0 && (
                <p className="text-xs text-gray-500">
                  Loại sản phẩm: {item.variants.join(', ')}
                </p>
              )}
            </div>
          ))}
        </div>

        {/* Dates */}
        <div className="flex items-center gap-2 text-sm text-gray-500">
          <Calendar className="h-4 w-4" />
          <span>Tạo: {formatDate(request.createdAt)}</span>
        </div>
      </CardContent>
    </Card>
  )
}

export default RequestCard
