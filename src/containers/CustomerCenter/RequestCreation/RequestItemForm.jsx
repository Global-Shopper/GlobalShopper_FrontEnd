import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import {
  Select,
  SelectTrigger,
  SelectValue,
  SelectContent,
  SelectItem,
} from "@/components/ui/select"
import { Textarea } from "@/components/ui/textarea"
import { Badge } from "@/components/ui/badge"
import { Plus, Trash2, Package, ArrowRight, ArrowLeft } from "lucide-react"
import { PREDEFINED_VARIANT_FIELDS } from "@/const/variant"

const createEmptyProduct = () => ({
  name: "",
  quantity: 1,
  link: "",
  note: "",
  variants: [],
})

export default function RequestItemForm({ items, onItemsChange, onNext, onBack }) {
  const [currentProduct, setCurrentProduct] = useState(createEmptyProduct())
  const [variantRows, setVariantRows] = useState([])
  const [showFieldDropdown, setShowFieldDropdown] = useState(false)

  // Compute available fields for adding new variant
  const usedFieldTypes = variantRows.map(row => row.fieldType)
  const availableFieldTypes = PREDEFINED_VARIANT_FIELDS.filter(
    field => field === "Khác" || !usedFieldTypes.includes(field)
  )

  // Handlers
  const updateVariantRow = (idx, changes) => {
    setVariantRows(rows =>
      rows.map((row, i) => (i === idx ? { ...row, ...changes } : row))
    )
  }

  const addVariantRow = (fieldType) => {
    setVariantRows(rows => [
      ...rows,
      { fieldType, customFieldName: "", fieldValue: "" }
    ])
    setShowFieldDropdown(false)
  }

  const removeVariantRow = idx => {
    setVariantRows(rows => rows.filter((_, i) => i !== idx))
  }

  const addProduct = () => {
    if (!currentProduct.name.trim()) {
      alert("Vui lòng nhập tên sản phẩm")
      return
    }
    const variants = variantRows
      .filter(row => (row.fieldType === "Khác" ? row.customFieldName.trim() : true) && row.fieldValue.trim())
      .map(row => `${row.fieldType === "Khác" ? row.customFieldName : row.fieldType}: ${row.fieldValue}`)
    const product = {
      ...currentProduct,
      id: `product_${Date.now()}`,
      variants,
    }
    onItemsChange([...items, product])
    setCurrentProduct(createEmptyProduct())
    setVariantRows([])
    setShowFieldDropdown(false)
  }

  const removeProduct = productId => {
    onItemsChange(items.filter(product => product.id !== productId))
  }

  // Render
  return (
    <div className="space-y-6">
      {/* Product List */}
      {items.length > 0 && (
        <Card>
          <CardHeader className="bg-gradient-to-r from-green-600 to-green-700 text-white">
            <CardTitle className="flex items-center gap-2">
              <Package className="h-5 w-5" />
              Danh sách sản phẩm ({items.length})
            </CardTitle>
          </CardHeader>
          <CardContent className="p-0">
            <div className="divide-y">
              {items.map(product => (
                <div key={product.id} className="p-6 hover:bg-gray-50 transition-colors">
                  <div className="flex items-start justify-between gap-4">
                    <div className="flex-1 space-y-3">
                      <div className="flex items-center gap-2">
                        <h3 className="font-semibold text-lg">{product.name}</h3>
                        <Badge variant="outline">Số lượng: {product.quantity}</Badge>
                      </div>
                      {product.variants.map((variant, vIdx) => (
                        <p key={vIdx} className="text-sm text-gray-600">{variant}</p>
                      ))}
                      {product.note && (
                        <p className="text-sm text-gray-600 bg-gray-100 p-2 rounded">💬 {product.note}</p>
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
          {/* Product Info */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            <div className="space-y-2">
              <Label htmlFor="productName" className="text-base font-medium">Tên sản phẩm *</Label>
              <Input
                id="productName"
                value={currentProduct.name}
                onChange={e => setCurrentProduct(prev => ({ ...prev, name: e.target.value }))}
                placeholder="Ví dụ: Áo thun nam Nike, Giày sneaker Adidas..."
                className="h-12"
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="productNote" className="text-base font-medium">Ghi chú (tuỳ chọn)</Label>
              <Textarea
                id="productNote"
                value={currentProduct.note}
                onChange={e => setCurrentProduct(prev => ({ ...prev, note: e.target.value }))}
                placeholder="Ghi chú thêm về sản phẩm nếu có..."
                rows={4}
                className="resize-none"
              />
            </div>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="productQuantity" className="text-base font-medium">Số lượng *</Label>
              <Input
                id="productQuantity"
                type="number"
                min="1"
                max="10"
                value={currentProduct.quantity}
                onChange={e =>
                  setCurrentProduct(prev => ({ ...prev, quantity: Number.parseInt(e.target.value) || 1 }))
                }
                className="h-12"
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="productLink" className="text-base font-medium">Link sản phẩm (nếu có)</Label>
              <Input
                id="productLink"
                value={currentProduct.link}
                onChange={e => setCurrentProduct(prev => ({ ...prev, link: e.target.value }))}
                placeholder="https://example.com/product"
                className="h-12"
              />
            </div>
          </div>

          {/* Variant Fields */}
          <div className="space-y-2">
            <Label className="text-base font-medium">
              Thuộc tính sản phẩm (Kiểu dáng, mô tả, màu sắc, kích thước, v.v.)
            </Label>
            {variantRows.map((row, idx) => (
              <div key={idx} className="flex gap-2 mb-2 items-center">
                <Select
                  value={row.fieldType}
                  onValueChange={value => updateVariantRow(idx, {
                    fieldType: value,
                    customFieldName: value === "Khác" ? "" : row.customFieldName
                  })}
                >
                  <SelectTrigger className="h-12 min-w-[120px]">
                    <SelectValue placeholder="Chọn thuộc tính" />
                  </SelectTrigger>
                  <SelectContent>
                    {PREDEFINED_VARIANT_FIELDS.filter(
                      field => field === "Khác" || !usedFieldTypes.includes(field) || field === row.fieldType
                    ).map(opt => (
                      <SelectItem key={opt} value={opt}>{opt}</SelectItem>
                    ))}
                  </SelectContent>
                </Select>
                {row.fieldType === "Khác" && (
                  <Input
                    value={row.customFieldName}
                    onChange={e => updateVariantRow(idx, { customFieldName: e.target.value })}
                    placeholder="Tên thuộc tính"
                    className="h-12 flex-1"
                  />
                )}
                <Input
                  value={row.fieldValue}
                  onChange={e => updateVariantRow(idx, { fieldValue: e.target.value })}
                  placeholder="Thông tin sản phẩm"
                  className="h-12 flex-1"
                />
                <Button
                  type="button"
                  variant="outline"
                  className="h-12"
                  onClick={() => removeVariantRow(idx)}
                  disabled={variantRows.length === 0}
                >
                  <Trash2 className="h-4 w-4" />
                </Button>
              </div>
            ))}
            <div className="flex gap-2 items-center">
              <Select
                open={showFieldDropdown}
                onOpenChange={setShowFieldDropdown}
                onValueChange={addVariantRow}
                value=""
              >
                <SelectTrigger
                  className="h-12 min-w-[180px]"
                  onClick={() => setShowFieldDropdown(true)}
                >
                  <Plus className="h-4 w-4 mr-1" />
                  <SelectValue placeholder="Thêm thuộc tính" />
                </SelectTrigger>
                <SelectContent>
                  {availableFieldTypes.length === 0 ? (
                    <SelectItem value="" disabled>
                      Không còn thuộc tính nào
                    </SelectItem>
                  ) : (
                    availableFieldTypes.map(opt => (
                      <SelectItem key={opt} value={opt}>
                        {opt}
                      </SelectItem>
                    ))
                  )}
                </SelectContent>
              </Select>
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
        <Button onClick={onNext} className="flex-1 h-12" disabled={items.length === 0}>
          Tiếp tục
          <ArrowRight className="h-4 w-4 ml-2" />
        </Button>
      </div>
    </div>
  )
}
