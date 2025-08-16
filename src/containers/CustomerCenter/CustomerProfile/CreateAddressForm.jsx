import React, { useEffect, useState } from "react";
import { Formik, Form, Field, ErrorMessage } from "formik";
import * as Yup from "yup";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { PopoverContent } from "@/components/ui/popover";
import { Check, X } from "lucide-react";
import { useCreateShippingAddressMutation } from "@/services/gshopApi";
import { toast } from "sonner";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { getDistricts, getProvinces, getWards } from "@/services/vnGeoAPI";
import { LocationCombobox } from "@/components/LocationCombobox";

// Predefined tag options (same as ShippingAddress component)
const TAG_OPTIONS = ["Nhà riêng", "Công ty", "Trường học", "Bệnh viện", "Khác"];

// Validation schema for address form
const AddressValidationSchema = Yup.object().shape({
  name: Yup.string()
    .min(2, "Họ và tên phải có ít nhất 2 ký tự")
    .max(50, "Họ và tên không được quá 50 ký tự")
    .required("Họ và tên là bắt buộc"),
  streetAddress: Yup.string()
    .min(5, "Địa chỉ đường phải có ít nhất 5 ký tự")
    .max(100, "Địa chỉ đường không được quá 100 ký tự")
    .required("Địa chỉ đường là bắt buộc"),
  phoneNumber: Yup.string()
    .matches(/^[0-9+\-\s()]+$/, "Số điện thoại không hợp lệ")
    .min(10, "Số điện thoại phải có ít nhất 10 số")
    .max(15, "Số điện thoại không được quá 15 số")
    .required("Số điện thoại là bắt buộc"),
  tag: Yup.string()
    .max(20, "Nhãn không được quá 20 ký tự")
    .required("Nhãn là bắt buộc"),
  default: Yup.boolean(),
});

