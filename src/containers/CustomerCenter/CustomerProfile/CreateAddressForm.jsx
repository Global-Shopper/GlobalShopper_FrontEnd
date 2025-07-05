import React, { useState } from 'react'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { PopoverContent } from '@/components/ui/popover'
import { Check, X } from 'lucide-react'
import { useCreateShippingAddressMutation } from '@/services/gshopApi'
import { toast } from 'sonner'

const CreateAddressForm = ({ onClose, onSuccess }) => {
  const [createShippingAddress] = useCreateShippingAddressMutation()

  const [formData, setFormData] = useState({
    name: '',
    tag: '',
    phoneNumber: '',
    location: '',
    default: false
  })

  const [isSubmitting, setIsSubmitting] = useState(false)

  const handleSubmit = async (e) => {
    e.preventDefault()
    setIsSubmitting(true)
    
    try {
      await createShippingAddress(formData).unwrap()
      .then(() => {
        toast.success("Cập nhật địa chỉ thành công", {
          description: "Địa chỉ mới đã được thêm thành công.",
        })
      })
      
      if (onSuccess) {
        onSuccess()
      }
      onClose()
    } catch {
      toast.error("Cập nhật địa chỉ thất bại", {
        description: "Đã xảy ra lỗi khi cập nhật địa chỉ. Vui lòng thử lại sau.",
      })
    } finally {
      setIsSubmitting(false)
    }
  }

  const handleCancel = () => {
    onClose()
  }

  const resetForm = () => {
    setFormData({
      name: '',
      tag: '',
      phoneNumber: '',
      location: '',
      default: false
    })
  }

  return (
    <PopoverContent className="p-6 w-96">
      <form onSubmit={handleSubmit}>
        <h2 className="font-semibold text-lg mb-4">
          Thêm địa chỉ mới
        </h2>
        
        <div className="space-y-4">
          {/* Location Field - Most Important */}
          <div>
            <Label htmlFor="addressLocation" className="text-sm font-medium">
              Địa chỉ đầy đủ *
            </Label>
            <Input
              id="addressLocation"
              value={formData.location}
              onChange={(e) => setFormData({ ...formData, location: e.target.value })}
              placeholder="123 Đường ABC, Quận XYZ, Thành phố, Việt Nam"
              className="text-base mt-1"
              required
            />
          </div>

          {/* Name and Tag Fields */}
          <div className="grid grid-cols-2 gap-4">
            <div>
              <Label htmlFor="addressName" className="text-sm font-medium">
                Tên địa chỉ *
              </Label>
              <Input
                id="addressName"
                value={formData.name}
                onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                placeholder="Nhà riêng"
                className="mt-1"
                required
              />
            </div>
            <div>
              <Label htmlFor="addressTag" className="text-sm font-medium">
                Nhãn *
              </Label>
              <Input
                id="addressTag"
                value={formData.tag}
                onChange={(e) => setFormData({ ...formData, tag: e.target.value })}
                placeholder="Nhà, Văn phòng, v.v."
                className="mt-1"
                required
              />
            </div>
          </div>

          {/* Phone Number Field */}
          <div>
            <Label htmlFor="addressPhone" className="text-sm font-medium">
              Số điện thoại *
            </Label>
            <Input
              id="addressPhone"
              type="tel"
              value={formData.phoneNumber}
              onChange={(e) => setFormData({ ...formData, phoneNumber: e.target.value })}
              placeholder="0576954144"
              className="mt-1"
              required
            />
          </div>

          {/* Default Address Checkbox */}
          <div className="flex items-center space-x-2 pt-2">
            <input
              type="checkbox"
              id="defaultAddress"
              checked={formData.default}
              onChange={(e) => setFormData({ ...formData, default: e.target.checked })}
              className="rounded border-gray-300 text-primary focus:ring-primary"
            />
            <Label htmlFor="defaultAddress" className="text-sm">
              Đặt làm địa chỉ mặc định
            </Label>
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
      </form>
    </PopoverContent>
  )
}

export default CreateAddressForm
