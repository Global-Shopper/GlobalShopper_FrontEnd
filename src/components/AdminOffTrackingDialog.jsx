import React from 'react'
import { Dialog, DialogClose, DialogContent, DialogFooter, DialogHeader, DialogTitle, DialogTrigger } from './ui/dialog'
import { Button } from './ui/button'
import OffShippingTrackingCard from '@/components/OffShippingTrackingCard'

const AdminOffTrackingDialog = ({ order }) => {
  const hasEvents = Array.isArray(order?.shipmentTrackingEvents) && order.shipmentTrackingEvents.length > 0

  return (
    <Dialog>
      <DialogTrigger asChild>
        <Button variant="outline" size="sm">Xem thông tin vận chuyển</Button>
      </DialogTrigger>
      <DialogContent className="!max-w-3xl max-h-[98vh] h-auto overflow-y-auto">
        <DialogHeader>
          <DialogTitle>Chi tiết vận đơn</DialogTitle>
        </DialogHeader>
        {hasEvents ? (
          <div className="mt-2">
            <OffShippingTrackingCard data={order.shipmentTrackingEvents} />
          </div>
        ) : (
          <div className="text-sm text-slate-500">Chưa có thông tin vận chuyển.</div>
        )}
        <DialogFooter>
          <DialogClose asChild>
            <Button>Đóng</Button>
          </DialogClose>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  )
}

export default AdminOffTrackingDialog