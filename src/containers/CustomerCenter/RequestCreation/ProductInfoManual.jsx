import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Textarea } from "@/components/ui/textarea"
import { Badge } from "@/components/ui/badge"
import { Plus, Trash2, Package, ImageIcon, ArrowRight, ArrowLeft } from "lucide-react"

// Define createEmptyProduct here:
const createEmptyProduct = () => ({
  name: "",
  description: "",
  quantity: 1,
  color: "",
  size: "",
  variants: [],
  link: "",
  image: "",
  // Add any other fields your product object needs
})

const sizeOptions = ["XS", "S", "M", "L", "XL", "XXL", "XXXL", "Free Size"]
const colorOptions = ["Đỏ", "Xanh dương", "Xanh lá", "Đen", "Trắng", "Vàng", "Hồng", "Tím", "Cam", "Nâu", "Xám"]

export default function ProductInfoManual({ products, onProductsChange, onNext, onBack }) {
  const [currentProduct, setCurrentProduct] = useState(createEmptyProduct())

  const addProduct = () => {
    if (!currentProduct.name?.trim()) {
      alert("Vui lòng nhập tên sản phẩm")
      return
    }

    const product = {
      ...currentProduct,
      id: `product_${Date.now()}`,
    }

    onProductsChange([...products, product])
    setCurrentProduct(createEmptyProduct())
  }

  const removeProduct = (productId) => {
    onProductsChange(products.filter((product) => product.id !== productId))
  }

  return (
    <div className="space-y-6">
      {/* Current Products */}
      {products.length > 0 && (
        <Card>
          <CardHeader className="bg-gradient-to-r from-green-600 to-green-700 text-white">
            <CardTitle className="flex items-center gap-2">
              <Package className="h-5 w-5" />
              Danh sách sản phẩm ({products.length})
            </CardTitle>
          </CardHeader>
          <CardContent className="p-0">
            <div className="divide-y">
              {products.map((product, index) => (
                <div key={product.id} className="p-6 hover:bg-gray-50 transition-colors">
                  <div className="flex items-start justify-between gap-4">
                    <div className="flex-1 space-y-3">
                      <div className="flex items-center gap-2">
                        <h3 className="font-semibold text-lg">{product.name}</h3>
                        <Badge variant="outline">Số lượng: {product.quantity}</Badge>
                      </div>

                      {product.color && (
                        <p className="text-sm text-gray-600">
                          <strong>Màu sắc:</strong> {product.color}
                        </p>
                      )}

                      {product.size && (
                        <p className="text-sm text-gray-600">
                          <strong>Kích thước:</strong> {product.size}
                        </p>
                      )}

                      {product.description && (
                        <p className="text-sm text-gray-600 bg-gray-100 p-2 rounded">💬 {product.description}</p>
                      )}
                    </div>

                    <Button
                      type="button"
                      onClick={() => removeProduct(product.id)}
                      variant="outline"
                      size="sm"
                      className="text-red-600 hover:text-red-700 hover:bg-red-50"
                    >
                      <Trash2 className="h-4 w-4" />
                    </Button>
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      )}

      {/* Add New Product */}
      <Card>
        <CardHeader className="bg-gradient-to-r from-purple-600 to-purple-700 text-white">
          <CardTitle className="flex items-center gap-3">
            <Plus className="h-5 w-5" />
            Thêm sản phẩm mới
          </CardTitle>
        </CardHeader>
        <CardContent className="p-8 space-y-6">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            <div className="space-y-2">
              <Label htmlFor="productName" className="text-base font-medium">
                Tên sản phẩm *
              </Label>
              <Input
                id="productName"
                value={currentProduct.name || ""}
                onChange={(e) => setCurrentProduct((prev) => ({ ...prev, name: e.target.value }))}
                placeholder="Ví dụ: Áo thun nam Nike, Giày sneaker Adidas..."
                className="h-12"
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="productDescription" className="text-base font-medium">
                Mô tả sản phẩm *
              </Label>
              <Textarea
                id="productDescription"
                value={currentProduct.description || ""}
                onChange={(e) => setCurrentProduct((prev) => ({ ...prev, description: e.target.value }))}
                placeholder="Mô tả chi tiết về sản phẩm: màu sắc, kích thước, chất liệu, đặc điểm đặc biệt..."
                rows={4}
                className="resize-none"
              />
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div className="space-y-2">
              <Label htmlFor="productQuantity" className="text-base font-medium">
                Số lượng *
              </Label>
              <Input
                id="productQuantity"
                type="number"
                min="1"
                value={currentProduct.quantity || 1}
                onChange={(e) =>
                  setCurrentProduct((prev) => ({ ...prev, quantity: Number.parseInt(e.target.value) || 1 }))
                }
                className="h-12"
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="productColor" className="text-base font-medium">
                Màu sắc
              </Label>
              <Select
                value={currentProduct.color || ""}
                onValueChange={(value) => setCurrentProduct((prev) => ({ ...prev, color: value }))}
              >
                <SelectTrigger className="h-12">
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
              <Label htmlFor="productSize" className="text-base font-medium">
                Kích thước
              </Label>
              <Select
                value={currentProduct.size || ""}
                onValueChange={(value) => setCurrentProduct((prev) => ({ ...prev, size: value }))}
              >
                <SelectTrigger className="h-12">
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

          <div className="space-y-2">
            <Label htmlFor="productImage" className="text-base font-medium">
              Hình ảnh sản phẩm
            </Label>
            <div className="border-2 border-dashed border-gray-300 rounded-lg p-8 text-center hover:border-gray-400 transition-colors">
              <ImageIcon className="h-12 w-12 text-gray-400 mx-auto mb-3" />
              <p className="text-gray-600 mb-2">Kéo thả hình ảnh hoặc click để chọn</p>
              <p className="text-sm text-gray-500 mb-4">Hỗ trợ: JPG, PNG, GIF (tối đa 5MB)</p>
              <Input type="file" accept="image/*" className="hidden" id="imageUpload" />
              <Button
                variant="outline"
                onClick={() => document.getElementById("imageUpload")?.click()}
                className="bg-transparent"
              >
                Chọn hình ảnh
              </Button>
            </div>
          </div>

          <Button onClick={addProduct} className="w-full h-12 bg-green-600 hover:bg-green-700">
            <Plus className="h-5 w-5 mr-2" />
            Thêm sản phẩm vào danh sách
          </Button>
        </CardContent>
      </Card>

      {/* Navigation */}
      <div className="flex gap-4">
        <Button variant="outline" onClick={onBack} className="flex-1 h-12 bg-transparent">
          <ArrowLeft className="h-4 w-4 mr-2" />
          Quay lại
        </Button>
        <Button onClick={onNext} className="flex-1 h-12" disabled={products.length === 0}>
          Tiếp tục
          <ArrowRight className="h-4 w-4 ml-2" />
        </Button>
      </div>
    </div>
  )
}
