import React, { useState } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { getStatusColor, getStatusText } from "@/utils/statusHandler"
import { Button } from "@/components/ui/button"
import {
  Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription, DialogFooter
} from "@/components/ui/dialog"
import { Textarea } from "@/components/ui/textarea"
import { Rating, RatingButton } from '@/components/ui/shadcn-io/rating';
import { useCreateFeedbackMutation, useCreateRefundMutation } from "@/services/gshopApi"
import { toast } from "sonner"

function formatVND(value) {
  if (typeof value !== "number") return value
  return value.toLocaleString("vi-VN", { style: "currency", currency: "VND" })
}
function formatDateTime(ts) {
  if (!ts) return ""
  try { return new Date(ts).toLocaleString("vi-VN", { dateStyle: "medium", timeStyle: "short" }) } catch { return "" }
}

const OrderInfo = ({ order }) => {
  const [createFeedback] = useCreateFeedbackMutation()
  const [createRefund] = useCreateRefundMutation()
  const statusCls = getStatusColor(order.status)
  const statusText = getStatusText(order.status)
  const itemCount = order.orderItems?.length || 0

  const [fbOpen, setFbOpen] = useState(false)
  const [rfOpen, setRfOpen] = useState(false)

  // Feedback fields
  const [fbRating, setFbRating] = useState(5)
  const [fbContent, setFbContent] = useState("")
  // Refund fields
  const [rfContent, setRfContent] = useState("")
  if (!order) return null

  const handleCreateFeedback = () => {
    createFeedback({
      orderId: order.id,
      rating: fbRating,
      comment: fbContent
    }).unwrap().then(() => {
      toast.success("Gửi đánh giá thành công")
    }).catch((error) => {
      toast.error("Gửi đánh giá thất bại")
      console.error(error)
    })
  }

  const handleCreateRefund = () => {
    createRefund({
      orderId: order.id,
      reason: rfContent,
      evidence: [
        "image1.jpg",
        "image2.jpg",
        "image3.jpg"
      ]
    }).unwrap().then(() => {
      toast.success("Gửi yêu cầu hoàn tiền thành công")
    }).catch((error) => {
      toast.error("Gửi yêu cầu hoàn tiền thất bại")
      console.error(error)
    })
  }

  return (
    <>
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center justify-between gap-3">
            <span className="text-xl">Đơn hàng #{order.id}</span>
            <span className={`px-2.5 py-1 rounded text-xs font-semibold ${statusCls}`}>{statusText}</span>

            {order.status === "DELIVERED" && (
              <span className="text-xs text-gray-500 flex gap-2">
                {!order.feedback ?
                  <Button variant="outline" size="sm" onClick={() => setFbOpen(true)}>Feedback</Button> :
                  <Button variant="outline" size="sm" onClick={() => setFbOpen(true)}><span className="text-yellow-500">{order.feedback?.rating}★</span>  </Button>
                }
                <Button variant="outline" size="sm" onClick={() => setRfOpen(true)}>Yêu cầu hoàn tiền</Button>
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
              <div className="font-semibold">{formatVND(order.totalPrice)}</div>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Modal Feedback */}
      <Dialog open={fbOpen} onOpenChange={setFbOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Feedback</DialogTitle>
            <DialogDescription className="sr-only">
              Gửi đánh giá cho đơn hàng #{order?.id}
            </DialogDescription>
          </DialogHeader>
            {order.feedback ?
              <div className="space-y-2">
                <div className="text-sm font-medium">Đánh giá</div>
                <div className="text-yellow-500">{order.feedback?.rating}★</div>
                <div className="text-sm font-medium">Nội dung</div>
                <div className="text-sm">{order.feedback?.comment}</div>
              </div> : 
              <>
                {/* Rating */}
                <div className="space-y-2">
                  <div className="text-sm font-medium">Đánh giá</div>
                    <Rating onValueChange={setFbRating} value={fbRating}>
                      {Array.from({ length: 5 }).map((_, index) => (
                        <RatingButton className="text-yellow-500" key={index} />
                      ))}
                    </Rating>
                </div>

                {/* Content input */}
                <div className="space-y-2">
                  <div className="text-sm font-medium">Nội dung</div>
                  <Textarea
                    placeholder="Nhập cảm nhận của bạn…"
                    value={fbContent}
                    onChange={(e) => setFbContent(e.target.value)}
                    rows={5}
                  />
                </div>

                <DialogFooter>
                  <Button variant="outline" onClick={() => setFbOpen(false)}>Đóng</Button>
                  <Button
                    onClick={() => {
                      handleCreateFeedback()
                      setFbOpen(false)
                    }}
                    disabled={!fbContent.trim()}
                  >
                    Gửi
                  </Button>
                </DialogFooter>              
              </> 
            }
          
        </DialogContent>
      </Dialog>

      {/* Modal Refund */}
      <Dialog open={rfOpen} onOpenChange={setRfOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Yêu cầu hoàn tiền</DialogTitle>
            <DialogDescription className="sr-only">
              Tạo yêu cầu hoàn tiền cho đơn hàng #{order?.id}
            </DialogDescription>
          </DialogHeader>

          {/* Content input */}
          <div className="space-y-2">
            <div className="text-sm font-medium">Nội dung yêu cầu</div>
            <Textarea
              placeholder="Mô tả lý do hoàn tiền…"
              value={rfContent}
              onChange={(e) => setRfContent(e.target.value)}
              rows={5}
            />
          </div>

          <DialogFooter>
            <Button variant="outline" onClick={() => setRfOpen(false)}>Đóng</Button>
            <Button
              onClick={() => {
                handleCreateRefund()
                setRfOpen(false)
              }}
              disabled={!rfContent.trim()}
            >
              Gửi yêu cầu
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </>
  )
}

export default OrderInfo
