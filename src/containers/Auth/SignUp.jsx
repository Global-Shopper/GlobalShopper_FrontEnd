import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Checkbox } from "@/components/ui/checkbox";
import { RadioGroupItem } from "@/components/ui/radio-group";
import { Card, CardContent } from "@/components/ui/card";
import { Alert, AlertDescription } from "@/components/ui/alert";
import {
	Eye,
	EyeOff,
	Mail,
	Lock,
	User,
	ShoppingCart,
	Check,
} from "lucide-react";
import { toast } from "sonner";
import { Formik, Form, Field, ErrorMessage } from "formik";
import * as Yup from "yup";
import { Link, useNavigate } from "react-router-dom";
import { RadioGroup } from "@/components/ui/radio-group";
import { useRegisterMutation } from "@/services/gshopApi";
import errorCode from "@/const/errorCode";
import GShopLogo from "@/assets/LOGO_Gshop.png";

export default function Signup() {
	const navigate = useNavigate();
	const [register, { isLoading }] = useRegisterMutation();
	const [showPassword, setShowPassword] = useState(false);
	const [showConfirmPassword, setShowConfirmPassword] = useState(false);

	// Yup validation schema (Tiếng Việt)
	const validationSchema = Yup.object({
		fullName: Yup.string()
			.required("Họ tên không được để trống")
			.min(5, "Họ tên phải có ít nhất 5 ký tự"),
		email: Yup.string()
			.email("Vui lòng nhập địa chỉ email hợp lệ")
			.required("Email không được để trống"),
		gender: Yup.string().required("Vui lòng chọn giới tính"),
		password: Yup.string()
			.required("Mật khẩu không được để trống")
			.min(6, "Mật khẩu phải có ít nhất 6 ký tự"),
		confirmPassword: Yup.string()
			.oneOf([Yup.ref("password"), null], "Mật khẩu xác nhận không khớp")
			.required("Vui lòng xác nhận mật khẩu"),
		agreedToTerms: Yup.boolean().oneOf(
			[true],
			"Bạn phải đồng ý với điều khoản sử dụng"
		),
	});

	// Hàm tính độ mạnh mật khẩu (giữ nguyên)
	const getPasswordStrength = (password) => {
		if (!password) return { strength: 0, label: "" };
		let strength = 0;
		if (password.length >= 6) strength++;
		if (/[a-z]/.test(password)) strength++;
		if (/[A-Z]/.test(password)) strength++;
		if (/\d/.test(password)) strength++;
		const labels = ["", "Yếu", "Trung bình", "Tốt", "Mạnh"];
		const colors = [
			"",
			"bg-red-500",
			"bg-orange-500",
			"bg-yellow-500",
			"bg-green-500",
		];
		return { strength, label: labels[strength], color: colors[strength] };
	};

	// Separate function to handle register API call
	const handleRegister = async (values, { setSubmitting }) => {
		try {
			// Prepare payload for API
			const payload = {
				name: values.fullName,
				email: values.email,
				password: values.password,
				gender: values.gender,
				phone: values.phone ? values.phone : null,
				address: values.address ? values.address : null,
				avatar: values.avatar ? values.avatar : null,
				dateOfBirth: 0,
			};
			await register(payload)
				.unwrap()
				.then(() => {
					toast("Tạo tài khoản thành công", {
						description: `Chào mừng ${values.fullName}! Cảm ơn bạn đã tham gia Global Shopper.`,
					});
					// Navigate to OTP verification page with email
					navigate("/otp-verify", { state: { email: values.email } });
				})
				.catch((e) => {
					if (e?.data?.errorCode === errorCode.EMAIL_ALREADY_EXISTS) {
						toast.error("Email đã tồn tại", {
							description:
								e?.data?.message ||
								"Email này đã được đăng ký trong hệ thống.",
						});
					} else if (e?.data?.errorCode === errorCode.INVALID_EMAIL) {
						toast.error("Email không hợp lệ", {
							description:
								e?.data?.message ||
								"Vui lòng kiểm tra lại địa chỉ email.",
						});
					} else {
						toast.error("Đăng ký thất bại", {
							description:
								e?.data?.message ||
								"Có lỗi xảy ra trong quá trình đăng ký. Vui lòng thử lại.",
						});
					}
				});
		} catch (e) {
			console.log(e);
			toast.error("Đăng ký thất bại", {
				description:
					"Có lỗi xảy ra trong quá trình đăng ký. Vui lòng thử lại.",
			});
		} finally {
			setSubmitting(false);
		}
	};

	return (
		<div className="min-h-screen flex bg-gradient-to-br from-slate-50 to-blue-50">
			{/* Left Section - Signup Form */}
			<div className="flex-1 flex items-center justify-center p-6 lg:p-8">
				<div className="w-full max-w-xl space-y-6">
					{/* Logo and Header */}
					<div className="text-center space-y-3">
						<Link
							to="/"
							className="inline-flex items-center justify-center mb-6 group"
						>
							<div className="relative">
								<img
									src={GShopLogo || "/placeholder.svg"}
									alt="Global Shopper Logo"
									className="h-16 w-16 group-hover:scale-105 transition-transform duration-300"
								/>
							</div>
						</Link>
						<div className="space-y-1">
							<h1 className="text-2xl font-bold tracking-tight text-slate-800">
								Tạo tài khoản
							</h1>
							<p className="text-sm text-slate-600">
								Trải nghiệm dịch vụ mua hàng quốc tế dễ dàng,
								nhanh chóng và minh bạch.
							</p>
						</div>
					</div>

					<Card className="bg-white/80 backdrop-blur-xl border-0 shadow-xl shadow-blue-500/10 rounded-2xl overflow-hidden">
						<CardContent className="space-y-3 p-5 lg:p-6">
							{/* Signup Form with Formik */}
							<Formik
								initialValues={{
									fullName: "",
									email: "",
									gender: "",
									password: "",
									confirmPassword: "",
									agreedToTerms: false,
									phone: "",
									address: "",
									avatar: "",
									dateOfBirth: 0,
								}}
								validationSchema={validationSchema}
								onSubmit={handleRegister}
							>
								{({
									values,
									errors,
									touched,
									isSubmitting,
									setFieldValue,
								}) => {
									const passwordStrength =
										getPasswordStrength(values.password);
									return (
										<Form className="space-y-2">
											<div className="space-y-1">
												<Label
													htmlFor="fullName"
													className="text-sm font-semibold text-slate-700"
												>
													Họ và tên
												</Label>
												<div className="relative group">
													<User className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-slate-400 group-focus-within:text-blue-500 transition-colors duration-200" />
													<Field
														as={Input}
														id="fullName"
														name="fullName"
														type="text"
														placeholder="Nhập họ và tên"
														className={`pl-10 h-11 text-sm bg-slate-50 border-slate-200 rounded-lg focus:bg-white focus:border-blue-400 focus:ring-2 focus:ring-blue-100 transition-all duration-200 ${
															errors.fullName &&
															touched.fullName
																? "border-red-300 focus:border-red-400 focus:ring-red-100"
																: ""
														}`}
														disabled={
															isLoading ||
															isSubmitting
														}
													/>
												</div>
												<ErrorMessage name="fullName">
													{(msg) => (
														<p className="text-xs text-red-600 mt-1">
															{msg}
														</p>
													)}
												</ErrorMessage>
											</div>

											<div className="space-y-1.5">
												<Label
													htmlFor="email"
													className="text-sm font-semibold text-slate-700"
												>
													Email
												</Label>
												<div className="relative group">
													<Mail className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-slate-400 group-focus-within:text-blue-500 transition-colors duration-200" />
													<Field
														as={Input}
														id="email"
														name="email"
														type="email"
														placeholder="Nhập email"
														className={`pl-10 h-11 text-sm bg-slate-50 border-slate-200 rounded-lg focus:bg-white focus:border-blue-400 focus:ring-2 focus:ring-blue-100 transition-all duration-200 ${
															errors.email &&
															touched.email
																? "border-red-300 focus:border-red-400 focus:ring-red-100"
																: ""
														}`}
														disabled={
															isLoading ||
															isSubmitting
														}
													/>
												</div>
												<ErrorMessage name="email">
													{(msg) => (
														<p className="text-xs text-red-600 mt-1">
															{msg}
														</p>
													)}
												</ErrorMessage>
											</div>

											<div className="space-y-2">
												<Label className="text-sm font-semibold text-slate-700">
													Giới tính
												</Label>
												<Field name="gender">
													{({ field }) => (
														<RadioGroup
															value={field.value}
															onValueChange={(
																value
															) =>
																setFieldValue(
																	"gender",
																	value
																)
															}
															className="flex space-x-6"
															disabled={
																isLoading ||
																isSubmitting
															}
														>
															<div className="flex items-center space-x-2">
																<RadioGroupItem
																	value="MALE"
																	id="male"
																/>
																<Label
																	htmlFor="male"
																	className="cursor-pointer"
																>
																	Nam
																</Label>
															</div>
															<div className="flex items-center space-x-2">
																<RadioGroupItem
																	value="FEMALE"
																	id="female"
																/>
																<Label
																	htmlFor="female"
																	className="cursor-pointer"
																>
																	Nữ
																</Label>
															</div>
															<div className="flex items-center space-x-2">
																<RadioGroupItem
																	value="OTHERS"
																	id="others"
																/>
																<Label
																	htmlFor="others"
																	className="cursor-pointer"
																>
																	Khác
																</Label>
															</div>
														</RadioGroup>
													)}
												</Field>
												<ErrorMessage name="gender">
													{(msg) => (
														<p className="text-xs text-red-600 mt-1">
															{msg}
														</p>
													)}
												</ErrorMessage>
											</div>

											<div className="grid grid-cols-2 gap-3">
												<div className="space-y-1.5">
													<Label
														htmlFor="password"
														className="text-sm font-semibold text-slate-700"
													>
														Mật khẩu
													</Label>
													<div className="relative group">
														<Lock className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-slate-400 group-focus-within:text-blue-500 transition-colors duration-200" />
														<Field
															as={Input}
															id="password"
															name="password"
															type={
																showPassword
																	? "text"
																	: "password"
															}
															placeholder="Mật khẩu"
															className={`pl-10 pr-12 h-11 text-sm bg-slate-50 border-slate-200 rounded-lg focus:bg-white focus:border-blue-400 focus:ring-2 focus:ring-blue-100 transition-all duration-200 ${
																errors.password &&
																touched.password
																	? "border-red-300 focus:border-red-400 focus:ring-red-100"
																	: ""
															}`}
															disabled={
																isLoading ||
																isSubmitting
															}
														/>
														<Button
															type="button"
															variant="ghost"
															size="sm"
															className="absolute right-1 top-1/2 transform -translate-y-1/2 h-8 w-8 p-0 hover:bg-blue-50 rounded-md"
															onClick={() =>
																setShowPassword(
																	!showPassword
																)
															}
															disabled={
																isLoading ||
																isSubmitting
															}
														>
															{showPassword ? (
																<EyeOff className="h-4 w-4 text-slate-400" />
															) : (
																<Eye className="h-4 w-4 text-slate-400" />
															)}
														</Button>
													</div>
													{values.password && (
														<div className="space-y-1">
															<div className="flex items-center space-x-2">
																<div className="flex-1 bg-slate-200 rounded-full h-1.5">
																	<div
																		className={`h-1.5 rounded-full transition-all duration-300 ${passwordStrength.color}`}
																		style={{
																			width: `${
																				(passwordStrength.strength /
																					4) *
																				100
																			}%`,
																		}}
																	/>
																</div>
																<span className="text-xs text-slate-500 font-medium">
																	{
																		passwordStrength.label
																	}
																</span>
															</div>
														</div>
													)}
													<ErrorMessage name="password">
														{(msg) => (
															<p className="text-xs text-red-600 mt-1">
																{msg}
															</p>
														)}
													</ErrorMessage>
												</div>

												<div className="space-y-1.5">
													<Label
														htmlFor="confirmPassword"
														className="text-sm font-semibold text-slate-700"
													>
														Xác nhận mật khẩu
													</Label>
													<div className="relative group">
														<Lock className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-slate-400 group-focus-within:text-blue-500 transition-colors duration-200" />
														<Field
															as={Input}
															id="confirmPassword"
															name="confirmPassword"
															type={
																showConfirmPassword
																	? "text"
																	: "password"
															}
															placeholder="Xác nhận mật khẩu"
															className={`pl-10 pr-12 h-11 text-sm bg-slate-50 border-slate-200 rounded-lg focus:bg-white focus:border-blue-400 focus:ring-2 focus:ring-blue-100 transition-all duration-200 ${
																errors.confirmPassword &&
																touched.confirmPassword
																	? "border-red-300 focus:border-red-400 focus:ring-red-100"
																	: ""
															}`}
															disabled={
																isLoading ||
																isSubmitting
															}
														/>
														<Button
															type="button"
															variant="ghost"
															size="sm"
															className="absolute right-1 top-1/2 transform -translate-y-1/2 h-8 w-8 p-0 hover:bg-blue-50 rounded-md"
															onClick={() =>
																setShowConfirmPassword(
																	!showConfirmPassword
																)
															}
															disabled={
																isLoading ||
																isSubmitting
															}
														>
															{showConfirmPassword ? (
																<EyeOff className="h-4 w-4 text-slate-400" />
															) : (
																<Eye className="h-4 w-4 text-slate-400" />
															)}
														</Button>
													</div>
													{values.confirmPassword &&
														values.password ===
															values.confirmPassword && (
															<div className="flex items-center space-x-1 text-green-600">
																<Check className="h-3 w-3" />
																<span className="text-xs font-medium">
																	Mật khẩu
																	khớp
																</span>
															</div>
														)}
													<ErrorMessage name="confirmPassword">
														{(msg) => (
															<p className="text-xs text-red-600 mt-1">
																{msg}
															</p>
														)}
													</ErrorMessage>
												</div>
											</div>

											<div className="space-y-1.5">
												<div className="flex items-start space-x-2">
													<Field
														as={Checkbox}
														id="terms"
														name="agreedToTerms"
														checked={
															values.agreedToTerms
														}
														onCheckedChange={(
															checked
														) =>
															setFieldValue(
																"agreedToTerms",
																checked
															)
														}
														disabled={
															isLoading ||
															isSubmitting
														}
														className="mt-0.5"
													/>
													<Label
														htmlFor="terms"
														className="text-xs leading-5 cursor-pointer text-slate-700"
													>
														Tôi đồng ý với{" "}
														<Link
															to="/terms"
															className="text-blue-600 hover:underline font-medium"
														>
															Điều khoản sử dụng
														</Link>{" "}
														và{" "}
														<Link
															to="/privacy"
															className="text-blue-600 hover:underline font-medium"
														>
															Chính sách bảo mật
														</Link>{" "}
														của Global Shopper
													</Label>
												</div>
												<ErrorMessage name="agreedToTerms">
													{(msg) => (
														<p className="text-xs text-red-600 mt-1">
															{msg}
														</p>
													)}
												</ErrorMessage>
											</div>

											<Button
												type="submit"
												className="w-full h-11 bg-gradient-to-r from-blue-400 to-blue-600 hover:from-blue-500 hover:to-blue-700 text-white font-semibold rounded-lg shadow-md hover:shadow-lg transition-all duration-200 focus:ring-2 focus:ring-blue-300 focus:ring-offset-2"
												disabled={
													isLoading || isSubmitting
												}
											>
												{isLoading || isSubmitting
													? "Đang tạo tài khoản..."
													: "Tạo tài khoản"}
											</Button>
										</Form>
									);
								}}
							</Formik>

							<div className="text-center">
								<p className="text-sm text-slate-600">
									Đã có tài khoản?{" "}
									<Link
										to="/login"
										className="text-blue-600 hover:underline font-semibold"
									>
										Đăng nhập
									</Link>
								</p>
							</div>
						</CardContent>
					</Card>

					{/* Footer */}
					<div className="text-center text-sm text-muted-foreground">
						© 2025 Global Shopper.
					</div>
				</div>
			</div>

			{/* Right Section - Illustration */}
			<div className="hidden lg:flex flex-1 items-center justify-center bg-gradient-to-br from-primary/5 to-primary/10">
				<div className="max-w-md text-center space-y-4">
					<div className="w-64 h-64 mx-auto bg-gradient-to-br from-primary/20 to-primary/5 rounded-full flex items-center justify-center">
						<ShoppingCart className="h-24 w-24 text-primary" />
					</div>
					<h2 className="text-2xl font-semibold text-primary">
						Tham gia Global Shopper ngay hôm nay
					</h2>
					<p className="text-muted-foreground">
						Tạo tài khoản để khám phá hàng ngàn sản phẩm với ưu đãi
						độc quyền và giao hàng nhanh chóng.
					</p>
				</div>
			</div>
		</div>
	);
}