const CreateAddressForm = ({ onClose, onSuccess }) => {
  const [createShippingAddress] = useCreateShippingAddressMutation();
  const [customTag, setCustomTag] = useState("");

  // Use arrays for options
  const [provinces, setProvinces] = useState([]);
  const [districts, setDistricts] = useState([]);
  const [wards, setWards] = useState([]);
  // Selected objects
  const [selectedProvince, setSelectedProvince] = useState(null);
  const [selectedDistrict, setSelectedDistrict] = useState(null);
  const [selectedWard, setSelectedWard] = useState(null);
  const handleSubmit = async (values, { setSubmitting, resetForm }) => {
    try {
      const finalTag = values.tag === "Khác" ? customTag : values.tag;
      // Combine location fields into a single string for the 'location' field
      const locationParts = [
        values.streetAddress,
        selectedWard ? selectedWard.full_name : "",
        selectedDistrict ? selectedDistrict.full_name : "",
        selectedProvince ? selectedProvince.full_name : "",
      ].filter(Boolean);
      const combinedLocation = locationParts.join(", ");
      await createShippingAddress({
        name: values.name,
        location: combinedLocation,
        addressLine: values.streetAddress,
        provinceCode: selectedProvince ? selectedProvince.id : "",
        districtCode: selectedDistrict ? selectedDistrict.id : "",
        wardCode: selectedWard ? selectedWard.id : "",
        phoneNumber: values.phoneNumber,
        tag: finalTag,
        default: values.default,
      }).unwrap();

      toast.success("Thêm địa chỉ thành công", {
        description: "Địa chỉ mới đã được thêm thành công.",
      });

      if (onSuccess) {
        onSuccess();
      }
      onClose();
      setCustomTag("");
      resetForm();
    } catch (error) {
      toast.error("Thêm địa chỉ thất bại", {
        description:
          error?.data?.message ||
          "Đã xảy ra lỗi khi thêm địa chỉ. Vui lòng thử lại sau.",
      });
    } finally {
      setSubmitting(false);
    }
  };

  const handleCancel = () => {
    onClose();
  };

  useEffect(() => {
    getProvinces()
      .then(setProvinces)
      .catch(() =>
        toast.error("Không thể tải danh sách tỉnh/thành phố", {
          description: "Vui lòng thử lại sau.",
        })
      );
  }, []);

  useEffect(() => {
    if (selectedProvince) {
      getDistricts(selectedProvince.id)
        .then(setDistricts)
        .catch(() =>
          toast.error("Không thể tải danh sách quận/huyện", {
            description: "Vui lòng thử lại sau.",
          })
        );
      setSelectedDistrict(null);
      setSelectedWard(null);
      setWards([]);
    } else {
      setDistricts([]);
      setWards([]);
    }
  }, [selectedProvince]);

  useEffect(() => {
    if (selectedDistrict) {
      getWards(selectedDistrict.id)
        .then(setWards)
        .catch(() =>
          toast.error("Không thể tải danh sách phường/xã", {
            description: "Vui lòng thử lại sau.",
          })
        );
      setSelectedWard(null);
    } else {
      setWards([]);
    }
  }, [selectedDistrict]);

  return (
    <PopoverContent className="p-6 w-[660px] max-h-[85vh] overflow-y-auto">
      <Formik
        initialValues={{
          name: "",
          streetAddress: "",
          ward: "",
          district: "",
          province: "",
          phoneNumber: "",
          tag: "",
          default: false,
        }}
        validationSchema={AddressValidationSchema}
        onSubmit={handleSubmit}
      >
        {({ isSubmitting, values, errors, touched, setFieldValue }) => (
          <Form>
            <h2 className="font-semibold text-lg mb-4">Thêm địa chỉ mới</h2>

            <div className="space-y-4">
              {/* Recipient Name */}
              <div className="space-y-2">
                <Label htmlFor="name">Họ tên người nhận *</Label>
                <Field
                  as={Input}
                  id="name"
                  name="name"
                  placeholder="Ví dụ: Nguyễn Văn A"
                  className={`${
                    errors.name && touched.name ? "border-destructive" : ""
                  }`}
                  disabled={isSubmitting}
                />
                <ErrorMessage
                  name="name"
                  component="div"
                  className="text-red-500 text-sm"
                />
              </div>

              {/* Location Fields */}
              <div className="space-y-4">
                <h4 className="font-medium text-sm text-muted-foreground">
                  Thông tin địa chỉ
                </h4>

                <div className="space-y-2">
                  <Label htmlFor="streetAddress">Địa chỉ đường/Số nhà *</Label>
                  <Field
                    as={Input}
                    id="streetAddress"
                    name="streetAddress"
                    placeholder="Ví dụ: 123 Đường ABC"
                    className={`${
                      errors.streetAddress && touched.streetAddress
                        ? "border-destructive"
                        : ""
                    }`}
                    disabled={isSubmitting}
                  />
                  <ErrorMessage
                    name="streetAddress"
                    component="div"
                    className="text-red-500 text-sm"
                  />
                </div>

                <div className="grid grid-cols-1 md:grid-cols-8 gap-4">
                  {/* Province Combobox */}
                  <div className="space-y-2 md:col-span-3">
                    <LocationCombobox
                      label="Tỉnh/Thành phố *"
                      placeholder="Chọn tỉnh/thành phố"
                      options={provinces}
                      value={selectedProvince}
                      onChange={(province) => {
                        setSelectedProvince(province);
                        setFieldValue(
                          "province",
                          province ? province.full_name : ""
                        );
                        setSelectedDistrict(null);
                        setFieldValue("district", "");
                        setSelectedWard(null);
                        setFieldValue("ward", "");
                      }}
                      disabled={isSubmitting}
                    />
                    <ErrorMessage
                      name="province"
                      component="div"
                      className="text-red-500 text-sm"
                    />
                  </div>
                  {/* District Combobox */}
                  <div className="space-y-2 md:col-span-3">
                    <LocationCombobox
                      label="Quận/Huyện *"
                      placeholder="Chọn quận/huyện"
                      options={districts}
                      value={selectedDistrict}
                      onChange={(district) => {
                        setSelectedDistrict(district);
                        setFieldValue(
                          "district",
                          district ? district.full_name : ""
                        );
                        setSelectedWard(null);
                        setFieldValue("ward", "");
                      }}
                      disabled={!selectedProvince || isSubmitting}
                    />
                    <ErrorMessage
                      name="district"
                      component="div"
                      className="text-red-500 text-sm"
                    />
                  </div>
                  {/* Ward Combobox */}
                  <div className="space-y-2 md:col-span-2">
                    <LocationCombobox
                      label="Phường/Xã *"
                      placeholder="Chọn phường/xã"
                      options={wards}
                      value={selectedWard}
                      onChange={(ward) => {
                        setSelectedWard(ward);
                        setFieldValue("ward", ward ? ward.full_name : "");
                      }}
                      disabled={!selectedDistrict || isSubmitting}
                    />
                    <ErrorMessage
                      name="ward"
                      component="div"
                      className="text-red-500 text-sm"
                    />
                  </div>
                </div>
              </div>

              {/* Phone Number */}
              <div className="space-y-2">
                <Label htmlFor="phoneNumber">Số điện thoại *</Label>
                <Field
                  as={Input}
                  id="phoneNumber"
                  name="phoneNumber"
                  placeholder="Ví dụ: 0123456789"
                  className={`${
                    errors.phoneNumber && touched.phoneNumber
                      ? "border-destructive"
                      : ""
                  }`}
                  disabled={isSubmitting}
                />
                <ErrorMessage
                  name="phoneNumber"
                  component="div"
                  className="text-red-500 text-sm"
                />
              </div>

              {/* Tag Selection */}
              <div className="space-y-2">
                <Label htmlFor="tag">Nhãn địa chỉ *</Label>
                <Field name="tag">
                  {({ meta }) => (
                    <div>
                      <Select
                        value={values.tag}
                        onValueChange={(value) => {
                          setFieldValue("tag", value);
                          if (value === "Khác") {
                            setCustomTag("");
                          }
                        }}
                      >
                        <SelectTrigger
                          className={`${
                            meta.touched && meta.error
                              ? "border-destructive"
                              : ""
                          }`}
                        >
                          <SelectValue placeholder="Chọn nhãn địa chỉ" />
                        </SelectTrigger>
                        <SelectContent>
                          {TAG_OPTIONS.map((option) => (
                            <SelectItem key={option} value={option}>
                              {option}
                            </SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                      {meta.touched && meta.error && (
                        <div className="text-red-500 text-sm mt-1">
                          {meta.error}
                        </div>
                      )}
                    </div>
                  )}
                </Field>
                {values.tag === "Khác" && (
                  <div className="space-y-2">
                    <Label>Nhãn tùy chỉnh</Label>
                    <Input
                      value={customTag}
                      onChange={(e) => setCustomTag(e.target.value)}
                      placeholder="Nhập nhãn tùy chỉnh"
                      maxLength={20}
                      disabled={isSubmitting}
                    />
                  </div>
                )}
              </div>

              {/* Default Address Checkbox */}
              <div className="flex items-center space-x-2">
                <Field name="default" type="checkbox">
                  {({ field }) => (
                    <input
                      {...field}
                      type="checkbox"
                      id="default"
                      className="rounded border-gray-300 text-primary focus:ring-primary"
                      disabled={isSubmitting}
                    />
                  )}
                </Field>
                <label htmlFor="default" className="text-sm">
                  Đặt làm địa chỉ mặc định
                </label>
              </div>
            </div>

            {/* Action Buttons */}
            <div className="flex gap-3 mt-6">
              <Button
                type="submit"
                className="flex items-center gap-2 flex-1"
                disabled={isSubmitting}
              >
                <Check className="h-4 w-4" />
                {isSubmitting ? "Đang xử lý..." : "Thêm địa chỉ"}
              </Button>
              <Button
                type="button"
                variant="outline"
                onClick={handleCancel}
                className="flex items-center gap-2"
                disabled={isSubmitting}
              >
                <X className="h-4 w-4" />
                Hủy
              </Button>
            </div>
          </Form>
        )}
      </Formik>
    </PopoverContent>
  );
};

export default CreateAddressForm;
