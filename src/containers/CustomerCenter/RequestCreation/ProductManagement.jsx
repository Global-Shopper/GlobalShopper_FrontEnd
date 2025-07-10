import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Textarea } from "@/components/ui/textarea"
import { Badge } from "@/components/ui/badge"
import { Alert, AlertDescription } from "@/components/ui/alert"
import { Package, Trash2, ExternalLink, AlertTriangle, ArrowRight, ArrowLeft } from "lucide-react"

const sizeOptions = ["XS", "S", "M", "L", "XL", "XXL", "XXXL", "Free Size"]
const colorOptions = ["Đỏ", "Xanh dương", "Xanh lá", "Đen", "Trắng", "Vàng", "Hồng", "Tím", "Cam", "Nâu", "Xám"]

export default function ProductManagement({ products, onProductsChange, onNext, onBack, failedLinks }) {
  const updateProduct = (productId, updates) => {
    onProductsChange(products.map((product) => (product.id === productId ? { ...product, ...updates } : product)))
  }

  const removeProduct = (productId) => {
    onProductsChange(products.filter((product) => product.id !== productId))
  }

  const isFormValid = products.length > 0 && products.every((p) => p.name && p.color && p.size)

  return (
    <Card >
      <CardContent className="p-4 py-2">
        {failedLinks?.size > 0 && (
          <Alert className="bg-red-50 border-red-200">
            <AlertTriangle className="h-4 w-4 text-red-600" />
            <AlertDescription className="text-red-800">
              Có {failedLinks.size} sản phẩm không thể trích xuất thông tin tự động. Vui lòng kiểm tra và cập nhật thông tin.
            </AlertDescription>
          </Alert>
        )}

        {products.map((product, index) => (
          <div key={product.id} className="border-t pt-6 first:border-t-0 first:pt-0">
            <div className="flex items-center justify-between">
                {failedLinks?.has(product.link) && (
                  <Badge variant="destructive">Cần nhập thủ công</Badge>
                )}
            </div>

            {product.link && (
              <div className="flex items-center gap-2 text-blue-600 bg-blue-50 p-2 rounded">
                <ExternalLink className="h-4 w-4" />
                <a
                  href={product.link}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="hover:underline text-sm truncate"
                >
                  {product.link}
                </a>
              </div>
            )}

            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              <div className="space-y-4">
                <div className="space-y-2">
                  <Label className="text-sm font-medium">Tên sản phẩm *</Label>
                  <Input
                    value={product.name || ""}
                    onChange={(e) => updateProduct(product.id, { name: e.target.value })}
                    placeholder="Nhập tên sản phẩm"
                    className="h-10"
                  />
                </div>
                <div className="space-y-2">
                  <Label className="text-sm font-medium">Mô tả sản phẩm</Label>
                  <Textarea
                    value={product.description || ""}
                    onChange={(e) => updateProduct(product.id, { description: e.target.value })}
                    placeholder="Mô tả chi tiết sản phẩm"
                    rows={3}
                    className="resize-none"
                  />
                </div>
              </div>
              <div className="space-y-4">
                <div className="grid grid-cols-3 gap-3">
                  <div className="space-y-2">
                    <Label className="text-sm font-medium">Số lượng *</Label>
                    <Input
                      type="number"
                      min="1"
                      value={product.quantity || 1}
                      onChange={(e) =>
                        updateProduct(product.id, { quantity: Number.parseInt(e.target.value) || 1 })
                      }
                      className="h-10"
                    />
                  </div>
                  <div className="space-y-2">
                    <Label className="text-sm font-medium">Màu sắc *</Label>
                    <Select
                      value={product.color || ""}
                      onValueChange={(value) => updateProduct(product.id, { color: value })}
                    >
                      <SelectTrigger className="h-10">
                        <SelectValue placeholder="Chọn màu" />
                      </SelectTrigger>
                      <SelectContent>
                        {colorOptions.map((color) => (
                          <SelectItem key={color} value={color}>
                            {color}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>
                  <div className="space-y-2">
                    <Label className="text-sm font-medium">Size *</Label>
                    <Select
                      value={product.size || ""}
                      onValueChange={(value) => updateProduct(product.id, { size: value })}
                    >
                      <SelectTrigger className="h-10">
                        <SelectValue placeholder="Chọn size" />
                      </SelectTrigger>
                      <SelectContent>
                        {sizeOptions.map((size) => (
                          <SelectItem key={size} value={size}>
                            {size}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>
                </div>
                {product.image && (
                  <div className="space-y-2">
                    <Label className="text-sm font-medium">Hình ảnh sản phẩm</Label>
                    <img
                      src={product.image}
                      alt={product.name || "Product image"}
                      className="w-full h-32 object-cover rounded border"
                    />
                  </div>
                )}
              </div>
            </div>
          </div>
        ))}
      </CardContent>
    </Card>
  )
}