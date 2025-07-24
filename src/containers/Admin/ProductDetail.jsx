import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Separator } from "@/components/ui/separator"
import { Package, ExternalLink } from "lucide-react"

export function ProductDetail({ product, status, quotePrice, onPriceChange, formatCurrency }) {
  console.log(product)
  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Package className="h-5 w-5" />
          Chi tiết và báo giá
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        <div>
          <h3 className="font-semibold mb-2">{product.productName}</h3>
          <p className="text-sm text-muted-foreground mb-3">{product.description}</p>

          {/* Product Images */}
          {product.images && product.images.length > 0 && (
            <div className="mb-3">
              <span className="font-medium text-sm mb-2 block">Hình ảnh sản phẩm:</span>
              <div className="flex gap-2 overflow-x-auto">
                {product.images.map((image, idx) => (
                  <img
                    key={idx}
                    src={image || "/placeholder.svg?height=64&width=64&text=No+Image"}
                    alt={`${product.productName} ${idx + 1}`}
                    className="w-16 h-16 object-cover rounded border flex-shrink-0"
                    onError={(e) => {
                      e.target.src = "/placeholder.svg?height=64&width=64&text=No+Image"
                    }}
                  />
                ))}
              </div>
            </div>
          )}

          <div className="space-y-2 text-sm">
            <div>
              <span className="font-medium">Số lượng:</span> {product.quantity}
            </div>
            <div>
              <span className="font-medium">Link sản phẩm:</span>
              <a
                href={product.productURL}
                target="_blank"
                rel="noopener noreferrer"
                className="ml-2 text-blue-600 hover:underline inline-flex items-center gap-1"
              >
                <ExternalLink className="h-3 w-3" />
                Xem chi tiết
              </a>
            </div>
            {product.variants && product.variants.length > 0 && (
              <div>
                <span className="font-medium">Thông số kỹ thuật:</span>
                <ul className="mt-1 space-y-1 text-xs">
                  {product.variants.map((variant, idx) => (
                    <li key={idx} className="bg-gray-50 px-2 py-1 rounded">
                      {variant}
                    </li>
                  ))}
                </ul>
              </div>
            )}
          </div>
        </div>

        <Separator />
        {status === "CHECKING" && (
          <>
            <div className="space-y-3">
              <Label htmlFor="quote-price" className="text-sm font-medium">
                Báo giá (VND/sản phẩm)
              </Label>
              <Input
                id="quote-price"
                type="number"
                placeholder="Nhập giá..."
                value={quotePrice}
                onChange={(e) => onPriceChange(product.id, e.target.value)}
              />
              {quotePrice && (
                <div className="text-sm">
                  <span className="text-muted-foreground">Tổng: </span>
                  <span className="font-semibold text-green-600">
                    {formatCurrency(Number(quotePrice) * product.quantity)}
                  </span>
                </div>
              )}
            </div>
            <Separator />
            <div className="space-y-3">
              <Label className="text-sm font-medium">Ghi chú sản phẩm</Label>
              <Textarea placeholder="Thêm ghi chú cho sản phẩm này..." rows={3} />
            </div>
            <div className="flex gap-2 pt-2">
              <Button size="sm" className="flex-1">
                Lưu báo giá
              </Button>
            </div>
          </>
        )}
        {status === "SENT" && (
          <div className="bg-yellow-50 border border-yellow-200 text-yellow-700 px-4 py-3 rounded-md">
            <p className="text-sm font-medium">Chức năng báo giá chưa khả dụng</p>
            <p className="text-sm">Vui lòng assign yêu cầu này để bắt đầu quá trình báo giá.</p>
          </div>
        )}
      </CardContent>
    </Card>
  )
}
