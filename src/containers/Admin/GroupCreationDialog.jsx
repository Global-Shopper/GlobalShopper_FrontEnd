import React, { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Badge } from "@/components/ui/badge";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { X, Plus } from "lucide-react";
import { toast } from "sonner";

export function GroupCreationDialog({
  isOpen,
  onClose,
  selectedItems,
  requestItems,
  onCreateGroup,
}) {
  // Enhanced form state
  const [formData, setFormData] = useState({
    seller: "",
    ecommercePlatform: "",
    contactInfo: [],
    customSeller: "",
    customPlatform: "",
  });
  const [formErrors, setFormErrors] = useState({});
  const [newContactInfo, setNewContactInfo] = useState("");

  // Common options for dropdowns
  const commonSellers = [
    "Amazon Official",
    "Loreal Paris",
    "Nike Store",
    "Apple Store",
    "Samsung Official",
    "Adidas",
    "Uniqlo",
    "Zara",
    "H&M",
    "Other",
  ];

  const commonPlatforms = [
    "Amazon",
    "eBay",
    "Shopee",
    "Lazada",
    "Tiki",
    "Sendo",
    "AliExpress",
    "Taobao",
    "1688",
    "Other",
  ];

  // Form validation
  const validateForm = () => {
    const errors = {};

    // Validate seller
    const finalSeller =
      formData.seller === "Other" ? formData.customSeller : formData.seller;
    if (!finalSeller?.trim()) {
      errors.seller = "Seller is required";
    }

    // Validate platform
    const finalPlatform =
      formData.ecommercePlatform === "Other"
        ? formData.customPlatform
        : formData.ecommercePlatform;
    if (!finalPlatform?.trim()) {
      errors.ecommercePlatform = "Platform is required";
    }

    setFormErrors(errors);
    return Object.keys(errors).length === 0;
  };

  // Reset form
  const resetForm = () => {
    setFormData({
      seller: "",
      ecommercePlatform: "",
      contactInfo: [],
      customSeller: "",
      customPlatform: "",
    });
    setFormErrors({});
    setNewContactInfo("");
  };

  // Handle form field changes
  const handleFormChange = (field, value) => {
    setFormData((prev) => ({ ...prev, [field]: value }));
    // Clear error when user starts typing
    if (formErrors[field]) {
      setFormErrors((prev) => ({ ...prev, [field]: "" }));
    }
  };

  // Handle contact info
  const addContactInfo = () => {
    if (newContactInfo.trim()) {
      setFormData((prev) => ({
        ...prev,
        contactInfo: [...prev.contactInfo, newContactInfo.trim()],
      }));
      setNewContactInfo("");
      if (formErrors.contactInfo) {
        setFormErrors((prev) => ({ ...prev, contactInfo: "" }));
      }
    }
  };

  const removeContactInfo = (index) => {
    setFormData((prev) => ({
      ...prev,
      contactInfo: prev.contactInfo.filter((_, i) => i !== index),
    }));
  };

  // Handle group creation from dialog
  const handleCreateGroupSubmit = async () => {
    if (!validateForm()) {
      toast.error("Please fix the form errors before submitting");
      return;
    }

    try {
      // Prepare payload according to API structure
      const finalSeller =
        formData.seller === "Other" ? formData.customSeller : formData.seller;
      const finalPlatform =
        formData.ecommercePlatform === "Other"
          ? formData.customPlatform
          : formData.ecommercePlatform;

      const selectedItemsArray = requestItems.filter((item) =>
        selectedItems.includes(item.id)
      );

      const groupData = {
        seller: finalSeller,
        ecommercePlatform: finalPlatform,
        contactInfo: formData.contactInfo,
        itemIds: selectedItemsArray.map((item) => item.id),
      };

      console.log("Creating group with data:", groupData);

      // TODO: Replace with actual API call
      // const response = await createSubRequest(groupData);

      if (selectedItemsArray.length > 0 && onCreateGroup) {
        onCreateGroup(selectedItemsArray);
      }

      // Reset form and close modal
      resetForm();
      onClose();

      toast.success("Nhóm đã được tạo thành công!");

      // TODO: Trigger refetch of purchase request data
    } catch (error) {
      toast.error(`Lỗi khi tạo nhóm: ${error.message}`);
    }
  };

  // Handle dialog close
  const handleClose = () => {
    resetForm();
    onClose();
  };

  return (
    <Dialog open={isOpen} onOpenChange={handleClose}>
      <DialogContent className="w-full max-w-2xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle className="text-xl font-semibold">
            Tạo nhóm sản phẩm
          </DialogTitle>
          <DialogDescription>
            Nhập thông tin cho nhóm sản phẩm mới với {selectedItems.length}{" "}
            sản phẩm đã chọn.
          </DialogDescription>
        </DialogHeader>

        <div className="space-y-6 py-4">
          {/* Selected Items Display */}
          {selectedItems.length > 0 && (
            <div className="space-y-3">
              <Label className="text-sm font-medium">
                Sản phẩm được chọn ({selectedItems.length})
              </Label>
              <div className="bg-gray-50 p-4 rounded-lg border">
                <div className="grid gap-2">
                  {selectedItems.map((itemId, index) => {
                    const item = requestItems.find((r) => r.id === itemId);
                    return (
                      <div
                        key={itemId}
                        className="flex items-center justify-between bg-white p-3 rounded border"
                      >
                        <div className="flex items-center gap-3">
                          <span className="bg-blue-100 text-blue-800 text-xs font-medium px-2 py-1 rounded">
                            #{index + 1}
                          </span>
                          <div className="flex-1">
                            <p className="font-medium text-sm">
                              {item?.productName}
                            </p>
                            <p className="text-xs text-gray-500">
                              Số lượng: {item?.quantity}
                            </p>
                          </div>
                        </div>
                      </div>
                    );
                  })}
                </div>
              </div>
            </div>
          )}

          {/* Seller Field */}
          <div className="space-y-2">
            <Label className="text-sm font-medium">
              Seller <span className="text-red-500">*</span>
            </Label>
            <Select
              value={formData.seller}
              onValueChange={(value) => handleFormChange("seller", value)}
            >
              <SelectTrigger
                className={formErrors.seller ? "border-red-500" : ""}
              >
                <SelectValue placeholder="Chọn seller" />
              </SelectTrigger>
              <SelectContent>
                {commonSellers.map((seller) => (
                  <SelectItem key={seller} value={seller}>
                    {seller}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>

            {/* Custom Seller Input */}
            {formData.seller === "Other" && (
              <Input
                placeholder="Nhập tên seller khác"
                value={formData.customSeller}
                onChange={(e) =>
                  handleFormChange("customSeller", e.target.value)
                }
                className={formErrors.seller ? "border-red-500" : ""}
              />
            )}

            {formErrors.seller && (
              <p className="text-red-500 text-xs">{formErrors.seller}</p>
            )}
          </div>

          {/* Platform Field */}
          <div className="space-y-2">
            <Label className="text-sm font-medium">
              Platform <span className="text-red-500">*</span>
            </Label>
            <Select
              value={formData.ecommercePlatform}
              onValueChange={(value) =>
                handleFormChange("ecommercePlatform", value)
              }
            >
              <SelectTrigger
                className={
                  formErrors.ecommercePlatform ? "border-red-500" : ""
                }
              >
                <SelectValue placeholder="Chọn platform" />
              </SelectTrigger>
              <SelectContent>
                {commonPlatforms.map((platform) => (
                  <SelectItem key={platform} value={platform}>
                    {platform}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>

            {/* Custom Platform Input */}
            {formData.ecommercePlatform === "Other" && (
              <Input
                placeholder="Nhập tên platform khác"
                value={formData.customPlatform}
                onChange={(e) =>
                  handleFormChange("customPlatform", e.target.value)
                }
                className={
                  formErrors.ecommercePlatform ? "border-red-500" : ""
                }
              />
            )}

            {formErrors.ecommercePlatform && (
              <p className="text-red-500 text-xs">
                {formErrors.ecommercePlatform}
              </p>
            )}
          </div>

          {/* Contact Info Field */}
          <div className="space-y-2">
            <Label className="text-sm font-medium">Thông tin liên hệ</Label>

            {/* Add Contact Info */}
            <div className="flex gap-2">
              <Input
                placeholder="Email, số điện thoại, địa chỉ..."
                value={newContactInfo}
                onChange={(e) => setNewContactInfo(e.target.value)}
                onKeyPress={(e) => e.key === "Enter" && addContactInfo()}
                className="flex-1"
              />
              <Button
                type="button"
                onClick={addContactInfo}
                size="sm"
                variant="outline"
              >
                <Plus className="h-4 w-4" />
              </Button>
            </div>

            {/* Display Contact Info */}
            {formData.contactInfo.length > 0 && (
              <div className="flex flex-wrap gap-2 mt-2">
                {formData.contactInfo.map((contact, index) => (
                  <Badge
                    key={index}
                    variant="secondary"
                    className="flex items-center gap-1"
                  >
                    {contact}
                    <button
                      type="button"
                      onClick={() => removeContactInfo(index)}
                      className="ml-1 hover:bg-gray-300 rounded-full p-0.5"
                    >
                      <X className="h-3 w-3" />
                    </button>
                  </Badge>
                ))}
              </div>
            )}

            {formErrors.contactInfo && (
              <p className="text-red-500 text-xs">{formErrors.contactInfo}</p>
            )}
          </div>
        </div>

        <DialogFooter className="flex gap-3 pt-4 border-t">
          <Button
            variant="outline"
            onClick={handleClose}
            className="px-6"
          >
            Hủy
          </Button>
          <Button
            onClick={handleCreateGroupSubmit}
            className="flex-1"
            disabled={selectedItems.length === 0}
          >
            Tạo nhóm ({selectedItems.length} sản phẩm)
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
