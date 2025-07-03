import React, { useState, useEffect } from 'react'
import { Card, CardHeader, CardTitle, CardContent, CardFooter } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import {
  User, 
  Edit, 
  Save,
  X,
  Lock,
  Eye,
  EyeOff,
  Check
} from 'lucide-react'
import { useDispatch, useSelector } from 'react-redux'
import { useChangePasswordMutation, useGetCustomerInfoQuery, useUpdateCustomerProfileMutation } from '@/services/gshopApi'

const BasicInfo = () => {
  const dispatch = useDispatch()
  const name = useSelector((state) => state?.rootReducer?.user?.name)
  const phone = useSelector((state) => state?.rootReducer?.user?.phone)
  const avatar = useSelector((state) => state?.rootReducer?.user?.avatar)
  const email = useSelector((state) => state?.rootReducer?.user?.email)
  const [basicInfo, setBasicInfo] = useState({
    name: name,
    email: email,
    phone: phone,
    avatar: avatar
  })

  const [changePassword, { isLoading: isChangeLoading }] = useChangePasswordMutation()
  const { data: customerInfo, isLoading: isInfoLoading, isError: isInfoError } = useGetCustomerInfoQuery()
  const [updateProfile, { isLoading: isUpdateLoading }] = useUpdateCustomerProfileMutation()
  const [isEditingBasic, setIsEditingBasic] = useState(false)
  const [editBasicInfo, setEditBasicInfo] = useState(basicInfo)

  // Update local state when Redux data changes
  useEffect(() => {
    setBasicInfo({
      name: name,
      email: email,
      phone: phone,
      avatar: avatar
    })
    setEditBasicInfo({
      name: name,
      email: email,
      phone: phone,
      avatar: avatar
    })
  }, [name, email, phone, avatar])

  // Change password state
  const [isChangingPassword, setIsChangingPassword] = useState(false)
  const [passwordData, setPasswordData] = useState({
    currentPassword: '',
    newPassword: '',
    confirmPassword: ''
  })
  const [showPasswords, setShowPasswords] = useState({
    current: false,
    new: false,
    confirm: false
  })

  // Handle basic info editing
  const handleBasicInfoSave = () => {
    // Here you would typically dispatch an action to update user data in Redux
    // dispatch(updateUserProfile(editBasicInfo))
    
    setBasicInfo(editBasicInfo)
    setIsEditingBasic(false)
    
    // Example of how you might dispatch an action:
    // dispatch({
    //   type: 'user/updateProfile',
    //   payload: editBasicInfo
    // })
  }

  const handleBasicInfoCancel = () => {
    setEditBasicInfo(basicInfo)
    setIsEditingBasic(false)
  }

  // Handle password change
  const handlePasswordChange = () => {
    // Validate passwords
    if (passwordData.newPassword !== passwordData.confirmPassword) {
      alert('Mật khẩu mới và xác nhận mật khẩu không khớp!')
      return
    }
    
    if (passwordData.newPassword.length < 6) {
      alert('Mật khẩu mới phải có ít nhất 6 ký tự!')
      return
    }

    // Here you would typically dispatch an action to change password
    // dispatch(changePassword(passwordData))
    console.log('Changing password:', passwordData)
    
    // Reset form
    setPasswordData({
      currentPassword: '',
      newPassword: '',
      confirmPassword: ''
    })
    setIsChangingPassword(false)
    alert('Mật khẩu đã được thay đổi thành công!')
  }

  const handlePasswordCancel = () => {
    setPasswordData({
      currentPassword: '',
      newPassword: '',
      confirmPassword: ''
    })
    setIsChangingPassword(false)
  }

  const togglePasswordVisibility = (field) => {
    setShowPasswords(prev => ({
      ...prev,
      [field]: !prev[field]
    }))
  }

  return (
    <div className="space-y-6">
      {/* Basic Information Section */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <User className="h-5 w-5" />
            Thông tin cơ bản
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="flex items-start gap-6 mb-6">
            {/* Avatar */}
            <div className="flex flex-col items-center gap-2">
              <div className="w-24 h-24 rounded-full overflow-hidden border-2 border-gray-200">
                <img 
                  src={basicInfo.avatar} 
                  alt="Avatar" 
                  className="w-full h-full object-cover"
                />
              </div>
              {isEditingBasic && (
                <Button variant="outline" size="sm" className="text-xs">
                  Thay đổi ảnh
                </Button>
              )}
            </div>
            
            {/* Basic Info Form */}
            <div className="flex-1 grid grid-cols-1 gap-4">
              <div className="space-y-2">
                <Label htmlFor="name">Họ và tên</Label>
                <Input
                  id="name"
                  value={isEditingBasic ? editBasicInfo.name : basicInfo.name}
                  onChange={(e) => isEditingBasic && setEditBasicInfo({...editBasicInfo, name: e.target.value})}
                  disabled={!isEditingBasic}
                  placeholder="Nhập họ và tên"
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="email">Địa chỉ email</Label>
                <Input
                  id="email"
                  type="email"
                  value={isEditingBasic ? editBasicInfo.email : basicInfo.email}
                  onChange={(e) => isEditingBasic && setEditBasicInfo({...editBasicInfo, email: e.target.value})}
                  disabled={!isEditingBasic}
                  placeholder="Nhập địa chỉ email"
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="phone">Số điện thoại</Label>
                <Input
                  id="phone"
                  type="tel"
                  value={isEditingBasic ? editBasicInfo.phone : basicInfo.phone}
                  onChange={(e) => isEditingBasic && setEditBasicInfo({...editBasicInfo, phone: e.target.value})}
                  disabled={!isEditingBasic}
                  placeholder="Nhập số điện thoại"
                />
              </div>
            </div>
          </div>
        </CardContent>
        <CardFooter className="flex gap-2">
          {!isEditingBasic ? (
            <>
              <Button onClick={() => setIsEditingBasic(true)} className="flex items-center gap-2">
                <Edit className="h-4 w-4" />
                Chỉnh sửa thông tin
              </Button>
              <Button 
                variant="outline" 
                onClick={() => setIsChangingPassword(true)}
                className="flex items-center gap-2"
              >
                <Lock className="h-4 w-4" />
                Đổi mật khẩu
              </Button>
            </>
          ) : (
            <div className="flex gap-2">
              <Button onClick={handleBasicInfoSave} className="flex items-center gap-2">
                <Save className="h-4 w-4" />
                Lưu thay đổi
              </Button>
              <Button variant="outline" onClick={handleBasicInfoCancel} className="flex items-center gap-2">
                <X className="h-4 w-4" />
                Hủy
              </Button>
            </div>
          )}
        </CardFooter>
      </Card>

      {/* Change Password Section */}
      {isChangingPassword && (
        <Card className="border-dashed border-2">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Lock className="h-5 w-5" />
              Đổi mật khẩu
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 gap-4">
              <div className="space-y-2">
                <Label htmlFor="currentPassword">Mật khẩu hiện tại</Label>
                <div className="relative">
                  <Input
                    id="currentPassword"
                    type={showPasswords.current ? "text" : "password"}
                    value={passwordData.currentPassword}
                    onChange={(e) => setPasswordData({...passwordData, currentPassword: e.target.value})}
                    placeholder="Nhập mật khẩu hiện tại"
                  />
                  <Button
                    type="button"
                    variant="ghost"
                    size="sm"
                    className="absolute right-0 top-0 h-full px-3 py-2 hover:bg-transparent"
                    onClick={() => togglePasswordVisibility('current')}
                  >
                    {showPasswords.current ? (
                      <EyeOff className="h-4 w-4" />
                    ) : (
                      <Eye className="h-4 w-4" />
                    )}
                  </Button>
                </div>
              </div>
              <div className="space-y-2">
                <Label htmlFor="newPassword">Mật khẩu mới</Label>
                <div className="relative">
                  <Input
                    id="newPassword"
                    type={showPasswords.new ? "text" : "password"}
                    value={passwordData.newPassword}
                    onChange={(e) => setPasswordData({...passwordData, newPassword: e.target.value})}
                    placeholder="Nhập mật khẩu mới"
                  />
                  <Button
                    type="button"
                    variant="ghost"
                    size="sm"
                    className="absolute right-0 top-0 h-full px-3 py-2 hover:bg-transparent"
                    onClick={() => togglePasswordVisibility('new')}
                  >
                    {showPasswords.new ? (
                      <EyeOff className="h-4 w-4" />
                    ) : (
                      <Eye className="h-4 w-4" />
                    )}
                  </Button>
                </div>
              </div>
              <div className="space-y-2">
                <Label htmlFor="confirmPassword">Xác nhận mật khẩu mới</Label>
                <div className="relative">
                  <Input
                    id="confirmPassword"
                    type={showPasswords.confirm ? "text" : "password"}
                    value={passwordData.confirmPassword}
                    onChange={(e) => setPasswordData({...passwordData, confirmPassword: e.target.value})}
                    placeholder="Nhập lại mật khẩu mới"
                  />
                  <Button
                    type="button"
                    variant="ghost"
                    size="sm"
                    className="absolute right-0 top-0 h-full px-3 py-2 hover:bg-transparent"
                    onClick={() => togglePasswordVisibility('confirm')}
                  >
                    {showPasswords.confirm ? (
                      <EyeOff className="h-4 w-4" />
                    ) : (
                      <Eye className="h-4 w-4" />
                    )}
                  </Button>
                </div>
              </div>
            </div>
          </CardContent>
          <CardFooter>
            <div className="flex gap-2">
              <Button onClick={handlePasswordChange} className="flex items-center gap-2">
                <Check className="h-4 w-4" />
                Đổi mật khẩu
              </Button>
              <Button variant="outline" onClick={handlePasswordCancel} className="flex items-center gap-2">
                <X className="h-4 w-4" />
                Hủy
              </Button>
            </div>
          </CardFooter>
        </Card>
      )}
    </div>
  )
}

export default BasicInfo 