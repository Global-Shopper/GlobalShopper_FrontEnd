import React from 'react'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { ExternalLink, Package } from "lucide-react"
import { formatCurrency, getLocaleCurrencyFormat } from '@/utils/formatCurrency'

const OrderItemList = ({ orderItems = [], ecommercePlatform, seller }) => {
  if (!orderItems.length) return null

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Package className="h-5 w-5" />
          Danh sách sản phẩm
        </CardTitle>
        <CardDescription>
          {ecommercePlatform || ''}{seller ? ` • ${seller}` : ''}
          {orderItems.length ? ` • ${orderItems.length} mặt hàng` : ''}
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-2">
        {orderItems.map((item, idx) => (
          <div key={item.id} className="p-3 border rounded-lg transition flex gap-3 items-start">
            <div className="w-14 h-14 flex-shrink-0 bg-gray-50 rounded overflow-hidden border">
              {item?.images?.[0] ? (
                <img src={item.images[0]} alt={item.productName} className="w-full h-full object-contain" />
              ) : (
                <div className="w-full h-full grid place-content-center text-gray-400 text-[10px]">No image</div>
              )}
            </div>

            <div className="flex-1 min-w-0">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2 min-w-0">
                  <span className="text-xs px-2 py-1 rounded bg-gray-100 text-gray-700 shrink-0">#{idx + 1}</span>
                  <span className="font-medium truncate">{item.productName}</span>
                </div>
                <span className="font-semibold text-blue-600">×{item.quantity}</span>
              </div>

              {Array.isArray(item.variants) && item.variants.length > 0 && (
                <div className="mt-1 flex flex-wrap gap-1">
                  {item.variants.map((v, i) => (
                    <span key={i} className="text-xs bg-slate-100 text-slate-700 px-2 py-0.5 rounded">{v}</span>
                  ))}
                </div>
              )}

              <div className="mt-2 flex items-center gap-4 text-sm text-gray-600">
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

              <div className="mt-2 text-sm text-gray-700">
                <span>Giá: </span>
                <span className="font-medium">{formatCurrency(item.basePrice, 'VND', getLocaleCurrencyFormat('VND'))}</span>
              </div>
            </div>
          </div>
        ))}
      </CardContent>
    </Card>
  )
}

export default OrderItemList
