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
import { uploadToCloudinary } from "@/utils/uploadToCloudinary";

export default function ItemForm({ initialItem, index, onChange }) {
  const [addFieldValue, setAddFieldValue] = useState("");

  // Use local state for variantRows (not inside item)
  const [item, setItem] = useState({
    name: "",
    description: "",
    images: [],
    quantity: 1,
  });
  const [variantRows, setVariantRows] = useState([]);
  const [isUploading, setIsUploading] = useState(false);
  const [previewUrls, setPreviewUrls] = useState([]); // local preview only
  const fileInputRef = useRef();

  const handleAddVariantRow = (value) => {
    addVariantRow(value);
    setAddFieldValue(""); // Reset to show placeholder again
  };
  // Sync initialItem to state
  useEffect(() => {
    setItem({
      name: initialItem?.name || "",
      description: initialItem?.description || "",
      images: initialItem?.images || [],
      quantity: initialItem?.quantity || 1,
    });
    // Convert variants (array of string) to variantRows if needed
    if (Array.isArray(initialItem?.variants)) {
      setVariantRows(
        initialItem.variants.map((v) => {
          // Parse "Color: Red" to {fieldType, customFieldName, fieldValue}
          const match = v.match(/^([^:]+):\s*(.+)$/);
          if (!match)
            return { fieldType: "Khác", customFieldName: v, fieldValue: "" };
          const [_, left, right] = match;
          // If left is in PREDEFINED_VARIANT_FIELDS, use as fieldType
          if (PREDEFINED_VARIANT_FIELDS.includes(left)) {
            return { fieldType: left, customFieldName: "", fieldValue: right };
          }
          return {
            fieldType: "Khác",
            customFieldName: left,
            fieldValue: right,
          };
        })
      );
    } else {
      setVariantRows([]);
    }
  }, [initialItem]);

  // Helper to format variants automatically
  function getFormattedVariants(rows) {
    if (!rows) return [];
    return rows
      .filter(
        (row) =>
          (row.fieldType !== "Khác" ? row.fieldType : row.customFieldName) &&
          row.fieldValue
      )
      .map((row) =>
        row.fieldType === "Khác"
          ? `${row.customFieldName}: ${row.fieldValue}`
          : `${row.fieldType}: ${row.fieldValue}`
      );
  }

  // Notify parent if needed
  const notifyChange = (updated) => {
    const formattedVariants = getFormattedVariants(variantRows);
    const itemWithVariants = { ...updated, variants: formattedVariants };
    setItem(itemWithVariants);
    if (onChange) onChange(itemWithVariants);
  };

  // Handlers
  const handleFieldChange = (field, value) => {
    const updatedItem = { ...item, [field]: value };
    notifyChange(updatedItem);
  };

  const updateVariantRow = (idx, changes) => {
    setVariantRows((rows) =>
      rows.map((row, i) => (i === idx ? { ...row, ...changes } : row))
    );
  };

  const addVariantRow = (fieldType) => {
    setVariantRows((rows) => [
      ...rows,
      { fieldType, customFieldName: "", fieldValue: "" },
    ]);
  };

  const removeVariantRow = (idx) => {
    setVariantRows((rows) => rows.filter((_, i) => i !== idx));
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
      setPreviewUrls((prev) => [...prev, ...newPreviews]);

      // Step 2: Upload in background
      for (const file of files) {
        const url = await uploadToCloudinary(file);
        if (url) {
          // Remove the first preview (FIFO)
          setPreviewUrls((prev) => {
            if (prev.length > 0) {
              URL.revokeObjectURL(prev[0]);
              return prev.slice(1);
            }
            return prev;
          });
          const updatedItem = {
            ...item,
            images: [...(item.images || []), url],
          };
          notifyChange(updatedItem);
        }
      }
    } catch {
      alert("Có lỗi xảy ra khi tải ảnh lên. Vui lòng thử lại.");
    } finally {
      setIsUploading(false);
    }
  };
  const removeImage = (imgIdx) => {
    // Remove preview and revoke object URL
    setPreviewUrls((prev) => {
      if (prev[imgIdx]) URL.revokeObjectURL(prev[imgIdx]);
      return prev.filter((_, i) => i !== imgIdx);
    });
    // Remove from product state (cloud URLs)
    const updatedItem = {
      ...item,
      images: item.images.filter((_, i) => i !== imgIdx),
    };
    notifyChange(updatedItem);
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
            value={item.name || ""}
            onChange={(e) => handleFieldChange("name", e.target.value)}
            placeholder="Nhập tên sản phẩm"
            className="mt-1 h-10 border-gray-300 focus:border-blue-500 focus:ring-1 focus:ring-blue-500"
          />
        </div>
        {console.log(item.description)}
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
            {previewUrls.map((url, idx) => (
              <div key={url} className="relative">
                <img
                  src={url}
                  alt={`Product preview ${idx + 1}`}
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
                  onClick={() => removeImage(idx)}
                  className="absolute -top-2 -right-2 h-6 w-6 p-0 bg-red-500 text-white hover:bg-red-600"
                >
                  <X className="h-3 w-3" />
                </Button>
              </div>
            ))}
            {/* Show uploaded images (cloud URLs) */}
            {item.images?.map((img, imgIdx) => (
              <div key={img} className="relative">
                <img
                  src={img}
                  alt={`Product preview ${imgIdx + 1}`}
                  className="w-20 h-20 object-cover rounded-lg border"
                />
                <Button
                  type="button"
                  variant="outline"
                  size="sm"
                  onClick={() => removeImage(imgIdx)}
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
          {console.log(variantRows)}
          {variantRows.map((row, variantIdx) => (
            <div key={variantIdx} className="flex gap-2 mb-2 items-center">
              <Select
                value={row.fieldType || row.customFieldName || "Khác"}
                onValueChange={(value) => {
                  console.log(value);
                  updateVariantRow(variantIdx, {
                    fieldType: value,
                    customFieldName:
                      value === "Khác" ? "" : row.customFieldName,
                  });
                }}
              >
                <SelectTrigger className="h-10 min-w-[120px]">
                  <SelectValue placeholder="Chọn thuộc tính" />
                </SelectTrigger>
                <SelectContent>
                  {PREDEFINED_VARIANT_FIELDS.filter(
                    (field) =>
                      field === "Khác" ||
                      !variantRows.map((r) => r.fieldType).includes(field) ||
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
          ))}
          {/* Add Variant Button */}
          <div className="mt-2">
            <Select value={addFieldValue} onValueChange={handleAddVariantRow}>
              <SelectTrigger className="h-10 w-48">
                <SelectValue placeholder="+ Thêm thuộc tính" />
              </SelectTrigger>
              <SelectContent>
                {PREDEFINED_VARIANT_FIELDS.filter(
                  (field) =>
                    field === "Khác" ||
                    !variantRows.map((r) => r.fieldType).includes(field)
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
