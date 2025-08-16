import { useState, useEffect, useRef } from "react";
import {
	Card,
	CardHeader,
	CardTitle,
	CardContent,
	CardFooter,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
	User,
	Edit,
	Save,
	X,
	Lock,
	Eye,
	EyeOff,
	Check,
	Camera,
} from "lucide-react";
import { useDispatch } from "react-redux";
import {
	useChangeEmailMutation,
	useChangePasswordMutation,
	useGetCustomerInfoQuery,
	useUpdateCustomerProfileMutation,
	useUploadAvatarMutation,
} from "@/services/gshopApi";
import { toast } from "sonner";
import {
	setAccessToken,
	setAvatar,
	setCustomerBaseInfo,
	setUserInfo,
} from "@/features/user";
import * as Yup from "yup";
import {
	Select,
	SelectContent,
	SelectItem,
	SelectTrigger,
	SelectValue,
} from "@/components/ui/select";
import { useLocation, useNavigate } from "react-router-dom";

const ProfileInfoCard = () => {
	const navigate = useNavigate();
	const dispatch = useDispatch();
	const location = useLocation();

	// Get customer info from API
	const {
		data: customerInfo,
		isLoading: isInfoLoading,
		isError: isInfoError,
	} = useGetCustomerInfoQuery();

	// API mutations
	const [changePassword, { isLoading: isChangePasswordLoading }] =
		useChangePasswordMutation();
	const [updateProfile, { isLoading: isUpdateLoading }] =
		useUpdateCustomerProfileMutation();
	const [uploadAvatar, { isLoading: isUploadLoading }] =
		useUploadAvatarMutation();
	const [changeEmail, { isLoading: isChangeEmailLoading }] =
		useChangeEmailMutation();

	const [isEditingEmail, setIsEditingEmail] = useState(false);
	const [isEditingBasic, setIsEditingBasic] = useState(false);

	// Edit states - initialize with customerInfo
	const [editBasicInfo, setEditBasicInfo] = useState({
		name: "",
		phone: "",
		gender: "",
		dateOfBirth: "",
	});
	const [editEmail, setEditEmail] = useState("");
	const fileInputRef = useRef(null);

	// Update edit states when customerInfo changes
	useEffect(() => {
		if (customerInfo) {
			setEditBasicInfo({
				name: customerInfo?.name || "",
				phone: customerInfo?.phone || "",
				gender: customerInfo?.gender || "",
				dateOfBirth: customerInfo?.dateOfBirth || "",
			});
			setEditEmail(customerInfo?.email || "");
		}
	}, [customerInfo]);

	// Validation states
	const [validationErrors, setValidationErrors] = useState({
		name: "",
		phone: "",
		gender: "",
		dateOfBirth: "",
	});

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
			.min(0, "Ngày sinh không hợp lệ"),
	});

	// Validate form
	const validateForm = async () => {
		try {
			await validationSchema.validate(editBasicInfo, {
				abortEarly: false,
			});
			setValidationErrors({
				name: "",
				phone: "",
				gender: "",
				dateOfBirth: "",
			});
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

	// Change password state
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

	const handleUploadAvatar = async (event) => {
		const file = event.target.files[0];
		if (!file) return;

		try {
			const payload = {
				file: file,
			};
			const response = await uploadAvatar(payload).unwrap();

			// Update Redux state - only avatar
			const newAvatarUrl =
				response?.avatar ||
				response?.avatarUrl ||
				response?.data?.avatarUrl;
			dispatch(setAvatar(newAvatarUrl));
			toast.success("Cập nhật ảnh đại diện thành công!");
		} catch (error) {
			toast.error(error?.data?.message || "Tải ảnh đại diện thất bại!");
			console.error("Upload avatar failed", error);
		}
	};

	// Handle email editing
	const handleEmailSave = async () => {
		try {
			await changeEmail()
				.unwrap()
				.then(() => {
					setIsEditingEmail(false);
					navigate("/otp-verify/change-email", {
						state: { email: editEmail },
					});
				});
		} catch (error) {
			toast.error("Cập nhật email thất bại!", {
				description: error?.data?.message || "Vui lòng thử lại.",
			});
		}
	};

	const handleEmailCancel = () => {
		setEditEmail(editEmail);
		setIsEditingEmail(false);
	};

	// Handle basic info editing (name, phone, gender, dateOfBirth)
	const handleBasicInfoSave = async () => {
		// Validate form before saving
		const isValid = await validateForm();
		if (!isValid) {
			toast.error("Vui lòng kiểm tra lại thông tin!");
			return;
		}

		try {
			const updatedData = {
				name: editBasicInfo.name,
				phone: editBasicInfo.phone,
				gender: editBasicInfo.gender,
				dateOfBirth: editBasicInfo.dateOfBirth,
			};
			await updateProfile(updatedData)
				.unwrap()
				.then(() => {
					dispatch(
						setCustomerBaseInfo({
							name: editBasicInfo.name,
							phone: editBasicInfo.phone,
							gender: editBasicInfo.gender,
							dateOfBirth: editBasicInfo.dateOfBirth,
							avatar: customerInfo?.avatar,
						})
					);
					setIsEditingBasic(false);
					toast.success("Cập nhật thông tin thành công!");
				});
		} catch {
			toast.error("Cập nhật thông tin thất bại!", {
				description: "Vui lòng thử lại.",
			});
		}
	};

	const handleBasicInfoCancel = () => {
		setEditBasicInfo(customerInfo);
		setValidationErrors({
			name: "",
			phone: "",
			gender: "",
			dateOfBirth: "",
		});
		setIsEditingBasic(false);
	};

	// Handle password change
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

			setPasswordData({
				oldPassword: "",
				newPassword: "",
				confirmPassword: "",
			});
			setIsChangingPassword(false);
			toast.success("Mật khẩu đã được thay đổi thành công!");
		} catch (error) {
			toast.error("Đổi mật khẩu thất bại!", {
				description: error?.data?.message || "Vui lòng thử lại.",
			});
		}
	};

	const handlePasswordCancel = () => {
		setPasswordData({
			oldPassword: "",
			newPassword: "",
			confirmPassword: "",
		});
		setIsChangingPassword(false);
	};

	const togglePasswordVisibility = (field) => {
		setShowPasswords((prev) => ({
			...prev,
			[field]: !prev[field],
		}));
	};

	// Convert epoch milliseconds to date string for display
	const formatDateOfBirth = (epochMs) => {
		if (!epochMs) return "";
		const date = new Date(epochMs);
		return date.toISOString().split("T")[0];
	};

	// Convert date string to epoch milliseconds
	const parseDateOfBirth = (dateString) => {
		if (!dateString) return "";
		return new Date(dateString).getTime();
	};

	useEffect(() => {
		const query = new URLSearchParams(location.search);
		const token = query.get("token");
		if (token) {
			dispatch(setAccessToken(token));
			if (customerInfo) {
				dispatch(setUserInfo(customerInfo));
			}
		}
	}, [customerInfo, dispatch, location]);

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
		);
	}

	// Error state
	if (isInfoError) {
		return (
			<div className="space-y-4">
				<Card>
					<CardContent className="pt-6">
						<div className="text-center text-red-600">
							<p>
								Có lỗi xảy ra khi tải thông tin. Vui lòng thử
								lại.
							</p>
						</div>
					</CardContent>
				</Card>
			</div>
		);
	}

	return (
		<div className="space-y-5 w-full max-w-none  mx-auto">
			{/* Main Profile Card */}
			<Card className="border border-slate-200 shadow-sm">
				<CardHeader className="pb-1">
					<CardTitle className="text-xl font-semibold text-slate-800">
						Thông tin cá nhân
					</CardTitle>
				</CardHeader>
				<CardContent className="pt-2 space-y-5">
					{/* Avatar & Email Section */}
					<div className="flex flex-col lg:flex-row gap-6 items-start">
						{/* Avatar Section */}
						<div className="flex flex-col items-center space-y-3">
							<div className="relative group">
								<div
									className="w-20 h-20 rounded-xl overflow-hidden border-2 border-slate-200 cursor-pointer hover:border-sky-400 transition-all duration-300"
									onClick={() =>
										fileInputRef.current?.click()
									}
								>
									<img
										src={
											customerInfo?.avatar ||
											"/default-avatar.png"
										}
										alt="Avatar"
										className="w-full h-full object-contain"
									/>
									<div className="absolute inset-0 bg-black bg-opacity-50 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-all duration-300 rounded-xl">
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
							<p className="text-xs text-slate-500 text-center">
								Click để thay đổi ảnh
							</p>
						</div>

						{/* Email Section */}
						<div className="flex-1 space-y-3">
							<Label className="text-sm font-semibold text-slate-700">
								Email
							</Label>

							<div className="flex items-center gap-3">
								<Input
									id="email"
									type="email"
									value={
										isEditingEmail
											? editEmail
											: customerInfo?.email || ""
									}
									onChange={(e) => {
										setEditEmail(e.target.value);
									}}
									disabled={!isEditingEmail}
									placeholder="Nhập địa chỉ email"
									className="h-11 border border-slate-300 focus:border-sky-400 rounded-lg transition-all duration-200"
								/>
								{!isEditingEmail && (
									<Button
										onClick={() => setIsEditingEmail(true)}
										variant="outline"
										size="sm"
										className="h-11 px-3 border-slate-300 text-slate-600 hover:bg-slate-50 hover:border-sky-400 rounded-lg transition-all duration-200"
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
										className="flex items-center gap-2 bg-sky-500 hover:bg-sky-600 text-white rounded-lg transition-all duration-200"
										disabled={isChangeEmailLoading}
									>
										<Save className="h-4 w-4" />
										{isChangeEmailLoading
											? "Đang lưu..."
											: "Lưu"}
									</Button>
									<Button
										variant="outline"
										onClick={handleEmailCancel}
										size="sm"
										className="flex items-center gap-2 border-slate-300 text-slate-600 hover:bg-slate-50 rounded-lg transition-all duration-200"
									>
										<X className="h-4 w-4" />
										Hủy
									</Button>
								</div>
							)}
						</div>
					</div>

					{/* Basic Info Section */}
					<div className="space-y-4">
						<div className="flex items-center gap-3 pb-3 border-b border-slate-200">
							<div>
								<h3 className="text-base font-semibold text-slate-800">
									Thông tin cơ bản
								</h3>
								<p className="text-xs text-slate-500">
									Cập nhật thông tin cá nhân của bạn
								</p>
							</div>
						</div>

						<div className="grid grid-cols-1 md:grid-cols-2 gap-4">
							<div className="space-y-2">
								<Label
									htmlFor="name"
									className="text-sm font-semibold text-slate-700"
								>
									Họ và tên
								</Label>
								<Input
									id="name"
									value={
										isEditingBasic
											? editBasicInfo?.name
											: customerInfo?.name || ""
									}
									onChange={(e) =>
										isEditingBasic &&
										setEditBasicInfo({
											...editBasicInfo,
											name: e.target.value,
										})
									}
									disabled={!isEditingBasic}
									placeholder="Nhập họ và tên"
									className={`h-11 border border-slate-300 rounded-lg transition-all duration-200 ${
										validationErrors.name
											? "border-red-400 focus:border-red-500"
											: "focus:border-sky-400"
									}`}
								/>
								{validationErrors.name && (
									<p className="text-sm text-red-500">
										{validationErrors.name}
									</p>
								)}
							</div>

							<div className="space-y-2">
								<Label
									htmlFor="gender"
									className="text-sm font-semibold text-slate-700"
								>
									Giới tính
								</Label>
								<Select
									value={
										isEditingBasic
											? editBasicInfo?.gender
											: customerInfo?.gender || ""
									}
									onValueChange={(value) =>
										isEditingBasic &&
										setEditBasicInfo({
											...editBasicInfo,
											gender: value,
										})
									}
									disabled={!isEditingBasic}
								>
									<SelectTrigger
										className={`h-11 border border-slate-300 rounded-lg transition-all duration-200 ${
											validationErrors.gender
												? "border-red-400 focus:border-red-500"
												: "focus:border-sky-400"
										}`}
									>
										<SelectValue placeholder="Chọn giới tính" />
									</SelectTrigger>
									<SelectContent className="rounded-lg border border-slate-200">
										<SelectItem
											value="MALE"
											className="rounded"
										>
											Nam
										</SelectItem>
										<SelectItem
											value="FEMALE"
											className="rounded"
										>
											Nữ
										</SelectItem>
										<SelectItem
											value="OTHER"
											className="rounded"
										>
											Khác
										</SelectItem>
									</SelectContent>
								</Select>
								{validationErrors.gender && (
									<p className="text-sm text-red-500">
										{validationErrors.gender}
									</p>
								)}
							</div>
						</div>

						<div className="grid grid-cols-1 md:grid-cols-2 gap-4">
							<div className="space-y-2">
								<Label
									htmlFor="dateOfBirth"
									className="text-sm font-semibold text-slate-700"
								>
									Ngày sinh
								</Label>
								<Input
									id="dateOfBirth"
									type="date"
									value={
										isEditingBasic
											? formatDateOfBirth(
													editBasicInfo.dateOfBirth
											  )
											: formatDateOfBirth(
													customerInfo?.dateOfBirth
											  )
									}
									onChange={(e) =>
										isEditingBasic &&
										setEditBasicInfo({
											...editBasicInfo,
											dateOfBirth: parseDateOfBirth(
												e.target.value
											),
										})
									}
									disabled={!isEditingBasic}
									className={`h-11 border border-slate-300 rounded-lg transition-all duration-200 ${
										validationErrors.dateOfBirth
											? "border-red-400 focus:border-red-500"
											: "focus:border-sky-400"
									}`}
								/>
								{validationErrors.dateOfBirth && (
									<p className="text-sm text-red-500">
										{validationErrors.dateOfBirth}
									</p>
								)}
							</div>

							<div className="space-y-2">
								<Label
									htmlFor="phone"
									className="text-sm font-semibold text-slate-700"
								>
									Số điện thoại
								</Label>
								<Input
									id="phone"
									type="tel"
									value={
										isEditingBasic
											? editBasicInfo?.phone
											: customerInfo?.phone || ""
									}
									onChange={(e) =>
										isEditingBasic &&
										setEditBasicInfo({
											...editBasicInfo,
											phone: e.target.value,
										})
									}
									disabled={!isEditingBasic}
									placeholder="Nhập số điện thoại"
									className={`h-11 border border-slate-300 rounded-lg transition-all duration-200 ${
										validationErrors.phone
											? "border-red-400 focus:border-red-500"
											: "focus:border-sky-400"
									}`}
								/>
								{validationErrors.phone && (
									<p className="text-sm text-red-500">
										{validationErrors.phone}
									</p>
								)}
							</div>
						</div>

						{!isEditingBasic ? (
							<div className="flex flex-wrap gap-2 pt-3">
								<Button
									onClick={() => setIsEditingBasic(true)}
									className="flex items-center gap-2 bg-sky-500 hover:bg-sky-600 text-white rounded-lg transition-all duration-200"
								>
									<Edit className="h-4 w-4" />
									Chỉnh sửa thông tin
								</Button>
								<Button
									variant="outline"
									onClick={() => setIsChangingPassword(true)}
									className="flex items-center gap-2 border-slate-300 text-slate-700 hover:bg-slate-50 rounded-lg transition-all duration-200"
								>
									<Lock className="h-4 w-4" />
									Đổi mật khẩu
								</Button>
							</div>
						) : (
							<div className="flex flex-wrap gap-2 pt-3">
								<Button
									onClick={handleBasicInfoSave}
									className="flex items-center gap-2 bg-green-500 hover:bg-green-600 text-white rounded-lg transition-all duration-200"
									disabled={isUpdateLoading}
								>
									<Save className="h-4 w-4" />
									{isUpdateLoading
										? "Đang lưu..."
										: "Lưu thay đổi"}
								</Button>
								<Button
									variant="outline"
									onClick={handleBasicInfoCancel}
									className="flex items-center gap-2 border-slate-300 text-slate-700 hover:bg-slate-50 rounded-lg transition-all duration-200"
								>
									<X className="h-4 w-4" />
									Hủy
								</Button>
							</div>
						)}
					</div>
				</CardContent>
			</Card>

			{/* Change Password Section - Keep as separate card when active */}
			{isChangingPassword && (
				<Card className="border-0 shadow-lg">
					<CardHeader className="pb-3">
						<div className="flex items-center justify-between">
							<div className="flex items-center gap-3">
								<Lock className="h-5 w-5 text-slate-600" />
								<div>
									<CardTitle className="text-lg font-semibold text-slate-800">
										Đổi mật khẩu
									</CardTitle>
									<p className="text-sm text-slate-500 mt-1">
										Cập nhật mật khẩu bảo mật của bạn
									</p>
								</div>
							</div>
							<Button
								variant="ghost"
								size="sm"
								onClick={handlePasswordCancel}
								className="p-2 h-auto rounded-lg hover:bg-slate-100 transition-colors"
							>
								<X className="h-4 w-4 text-slate-400" />
							</Button>
						</div>
					</CardHeader>
					<CardContent className="pt-3 space-y-4">
						<div className="grid grid-cols-1 gap-4">
							<div className="space-y-2">
								<Label
									htmlFor="oldPassword"
									className="text-sm font-semibold text-slate-700"
								>
									Mật khẩu hiện tại
								</Label>
								<div className="relative">
									<Input
										id="oldPassword"
										type={
											showPasswords?.current
												? "text"
												: "password"
										}
										value={passwordData?.oldPassword}
										onChange={(e) =>
											setPasswordData({
												...passwordData,
												oldPassword: e?.target?.value,
											})
										}
										placeholder="Nhập mật khẩu hiện tại"
										className="h-11 border border-slate-300 focus:border-sky-400 rounded-lg pr-12 transition-all duration-200"
									/>
									<Button
										type="button"
										variant="ghost"
										size="sm"
										className="absolute right-1 top-1 h-9 w-9 rounded-lg hover:bg-slate-100 transition-colors"
										onClick={() =>
											togglePasswordVisibility("current")
										}
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
								<Label
									htmlFor="newPassword"
									className="text-sm font-semibold text-slate-700"
								>
									Mật khẩu mới
								</Label>
								<div className="relative">
									<Input
										id="newPassword"
										type={
											showPasswords?.new
												? "text"
												: "password"
										}
										value={passwordData?.newPassword}
										onChange={(e) =>
											setPasswordData({
												...passwordData,
												newPassword: e?.target?.value,
											})
										}
										placeholder="Nhập mật khẩu mới"
										className="h-11 border border-slate-300 focus:border-sky-400 rounded-lg pr-12 transition-all duration-200"
									/>
									<Button
										type="button"
										variant="ghost"
										size="sm"
										className="absolute right-1 top-1 h-9 w-9 rounded-lg hover:bg-slate-100 transition-colors"
										onClick={() =>
											togglePasswordVisibility("new")
										}
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
								<Label
									htmlFor="confirmPassword"
									className="text-sm font-semibold text-slate-700"
								>
									Xác nhận mật khẩu mới
								</Label>
								<div className="relative">
									<Input
										id="confirmPassword"
										type={
											showPasswords?.confirm
												? "text"
												: "password"
										}
										value={passwordData?.confirmPassword}
										onChange={(e) =>
											setPasswordData({
												...passwordData,
												confirmPassword:
													e?.target?.value,
											})
										}
										placeholder="Nhập lại mật khẩu mới"
										className="h-11 border border-slate-300 focus:border-sky-400 rounded-lg pr-12 transition-all duration-200"
									/>
									<Button
										type="button"
										variant="ghost"
										size="sm"
										className="absolute right-1 top-1 h-9 w-9 rounded-lg hover:bg-slate-100 transition-colors"
										onClick={() =>
											togglePasswordVisibility("confirm")
										}
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
						<div className="flex flex-col sm:flex-row gap-2 w-full">
							<Button
								onClick={handlePasswordChange}
								className="flex-1 h-11 bg-sky-500 hover:bg-sky-600 text-white rounded-lg transition-all duration-200"
								disabled={isChangePasswordLoading}
							>
								{isChangePasswordLoading ? (
									<div className="flex items-center gap-2">
										<div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin"></div>
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
								className="flex-1 h-11 border-slate-300 text-slate-700 hover:bg-slate-50 rounded-lg transition-all duration-200"
							>
								<X className="h-4 w-4 mr-2" />
								Hủy
							</Button>
						</div>
					</CardFooter>
				</Card>
			)}
		</div>
	);
};

export default ProfileInfoCard;
