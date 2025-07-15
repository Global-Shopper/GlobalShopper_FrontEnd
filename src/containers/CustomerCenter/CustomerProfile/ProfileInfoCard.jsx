import { useState, useEffect, useRef } from "react"
import { Card, CardHeader, CardTitle, CardContent, CardFooter } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { User, Edit, Save, X, Lock, Eye, EyeOff, Check, Mail, Camera } from "lucide-react"
import { useDispatch } from "react-redux"
import {
  useChangeEmailMutation,
  useChangePasswordMutation,
  useGetCustomerInfoQuery,
  useUpdateCustomerProfileMutation,
  useUploadAvatarMutation,
  useVerifyChangeEmailMutation,
} from "@/services/gshopApi"
import { toast } from "sonner"
import { setAccessToken, setAvatar, setCustomerBaseInfo, setEmail, setUserInfo } from "@/features/user"
import * as Yup from "yup"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { useLocation, useNavigate } from "react-router-dom"

const ProfileInfoCard = () => {
  const navigate = useNavigate()
  const dispatch = useDispatch()
  const location = useLocation()

  // Get customer info from API
  const { data: customerInfo, isLoading: isInfoLoading, isError: isInfoError } = useGetCustomerInfoQuery()

  // API mutations
  const [changePassword, { isLoading: isChangePasswordLoading }] = useChangePasswordMutation()
  const [updateProfile, { isLoading: isUpdateLoading }] = useUpdateCustomerProfileMutation()
  const [uploadAvatar, { isLoading: isUploadLoading }] = useUploadAvatarMutation()
  const [changeEmail, { isLoading: isChangeEmailLoading }] = useChangeEmailMutation()


  const [isEditingEmail, setIsEditingEmail] = useState(false)
  const [isEditingBasic, setIsEditingBasic] = useState(false)

  // Edit states - initialize with customerInfo
  const [editBasicInfo, setEditBasicInfo] = useState({
    name: '',
    phone: '',
    gender: '',
    dateOfBirth: ''
  })
  const [editEmail, setEditEmail] = useState('')
  const fileInputRef = useRef(null)

  // Update edit states when customerInfo changes
  useEffect(() => {
    if (customerInfo) {
      setEditBasicInfo({
        name: customerInfo?.name || '',
        phone: customerInfo?.phone || '',
        gender: customerInfo?.gender || '',
        dateOfBirth: customerInfo?.dateOfBirth || ''
      })
      setEditEmail(customerInfo?.email || '')
    }
  }, [customerInfo])

  // Validation states
  const [validationErrors, setValidationErrors] = useState({
    name: '',
    phone: '',
    gender: '',
    dateOfBirth: ''
  })

  // Yup validation schema
  const validationSchema = Yup.object({
    name: Yup.string()
      .required("Họ và tên là bắt buộc")
      .max(30, "Họ và tên không được vượt quá 30 ký tự"),
    phone: Yup.string()
      .required("Số điện thoại là bắt buộc")
      .matches(
        /^(\+84|0)[0-9]{9,10}$/,
        "Số điện thoại không hợp lệ (ví dụ: +84909123456 hoặc 0912345678)"
      ),
    gender: Yup.string()
      .required("Giới tính là bắt buộc")
      .oneOf(["MALE", "FEMALE", "OTHER"], "Giới tính không hợp lệ"),
    dateOfBirth: Yup.number()
      .required("Ngày sinh là bắt buộc")
      .min(0, "Ngày sinh không hợp lệ")
  })

  // Validate form
  const validateForm = async () => {
    try {
      await validationSchema.validate(editBasicInfo, { abortEarly: false })
      setValidationErrors({
        name: '',
        phone: '',
        gender: '',
        dateOfBirth: ''
      })
      return true
    } catch (error) {
      const errors = {}
      error.inner.forEach((err) => {
        errors[err.path] = err.message
      })
      setValidationErrors(errors)
      return false
    }
  }

  // Change password state
  const [isChangingPassword, setIsChangingPassword] = useState(false)
  const [passwordData, setPasswordData] = useState({
    oldPassword: "",
    newPassword: "",
    confirmPassword: "",
  })
  const [showPasswords, setShowPasswords] = useState({
    current: false,
    new: false,
    confirm: false,
  })

  const handleUploadAvatar = async (event) => {
    const file = event.target.files[0]
    if (!file) return

    try {
      const payload = {
        file: file,
      }
      const response = await uploadAvatar(payload).unwrap()

      // Update Redux state - only avatar
      const newAvatarUrl = response?.avatar || response?.avatarUrl || response?.data?.avatarUrl
      dispatch(setAvatar(newAvatarUrl))
      toast.success("Cập nhật ảnh đại diện thành công!")
    } catch (error) {
      toast.error(error?.data?.message || "Tải ảnh đại diện thất bại!")
      console.error("Upload avatar failed", error)
    }
  }

  // Handle email editing
  const handleEmailSave = async () => {
    try {
      await changeEmail().unwrap()
        .then(() => {
          setIsEditingEmail(false)
          navigate("/otp-verify/change-email", { state: { email: editEmail } })
        })
    } catch (error) {
      toast.error("Cập nhật email thất bại!", {
        description: error?.data?.message || "Vui lòng thử lại.",
      })
    }
  }

  const handleEmailCancel = () => {
    setEditEmail(editEmail)
    setIsEditingEmail(false)
  }

  // Handle basic info editing (name, phone, gender, dateOfBirth)
  const handleBasicInfoSave = async () => {
    // Validate form before saving
    const isValid = await validateForm()
    if (!isValid) {
      toast.error("Vui lòng kiểm tra lại thông tin!")
      return
    }

    try {
      const updatedData = {
        name: editBasicInfo.name,
        phone: editBasicInfo.phone,
        gender: editBasicInfo.gender,
        dateOfBirth: editBasicInfo.dateOfBirth,
      }
      await updateProfile(updatedData).unwrap()
        .then(() => {
          dispatch(setCustomerBaseInfo({
            name: editBasicInfo.name,
            phone: editBasicInfo.phone,
            gender: editBasicInfo.gender,
            dateOfBirth: editBasicInfo.dateOfBirth
          }))
          setIsEditingBasic(false)
          toast.success("Cập nhật thông tin thành công!")
        }
        )

    } catch {
      toast.error("Cập nhật thông tin thất bại!", {
        description: "Vui lòng thử lại.",
      })
    }
  }

  const handleBasicInfoCancel = () => {
    setEditBasicInfo(customerInfo)
    setValidationErrors({
      name: '',
      phone: '',
      gender: '',
      dateOfBirth: ''
    })
    setIsEditingBasic(false)
  }

  // Handle password change
  const handlePasswordChange = async () => {
    if (passwordData.newPassword !== passwordData.confirmPassword) {
      toast.error("Mật khẩu mới và xác nhận mật khẩu không khớp!")
      return
    }

    if (passwordData.newPassword.length < 6) {
      toast.error("Mật khẩu mới phải có ít nhất 6 ký tự!")
      return
    }

    try {
      await changePassword({
        oldPassword: passwordData.oldPassword,
        newPassword: passwordData.newPassword,
      }).unwrap()

      setPasswordData({
        oldPassword: "",
        newPassword: "",
        confirmPassword: "",
      })
      setIsChangingPassword(false)
      toast.success("Mật khẩu đã được thay đổi thành công!")
    } catch (error) {
      toast.error("Đổi mật khẩu thất bại!", {
        description: error?.data?.message || "Vui lòng thử lại.",
      })
    }
  }

  const handlePasswordCancel = () => {
    setPasswordData({
      oldPassword: "",
      newPassword: "",
      confirmPassword: "",
    })
    setIsChangingPassword(false)
  }

  const togglePasswordVisibility = (field) => {
    setShowPasswords((prev) => ({
      ...prev,
      [field]: !prev[field],
    }))
  }

  // Convert epoch milliseconds to date string for display
  const formatDateOfBirth = (epochMs) => {
    if (!epochMs) return ''
    const date = new Date(epochMs)
    return date.toISOString().split('T')[0]
  }

  // Convert date string to epoch milliseconds
  const parseDateOfBirth = (dateString) => {
    if (!dateString) return ''
    return new Date(dateString).getTime()
  }

  useEffect(() => {
    const query = new URLSearchParams(location.search);
    const token = query.get("token");
    if (token) {
      dispatch(setAccessToken(token))
      if (customerInfo) {
        dispatch(setUserInfo(customerInfo))
      }
    }
  }, [customerInfo, dispatch, location])

  // Loading state
  if (isInfoLoading) {
    return (
      <div className="space-y-4">
        <Card>
          <CardHeader className="pb-3">
            <CardTitle className="flex items-center gap-2 text-lg">
              <User className="h-4 w-4" />
              Thông tin cá nhân
            </CardTitle>
          </CardHeader>
          <CardContent className="pt-0">
            <div className="animate-pulse space-y-4">
              <div className="h-20 bg-gray-200 rounded-full w-20"></div>
              <div className="space-y-2">
                <div className="h-4 bg-gray-200 rounded w-1/4"></div>
                <div className="h-10 bg-gray-200 rounded"></div>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    )
  }

  // Error state
  if (isInfoError) {
    return (
      <div className="space-y-4">
        <Card>
          <CardContent className="pt-6">
            <div className="text-center text-red-600">
              <p>Có lỗi xảy ra khi tải thông tin. Vui lòng thử lại.</p>
            </div>
          </CardContent>
        </Card>
      </div>
    )
  }

  return (
    <div className="space-y-4">
      {/* Combined Profile Information Card */}
      <Card>
        <CardHeader className="pb-3">
          <CardTitle className="flex items-center gap-2 text-lg">
            <User className="h-4 w-4" />
            Thông tin cá nhân
          </CardTitle>
        </CardHeader>
        <CardContent className="pt-0 space-y-6">
          {/* Avatar Section */}
          <div className="flex items-center gap-4">
            <div className="relative group">
              <div
                className="w-20 h-20 rounded-full overflow-hidden border-2 border-gray-200 cursor-pointer hover:border-blue-500 transition-colors"
                onClick={() => fileInputRef.current?.click()}
              >
                <img
                  src={customerInfo?.avatar || "/default-avatar.png"}
                  alt="Avatar"
                  className="w-full h-full object-cover"
                />
                <div className="absolute inset-0 bg-black bg-opacity-50 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity rounded-full">
                  <Camera className="h-6 w-6 text-white" />
                </div>
              </div>
              <input
                ref={fileInputRef}
                type="file"
                accept="image/*"
                onChange={handleUploadAvatar}
                className="hidden"
                disabled={isUploadLoading}
              />
            </div>
            {/* Email Section */}
            <div className="space-y-2">
              <div className="flex items-center gap-2">
                <Mail className="h-4 w-4 text-muted-foreground" />
                <Label className="text-sm font-medium">Địa chỉ email</Label>
              </div>

              <div className="space-y-3">
                <Input
                  id="email"
                  type="email"
                  value={isEditingEmail ? editEmail : customerInfo?.email || ''}
                  onChange={(e) => {
                    console.log(e.target.value)
                    setEditEmail(e.target.value)
                  }}
                  disabled={!isEditingEmail}
                  placeholder="Nhập địa chỉ email"
                  className="max-w-xs w-screen"
                />

                {!isEditingEmail ? (
                  <div className="flex items-center gap-2">
                    <Button
                      onClick={() => setIsEditingEmail(true)}
                      variant="outline"
                      size="sm"
                      className="flex items-center gap-2"
                    >
                      <Edit className="h-3 w-3" />
                      Chỉnh sửa email
                    </Button>
                    <p className="text-xs text-muted-foreground">*OTP sẽ được gửi tới địa chỉ email cũ để xác nhận</p>
                  </div>
                ) : (
                  <div className="flex flex-wrap gap-2">
                    <Button
                      onClick={handleEmailSave}
                      size="sm"
                      className="flex items-center gap-2"
                      disabled={isChangeEmailLoading}
                    >
                      <Save className="h-3 w-3" />
                      {isChangeEmailLoading ? "Đang lưu..." : "Lưu thay đổi"}
                    </Button>
                    <Button
                      variant="outline"
                      onClick={handleEmailCancel}
                      size="sm"
                      className="flex items-center gap-2 bg-transparent"
                    >
                      <X className="h-3 w-3" />
                      Hủy
                    </Button>
                  </div>
                )}
              </div>
            </div>
          </div>

          {/* Basic Info Section */}
          <div className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="name">Họ và tên</Label>
                <Input
                  id="name"
                  value={isEditingBasic ? editBasicInfo?.name : customerInfo?.name || ''}
                  onChange={(e) => isEditingBasic && setEditBasicInfo({ ...editBasicInfo, name: e.target.value })}
                  disabled={!isEditingBasic}
                  placeholder="Nhập họ và tên"
                  className={validationErrors.name ? "border-red-500" : ""}
                />
                {validationErrors.name && (
                  <p className="text-sm text-red-500">{validationErrors.name}</p>
                )}
              </div>
              <div className="space-y-2">
                <Label htmlFor="phone">Số điện thoại</Label>
                <Input
                  id="phone"
                  type="tel"
                  value={isEditingBasic ? editBasicInfo?.phone : customerInfo?.phone || ''}
                  onChange={(e) => isEditingBasic && setEditBasicInfo({ ...editBasicInfo, phone: e.target.value })}
                  disabled={!isEditingBasic}
                  placeholder="Nhập số điện thoại"
                  className={validationErrors.phone ? "border-red-500" : ""}
                />
                {validationErrors.phone && (
                  <p className="text-sm text-red-500">{validationErrors.phone}</p>
                )}
              </div>
              <div className="space-y-2">
                <Label htmlFor="gender">Giới tính</Label>
                <Select
                  value={isEditingBasic ? editBasicInfo?.gender : customerInfo?.gender || ''}
                  onValueChange={(value) => isEditingBasic && setEditBasicInfo({ ...editBasicInfo, gender: value })}
                  disabled={!isEditingBasic}
                >
                  <SelectTrigger className={validationErrors.gender ? "border-red-500" : ""}>
                    <SelectValue placeholder="Chọn giới tính" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="MALE">Nam</SelectItem>
                    <SelectItem value="FEMALE">Nữ</SelectItem>
                    <SelectItem value="OTHER">Khác</SelectItem>
                  </SelectContent>
                </Select>
                {validationErrors.gender && (
                  <p className="text-sm text-red-500">{validationErrors.gender}</p>
                )}
              </div>
              <div className="space-y-2">
                <Label htmlFor="dateOfBirth">Ngày sinh</Label>
                <Input
                  id="dateOfBirth"
                  type="date"
                  value={isEditingBasic ? formatDateOfBirth(editBasicInfo.dateOfBirth) : formatDateOfBirth(customerInfo?.dateOfBirth)}
                  onChange={(e) => isEditingBasic && setEditBasicInfo({
                    ...editBasicInfo,
                    dateOfBirth: parseDateOfBirth(e.target.value)
                  })}
                  disabled={!isEditingBasic}
                  className={validationErrors.dateOfBirth ? "border-red-500" : ""}
                />
                {validationErrors.dateOfBirth && (
                  <p className="text-sm text-red-500">{validationErrors.dateOfBirth}</p>
                )}
              </div>
            </div>

            {!isEditingBasic ? (
              <div className="flex flex-wrap gap-2">
                <Button
                  onClick={() => setIsEditingBasic(true)}
                  size="sm"
                  className="flex items-center gap-2"
                >
                  <Edit className="h-3 w-3" />
                  Chỉnh sửa thông tin
                </Button>
                <Button
                  variant="outline"
                  onClick={() => setIsChangingPassword(true)}
                  size="sm"
                  className="flex items-center gap-2"
                >
                  <Lock className="h-3 w-3" />
                  Đổi mật khẩu
                </Button>
              </div>
            ) : (
              <div className="flex flex-wrap gap-2">
                <Button
                  onClick={handleBasicInfoSave}
                  size="sm"
                  className="flex items-center gap-2"
                  disabled={isUpdateLoading}
                >
                  <Save className="h-3 w-3" />
                  {isUpdateLoading ? "Đang lưu..." : "Lưu thay đổi"}
                </Button>
                <Button
                  variant="outline"
                  onClick={handleBasicInfoCancel}
                  size="sm"
                  className="flex items-center gap-2"
                >
                  <X className="h-3 w-3" />
                  Hủy
                </Button>
              </div>
            )}
          </div>

        </CardContent>
      </Card>

      {/* Change Password Section - Keep as separate card when active */}
      {isChangingPassword && (
        <Card className="border-dashed border-2">
          <CardHeader className="pb-3">
            <CardTitle className="flex items-center gap-2 text-lg">
              <Lock className="h-4 w-4" />
              Đổi mật khẩu
            </CardTitle>
          </CardHeader>
          <CardContent className="pt-0">
            <div className="grid grid-cols-1 gap-4">
              <div className="space-y-2">
                <Label htmlFor="oldPassword">Mật khẩu hiện tại</Label>
                <div className="relative">
                  <Input
                    id="oldPassword"
                    type={showPasswords?.current ? "text" : "password"}
                    value={passwordData?.oldPassword}
                    onChange={(e) => setPasswordData({ ...passwordData, oldPassword: e?.target?.value })}
                    placeholder="Nhập mật khẩu hiện tại"
                  />
                  <Button
                    type="button"
                    variant="ghost"
                    size="sm"
                    className="absolute right-0 top-0 h-full px-3 py-2 hover:bg-transparent"
                    onClick={() => togglePasswordVisibility("current")}
                  >
                    {showPasswords.current ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                  </Button>
                </div>
              </div>
              <div className="space-y-2">
                <Label htmlFor="newPassword">Mật khẩu mới</Label>
                <div className="relative">
                  <Input
                    id="newPassword"
                    type={showPasswords?.new ? "text" : "password"}
                    value={passwordData?.newPassword}
                    onChange={(e) => setPasswordData({ ...passwordData, newPassword: e?.target?.value })}
                    placeholder="Nhập mật khẩu mới"
                  />
                  <Button
                    type="button"
                    variant="ghost"
                    size="sm"
                    className="absolute right-0 top-0 h-full px-3 py-2 hover:bg-transparent"
                    onClick={() => togglePasswordVisibility("new")}
                  >
                    {showPasswords.new ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                  </Button>
                </div>
              </div>
              <div className="space-y-2">
                <Label htmlFor="confirmPassword">Xác nhận mật khẩu mới</Label>
                <div className="relative">
                  <Input
                    id="confirmPassword"
                    type={showPasswords?.confirm ? "text" : "password"}
                    value={passwordData?.confirmPassword}
                    onChange={(e) => setPasswordData({ ...passwordData, confirmPassword: e?.target?.value })}
                    placeholder="Nhập lại mật khẩu mới"
                  />
                  <Button
                    type="button"
                    variant="ghost"
                    size="sm"
                    className="absolute right-0 top-0 h-full px-3 py-2 hover:bg-transparent"
                    onClick={() => togglePasswordVisibility("confirm")}
                  >
                    {showPasswords.confirm ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                  </Button>
                </div>
              </div>
            </div>
          </CardContent>
          <CardFooter className="pt-3">
            <div className="flex flex-wrap gap-2">
              <Button
                onClick={handlePasswordChange}
                size="sm"
                className="flex items-center gap-2"
                disabled={isChangePasswordLoading}
              >
                <Check className="h-3 w-3" />
                {isChangePasswordLoading ? "Đang đổi..." : "Đổi mật khẩu"}
              </Button>
              <Button
                variant="outline"
                onClick={handlePasswordCancel}
                size="sm"
                className="flex items-center gap-2 bg-transparent"
              >
                <X className="h-3 w-3" />
                Hủy
              </Button>
            </div>
          </CardFooter>
        </Card>
      )}
    </div>
  )
}

export default ProfileInfoCard
