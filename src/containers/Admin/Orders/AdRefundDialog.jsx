/* eslint-disable no-constant-binary-expression */
import React from 'react'
import { Dialog, DialogClose, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog'
import { Button } from '@/components/ui/button'
import { Undo } from 'lucide-react'
import { useGetRefundByOrderIdQuery } from '@/services/gshopApi'
import { AdConfirmRefundDialog } from './AdConfirmRefundDialog'
import { getStatusColor, getStatusText } from '@/utils/statusHandler'
import { formatCurrency } from '@/utils/formatCurrency'

const AdRefundDialog = ({ order }) => {
  console.log(order)
  const { data: refundOrder, isLoading: isRefundLoading } = useGetRefundByOrderIdQuery(order.id)
  const totalPrice = Number(order.totalPrice || 0) + Number(order.shippingFee || 0)

  const canProcess = !!refundOrder && refundOrder.status === 'PENDING';
  return (
    <Dialog>
      <DialogTrigger>
        <Button className="bg-blue-600 hover:bg-blue-700 gap-2">
          <Undo className="w-4 h-4" />
          Yêu cầu hoàn tiền
        </Button>
      </DialogTrigger>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Yêu cầu hoàn tiền</DialogTitle>
          <DialogDescription>
            Xem xét yêu cầu hoàn tiền
          </DialogDescription>
        </DialogHeader>
        {/* Body */}
        <div className="space-y-4">
          {isRefundLoading ? (
            <div className="text-sm text-gray-500">Đang tải thông tin yêu cầu hoàn tiền...</div>
          ) : !refundOrder ? (
            <div className="text-sm text-gray-500">Không tìm thấy yêu cầu hoàn tiền cho đơn này.</div>
          ) : (
            <div className="space-y-3">
              <div className="flex items-center gap-2">
                <span className={`px-2 py-1 rounded-full text-xs font-medium ${getStatusColor(refundOrder.status)}`}>
                  {getStatusText(refundOrder.status)}
                </span>
                <span className="text-xs text-gray-500">ID: {refundOrder.id}</span>
              </div>
              <div>
                <div className="text-sm font-medium text-gray-700 mb-1">Lý do</div>
                <p className="text-sm text-gray-800 whitespace-pre-line">{refundOrder.reason || '-'}</p>
              </div>
              <div>
                <div className="text-sm font-medium text-gray-700 mb-1">Tỷ lệ hoàn tiền</div>
                <p className="text-sm text-gray-800 whitespace-pre-line">{`${refundOrder.refundRate * 100}%` || '-'}</p>
              </div>
              <div>
                <div className="text-sm font-medium text-gray-700 mb-1">Minh chứng</div>
                {Array.isArray(refundOrder.evidence) && refundOrder.evidence.length > 0 ? (
                  <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-3">
                    {refundOrder.evidence.map((url, idx) => {
                      const isVideo = /\.(mp4|webm|ogg)(\?.*)?$/i.test(url)
                      const isImage = /\.(png|jpe?g|gif|bmp|webp|svg)(\?.*)?$/i.test(url)
                      return (
                        <div key={idx} className="relative">
                          {isVideo ? (
                            <video controls className="w-full h-24 object-contain rounded-lg border bg-black">
                              <source src={url} type={`video/${url.toLowerCase().includes('webm') ? 'webm' : url.toLowerCase().includes('ogg') ? 'ogg' : 'mp4'}`} />
                              Trình duyệt không hỗ trợ phát video.
                            </video>
                          ) : isImage ? (
                            <a href={url} target="_blank" rel="noopener noreferrer" className="block">
                              <img src={url} alt={`evidence-${idx + 1}`} className="w-full h-24 object-contain rounded-lg border" />
                            </a>
                          ) : (
                            <a href={url} target="_blank" rel="noopener noreferrer" className="block text-blue-600 underline text-xs break-all">
                              {url}
                            </a>
                          )}
                        </div>
                      )
                    })}
                  </div>
                ) : (
                  <div className="text-sm text-gray-500">Không có minh chứng</div>
                )}
              </div>
              {console.log(totalPrice)}
              <div className="flex items-center gap-2">
                <div className="text-sm font-medium text-gray-700">Số tiền đã hoàn trả:</div>
                <div className="text-sm text-gray-900">{formatCurrency(totalPrice * refundOrder?.refundRate || 0, "VND", "vn")}</div>
              </div>
              <div className="flex items-center gap-2">
                <div className="text-sm font-medium text-gray-700">Tổng tiền:</div>
                <div className="text-sm text-gray-900">{formatCurrency(totalPrice, "VND", "vn")}</div>
              </div>
            </div>
          )}
        </div>
        <DialogFooter>
          <DialogClose>
            <Button variant="outline">Đóng</Button>
          </DialogClose>
          {/* Approve/Reject actions - only when refundable and not loading */}
          {canProcess && !isRefundLoading && (
            <>
              <AdConfirmRefundDialog type="approve" totalPrice={totalPrice} refundOrder={refundOrder}/>
              <AdConfirmRefundDialog type="reject" refundOrder={refundOrder}/>
            </>
          )}
        </DialogFooter>
      </DialogContent>
    </Dialog>
  )
}

export default AdRefundDialog