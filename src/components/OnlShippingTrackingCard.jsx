import React from 'react'

const OnlShippingTrackingCard = ({ data }) => {
  if (!data) return null

  const trackingNumber = data.tracking_number || data.order_number
  const courierCode = data.courier_code
  const courierLink = data?.origin_info?.tracking_link || data?.origin_info?.weblink || null
  const courierPhone = data?.origin_info?.courier_phone || null

  const status = data.delivery_status || 'unknown'
  const latestEvent = data.latest_event || null
  const latestTime = data.latest_checkpoint_time || null
  const transitDays = data.transit_time

  const milestones = data?.origin_info?.milestone_date || {}
  const events = Array.isArray(data?.origin_info?.trackinfo) ? data.origin_info.trackinfo : []

  const fmtDate = (value) => {
    if (!value) return '—'
    try {
      const d = new Date(value)
      if (Number.isNaN(d.getTime())) return value
      return d.toLocaleString()
    } catch {
      return value
    }
  }

  const statusColor = (s) => {
    switch ((s || '').toLowerCase()) {
      case 'delivered':
        return 'bg-emerald-50 text-emerald-700 border-emerald-100'
      case 'transit':
        return 'bg-blue-50 text-blue-700 border-blue-100'
      case 'pickup':
      case 'outfordelivery':
        return 'bg-amber-50 text-amber-700 border-amber-100'
      case 'exception':
      case 'undelivered':
        return 'bg-rose-50 text-rose-700 border-rose-100'
      default:
        return 'bg-slate-50 text-slate-700 border-slate-200'
    }
  }

  return (
    <div className="rounded-lg border border-slate-200 bg-white shadow-sm">
      <div className="border-b border-slate-200 px-4 py-3 flex items-center justify-between">
        <div className="font-semibold text-slate-800">Theo dõi vận chuyển</div>
        {trackingNumber ? (
          <div className="text-sm text-slate-600">
            Mã vận đơn: <span className="font-medium">{trackingNumber}</span>
          </div>
        ) : null}
      </div>

      <div className="p-4">
        <div className="flex flex-col md:flex-row md:items-start gap-4">
          <div className="flex-1">
            <div className="flex items-center gap-2">
              <span className={`inline-flex items-center rounded-full text-xs font-medium px-2 py-1 border ${statusColor(status)}`}>
                {status?.toUpperCase() || 'STATUS'}
              </span>
            </div>
            {latestEvent ? (
              <div className="text-sm font-bold text-slate-700 mt-1">{latestEvent}</div>
            ) : null}
            {latestTime ? (
              <div className="text-xs text-slate-500 mt-0.5">Cập nhật gần nhất: {fmtDate(latestTime)}</div>
            ) : null}
          </div>

          <div className="grid grid-cols-2 md:grid-cols-3 gap-x-6 gap-y-2 text-sm">
            <div>
              <div className="text-slate-500">Đơn vị vận chuyển</div>
              <div className="text-slate-800 font-medium uppercase">{courierCode || '—'}</div>
            </div>
            <div>
              <div className="text-slate-500">SĐT hỗ trợ</div>
              <div className="text-slate-800 font-medium">{courierPhone || '—'}</div>
            </div>
            <div>
              <div className="text-slate-500">Ngày tạo</div>
              <div className="text-slate-800 font-medium">{fmtDate(data.created_at)}</div>
            </div>
            <div>
              <div className="text-slate-500">Giao dự kiến</div>
              <div className="text-slate-800 font-medium">
                {fmtDate(milestones?.delivery_date)}
              </div>
            </div>
            <div>
              <div className="text-slate-500">Thời gian vận chuyển</div>
              <div className="text-slate-800 font-medium">{typeof transitDays === 'number' ? `${transitDays} ngày` : '—'}</div>
            </div>
            {courierLink ? (
              <div className="self-end">
                <a
                  href={courierLink}
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

        <div className="mt-4">
          <div className="text-slate-700 font-medium mb-2">Mốc thời gian</div>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-3 text-sm">
            <div>
              <div className="text-slate-500">Tạo đơn</div>
              <div className="text-slate-800 font-medium">{fmtDate(milestones?.inforeceived_date)}</div>
            </div>
            <div>
              <div className="text-slate-500">Lấy hàng</div>
              <div className="text-slate-800 font-medium">{fmtDate(milestones?.pickup_date)}</div>
            </div>
            <div>
              <div className="text-slate-500">Giao hàng</div>
              <div className="text-slate-800 font-medium">{fmtDate(milestones?.outfordelivery_date)}</div>
            </div>
            <div>
              <div className="text-slate-500">Đã giao</div>
              <div className="text-slate-800 font-medium">{fmtDate(milestones?.delivery_date)}</div>
            </div>
          </div>
        </div>

        {events.length > 0 ? (
          <div className="mt-4">
            <div className="text-slate-700 font-medium mb-2">Sự kiện gần đây</div>
            <ul className="space-y-3">
              {events.slice(0, 10).map((ev, idx) => (
                <li key={`${ev.checkpoint_date}-${idx}`} className="flex gap-3">
                  <div className="flex-none text-xs text-slate-500 w-40">{fmtDate(ev.checkpoint_date)}</div>
                  <div className="flex-1">
                    <div className={`text-sm text-slate-800 ${idx === 0 ? 'font-bold' : ''}`}>{ev.tracking_detail || ev.checkpoint_delivery_status}</div>
                    <div className="text-xs text-slate-500">
                      {[ev?.city, ev?.state, ev?.country_iso2].filter(Boolean).join(', ') || '—'}
                    </div>
                  </div>
                </li>
              ))}
            </ul>
          </div>
        ) : (
          <div className="mt-4 text-sm text-slate-500">Chưa có sự kiện vận chuyển.</div>
        )}
      </div>
    </div>
  )
}

export default OnlShippingTrackingCard