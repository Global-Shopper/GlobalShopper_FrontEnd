import React from 'react'
import { Link } from 'react-router-dom'
import { ChevronRight } from 'lucide-react'
import { formatDate } from '@/utils/parseDateTime'
import { getStatusColor, getStatusText } from '@/utils/statusHandler'
import { Calendar, Truck } from 'lucide-react'
import HistoryDialog from '@/components/HistoryDialog'
import { Badge } from '@/components/ui/badge'
import { AdUpdateShipDialog } from './AdUpdateShipDialog'
import AdRefundDialog from './AdRefundDialog'
import { formatCurrency } from '@/utils/formatCurrency'
import AdminOffTrackingDialog from '@/components/AdminOffTrackingDialog'
import AdminOnlTrackingDialog from '@/components/AdminOnlTrackingDialog'
import AdCancelOrderDialog from '@/components/AdCancelOrderDialog'

const AdOrderDetailHeader = ({ order }) => {

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
              <Truck className="h-4 w-4" />
              <span>Mã vận đơn: {order?.trackingNumber || 'Chưa có'}</span>
            </div>
            <div className="flex items-center gap-1">
              <span>Phí giao hàng: {formatCurrency(order?.shippingFee || 0, 'VND', 'vn')}</span>
            </div>
          </div>
        </div>

        <div className="grid grid-cols-2 gap-2">
          {order.status === "ORDER_REQUESTED" && order.shippingCarrier !== "fedex" && (
            <>
              <AdCancelOrderDialog order={order} />
            </>
          )}
          <HistoryDialog history={order.history} />
          {/* Admin Tracking dialogs */}
          {
            order?.shippingCarrier === "fedex" ? <AdminOffTrackingDialog order={order} /> : 
            <AdminOnlTrackingDialog order={order} />
          }
          {/* {order?.trackingNumber ? <AdminOffTrackingDialog order={order} /> : null}
          {order?.trackingNumber && order?.shippingCarrier !== "fedex" ? <AdminOnlTrackingDialog order={order} /> : null} */}
          {order.status === "ORDER_REQUESTED" && order.shippingCarrier !== "fedex" && <AdUpdateShipDialog orderId={order.id} />}
          {order.status === "DELIVERED" && <AdRefundDialog order={order} />}
        </div>
      </div>
    </div>
  )
}

export default AdOrderDetailHeader