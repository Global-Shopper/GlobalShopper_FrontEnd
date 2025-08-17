import React from 'react'

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { ExternalLink } from "lucide-react"
import { formatCurrency, getLocaleCurrencyFormat } from '@/utils/formatCurrency'
import { Tabs, TabsList, TabsTrigger, TabsContent } from "@/components/ui/tabs"

const AdOrderItemDetail = ({ item, currency }) => {
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

  return (
    <Card>
      <CardContent className="space-y-4">
        <Tabs defaultValue="info" className="w-full">
          <TabsList>
            <TabsTrigger value="info">Thông tin sản phẩm</TabsTrigger>
            <TabsTrigger value="quote">Chi tiết báo giá</TabsTrigger>
          </TabsList>

          <TabsContent value="info" className="space-y-4">
            <div className="flex flex-col gap-2">
              <h3 className="font-semibold mb-2">{item.productName}</h3>
              <p className="text-sm text-muted-foreground mb-2">
                {item.description}
              </p>
              {/* Images list */}
              {Array.isArray(item.images) && item.images.length > 0 ? (
                <div className="grid grid-cols-3 sm:grid-cols-4 md:grid-cols-5 gap-2">
                  {item.images.map((src, idx) => (
                    <div key={idx} className="w-full aspect-square bg-gray-50 rounded overflow-hidden border">
                      <img src={src} alt={item.productName} className="w-full h-full object-contain" />
                    </div>
                  ))}
                </div>
              ) : (
                <div className="w-28 h-28 bg-gray-50 rounded overflow-hidden border grid place-content-center text-gray-400 text-xs">No image</div>
              )}

              {/* Product link */}
              {item.productURL && (
                <a
                  href={item.productURL}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center gap-1 text-blue-600 hover:underline text-sm w-fit"
                >
                  <ExternalLink className="h-4 w-4" />
                  Xem sản phẩm
                </a>
              )}
              <div className="space-y-2 text-sm">
                <span className="font-medium">Thông số sản phẩm:</span>
                <ul className="mt-1 space-y-1 text-xs">
                  {Array.isArray(item.variants) && item.variants.map((variant, idx) => (
                    <li key={idx} className="bg-gray-50 px-2 py-1 rounded">
                      {variant}
                    </li>
                  ))}
                </ul>
              </div>

              {/* Total per unit in VND */}
              <div className="text-sm">
                <span className="text-gray-600">Giá: </span>
                <span className="font-semibold">{formatCurrency(item.totalVNDPrice, 'VND', getLocaleCurrencyFormat('VND'))}</span>
              </div>
            </div>
          </TabsContent>

          <TabsContent value="quote" className="space-y-4">
            <div className="grid grid-cols-2 gap-4 text-sm">
              <div className="space-y-1">
                <div className="flex justify-between">
                  <span className="text-gray-600">Giá gốc</span>
                  <span className="font-medium">
                    {currency ? (
                      formatCurrency(item?.basePrice ?? 0, currency, getLocaleCurrencyFormat(currency))
                    ) : (
                      item?.basePrice ?? '-'
                    )}
                  </span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-600">Số lượng</span>
                  <span className="font-medium">{item.quantity}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-600">Phí dịch vụ</span>
                  <span className="font-medium">
                    {currency ? (
                      formatCurrency(item?.serviceFee ?? 0, currency, getLocaleCurrencyFormat(currency))
                    ) : (
                      item?.serviceFee ?? '-'
                    )}
                  </span>
                </div>
              </div>

              <div className="space-y-1">
                <div className="flex justify-between">
                  <span className="text-gray-600">Tổng tiền</span>
                  <span className="font-semibold">{formatCurrency(item.totalVNDPrice, 'VND', getLocaleCurrencyFormat('VND'))}</span>
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
          </TabsContent>
        </Tabs>
      </CardContent>
    </Card>
  )
}

export default AdOrderItemDetail