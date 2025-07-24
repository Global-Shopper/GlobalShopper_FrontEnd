import React, { useState, useEffect } from "react";
import { Formik, Form, Field, ErrorMessage } from "formik";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { CardFooter } from "@/components/ui/card";
import { Save, X } from "lucide-react";
import {
	Select,
	SelectContent,
	SelectItem,
	SelectTrigger,
	SelectValue,
} from "@/components/ui/select";

// Predefined tag options
const TAG_OPTIONS = ["Nhà riêng", "Công ty", "Trường học", "Bệnh viện", "Khác"];

const EditAddressForm = ({
	address,
	validationSchema,
	onSave,
	onCancel,
}) => {
	const [customTag, setCustomTag] = useState("");

	useEffect(() => {
		if (address && address.tag && !TAG_OPTIONS.includes(address.tag)) {
			setCustomTag(address.tag);
		} else {
			setCustomTag("");
		}
	}, [address]);

	// Helper to parse location string
	const parseLocation = (locationString) => {
		if (!locationString)
			return { streetAddress: "", ward: "", district: "", province: "" };
		const parts = locationString.split(",").map((part) => part.trim());
		if (parts.length >= 4) {
			return {
				streetAddress: parts[0] || "",
				ward: parts[1] || "",
				district: parts[2] || "",
				province: parts[3] || "",
			};
		} else if (parts.length === 3) {
			return {
				streetAddress: parts[0] || "",
				ward: parts[1] || "",
				district: parts[2] || "",
				province: "",
			};
		} else {
			return {
				streetAddress: locationString,
				ward: "",
				district: "",
				province: "",
			};
		}
	};

	const initialValues = {
		name: address?.name || "",
		streetAddress: parseLocation(address?.location).streetAddress,
		ward: parseLocation(address?.location).ward,
		district: parseLocation(address?.location).district,
		province: parseLocation(address?.location).province,
		phoneNumber: address?.phoneNumber || "",
		tag: TAG_OPTIONS.includes(address?.tag) ? address?.tag : "Khác",
		default: address?.default || false,
	};

	return (
		<Formik
			initialValues={initialValues}
			validationSchema={validationSchema}
			enableReinitialize
			onSubmit={(values, actions) =>
				onSave(values, actions, customTag)
			}
		>
			{({ isSubmitting, values, errors, touched, setFieldValue }) => (
				<Form className="space-y-4">
					{/* Recipient Name */}
					<div className="space-y-2">
						<Label htmlFor="name" className="text-sm font-semibold text-slate-700">
							Họ tên người nhận
						</Label>
						<Field
							as={Input}
							id="name"
							name="name"
							placeholder="Ví dụ: Nguyễn Văn A"
							className={`h-11 border rounded-lg transition-all duration-200 ${errors.name && touched.name ? "border-red-400 focus:border-red-500" : "border-slate-300 focus:border-sky-400"}`}
							disabled={isSubmitting}
						/>
						<ErrorMessage name="name" component="div" className="text-red-500 text-sm" />
					</div>

					{/* Location Fields */}
					<div className="space-y-4">
						<div className="pb-2 border-b border-slate-200">
							<h4 className="text-base font-semibold text-slate-800">Thông tin địa chỉ</h4>
							<p className="text-xs text-slate-500 mt-1">Nhập đầy đủ thông tin địa chỉ giao hàng</p>
						</div>
						<div className="space-y-2">
							<Label htmlFor="streetAddress" className="text-sm font-semibold text-slate-700">
								Địa chỉ đường/Số nhà
							</Label>
							<Field
								as={Input}
								id="streetAddress"
								name="streetAddress"
								placeholder="Ví dụ: 123 Đường ABC"
								className={`h-11 border rounded-lg transition-all duration-200 ${errors.streetAddress && touched.streetAddress ? "border-red-400 focus:border-red-500" : "border-slate-300 focus:border-sky-400"}`}
								disabled={isSubmitting}
							/>
							<ErrorMessage name="streetAddress" component="div" className="text-red-500 text-sm" />
						</div>
						<div className="grid grid-cols-1 md:grid-cols-3 gap-4">
							<div className="space-y-2">
								<Label htmlFor="ward" className="text-sm font-semibold text-slate-700">Phường/Xã</Label>
								<Field
									as={Input}
									id="ward"
									name="ward"
									placeholder="Ví dụ: Phường 1"
									className={`h-11 border rounded-lg transition-all duration-200 ${errors.ward && touched.ward ? "border-red-400 focus:border-red-500" : "border-slate-300 focus:border-sky-400"}`}
									disabled={isSubmitting}
								/>
								<ErrorMessage name="ward" component="div" className="text-red-500 text-sm" />
							</div>
							<div className="space-y-2">
								<Label htmlFor="district" className="text-sm font-semibold text-slate-700">Quận/Huyện</Label>
								<Field
									as={Input}
									id="district"
									name="district"
									placeholder="Ví dụ: Quận 1"
									className={`h-11 border rounded-lg transition-all duration-200 ${errors.district && touched.district ? "border-red-400 focus:border-red-500" : "border-slate-300 focus:border-sky-400"}`}
									disabled={isSubmitting}
								/>
								<ErrorMessage name="district" component="div" className="text-red-500 text-sm" />
							</div>
							<div className="space-y-2">
								<Label htmlFor="province" className="text-sm font-semibold text-slate-700">Tỉnh/Thành phố</Label>
								<Field
									as={Input}
									id="province"
									name="province"
									placeholder="Ví dụ: TP. HCM"
									className={`h-11 border rounded-lg transition-all duration-200 ${errors.province && touched.province ? "border-red-400 focus:border-red-500" : "border-slate-300 focus:border-sky-400"}`}
									disabled={isSubmitting}
								/>
								<ErrorMessage name="province" component="div" className="text-red-500 text-sm" />
							</div>
						</div>
					</div>
				</div>

				{/* Phone Number */}
				<div className="space-y-2">
					<Label htmlFor="phoneNumber" className="text-sm font-semibold text-slate-700">Số điện thoại</Label>
					<Field
						as={Input}
						id="phoneNumber"
						name="phoneNumber"
						placeholder="Ví dụ: 0123456789"
						className={`h-11 border rounded-lg transition-all duration-200 ${errors.phoneNumber && touched.phoneNumber ? "border-red-400 focus:border-red-500" : "border-slate-300 focus:border-sky-400"}`}
						disabled={isSubmitting}
					/>
					<ErrorMessage name="phoneNumber" component="div" className="text-red-500 text-sm" />
				</div>

				{/* Tag Selection */}
				<div className="space-y-2">
					<Label htmlFor="tag" className="text-sm font-semibold text-slate-700">Nhãn địa chỉ</Label>
					<Field name="tag">
						{({ field, meta }) => (
							<div>
								<Select
									value={field.value}
									onValueChange={(value) => {
										setFieldValue("tag", value);
										if (value === "Khác") {
											setCustomTag("");
										}
									}}
								>
									<SelectTrigger className={`h-11 border rounded-lg transition-all duration-200 ${meta.touched && meta.error ? "border-red-400 focus:border-red-500" : "border-slate-300 focus:border-sky-400"}`}>
										<SelectValue placeholder="Chọn nhãn địa chỉ" />
									</SelectTrigger>
									<SelectContent className="rounded-lg border border-slate-200">
										{TAG_OPTIONS.map((option) => (
											<SelectItem key={option} value={option} className="rounded">
												{option}
											</SelectItem>
										))}
									</SelectContent>
								</Select>
								{meta.touched && meta.error && (
									<div className="text-red-500 text-sm mt-1">{meta.error}</div>
								)}
							</div>
						)}
					</Field>
					{values.tag === "Khác" && (
						<div className="space-y-2">
							<Label className="text-sm font-semibold text-slate-700">Nhãn tùy chỉnh</Label>
							<Input
								value={customTag}
								onChange={(e) => setCustomTag(e.target.value)}
								placeholder="Nhập nhãn tùy chỉnh"
								maxLength={20}
								disabled={isSubmitting}
								className="h-11 border border-slate-300 focus:border-sky-400 rounded-lg transition-all duration-200"
							/>
						</div>
					)}
				</div>

				{/* Default Address Checkbox */}
				<div className="flex items-center space-x-3 pt-2">
					<Field name="default">
						{() => (
							<input
								type="checkbox"
								id="default"
								onChange={(e) => {
									setFieldValue("default", e.target.checked);
								}}
								className="w-4 h-4 rounded border-slate-300 text-sky-500 focus:ring-sky-400 transition-colors"
								disabled={isSubmitting}
								checked={values.default}
							/>
						)}
					</Field>
					<label htmlFor="default" className="text-sm font-medium text-slate-700 cursor-pointer">
						Đặt làm địa chỉ mặc định
					</label>
				</div>

				<CardFooter className="px-0 pb-0 pt-2">
					<div className="flex gap-3">
						<Button
							type="submit"
							disabled={isSubmitting}
							className="flex items-center gap-2 bg-green-500 hover:bg-green-600 text-white rounded-lg transition-all duration-200"
						>
							<Save className="h-4 w-4" />
							{isSubmitting ? "Đang lưu..." : "Lưu thay đổi"}
						</Button>
						<Button
							type="button"
							variant="outline"
							onClick={onCancel}
							className="flex items-center gap-2 border-slate-300 text-slate-700 hover:bg-slate-50 rounded-lg transition-all duration-200"
						>
							<X className="h-4 w-4" />
							Hủy
						</Button>
					</div>
				</CardFooter>
			</Form>
			)}
		</Formik>
	);
};

export default EditAddressForm; 