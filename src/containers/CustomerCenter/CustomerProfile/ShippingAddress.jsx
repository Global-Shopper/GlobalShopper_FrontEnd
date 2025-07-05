import React, { useState } from 'react'
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

const ShippingAddress = () => {
  // Shipping addresses state
  const { data : addresses, isLoading: isAddressLoading, isError: isAddressError } = useGetShippingAddressQuery()
  const [ updateShippingAddress ] = useUpdateShippingAddressMutation()
  const [ deleteShippingAddress ] = useDeleteShippingAddressMutation()
  const [ defaultShippingAddress ] = useDefaultShippingAddressMutation()

  const [isPopoverOpen, setIsPopoverOpen] = useState(false)
  const [editingAddress, setEditingAddress] = useState(null)

  // Handle address operations
  const handleAddAddress = () => {
    setIsPopoverOpen(true)
  }

  const handleEditAddress = (address) => {
    setEditingAddress(address)
  }

  const handleSaveAddress = async (addressId) => {
    try {
      await updateShippingAddress({ id: addressId, ...editingAddress }).unwrap()
      .then(() => {
        toast.success("Cập nhật địa chỉ thành công", {
          description: "Địa chỉ đã được cập nhật thành công.",
        })
      })
      setEditingAddress(null);
    } catch (e) {
      toast.error("Cập nhật địa chỉ thất bại", {
        description: JSON.stringify(e?.data?.messages) || "Đã xảy ra lỗi khi cập nhật địa chỉ. Vui lòng thử lại sau.",
      })
      setEditingAddress(null);
    }
  };

  const handleDeleteAddress = async (addressId) => {
    try {
      await deleteShippingAddress(addressId).unwrap()
      .then(() => {
        toast.success("Xóa địa chỉ thành công")
      })
    } catch (e) {
      toast.error("Cập nhật địa chỉ thất bại", {
        description: e?.data?.message || "Đã xảy ra lỗi khi cập nhật địa chỉ. Vui lòng thử lại sau.",
      })
    }
  };

  const handleSetDefaultAddress = async (addressId) => {
    try {
      await defaultShippingAddress(addressId).unwrap()
      .then(() => {
        toast.success("Đặt địa chỉ mặc định thành công");
      })
    } catch (error) {
      toast.error("Đặt địa chỉ mặc định thất bại", {
        description: error?.data?.message || "Đã xảy ra lỗi khi đặt địa chỉ mặc định. Vui lòng thử lại sau.",
      });
    }
  };

  const handleClosePopover = () => {
    setIsPopoverOpen(false)
    setEditingAddress(null)
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
                    {editingAddress === address ? (
                      <div className="grid grid-cols-1 gap-4">
                        <div className="space-y-2">
                          <Label>Địa chỉ đầy đủ</Label>
                          <Input
                            value={editingAddress.location}
                            onChange={(e) => setEditingAddress({...editingAddress, location: e.target.value})}
                            className="text-base"
                          />
                        </div>
                        <div className="grid grid-cols-2 gap-4">
                          <div className="space-y-2">
                            <Label>Tên địa chỉ</Label>
                            <Input
                              value={editingAddress.name}
                              onChange={(e) => setEditingAddress({...editingAddress, name: e.target.value})}
                            />
                          </div>
                          <div className="space-y-2">
                            <Label>Nhãn</Label>
                            <Input
                              value={editingAddress.tag}
                              onChange={(e) => setEditingAddress({...editingAddress, tag: e.target.value})}
                            />
                          </div>
                        </div>
                        <div className="space-y-2">
                          <Label>Số điện thoại</Label>
                          <Input
                            value={editingAddress.phoneNumber}
                            onChange={(e) => setEditingAddress({...editingAddress, phoneNumber: e.target.value})}
                          />
                        </div>
                      </div>
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
                  {editingAddress === address && (
                    <CardFooter>
                      <div className="flex gap-2">
                        <Button onClick={() => handleSaveAddress(address.id)} className="flex items-center gap-2">
                          <Save className="h-4 w-4" />
                          Lưu thay đổi
                        </Button>
                        <Button variant="outline" onClick={handleClosePopover} className="flex items-center gap-2">
                          <X className="h-4 w-4" />
                          Hủy
                        </Button>
                      </div>
                    </CardFooter>
                  )}
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