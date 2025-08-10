import React, { useMemo, useState } from 'react'
import { useParams, useNavigate } from 'react-router-dom'
import { Formik, Form, Field, FieldArray } from 'formik'
import * as Yup from 'yup'
import { toast } from 'sonner'

import { Button } from '@/components/ui/button'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Separator } from '@/components/ui/separator'
import { Select, SelectTrigger, SelectValue, SelectContent, SelectItem } from '@/components/ui/select'
import { Loader2, Upload, X, Trash2 } from 'lucide-react'
import { PREDEFINED_VARIANT_FIELDS } from '@/const/variant'
import { uploadToCloudinary } from '@/utils/uploadToCloudinary'

import {
  useGetEditInfoPurchaseRequestQuery,
  useUpdatePurchaseRequestMutation,
  useGetShippingAddressQuery,
} from '@/services/gshopApi'

const validationSchema = Yup.object({
  // allow string or number, just ensure selected
  shippingAddressId: Yup.mixed().required('Vui lòng chọn địa chỉ'),
  // structured contact info
  shopName: Yup.string().trim().required('Vui lòng nhập tên cửa hàng'),
  shopEmail: Yup.string().trim().nullable().transform((v)=> (v===''? null : v)).email('Email không hợp lệ'),
  shopAddress: Yup.string().trim().required('Vui lòng nhập địa chỉ cửa hàng'),
  shopWebsite: Yup.string().trim().nullable().transform((v)=> (v===''? null : v)).url('Đường dẫn website không hợp lệ'),
  requestItems: Yup.array()
    .of(
      Yup.object({
        productName: Yup.string().trim().required('Tên sản phẩm là bắt buộc'),
        productURL: Yup.string()
          .nullable()
          .transform((value) => (value === '' ? null : value))
          .url('Đường dẫn không hợp lệ'),
        quantity: Yup.number().typeError('Số lượng không hợp lệ').min(1, 'Tối thiểu 1').required('Bắt buộc'),
      })
    )
    .min(1, 'Phải có ít nhất 1 sản phẩm'),
})

const fromLines = (text) =>
  (text || '')
    .split('\n')
    .map((s) => s.trim())
    .filter(Boolean)

// Normalize incoming variants into structured rows for UI
const toVariantRows = (raw) => {
  if (!raw) return []
  // Already structured
  if (Array.isArray(raw) && raw.length && typeof raw[0] === 'object') {
    return raw.map((v) => ({
      attributeName: v?.attributeName || v?.customFieldName || v?.fieldType || '',
      fieldValue: v?.fieldValue || '',
    }))
  }
  // From string lines: "Name: Value"
  if (Array.isArray(raw)) {
    return raw.map((line) => {
      const [name, ...rest] = String(line).split(':')
      return {
        attributeName: (name || '').trim(),
        fieldValue: rest.join(':').trim(),
      }
    })
  }
  return []
}

// Parse existing contactInfo lines into structured fields
const parseContactFields = (lines) => {
  const result = { shopName: '', shopEmail: '', shopAddress: '', shopWebsite: '' }
  if (!Array.isArray(lines)) return result
  for (const raw of lines) {
    const line = String(raw)
    const [key, ...rest] = line.split(':')
    const val = rest.join(':').trim()
    const k = (key || '').trim().toLowerCase()
    if (k.startsWith('tên cửa hàng')) result.shopName = val
    else if (k.startsWith('email')) result.shopEmail = val
    else if (k.startsWith('địa chỉ')) result.shopAddress = val
    else if (k.startsWith('website')) result.shopWebsite = val
  }
  return result
}

// Build contactInfo lines for payload
const buildContactInfo = ({ shopName, shopEmail, shopAddress, shopWebsite }) => {
  const arr = []
  if (shopName) arr.push(`Tên cửa hàng: ${shopName}`)
  if (shopEmail) arr.push(`Email: ${shopEmail}`)
  if (shopAddress) arr.push(`Địa chỉ: ${shopAddress}`)
  if (shopWebsite) arr.push(`Website: ${shopWebsite}`)
  return arr
}

