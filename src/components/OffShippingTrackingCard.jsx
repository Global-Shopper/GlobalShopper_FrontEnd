import React from 'react'

  export default function OffShippingTrackingCard({ data }) {
  const events = Array.isArray(data) ? [...data] : []
  if (!events.length) return null

  
  const fmtTimeOnly = (value) => {
    if (value === null || value === undefined) return '—'
    const d = typeof value === 'number' ? new Date(value) : new Date(String(value))
    if (Number.isNaN(d.getTime())) return '—'
    return d.toLocaleTimeString('vi-VN', { hour: '2-digit', minute: '2-digit', second: '2-digit', hour12: false })
  }
  
  const fmtDateShort = (value) => {
    if (value === null || value === undefined) return '—'
    const d = typeof value === 'number' ? new Date(value) : new Date(String(value))
    if (Number.isNaN(d.getTime())) return '—'
    // Example: 02 Jul 2025
    return d.toLocaleDateString('en-GB', { day: '2-digit', month: 'short', year: 'numeric' })
  }
  const latest = events[0]

  const trackingNumber = latest?.trackingNumber || events?.[0]?.trackingNumber || null
  const status = (latest?.shipmentStatus || latest?.eventCode || 'UNKNOWN').toString()
  

  // Helpers for timeline/progress (used only for visuals)
  const normalizeStatus = (s) => {
    const u = String(s || '').toUpperCase()
    if (u.includes('OUT_FOR_DELIVERY')) return 'OUT_FOR_DELIVERY'
    if (u.includes('DELIVERED')) return 'DELIVERED'
    if (u.includes('IN_TRANSIT')) return 'IN_TRANSIT'
    if (u.includes('PICKED_UP')) return 'PICKED_UP'
    if (u.includes('EXCEPTION') || u.includes('FAIL')) return 'EXCEPTION'
    return u || 'UNKNOWN'
  }

  const steps = ['PICKED_UP', 'IN_TRANSIT', 'OUT_FOR_DELIVERY', 'DELIVERED']
  const normStatus = normalizeStatus(status)
  const currentStepIdx = steps.indexOf(normStatus)
  const isException = normStatus === 'EXCEPTION'

  return (
    <div className="rounded-lg border border-slate-200 bg-white shadow-sm">
      <div className="px-4 py-3">
        <div className="text-sm text-slate-700">
          <span className="font-medium">Mã Vận Đơn:</span> <span className="font-semibold">{trackingNumber || '—'}</span>
        </div>
      </div>

      <div className="p-4">
        {/* Milestone progress bar */}
        <div className="comp-tracking-milestone-progress-bar">
          {(() => {
            const labels = ['Chờ lấy hàng', 'Đang vận chuyển', 'Đang giao hàng', 'Đã giao hàng']
            const activeIdx = Math.max(0, Math.min(labels.length - 1, currentStepIdx))
            return (
              <div className="flex w-full items-start">
                {labels.map((label, i) => (
                  <React.Fragment key={label}>
                    <div className="flex flex-col items-center w-24 sm:w-28">
                      <p className="icon-container">
                        <svg width="25" height="24" viewBox="0 0 25 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                          <path fillRule="evenodd" clipRule="evenodd" d="M20.9385 7.69315C21.3368 7.29482 21.3368 6.64899 20.9385 6.25066C20.5402 5.85232 19.8943 5.85232 19.496 6.25066L10.2065 15.5401L6.00639 11.34C5.60805 10.9417 4.96222 10.9417 4.56389 11.34C4.16555 11.7384 4.16555 12.3842 4.56389 12.7825L9.43265 17.6513C9.44877 17.6699 9.46567 17.6881 9.48337 17.7058C9.86978 18.0922 10.4891 18.1038 10.8895 17.7405C10.9025 17.7287 10.9153 17.7165 10.9278 17.704C10.9318 17.7001 10.9357 17.6961 10.9395 17.6921L20.9385 7.69315Z" fill={i <= activeIdx ? '#EE4D2D' : '#CBD5E1'} />
                        </svg>
                      </p>
                      <p className={`text mt-1 text-[11px] text-center ${i <= activeIdx ? 'text-slate-700' : 'text-slate-400'}`}>{label}</p>
                    </div>
                    {i < labels.length - 1 && (
                      <p className={`line-item flex-1 h-0.5 mt-3 ${i < activeIdx ? 'bg-[#EE4D2D]' : 'bg-slate-200'}`} />
                    )}
                  </React.Fragment>
                ))}
              </div>
            )
          })()}
          {isException ? (
            <div className="text-[11px] text-rose-600 mt-2">Có sự cố trong quá trình vận chuyển</div>
          ) : null}
        </div>

        {/* Tracking list */}
        <div className="mt-4">
          <div className="nss-comp-tracking">
            <div className="nss-comp-tracking-content">
              <ul className="space-y-3">
                {events.slice(0, 10).map((ev, idx) => {
                  const desc = (ev.eventDescription || ev.shipmentStatus || ev.eventCode || '').toString().trim()
                  const isCurrent = idx === 0
                  return (
                    <li key={ev.id || `${ev.createdAt}-${idx}`} className="nss-comp-tracking-item">
                      <div className="flex items-start gap-3">
                        {/* Left time */}
                        <div className="left w-24 text-right">
                          <div className="time">
                            <div className="second text-xs text-slate-600 font-medium">{fmtTimeOnly(ev.createdAt)}</div>
                            <div className="day text-[11px] text-slate-500">{fmtDateShort(ev.createdAt)}</div>
                          </div>
                        </div>
                        {/* Mid icon + line */}
                        <div className="mid flex flex-col items-center px-2">
                          <div className="icon">
                            {isCurrent ? (
                              <svg width="16" height="16" viewBox="0 0 16 16" fill="none" xmlns="http://www.w3.org/2000/svg">
                                <rect x="1" y="1" width="14" height="14" rx="7" fill="#19BC5C"></rect>
                                <path fillRule="evenodd" clipRule="evenodd" d="M11.23 6.21967C10.9371 5.92678 10.4623 5.92678 10.1694 6.21967L7.51776 8.87129L6.28033 7.63385C5.98744 7.34096 5.51256 7.34096 5.21967 7.63385C4.92678 7.92675 4.92678 8.40162 5.21967 8.69451L6.98132 10.4562C6.98333 10.4582 6.98536 10.4603 6.9874 10.4623C7.24998 10.7249 7.65882 10.7521 7.95167 10.5438C7.9855 10.5198 8.01777 10.4926 8.0481 10.4623C8.04894 10.4614 8.04977 10.4606 8.05061 10.4598L11.23 7.28033C11.5229 6.98744 11.5229 6.51256 11.23 6.21967Z" fill="white"></path>
                              </svg>
                            ) : (
                              <div className="circle h-2.5 w-2.5 rounded-full bg-slate-300"></div>
                            )}
                          </div>
                          <div className={`line ${idx < Math.min(events.length, 10) - 1 ? 'block' : 'hidden'} flex-1 w-px bg-slate-200 mt-1`}></div>
                        </div>
                        {/* Right message */}
                        <div className="right flex-1">
                          <div className={`message text-sm ${isCurrent ? 'text-slate-900' : 'text-slate-600'}`}>{desc || '—'}</div>
                        </div>
                      </div>
                    </li>
                  )
                })}
              </ul>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
