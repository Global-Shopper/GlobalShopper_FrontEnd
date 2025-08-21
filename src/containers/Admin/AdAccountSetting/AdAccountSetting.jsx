import { useEffect, useRef, useState } from "react";
import { useDispatch } from "react-redux";
import { useNavigate } from "react-router-dom";
import { toast } from "sonner";
import {
  Card,
  CardContent,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Camera, Check, Edit, Eye, EyeOff, Lock, Save, X } from "lucide-react";
import * as Yup from "yup";
import {
  useChangeEmailMutation,
  useChangePasswordMutation,
  useGetAdminInfoQuery,
  useUpdateAdminAvatarMutation,
  useUpdateAdminMutation,
} from "@/services/gshopApi";
import { setAvatar, setUserInfo } from "@/features/user"; 

const AdAccountSetting = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();

  const {
    data: adminInfo,
    isLoading: isInfoLoading,
    isError: isInfoError,
    refetch,
  } = useGetAdminInfoQuery();

  const [changePassword, { isLoading: isChangePasswordLoading }] =
    useChangePasswordMutation();
  const [updateAdmin] = useUpdateAdminMutation();
  const [uploadAdminAvatar, { isLoading: isUploadLoading }] =
    useUpdateAdminAvatarMutation();
  const [changeEmail, { isLoading: isChangeEmailLoading }] =
    useChangeEmailMutation();

  const [isEditingEmail, setIsEditingEmail] = useState(false);
  const [isEditingBasic, setIsEditingBasic] = useState(false);

  const [editBasicInfo, setEditBasicInfo] = useState({
    name: "",
    phone: "",
    nation: "",
    address: "",
  });
  const [editEmail, setEditEmail] = useState("");
  const fileInputRef = useRef(null);

  useEffect(() => {
    if (adminInfo) {
      setEditBasicInfo({
        name: adminInfo?.name || "",
        phone: adminInfo?.phone || "",
        nation: adminInfo?.nation || "",
        address: adminInfo?.address || "",
      });
      setEditEmail(adminInfo?.email || "");
    }
  }, [adminInfo]);

  const [validationErrors, setValidationErrors] = useState({
    name: "",
    phone: "",
    nation: "",
    address: "",
  });

  const validationSchema = Yup.object({
    name: Yup.string().required("Họ và tên là bắt buộc").max(30, "Họ và tên không được vượt quá 30 ký tự"),
    phone: Yup.string()
      .required("Số điện thoại là bắt buộc")
      .matches(/^((\+84)|0)[0-9]{9,10}$/i, "Số điện thoại không hợp lệ (ví dụ: +84909123456 hoặc 0912345678)"),
    nation: Yup.string().required("Quốc gia là bắt buộc").max(60, "Quốc gia quá dài"),
    address: Yup.string().required("Địa chỉ là bắt buộc").max(255, "Địa chỉ quá dài"),
  });

  const validateForm = async () => {
    try {
      await validationSchema.validate(editBasicInfo, { abortEarly: false });
      setValidationErrors({ name: "", phone: "", nation: "", address: "" });
      return true;
    } catch (error) {
      const errors = {};
      error.inner.forEach((err) => {
        errors[err.path] = err.message;
      });
      setValidationErrors(errors);
      return false;
    }
  };

  const [isChangingPassword, setIsChangingPassword] = useState(false);
  const [passwordData, setPasswordData] = useState({
    oldPassword: "",
    newPassword: "",
    confirmPassword: "",
  });
  const [showPasswords, setShowPasswords] = useState({
    current: false,
    new: false,
    confirm: false,
  });

  const togglePasswordVisibility = (field) => {
    setShowPasswords((prev) => ({ ...prev, [field]: !prev[field] }));
  };

  const handleUploadAvatar = async (event) => {
    const file = event.target.files?.[0];
    if (!file) return;
    try {
      const payload = { file };
      const response = await uploadAdminAvatar(payload).unwrap();
      const newAvatarUrl = response?.avatar || response?.avatarUrl || response?.data?.avatarUrl;
      if (newAvatarUrl) dispatch(setAvatar(newAvatarUrl));
      toast.success("Cập nhật ảnh đại diện thành công!");
      await refetch();
    } catch (error) {
      toast.error(error?.data?.message || "Tải ảnh đại diện thất bại!");
      console.error("Upload admin avatar failed", error);
    }
  };

  const handleEmailSave = async () => {
    try {
      await changeEmail().unwrap();
      setIsEditingEmail(false);
      navigate("/otp-verify/change-email", { state: { email: editEmail } });
    } catch (error) {
      toast.error("Cập nhật email thất bại!", { description: error?.data?.message || "Vui lòng thử lại." });
    }
  };

  const handleEmailCancel = () => {
    setEditEmail(adminInfo?.email || "");
    setIsEditingEmail(false);
  };

  const handleBasicInfoSave = async () => {
    const isValid = await validateForm();
    if (!isValid) {
      toast.error("Vui lòng kiểm tra lại thông tin!");
      return;
    }
    try {
      const updatedData = {
        name: editBasicInfo.name,
        phone: editBasicInfo.phone,
        nation: editBasicInfo.nation,
        address: editBasicInfo.address,
      };
      await updateAdmin({ id: adminInfo?.id, data: updatedData }).unwrap();
      dispatch(
        setUserInfo({
          name: updatedData.name,
          phone: updatedData.phone,
          avatar: adminInfo?.avatar,
          email: adminInfo?.email,
        })
      );
      setIsEditingBasic(false);
      toast.success("Cập nhật thông tin thành công!");
      await refetch();
    } catch (error) {
      toast.error("Cập nhật thông tin thất bại!", { description: error?.data?.message || "Vui lòng thử lại." });
    }
  };

  const handleBasicInfoCancel = () => {
    setEditBasicInfo({
      name: adminInfo?.name || "",
      phone: adminInfo?.phone || "",
      nation: adminInfo?.nation || "",
      address: adminInfo?.address || "",
    });
    setValidationErrors({ name: "", phone: "", nation: "", address: "" });
    setIsEditingBasic(false);
  };

  const handlePasswordChange = async () => {
    if (passwordData.newPassword !== passwordData.confirmPassword) {
      toast.error("Mật khẩu mới và xác nhận mật khẩu không khớp!");
      return;
    }
    if (passwordData.newPassword.length < 6) {
      toast.error("Mật khẩu mới phải có ít nhất 6 ký tự!");
      return;
    }
    try {
      await changePassword({
        oldPassword: passwordData.oldPassword,
        newPassword: passwordData.newPassword,
      }).unwrap();
      setPasswordData({ oldPassword: "", newPassword: "", confirmPassword: "" });
      setIsChangingPassword(false);
      toast.success("Mật khẩu đã được thay đổi thành công!");
    } catch (error) {
      toast.error("Đổi mật khẩu thất bại!", { description: error?.data?.message || "Vui lòng thử lại." });
    }
  };

  const handlePasswordCancel = () => {
    setPasswordData({ oldPassword: "", newPassword: "", confirmPassword: "" });
    setIsChangingPassword(false);
  };

  if (isInfoLoading) {
    return (
      <div className="space-y-4">
        <Card>
          <CardHeader className="pb-3">
            <CardTitle className="flex items-center gap-2 text-lg">Thông tin cá nhân</CardTitle>
          </CardHeader>
          <CardContent className="pt-0">
            <div className="animate-pulse space-y-4">
              <div className="h-20 w-20 rounded-full bg-gray-200"></div>
              <div className="space-y-2">
                <div className="h-4 w-1/4 rounded bg-gray-200"></div>
                <div className="h-10 rounded bg-gray-200"></div>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    );
  }

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
    );
  }

  return (
    <div className="space-y-5 w-full max-w-none mx-auto">
      <Card className="border border-slate-200 shadow-sm">
        <CardHeader className="pb-1">
          <CardTitle className="text-xl font-semibold text-slate-800">Thông tin cá nhân</CardTitle>
        </CardHeader>
        <CardContent className="pt-2 space-y-5">
          <div className="flex flex-col items-start gap-6 lg:flex-row">
            <div className="flex flex-col items-center space-y-3">
              <div className="group relative">
                <div
                  className="h-20 w-20 cursor-pointer overflow-hidden rounded-xl border-2 border-slate-200 transition-all duration-300 hover:border-sky-400"
                  onClick={() => fileInputRef.current?.click()}
                >
                  <img
                    src={adminInfo?.avatar || "/default-avatar.png"}
                    alt="Avatar"
                    className="h-full w-full object-contain"
                  />
                  <div className="absolute inset-0 flex items-center justify-center rounded-xl bg-black bg-opacity-50 opacity-0 transition-all duration-300 group-hover:opacity-100">
                    <Camera className="h-5 w-5 text-white" />
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
              <p className="text-center text-xs text-slate-500">Click để thay đổi ảnh</p>
            </div>

            <div className="flex-1 space-y-3">
              <Label className="text-sm font-semibold text-slate-700">Email</Label>
              <div className="flex items-center gap-3">
                <Input
                  id="email"
                  type="email"
                  value={isEditingEmail ? editEmail : adminInfo?.email || ""}
                  onChange={(e) => setEditEmail(e.target.value)}
                  disabled={!isEditingEmail}
                  placeholder="Nhập địa chỉ email"
                  className="h-11 rounded-lg border border-slate-300 transition-all duration-200 focus:border-sky-400"
                />
                {!isEditingEmail && (
                  <Button
                    onClick={() => setIsEditingEmail(true)}
                    variant="outline"
                    size="sm"
                    className="h-11 rounded-lg border-slate-300 text-slate-600 transition-all duration-200 hover:border-sky-400 hover:bg-slate-50"
                  >
                    <Edit className="h-4 w-4" />
                  </Button>
                )}
              </div>

              {isEditingEmail && (
                <div className="flex flex-wrap gap-2 pt-1">
                  <Button
                    onClick={handleEmailSave}
                    size="sm"
                    className="flex items-center gap-2 rounded-lg bg-sky-500 text-white transition-all duration-200 hover:bg-sky-600"
                    disabled={isChangeEmailLoading}
                  >
                    <Save className="h-4 w-4" />
                    {isChangeEmailLoading ? "Đang lưu..." : "Lưu"}
                  </Button>
                  <Button
                    variant="outline"
                    onClick={handleEmailCancel}
                    size="sm"
                    className="flex items-center gap-2 rounded-lg border-slate-300 text-slate-600 transition-all duration-200 hover:bg-slate-50"
                  >
                    <X className="h-4 w-4" />
                    Hủy
                  </Button>
                </div>
              )}
            </div>
          </div>

          <div className="space-y-4">
            <div className="flex items-center gap-3 border-b border-slate-200 pb-3">
              <div>
                <h3 className="text-base font-semibold text-slate-800">Thông tin cơ bản</h3>
                <p className="text-xs text-slate-500">Cập nhật thông tin quản trị của bạn</p>
              </div>
            </div>

            <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
              <div className="space-y-2">
                <Label htmlFor="name" className="text-sm font-semibold text-slate-700">
                  Họ và tên
                </Label>
                <Input
                  id="name"
                  value={isEditingBasic ? editBasicInfo?.name : adminInfo?.name || ""}
                  onChange={(e) =>
                    isEditingBasic && setEditBasicInfo({ ...editBasicInfo, name: e.target.value })
                  }
                  disabled={!isEditingBasic}
                  placeholder="Nhập họ và tên"
                  className={`h-11 rounded-lg border border-slate-300 transition-all duration-200 ${
                    validationErrors.name ? "border-red-400 focus:border-red-500" : "focus:border-sky-400"
                  }`}
                />
                {validationErrors.name && (
                  <p className="text-sm text-red-500">{validationErrors.name}</p>
                )}
              </div>

              <div className="space-y-2">
                <Label htmlFor="phone" className="text-sm font-semibold text-slate-700">
                  Số điện thoại
                </Label>
                <Input
                  id="phone"
                  type="tel"
                  value={isEditingBasic ? editBasicInfo?.phone : adminInfo?.phone || ""}
                  onChange={(e) =>
                    isEditingBasic && setEditBasicInfo({ ...editBasicInfo, phone: e.target.value })
                  }
                  disabled={!isEditingBasic}
                  placeholder="Nhập số điện thoại"
                  className={`h-11 rounded-lg border border-slate-300 transition-all duration-200 ${
                    validationErrors.phone ? "border-red-400 focus:border-red-500" : "focus:border-sky-400"
                  }`}
                />
                {validationErrors.phone && (
                  <p className="text-sm text-red-500">{validationErrors.phone}</p>
                )}
              </div>
            </div>

            <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
              <div className="space-y-2">
                <Label htmlFor="nation" className="text-sm font-semibold text-slate-700">
                  Quốc gia
                </Label>
                <Input
                  id="nation"
                  value={isEditingBasic ? editBasicInfo?.nation : adminInfo?.nation || ""}
                  onChange={(e) =>
                    isEditingBasic && setEditBasicInfo({ ...editBasicInfo, nation: e.target.value })
                  }
                  disabled={!isEditingBasic}
                  placeholder="Nhập quốc gia"
                  className={`h-11 rounded-lg border border-slate-300 transition-all duration-200 ${
                    validationErrors.nation ? "border-red-400 focus:border-red-500" : "focus:border-sky-400"
                  }`}
                />
                {validationErrors.nation && (
                  <p className="text-sm text-red-500">{validationErrors.nation}</p>
                )}
              </div>

              <div className="space-y-2">
                <Label htmlFor="address" className="text-sm font-semibold text-slate-700">
                  Địa chỉ
                </Label>
                <Input
                  id="address"
                  value={isEditingBasic ? editBasicInfo?.address : adminInfo?.address || ""}
                  onChange={(e) =>
                    isEditingBasic && setEditBasicInfo({ ...editBasicInfo, address: e.target.value })
                  }
                  disabled={!isEditingBasic}
                  placeholder="Nhập địa chỉ"
                  className={`h-11 rounded-lg border border-slate-300 transition-all duration-200 ${
                    validationErrors.address ? "border-red-400 focus:border-red-500" : "focus:border-sky-400"
                  }`}
                />
                {validationErrors.address && (
                  <p className="text-sm text-red-500">{validationErrors.address}</p>
                )}
              </div>
            </div>

            {!isEditingBasic ? (
              <div className="flex flex-wrap gap-2 pt-3">
                <Button
                  onClick={() => setIsEditingBasic(true)}
                  className="flex items-center gap-2 rounded-lg bg-sky-500 text-white transition-all duration-200 hover:bg-sky-600"
                >
                  <Edit className="h-4 w-4" />
                  Chỉnh sửa thông tin
                </Button>
                <Button
                  variant="outline"
                  onClick={() => setIsChangingPassword(true)}
                  className="flex items-center gap-2 rounded-lg border-slate-300 text-slate-700 transition-all duration-200 hover:bg-slate-50"
                >
                  <Lock className="h-4 w-4" />
                  Đổi mật khẩu
                </Button>
              </div>
            ) : (
              <div className="flex flex-wrap gap-2 pt-3">
                <Button
                  onClick={handleBasicInfoSave}
                  className="flex items-center gap-2 rounded-lg bg-green-500 text-white transition-all duration-200 hover:bg-green-600"
                >
                  <Save className="h-4 w-4" />
                  Lưu thay đổi
                </Button>
                <Button
                  variant="outline"
                  onClick={handleBasicInfoCancel}
                  className="flex items-center gap-2 rounded-lg border-slate-300 text-slate-700 transition-all duration-200 hover:bg-slate-50"
                >
                  <X className="h-4 w-4" />
                  Hủy
                </Button>
              </div>
            )}
          </div>
        </CardContent>
      </Card>

      {isChangingPassword && (
        <Card className="shadow-lg">
          <CardHeader className="pb-3">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-3">
                <Lock className="h-5 w-5 text-slate-600" />
                <div>
                  <CardTitle className="text-lg font-semibold text-slate-800">Đổi mật khẩu</CardTitle>
                  <p className="mt-1 text-sm text-slate-500">Cập nhật mật khẩu bảo mật của bạn</p>
                </div>
              </div>
              <Button
                variant="ghost"
                size="sm"
                onClick={handlePasswordCancel}
                className="h-auto rounded-lg p-2 transition-colors hover:bg-slate-100"
              >
                <X className="h-4 w-4 text-slate-400" />
              </Button>
            </div>
          </CardHeader>
          <CardContent className="space-y-4 pt-3">
            <div className="grid grid-cols-1 gap-4">
              <div className="space-y-2">
                <Label htmlFor="oldPassword" className="text-sm font-semibold text-slate-700">
                  Mật khẩu hiện tại
                </Label>
                <div className="relative">
                  <Input
                    id="oldPassword"
                    type={showPasswords.current ? "text" : "password"}
                    value={passwordData.oldPassword}
                    onChange={(e) => setPasswordData({ ...passwordData, oldPassword: e.target.value })}
                    placeholder="Nhập mật khẩu hiện tại"
                    className="h-11 rounded-lg border border-slate-300 pr-12 transition-all duration-200 focus:border-sky-400"
                  />
                  <Button
                    type="button"
                    variant="ghost"
                    size="sm"
                    className="absolute right-1 top-1 h-9 w-9 rounded-lg transition-colors hover:bg-slate-100"
                    onClick={() => togglePasswordVisibility("current")}
                  >
                    {showPasswords.current ? (
                      <EyeOff className="h-4 w-4 text-slate-500" />
                    ) : (
                      <Eye className="h-4 w-4 text-slate-500" />
                    )}
                  </Button>
                </div>
              </div>

              <div className="space-y-2">
                <Label htmlFor="newPassword" className="text-sm font-semibold text-slate-700">
                  Mật khẩu mới
                </Label>
                <div className="relative">
                  <Input
                    id="newPassword"
                    type={showPasswords.new ? "text" : "password"}
                    value={passwordData.newPassword}
                    onChange={(e) => setPasswordData({ ...passwordData, newPassword: e.target.value })}
                    placeholder="Nhập mật khẩu mới"
                    className="h-11 rounded-lg border border-slate-300 pr-12 transition-all duration-200 focus:border-sky-400"
                  />
                  <Button
                    type="button"
                    variant="ghost"
                    size="sm"
                    className="absolute right-1 top-1 h-9 w-9 rounded-lg transition-colors hover:bg-slate-100"
                    onClick={() => togglePasswordVisibility("new")}
                  >
                    {showPasswords.new ? (
                      <EyeOff className="h-4 w-4 text-slate-500" />
                    ) : (
                      <Eye className="h-4 w-4 text-slate-500" />
                    )}
                  </Button>
                </div>
              </div>

              <div className="space-y-2">
                <Label htmlFor="confirmPassword" className="text-sm font-semibold text-slate-700">
                  Xác nhận mật khẩu mới
                </Label>
                <div className="relative">
                  <Input
                    id="confirmPassword"
                    type={showPasswords.confirm ? "text" : "password"}
                    value={passwordData.confirmPassword}
                    onChange={(e) => setPasswordData({ ...passwordData, confirmPassword: e.target.value })}
                    placeholder="Nhập lại mật khẩu mới"
                    className="h-11 rounded-lg border border-slate-300 pr-12 transition-all duration-200 focus:border-sky-400"
                  />
                  <Button
                    type="button"
                    variant="ghost"
                    size="sm"
                    className="absolute right-1 top-1 h-9 w-9 rounded-lg transition-colors hover:bg-slate-100"
                    onClick={() => togglePasswordVisibility("confirm")}
                  >
                    {showPasswords.confirm ? (
                      <EyeOff className="h-4 w-4 text-slate-500" />
                    ) : (
                      <Eye className="h-4 w-4 text-slate-500" />
                    )}
                  </Button>
                </div>
              </div>
            </div>
          </CardContent>
          <CardFooter className="pt-3">
            <div className="flex w-full flex-col gap-2 sm:flex-row">
              <Button
                onClick={handlePasswordChange}
                className="flex-1 h-11 rounded-lg bg-sky-500 text-white transition-all duration-200 hover:bg-sky-600"
                disabled={isChangePasswordLoading}
              >
                {isChangePasswordLoading ? (
                  <div className="flex items-center gap-2">
                    <div className="h-4 w-4 animate-spin rounded-full border-2 border-white/30 border-t-white"></div>
                    Đang đổi...
                  </div>
                ) : (
                  <div className="flex items-center gap-2">
                    <Check className="h-4 w-4" />
                    Đổi mật khẩu
                  </div>
                )}
              </Button>
              <Button
                variant="outline"
                onClick={handlePasswordCancel}
                className="flex-1 h-11 rounded-lg border-slate-300 text-slate-700 transition-all duration-200 hover:bg-slate-50"
              >
                <X className="mr-2 h-4 w-4" />
                Hủy
              </Button>
            </div>
          </CardFooter>
        </Card>
      )}
    </div>
  );
}

export default AdAccountSetting