const PurchaseRequestEdit = () => {
  const { id } = useParams()
  const navigate = useNavigate()

  const { data, isLoading, isError, error } = useGetEditInfoPurchaseRequestQuery(id)
  const { data: addresses } = useGetShippingAddressQuery()
  const [updatePurchaseRequest, { isLoading: isSubmitting }] = useUpdatePurchaseRequestMutation()
  const [uploadingIndex, setUploadingIndex] = useState(null)
  const initialValues = useMemo(() => {
    const pr = data || {}
    const items = pr.requestItems || pr.items || []
    const parsedContact = parseContactFields(pr.contactInfo || [])
    return {
      shippingAddressId:
      pr.shippingAddressId || pr.shippingAddress?.id || (addresses?.find((a) => a.default)?.id ?? ''),
      // structured contact fields
      shopName: parsedContact.shopName || '',
      shopEmail: parsedContact.shopEmail || '',
      shopAddress: parsedContact.shopAddress || '',
      shopWebsite: parsedContact.shopWebsite || '',
      requestItems: items.map((item) => ({
        productName: item.productName || item.name || '',
        productURL: item.productURL || item.link || '',
        quantity: item.quantity || 1,
        description: item.description || '',
        variantRows: toVariantRows(item.variantRows || item.variants),
        images: [...(item.images || [])],
        localImages: [...(item.localImages || item.images || [])],
      })),
    }
  }, [data, addresses])
  console.log("data", initialValues);

  const onSubmit = async (values) => {
    try {
      const numericId = Number(values.shippingAddressId)
      const shippingId = Number.isNaN(numericId) ? values.shippingAddressId : numericId
      const payload = {
        shippingAddressId: shippingId,
        contactInfo: buildContactInfo({
          shopName: values.shopName?.trim(),
          shopEmail: values.shopEmail?.trim(),
          shopAddress: values.shopAddress?.trim(),
          shopWebsite: values.shopWebsite?.trim(),
        }),
        requestItems: values.requestItems.map((item) => ({
          productName: item.productName.trim(),
          productURL: item.productURL?.trim() || null,
          quantity: Number(item.quantity) || 1,
          description: item.description?.trim() || null,
          variants: Array.isArray(item.variantRows) && item.variantRows.length
            ? item.variantRows
                .map((v) => `${(v?.attributeName || '').trim()}: ${(v?.fieldValue || '').trim()}`)
                .filter((line) => line.replace(':', '').trim().length)
            : fromLines(item.variantsText), // fallback for any legacy state
          images: Array.isArray(item.images) ? item.images : fromLines(item.imagesText),
        })),
      }
      await updatePurchaseRequest({ id, payload }).unwrap()
      toast.success('Cập nhật yêu cầu mua hàng thành công!')
      navigate(`/purchase-request/${id}`)
    } catch (e) {
      toast.error(e?.data?.message || 'Cập nhật thất bại. Vui lòng thử lại!')
    }
  }

  if (isLoading) return <div className="p-6">Đang tải dữ liệu...</div>
  if (isError) return <div className="p-6 text-red-600">{error?.data?.message || 'Không thể tải dữ liệu chỉnh sửa.'}</div>

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="max-w-5xl mx-auto px-4 py-6 space-y-6">
        <Card className="shadow-lg p-2 py-4">
          <CardHeader className="bg-gradient-to-r from-orange-600 to-orange-700 text-white rounded-lg">
            <CardTitle className="text-xl">Chỉnh sửa yêu cầu mua hàng</CardTitle>
          </CardHeader>
          <CardContent className="p-6">
            <Formik
              initialValues={initialValues}
              enableReinitialize
              validationSchema={validationSchema}
              onSubmit={onSubmit}
              validateOnMount
            >
              {({ values, handleChange, handleBlur, setFieldValue, setFieldTouched, errors, touched }) => (
                <Form className="space-y-6">
                  <div className="space-y-2">
                    <Label className="text-base font-medium">Địa chỉ giao hàng</Label>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      {addresses?.map((address) => (
                        <div
                          key={address.id}
                          className={`cursor-pointer border rounded-2xl p-4 transition-all ${
                            address.id == values.shippingAddressId
                              ? 'ring-2 ring-primary/80 bg-primary/5 border-primary'
                              : 'hover:ring-2 hover:ring-primary/30'
                          }`}
                          onClick={() => {
                            setFieldValue('shippingAddressId', address.id)
                            setFieldTouched('shippingAddressId', true, false)
                          }}
                          tabIndex={0}
                          role="button"
                          aria-pressed={address.id == values.shippingAddressId}
                        >
                          <div className="flex items-center gap-2 mb-2">
                            <span className="font-semibold">{address.name}</span>
                            <span className="text-xs px-2 py-0.5 rounded bg-gray-200 text-gray-700">{address.tag}</span>
                            {address.default && (
                              <span className="ml-2 text-xs px-2 py-0.5 rounded bg-primary text-white">Mặc định</span>
                            )}
                          </div>
                          <div className="text-sm text-gray-600">{address.location}</div>
                          <div className="text-sm text-gray-600">SĐT: {address.phoneNumber}</div>
                        </div>
                      ))}
                    </div>
                    {touched.shippingAddressId && errors.shippingAddressId && (
                      <div className="text-sm text-red-500">{errors.shippingAddressId}</div>
                    )}
                  </div>

                  <Separator />

                  <div className="space-y-2">
                    <Label className="text-base font-medium">Thông tin liên hệ</Label>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <div className="space-y-1">
                        <Label htmlFor="shopName">Tên cửa hàng</Label>
                        <Input
                          id="shopName"
                          name="shopName"
                          value={values.shopName}
                          onChange={handleChange}
                          onBlur={handleBlur}
                          placeholder="Tên cửa hàng"
                        />
                        {touched.shopName && errors.shopName && (
                          <div className="text-sm text-red-500">{errors.shopName}</div>
                        )}
                      </div>
                      <div className="space-y-1">
                        <Label htmlFor="shopEmail">Email cửa hàng</Label>
                        <Input
                          id="shopEmail"
                          name="shopEmail"
                          type="email"
                          value={values.shopEmail}
                          onChange={handleChange}
                          onBlur={handleBlur}
                          placeholder="Email cửa hàng (không bắt buộc)"
                        />
                        {touched.shopEmail && errors.shopEmail && (
                          <div className="text-sm text-red-500">{errors.shopEmail}</div>
                        )}
                      </div>
                      <div className="space-y-1">
                        <Label htmlFor="shopAddress">Địa chỉ cửa hàng</Label>
                        <Input
                          id="shopAddress"
                          name="shopAddress"
                          value={values.shopAddress}
                          onChange={handleChange}
                          onBlur={handleBlur}
                          placeholder="Địa chỉ cửa hàng"
                        />
                        {touched.shopAddress && errors.shopAddress && (
                          <div className="text-sm text-red-500">{errors.shopAddress}</div>
                        )}
                      </div>
                      <div className="space-y-1 md:col-span-2">
                        <Label htmlFor="shopWebsite">Link website hoặc mạng xã hội của cửa hàng</Label>
                        <Input
                          id="shopWebsite"
                          name="shopWebsite"
                          value={values.shopWebsite}
                          onChange={handleChange}
                          onBlur={handleBlur}
                          placeholder="https://..."
                        />
                        {touched.shopWebsite && errors.shopWebsite && (
                          <div className="text-sm text-red-500">{errors.shopWebsite}</div>
                        )}
                      </div>
                    </div>
                  </div>

                  <Separator />

                  <div className="space-y-4">
                    <Label className="text-base font-medium">Sản phẩm yêu cầu</Label>
                    <FieldArray name="requestItems">
                      {({ push, remove }) => (
                        <>
                          {values.requestItems?.map((item, idx) => {
                            const variantRows = item.variantRows || []

                            const handleImageUpload = async (event) => {
                              const files = Array.from(event.target.files || [])
                              if (!files.length) return
                              for (const file of files) {
                                if (!file.type.startsWith('image/')) {
                                  toast.error('Vui lòng chọn file hình ảnh')
                                  return
                                }
                                if (file.size > 10 * 1024 * 1024) {
                                  toast.error('Kích thước file không được vượt quá 10MB')
                                  return
                                }
                              }
                              setUploadingIndex(idx)
                              try {
                                const newPreviews = files.map((f) => URL.createObjectURL(f))
                                const currentLocal = item.localImages || []
                                setFieldValue(`requestItems[${idx}].localImages`, [...currentLocal, ...newPreviews])
                                const uploadedUrls = []
                                for (const file of files) {
                                  const url = await uploadToCloudinary(file)
                                  if (url) uploadedUrls.push(url)
                                }
                                const currentImgs = item.images || []
                                setFieldValue(`requestItems[${idx}].images`, [...currentImgs, ...uploadedUrls])
                              } catch {
                                toast.error('Có lỗi xảy ra khi tải ảnh lên. Vui lòng thử lại.')
                              } finally {
                                setUploadingIndex(null)
                                // clear input value so same files can be re-selected
                                event.target.value = ''
                              }
                            }

                            const handleRemoveImage = (imgIdx) => {
                              const local = [...(item.localImages || [])]
                              const imgs = [...(item.images || [])]
                              local.splice(imgIdx, 1)
                              imgs.splice(imgIdx, 1)
                              setFieldValue(`requestItems[${idx}].localImages`, local)
                              setFieldValue(`requestItems[${idx}].images`, imgs)
                            }

                            const handleAddVariantRow = (fieldType) => {
                              const rows = [...(item.variantRows || [])]
                              rows.push({ attributeName: fieldType === 'Khác' ? '' : fieldType, fieldValue: '' })
                              setFieldValue(`requestItems[${idx}].variantRows`, rows)
                            }

                            const handleUpdateVariantRow = (variantIdx, changes) => {
                              const rows = [...(item.variantRows || [])]
                              rows[variantIdx] = { ...rows[variantIdx], ...changes }
                              setFieldValue(`requestItems[${idx}].variantRows`, rows)
                            }

                            const handleRemoveVariantRow = (variantIdx) => {
                              const rows = [...(item.variantRows || [])]
                              rows.splice(variantIdx, 1)
                              setFieldValue(`requestItems[${idx}].variantRows`, rows)
                            }

                            return (
                            <Card key={idx} className="border bg-white">
                              <CardContent className="p-4 space-y-4">
                                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                  <div className="space-y-2">
                                    <Label>Tên sản phẩm *</Label>
                                    <Field as={Input} name={`requestItems[${idx}].productName`} placeholder="Tên sản phẩm" />
                                    {touched.requestItems?.[idx]?.productName && errors.requestItems?.[idx]?.productName && (
                                      <div className="text-sm text-red-500">{errors.requestItems[idx].productName}</div>
                                    )}
                                  </div>
                                  <div className="space-y-2">
                                    <Label>Link sản phẩm</Label>
                                    <Field as={Input} name={`requestItems[${idx}].productURL`} placeholder="https://..." />
                                    {touched.requestItems?.[idx]?.productURL && errors.requestItems?.[idx]?.productURL && (
                                      <div className="text-sm text-red-500">{errors.requestItems[idx].productURL}</div>
                                    )}
                                  </div>
                                </div>

                                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                  <div className="space-y-2">
                                    <Label>Số lượng *</Label>
                                    <Field as={Input} type="number" min="1" name={`requestItems[${idx}].quantity`} />
                                    {touched.requestItems?.[idx]?.quantity && errors.requestItems?.[idx]?.quantity && (
                                      <div className="text-sm text-red-500">{errors.requestItems[idx].quantity}</div>
                                    )}
                                  </div>
                                  <div className="space-y-2">
                                    <Label>Ghi chú</Label>
                                    <Field as={Input} name={`requestItems[${idx}].description`} placeholder="Ghi chú" />
                                  </div>
                                </div>

                                {/* Image Upload Section */}
                                <div className="space-y-2">
                                  <Label>Hình ảnh sản phẩm</Label>
                                  <div className="flex flex-wrap gap-3">
                                    {(item.localImages || []).map((url, imgIdx) => (
                                      <div key={`${url}-${imgIdx}`} className="relative">
                                        <img src={url} alt={`Ảnh ${imgIdx + 1}`} className="w-20 h-20 object-cover rounded-lg border" />
                                        {uploadingIndex === idx && (
                                          <div className="absolute inset-0 flex items-center justify-center bg-white/60 rounded-lg">
                                            <Loader2 className="h-5 w-5 animate-spin text-blue-500" />
                                          </div>
                                        )}
                                        <Button
                                          type="button"
                                          variant="outline"
                                          size="sm"
                                          onClick={() => handleRemoveImage(imgIdx)}
                                          className="absolute -top-2 -right-2 h-6 w-6 p-0 bg-red-500 text-white hover:bg-red-600"
                                        >
                                          <X className="h-3 w-3" />
                                        </Button>
                                      </div>
                                    ))}
                                    <div>
                                      <input
                                        id={`file-input-${idx}`}
                                        type="file"
                                        accept="image/*"
                                        multiple
                                        onChange={handleImageUpload}
                                        className="hidden"
                                      />
                                      <Button
                                        type="button"
                                        variant="outline"
                                        onClick={() => document.getElementById(`file-input-${idx}`)?.click()}
                                        className="w-20 h-20 border-dashed border-2 border-gray-300 hover:border-blue-400"
                                      >
                                        {uploadingIndex === idx ? (
                                          <Loader2 className="h-4 w-4 animate-spin" />
                                        ) : (
                                          <Upload className="h-4 w-4" />
                                        )}
                                      </Button>
                                    </div>
                                  </div>
                                </div>

                                {/* Variant Fields */}
                                <div className="space-y-2">
                                  <Label>Thuộc tính sản phẩm</Label>
                                  {(variantRows || []).map((row, variantIdx) => {
                                    const isPredefined = PREDEFINED_VARIANT_FIELDS.includes(row?.attributeName)
                                    const usedNames = (variantRows || []).map((r, i) => (i !== variantIdx ? r?.attributeName : null))
                                    const options = PREDEFINED_VARIANT_FIELDS.filter((field) => field === 'Khác' || !usedNames.includes(field))
                                    return (
                                      <div key={`vr-${variantIdx}`} className="flex gap-2 mb-2 items-center">
                                        <Select
                                          value={isPredefined ? row?.attributeName : 'Khác'}
                                          onValueChange={(value) => {
                                            if (value === 'Khác') {
                                              handleUpdateVariantRow(variantIdx, { attributeName: '' })
                                            } else {
                                              handleUpdateVariantRow(variantIdx, { attributeName: value })
                                            }
                                          }}
                                        >
                                          <SelectTrigger className="h-10 min-w-[120px]">
                                            <SelectValue placeholder="Chọn thuộc tính" />
                                          </SelectTrigger>
                                          <SelectContent>
                                            {options.map((opt) => (
                                              <SelectItem key={opt} value={opt}>
                                                {opt}
                                              </SelectItem>
                                            ))}
                                          </SelectContent>
                                        </Select>
                                        {!isPredefined && (
                                          <Input
                                            value={row?.attributeName || ''}
                                            onChange={(e) => handleUpdateVariantRow(variantIdx, { attributeName: e.target.value })}
                                            placeholder="Tên thuộc tính"
                                            className="h-10 flex-1"
                                          />
                                        )}
                                        <Input
                                          value={row?.fieldValue || ''}
                                          onChange={(e) => handleUpdateVariantRow(variantIdx, { fieldValue: e.target.value })}
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
                                    )
                                  })}
                                  <div className="mt-2">
                                    <Select value="" onValueChange={handleAddVariantRow}>
                                      <SelectTrigger className="h-10 w-48">
                                        <SelectValue placeholder="+ Thêm thuộc tính" />
                                      </SelectTrigger>
                                      <SelectContent>
                                        {(() => {
                                          const used = (variantRows || []).map((r) => r?.attributeName)
                                          return PREDEFINED_VARIANT_FIELDS.filter((field) => field === 'Khác' || !used.includes(field)).map((opt) => (
                                            <SelectItem key={opt} value={opt}>
                                              {opt}
                                            </SelectItem>
                                          ))
                                        })()}
                                      </SelectContent>
                                    </Select>
                                  </div>
                                </div>
{/* 
                                <div className="flex justify-end">
                                  <Button
                                    type="button"
                                    variant="outline"
                                    className="text-red-600 hover:text-red-700 hover:bg-red-50"
                                    onClick={() => remove(idx)}
                                    disabled={values.requestItems.length <= 1}
                                  >
                                    Xóa sản phẩm
                                  </Button>
                                </div> */}
                              </CardContent>
                            </Card>
                          )})}

                          {/* <div className="pt-2">
                            <Button
                              type="button"
                              onClick={() =>
                                push({
                                  productName: '',
                                  productURL: '',
                                  quantity: 1,
                                  description: '',
                                  variantRows: [],
                                  images: [],
                                  localImages: [],
                                })
                              }
                              className="bg-emerald-600 hover:bg-emerald-700"
                            >
                              Thêm sản phẩm
                            </Button>
                          </div> */}
                        </>
                      )}
                    </FieldArray>
                  </div>

                  <div className="flex justify-end gap-3 pt-2">
                    <Button type="button" variant="outline" onClick={() => navigate(-1)}>Hủy</Button>
                    <Button type="submit" disabled={isSubmitting} className="bg-blue-600 hover:bg-blue-700">
                      {isSubmitting ? 'Đang lưu...' : 'Lưu thay đổi'}
                    </Button>
                  </div>
                </Form>
              )}
            </Formik>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}

export default PurchaseRequestEdit