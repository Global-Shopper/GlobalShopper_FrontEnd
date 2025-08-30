import React from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { getStatusColor, getStatusText } from "@/utils/statusHandler"
import { Button } from "@/components/ui/button"
import OrderFeedbackDialog from "./OrderFeedbackDialog"
import OrderRefundDialog from "./OrderRefundDialog"

function formatVND(value) {
  if (typeof value !== "number") return value
  return value.toLocaleString("vi-VN", { style: "currency", currency: "VND" })
}
function formatDateTime(ts) {
  if (!ts) return ""
  try { return new Date(ts).toLocaleString("vi-VN", { dateStyle: "medium", timeStyle: "short" }) } catch { return "" }
}

const OrderInfo = ({ order }) => {
  const statusCls = getStatusColor(order.status)
  const statusText = getStatusText(order.status)
  const itemCount = order.orderItems?.length || 0
  if (!order) return null


  return (
    <>
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center justify-between gap-3">
            <div className="flex items-center gap-2">
              <span className="text-xl">Đơn hàng #{order.id}</span>
              <span className={`px-2.5 py-1 rounded text-xs font-semibold ${statusCls}`}>{statusText}</span>
            </div>

            {order.status === "DELIVERED" && (
              <span className="text-xs text-gray-500 flex gap-2">
                {!order.feedback ?
                  <OrderFeedbackDialog order={order}/>
                  :
                  <span className="self-center px-2 py-1 rounded text-xs font-semibold bg-yellow-50 text-yellow-500">
                    Đã đánh giá {order.feedback?.rating}★
                  </span>
                }
                <OrderRefundDialog order={order}/>
              </span>
            )}
          </CardTitle>
          <CardDescription>
            {order.ecommercePlatform || ""}{order.seller ? ` • ${order.seller}` : ""}
          </CardDescription>
        </CardHeader>

        <CardContent>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-sm">
            <div>
              <div className="text-gray-500">Ngày tạo</div>
              <div className="font-medium">{formatDateTime(order.createdAt)}</div>
            </div>
            <div>
              <div className="text-gray-500">Số lượng sản phẩm</div>
              <div className="font-medium">{itemCount}</div>
            </div>
            <div>
              <div className="text-gray-500">Phí vận chuyển</div>
              <div className="font-medium">{formatVND(order.shippingFee)}</div>
            </div>
            <div>
              <div className="text-gray-500">Tổng tiền</div>
              <div className="font-semibold">{formatVND(order.totalPrice + order.shippingFee)}</div>
            </div>
          </div>
        </CardContent>
      </Card>
    </>
  )
}

export default OrderInfo
