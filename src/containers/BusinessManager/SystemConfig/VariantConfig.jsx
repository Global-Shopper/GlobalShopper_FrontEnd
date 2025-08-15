import React, { useState } from "react";
import {
	Card,
	CardContent,
	CardDescription,
	CardHeader,
	CardTitle,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Badge } from "@/components/ui/badge";
import { Switch } from "@/components/ui/switch";
import {
	Select,
	SelectContent,
	SelectItem,
	SelectTrigger,
	SelectValue,
} from "@/components/ui/select";
import {
	Settings,
	Save,
	Plus,
	Trash2,
	Edit,
	Eye,
	EyeOff,
	Type,
	Hash,
	Calendar,
	CheckSquare,
	FileText,
	Palette,
	Ruler,
	Tag,
	Globe,
	Award,
} from "lucide-react";

export default function VariantConfig() {
	const [isEditing, setIsEditing] = useState(false);

	// Cấu hình các biến cho form yêu cầu mua hộ
	const [formFields, setFormFields] = useState([
		{
			id: 1,
			name: "kichThuoc",
			label: "Kích thước",
			type: "text",
			required: false,
			enabled: true,
			placeholder: "Ví dụ: M, L, XL hoặc 42, 43, 44",
			icon: Ruler,
			description: "Kích thước sản phẩm (size áo, giày, etc.)",
		},
		{
			id: 2,
			name: "mauSac",
			label: "Màu sắc",
			type: "text",
			required: true,
			enabled: true,
			placeholder: "Ví dụ: Đỏ, Xanh, Trắng",
			icon: Palette,
			description: "Màu sắc mong muốn của sản phẩm",
		},
		{
			id: 3,
			name: "chatLieu",
			label: "Chất liệu",
			type: "text",
			required: false,
			enabled: true,
			placeholder: "Ví dụ: Cotton, Da thật, Nhựa",
			icon: Type,
			description: "Chất liệu làm sản phẩm",
		},
		{
			id: 4,
			name: "xuatXu",
			label: "Xuất xứ",
			type: "select",
			required: false,
			enabled: true,
			options: [
				"Mỹ",
				"Nhật Bản",
				"Hàn Quốc",
				"Trung Quốc",
				"Châu Âu",
				"Khác",
			],
			icon: Globe,
			description: "Quốc gia/vùng miền sản xuất",
		},
		{
			id: 5,
			name: "thuongHieu",
			label: "Thương hiệu",
			type: "text",
			required: false,
			enabled: true,
			placeholder: "Ví dụ: Nike, Adidas, Apple",
			icon: Award,
			description: "Tên thương hiệu sản phẩm",
		},
		{
			id: 6,
			name: "soLuong",
			label: "Số lượng",
			type: "number",
			required: true,
			enabled: true,
			placeholder: "Nhập số lượng",
			icon: Hash,
			description: "Số lượng sản phẩm cần mua",
		},
		{
			id: 7,
			name: "ghiChu",
			label: "Ghi chú đặc biệt",
			type: "textarea",
			required: false,
			enabled: true,
			placeholder: "Yêu cầu đặc biệt về sản phẩm",
			icon: FileText,
			description: "Các yêu cầu, lưu ý đặc biệt khác",
		},
		{
			id: 8,
			name: "hanSuDung",
			label: "Hạn sử dụng (nếu có)",
			type: "date",
			required: false,
			enabled: false,
			placeholder: "Chọn ngày hạn sử dụng",
			icon: Calendar,
			description: "Áp dụng cho thực phẩm, mỹ phẩm",
		},
		{
			id: 9,
			name: "dinhKem",
			label: "Tệp đính kèm",
			type: "file",
			required: false,
			enabled: true,
			placeholder: "Hình ảnh, tài liệu tham khảo",
			icon: CheckSquare,
			description: "File hình ảnh hoặc tài liệu mô tả sản phẩm",
		},
	]);

	const toggleFieldEnabled = (fieldId) => {
		setFormFields((fields) =>
			fields.map((field) =>
				field.id === fieldId
					? { ...field, enabled: !field.enabled }
					: field
			)
		);
	};

	const toggleFieldRequired = (fieldId) => {
		setFormFields((fields) =>
			fields.map((field) =>
				field.id === fieldId
					? { ...field, required: !field.required }
					: field
			)
		);
	};

	const getTypeBadge = (type) => {
		const colors = {
			text: "bg-blue-100 text-blue-800",
			number: "bg-green-100 text-green-800",
			date: "bg-purple-100 text-purple-800",
			select: "bg-yellow-100 text-yellow-800",
			textarea: "bg-gray-100 text-gray-800",
			file: "bg-orange-100 text-orange-800",
		};

		return <Badge className={`${colors[type]} text-xs`}>{type}</Badge>;
	};

	return (
		<div className="w-full px-2 md:px-6 flex flex-col flex-1 min-h-screen">
			<div className="bg-white rounded-xl shadow p-6 mb-6">
				<div className="flex items-center justify-between">
					<div>
						<div className="flex items-center gap-3 mb-2">
							<Settings className="h-6 w-6 text-blue-600" />
							<h1 className="text-2xl font-bold text-gray-900">
								Cấu hình biến yêu cầu
							</h1>
						</div>
						<p className="text-gray-600">
							Quản lý các trường thông tin hiển thị trong form yêu
							cầu mua hộ
						</p>
					</div>
					<Button
						variant={isEditing ? "default" : "outline"}
						onClick={() => setIsEditing(!isEditing)}
						className="flex items-center gap-2"
					>
						<Edit className="h-4 w-4" />
						{isEditing ? "Xong" : "Chỉnh sửa"}
					</Button>
				</div>
			</div>

			<div className="bg-white rounded-xl shadow-md p-6">
				<div className="flex items-center justify-between mb-6">
					<div>
						<h3 className="text-lg font-semibold text-gray-900">
							Cấu hình trường dữ liệu
						</h3>
						<p className="text-gray-600 text-sm">
							Bật/tắt và cấu hình các trường hiển thị trong form
							yêu cầu mua hộ
						</p>
					</div>
					<div className="flex items-center gap-4 text-sm">
						<div className="flex items-center gap-2">
							<div className="w-3 h-3 bg-green-500 rounded-full"></div>
							<span className="text-gray-600">
								Đã bật (
								{formFields.filter((f) => f.enabled).length})
							</span>
						</div>
						<div className="flex items-center gap-2">
							<div className="w-3 h-3 bg-gray-300 rounded-full"></div>
							<span className="text-gray-600">
								Đã tắt (
								{formFields.filter((f) => !f.enabled).length})
							</span>
						</div>
					</div>
				</div>

				<div className="space-y-4">
					<div className="bg-gray-50 rounded-lg p-4">
						<div className="flex items-center justify-between mb-4">
							<h4 className="font-medium text-gray-900">
								Danh sách trường dữ liệu
							</h4>
							<div className="text-sm text-gray-500">
								<span className="text-green-600 font-medium">
									{formFields.filter((f) => f.enabled).length}
								</span>{" "}
								bật /
								<span className="text-gray-400 ml-1">
									{
										formFields.filter((f) => !f.enabled)
											.length
									}
								</span>{" "}
								tắt
							</div>
						</div>

						<div className="space-y-2">
							{formFields.map((field) => {
								const IconComponent = field.icon;
								return (
									<div
										key={field.id}
										className={`flex items-center justify-between p-3 rounded-lg border transition-colors ${
											field.enabled
												? "bg-white border-green-200 hover:border-green-300"
												: "bg-gray-50 border-gray-200 opacity-75"
										}`}
									>
										{/* Left side - Field info */}
										<div className="flex items-center gap-3 flex-1">
											<IconComponent
												className={`h-4 w-4 ${
													field.enabled
														? "text-green-600"
														: "text-gray-400"
												}`}
											/>
											<div className="flex-1">
												<div className="flex items-center gap-2">
													<span className="font-medium text-sm">
														{field.label}
													</span>
													{getTypeBadge(field.type)}
													{field.required && (
														<Badge
															variant="destructive"
															className="text-xs px-1.5 py-0.5"
														>
															Bắt buộc
														</Badge>
													)}
												</div>
												<p className="text-xs text-gray-500 mt-0.5">
													{field.description}
												</p>
											</div>
										</div>

										{/* Right side - Controls */}
										<div className="flex items-center gap-3">
											{isEditing && field.enabled && (
												<div className="flex items-center gap-2">
													<Switch
														checked={field.required}
														onCheckedChange={() =>
															toggleFieldRequired(
																field.id
															)
														}
														size="sm"
													/>
													<Label className="text-xs text-gray-600">
														Bắt buộc
													</Label>
												</div>
											)}

											<div className="flex items-center gap-2">
												<span className="text-xs text-gray-500">
													{field.enabled
														? "Bật"
														: "Tắt"}
												</span>
												<Switch
													checked={field.enabled}
													onCheckedChange={() =>
														toggleFieldEnabled(
															field.id
														)
													}
													disabled={!isEditing}
												/>
											</div>

											{isEditing && (
												<Button
													variant="ghost"
													size="sm"
													className="h-8 w-8 p-0"
												>
													<Edit className="h-3 w-3" />
												</Button>
											)}
										</div>
									</div>
								);
							})}
						</div>

						{/* Add New Field - Compact */}
						{isEditing && (
							<div className="mt-4 p-3 border-2 border-dashed border-gray-300 rounded-lg hover:border-blue-400 transition-colors">
								<div className="flex items-center justify-center gap-2">
									<Plus className="h-4 w-4 text-gray-400" />
									<span className="text-sm text-gray-600">
										Thêm trường mới
									</span>
								</div>
							</div>
						)}
					</div>
				</div>

				{/* Save Changes */}
				<div className="flex justify-between items-center mt-6 pt-6 border-t">
					<div className="text-sm text-gray-500">
						<strong>
							{formFields.filter((f) => f.enabled).length}
						</strong>{" "}
						trường đang được bật,
						<strong>
							{" "}
							{formFields.filter((f) => f.required).length}
						</strong>{" "}
						trường bắt buộc
					</div>
					<Button className="flex items-center gap-2">
						<Save className="h-4 w-4" />
						Lưu cấu hình
					</Button>
				</div>
			</div>
		</div>
	);
}
