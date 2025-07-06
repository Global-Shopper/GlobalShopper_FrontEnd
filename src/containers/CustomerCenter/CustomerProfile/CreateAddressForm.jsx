import React, { useState } from 'react'
import { Formik, Form, Field, ErrorMessage } from 'formik'
import * as Yup from 'yup'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { PopoverContent } from '@/components/ui/popover'
import { Check, X } from 'lucide-react'
import { useCreateShippingAddressMutation } from '@/services/gshopApi'
import { toast } from 'sonner'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'

// Predefined tag options (same as ShippingAddress component)
const TAG_OPTIONS = [
  'Nhà riêng',
  'Công ty',
  'Trường học',
  'Bệnh viện',
  'Khác'
]

// Validation schema for address form
const AddressValidationSchema = Yup.object().shape({
  name: Yup.string()
    .min(2, 'Họ và tên phải có ít nhất 2 ký tự')
    .max(50, 'Họ và tên không được quá 50 ký tự')
    .required('Họ và tên là bắt buộc'),
  streetAddress: Yup.string()
    .min(5, 'Địa chỉ đường phải có ít nhất 5 ký tự')
    .max(100, 'Địa chỉ đường không được quá 100 ký tự')
    .required('Địa chỉ đường là bắt buộc'),
  ward: Yup.string()
    .min(2, 'Phường/Xã phải có ít nhất 2 ký tự')
    .max(50, 'Phường/Xã không được quá 50 ký tự')
    .required('Phường/Xã là bắt buộc'),
  district: Yup.string()
    .min(2, 'Quận/Huyện phải có ít nhất 2 ký tự')
    .max(50, 'Quận/Huyện không được quá 50 ký tự')
    .required('Quận/Huyện là bắt buộc'),
  province: Yup.string()
    .min(2, 'Tỉnh/Thành phố phải có ít nhất 2 ký tự')
    .max(50, 'Tỉnh/Thành phố không được quá 50 ký tự')
    .required('Tỉnh/Thành phố là bắt buộc'),
  phoneNumber: Yup.string()
    .matches(/^[0-9+\-\s()]+$/, 'Số điện thoại không hợp lệ')
    .min(10, 'Số điện thoại phải có ít nhất 10 số')
    .max(15, 'Số điện thoại không được quá 15 số')
    .required('Số điện thoại là bắt buộc'),
  tag: Yup.string()
    .max(20, 'Nhãn không được quá 20 ký tự')
    .required('Nhãn là bắt buộc'),
  default: Yup.boolean()
})

