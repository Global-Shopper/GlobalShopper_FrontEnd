import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Card, CardContent } from "@/components/ui/card"
import { Alert, AlertDescription } from "@/components/ui/alert"
import { ArrowLeft, Mail, ShoppingCart, CheckCircle, XCircle, Lock, Eye, EyeOff } from "lucide-react"
import { Link, useNavigate } from "react-router-dom"
import { toast } from "sonner"
import { Formik, Form, Field, ErrorMessage } from "formik"
import * as Yup from "yup"
import { useLazyForgotPasswordQuery } from "@/services/gshopApi"
import ForgotPwOTP from "./ForgotPwOTP"
import NewPasswordForm from "./NewPasswordForm"
import { useDispatch, useSelector } from "react-redux"
import { setEmail, setForgotPasswordStep } from "@/features/auth"

export default function ForgotPassword() {
  const navigate = useNavigate()
  const dispatch = useDispatch()
  const step = useSelector((state) => state.rootReducer?.auth?.forgotPasswordStep)
  const email = useSelector((state) => state.rootReducer?.auth?.email)
  const [forgotPassword, { isLoading: isForgotLoading }] = useLazyForgotPasswordQuery()

  // Email step
  const emailValidationSchema = Yup.object({
    email: Yup.string()
      .email("Vui lòng nhập địa chỉ email hợp lệ")
      .required("Email không được để trống"),
  })

  // Step 1: Email submit
  const handleEmailSubmit = async (values, { setSubmitting }) => {
    dispatch(setEmail(values.email))
    try {
      await forgotPassword(values).unwrap()
        .then((res) => {
          dispatch(setForgotPasswordStep("otp"))
          toast("Gửi OTP thành công", {
            description: res.message ||"Vui lòng kiểm tra email của bạn để đặt lại mật khẩu.",
          })
        })

    } catch (e) {
      toast.error("Gửi OTP thất bại", {
        description: e?.data?.message || "Đã xảy ra lỗi khi gửi email đặt lại mật khẩu. Vui lòng thử lại sau.",
      })
    } finally {
      setSubmitting(false)
    }
  }

  return (
    <div className="min-h-screen flex">
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
            <h1 className="text-3xl font-bold tracking-tight">Đặt lại mật khẩu</h1>
            <p className="text-muted-foreground">
              {step === "email" && "Nhập email của bạn để nhận hướng dẫn đặt lại mật khẩu"}
              {step === "otp" && (
                <>
                  Chúng tôi đã gửi mã xác thực gồm 6 số tới
                  <br />
                  <span className="font-medium text-foreground">{email}</span>
                </>
              )}
              {step === "newpassword" && (
                <>
                  Xác thực thành công! Nhập mật khẩu mới cho tài khoản <br />
                  <span className="font-medium text-foreground">{email}</span>
                </>
              )}
            </p>
          </div>

          <Card className="border-0 shadow-none">
            <CardContent className="space-y-6 p-0">
              {step === "email" && (
                <Formik
                  initialValues={{ email: "" }}
                  validationSchema={emailValidationSchema}
                  onSubmit={handleEmailSubmit}
                >
                  {({ values, errors, touched, isSubmitting }) => (
                    <Form className="space-y-4">
                      <div className="space-y-2">
                        <Label htmlFor="email">Email</Label>
                        <div className="relative">
                          <Mail className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                          <Field
                            as={Input}
                            id="email"
                            name="email"
                            type="email"
                            placeholder="Nhập email của bạn"
                            className={`pl-10 ${errors.email && touched.email ? "border-destructive" : ""}`}
                            disabled={isForgotLoading || isSubmitting}
                          />
                        </div>
                        <ErrorMessage name="email">
                          {(msg) => (
                            <Alert variant="destructive" className="py-2">
                              <AlertDescription className="text-sm">{msg}</AlertDescription>
                            </Alert>
                          )}
                        </ErrorMessage>
                      </div>
                      <Button
                        type="submit"
                        className="w-full h-12"
                        disabled={
                          isForgotLoading ||
                          isSubmitting ||
                          !values.email ||
                          !!errors.email
                        }
                      >
                        {isForgotLoading || isSubmitting ? "Đang gửi..." : "Xác nhận email và gửi OTP"}
                      </Button>
                    </Form>
                  )}
                </Formik>
              )}

              {step === "otp" && (
                <ForgotPwOTP />
              )}

              {step === "newpassword" && (
                <NewPasswordForm />
              )}

              {/* Help Text */}
              <div className="text-center space-y-3">
                <p className="text-xs text-muted-foreground">
                  Kiểm tra thư mục spam nếu bạn không thấy email
                </p>
                {step === "email" && (
                  <p className="text-sm text-muted-foreground">
                    Nhớ mật khẩu?{" "}
                    <Link to="/login" className="text-primary hover:underline font-medium">
                      Đăng nhập ngay
                    </Link>
                  </p>
                )}
              </div>
              {/* Back to Login */}
              <div onClick={() => dispatch(setForgotPasswordStep('email'))} className="text-center pt-4">
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
            {step === "otp" || step === "newpassword" ? (
              <Mail className="h-24 w-24 text-primary" />
            ) : (
              <Lock className="h-24 w-24 text-primary" />
            )}
          </div>
          <h2 className="text-2xl font-semibold text-primary">
            {step === "otp" || step === "newpassword"
              ? "Kiểm tra email của bạn"
              : "Đặt lại mật khẩu"}
          </h2>
          <p className="text-muted-foreground">
            {step === "otp" || step === "newpassword"
              ? "Chúng tôi đã gửi mã xác thực bảo mật tới email của bạn. Nhập mã và mật khẩu mới để hoàn tất."
              : "Chúng tôi sẽ gửi hướng dẫn đặt lại mật khẩu tới email của bạn. Làm theo các bước trong email để tạo mật khẩu mới."
            }
          </p>
          <div className="flex items-center justify-center space-x-4 text-sm text-muted-foreground">
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
  )
}