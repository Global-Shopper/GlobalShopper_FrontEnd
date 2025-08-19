import React from "react";
import { useFormik } from "formik";
import * as Yup from "yup";
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
import { useCreateGroupMutation } from "@/services/gshopApi";
import PageLoading from "@/components/PageLoading";

export function GroupCreationDialog({
  isOpen,
  onClose,
  selectedItems,
  requestItems,
  handleClearSelection,
}) {
  const [createGroup, { isLoading }] = useCreateGroupMutation();
  const commonPlatforms = ["Amazon", "eBay", "Taobao", "Khác"];
  console.log("selectedItems", selectedItems);
  console.log("requestItems", requestItems);
  const formik = useFormik({
    initialValues: {
      ecommercePlatform: "",
      customPlatform: "",
      seller: "",
    },
    validationSchema: Yup.object({
      ecommercePlatform: Yup.string().required("Platform is required"),

      customPlatform: Yup.string().when("ecommercePlatform", {
        is: (val) => val === "Khác",
        then: () => Yup.string().required("Custom platform is required"),
        otherwise: () => Yup.string().notRequired(),
      }),
      seller: Yup.string().required("Seller is required"),
    }),
    onSubmit: async (values, { resetForm }) => {
      try {
        const platform =
          values.ecommercePlatform === "Khác"
            ? values.customPlatform
            : values.ecommercePlatform;
        const seller = values.seller;
        console.log("requestItems", requestItems);
        const selectedItemsArray = requestItems.filter((item) =>
          selectedItems.includes(item.id)
        );
        const groupData = {
          ecommercePlatform: platform,
          seller: seller,
          itemIds: selectedItemsArray.map((item) => item.id),
        };
        if (selectedItemsArray.length > 0 && createGroup) {
          createGroup(groupData)
            .unwrap()
            .then(() => {
              handleClearSelection();
              toast.success("Nhóm đã được tạo thành công!");
            })
            .catch((error) => {
              toast.error(`Lỗi khi tạo nhóm: ${error.message}`);
            });
        }
        resetForm();
        onClose();
      } catch (error) {
        toast.error(`Lỗi khi tạo nhóm: ${error.message}`);
      }
    },
  });

  const handleClose = () => {
    formik.resetForm();
    onClose();
  };

  if (isLoading) {
    return <PageLoading />;
  }

  return (
    <Dialog open={isOpen} onOpenChange={handleClose}>
      <DialogContent className="w-full max-w-2xl max-h-[90vh] overflow-y-auto">
        <form onSubmit={formik.handleSubmit}>
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

            {/* Platform Field */}
            <div className="space-y-2">
              <Label className="text-sm font-medium">
                Nền tảng E-commerce <span className="text-red-500">*</span>
              </Label>
              <Select
                value={formik.values.ecommercePlatform}
                onValueChange={(value) =>
                  formik.setFieldValue("ecommercePlatform", value)
                }
              >
                <SelectTrigger
                  className={
                    formik.touched.ecommercePlatform &&
                    formik.errors.ecommercePlatform
                      ? "border-red-500"
                      : ""
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
              {formik.values.ecommercePlatform === "Khác" && (
                <Input
                  placeholder="Nhập tên platform khác"
                  name="customPlatform"
                  value={formik.values.customPlatform}
                  onChange={formik.handleChange}
                  onBlur={formik.handleBlur}
                  className={
                    formik.touched.customPlatform &&
                    formik.errors.customPlatform
                      ? "border-red-500"
                      : ""
                  }
                />
              )}
              {formik.touched.ecommercePlatform &&
                formik.errors.ecommercePlatform && (
                  <p className="text-red-500 text-xs">
                    {formik.errors.ecommercePlatform}
                  </p>
                )}
              {formik.values.ecommercePlatform === "Khác" &&
                formik.touched.customPlatform &&
                formik.errors.customPlatform && (
                  <p className="text-red-500 text-xs">
                    {formik.errors.customPlatform}
                  </p>
                )}
            </div>

            {/* Seller Field */}
            <div className="space-y-2">
              <Label className="text-sm font-medium">
                Người bán <span className="text-red-500">*</span>
              </Label>
              <Input
                placeholder="Nhập tên người bán"
                name="seller"
                value={formik.values.seller}
                onChange={formik.handleChange}
                onBlur={formik.handleBlur}
                className={
                  formik.touched.seller && formik.errors.seller
                    ? "border-red-500"
                    : ""
                }
              />
              {formik.touched.seller && formik.errors.seller && (
                <p className="text-red-500 text-xs">{formik.errors.seller}</p>
              )}
            </div>
          </div>

          <DialogFooter className="flex gap-3 pt-4 border-t">
            <Button
              variant="outline"
              onClick={handleClose}
              className="px-6"
              type="button"
            >
              Hủy
            </Button>
            <Button
              type="submit"
              className="flex-1"
              disabled={selectedItems.length === 0}
            >
              Tạo nhóm ({selectedItems.length} sản phẩm)
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}
