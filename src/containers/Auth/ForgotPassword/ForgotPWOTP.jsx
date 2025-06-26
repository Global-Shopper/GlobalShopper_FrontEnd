import { useState, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { Label } from "@/components/ui/label"
import { InputOTP, InputOTPGroup, InputOTPSlot } from "@/components/ui/input-otp"
import { Mail, CheckCircle, XCircle } from "lucide-react"
import { useLazyForgotPasswordQuery, useVerifyOTPForgotPasswordMutation } from "@/services/gshopApi"
import { toast } from "sonner"
import { useDispatch, useSelector } from "react-redux"
import { setForgotPasswordStep, setOTP } from "@/features/auth"
import { setAccessToken } from "@/features/user"

export default function ForgotPwOTP() {
  const dispatch = useDispatch()
  const email = useSelector((state) => state?.rootReducer?.auth?.email)
  const otp = useSelector((state) => state?.rootReducer.auth?.otp)
  const [verifyOTP, { isLoading: isVerifyLoading, isError: isVerifyError, data: verifyRes, error: verifyError }] = useVerifyOTPForgotPasswordMutation()
  const [triggerResend, { isLoading: isResendLoading, isError: isResendError, data: resendRes, error: resendError }] = useLazyForgotPasswordQuery()
  const [resendSuccess, setResendSuccess] = useState(false)

  // Show toast for resend success/error
  useEffect(() => {
    if (resendSuccess && resendRes) {
      toast.success(resendRes?.message || "Mã xác thực mới đã được gửi tới email của bạn.")
    }
    if (isResendError && resendError?.data?.message) {
      toast.error(resendError.data.message)
    }
  }, [resendSuccess, resendRes, isResendError, resendError])

  // Show toast for verify error
  useEffect(() => {
    if (isVerifyError && verifyError?.data?.message) {
      toast.error(verifyError.data.message)
    }
  }, [isVerifyError, verifyError])

  const handleOTPChange = (value) => {
    dispatch(setOTP(value))
    if (value.length === 6) {
      handleVerifyOTP(value)
    }
  }

  const handleVerifyOTP = async (value = otp) => {
    if (value.length !== 6) {
      dispatch(setOTP(""))
      return
    }
    try {
      await verifyOTP({ email, otp: value }).unwrap()
      .then((res) => {
        console.log(res)
          dispatch(setAccessToken(res?.resetPasswordToken)) // Update OTP in state
        toast("Xác thực OTP thành công")
          dispatch(setForgotPasswordStep("newpassword")) // Navigate to new password step
    })
    } catch (e) {
      toast.error("Lỗi xác thực OTP", {
        description: e?.data?.message || "Đã xảy ra lỗi khi xác thực mã OTP. Vui lòng thử lại.",
      })
    } finally {
      dispatch(setOTP(""))
    }
  }

  const handleResend = async () => {
    dispatch(setOTP(""))
    setResendSuccess(false)
    try {
      await triggerResend({ email }).unwrap()
      setResendSuccess(true)
    } catch (e) {
      setResendSuccess(false)
    }
  }

  return (
    <div className="space-y-6">
      <Label htmlFor="otp" className="text-center block">
        Nhập mã xác thực
      </Label>
      <div className="flex justify-center items-center gap-2">
        <InputOTP
          maxLength={6}
          value={otp}
          onChange={handleOTPChange}
          disabled={isVerifyLoading}
        >
          <InputOTPGroup>
            {[0, 1, 2, 3, 4, 5].map(i => (
              <InputOTPSlot key={i} index={i} className="w-12 h-12 text-lg" />
            ))}
          </InputOTPGroup>
        </InputOTP>
        {verifyRes?.success && <CheckCircle className="h-6 w-6 text-green-600" />}
        {isVerifyError && <XCircle className="h-6 w-6 text-red-600" />}
      </div>
      <Button
        onClick={() => handleVerifyOTP(otp)}
        className="w-full h-12"
        disabled={isVerifyLoading || otp.length !== 6}
      >
        {isVerifyLoading ? "Đang xác thực..." : "Xác thực OTP"}
      </Button>
      <div className="text-center space-y-3 mt-4">
        <p className="text-sm text-muted-foreground">Không nhận được mã?</p>
        <Button
          variant="outline"
          onClick={handleResend}
          disabled={isResendLoading}
          className="h-10"
        >
          {isResendLoading ? (
            <>
              <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-primary mr-2"></div>
              Đang gửi...
            </>
          ) : (
            <>
              <Mail className="mr-2 h-4 w-4" />
              Gửi lại mã
            </>
          )}
        </Button>
      </div>
    </div>
  )
}