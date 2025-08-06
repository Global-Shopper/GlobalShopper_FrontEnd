import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Checkbox } from "@/components/ui/checkbox";
import { Card, CardContent } from "@/components/ui/card";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { Separator } from "@/components/ui/separator";
import { Eye, EyeOff, Mail, Lock, ShoppingCart } from "lucide-react";
import { Link, useNavigate } from "react-router-dom";
import { toast } from "sonner";
import { Formik, Form, Field, ErrorMessage } from "formik";
import * as Yup from "yup";
import { useLoginMutation } from "@/services/gshopApi";
import errorCode from "@/const/errorCode";
import { useDispatch } from "react-redux";
import { setUserInfo } from "@/features/user";
import GShopLogo from "@/assets/LOGO_Gshop.png";

export default function Login() {
	const dispatch = useDispatch();
	const navigate = useNavigate();
	const [showPassword, setShowPassword] = useState(false);
	const [login, { isLoading }] = useLoginMutation();

	// Yup validation schema
	const validationSchema = Yup.object({
		email: Yup.string()
			.email("Vui lòng nhập địa chỉ email hợp lệ")
			.required("Email không được để trống"),
		password: Yup.string().required("Mật khẩu không được để trống"),
		rememberMe: Yup.boolean(),
	});

	const handleSubmit = async (values, { setSubmitting }) => {
		try {
			login(values)
				.unwrap()
				.then((res) => {
					dispatch(
						setUserInfo({ ...res?.user, accessToken: res?.token })
					);
					toast("Đăng nhập thành công", {
						description:
							"Mừng bạn trở lại! Bạn đã đăng nhập thành công vào Global Shopper.",
					});
					if (res?.user?.role === "CUSTOMER") {
						navigate("/");
					} else if (res?.user?.role === "ADMIN") {
						navigate("/admin");
					} else if (res?.user?.role === "BUSINESS_MANAGER") {
						navigate("/business-manager");
					}
				})
				.catch((e) => {
					if (e.data?.errorCode === errorCode.EMAIL_UNCONFIRMED) {
						toast("Email chưa được xác nhận", {
							action: {
								label: "Gửi lại mã xác nhận",
								onClick: () => console.log("Action!"),
							},
							description:
								e.data.message ||
								"Vui lòng kiểm tra email của bạn để xác nhận tài khoản.",
						});
						navigate("/otp-verify", {
							state: { email: values.email },
						});
					} else {
						toast.error("Đăng nhập thất bại", {
							description:
								e?.data?.message ||
								"Đã xảy ra lỗi khi đăng nhập. Vui lòng thử lại sau.",
						});
					}
				});
		} catch (e) {
			console.log(e);
		} finally {
			setSubmitting(false);
		}
	};

	return (
		<div className="min-h-screen flex bg-gradient-to-br from-slate-50 to-blue-50">
			{/* Left Section - Login Form */}
			<div className="flex-1 flex items-center justify-center p-6 lg:p-8">
				<div className="w-full max-w-md space-y-6">
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
									className="h-20 w-20 group-hover:scale-100 transition-transform duration-300"
								/>
							</div>
						</Link>
						<div className="space-y-1">
							<h1 className="text-2xl font-bold tracking-tight text-slate-800">
								Chào mừng trở lại!
							</h1>
							<p className="text-sm text-slate-600">
								Đăng nhập để sử dụng đầy đủ dịch vụ mua hộ quốc
								tế của chúng tôi.
							</p>
						</div>
					</div>

					<Card className="bg-white/80 backdrop-blur-xl border-0 shadow-xl shadow-blue-500/10 rounded-2xl overflow-hidden">
						<CardContent className="space-y-4 p-5 lg:p-6">
							{/* Login Form with Formik */}
							<Formik
								initialValues={{ email: "", password: "" }}
								validationSchema={validationSchema}
								onSubmit={handleSubmit}
							>
								{({
									values,
									errors,
									touched,
									isSubmitting,
									setFieldValue,
								}) => (
									<Form className="space-y-3">
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
													placeholder="Nhập email của bạn"
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
													<Alert
														variant="destructive"
														className="py-2 bg-red-50 border-red-200 rounded-lg"
													>
														<AlertDescription className="text-xs font-medium text-red-600">
															{msg}
														</AlertDescription>
													</Alert>
												)}
											</ErrorMessage>
										</div>

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
													placeholder="Nhập mật khẩu"
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
											<ErrorMessage name="password">
												{(msg) => (
													<Alert
														variant="destructive"
														className="py-2 bg-red-50 border-red-200 rounded-lg"
													>
														<AlertDescription className="text-xs font-medium text-red-600">
															{msg}
														</AlertDescription>
													</Alert>
												)}
											</ErrorMessage>
										</div>

										<div className="flex items-center justify-between pt-1">
											<div className="flex items-center space-x-2">
												<Field
													as={Checkbox}
													id="remember"
													name="rememberMe"
													checked={values.rememberMe}
													onCheckedChange={(
														checked
													) =>
														setFieldValue(
															"rememberMe",
															checked
														)
													}
													disabled={
														isLoading ||
														isSubmitting
													}
													className="data-[state=checked]:bg-blue-500 data-[state=checked]:border-blue-500"
												/>
												<Label
													htmlFor="remember"
													className="text-xs font-medium text-slate-600 cursor-pointer"
												>
													Ghi nhớ đăng nhập
												</Label>
											</div>
											<Link
												to="/forgot-password"
												className="text-xs font-medium text-blue-500 hover:text-blue-600 hover:underline transition-colors duration-200"
											>
												Quên mật khẩu?
											</Link>
										</div>

										<Button
											type="submit"
											className="w-full h-11 text-sm font-semibold bg-gradient-to-r from-blue-400 to-blue-600 hover:from-blue-500 hover:to-blue-700 shadow-lg shadow-blue-500/25 hover:shadow-xl hover:shadow-blue-500/30 rounded-lg transition-all duration-300 transform hover:scale-[1.02] active:scale-[0.98]"
											disabled={isLoading || isSubmitting}
										>
											{isLoading || isSubmitting ? (
												<div className="flex items-center space-x-2">
													<div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
													<span>
														Đang đăng nhập...
													</span>
												</div>
											) : (
												"Đăng nhập"
											)}
										</Button>
									</Form>
								)}
							</Formik>

							<div className="text-center pt-2">
								<p className="text-sm text-slate-600">
									Chưa có tài khoản?{" "}
									<Link
										to="/signup"
										className="font-semibold text-blue-500 hover:text-blue-600 hover:underline transition-colors duration-200"
									>
										Đăng ký
									</Link>
								</p>
							</div>
						</CardContent>
					</Card>

					{/* Footer */}
					<div className="text-center">
						<p className="text-sm text-slate-500 font-medium">
							© 2025 Global Shopper.
						</p>
					</div>
				</div>
			</div>

			{/* Right Section - Illustration */}
			<div className="hidden lg:flex flex-1 items-center justify-center bg-gradient-to-br from-blue-500 via-blue-600 to-cyan-600 relative overflow-hidden">
				{/* Background Pattern */}
				<div className="absolute inset-0 opacity-20">
					<div
						className="absolute inset-0"
						style={{
							backgroundImage: `url("data:image/svg+xml,%3Csvg width='60' height='60' viewBox='0 0 60 60' xmlns='http://www.w3.org/2000/svg'%3E%3Cg fill='none' fill-rule='evenodd'%3E%3Cg fill='%23ffffff' fill-opacity='0.1'%3E%3Cpath d='M36 34v-4h-2v4h-4v2h4v4h2v-4h4v-2h-4zm0-30V0h-2v4h-4v2h4v4h2V6h4V4h-4zM6 34v-4H4v4H0v2h4v4h2v-4h4v-2H6zM6 4V0H4v4H0v2h4v4h2V6h4V4H6z'/%3E%3C/g%3E%3C/g%3E%3C/svg%3E")`,
						}}
					></div>
				</div>

				<div className="relative max-w-md text-center space-y-6 px-6">
					<div className="w-60 h-60 mx-auto bg-gradient-to-br from-white/10 to-white/5 rounded-full flex items-center justify-center backdrop-blur-sm border border-white/10 shadow-2xl">
						<div className="w-48 h-48 bg-gradient-to-br from-white/20 to-white/10 rounded-full flex items-center justify-center">
							<ShoppingCart className="h-24 w-24 text-white drop-shadow-lg" />
						</div>
					</div>
					<div className="space-y-3">
						<h2 className="text-3xl font-bold text-white leading-tight">
							Mua sắm toàn cầu dễ dàng
						</h2>
						<p className="text-base text-blue-100 leading-relaxed">
							Kết nối bạn với hàng triệu sản phẩm từ khắp nơi trên
							thế giới. Trải nghiệm mua sắm an toàn, tiện lợi và
							đáng tin cậy.
						</p>
						<div className="flex items-center justify-center space-x-6 pt-3">
							<div className="text-center">
								<div className="text-xl font-bold text-white">
									1M+
								</div>
								<div className="text-xs text-blue-200">
									Khách hàng
								</div>
							</div>
							<div className="text-center">
								<div className="text-xl font-bold text-white">
									50+
								</div>
								<div className="text-xs text-blue-200">
									Quốc gia
								</div>
							</div>
							<div className="text-center">
								<div className="text-xl font-bold text-white">
									99%
								</div>
								<div className="text-xs text-blue-200">
									Hài lòng
								</div>
							</div>
						</div>
					</div>
				</div>
			</div>
		</div>
	);
}
