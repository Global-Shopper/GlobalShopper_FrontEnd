import React from 'react'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { ExternalLink } from "lucide-react"

function formatVND(value) {
  if (typeof value !== 'number') return value
  return value.toLocaleString('vi-VN', { style: 'currency', currency: 'VND' })
}

const AdOrderItemDetail = ({ order, item }) => {
  if (!item) {
    return (
      <Card>
        <CardHeader>
          <CardTitle>Chi tiết sản phẩm</CardTitle>
          <CardDescription>Chọn một sản phẩm ở danh sách bên trái để xem chi tiết.</CardDescription>
        </CardHeader>
      </Card>
    )
  }

  const lineTotal = (item.basePrice || 0) * (item.quantity || 0)

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-start justify-between gap-3">
          <span className="truncate">{item.productName}</span>
          <span className="text-blue-600 font-semibold">×{item.quantity}</span>
        </CardTitle>
        <CardDescription>
          {order?.ecommercePlatform || ''}{order?.seller ? ` • ${order.seller}` : ''}
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="flex gap-4 items-start">
          <div className="w-28 h-28 flex-shrink-0 bg-gray-50 rounded overflow-hidden border">
            {item?.images?.[0] ? (
              <img src={item.images[0]} alt={item.productName} className="w-full h-full object-cover" />
            ) : (
              <div className="w-full h-full grid place-content-center text-gray-400 text-xs">No image</div>
            )}
          </div>
          <div className="flex-1 min-w-0">
            <div className="flex items-center gap-4 text-sm">
              {item.productURL && (
                <a
                  href={item.productURL}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex items-center gap-1 text-blue-600 hover:underline"
                >
                  <ExternalLink className="h-4 w-4" />
                  Xem sản phẩm
                </a>
              )}
            </div>

            {Array.isArray(item.variants) && item.variants.length > 0 && (
              <div className="mt-2 flex flex-wrap gap-1">
                {item.variants.map((v, i) => (
                  <span key={i} className="text-xs bg-slate-100 text-slate-700 px-2 py-0.5 rounded">{v}</span>
                ))}
              </div>
            )}

            {item.description && (
              <p className="mt-3 text-sm text-gray-700 whitespace-pre-line">{item.description}</p>
            )}
          </div>
        </div>

        <div className="grid grid-cols-2 gap-4 text-sm">
          <div className="space-y-1">
            <div className="flex justify-between">
              <span className="text-gray-600">Giá cơ bản</span>
              <span className="font-medium">{formatVND(item.basePrice)}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-gray-600">Số lượng</span>
              <span className="font-medium">{item.quantity}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-gray-600">Phí dịch vụ</span>
              <span className="font-medium">{item.serviceFee}</span>
            </div>
          </div>
          <div className="space-y-1">
            <div className="flex justify-between">
              <span className="text-gray-600">Tổng tiền hàng</span>
              <span className="font-semibold">{formatVND(lineTotal)}</span>
            </div>
          </div>
        </div>

        {Array.isArray(item.taxRates) && item.taxRates.length > 0 && (
          <div>
            <div className="text-sm font-semibold mb-2">Thuế áp dụng</div>
            <div className="space-y-1">
              {item.taxRates.map((t, i) => (
                <div key={i} className="flex items-center justify-between text-sm">
                  <div className="min-w-0">
                    <div className="font-medium truncate">{t.taxName || t.taxType}</div>
                    <div className="text-xs text-gray-500">{t.region || ''}</div>
                  </div>
                  <div className="text-gray-700">{t.rate}%</div>
                </div>
              ))}
            </div>
          </div>
        )}
      </CardContent>
    </Card>
  )
}

export default AdOrderItemDetail