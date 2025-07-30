import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import {
  Select,
  SelectTrigger,
  SelectValue,
  SelectContent,
  SelectItem,
} from "@/components/ui/select";
import { Loader2, Upload, X, Trash2 } from "lucide-react";
import { PREDEFINED_VARIANT_FIELDS } from "@/const/variant";

import React, { useEffect, useRef, useState } from "react";

export default function ItemForm({ initialProduct, index, onChange }) {
  const [product, setProduct] = useState({});
  useEffect(() => {
    setProduct(initialProduct);
  }, [initialProduct]);
  console.log(product);
  const [isUploading, setIsUploading] = useState(false);
  const fileInputRef = useRef();

  // Notify parent if needed
  const notifyChange = (updatedProduct) => {
    setProduct(updatedProduct);
    if (onChange) onChange(updatedProduct);
  };

  // Handlers
  const handleFieldChange = (field, value) => {
    const updatedProduct = { ...product, [field]: value };
    notifyChange(updatedProduct);
  };

  const handleImageUpload = async (event) => {
    const files = Array.from(event.target.files);
    if (!files.length) return;
    for (const file of files) {
      if (!file.type.startsWith("image/")) {
        alert("Vui lòng chọn file hình ảnh");
        return;
      }
      if (file.size > 10 * 1024 * 1024) {
        alert("Kích thước file không được vượt quá 10MB");
        return;
      }
    }
    setIsUploading(true);
    try {
      // TODO: Replace with your upload logic
      const urls = files.map(() => ""); // placeholder
      const updatedProduct = {
        ...product,
        images: [...(product.images || []), ...urls.filter(Boolean)],
      };
      notifyChange(updatedProduct);
    } catch {
      alert("Có lỗi xảy ra khi tải ảnh lên. Vui lòng thử lại.");
    } finally {
      setIsUploading(false);
    }
  };

  const removeImage = (imgIdx) => {
    const updatedProduct = {
      ...product,
      images: product.images.filter((_, i) => i !== imgIdx),
    };
    notifyChange(updatedProduct);
  };

  const addVariantRow = (fieldType) => {
    const updatedProduct = {
      ...product,
      variantRows: [
        ...(product.variantRows || []),
        { fieldType, customFieldName: "", fieldValue: "" },
      ],
    };
    notifyChange(updatedProduct);
  };

  const updateVariantRow = (variantIdx, changes) => {
    const updatedVariantRows = product.variantRows.map((row, i) =>
      i === variantIdx ? { ...row, ...changes } : row
    );
    const updatedProduct = {
      ...product,
      variantRows: updatedVariantRows,
    };
    notifyChange(updatedProduct);
  };

  const removeVariantRow = (variantIdx) => {
    const updatedProduct = {
      ...product,
      variantRows: product.variantRows.filter((_, i) => i !== variantIdx),
    };
    notifyChange(updatedProduct);
  };

  // (Render logic will use local product state and handlers)

  return (
    <div className="mt-4 p-4 bg-white rounded-lg border border-gray-200">
      <h4 className="text-sm font-medium text-gray-700 mb-3">
        Thông tin sản phẩm {index + 1}
      </h4>
      <div className="space-y-4">
        <div>
          <Label className="text-sm font-medium text-gray-700">
            Tên sản phẩm <span className="text-red-500">*</span>
          </Label>
          <Input
            value={product.name || ""}
            onChange={(e) => handleFieldChange("name", e.target.value)}
            placeholder="Nhập tên sản phẩm"
            className="mt-1 h-10 border-gray-300 focus:border-blue-500 focus:ring-1 focus:ring-blue-500"
          />
        </div>
        {console.log(product.description)}
        <div>
          <Label className="text-sm font-medium text-gray-700">
            Mô tả sản phẩm
          </Label>
          <Textarea
            value={product.description || ""}
            onChange={(e) => handleFieldChange("description", e.target.value)}
            placeholder="Nhập mô tả chi tiết sản phẩm"
            rows={3}
            className="mt-1 resize-none border-gray-300 focus:border-blue-500 focus:ring-1 focus:ring-blue-500"
          />
        </div>

        {/* Image Upload Section */}
        <div>
          <Label className="text-sm font-medium text-gray-700 mb-2 block">
            Hình ảnh sản phẩm
          </Label>
          <div className="flex flex-wrap gap-3">
            {product.images?.map((img, imgIdx) => (
              <div key={`${img}-${imgIdx}`} className="relative">
                <img
                  src={img}
                  alt={`Product preview ${imgIdx + 1}`}
                  className="w-20 h-20 object-cover rounded-lg border"
                />
                <Button
                  type="button"
                  variant="outline"
                  size="sm"
                  onClick={() => removeImage(index, imgIdx)}
                  className="absolute -top-2 -right-2 h-6 w-6 p-0 bg-red-500 text-white hover:bg-red-600"
                >
                  <X className="h-3 w-3" />
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
                className="w-20 h-20 border-dashed border-2 border-gray-300 hover:border-blue-400"
              >
                {isUploading ? (
                  <Loader2 className="h-4 w-4 animate-spin" />
                ) : (
                  <Upload className="h-4 w-4" />
                )}
              </Button>
            </div>
          </div>
        </div>

        {/* Quantity */}
        <div>
          <Label className="text-sm font-medium text-gray-700">
            Số lượng <span className="text-red-500">*</span>
          </Label>
          <Input
            type="number"
            min="1"
            max="10"
            value={product.quantity || 1}
            onChange={(e) => {
              let value = parseInt(e.target.value) || 1;
              if (value > 10) value = 10;
              if (value < 1) value = 1;
              handleFieldChange("quantity", value);
            }}
            className="mt-1 h-10 border-gray-300 focus:border-blue-500 focus:ring-1 focus:ring-blue-500 w-32"
          />
        </div>

        {/* Variant Fields with Select Menus */}
        <div>
          <Label className="text-sm font-medium text-gray-700 mb-2 block">
            Thuộc tính sản phẩm
          </Label>
          {product.variantRows?.map((row, variantIdx) => {
            return (
              <div key={variantIdx} className="flex gap-2 mb-2 items-center">
                <Select
                  value={row.fieldType}
                  onValueChange={(value) =>
                    updateVariantRow(variantIdx, {
                      fieldType: value,
                      customFieldName:
                        value === "Khác" ? "" : row.customFieldName,
                    })
                  }
                >
                  <SelectTrigger className="h-10 min-w-[120px]">
                    <SelectValue placeholder="Chọn thuộc tính" />
                  </SelectTrigger>
                  <SelectContent>
                    {PREDEFINED_VARIANT_FIELDS.filter(
                      (field) =>
                        field === "Khác" ||
                        !product.variantRows
                          .map((r) => r.fieldType)
                          .includes(field) ||
                        field === row.fieldType
                    ).map((opt) => (
                      <SelectItem key={opt} value={opt}>
                        {opt}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
                {row.fieldType === "Khác" && (
                  <Input
                    value={row.customFieldName}
                    onChange={(e) =>
                      updateVariantRow(variantIdx, {
                        customFieldName: e.target.value,
                      })
                    }
                    placeholder="Tên thuộc tính"
                    className="h-10 flex-1"
                  />
                )}
                <Input
                  value={row.fieldValue}
                  onChange={(e) =>
                    updateVariantRow(variantIdx, {
                      fieldValue: e.target.value,
                    })
                  }
                  placeholder="Giá trị thuộc tính"
                  className="h-10 flex-1"
                />
                <Button
                  type="button"
                  variant="outline"
                  size="sm"
                  onClick={() => removeVariantRow(variantIdx)}
                  className="text-red-600 hover:text-red-700"
                >
                  <Trash2 className="h-4 w-4" />
                </Button>
              </div>
            );
          })}

          {/* Add Variant Button */}
          <div className="mt-2">
            <Select onValueChange={addVariantRow}>
              <SelectTrigger className="h-10 w-48">
                <SelectValue placeholder="+ Thêm thuộc tính" />
              </SelectTrigger>
              <SelectContent>
                {PREDEFINED_VARIANT_FIELDS.filter(
                  (field) =>
                    field === "Khác" ||
                    !(
                      product.variantRows?.map((r) => r.fieldType) || []
                    ).includes(field)
                ).map((opt) => (
                  <SelectItem key={opt} value={opt}>
                    {opt}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
        </div>
      </div>
    </div>
  );
}
