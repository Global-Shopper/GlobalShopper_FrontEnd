import React, { useState } from 'react'
import { Formik, Form, Field, ErrorMessage } from 'formik'
import * as Yup from 'yup'
import { Card, CardHeader, CardTitle, CardContent, CardFooter } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Badge } from '@/components/ui/badge'
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu'
import {
  MapPin,
  Plus,
  Edit,
  Trash2,
  Star,
  Save,
  X,
  Phone,
  MoreVertical
} from 'lucide-react'
import { useDefaultShippingAddressMutation, useDeleteShippingAddressMutation, useGetShippingAddressQuery, useUpdateShippingAddressMutation } from '@/services/gshopApi'
import CreateAddressForm from './CreateAddressForm'
import {
  Popover,
  PopoverTrigger,
} from '@/components/ui/popover'
import AddressCardSkeleton from '@/components/AddressCardSkeleton'
import { toast } from 'sonner'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import { Checkbox } from '@/components/ui/checkbox'

// Predefined tag options
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
})

const ShippingAddress = () => {
  // Shipping addresses state
  const { data: addresses, isLoading: isAddressLoading, isError: isAddressError } = useGetShippingAddressQuery()
  const [updateShippingAddress] = useUpdateShippingAddressMutation()
  const [deleteShippingAddress] = useDeleteShippingAddressMutation()
  const [defaultShippingAddress] = useDefaultShippingAddressMutation()

  const [isPopoverOpen, setIsPopoverOpen] = useState(false)
  const [editingAddressId, setEditingAddressId] = useState(null)
  const [customTag, setCustomTag] = useState('')

  // Function to parse location string into components
  const parseLocation = (locationString) => {
    if (!locationString) return { streetAddress: '', ward: '', district: '', province: '' }

    // Simple parsing - you might want to improve this based on your data format
    const parts = locationString.split(',').map(part => part.trim())

    if (parts.length >= 4) {
      return {
        streetAddress: parts[0] || '',
        ward: parts[1] || '',
        district: parts[2] || '',
        province: parts[3] || ''
      }
    } else if (parts.length === 3) {
      return {
        streetAddress: parts[0] || '',
        ward: parts[1] || '',
        district: parts[2] || '',
        province: ''
      }
    } else {
      return {
        streetAddress: locationString,
        ward: '',
        district: '',
        province: ''
      }
    }
  }

  // Function to combine location components into string
  const combineLocation = (streetAddress, ward, district, province) => {
    const parts = [streetAddress, ward, district, province].filter(part => part && part.trim())
    return parts.join(', ')
  }

  // Handle address operations
  const handleAddAddress = () => {
    setIsPopoverOpen(true)
  }

  const handleEditAddress = (address) => {
    setEditingAddressId(address.id)
    const locationParts = parseLocation(address.location)
    setCustomTag(address.tag && !TAG_OPTIONS.includes(address.tag) ? address.tag : '')
  }

  const handleSaveAddress = async (values, { setSubmitting, resetForm }) => {
    try {
      const locationString = combineLocation(
        values.streetAddress,
        values.ward,
        values.district,
        values.province
      )

      const finalTag = values.tag === 'Khác' ? customTag : values.tag

      await updateShippingAddress({
        id: editingAddressId,
        ...values,
        location: locationString,
        tag: finalTag
      }).unwrap()

      toast.success("Cập nhật địa chỉ thành công", {
        description: "Địa chỉ đã được cập nhật thành công.",
      })
      setEditingAddressId(null)
      setCustomTag('')
      resetForm()
    } catch (e) {
      toast.error("Cập nhật địa chỉ thất bại", {
        description: JSON.stringify(e?.data?.messages) || "Đã xảy ra lỗi khi cập nhật địa chỉ. Vui lòng thử lại sau.",
      })
    } finally {
      setSubmitting(false)
    }
  }

  const handleDeleteAddress = async (addressId) => {
    try {
      await deleteShippingAddress(addressId).unwrap()
      toast.success("Xóa địa chỉ thành công")
    } catch (e) {
      toast.error("Xóa địa chỉ thất bại", {
        description: e?.data?.message || "Đã xảy ra lỗi khi xóa địa chỉ. Vui lòng thử lại sau.",
      })
    }
  }

  const handleSetDefaultAddress = async (addressId) => {
    try {
      await defaultShippingAddress(addressId).unwrap()
      toast.success("Đặt địa chỉ mặc định thành công")
    } catch (error) {
      toast.error("Đặt địa chỉ mặc định thất bại", {
        description: error?.data?.message || "Đã xảy ra lỗi khi đặt địa chỉ mặc định. Vui lòng thử lại sau.",
      })
    }
  }

  const handleClosePopover = () => {
    setIsPopoverOpen(false)
  }

  const handleCancelEdit = () => {
    setEditingAddressId(null)
    setCustomTag('')
  }

  return (
    <div>
      {/* Shipping Addresses Section */}
      <Card className="max-w-7xl w-xl">
        <CardHeader>
          <div className="flex items-center justify-between">
            <CardTitle className="flex items-center gap-2">
              <MapPin className="h-5 w-5" />
              Sổ địa chỉ
            </CardTitle>
            <Popover open={isPopoverOpen} onOpenChange={setIsPopoverOpen}>
              <PopoverTrigger asChild>
                <Button
                  onClick={handleAddAddress}
                  className="flex items-center gap-2"
                  disabled={isPopoverOpen || isAddressLoading}
                >
                  <Plus className="h-4 w-4" />
                  Thêm địa chỉ mới
                </Button>
              </PopoverTrigger>
              <CreateAddressForm
                onClose={handleClosePopover}
                onSuccess={() => {
                  handleClosePopover()
                }}
              />
            </Popover>
          </div>
        </CardHeader>
        <CardContent className="space-y-4">
          {/* Loading State with Skeletons */}
          {isAddressLoading && (
            <div className="space-y-4">
              <AddressCardSkeleton />
              <AddressCardSkeleton />
              <AddressCardSkeleton />
            </div>
          )}

          {/* Error State */}
          {isAddressError && (
            <div className="text-center py-8 text-muted-foreground">
              <MapPin className="h-12 w-12 mx-auto mb-4 opacity-50" />
              <p>Có lỗi xảy ra khi tải địa chỉ giao hàng.</p>
              <p className="text-sm">Vui lòng thử lại sau.</p>
            </div>
          )}

          {/* Existing Addresses - Single Column */}
          {!isAddressLoading && !isAddressError && (
            <div className="space-y-4">
              {addresses?.map((address) => (
                <Card key={address.id} className={`relative ${address.default ? 'ring-2 ring-primary/20 bg-primary/5' : ''}`}>
                  {address.default && (
                    <div className="absolute -top-2 -right-2">
                      <Badge className="bg-primary text-primary-foreground flex items-center gap-1">
                        <Star className="h-3 w-3 fill-current" />
                        Mặc định
                      </Badge>
                    </div>
                  )}
                  <CardContent>
                    {editingAddressId === address.id ? (
                      <Formik
                        initialValues={{
                          name: address.name || '',
                          streetAddress: parseLocation(address.location).streetAddress,
                          ward: parseLocation(address.location).ward,
                          district: parseLocation(address.location).district,
                          province: parseLocation(address.location).province,
                          phoneNumber: address.phoneNumber || '',
                          tag: TAG_OPTIONS.includes(address.tag) ? address.tag : 'Khác',
                          default: address.default || false,
                        }}
                        validationSchema={AddressValidationSchema}
                        onSubmit={handleSaveAddress}
                      >
                        {({ isSubmitting, values, errors, touched, setFieldValue }) => (
                          <Form className="grid grid-cols-1 gap-4">
                            {/* Recipient Name */}
                            <div className="space-y-2">
                              <Label htmlFor="name">Họ tên người nhận</Label>
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
                                <Label htmlFor="streetAddress">Địa chỉ đường/Số nhà</Label>
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
                                  <Label htmlFor="ward">Phường/Xã</Label>
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
                                  <Label htmlFor="district">Quận/Huyện</Label>
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
                                  <Label htmlFor="province">Tỉnh/Thành phố</Label>
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
                              <Label htmlFor="phoneNumber">Số điện thoại</Label>
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
                              <Label htmlFor="tag">Nhãn địa chỉ</Label>
                              <Field name="tag">
                                {({ field, meta }) => (
                                  <div>
                                    <Select
                                      value={field.value}
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
                              <Field name="default">
                                {() => (
                                  <>
                                    {console.log(values.default)}
                                      <input
                                        type="checkbox"
                                        id="default"
                                        onChange={(e) => {setFieldValue('default', e.target.checked)}}
                                        className="rounded border-gray-300 text-primary focus:ring-primary"
                                        disabled={isSubmitting}
                                        checked={values.default}
                                      />
                                  </>
                                 
                                )}
                              </Field>
                              <label htmlFor="default" className="text-sm">
                                Đặt làm địa chỉ mặc định
                              </label>
                            </div>

                            <CardFooter className="px-0 pb-0">
                              <div className="flex gap-2">
                                <Button
                                  type="submit"
                                  disabled={isSubmitting}
                                  className="flex items-center gap-2"
                                >
                                  <Save className="h-4 w-4" />
                                  {isSubmitting ? 'Đang lưu...' : 'Lưu thay đổi'}
                                </Button>
                                <Button
                                  type="button"
                                  variant="outline"
                                  onClick={handleCancelEdit}
                                  className="flex items-center gap-2"
                                >
                                  <X className="h-4 w-4" />
                                  Hủy
                                </Button>
                              </div>
                            </CardFooter>
                          </Form>
                        )}
                      </Formik>
                    ) : (
                      <div>
                        <div className="flex items-start justify-between mb-3">
                          <div className="flex items-center gap-2">
                            <h3 className="font-semibold text-lg">{address.name}</h3>
                          </div>
                          <div className="flex items-center gap-2">
                            <Badge variant="secondary" className="text-xs">
                              {address.tag}
                            </Badge>
                            <DropdownMenu>
                              <DropdownMenuTrigger asChild>
                                <Button variant="ghost" size="sm" className="h-8 w-8 p-0">
                                  <MoreVertical className="h-4 w-4" />
                                </Button>
                              </DropdownMenuTrigger>
                              <DropdownMenuContent align="end">
                                <DropdownMenuItem onClick={() => handleEditAddress(address)}>
                                  <Edit className="h-4 w-4 mr-2" />
                                  Chỉnh sửa
                                </DropdownMenuItem>
                                {!address.default && (
                                  <DropdownMenuItem onClick={() => handleSetDefaultAddress(address.id)}>
                                    <Star className="h-4 w-4 mr-2" />
                                    Đặt làm mặc định
                                  </DropdownMenuItem>
                                )}
                                <DropdownMenuItem
                                  onClick={() => handleDeleteAddress(address.id)}
                                  className="text-destructive focus:text-destructive"
                                >
                                  <Trash2 className="h-4 w-4 mr-2" />
                                  Xóa
                                </DropdownMenuItem>
                              </DropdownMenuContent>
                            </DropdownMenu>
                          </div>
                        </div>
                        <div className="space-y-2 text-sm">
                          <div className="flex items-start gap-2">
                            <MapPin className="h-4 w-4 text-primary mt-1.5 flex-shrink-0" />
                            <p className="text-base font-medium text-foreground leading-relaxed">{address.location}</p>
                          </div>
                          <div className="flex items-start gap-2">
                            <Phone className="h-4 w-4 text-primary mt-1.5 flex-shrink-0" />
                            <p className="font-normal text-foreground leading-relaxed">{address.phoneNumber}</p>
                          </div>
                        </div>
                      </div>
                    )}
                  </CardContent>
                </Card>
              ))}
            </div>
          )}

          {/* Empty State */}
          {!isAddressLoading && !isAddressError && addresses?.length === 0 && !isPopoverOpen && (
            <div className="text-center py-8 text-muted-foreground">
              <MapPin className="h-12 w-12 mx-auto mb-4 opacity-50" />
              <p>Chưa có địa chỉ giao hàng nào.</p>
              <p className="text-sm">Thêm địa chỉ đầu tiên để bắt đầu.</p>
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  )
}

export default ShippingAddress 