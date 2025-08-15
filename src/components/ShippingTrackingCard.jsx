import React from 'react'

// Display key shipping tracking information from FedEx-like response
// Expects the raw data returned by useLazyGetShippingTrackingQuery
// Props:
// - data: tracking API response
// - className: optional extra class names
export default function ShippingTrackingCard({ data, className = '' }) {
  const track = data?.output?.completeTrackResults?.[0]?.trackResults?.[0]

  if (!track) {
    return null
  }

  const trackingNumber =
    track?.trackingNumberInfo?.trackingNumber ||
    data?.output?.completeTrackResults?.[0]?.trackingNumber

  const latest = track?.latestStatusDetail
  const status = latest?.statusByLocale || latest?.description || latest?.derivedStatus || 'Unknown'
  const statusCode = latest?.derivedCode || latest?.code || ''
  const statusLocation = [
    latest?.scanLocation?.city,
    latest?.scanLocation?.stateOrProvinceCode,
    latest?.scanLocation?.countryCode,
  ]
    .filter(Boolean)
    .join(', ')

  const service = track?.serviceDetail?.description || track?.serviceDetail?.type || '—'
  const shipperAddr = track?.shipperInformation?.address
  const recipientAddr = track?.recipientInformation?.address
  const weightObj = track?.packageDetails?.weightAndDimensions?.weight?.[0]

  const dateMap = Object.fromEntries(
    (track?.dateAndTimes || []).map((dt) => [dt.type, dt.dateTime])
  )

  const standardETA = track?.standardTransitTimeWindow?.window?.ends
  const estimatedETA = track?.estimatedDeliveryTimeWindow?.window?.ends
  const eta = estimatedETA || standardETA

  const events = track?.scanEvents || []

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

  const fmtAddr = (addr) => {
    if (!addr) return '—'
    const parts = [addr.city, addr.stateOrProvinceCode, addr.countryCode]
      .filter(Boolean)
      .join(', ')
    return parts || '—'
  }

  return (
    <div className={`rounded-lg border border-slate-200 bg-white shadow-sm ${className}`}>
      <div className="border-b border-slate-200 px-4 py-3 flex items-center justify-between">
        <div className="font-semibold text-slate-800">Theo dõi vận chuyển</div>
        {trackingNumber ? (
          <div className="text-sm text-slate-600">Mã vận đơn: <span className="font-medium">{trackingNumber}</span></div>
        ) : null}
      </div>

      <div className="p-4">
        <div className="flex flex-col md:flex-row md:items-start gap-4">
          <div className="flex-1">
            <div className="flex items-center gap-2">
              <span className="inline-flex items-center rounded-full bg-blue-50 text-blue-700 text-xs font-medium px-2 py-1 border border-blue-100">
                {statusCode || 'STATUS'}
              </span>
              <div className="text-slate-800 font-medium">{status}</div>
            </div>
            {statusLocation ? (
              <div className="text-sm text-slate-600 mt-1">Vị trí: {statusLocation}</div>
            ) : null}
          </div>

          <div className="grid grid-cols-2 md:grid-cols-3 gap-x-6 gap-y-2 text-sm">
            <div>
              <div className="text-slate-500">Dịch vụ</div>
              <div className="text-slate-800 font-medium">{service}</div>
            </div>
            <div>
              <div className="text-slate-500">Khối lượng</div>
              <div className="text-slate-800 font-medium">
                {weightObj ? `${weightObj.value} ${weightObj.unit}` : '—'}
              </div>
            </div>
            <div>
              <div className="text-slate-500">Ngày gửi</div>
              <div className="text-slate-800 font-medium">{fmtDate(dateMap.SHIP || dateMap.ACTUAL_PICKUP)}</div>
            </div>
            <div>
              <div className="text-slate-500">Dự kiến giao</div>
              <div className="text-slate-800 font-medium">{fmtDate(eta)}</div>
            </div>
            <div>
              <div className="text-slate-500">Người gửi</div>
              <div className="text-slate-800 font-medium">{fmtAddr(shipperAddr)}</div>
            </div>
            <div>
              <div className="text-slate-500">Người nhận</div>
              <div className="text-slate-800 font-medium">{fmtAddr(recipientAddr)}</div>
            </div>
          </div>
        </div>

        {events.length > 0 ? (
          <div className="mt-4">
            <div className="text-slate-700 font-medium mb-2">Sự kiện gần đây</div>
            <ul className="space-y-3">
              {events.slice(0, 8).map((ev, idx) => (
                <li key={`${ev.date}-${idx}`} className="flex gap-3">
                  <div className="flex-none text-xs text-slate-500 w-40">{fmtDate(ev.date)}</div>
                  <div className="flex-1">
                    <div className="text-sm text-slate-800">{ev.eventDescription || ev.derivedStatus || ev.eventType}</div>
                    <div className="text-xs text-slate-500">
                      {[ev?.scanLocation?.city, ev?.scanLocation?.stateOrProvinceCode, ev?.scanLocation?.countryCode]
                        .filter(Boolean)
                        .join(', ') || '—'}
                    </div>
                  </div>
                </li>
              ))}
            </ul>
          </div>
        ) : null}
      </div>
    </div>
  )
}
