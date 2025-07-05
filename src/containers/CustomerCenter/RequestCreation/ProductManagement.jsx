"use client"
import { Button } from "../ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "../ui/card"
import { Input } from "../ui/input"
import { Label } from "../ui/label"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "../ui/select"
import { Textarea } from "../ui/textarea"
import { Badge } from "../ui/badge"
import { Alert, AlertDescription } from "../ui/alert"
import { Package, Trash2, ExternalLink, AlertTriangle, ArrowRight, ArrowLeft } from "lucide-react"
import { EXTRACTION_STATUS } from "../../types/purchase-request"

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
    <div className="space-y-6">
      <Card>
        <CardHeader className="bg-gradient-to-r from-green-600 to-green-700 text-white">
          <CardTitle className="flex items-center gap-3">
            <Package className="h-5 w-5" />
            Quản lý sản phẩm ({products.length})
          </CardTitle>
        </CardHeader>
        <CardContent className="p-8">
          {failedLinks && failedLinks.size > 0 && (
            <Alert className="mb-6 bg-red-50 border-red-200">
              <AlertTriangle className="h-4 w-4 text-red-600" />
              <AlertDescription className="text-red-800">
                Có {failedLinks.size} sản phẩm không thể trích xuất thông tin tự động. Vui lòng nhập thông tin thủ công
                cho những sản phẩm này.
              </AlertDescription>
            </Alert>
          )}

          <div className="space-y-6">
            {products.map((product, index) => (
              <Card key={product.id} className="border-2">
                <CardHeader className="pb-4">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-3">
                      <Badge variant="outline">Sản phẩm {index + 1}</Badge>
                      {product.extractionStatus === EXTRACTION_STATUS.SUCCESS && (
                        <Badge className="bg-green-600">Trích xuất thành công</Badge>
                      )}
                      {product.extractionStatus === EXTRACTION_STATUS.FAILED && (
                        <Badge variant="destructive">Cần nhập thủ công</Badge>
                      )}
                    </div>
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => removeProduct(product.id)}
                      className="text-red-600 hover:text-red-700"
                    >
                      <Trash2 className="h-4 w-4" />
                    </Button>
                  </div>
                </CardHeader>
                <CardContent className="space-y-4">
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
                          value={product.name}
                          onChange={(e) => updateProduct(product.id, { name: e.target.value })}
                          placeholder="Nhập tên sản phẩm"
                          className="h-10"
                        />
                      </div>

                      <div className="space-y-2">
                        <Label className="text-sm font-medium">Mô tả sản phẩm</Label>
                        <Textarea
                          value={product.description}
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
                            value={product.quantity}
                            onChange={(e) =>
                              updateProduct(product.id, { quantity: Number.parseInt(e.target.value) || 1 })
                            }
                            className="h-10"
                          />
                        </div>

                        <div className="space-y-2">
                          <Label className="text-sm font-medium">Màu sắc *</Label>
                          <Select
                            value={product.color}
                            onValueChange={(value) => updateProduct(product.id, { color: value })}
                          >
                            <SelectTrigger className="h-10">
                              <SelectValue placeholder="Chọn" />
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
                            value={product.size}
                            onValueChange={(value) => updateProduct(product.id, { size: value })}
                          >
                            <SelectTrigger className="h-10">
                              <SelectValue placeholder="Chọn" />
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
                            src={product.image || "/placeholder.svg"}
                            alt={product.name}
                            className="w-full h-32 object-cover rounded border"
                          />
                        </div>
                      )}
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </CardContent>
      </Card>

      <div className="flex gap-4">
        <Button variant="outline" onClick={onBack} className="flex-1 h-12 bg-transparent">
          <ArrowLeft className="h-4 w-4 mr-2" />
          Quay lại
        </Button>
        <Button onClick={onNext} className="flex-1 h-12" disabled={!isFormValid}>
          Tiếp tục
          <ArrowRight className="h-4 w-4 ml-2" />
        </Button>
      </div>
    </div>
  )
}
