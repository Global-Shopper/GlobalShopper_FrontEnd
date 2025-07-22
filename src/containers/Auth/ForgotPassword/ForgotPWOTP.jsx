import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import {
	InputOTP,
	InputOTPGroup,
	InputOTPSlot,
} from "@/components/ui/input-otp";
import { Mail, CheckCircle, XCircle } from "lucide-react";
import {
	useLazyForgotPasswordQuery,
	useVerifyOTPForgotPasswordMutation,
} from "@/services/gshopApi";
import { toast } from "sonner";
import { useDispatch, useSelector } from "react-redux";
import {
	setForgotPasswordStep,
	setForgotPasswordToken,
	setOTP,
} from "@/features/auth";

export default function ForgotPwOTP() {
	const dispatch = useDispatch();
	const email = useSelector((state) => state?.rootReducer?.user?.email);
	const otp = useSelector((state) => state?.rootReducer.auth?.otp);
	const [
		verifyOTP,
		{
			isLoading: isVerifyLoading,
			isError: isVerifyError,
			data: verifyRes,
			error: verifyError,
		},
	] = useVerifyOTPForgotPasswordMutation();
	const [
		triggerResend,
		{
			isLoading: isResendLoading,
			isError: isResendError,
			data: resendRes,
			error: resendError,
		},
	] = useLazyForgotPasswordQuery();
	const [resendSuccess, setResendSuccess] = useState(false);

	// Show toast for resend success/error
	useEffect(() => {
		if (resendSuccess && resendRes) {
			toast.success(
				resendRes?.message ||
					"Mã xác thực mới đã được gửi tới email của bạn."
			);
		}
		if (isResendError && resendError?.data?.message) {
			toast.error(resendError.data.message);
		}
	}, [resendSuccess, resendRes, isResendError, resendError]);

	// Show toast for verify error
	useEffect(() => {
		if (isVerifyError && verifyError?.data?.message) {
			toast.error(verifyError.data.message);
		}
	}, [isVerifyError, verifyError]);

	const handleOTPChange = (value) => {
		dispatch(setOTP(value));
		if (value.length === 6) {
			handleVerifyOTP(value);
		}
	};

	const handleVerifyOTP = async (value = otp) => {
		if (value.length !== 6) {
			dispatch(setOTP(""));
			return;
		}
		try {
			await verifyOTP({ email, otp: value })
				.unwrap()
				.then((res) => {
					console.log(res);
					dispatch(setForgotPasswordToken(res?.resetPasswordToken)); // Update OTP in state
					toast("Xác thực OTP thành công");
					dispatch(setForgotPasswordStep("newpassword")); // Navigate to new password step
				});
		} catch (e) {
			toast.error("Lỗi xác thực OTP", {
				description:
					e?.data?.message ||
					"Đã xảy ra lỗi khi xác thực mã OTP. Vui lòng thử lại.",
			});
		} finally {
			dispatch(setOTP(""));
		}
	};

	const handleResend = async () => {
		dispatch(setOTP(""));
		setResendSuccess(false);
		try {
			await triggerResend({ email }).unwrap();
			setResendSuccess(true);
		} catch (e) {
			console.log(e);
			setResendSuccess(false);
		}
	};

	return (
		<div className="space-y-6">
			<div className="text-center space-y-3">
				<div className="space-y-1">
					<Label
						htmlFor="otp"
						className="text-xl font-bold text-slate-800"
					>
						Nhập mã xác thực
					</Label>
					<p className="text-sm text-slate-500 leading-relaxed">
						Chúng tôi đã gửi mã 6 chữ số đến email của bạn
					</p>
				</div>
				<div className="flex items-center justify-center space-x-2 text-xs text-slate-400">
					<div className="w-8 h-px bg-slate-200"></div>
					<span className="px-2 bg-white">OTP</span>
					<div className="w-8 h-px bg-slate-200"></div>
				</div>
			</div>

			<div className="flex justify-center items-center gap-4">
				<InputOTP
					maxLength={6}
					value={otp}
					onChange={handleOTPChange}
					disabled={isVerifyLoading}
				>
					<InputOTPGroup className="gap-4">
						{[0, 1, 2, 3, 4, 5].map((i) => (
							<InputOTPSlot
								key={i}
								index={i}
								className="w-16 h-16 text-2xl font-bold border-2 border-slate-200 bg-slate-50/50 rounded-2xl focus:border-blue-500 focus:bg-white focus:ring-4 focus:ring-blue-100/60 transition-all duration-300 shadow-sm hover:shadow-lg hover:border-slate-300 backdrop-blur-sm"
							/>
						))}
					</InputOTPGroup>
				</InputOTP>
				{verifyRes?.success && (
					<div className="flex items-center justify-center w-10 h-10 bg-green-100 rounded-full">
						<CheckCircle className="h-6 w-6 text-green-600" />
					</div>
				)}
				{isVerifyError && (
					<div className="flex items-center justify-center w-10 h-10 bg-red-100 rounded-full">
						<XCircle className="h-6 w-6 text-red-600" />
					</div>
				)}
			</div>
			<Button
				onClick={() => handleVerifyOTP(otp)}
				className="w-full h-12 bg-gradient-to-r from-blue-500 to-blue-600 hover:from-blue-600 hover:to-blue-700 text-white font-semibold rounded-xl shadow-lg hover:shadow-xl transition-all duration-300 focus:ring-4 focus:ring-blue-200 focus:ring-offset-2 disabled:opacity-50 disabled:cursor-not-allowed transform hover:scale-[1.02] active:scale-[0.98]"
				disabled={isVerifyLoading || otp.length !== 6}
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
					onClick={handleResend}
					disabled={isResendLoading}
					className="h-11 px-6 border-2 border-slate-200 text-slate-700 bg-white hover:bg-blue-50 hover:border-blue-300 hover:text-blue-600 transition-all duration-300 rounded-xl shadow-sm hover:shadow-md transform hover:scale-105 active:scale-95"
				>
					{isResendLoading ? (
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
		</div>
	);
}
