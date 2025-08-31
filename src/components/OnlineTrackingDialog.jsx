import React from 'react'
import { Dialog, DialogClose, DialogContent, DialogFooter, DialogHeader, DialogTitle, DialogTrigger } from './ui/dialog'
import { Button } from './ui/button'

const fmtDate = (value) => {
  if (!value) return '—'
  try {
    const d = new Date(value)
    if (Number.isNaN(d.getTime())) return String(value)
    return d.toLocaleString()
  } catch {
    return String(value)
  }
}
const OnlineTrackingDialog = ({ data }) => {
  return (
    <Dialog>
      <DialogTrigger>
        <Button variant="ghost">Xem thêm thông tin</Button>
      </DialogTrigger>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Chi tiết vận đơn</DialogTitle>
        </DialogHeader>
        <div className="flex flex-col md:flex-row md:items-start gap-4">
          <div className="grid grid-cols-2 md:grid-cols-3 gap-x-6 gap-y-2 text-sm">
            <div>
              <div className="text-slate-500">Đơn vị vận chuyển</div>
              <div className="text-slate-800 font-medium uppercase">{data.courier_code || '—'}</div>
            </div>
            <div>
              <div className="text-slate-500">SĐT hỗ trợ</div>
              <div className="text-slate-800 font-medium">{data.courier_phone || '—'}</div>
            </div>
            <div>
              <div className="text-slate-500">Ngày tạo</div>
              <div className="text-slate-800 font-medium">{fmtDate(data.created_at)}</div>
            </div>
            <div>
              <div className="text-slate-500">Giao dự kiến</div>
              <div className="text-slate-800 font-medium">{fmtDate(data.milestones?.delivery_date)}</div>
            </div>
            <div>
              <div className="text-slate-500">Thời gian vận chuyển</div>
              <div className="text-slate-800 font-medium">{typeof data.transit_time === 'number' ? `${data.transit_time} ngày` : '—'}</div>
            </div>
            {data.courier_link ? (
              <div className="self-end">
                <a
                  href={data.courier_link}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex text-xs text-blue-600 hover:underline"
                >
                  Xem trên trang vận chuyển
                </a>
              </div>
            ) : null}
          </div>
        </div>
        <DialogFooter>
          <DialogClose>
            <Button>Đóng</Button>
          </DialogClose>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  )
}

export default OnlineTrackingDialog