import { useState, useEffect, useCallback } from "react"
import { Button } from "@/components/ui/button"
import { Label } from "@/components/ui/label"
import { Card, CardContent } from "@/components/ui/card"
import { InputOTP, InputOTPGroup, InputOTPSlot } from "@/components/ui/input-otp"
import { ArrowLeft, Mail, ShoppingCart, CheckCircle, XCircle, Clock, BlocksIcon, BanIcon } from "lucide-react"
import { Link, useLocation, useNavigate } from "react-router-dom"
import { toast } from "sonner"
import { useLazyResendOTPQuery, useVerifyOTPMutation } from "@/services/gshopApi"
import errorCode from "@/const/errorCode"
import { useDispatch } from "react-redux"
import { setUserInfo } from "@/features/user"

export default function OTPverification({ changeEmail }) {
  const dispatch = useDispatch()
  const navigate = useNavigate()
  const [otp, setOtp] = useState("")
  const email = useLocation().state?.email
  const [verifyOTP, { isLoading: isVerifyLoading, isError: isVerifyError, data: verifyRes, error: verifyError }] = useVerifyOTPMutation()
  const [resendOTP, { isLoading: isResendingLoading, isError: isResendError, data: resendRes, error: resendError }] = useLazyResendOTPQuery()

  // Only update OTP value
  const handleOTPChange = (value) => {
    setOtp(value)
  }

  const handleVerifyOTP = useCallback(async () => {
    try {
      await verifyOTP({ email, otp }).unwrap()
        .then((res) => {
          toast("Xác thực OTP thành công", {
            description: "Email của bạn đã được xác thực. Đang chuyển hướng...",
          })
          dispatch(setUserInfo({...res?.user, accessToken: res?.token}))
          navigate("/")
        })
        .catch((e) => {
          // 4xx 5xx errors will be caught here
          // If the OTP times out, a new OTP will be available. Only one OTP can be used within 5 minutes.
          if (e?.data?.errorCode === errorCode.ALREADY_VERIFIED) {
            toast.error("Email đã được xác thực", {
              description: e?.data?.message || "Email của bạn đã được xác thực trước đó.",
            })
            navigate("/login")
          }
          else {
            toast.error("Lỗi xác thực", {
              description: e?.data?.message || "Đã xảy ra lỗi khi xác thực mã OTP. Vui lòng thử lại.",
            })
          }
        })
    } catch (e) {
      console.log(e);
    }
  }, [email, navigate, otp, verifyOTP])

  useEffect(() => {
    if (otp.length === 6) {
      handleVerifyOTP()
    }
  }, [handleVerifyOTP, otp.length])

  const handleResendOTP = async () => {
    setOtp("")
    try {
      await resendOTP({ email }).unwrap()
      .then(() => {
        toast("Gửi lại OTP thành công", {
        })
      })
      .catch((e) => {
        toast.error("Gửi lại OTP thất bại", {
          description: e?.data?.message || "Đã xảy ra lỗi khi gửi lại mã OTP. Vui lòng thử lại.",
        })
      })
    } catch (e) {
      console.log(e)
    }
  }

  return (
    <div className="min-h-screen flex">
      {/* Left Section - OTP Verification Form */}
      <div className="flex-1 flex items-center justify-center p-8 bg-background">
        <div className="w-full max-w-md space-y-8">
          {/* Logo and Header */}
          <div className="text-center space-y-2">
            <Link to="/" className="inline-flex items-center space-x-2 mb-8">
              <div className="bg-primary rounded-full p-2">
                <ShoppingCart className="h-6 w-6 text-primary-foreground" />
              </div>
              <span className="text-2xl font-bold text-primary">Global Shopper</span>
            </Link>
            <h1 className="text-3xl font-bold tracking-tight">Xác thực Email</h1>
            <p className="text-muted-foreground">
              Chúng tôi đã gửi mã xác thực gồm 6 số tới
              <br />
              <span className="font-medium text-foreground">{email}</span>
            </p>
          </div>

          <Card className="border-0 shadow-none">
            <CardContent className="space-y-6 p-0">
              {/* OTP Input */}
              <div className="space-y-4">
                <Label htmlFor="otp" className="text-center block">
                  Nhập mã xác thực
                </Label>
                <div className="flex justify-center items-center gap-2">
                  <InputOTP
                    maxLength={6}
                    value={otp}
                    onChange={handleOTPChange}
                    disabled={isVerifyLoading || verifyRes?.success}
                  >
                    <InputOTPGroup>
                      {[0, 1, 2, 3, 4, 5].map(i => (
                        <InputOTPSlot key={i} index={i} className="w-12 h-12 text-lg" />
                      ))}
                    </InputOTPGroup>
                  </InputOTP>
                  {/* Status Icon (right of OTP input) */}
                  {isVerifyError && (
                    <>
                      {verifyError?.data?.statusCode === 400 && (
                        <XCircle className="h-6 w-6 text-orange-600" />
                      )}
                      {verifyError?.data?.statusCode === 429 && (
                        <BanIcon className="h-6 w-6 text-red-600" />
                      )}
                    </>
                  )}
                  {verifyRes?.success && (
                    <CheckCircle className="h-6 w-6 text-green-600" />
                  )}
                </div>
                {/* Loading State */}
                {isVerifyLoading && (
                  <div className="text-center">
                    <div className="w-full h-12">
                      <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-primary"></div>
                      <span>Đang xác thực...</span>
                    </div>
                  </div>
                )}
              </div>

              {/* Manual Verify Button */}
              {otp.length === 6 && !isVerifyLoading && !verifyRes?.success && (
                <Button onClick={handleVerifyOTP} className="w-full h-12" disabled={isVerifyLoading}>
                  Xác thực OTP
                </Button>
              )}

              <div className="text-center space-y-20">
                <p className="text-sm text-muted-foreground">Không nhận được mã?</p>
                <Button
                  variant="outline"
                  onClick={handleResendOTP}
                  disabled={isResendingLoading}
                  className="h-10"
                >
                  {isResendingLoading ? (
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

              {/* Help Text */}
              <div className="text-center">
                <p className="text-xs text-muted-foreground">Kiểm tra thư mục spam nếu bạn không thấy email</p>
              </div>

              {/* Back to Login */}
              <div className="text-center pt-4">
                {
                  changeEmail ?
                  <Button asChild variant="ghost" className="h-10">
                  <Link to="/login" className="flex items-center space-x-2">
                    <ArrowLeft className="h-4 w-4" />
                    <span>Quay lại đăng nhập</span>
                  </Link>
                </Button>
                : 
                <Button asChild variant="ghost" className="h-10">
                  <Link to="/account-center" className="flex items-center space-x-2">
                    <ArrowLeft className="h-4 w-4" />
                    <span>Quay lại trang cá nhân</span>
                  </Link>
                </Button>
                }
              </div>
            </CardContent>
          </Card>

          {/* Footer */}
          <div className="text-center text-sm text-muted-foreground">© GShop. Đã đăng ký bản quyền.</div>
        </div>
      </div>

      {/* Right Section - Illustration */}
      <div className="hidden lg:flex flex-1 items-center justify-center bg-gradient-to-br from-primary/5 to-primary/10">
        <div className="max-w-md text-center space-y-4">
          <div className="w-64 h-64 mx-auto bg-gradient-to-br from-primary/20 to-primary/5 rounded-full flex items-center justify-center">
            <Mail className="h-24 w-24 text-primary" />
          </div>
          <h2 className="text-2xl font-semibold text-primary">Kiểm tra email của bạn</h2>
          <p className="text-muted-foreground">
            Chúng tôi đã gửi mã xác thực bảo mật tới email của bạn. Nhập mã để hoàn tất đăng ký tài khoản.
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
  )
}
