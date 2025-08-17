import React from 'react'
import { Dialog, DialogClose, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog'
import { Button } from '@/components/ui/button'
import { Undo } from 'lucide-react'
import { useGetRefundByOrderIdQuery } from '@/services/gshopApi'
import { AdConfirmRefundDialog } from './AdConfirmRefundDialog'
import { getStatusColor, getStatusText } from '@/utils/statusHandler'
import { formatCurrency } from '@/utils/formatCurrency'

const AdRefundDialog = ({ orderId }) => {
  const { data: refundOrder, isLoading: isRefundLoading } = useGetRefundByOrderIdQuery(orderId)

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
                <div className="text-sm font-medium text-gray-700 mb-1">Minh chứng</div>
                {Array.isArray(refundOrder.evidence) && refundOrder.evidence.length > 0 ? (
                  <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-3">
                    {refundOrder.evidence.map((url, idx) => (
                      <a key={idx} href={url} target="_blank" rel="noopener noreferrer" className="block">
                        <img src={url} alt={`evidence-${idx + 1}`} className="w-full h-24 object-cover rounded-lg border" />
                      </a>
                    ))}
                  </div>
                ) : (
                  <div className="text-sm text-gray-500">Không có minh chứng</div>
                )}
              </div>
              <div className="flex items-center gap-2">
                <div className="text-sm font-medium text-gray-700">Số tiền yêu cầu hoàn:</div>
                <div className="text-sm text-gray-900">{formatCurrency(refundOrder.amount || 0, "VND", "vn")}</div>
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
              <AdConfirmRefundDialog type="approve" refundId={refundOrder?.id} />
              <AdConfirmRefundDialog type="reject" refundId={refundOrder?.id} />
            </>
          )}
        </DialogFooter>
      </DialogContent>
    </Dialog>
  )
}

export default AdRefundDialog