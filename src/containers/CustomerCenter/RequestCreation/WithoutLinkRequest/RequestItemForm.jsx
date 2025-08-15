import { useState, useRef } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectTrigger,
  SelectValue,
  SelectContent,
  SelectItem,
} from "@/components/ui/select";
import { Textarea } from "@/components/ui/textarea";
import { Badge } from "@/components/ui/badge";
import {
  Plus,
  Trash2,
  Package,
  ArrowRight,
  ArrowLeft,
  Upload,
  Image as ImageIcon,
  Loader2,
} from "lucide-react";
import { PREDEFINED_VARIANT_FIELDS } from "@/const/variant";
import { uploadToCloudinary } from "@/utils/uploadToCloudinary";
import { toast } from "sonner";

import { useSelector, useDispatch } from "react-redux";
import {
  setCurrentItemDraftField,
  addDraftImage,
  removeDraftImage,
  addDraftVariantRow,
  updateDraftVariantRow,
  removeDraftVariantRow,
  resetCurrentItemDraft,
  addItem,
  addDraftLocalImage,
  removeDraftLocalImage,
  removeItem,
} from "@/features/offlineReq";

export default function RequestItemForm({
  onNext,
  onBack,
}) {
  const dispatch = useDispatch();
  const currentItemDraft = useSelector((state) => state.rootReducer.offlineReq.currentItemDraft);
  const items = useSelector((state) => state.rootReducer.offlineReq.items);
  const variantRows = currentItemDraft.variantRows || [];
  const [showFieldDropdown, setShowFieldDropdown] = useState(false);
  const [isUploading, setIsUploading] = useState(false);
  const fileInputRef = useRef(null);

  // Redux preview images
  const localImages = currentItemDraft.localImages || [];

  // Compute available fields for adding new variant
  const usedFieldTypes = variantRows.map((row) => row.fieldType);
  const availableFieldTypes = PREDEFINED_VARIANT_FIELDS.filter(
    (field) => field === "Khác" || !usedFieldTypes.includes(field)
  );

  // Handlers
  const updateVariantRow = (idx, changes) => {
    dispatch(updateDraftVariantRow({ index: idx, changes }));
  };

  const addVariantRow = (fieldType) => {
    dispatch(addDraftVariantRow({ fieldType, customFieldName: "", fieldValue: "" }));
    setShowFieldDropdown(false);
  };

  const removeVariantRow = (idx) => {
    dispatch(removeDraftVariantRow(idx));
  };

  const handleImageUpload = async (event) => {
    const files = Array.from(event.target.files);
    if (!files.length) return;
    // Validate all files
    for (const file of files) {
      if (!file.type.startsWith("image/")) {
        toast.error("Vui lòng chọn file hình ảnh");
        return;
      }
      if (file.size > 10 * 1024 * 1024) {
        toast.error("Kích thước file không được vượt quá 10MB");
        return;
      }
    }
    // Step 1: Add local previews immediately to Redux
    for (const file of files) {
      const previewUrl = URL.createObjectURL(file);
      dispatch(addDraftLocalImage(previewUrl));
      console.log(previewUrl);
    }
    setIsUploading(true);
    try {
      for (const file of files) {
        const url = await uploadToCloudinary(file);
        if (url) {
          dispatch(addDraftImage(url));
        }
      }
    } catch {
      alert("Có lỗi xảy ra khi tải ảnh lên. Vui lòng thử lại.");
    } finally {
      setIsUploading(false);
    }
  }; 
  const removeImage = (idx, isPreview = false) => {
    if (isPreview) {
      // Remove preview image from Redux and revoke object URL
      const url = localImages[idx];
      if (url && url.startsWith("blob:")) URL.revokeObjectURL(url);
      dispatch(removeDraftLocalImage(idx));
    } else {
      // Remove from uploaded images in Redux
      dispatch(removeDraftImage(idx));
    }
  };
  const addRequestItem = () => {
    if (!currentItemDraft.productName.trim()) {
      alert("Vui lòng nhập tên sản phẩm");
      return;
    }
    dispatch(addItem());
    dispatch(resetCurrentItemDraft());
    setShowFieldDropdown(false);
    if (fileInputRef.current) fileInputRef.current.value = "";
  };

  const removeRequestItem = (requestItemId) => {
    dispatch(removeItem(requestItemId));
  };

  // Render
  return (
    <div className="space-y-6">
      {/* Request Items List */}
      {items.length > 0 && (
        <Card className="shadow-lg p-2 py-4">
          <CardHeader className="bg-gradient-to-r from-orange-600 to-orange-700 text-white rounded-lg">
            <CardTitle className="flex items-center gap-3 text-xl">
              <Package className="h-5 w-5" />
              Danh sách sản phẩm yêu cầu ({items.length})
            </CardTitle>
          </CardHeader>
          <CardContent className="p-0">
            <div className="divide-y">
              {items.map((requestItem) => (
                <div
                  key={requestItem.id}
                  className="p-6 hover:bg-gray-50 transition-colors"
                >
                  <div className="flex items-start justify-between gap-4">
                    <div className="flex-1 space-y-3">
                      <div className="flex items-start gap-4">
                        {requestItem.localImages.length > 0 && (
                          <div className="flex-shrink-0 flex flex-wrap gap-2">
                            {requestItem.localImages.map((img, idx) => (
                              <img
                                key={img}
                                src={img}
                                alt={`Product preview ${idx + 1}`}
                                className="w-16 h-16 object-contain rounded-lg border"
                              />
                            ))}
                          </div>
                        )}
                        <div className="flex-1">
                          <div className="flex items-center gap-2 mb-2">
                            <h3 className="font-semibold text-lg">
                              {requestItem.productName}
                            </h3>
                            <Badge variant="outline">
                              Số lượng: {requestItem.quantity}
                            </Badge>
                          </div>
                          {/* Display variants if present */}
                          {requestItem.variantRows && requestItem.variantRows.length > 0 && requestItem.variantRows.map((row, vIdx) => (
                            <p key={vIdx} className="text-sm text-gray-600">
                              {row.fieldType === "Khác" ? row.customFieldName : row.fieldType}: {row.fieldValue}
                            </p>
                          ))}
                          {requestItem.description && (
                            <p className="text-sm text-gray-600 bg-gray-100 p-2 rounded mt-2">
                              💬 {requestItem.description}
                            </p>
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
      <Card className="shadow-lg p-2 py-4">
        <CardHeader className="bg-gradient-to-r from-orange-600 to-orange-700 text-white rounded-lg">
          <CardTitle className="flex items-center gap-3 text-xl">
            <Plus className="h-5 w-5" />
            Thêm sản phẩm yêu cầu mới
          </CardTitle>
        </CardHeader>
        <CardContent className="p-8 space-y-6">
          {/* Request Item Info */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            <div className="space-y-2">
              <Label
                htmlFor="requestItemName"
                className="text-base font-medium"
              >
                Tên sản phẩm *
              </Label>
              <Input
                id="requestItemName"
                value={currentItemDraft.productName}
                onChange={e => dispatch(setCurrentItemDraftField({ field: "productName", value: e.target.value }))}
                placeholder="Ví dụ: Áo thun nam Nike, Giày sneaker Adidas..."
                className="h-12"
              />
            </div>
            <div className="space-y-2">
              <Label
                htmlFor="requestItemNote"
                className="text-base font-medium"
              >
                Mô tả về sản phẩm
              </Label>
              <Textarea
                id="requestItemNote"
                value={currentItemDraft.description}
                onChange={e => dispatch(setCurrentItemDraftField({ field: "description", value: e.target.value }))}
                placeholder="Mô tả, ghi chú thêm về sản phẩm nếu có..."
                rows={4}
                className="resize-none"
              />
            </div>
          </div>

          {/* Image Upload Section */}
          <div className="space-y-4">
            <Label className="text-base font-medium">
              Hình ảnh sản phẩm (có thể chọn nhiều)
            </Label>
            <div className="flex flex-wrap gap-4">
              {/* Show previews for images not yet uploaded (local only, from Redux) */}
              {localImages.map((url, idx) => (
                <div key={url} className="relative">
                  <img
                    src={url}
                    alt={`Product preview ${idx + 1}`}
                    className="w-24 h-24 object-contain rounded-lg border"
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
                    onClick={() => removeImage(idx, true)}
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
                  Hỗ trợ: JPG, PNG, GIF. Tối đa 5MB mỗi ảnh, chọn nhiều ảnh cùng
                  lúc.
                </p>
              </div>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label
                htmlFor="requestItemQuantity"
                className="text-base font-medium"
              >
                Số lượng *
              </Label>
              <Input
                id="requestItemQuantity"
                type="number"
                min="1"
                max="10"
                value={currentItemDraft.quantity}
                onChange={e => {
                  let value = Number.parseInt(e.target.value) || 1;
                  if (value > 10) value = Number.parseInt(e.nativeEvent.data);
                  dispatch(setCurrentItemDraftField({ field: "quantity", value }));
                }}
                className="h-12"
              />
            </div>
            <div className="space-y-2">
              <Label
                htmlFor="requestItemLink"
                className="text-base font-medium"
              >
                Link sản phẩm (nếu có)
              </Label>
              <Input
                id="requestItemLink"
                value={currentItemDraft.productURL}
                onChange={e => dispatch(setCurrentItemDraftField({ field: "productURL", value: e.target.value }))}
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
                  onValueChange={(value) =>
                    updateVariantRow(idx, {
                      fieldType: value,
                      customFieldName:
                        value === "Khác" ? "" : row.customFieldName,
                    })
                  }
                >
                  <SelectTrigger className="h-12 min-w-[120px]">
                    <SelectValue placeholder="Chọn thuộc tính" />
                  </SelectTrigger>
                  <SelectContent>
                    {PREDEFINED_VARIANT_FIELDS.filter(
                      (field) =>
                        field === "Khác" ||
                        !usedFieldTypes.includes(field) ||
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
                      updateVariantRow(idx, { customFieldName: e.target.value })
                    }
                    placeholder="Tên thuộc tính"
                    className="h-12 flex-1"
                  />
                )}
                <Input
                  value={row.fieldValue}
                  onChange={(e) =>
                    updateVariantRow(idx, { fieldValue: e.target.value })
                  }
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
                    availableFieldTypes.map((opt) => (
                      <SelectItem key={opt} value={opt}>
                        {opt}
                      </SelectItem>
                    ))
                  )}
                </SelectContent>
              </Select>
            </div>
          </div>

          <Button
            onClick={addRequestItem}
            className="w-full h-12 bg-green-600 hover:bg-green-700"
          >
            <Plus className="h-5 w-5 mr-2" />
            Thêm sản phẩm vào danh sách yêu cầu
          </Button>
        </CardContent>
      </Card>

      {/* Navigation */}
      <div className="flex gap-4">
        <Button
          variant="outline"
          onClick={onBack}
          className="flex-1 h-12 bg-transparent"
        >
          <ArrowLeft className="h-4 w-4 mr-2" />
          Quay lại
        </Button>
        <Button
          onClick={() => onNext()}
          className="flex-1 h-12"
          disabled={items.length === 0}
        >
          Tiếp tục
          <ArrowRight className="h-4 w-4 ml-2" />
        </Button>
      </div>
    </div>
  );
}
