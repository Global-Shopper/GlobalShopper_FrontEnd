import React, { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import {
	Select,
	SelectContent,
	SelectItem,
	SelectTrigger,
	SelectValue,
} from "@/components/ui/select";
import { Plus, X, Upload, User } from "lucide-react";
import { toast } from "sonner";
import { uploadToCloudinary } from "@/utils/uploadToCloudinary";
import {
	useCreateAdminMutation,
	useUpdateAdminMutation,
} from "@/services/gshopApi";

const CreateAdminForm = ({
	isOpen,
	onClose,
	onSuccess,
	editingData = null,
	isEditMode = false,
}) => {
	const [createAdmin, { isLoading: isCreating }] = useCreateAdminMutation();
	const [updateAdmin, { isLoading: isUpdating }] = useUpdateAdminMutation();

	const [formData, setFormData] = useState({
		name: "",
		email: "",
		dateOfBirth: "",
		nation: "",
		phone: "",
		address: "",
		gender: "MALE",
		avatar: "",
		active: true,
	});

	const [isUploading, setIsUploading] = useState(false);
	const [avatarPreview, setAvatarPreview] = useState(null);

	// Populate form data when editing
	useEffect(() => {
		if (isEditMode && editingData) {
			setFormData({
				name: editingData.name || "",
				email: editingData.email || "",
				dateOfBirth: editingData.dateOfBirth || "",
				nation: editingData.nation || "",
				phone: editingData.phone || "",
				address: editingData.address || "",
				gender: editingData.gender || "MALE",
				avatar: editingData.avatar || "",
				active: editingData.active !== false,
			});
			// Set avatar preview if exists
			if (editingData.avatar) {
				setAvatarPreview(editingData.avatar);
			}
		} else {
			// Reset form for create mode
			setFormData({
				name: "",
				email: "",
				dateOfBirth: "",
				nation: "",
				phone: "",
				address: "",
				gender: "MALE",
				avatar: "",
				active: true,
			});
			setAvatarPreview(null);
		}
	}, [isEditMode, editingData]);

	const handleInputChange = (field, value) => {
		setFormData((prev) => ({
			...prev,
			[field]: value,
		}));
	};

	const handleDateChange = (e) => {
		const date = new Date(e.target.value);
		const timestamp = date.getTime();
		setFormData((prev) => ({
			...prev,
			dateOfBirth: timestamp,
		}));
	};

	// Helper function to convert timestamp to date string for input
	const getDateValue = () => {
		if (!formData.dateOfBirth) return "";
		const date = new Date(formData.dateOfBirth);
		return date.toISOString().split("T")[0];
	};

	const resetForm = () => {
		setFormData({
			name: "",
			email: "",
			dateOfBirth: "",
			nation: "",
			phone: "",
			address: "",
			gender: "MALE",
			avatar: "",
			active: true,
		});
		setAvatarPreview(null);
	};

	const handleImageUpload = async (e) => {
		const file = e.target.files[0];
		if (!file) return;

		// Validate file type
		const validTypes = [
			"image/jpeg",
			"image/jpg",
			"image/png",
			"image/gif",
		];
		if (!validTypes.includes(file.type)) {
			toast.error("Chỉ chấp nhận file ảnh (JPG, PNG, GIF)");
			return;
		}

		// Validate file size (max 5MB)
		if (file.size > 5 * 1024 * 1024) {
			toast.error("Kích thước file không được vượt quá 5MB");
			return;
		}

		setIsUploading(true);
		try {
			// Create preview
			const preview = URL.createObjectURL(file);
			setAvatarPreview(preview);

			// Upload to Cloudinary
			const imageUrl = await uploadToCloudinary(file);
			if (imageUrl) {
				setFormData((prev) => ({
					...prev,
					avatar: imageUrl,
				}));
				toast.success("Upload ảnh thành công!");
			} else {
				toast.error("Upload ảnh thất bại, vui lòng thử lại!");
				setAvatarPreview(null);
			}
		} catch (error) {
			console.error("Upload error:", error);
			toast.error("Có lỗi xảy ra khi upload ảnh!");
			setAvatarPreview(null);
		} finally {
			setIsUploading(false);
		}
	};

	const handleSubmit = async (e) => {
		e.preventDefault();
		try {
			// Validate required fields
			if (
				!formData.name ||
				!formData.email ||
				!formData.phone ||
				!formData.dateOfBirth ||
				!formData.nation ||
				!formData.address
			) {
				toast.error("Vui lòng điền đầy đủ thông tin bắt buộc!");
				return;
			}

			// Prepare data for API
			const adminData = {
				name: formData.name,
				email: formData.email,
				dateOfBirth: formData.dateOfBirth,
				nation: formData.nation,
				phone: formData.phone,
				address: formData.address,
				gender: formData.gender,
				avatar: formData.avatar || null,
				active: formData.active,
			};

			let result;

			if (isEditMode && editingData) {
				// Update mode
				console.log("Updating admin with data:", adminData);
				result = await updateAdmin({
					id: editingData.id,
					data: adminData,
				}).unwrap();
				console.log("Admin updated successfully:", result);
				toast.success("Cập nhật admin thành công!");
			} else {
				// Create mode
				console.log("Creating admin with data:", adminData);
				result = await createAdmin(adminData).unwrap();
				console.log("Admin created successfully:", result);
				toast.success("Admin đã được tạo thành công!");
			}

			onSuccess();
			onClose();
			resetForm();
		} catch (error) {
			console.error(
				`Error ${isEditMode ? "updating" : "creating"} admin:`,
				error
			);

			// Handle different error types
			if (error?.data?.message) {
				toast.error(`Lỗi: ${error.data.message}`);
			} else if (error?.message) {
				toast.error(`Lỗi: ${error.message}`);
			} else {
				toast.error(
					`Có lỗi xảy ra khi ${
						isEditMode ? "cập nhật" : "tạo"
					} admin!`
				);
			}
		}
	};

	const handleClose = () => {
		resetForm();
		onClose();
	};

	if (!isOpen) return null;

	return (
		<div className="fixed inset-0 z-50 bg-black/50 flex items-center justify-center p-4">
			<div className="bg-white rounded-lg shadow-xl w-full max-w-2xl max-h-[90vh] overflow-hidden">
				{/* Header */}
				<div className="flex items-center justify-between p-4 border-b">
					<h2 className="text-lg font-semibold text-gray-900">
						{isEditMode ? "Chỉnh sửa Admin" : "Thêm Admin Mới"}
					</h2>
					<Button
						variant="ghost"
						size="icon"
						onClick={handleClose}
						className="text-gray-500 hover:text-gray-700"
					>
						<X className="h-4 w-4" />
					</Button>
				</div>

				{/* Content - Scrollable */}
				<div className="overflow-y-auto max-h-[calc(90vh-120px)]">
					<form onSubmit={handleSubmit} className="p-4 space-y-4">
						{/* Avatar Upload */}
						<div className="space-y-2">
							<Label className="text-sm font-medium text-gray-700">
								Ảnh đại diện
							</Label>
							<div className="flex items-center gap-4">
								<div className="w-16 h-16 rounded-full border-2 border-gray-200 bg-gray-50 flex items-center justify-center overflow-hidden">
									{avatarPreview || formData.avatar ? (
										<img
											src={
												avatarPreview || formData.avatar
											}
											alt="Avatar preview"
											className="w-full h-full object-cover"
										/>
									) : (
										<User className="w-6 h-6 text-gray-400" />
									)}
								</div>
								<div className="flex-1">
									<input
										type="file"
										accept="image/*"
										onChange={handleImageUpload}
										className="hidden"
										id="avatar-upload"
									/>
									<Label
										htmlFor="avatar-upload"
										className="cursor-pointer inline-flex items-center px-3 py-2 text-sm font-medium text-blue-600 bg-blue-50 border border-blue-200 rounded-md hover:bg-blue-100 transition-colors"
									>
										<Upload className="w-4 h-4 mr-2" />
										{isUploading
											? "Đang upload..."
											: "Chọn ảnh"}
									</Label>
									<p className="text-xs text-gray-500 mt-1">
										Hỗ trợ JPG, PNG, GIF. Tối đa 5MB.
									</p>
								</div>
							</div>
						</div>

						{/* Name - Full width */}
						<div className="space-y-2">
							<Label
								htmlFor="name"
								className="text-sm font-medium text-gray-700"
							>
								Họ và tên *
							</Label>
							<Input
								id="name"
								value={formData.name}
								onChange={(e) =>
									handleInputChange("name", e.target.value)
								}
								placeholder="Nhập họ và tên đầy đủ"
								className="focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
								required
							/>
						</div>

						{/* Email - Full width */}
						<div className="space-y-2">
							<Label
								htmlFor="email"
								className="text-sm font-medium text-gray-700"
							>
								Email *
							</Label>
							<Input
								id="email"
								type="email"
								value={formData.email}
								onChange={(e) =>
									handleInputChange("email", e.target.value)
								}
								placeholder="Nhập email tại đây"
								className="focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
								required
							/>
						</div>

						{/* Phone & Date of Birth - Same row */}
						<div className="grid grid-cols-1 md:grid-cols-2 gap-4">
							<div className="space-y-2">
								<Label
									htmlFor="phone"
									className="text-sm font-medium text-gray-700"
								>
									Số điện thoại *
								</Label>
								<Input
									id="phone"
									value={formData.phone}
									onChange={(e) =>
										handleInputChange(
											"phone",
											e.target.value
										)
									}
									placeholder="Nhập số điện thoại"
									className="focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
									required
								/>
							</div>

							<div className="space-y-2">
								<Label
									htmlFor="dateOfBirth"
									className="text-sm font-medium text-gray-700"
								>
									Ngày sinh *
								</Label>
								<Input
									id="dateOfBirth"
									type="date"
									value={getDateValue()}
									onChange={handleDateChange}
									className="focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
									required
								/>
							</div>
						</div>

						{/* Gender & Nation - Same row */}
						<div className="grid grid-cols-1 md:grid-cols-2 gap-4">
							<div className="space-y-2">
								<Label
									htmlFor="gender"
									className="text-sm font-medium text-gray-700"
								>
									Giới tính *
								</Label>
								<Select
									value={formData.gender}
									onValueChange={(value) =>
										handleInputChange("gender", value)
									}
								>
									<SelectTrigger className="focus:ring-2 focus:ring-blue-500 focus:border-blue-500">
										<SelectValue placeholder="Chọn giới tính" />
									</SelectTrigger>
									<SelectContent>
										<SelectItem value="MALE">
											Nam
										</SelectItem>
										<SelectItem value="FEMALE">
											Nữ
										</SelectItem>
										<SelectItem value="OTHER">
											Khác
										</SelectItem>
									</SelectContent>
								</Select>
							</div>

							<div className="space-y-2">
								<Label
									htmlFor="nation"
									className="text-sm font-medium text-gray-700"
								>
									Quốc gia *
								</Label>
								<Select
									value={formData.nation}
									onValueChange={(value) =>
										handleInputChange("nation", value)
									}
								>
									<SelectTrigger className="focus:ring-2 focus:ring-blue-500 focus:border-blue-500">
										<SelectValue placeholder="Chọn quốc gia" />
									</SelectTrigger>
									<SelectContent>
										<SelectItem value="Việt Nam">
											🇻🇳 Việt Nam
										</SelectItem>
										<SelectItem value="Mỹ">
											🇺🇸 Mỹ
										</SelectItem>
										<SelectItem value="Trung Quốc">
											🇨🇳 Trung Quốc
										</SelectItem>
										<SelectItem value="Nhật Bản">
											🇯🇵 Nhật Bản
										</SelectItem>
										<SelectItem value="Hàn Quốc">
											🇰🇷 Hàn Quốc
										</SelectItem>
										<SelectItem value="Singapore">
											🇸🇬 Singapore
										</SelectItem>
									</SelectContent>
								</Select>
							</div>
						</div>

						{/* Address - Full width */}
						<div className="space-y-2">
							<Label
								htmlFor="address"
								className="text-sm font-medium text-gray-700"
							>
								Địa chỉ *
							</Label>
							<Textarea
								id="address"
								value={formData.address}
								onChange={(e) =>
									handleInputChange("address", e.target.value)
								}
								placeholder="Số nhà, tên đường, phường/xã, quận/huyện, tỉnh/thành phố"
								rows={3}
								className="focus:ring-2 focus:ring-blue-500 focus:border-blue-500 resize-none"
								required
							/>
						</div>
					</form>
				</div>

				{/* Footer - Fixed buttons */}
				<div className="flex gap-3 p-4 border-t bg-gray-50">
					<Button
						type="submit"
						onClick={(e) => {
							e.preventDefault();
							handleSubmit(e);
						}}
						disabled={isCreating || isUpdating || isUploading}
						className="flex-1 bg-blue-600 hover:bg-blue-700 text-white font-medium py-2 disabled:opacity-50 disabled:cursor-not-allowed"
					>
						<Plus className="h-4 w-4 mr-2" />
						{isEditMode
							? isUpdating
								? "Đang cập nhật..."
								: "Cập nhật Admin"
							: isCreating
							? "Đang tạo..."
							: "Tạo Admin"}
					</Button>
					<Button
						type="button"
						variant="outline"
						onClick={handleClose}
						disabled={isCreating || isUpdating}
						className="flex-1 border-gray-300 text-gray-700 hover:bg-gray-50 font-medium py-2 disabled:opacity-50"
					>
						Hủy bỏ
					</Button>
				</div>
			</div>
		</div>
	);
};

export default CreateAdminForm;
