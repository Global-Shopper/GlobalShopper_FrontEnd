import React from 'react'
import { Link } from 'react-router-dom'
import { ChevronRight } from 'lucide-react'
import { formatDate } from '@/utils/parseDateTime'
import { toast } from 'sonner'
import { getStatusColor, getStatusText } from '@/utils/statusHandler'
import { Calendar, Clock } from 'lucide-react'
import HistoryDialog from '@/components/HistoryDialog'
import { useCancelOrderMutation } from '@/services/gshopApi'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import { AdUpdateShipDialog } from './AdUpdateShipDialog'

const AdOrderDetailHeader = ({ order }) => {
  const [cancelOrder, { isLoading: isCancelLoading }] = useCancelOrderMutation()
  const handleCancelOrder = async () => {
    try {
      await cancelOrder(order.id)
        .unwrap()
        .then(() => {
          toast.success("Đơn hàng đã được hủy thành công.");
        });
    } catch (error) {
      toast.error(`Lỗi khi hủy đơn hàng: ${error.message}`);
    }
  };
  return (
    <div className="space-y-4">
      {/* Breadcrumb */}
      <div className="flex items-center text-sm text-muted-foreground">
        <span>
          <Link to="/admin/orders">Danh sách đơn hàng</Link>
        </span>
        <ChevronRight className="h-4 w-4 mx-2" />
        <span className="text-foreground font-medium">
          Đơn hàng #{order.id}
        </span>
      </div>

      {/* Title and Actions */}
      <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-4">
        <div className="space-y-2">
          <div className="flex items-center gap-3">
            <h1 className="text-2xl font-bold">Đơn hàng</h1>
            <span
              className="text-xs"
            >
              <span
                className={`px-2 py-1 rounded-full text-xs font-medium ${getStatusColor(
                  order.status
                )} group-hover:shadow`}
              >
                {getStatusText(order.status)}
              </span>
            </span>
            {order?.admin?.name && (
              <Badge variant="outline" className="text-xs">
                Admin: {order?.admin?.name}
              </Badge>
            )}
          </div>
          <div className="flex items-center gap-4 text-sm text-muted-foreground">
            <div className="flex items-center gap-1">
              <Calendar className="h-4 w-4" />
              <span>Tạo: {formatDate(order.createdAt)}</span>
            </div>
            <div className="flex items-center gap-1">
              <Clock className="h-4 w-4" />
              <span>Hết hạn: {formatDate(order.expiredAt)}</span>
            </div>
          </div>
        </div>

        <div className="flex gap-2">
          {order.status === "ORDER_REQUESTED" && (
            <>
              <Button
                onClick={handleCancelOrder}
                disabled={isCancelLoading}
                className="bg-blue-600 hover:bg-blue-700"
              >
                {isCancelLoading ? "Đang hủy..." : "Hủy đơn hàng"}
              </Button>
            </>
          )}
          <HistoryDialog history={order.history} />
          {order.status === "ORDER_REQUESTED" && <AdUpdateShipDialog orderId={order.id} />}
        </div>
      </div>
    </div>
  )
}

export default AdOrderDetailHeader