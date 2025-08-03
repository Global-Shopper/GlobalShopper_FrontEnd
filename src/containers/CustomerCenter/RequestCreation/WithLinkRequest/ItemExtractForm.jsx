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

import React, { useRef, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { uploadToCloudinary } from "@/utils/uploadToCloudinary";
import {
  updateProductField,
  updateVariantRow,
  addVariantRow,
  removeVariantRow,
  addImageUrl,
  removeImageUrl,
  selectAllItems,
} from "@/features/onlineReq";

export default function ItemExtractForm({ index }) {
  const dispatch = useDispatch();
  const items = useSelector(selectAllItems);
  const item = items[index]?.product || {};
  const variantRows = item.variantRows || [];
  const fileInputRef = useRef();
  const [isUploading, setIsUploading] = useState(false);
  // Handlers
  const handleFieldChange = (field, value) => {
    dispatch(updateProductField({ index, field, value }));
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
      // Step 1: Add local previews immediately
      const newPreviews = files.map((file) => URL.createObjectURL(file));
      dispatch(updateProductField({ index, field: "localImages", value: [...item.localImages, ...newPreviews] }));
      // Step 2: Upload in background
      for (const file of files) {
        const url = await uploadToCloudinary(file);
        if (url) {
          dispatch(addImageUrl({ itemIndex: index, url }));
        }
      }
    } catch {
      alert("Có lỗi xảy ra khi tải ảnh lên. Vui lòng thử lại.");
    } finally {
      setIsUploading(false);
    }
  };

  const handleRemoveImage = (imgIdx) => {
    dispatch(updateProductField({ index, field: "localImages", value: item.localImages.filter((_, idx) => idx !== imgIdx) }));
    dispatch(removeImageUrl({ itemIndex: index, imageIndex: imgIdx }));
  }
  // Handlers for variant rows
  const handleAddVariantRow = (fieldType) => {
    dispatch(addVariantRow({ itemIndex: index, fieldType }));
  };

  const handleUpdateVariantRow = (variantIdx, changes) => {
    dispatch(updateVariantRow({ itemIndex: index, variantIndex: variantIdx, changes }));
  };

  const handleRemoveVariantRow = (variantIdx) => {
    dispatch(removeVariantRow({ itemIndex: index, variantIndex: variantIdx }));
  };

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
            value={item.name || ""}
            onChange={(e) => handleFieldChange("name", e.target.value)}
            placeholder="Nhập tên sản phẩm"
            className="mt-1 h-10 border-gray-300 focus:border-blue-500 focus:ring-1 focus:ring-blue-500"
          />
        </div>
        <div>
          <Label className="text-sm font-medium text-gray-700">
            Mô tả sản phẩm
          </Label>
          <Textarea
            value={item.description || ""}
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
            {/* Show previews for images not yet uploaded (local only) */}
            {item.localImages.map((url, idx) => (
              <div key={url} className="relative">
                <img
                  src={url}
                  alt={`Item preview ${idx + 1}`}
                  className="w-20 h-20 object-cover rounded-lg border"
                />
                {isUploading && (
                  <div className="absolute top-0 left-0 w-full h-full flex items-center justify-center bg-white/60 rounded-lg">
                    <Loader2 className="h-5 w-5 animate-spin text-blue-500" />
                  </div>
                )}
                <Button
                  type="button"
                  variant="outline"
                  size="sm"
                  onClick={() => handleRemoveImage(idx)}
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
            value={item.quantity || 1}
            onChange={(e) => {
              let value = parseInt(e.target.value) || 1;
              if (value > 10) value = Number.parseInt(e.nativeEvent.data);
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
          {variantRows.map((row, variantIdx) => {
            const isPredefined = PREDEFINED_VARIANT_FIELDS.includes(
              row.attributeName
            );
            return (
              <div key={variantIdx} className="flex gap-2 mb-2 items-center">
                <Select
                  value={isPredefined ? row.attributeName : "Khác"}
                  onValueChange={(value) => {
                    if (value === "Khác") {
                      handleUpdateVariantRow(variantIdx, { attributeName: "" });
                    } else {
                      handleUpdateVariantRow(variantIdx, { attributeName: value });
                    }
                  }}
                >
                  <SelectTrigger className="h-10 min-w-[120px]">
                    <SelectValue placeholder="Chọn thuộc tính" />
                  </SelectTrigger>
                  <SelectContent>
                    {PREDEFINED_VARIANT_FIELDS.filter(
                      (field) =>
                        field === "Khác" ||
                        !variantRows
                          .map((r, i) =>
                            i !== variantIdx ? r.attributeName : null
                          )
                          .includes(field)
                    ).map((opt) => (
                      <SelectItem key={opt} value={opt}>
                        {opt}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
                {/* Inline custom attribute name input for custom fields */}
                {!isPredefined && (
                  <Input
                    value={row.attributeName}
                    onChange={(e) =>
                      handleUpdateVariantRow(variantIdx, {
                        attributeName: e.target.value,
                      })
                    }
                    placeholder="Tên thuộc tính"
                    className="h-10 flex-1"
                  />
                )}
                <Input
                  value={row.fieldValue}
                  onChange={(e) =>
                    handleUpdateVariantRow(variantIdx, {
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
                  onClick={() => handleRemoveVariantRow(variantIdx)}
                  className="text-red-600 hover:text-red-700"
                >
                  <Trash2 className="h-4 w-4" />
                </Button>
              </div>
            );
          })}
          {/* Add Variant Button */}
          <div className="mt-2">
            <Select value={""} onValueChange={handleAddVariantRow}>
              <SelectTrigger className="h-10 w-48">
                <SelectValue placeholder="+ Thêm thuộc tính" />
              </SelectTrigger>
              <SelectContent>
                {PREDEFINED_VARIANT_FIELDS.filter(
                  (field) =>
                    field === "Khác" ||
                    !variantRows.map((r) => r.attributeName).includes(field)
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
