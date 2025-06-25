import { useState, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { Label } from "@/components/ui/label"
import { Card, CardContent } from "@/components/ui/card"
import { Alert, AlertDescription } from "@/components/ui/alert"
import { InputOTP, InputOTPGroup, InputOTPSlot } from "@/components/ui/input-otp"
import { ArrowLeft, Mail, ShoppingCart, CheckCircle, XCircle, Clock } from "lucide-react"
import { Link, useLocation, useNavigate } from "react-router-dom"
import { toast } from "sonner"
import { useVerifyOTPMutation } from "@/services/gshopApi"
import errorCode from "@/const/errorCode"

export default function OTPverification() {
  const navigate = useNavigate()
  const [otp, setOtp] = useState("")
  const [isResending, setIsResending] = useState(false)
  const [localError, setLocalError] = useState("")
  const email = useLocation().state?.email
  const [verifyOTP, { isLoading, error, data }] = useVerifyOTPMutation()

  // Only update OTP value
  const handleOTPChange = (value) => {
    setOtp(value)
    setLocalError("")
  }

  // Auto-verify when 6 digits are entered
  useEffect(() => {
    if (otp.length === 6 && !isLoading && !data?.success) {
      handleVerifyOTP()
    }
    // eslint-disable-next-line
  }, [otp])

  const handleVerifyOTP = async () => {
    if (otp.length !== 6) {
      setLocalError("Vui lòng nhập đủ 6 số OTP")
      return
    }
    setLocalError("")
    try {
      await verifyOTP({ email, otp }).unwrap()
        .then(() => {
          toast("Xác thực OTP thành công", {
            description: "Email của bạn đã được xác thực. Đang chuyển hướng...",
          })
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
              description: e?.data?.message || "OTP không hợp lệ hoặc hết hạn. Vui lòng thử lại.",
            })
          }
        })
    } catch (e) {
      console.log(e);
    }
  }

  const handleResendOTP = async () => {
    setIsResending(true)
    setLocalError("")
    setOtp("")
    try {
      // Replace with real API call if available
      await new Promise((resolve) => setTimeout(resolve, 1000))
      toast({
        title: "Đã gửi lại mã OTP",
        description: `Mã xác thực mới đã được gửi tới ${email}`,
      })
    } catch {
      toast({
        variant: "destructive",
        title: "Gửi lại OTP thất bại",
        description: "Vui lòng thử lại sau.",
      })
    } finally {
      setIsResending(false)
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
                <div className="flex justify-center">
                  <InputOTP
                    maxLength={6}
                    value={otp}
                    onChange={handleOTPChange}
                    disabled={isLoading || data?.success}
                  >
                    <InputOTPGroup>
                      {[0, 1, 2, 3, 4, 5].map(i => (
                        <InputOTPSlot key={i} index={i} className="w-12 h-12 text-lg" />
                      ))}
                    </InputOTPGroup>
                  </InputOTP>
                </div>

                {/* Status Icon Only (optional) */}
                {(data?.success || error) && (
                  <div className="flex justify-center">
                    {data?.success && <CheckCircle className="h-5 w-5 text-green-600" />}
                    {error?.data?.errorCode === "OTP_EXPIRED" && <Clock className="h-5 w-5 text-orange-600" />}
                    {error && !error?.data?.errorCode && <XCircle className="h-5 w-5 text-red-600" />}
                  </div>
                )}

                {/* Local Error Message */}
                {localError && (
                  <Alert variant="destructive" className="py-2">
                    <AlertDescription className="text-sm">{localError}</AlertDescription>
                  </Alert>
                )}

                {/* Loading State */}
                {isLoading && (
                  <div className="text-center">
                    <div className="inline-flex items-center space-x-2 text-sm text-muted-foreground">
                      <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-primary"></div>
                      <span>Đang xác thực...</span>
                    </div>
                  </div>
                )}
              </div>

              {/* Manual Verify Button */}
              {otp.length === 6 && !isLoading && !data?.success && (
                <Button onClick={handleVerifyOTP} className="w-full h-12" disabled={isLoading}>
                  Xác thực OTP
                </Button>
              )}

              {/* Resend Section */}
              <div className="text-center space-y-3">
                <p className="text-sm text-muted-foreground">Không nhận được mã?</p>
                <Button
                  variant="outline"
                  onClick={handleResendOTP}
                  disabled={isResending}
                  className="h-10"
                >
                  {isResending ? (
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
                <Button asChild variant="ghost" className="h-10">
                  <Link to="/login" className="flex items-center space-x-2">
                    <ArrowLeft className="h-4 w-4" />
                    <span>Quay lại đăng nhập</span>
                  </Link>
                </Button>
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
