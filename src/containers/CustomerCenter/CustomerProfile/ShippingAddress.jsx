import React, { useState } from 'react'
import { Card, CardHeader, CardTitle, CardContent, CardFooter } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Badge } from '@/components/ui/badge'
import { 
  MapPin, 
  Plus, 
  Edit, 
  Trash2, 
  Star,
  Save,
  X,
  Check,
  Phone
} from 'lucide-react'

const ShippingAddress = () => {
  // Shipping addresses state
  const [addresses, setAddresses] = useState([
    {
      id: 1,
      name: 'Nhà riêng',
      tag: 'Nhà',
      phoneNumber: '0576954144',
      location: '123 Đường Nguyễn Huệ, Quận 1, Hồ Chí Minh, Việt Nam',
      default: true
    },
    {
      id: 2,
      name: 'Công ty',
      tag: 'Văn phòng',
      phoneNumber: '0987654321',
      location: '456 Đường Lê Lợi, Quận 3, Hồ Chí Minh, Việt Nam',
      default: false
    }
  ])

  const [isAddingAddress, setIsAddingAddress] = useState(false)
  const [editingAddressId, setEditingAddressId] = useState(null)
  const [newAddress, setNewAddress] = useState({
    name: '',
    tag: '',
    phoneNumber: '',
    location: '',
    default: false
  })

  // Handle address operations
  const handleAddAddress = () => {
    const addressToAdd = {
      ...newAddress,
      id: Date.now(),
      default: addresses.length === 0
    }
    setAddresses([...addresses, addressToAdd])
    setNewAddress({
      name: '',
      tag: '',
      phoneNumber: '',
      location: '',
      default: false
    })
    setIsAddingAddress(false)
  }

  const handleEditAddress = (address) => {
    setEditingAddressId(address.id)
    setNewAddress({
      name: address.name,
      tag: address.tag,
      phoneNumber: address.phoneNumber,
      location: address.location,
      default: address.default
    })
  }

  const handleSaveAddress = (addressId) => {
    setAddresses(addresses.map(addr => 
      addr.id === addressId 
        ? { ...addr, ...newAddress }
        : addr
    ))
    setEditingAddressId(null)
  }

  const handleDeleteAddress = (addressId) => {
    const addressToDelete = addresses.find(addr => addr.id === addressId)
    if (addressToDelete.default && addresses.length > 1) {
      // Set the first non-default address as default
      const newDefault = addresses.find(addr => addr.id !== addressId)
      setAddresses(addresses.filter(addr => addr.id !== addressId).map(addr => 
        addr.id === newDefault.id ? { ...addr, default: true } : addr
      ))
    } else {
      setAddresses(addresses.filter(addr => addr.id !== addressId))
    }
  }

  const handleSetDefaultAddress = (addressId) => {
    setAddresses(addresses.map(addr => ({
      ...addr,
      default: addr.id === addressId
    })))
  }

  const handleCancelAddress = () => {
    setEditingAddressId(null)
    setIsAddingAddress(false)
    setNewAddress({
      name: '',
      tag: '',
      phoneNumber: '',
      location: '',
      default: false
    })
  }

  return (
    <div className="space-y-6">
      {/* Shipping Addresses Section */}
      <Card>
        <CardHeader>
          <div className="flex items-center justify-between">
            <CardTitle className="flex items-center gap-2">
              <MapPin className="h-5 w-5" />
              Địa chỉ giao hàng
            </CardTitle>
            <Button 
              onClick={() => setIsAddingAddress(true)} 
              className="flex items-center gap-2"
              disabled={isAddingAddress}
            >
              <Plus className="h-4 w-4" />
              Thêm địa chỉ mới
            </Button>
          </div>
        </CardHeader>
        <CardContent className="space-y-4">
          {/* Add New Address Form */}
          {isAddingAddress && (
            <Card className="border-dashed border-2">
              <CardHeader>
                <CardTitle className="text-lg">Thêm địa chỉ mới</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-1 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="addressName">Tên địa chỉ</Label>
                    <Input
                      id="addressName"
                      value={newAddress.name}
                      onChange={(e) => setNewAddress({...newAddress, name: e.target.value})}
                      placeholder="Nhà riêng"
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="addressTag">Nhãn</Label>
                    <Input
                      id="addressTag"
                      value={newAddress.tag}
                      onChange={(e) => setNewAddress({...newAddress, tag: e.target.value})}
                      placeholder="Nhà, Văn phòng, v.v."
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="addressPhone">Số điện thoại</Label>
                    <Input
                      id="addressPhone"
                      type="tel"
                      value={newAddress.phoneNumber}
                      onChange={(e) => setNewAddress({...newAddress, phoneNumber: e.target.value})}
                      placeholder="0576954144"
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="addressLocation">Địa chỉ đầy đủ</Label>
                    <Input
                      id="addressLocation"
                      value={newAddress.location}
                      onChange={(e) => setNewAddress({...newAddress, location: e.target.value})}
                      placeholder="123 Đường ABC, Quận XYZ, Thành phố, Việt Nam"
                    />
                  </div>
                </div>
              </CardContent>
              <CardFooter>
                <div className="flex gap-2">
                  <Button onClick={handleAddAddress} className="flex items-center gap-2">
                    <Check className="h-4 w-4" />
                    Thêm địa chỉ
                  </Button>
                  <Button variant="outline" onClick={handleCancelAddress} className="flex items-center gap-2">
                    <X className="h-4 w-4" />
                    Hủy
                  </Button>
                </div>
              </CardFooter>
            </Card>
          )}

          {/* Existing Addresses */}
          <div className="space-y-4">
            {addresses.map((address) => (
              <Card key={address.id} className={`relative ${address.default ? 'ring-2 ring-primary/20 bg-primary/5' : ''}`}>
                {address.default && (
                  <div className="absolute -top-2 -right-2">
                    <Badge className="bg-primary text-primary-foreground flex items-center gap-1">
                      <Star className="h-3 w-3 fill-current" />
                      Mặc định
                    </Badge>
                  </div>
                )}
                <CardContent className="pt-6">
                  {editingAddressId === address.id ? (
                    <div className="grid grid-cols-1 gap-4">
                      <div className="space-y-2">
                        <Label>Tên địa chỉ</Label>
                        <Input
                          value={newAddress.name}
                          onChange={(e) => setNewAddress({...newAddress, name: e.target.value})}
                        />
                      </div>
                      <div className="space-y-2">
                        <Label>Nhãn</Label>
                        <Input
                          value={newAddress.tag}
                          onChange={(e) => setNewAddress({...newAddress, tag: e.target.value})}
                        />
                      </div>
                      <div className="space-y-2">
                        <Label>Số điện thoại</Label>
                        <Input
                          value={newAddress.phoneNumber}
                          onChange={(e) => setNewAddress({...newAddress, phoneNumber: e.target.value})}
                        />
                      </div>
                      <div className="space-y-2">
                        <Label>Địa chỉ đầy đủ</Label>
                        <Input
                          value={newAddress.location}
                          onChange={(e) => setNewAddress({...newAddress, location: e.target.value})}
                        />
                      </div>
                    </div>
                  ) : (
                    <div>
                      <div className="flex items-start justify-between mb-3">
                        <div>
                          <h3 className="font-semibold text-lg">{address.name}</h3>
                          <div className="flex items-center gap-2">
                            <Badge variant="secondary" className="text-xs">
                              {address.tag}
                            </Badge>
                            {address.default && (
                              <Badge className="bg-primary text-primary-foreground text-xs flex items-center gap-1">
                                <Star className="h-3 w-3 fill-current" />
                                Mặc định
                              </Badge>
                            )}
                          </div>
                        </div>
                      </div>
                      <div className="space-y-2 text-sm">
                        <p className="text-muted-foreground">{address.location}</p>
                        <p className="flex items-center gap-1">
                          <Phone className="h-3 w-3" />
                          {address.phoneNumber}
                        </p>
                      </div>
                    </div>
                  )}
                </CardContent>
                <CardFooter>
                  {editingAddressId === address.id ? (
                    <div className="flex gap-2">
                      <Button onClick={() => handleSaveAddress(address.id)} className="flex items-center gap-2">
                        <Save className="h-4 w-4" />
                        Lưu thay đổi
                      </Button>
                      <Button variant="outline" onClick={handleCancelAddress} className="flex items-center gap-2">
                        <X className="h-4 w-4" />
                        Hủy
                      </Button>
                    </div>
                  ) : (
                    <div className="flex gap-2">
                      <Button 
                        variant="outline" 
                        onClick={() => handleEditAddress(address)}
                        className="flex items-center gap-2"
                      >
                        <Edit className="h-4 w-4" />
                        Chỉnh sửa
                      </Button>
                      {!address.default && (
                        <Button 
                          variant="outline" 
                          onClick={() => handleSetDefaultAddress(address.id)}
                          className="flex items-center gap-2"
                        >
                          <Star className="h-4 w-4" />
                          Đặt làm mặc định
                        </Button>
                      )}
                      <Button 
                        variant="outline" 
                        onClick={() => handleDeleteAddress(address.id)}
                        className="flex items-center gap-2 text-destructive hover:text-destructive"
                      >
                        <Trash2 className="h-4 w-4" />
                        Xóa
                      </Button>
                    </div>
                  )}
                </CardFooter>
              </Card>
            ))}
          </div>

          {addresses.length === 0 && !isAddingAddress && (
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