import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardContent } from "@/components/ui/card";
import { Alert, AlertDescription } from "@/components/ui/alert";
import {
	ArrowLeft,
	Mail,
	ShoppingCart,
	CheckCircle,
	XCircle,
	Lock,
	Eye,
	EyeOff,
} from "lucide-react";
import { Link } from "react-router-dom";
import { toast } from "sonner";
import { Formik, Form, Field, ErrorMessage } from "formik";
import * as Yup from "yup";
import { useLazyForgotPasswordQuery } from "@/services/gshopApi";
import ForgotPwOTP from "./ForgotPWOTP";
import NewPasswordForm from "./NewPasswordForm";
import { useDispatch, useSelector } from "react-redux";
import { setForgotPasswordStep } from "@/features/auth";
import { setEmail } from "@/features/user";
import GShopLogo from "@/assets/LOGO_Gshop.png";

export default function ForgotPassword() {
	const dispatch = useDispatch();
	const step = useSelector(
		(state) => state.rootReducer?.auth?.forgotPasswordStep
	);
	const email = useSelector((state) => state.rootReducer?.user?.email);
	const [forgotPassword, { isLoading: isForgotLoading }] =
		useLazyForgotPasswordQuery();

	// Email step
	const emailValidationSchema = Yup.object({
		email: Yup.string()
			.email("Vui lòng nhập địa chỉ email hợp lệ")
			.required("Email không được để trống"),
	});

	// Step 1: Email submit
	const handleEmailSubmit = async (values, { setSubmitting }) => {
		dispatch(setEmail(values.email));
		try {
			await forgotPassword(values)
				.unwrap()
				.then((res) => {
					dispatch(setForgotPasswordStep("otp"));
					toast("Gửi OTP thành công", {
						description:
							res.message ||
							"Vui lòng kiểm tra email của bạn để đặt lại mật khẩu.",
					});
				});
		} catch (e) {
			toast.error("Gửi OTP thất bại", {
				description:
					e?.data?.message ||
					"Đã xảy ra lỗi khi gửi email đặt lại mật khẩu. Vui lòng thử lại sau.",
			});
		} finally {
			setSubmitting(false);
		}
	};

	return (
		<div className="min-h-screen flex bg-gradient-to-br from-slate-50 to-blue-50">
			<div className="flex-1 flex items-center justify-center p-6 lg:p-8">
				<div className="w-full max-w-lg space-y-6">
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
								Đặt lại mật khẩu
							</h1>
							<p className="text-sm text-slate-600">
								{step === "email" &&
									"Nhập email của bạn để nhận hướng dẫn đặt lại mật khẩu"}
								{step === "otp" && (
									<>
										Chúng tôi đã gửi mã xác thực gồm 6 số
										tới
										<br />
										<span className="font-medium text-slate-800">
											{email}
										</span>
									</>
								)}
								{step === "newpassword" && (
									<>
										Xác thực thành công! Nhập mật khẩu mới
										cho tài khoản <br />
										<span className="font-medium text-slate-800">
											{email}
										</span>
									</>
								)}
							</p>
						</div>
					</div>

					<Card className="bg-white/80 backdrop-blur-xl border-0 shadow-xl shadow-blue-500/10 rounded-2xl overflow-hidden">
						<CardContent className="space-y-4 p-5 lg:p-6">
							{step === "email" && (
								<Formik
									initialValues={{ email: email }}
									validationSchema={emailValidationSchema}
									onSubmit={handleEmailSubmit}
								>
									{({
										values,
										errors,
										touched,
										isSubmitting,
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
															isForgotLoading ||
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
											<Button
												type="submit"
												className="w-full h-11 bg-gradient-to-r from-blue-400 to-blue-600 hover:from-blue-500 hover:to-blue-700 text-white font-semibold rounded-lg shadow-md hover:shadow-lg transition-all duration-200 focus:ring-2 focus:ring-blue-300 focus:ring-offset-2"
												disabled={
													isForgotLoading ||
													isSubmitting ||
													!values.email ||
													!!errors.email
												}
											>
												{isForgotLoading || isSubmitting
													? "Đang gửi..."
													: "Xác nhận email và gửi OTP"}
											</Button>
										</Form>
									)}
								</Formik>
							)}

							{step === "otp" && <ForgotPwOTP />}

							{step === "newpassword" && <NewPasswordForm />}

							{/* Help Text */}
							<div className="text-center space-y-3">
								<p className="text-xs text-slate-500">
									Kiểm tra thư mục spam nếu bạn không thấy
									email
								</p>
								{step === "email" && (
									<p className="text-sm text-slate-600">
										Nhớ mật khẩu?{" "}
										<Link
											to="/login"
											className="text-blue-600 hover:underline font-semibold"
										>
											Đăng nhập ngay
										</Link>
									</p>
								)}
							</div>
						</CardContent>
					</Card>
					{/* Footer */}
					<div className="text-center text-sm text-slate-500">
						© 2025 Global Shopper.
					</div>
				</div>
			</div>
			{/* Right Section - Illustration */}
			<div className="hidden lg:flex flex-1 items-center justify-center bg-gradient-to-br from-blue-50 to-indigo-100">
				<div className="max-w-md text-center space-y-4">
					<div className="w-64 h-64 mx-auto bg-gradient-to-br from-blue-100 to-blue-50 rounded-full flex items-center justify-center shadow-xl">
						{step === "otp" || step === "newpassword" ? (
							<Mail className="h-24 w-24 text-blue-600" />
						) : (
							<Lock className="h-24 w-24 text-blue-600" />
						)}
					</div>
					<h2 className="text-2xl font-semibold text-slate-800">
						{step === "otp" || step === "newpassword"
							? "Kiểm tra email của bạn"
							: "Đặt lại mật khẩu"}
					</h2>
					<p className="text-slate-600">
						{step === "otp" || step === "newpassword"
							? "Chúng tôi đã gửi mã xác thực bảo mật tới email của bạn. Nhập mã và mật khẩu mới để hoàn tất."
							: "Chúng tôi sẽ gửi hướng dẫn đặt lại mật khẩu tới email của bạn. Làm theo các bước trong email để tạo mật khẩu mới."}
					</p>
					<div className="flex items-center justify-center space-x-4 text-sm text-slate-500">
						<div className="flex items-center space-x-1">
							<CheckCircle className="h-4 w-4 text-green-600" />
							<span>Bảo mật</span>
						</div>
						<div className="flex items-center space-x-1">
							<Mail className="h-4 w-4 text-blue-600" />
							<span>Nhanh chóng</span>
						</div>
						<div className="flex items-center space-x-1">
							<Lock className="h-4 w-4 text-purple-600" />
							<span>Đáng tin cậy</span>
						</div>
					</div>
				</div>
			</div>
		</div>
	);
}
