import { useState, useRef } from "react"
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
import { Plus, Trash2, Package, ArrowRight, ArrowLeft, Upload, Image as ImageIcon, Loader2 } from "lucide-react"
import { PREDEFINED_VARIANT_FIELDS } from "@/const/variant"
import { uploadToCloudinary } from "@/utils/uploadToCloudinary"

export default function RequestItemForm({ items, onItemsChange, onNext, onBack }) {
  const [currentRequestItem, setCurrentRequestItem] = useState({
    name: "",
    quantity: 1,
    link: "",
    note: "",
    images: [],
    variants: [],
  })
  const [variantRows, setVariantRows] = useState([])
  const [showFieldDropdown, setShowFieldDropdown] = useState(false)
  const [isUploading, setIsUploading] = useState(false)
  const fileInputRef = useRef(null)

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

  const handleImageUpload = async (event) => {
    const files = Array.from(event.target.files)
    if (!files.length) return

    // Validate all files
    for (const file of files) {
      if (!file.type.startsWith('image/')) {
        alert('Vui lòng chọn file hình ảnh')
        return
      }
      if (file.size > 5 * 1024 * 1024) {
        alert('Kích thước file không được vượt quá 5MB')
        return
      }
    }

    setIsUploading(true)
    try {
      const uploadPromises = files.map(file => uploadToCloudinary(file))
      const urls = await Promise.all(uploadPromises)
      setCurrentRequestItem(prev => ({
        ...prev,
        images: [...prev.images, ...urls.filter(Boolean)]
      }))
    } catch {
      alert('Có lỗi xảy ra khi tải ảnh lên. Vui lòng thử lại.')
    } finally {
      setIsUploading(false)
    }
  }

  const removeImage = (idx) => {
    setCurrentRequestItem(prev => ({
      ...prev,
      images: prev.images.filter((_, i) => i !== idx)
    }))
  }

  const addRequestItem = () => {
    if (!currentRequestItem.name.trim()) {
      alert("Vui lòng nhập tên sản phẩm")
      return
    }
    const variants = variantRows
      .filter(row => (row.fieldType === "Khác" ? row.customFieldName.trim() : true) && row.fieldValue.trim())
      .map(row => `${row.fieldType === "Khác" ? row.customFieldName : row.fieldType}: ${row.fieldValue}`)
    const requestItem = {
      ...currentRequestItem,
      id: `requestItem_${Date.now()}`,
      variants,
    }
    onItemsChange([...items, requestItem])
    setCurrentRequestItem({
      name: "",
      quantity: 1,
      link: "",
      note: "",
      images: [],
      variants: [],
    })
    setVariantRows([])
    setShowFieldDropdown(false)
    if (fileInputRef.current) fileInputRef.current.value = ""
  }

  const removeRequestItem = requestItemId => {
    onItemsChange(items.filter(item => item.id !== requestItemId))
  }

  // Render
  return (
    <div className="space-y-6">
      {/* Request Items List */}
      {items.length > 0 && (
        <Card>
          <CardHeader className="bg-gradient-to-r from-green-600 to-green-700 text-white">
            <CardTitle className="flex items-center gap-2">
              <Package className="h-5 w-5" />
              Danh sách sản phẩm yêu cầu ({items.length})
            </CardTitle>
          </CardHeader>
          <CardContent className="p-0">
            <div className="divide-y">
              {items.map(requestItem => (
                <div key={requestItem.id} className="p-6 hover:bg-gray-50 transition-colors">
                  <div className="flex items-start justify-between gap-4">
                    <div className="flex-1 space-y-3">
                      <div className="flex items-start gap-4">
                        {requestItem.images.length > 0 && (
                          <div className="flex-shrink-0 flex flex-wrap gap-2">
                            {requestItem.images.map((img, idx) => (
                              <img
                                key={img}
                                src={img}
                                alt={`Product preview ${idx + 1}`}
                                className="w-16 h-16 object-cover rounded-lg border"
                              />
                            ))}
                          </div>
                        )}
                        <div className="flex-1">
                          <div className="flex items-center gap-2 mb-2">
                            <h3 className="font-semibold text-lg">{requestItem.name}</h3>
                            <Badge variant="outline">Số lượng: {requestItem.quantity}</Badge>
                          </div>
                          {requestItem.variants.map((variant, vIdx) => (
                            <p key={vIdx} className="text-sm text-gray-600">{variant}</p>
                          ))}
                          {requestItem.note && (
                            <p className="text-sm text-gray-600 bg-gray-100 p-2 rounded mt-2">💬 {requestItem.note}</p>
                          )}
                        </div>
                      </div>
                    </div>
                    <Button
                      type="button"
                      onClick={() => removeRequestItem(requestItem.id)}
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

      {/* Add New Request Item */}
      <Card>
        <CardHeader className="bg-gradient-to-r from-purple-600 to-purple-700 text-white">
          <CardTitle className="flex items-center gap-3">
            <Plus className="h-5 w-5" />
            Thêm sản phẩm yêu cầu mới
          </CardTitle>
        </CardHeader>
        <CardContent className="p-8 space-y-6">
          {/* Request Item Info */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            <div className="space-y-2">
              <Label htmlFor="requestItemName" className="text-base font-medium">Tên sản phẩm *</Label>
              <Input
                id="requestItemName"
                value={currentRequestItem.name}
                onChange={e => setCurrentRequestItem(prev => ({ ...prev, name: e.target.value }))}
                placeholder="Ví dụ: Áo thun nam Nike, Giày sneaker Adidas..."
                className="h-12"
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="requestItemNote" className="text-base font-medium">Ghi chú (tuỳ chọn)</Label>
              <Textarea
                id="requestItemNote"
                value={currentRequestItem.note}
                onChange={e => setCurrentRequestItem(prev => ({ ...prev, note: e.target.value }))}
                placeholder="Ghi chú thêm về sản phẩm nếu có..."
                rows={4}
                className="resize-none"
              />
            </div>
          </div>

          {/* Image Upload Section */}
          <div className="space-y-4">
            <Label className="text-base font-medium">Hình ảnh sản phẩm (có thể chọn nhiều)</Label>
            <div className="flex flex-wrap gap-4">
              {currentRequestItem.images.map((img, idx) => (
                <div key={img} className="relative">
                  <img
                    src={img}
                    alt={`Product preview ${idx + 1}`}
                    className="w-24 h-24 object-cover rounded-lg border"
                  />
                  <Button
                    type="button"
                    variant="outline"
                    size="sm"
                    onClick={() => removeImage(idx)}
                    className="absolute -top-2 -right-2 h-6 w-6 p-0 bg-red-500 text-white hover:bg-red-600"
                  >
                    <Trash2 className="h-3 w-3" />
                  </Button>
                </div>
              ))}
              <div>
                <input
                  ref={fileInputRef}
                  type="file"
                  accept="image/*"
                  multiple
                  onChange={handleImageUpload}
                  className="hidden"
                  disabled={isUploading}
                />
                <Button
                  type="button"
                  variant="outline"
                  onClick={() => fileInputRef.current?.click()}
                  disabled={isUploading}
                  className="flex items-center gap-2"
                >
                  {isUploading ? (
                    <>
                      <Loader2 className="h-4 w-4 animate-spin" />
                      Đang tải lên...
                    </>
                  ) : (
                    <>
                      <Upload className="h-4 w-4" />
                      Thêm ảnh
                    </>
                  )}
                </Button>
                <p className="text-sm text-gray-500 mt-1">
                  Hỗ trợ: JPG, PNG, GIF. Tối đa 5MB mỗi ảnh, chọn nhiều ảnh cùng lúc.
                </p>
              </div>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="requestItemQuantity" className="text-base font-medium">Số lượng *</Label>
              <Input
                id="requestItemQuantity"
                type="number"
                min="1"
                max="10"
                value={currentRequestItem.quantity}
                onChange={e => {
                  let value = Number.parseInt(e.target.value) || 1;
                  if (value > 10) value = 10;
                  setCurrentRequestItem(prev => ({ ...prev, quantity: value }));
                }}
                className="h-12"
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="requestItemLink" className="text-base font-medium">Link sản phẩm (nếu có)</Label>
              <Input
                id="requestItemLink"
                value={currentRequestItem.link}
                onChange={e => setCurrentRequestItem(prev => ({ ...prev, link: e.target.value }))}
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

          <Button onClick={addRequestItem} className="w-full h-12 bg-green-600 hover:bg-green-700">
            <Plus className="h-5 w-5 mr-2" />
            Thêm sản phẩm vào danh sách yêu cầu
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
