import React from 'react'

export default function OffShippingTrackingCard({ data }) {
  const events = Array.isArray(data) ? [...data] : []
  if (!events.length) return null

  const fmtDate = (value) => {
    if (value === null || value === undefined) return '—'
    try {
      const d = typeof value === 'number' ? new Date(value) : new Date(String(value))
      if (Number.isNaN(d.getTime())) return String(value)
      return d.toLocaleString()
    } catch {
      return String(value)
    }
  }

  events.sort((a, b) => Number(b?.eventTime ?? 0) - Number(a?.eventTime ?? 0))
  const latest = events[0]

  const trackingNumber = latest?.trackingNumber || events?.[0]?.trackingNumber || null
  const status = (latest?.shipmentStatus || latest?.eventCode || 'UNKNOWN').toString()
  const statusDesc = latest?.eventDescription?.trim() || status
  const statusLocation = [latest?.city, latest?.state, latest?.country].filter(Boolean).join(', ')

  const statusColor = (s) => {
    switch (String(s || '').toUpperCase()) {
      case 'DELIVERED':
        return 'bg-emerald-50 text-emerald-700 border-emerald-100'
      case 'IN_TRANSIT':
        return 'bg-blue-50 text-blue-700 border-blue-100'
      case 'OUT_FOR_DELIVERY':
      case 'PICKED_UP':
        return 'bg-amber-50 text-amber-700 border-amber-100'
      case 'EXCEPTION':
      case 'FAILED':
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
                {status}
              </span>
            </div>
            {statusDesc ? (
              <div className="text-sm font-bold text-slate-700 mt-1">{statusDesc}</div>
            ) : null}
            {latest?.eventTime ? (
              <div className="text-xs text-slate-500 mt-0.5">Cập nhật gần nhất: {fmtDate(latest.eventTime)}</div>
            ) : null}
            {statusLocation ? (
              <div className="text-xs text-slate-500 mt-0.5">Vị trí: {statusLocation}</div>
            ) : null}
          </div>
        </div>

        <div className="mt-4">
          <div className="text-slate-700 font-medium mb-2">Sự kiện gần đây</div>
          <ul className="space-y-3">
            {events.slice(0, 10).map((ev, idx) => (
              <li key={ev.id || `${ev.eventTime}-${idx}`} className="flex gap-3">
                <div className="flex-none text-xs text-slate-500 w-40">{fmtDate(ev.eventTime)}</div>
                <div className="flex-1">
                  <div className={`text-sm text-slate-800 ${idx === 0 ? 'font-bold' : ''}`}>{(ev.eventDescription || ev.shipmentStatus || ev.eventCode || '').toString().trim()}</div>
                  <div className="text-xs text-slate-500">
                    {[ev?.city, ev?.state, ev?.country].filter(Boolean).join(', ') || '—'}
                  </div>
                </div>
              </li>
            ))}
          </ul>
        </div>
      </div>
    </div>
  )
}