const CreateAddressForm = ({ onClose, onSuccess }) => {
  const [createShippingAddress] = useCreateShippingAddressMutation()
  const [customTag, setCustomTag] = useState('')

  // Function to combine location components into string
  const combineLocation = (streetAddress, ward, district, province) => {
    const parts = [streetAddress, ward, district, province].filter(part => part && part.trim())
    return parts.join(', ')
  }

  const handleSubmit = async (values, { setSubmitting, resetForm }) => {
    try {
      const locationString = combineLocation(
        values.streetAddress,
        values.ward,
        values.district,
        values.province
      )

      const finalTag = values.tag === 'Khác' ? customTag : values.tag
      
      await createShippingAddress({
        name: values.name,
        location: locationString,
        phoneNumber: values.phoneNumber,
        tag: finalTag,
        default: values.default
      }).unwrap()
      
      toast.success("Thêm địa chỉ thành công", {
        description: "Địa chỉ mới đã được thêm thành công.",
      })
      
      if (onSuccess) {
        onSuccess()
      }
      onClose()
      setCustomTag('')
      resetForm()
    } catch (error) {
      toast.error("Thêm địa chỉ thất bại", {
        description: error?.data?.message || "Đã xảy ra lỗi khi thêm địa chỉ. Vui lòng thử lại sau.",
      })
    } finally {
      setSubmitting(false)
    }
  }

  const handleCancel = () => {
    onClose()
  }

  return (
    <PopoverContent className="p-6 w-[500px] max-h-[80vh] overflow-y-auto">
      <Formik
        initialValues={{
          name: '',
          streetAddress: '',
          ward: '',
          district: '',
          province: '',
          phoneNumber: '',
          tag: '',
          default: false
        }}
        validationSchema={AddressValidationSchema}
        onSubmit={handleSubmit}
      >
        {({ isSubmitting, values, errors, touched, setFieldValue }) => (
          <Form>
            <h2 className="font-semibold text-lg mb-4">
              Thêm địa chỉ mới
            </h2>
            
            <div className="space-y-4">
              {/* Recipient Name */}
              <div className="space-y-2">
                <Label htmlFor="name">Họ tên người nhận *</Label>
                <Field
                  as={Input}
                  id="name"
                  name="name"
                  placeholder="Ví dụ: Nguyễn Văn A"
                  className={`${errors.name && touched.name ? "border-destructive" : ""}`}
                  disabled={isSubmitting}
                />
                <ErrorMessage name="name" component="div" className="text-red-500 text-sm" />
              </div>

              {/* Location Fields */}
              <div className="space-y-4">
                <h4 className="font-medium text-sm text-muted-foreground">Thông tin địa chỉ</h4>
                
                <div className="space-y-2">
                  <Label htmlFor="streetAddress">Địa chỉ đường/Số nhà *</Label>
                  <Field
                    as={Input}
                    id="streetAddress"
                    name="streetAddress"
                    placeholder="Ví dụ: 123 Đường ABC"
                    className={`${errors.streetAddress && touched.streetAddress ? "border-destructive" : ""}`}
                    disabled={isSubmitting}
                  />
                  <ErrorMessage name="streetAddress" component="div" className="text-red-500 text-sm" />
                </div>

                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="ward">Phường/Xã *</Label>
                    <Field
                      as={Input}
                      id="ward"
                      name="ward"
                      placeholder="Ví dụ: Phường 1"
                      className={`${errors.ward && touched.ward ? "border-destructive" : ""}`}
                      disabled={isSubmitting}
                    />
                    <ErrorMessage name="ward" component="div" className="text-red-500 text-sm" />
                  </div>
                  
                  <div className="space-y-2">
                    <Label htmlFor="district">Quận/Huyện *</Label>
                    <Field
                      as={Input}
                      id="district"
                      name="district"
                      placeholder="Ví dụ: Quận 1"
                      className={`${errors.district && touched.district ? "border-destructive" : ""}`}
                      disabled={isSubmitting}
                    />
                    <ErrorMessage name="district" component="div" className="text-red-500 text-sm" />
                  </div>
                  
                  <div className="space-y-2">
                    <Label htmlFor="province">Tỉnh/Thành phố *</Label>
                    <Field
                      as={Input}
                      id="province"
                      name="province"
                      placeholder="Ví dụ: TP. HCM"
                      className={`${errors.province && touched.province ? "border-destructive" : ""}`}
                      disabled={isSubmitting}
                    />
                    <ErrorMessage name="province" component="div" className="text-red-500 text-sm" />
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
                  className={`${errors.phoneNumber && touched.phoneNumber ? "border-destructive" : ""}`}
                  disabled={isSubmitting}
                />
                <ErrorMessage name="phoneNumber" component="div" className="text-red-500 text-sm" />
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
                          setFieldValue('tag', value)
                          if (value === 'Khác') {
                            setCustomTag('')
                          }
                        }}
                      >
                        <SelectTrigger className={`${meta.touched && meta.error ? 'border-destructive' : ''}`}>
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
                        <div className="text-red-500 text-sm mt-1">{meta.error}</div>
                      )}
                    </div>
                  )}
                </Field>
                {values.tag === 'Khác' && (
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
              <div className="flex items-center space-x-2 pt-2">
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
  )
}

export default CreateAddressForm
