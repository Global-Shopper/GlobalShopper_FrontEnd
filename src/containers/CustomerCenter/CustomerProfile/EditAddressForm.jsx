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
import { LocationCombobox } from "@/components/LocationCombobox";
import { getProvinces, getDistricts, getWards } from '@/services/vnGeoAPI';
import { useUpdateShippingAddressMutation } from '@/services/gshopApi';
import { toast } from 'sonner';

// Predefined tag options
const TAG_OPTIONS = ["Nhà riêng", "Công ty", "Trường học", "Bệnh viện", "Khác"];

const EditAddressForm = ({
	address,
	validationSchema,
	onCancel,
	onSuccess,
}) => {
	const [customTag, setCustomTag] = useState("");
	const [provinces, setProvinces] = useState([]);
	const [districts, setDistricts] = useState([]);
	const [wards, setWards] = useState([]);
	const [selectedProvince, setSelectedProvince] = useState(null);
	const [selectedDistrict, setSelectedDistrict] = useState(null);
	const [selectedWard, setSelectedWard] = useState(null);
	const [updateShippingAddress] = useUpdateShippingAddressMutation();

	useEffect(() => {
		(async () => {
			const provs = await getProvinces();
			setProvinces(provs);
			if (address?.provinceCode) {
				const foundProvince = provs.find(p => p.id === address.provinceCode || p.full_name === address.province);
				if (foundProvince) {
					setSelectedProvince(foundProvince);
					const dists = await getDistricts(foundProvince.id);
					setDistricts(dists);
					if (address?.districtCode) {
						const foundDistrict = dists.find(d => d.id === address.districtCode || d.full_name === address.district);
						if (foundDistrict) {
							setSelectedDistrict(foundDistrict);
							const ws = await getWards(foundDistrict.id);
							setWards(ws);
							if (address?.wardCode) {
								const foundWard = ws.find(w => w.id === address.wardCode || w.full_name === address.ward);
								if (foundWard) setSelectedWard(foundWard);
							}
						}
					}
				}
			}
		})();
		if (address?.tag && !TAG_OPTIONS.includes(address.tag)) {
			setCustomTag(address.tag);
		} else {
			setCustomTag("");
		}
	}, [address]);

	useEffect(() => {
		if (selectedProvince) {
			getDistricts(selectedProvince.id).then(setDistricts);
			setSelectedDistrict(null);
			setSelectedWard(null);
			setWards([]);
		} else {
			setDistricts([]);
			setWards([]);
		}
	}, [selectedProvince]);

	useEffect(() => {
		if (selectedDistrict) {
			getWards(selectedDistrict.id).then(setWards);
			setSelectedWard(null);
		} else {
			setWards([]);
		}
	}, [selectedDistrict]);

	const initialValues = {
		id: address?.id || "",
		name: address?.name || "",
		addressLine: address?.addressLine || address?.streetAddress || "",
		streetAddress: address?.addressLine || address?.streetAddress || "",
		ward: address?.ward || "",
		district: address?.district || "",
		province: address?.province || "",
		phoneNumber: address?.phoneNumber || "",
		tag: TAG_OPTIONS.includes(address?.tag) ? address?.tag : "Khác",
		default: address?.default || false,
	};

	const handleSubmit = async (values, actions) => {
		const locationParts = [
			values.addressLine,
			selectedWard ? selectedWard.full_name : values.ward,
			selectedDistrict ? selectedDistrict.full_name : values.district,
			selectedProvince ? selectedProvince.full_name : values.province
		].filter(Boolean);
		const combinedLocation = locationParts.join(", ");
		const finalTag = values.tag === "Khác" ? customTag : values.tag;
		try {
			await updateShippingAddress({
				id: values.id,
				name: values.name,
				tag: finalTag,
				phoneNumber: values.phoneNumber,
				location: combinedLocation,
				provinceCode: selectedProvince ? selectedProvince.id : address?.provinceCode || "",
				districtCode: selectedDistrict ? selectedDistrict.id : address?.districtCode || "",
				wardCode: selectedWard ? selectedWard.id : address?.wardCode || "",
				addressLine: values.addressLine,
				default: values.default,
			}).unwrap();
			toast.success("Cập nhật địa chỉ thành công", {
				description: "Địa chỉ đã được cập nhật thành công.",
			});
			if (onSuccess) onSuccess();
			if (onCancel) onCancel();
			actions.resetForm();
		} catch (e) {
			toast.error("Cập nhật địa chỉ thất bại", {
				description:
					JSON.stringify(e?.data?.messages) ||
					"Đã xảy ra lỗi khi cập nhật địa chỉ. Vui lòng thử lại sau.",
			});
		} finally {
			actions.setSubmitting(false);
		}
	};

	return (
		<Formik
			initialValues={initialValues}
			validationSchema={validationSchema}
			enableReinitialize
			onSubmit={handleSubmit}
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
							<Label htmlFor="addressLine" className="text-sm font-semibold text-slate-700">
								Địa chỉ đường/Số nhà
							</Label>
							<Field
								as={Input}
								id="addressLine"
								name="addressLine"
								placeholder="Ví dụ: 123 Đường ABC"
								className={`h-11 border rounded-lg transition-all duration-200 ${errors.addressLine && touched.addressLine ? "border-red-400 focus:border-red-500" : "border-slate-300 focus:border-sky-400"}`}
								disabled={isSubmitting}
							/>
							<ErrorMessage name="addressLine" component="div" className="text-red-500 text-sm" />
						</div>
						<div className="grid grid-cols-1 md:grid-cols-8 gap-4">
							{/* Province Combobox */}
							<div className="space-y-2 md:col-span-3">
								<LocationCombobox
									label="Tỉnh/Thành phố *"
									placeholder="Chọn tỉnh/thành phố"
									options={provinces}
									value={selectedProvince}
									onChange={province => {
										setSelectedProvince(province);
										setFieldValue('province', province ? province.full_name : '');
										setSelectedDistrict(null);
										setFieldValue('district', '');
										setSelectedWard(null);
										setFieldValue('ward', '');
									}}
									disabled={isSubmitting}
								/>
								<ErrorMessage name="province" component="div" className="text-red-500 text-sm" />
							</div>
							{/* District Combobox */}
							<div className="space-y-2 md:col-span-3">
								<LocationCombobox
									label="Quận/Huyện *"
									placeholder="Chọn quận/huyện"
									options={districts}
									value={selectedDistrict}
									onChange={district => {
										setSelectedDistrict(district);
										setFieldValue('district', district ? district.full_name : '');
										setSelectedWard(null);
										setFieldValue('ward', '');
									}}
									disabled={!selectedProvince || isSubmitting}
								/>
								<ErrorMessage name="district" component="div" className="text-red-500 text-sm" />
							</div>
							{/* Ward Combobox */}
							<div className="space-y-2 md:col-span-2">
								<LocationCombobox
									label="Phường/Xã *"
									placeholder="Chọn phường/xã"
									options={wards}
									value={selectedWard}
									onChange={ward => {
										setSelectedWard(ward);
										setFieldValue('ward', ward ? ward.full_name : '');
									}}
									disabled={!selectedDistrict || isSubmitting}
								/>
								<ErrorMessage name="ward" component="div" className="text-red-500 text-sm" />
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