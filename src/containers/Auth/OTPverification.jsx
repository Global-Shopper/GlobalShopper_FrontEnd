import { useState, useEffect, useCallback } from "react";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { Card, CardContent } from "@/components/ui/card";
import {
	InputOTP,
	InputOTPGroup,
	InputOTPSlot,
} from "@/components/ui/input-otp";
import {
	ArrowLeft,
	Mail,
	ShoppingCart,
	CheckCircle,
	XCircle,
	Clock,
	BlocksIcon,
	BanIcon,
} from "lucide-react";
import { Link, useLocation, useNavigate } from "react-router-dom";
import { toast } from "sonner";
import {
	useLazyResendOTPQuery,
	useVerifyChangeEmailMutation,
	useVerifyOTPMutation,
} from "@/services/gshopApi";
import errorCode from "@/const/errorCode";
import { useDispatch, useSelector } from "react-redux";
import { setUserInfo } from "@/features/user";
import GShopLogo from "@/assets/LOGO_Gshop.png";

export default function OTPverification({ changeEmail }) {
	const dispatch = useDispatch();
	const navigate = useNavigate();
	const [otp, setOtp] = useState("");
	const oldEmail = useSelector((state) => state?.rootReducer?.user?.email);
	const email = useLocation().state?.email;
	const [
		verifyOTP,
		{ isLoading: isVerifyLoading, isError: isVerifyError, data: verifyRes },
	] = useVerifyOTPMutation();
	const [resendOTP, { isLoading: isResendingLoading }] =
		useLazyResendOTPQuery();
	const [verifyChangeEmail, { isLoading: isVerifyChangeEmailLoading }] =
		useVerifyChangeEmailMutation();

	// Only update OTP value
	const handleOTPChange = (value) => {
		setOtp(value);
	};

	const handleVerifyOTP = useCallback(async () => {
		try {
			if (changeEmail) {
				await verifyChangeEmail({ newEmail: email, otp }).unwrap();
				toast("Xác thực OTP thành công", {
					description:
						"Email cũ của bạn đã được xác thực. Vui lòng nhấp vào đường dẫn đã được gửi trong email mới để hoàn tất quá trình đổi email.",
				});
				navigate("/account-center");
			} else {
				const res = await verifyOTP({ email, otp }).unwrap();
				toast("Xác thực OTP thành công", {
					description:
						"Email của bạn đã được xác thực. Đang chuyển hướng...",
				});
				dispatch(
					setUserInfo({ ...res?.user, accessToken: res?.token })
				);
				navigate("/");
			}
		} catch (e) {
			if (e?.data?.errorCode === errorCode.ALREADY_VERIFIED) {
				toast.error("Email đã được xác thực", {
					description:
						e?.data?.message ||
						"Email của bạn đã được xác thực trước đó.",
				});
				if (changeEmail) {
					navigate("/account-center");
				} else {
					navigate("/login");
				}
			} else {
				toast.error("Lỗi xác thực", {
					description:
						e?.data?.message ||
						"Đã xảy ra lỗi khi xác thực mã OTP. Vui lòng thử lại.",
				});
			}
		}
	}, [
		email,
		navigate,
		otp,
		verifyOTP,
		verifyChangeEmail,
		changeEmail,
		dispatch,
	]);

	useEffect(() => {
		if (otp.length === 6) {
			handleVerifyOTP();
		}
	}, [handleVerifyOTP, otp.length]);

	const handleResendOTP = async () => {
		setOtp("");
		try {
			await resendOTP({ email })
				.unwrap()
				.then(() => {
					toast("Gửi lại OTP thành công", {});
				})
				.catch((e) => {
					toast.error("Gửi lại OTP thất bại", {
						description:
							e?.data?.message ||
							"Đã xảy ra lỗi khi gửi lại mã OTP. Vui lòng thử lại.",
					});
				});
		} catch (e) {
			console.log(e);
		}
	};

	return (
		<div className="min-h-screen flex">
			{/* Left Section - OTP Verification Form */}
			<div className="flex-1 flex items-center justify-center p-8 bg-background">
				<div className="w-full max-w-md bg-white rounded-2xl shadow-xl p-6 space-y-8">
					{/* Logo and Header */}
					<div className="text-center space-y-3">
						<Link to="/" className="flex justify-center">
							<img
								src={GShopLogo}
								alt="Logo"
								width={64}
								height={64}
								className="h-12 w-12"
							/>
						</Link>
						<h1 className="text-2xl font-bold text-slate-800">
							Xác thực Email
						</h1>
						<p className="text-slate-500 text-base">
							Chúng tôi đã gửi mã 6 chữ số đến email
							<br />
							{changeEmail && oldEmail ? (
								<span className="font-medium text-slate-700">
									{oldEmail}
								</span>
							) : (
								<span className="font-medium text-slate-700">
									{email}
								</span>
							)}
						</p>
					</div>

					<div className="space-y-6">
						<Label
							htmlFor="otp"
							className="text-lg font-bold text-slate-800 text-center block"
						>
							Nhập mã xác thực
						</Label>
						<div className="flex justify-center items-center gap-3">
							<InputOTP
								maxLength={6}
								value={otp}
								onChange={handleOTPChange}
								disabled={isVerifyLoading || verifyRes?.success}
							>
								<InputOTPGroup className="gap-3">
									{[0, 1, 2, 3, 4, 5].map((i) => (
										<InputOTPSlot
											key={i}
											index={i}
											className="w-12 h-12 text-xl font-bold border-2 border-slate-200 bg-slate-50/50 rounded-xl focus:border-blue-500 focus:bg-white focus:ring-4 focus:ring-blue-100/60 transition-all duration-300 shadow-sm hover:shadow-lg hover:border-slate-300 backdrop-blur-sm"
										/>
									))}
								</InputOTPGroup>
							</InputOTP>
							{verifyRes?.success && (
								<div className="flex items-center justify-center w-8 h-8 bg-green-100 rounded-full">
									<CheckCircle className="h-5 w-5 text-green-600" />
								</div>
							)}
							{isVerifyError && (
								<div className="flex items-center justify-center w-8 h-8 bg-red-100 rounded-full">
									<XCircle className="h-5 w-5 text-red-600" />
								</div>
							)}
						</div>
						{(isVerifyLoading || isVerifyChangeEmailLoading) && (
							<div className="flex items-center justify-center gap-2 text-blue-600">
								<div className="animate-spin rounded-full h-5 w-5 border-b-2 border-blue-600"></div>
								<span>Đang xác thực...</span>
							</div>
						)}
					</div>

					<Button
						onClick={handleVerifyOTP}
						className="w-full h-11 bg-gradient-to-r from-blue-500 to-blue-600 hover:from-blue-600 hover:to-blue-700 text-white font-semibold rounded-xl shadow-lg hover:shadow-xl transition-all duration-300 focus:ring-4 focus:ring-blue-200 focus:ring-offset-2 disabled:opacity-50 disabled:cursor-not-allowed transform hover:scale-[1.02] active:scale-[0.98]"
						disabled={
							isVerifyLoading ||
							otp.length !== 6 ||
							verifyRes?.success
						}
					>
						{isVerifyLoading ? (
							<div className="flex items-center justify-center">
								<div className="animate-spin rounded-full h-5 w-5 border-b-2 border-white mr-3"></div>
								Đang xác thực...
							</div>
						) : (
							"Xác thực OTP"
						)}
					</Button>

					<div className="text-center space-y-4 pt-2">
						<div className="w-20 h-px bg-gradient-to-r from-transparent via-slate-300 to-transparent mx-auto"></div>
						<p className="text-sm text-slate-600 font-medium">
							Không nhận được mã?
						</p>
						<Button
							variant="outline"
							onClick={handleResendOTP}
							disabled={isResendingLoading}
							className="h-10 px-6 border-2 border-slate-200 text-slate-700 bg-white hover:bg-blue-50 hover:border-blue-300 hover:text-blue-600 transition-all duration-300 rounded-xl shadow-sm hover:shadow-md transform hover:scale-105 active:scale-95"
						>
							{isResendingLoading ? (
								<div className="flex items-center justify-center">
									<div className="animate-spin rounded-full h-4 w-4 border-b-2 border-blue-600 mr-2"></div>
									Đang gửi...
								</div>
							) : (
								<div className="flex items-center">
									<Mail className="mr-2 h-4 w-4" />
									Gửi lại mã
								</div>
							)}
						</Button>
					</div>

					<div className="text-center">
						<p className="text-xs text-slate-400">
							Kiểm tra thư mục spam nếu bạn không thấy email
						</p>
					</div>

					<div className="text-center text-sm text-slate-400 pt-2">
						© 2025 Global Shopper
					</div>
				</div>
			</div>

			{/* Right Section - Illustration */}
			<div className="hidden lg:flex flex-1 items-center justify-center bg-gradient-to-br from-primary/5 to-primary/10">
				<div className="max-w-md text-center space-y-4">
					<div className="w-64 h-64 mx-auto bg-gradient-to-br from-primary/20 to-primary/5 rounded-full flex items-center justify-center">
						<Mail className="h-24 w-24 text-primary" />
					</div>
					<h2 className="text-2xl font-semibold text-primary">
						Kiểm tra email của bạn
					</h2>
					<p className="text-muted-foreground">
						Chúng tôi đã gửi mã xác thực bảo mật tới email của bạn.
						Nhập mã để hoàn tất đăng ký tài khoản.
					</p>
					<div className="flex items-center justify-center space-x-4 text-sm text-muted-foreground">
						<div className="flex items-center space-x-1">
							<CheckCircle className="h-4 w-4 text-green-600" />
							<span>Bảo mật</span>
						</div>
						<div className="flex items-center space-x-1">
							<Clock className="h-4 w-4 text-blue-600" />
							<span>Nhanh chóng</span>
						</div>
						<div className="flex items-center space-x-1">
							<Mail className="h-4 w-4 text-purple-600" />
							<span>Đáng tin cậy</span>
						</div>
					</div>
				</div>
			</div>
		</div>
	);
}
