import React, { useEffect, useState } from 'react'
import { Dialog, DialogClose, DialogContent, DialogFooter, DialogHeader, DialogTitle, DialogTrigger } from './ui/dialog'
import { Button } from './ui/button'
import OnlShippingTrackingCard from '@/components/OnlShippingTrackingCard'
import { getTracking } from '@/services/trackingMoreService'

const AdminOnlTrackingDialog = ({ order }) => {
  const eligible = Boolean(order?.trackingNumber) && order?.shippingCarrier !== 'fedex'
  const [trackingData, setTrackingData] = useState(null)
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState(null)

  useEffect(() => {
    if (!eligible) return
    setLoading(true)
    setError(null)
    getTracking(order.trackingNumber)
      .then((res) => setTrackingData(res.data))
      .catch((e) => setError(e?.message || 'Lỗi tải dữ liệu'))
      .finally(() => setLoading(false))
  }, [eligible, order?.trackingNumber, order?.shippingCarrier])

  return (
    <Dialog>
      <DialogTrigger asChild>
        <Button variant="outline" size="sm" disabled={!eligible}>Xem thông tin vận chuyển</Button>
      </DialogTrigger>
      <DialogContent className="!max-w-3xl max-h-[98vh] h-auto overflow-y-auto">
        <DialogHeader>
          <DialogTitle>Chi tiết vận đơn</DialogTitle>
        </DialogHeader>
        <div className="mt-2">
          {loading && <div className="text-sm text-slate-500">Đang tải dữ liệu...</div>}
          {!loading && error && <div className="text-sm text-rose-600">{error}</div>}
          {!loading && !error && trackingData?.data?.[0] ? (
            <OnlShippingTrackingCard data={trackingData.data[0]} />
          ) : null}
          {!loading && !error && !trackingData?.data?.[0] && (
            <div className="text-sm text-slate-500">Không có dữ liệu vận đơn từ TrackingMore.</div>
          )}
        </div>
        <DialogFooter>
          <DialogClose asChild>
            <Button>Đóng</Button>
          </DialogClose>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  )
}

export default AdminOnlTrackingDialog