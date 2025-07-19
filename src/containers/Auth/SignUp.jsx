import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Checkbox } from "@/components/ui/checkbox"
import { RadioGroupItem } from "@/components/ui/radio-group"
import { Card, CardContent } from "@/components/ui/card"
import { Alert, AlertDescription } from "@/components/ui/alert"
import { Eye, EyeOff, Mail, Lock, User, ShoppingCart, Check } from "lucide-react"
import { toast } from "sonner"
import { Formik, Form, Field, ErrorMessage } from "formik"
import * as Yup from "yup"
import { Link, useNavigate } from "react-router-dom"
import { RadioGroup } from "@/components/ui/radio-group"
import { useRegisterMutation } from "@/services/gshopApi"
import errorCode from "@/const/errorCode"

export default function Signup() {
  const navigate = useNavigate()
  const [register, { isLoading, isError, data }] = useRegisterMutation()
  const [showPassword, setShowPassword] = useState(false)
  const [showConfirmPassword, setShowConfirmPassword] = useState(false)

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
    agreedToTerms: Yup.boolean()
      .oneOf([true], "Bạn phải đồng ý với điều khoản sử dụng"),
  })

  // Hàm tính độ mạnh mật khẩu (giữ nguyên)
  const getPasswordStrength = (password) => {
    if (!password) return { strength: 0, label: "" }
    let strength = 0
    if (password.length >= 6) strength++
    if (/[a-z]/.test(password)) strength++
    if (/[A-Z]/.test(password)) strength++
    if (/\d/.test(password)) strength++
    const labels = ["", "Yếu", "Trung bình", "Tốt", "Mạnh"]
    const colors = ["", "bg-red-500", "bg-orange-500", "bg-yellow-500", "bg-green-500"]
    return { strength, label: labels[strength], color: colors[strength] }
  }

  // Separate function to handle register API call
  const handleRegister = async (values, { setSubmitting, resetForm }) => {
    try {
      // Prepare payload for API
      const payload = {
        name: values.fullName,
        email: values.email,
        password: values.password,
        gender: values.gender,
        phone: values.phone ? values.phone : "0912345678",
        address: values.address ? values.address : "0",
        avatar: values.avatar ? values.avatar : "0",
        dateOfBirth: 0,
      }
      await register(payload).unwrap()
        .then(() => {
          toast("Tạo tài khoản thành công", {
            description: `Chào mừng ${values.fullName}! Cảm ơn bạn đã tham gia Global Shopper.`,
          })
          // Navigate to OTP verification page with email
          navigate("/otp-verify", { state: { email: values.email } })
        })
        .catch((e) => {
          if (e?.data?.errorCode === errorCode.EMAIL_ALREADY_EXISTS) {
            toast.error("Email đã tồn tại", {
              description: e?.data?.message || "Email này đã được đăng ký trong hệ thống.",
            })
          }
          else if (e?.data?.errorCode === errorCode.INVALID_EMAIL) {
            toast.error("Email không hợp lệ", {
              description: e?.data?.message || "Vui lòng kiểm tra lại địa chỉ email.",
            })
          }
          else {
            toast.error("Đăng ký thất bại", {
              description: e?.data?.message || "Có lỗi xảy ra trong quá trình đăng ký. Vui lòng thử lại.",
            })
          }
        })
    } catch (e) {
      console.log(e)
      toast.error("Đăng ký thất bại", {
        description: "Có lỗi xảy ra trong quá trình đăng ký. Vui lòng thử lại.",
      })
    } finally {
      setSubmitting(false)
    }
  }

  return (
    <div className="min-h-screen flex">
      {/* Left Section - Signup Form */}
      <div className="flex-1 flex items-center justify-center p-8 bg-background">
        <div className="w-full max-w-xl space-y-8">
          {/* Logo and Header */}
          <div className="text-center space-y-2">
            <Link to="/" className="inline-flex items-center space-x-2 mb-8">
              <div className="bg-primary rounded-full p-2">
                <ShoppingCart className="h-6 w-6 text-primary-foreground" />
              </div>
              <span className="text-2xl font-bold text-primary">Global Shopper</span>
            </Link>
            <h1 className="text-3xl font-bold tracking-tight">Tạo tài khoản</h1>
            <p className="text-muted-foreground">Tham gia cùng chúng tôi và bắt đầu hành trình mua sắm</p>
          </div>

          <Card className="border-0 shadow-none">
            <CardContent className="space-y-6 p-0">
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
                {({ values, errors, touched, isSubmitting, setFieldValue }) => {
                  const passwordStrength = getPasswordStrength(values.password)
                  return (
                    <Form className="space-y-4">
                      <div className="space-y-2">
                        <Label htmlFor="fullName">Họ và tên</Label>
                        <div className="relative">
                          <User className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                          <Field
                            as={Input}
                            id="fullName"
                            name="fullName"
                            type="text"
                            placeholder="Nhập họ và tên"
                            className={`pl-10 ${errors.fullName && touched.fullName ? "border-destructive" : ""}`}
                            disabled={isLoading || isSubmitting}
                          />
                        </div>
                        <ErrorMessage name="fullName">
                          {(msg) => (
                            <Alert variant="destructive" className="py-2">
                              <AlertDescription className="text-sm">{msg}</AlertDescription>
                            </Alert>
                          )}
                        </ErrorMessage>
                      </div>

                      <div className="space-y-2">
                        <Label htmlFor="email">Email</Label>
                        <div className="relative">
                          <Mail className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                          <Field
                            as={Input}
                            id="email"
                            name="email"
                            type="email"
                            placeholder="Nhập email"
                            className={`pl-10 ${errors.email && touched.email ? "border-destructive" : ""}`}
                            disabled={isLoading || isSubmitting}
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

                      <div className="space-y-3">
                        <Label>Giới tính</Label>
                        <Field name="gender">
                          {({ field }) => (
                            <RadioGroup
                              value={field.value}
                              onValueChange={value => setFieldValue("gender", value)}
                              className="flex space-x-6"
                              disabled={isLoading || isSubmitting}
                            >
                              <div className="flex items-center space-x-2">
                                <RadioGroupItem value="MALE" id="male" />
                                <Label htmlFor="male" className="cursor-pointer">Nam</Label>
                              </div>
                              <div className="flex items-center space-x-2">
                                <RadioGroupItem value="FEMALE" id="female" />
                                <Label htmlFor="female" className="cursor-pointer">Nữ</Label>
                              </div>
                              <div className="flex items-center space-x-2">
                                <RadioGroupItem value="OTHERS" id="others" />
                                <Label htmlFor="others" className="cursor-pointer">Khác</Label>
                              </div>
                            </RadioGroup>
                          )}
                        </Field>
                        <ErrorMessage name="gender">
                          {(msg) => (
                            <Alert variant="destructive" className="py-2">
                              <AlertDescription className="text-sm">{msg}</AlertDescription>
                            </Alert>
                          )}
                        </ErrorMessage>
                      </div>

                      <div className="grid grid-cols-2 gap-4">
                        <div className="space-y-2">
                          <Label htmlFor="password">Mật khẩu</Label>
                          <div className="relative">
                            <Lock className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                            <Field
                              as={Input}
                              id="password"
                              name="password"
                              type={showPassword ? "text" : "password"}
                              placeholder="Mật khẩu"
                              className={`pl-10 pr-10 ${errors.password && touched.password ? "border-destructive" : ""}`}
                              disabled={isLoading || isSubmitting}
                            />
                            <Button
                              type="button"
                              variant="ghost"
                              size="sm"
                              className="absolute right-0 top-0 h-full px-3 py-2 hover:bg-transparent"
                              onClick={() => setShowPassword(!showPassword)}
                              disabled={isLoading || isSubmitting}
                            >
                              {showPassword ? (
                                <EyeOff className="h-4 w-4 text-muted-foreground" />
                              ) : (
                                <Eye className="h-4 w-4 text-muted-foreground" />
                              )}
                            </Button>
                          </div>
                          {values.password && (
                            <div className="space-y-1">
                              <div className="flex items-center space-x-2">
                                <div className="flex-1 bg-muted rounded-full h-1">
                                  <div
                                    className={`h-1 rounded-full transition-all duration-300 ${passwordStrength.color}`}
                                    style={{ width: `${(passwordStrength.strength / 4) * 100}%` }}
                                  />
                                </div>
                                <span className="text-xs text-muted-foreground">{passwordStrength.label}</span>
                              </div>
                            </div>
                          )}
                          <ErrorMessage name="password">
                            {(msg) => (
                              <Alert variant="destructive" className="py-2">
                                <AlertDescription className="text-sm">{msg}</AlertDescription>
                              </Alert>
                            )}
                          </ErrorMessage>
                        </div>

                        <div className="space-y-2">
                          <Label htmlFor="confirmPassword">Xác nhận mật khẩu</Label>
                          <div className="relative">
                            <Lock className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                            <Field
                              as={Input}
                              id="confirmPassword"
                              name="confirmPassword"
                              type={showConfirmPassword ? "text" : "password"}
                              placeholder="Xác nhận mật khẩu"
                              className={`pl-10 pr-10 ${errors.confirmPassword && touched.confirmPassword ? "border-destructive" : ""}`}
                              disabled={isLoading || isSubmitting}
                            />
                            <Button
                              type="button"
                              variant="ghost"
                              size="sm"
                              className="absolute right-0 top-0 h-full px-3 py-2 hover:bg-transparent"
                              onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                              disabled={isLoading || isSubmitting}
                            >
                              {showConfirmPassword ? (
                                <EyeOff className="h-4 w-4 text-muted-foreground" />
                              ) : (
                                <Eye className="h-4 w-4 text-muted-foreground" />
                              )}
                            </Button>
                          </div>
                          {values.confirmPassword && values.password === values.confirmPassword && (
                            <div className="flex items-center space-x-1 text-green-600">
                              <Check className="h-3 w-3" />
                              <span className="text-xs">Mật khẩu khớp</span>
                            </div>
                          )}
                          <ErrorMessage name="confirmPassword">
                            {(msg) => (
                              <Alert variant="destructive" className="py-2">
                                <AlertDescription className="text-sm">{msg}</AlertDescription>
                              </Alert>
                            )}
                          </ErrorMessage>
                        </div>
                      </div>

                      <div className="space-y-2">
                        <div className="flex items-start space-x-2">
                          <Field
                            as={Checkbox}
                            id="terms"
                            name="agreedToTerms"
                            checked={values.agreedToTerms}
                            onCheckedChange={(checked) => setFieldValue("agreedToTerms", checked)}
                            disabled={isLoading || isSubmitting}
                            className="mt-0.5"
                          />
                          <Label htmlFor="terms" className="text-sm leading-5 cursor-pointer">
                            Tôi đồng ý với{" "}
                            <Link to="/terms" className="text-primary hover:underline">
                              Điều khoản sử dụng
                            </Link>{" "}
                            và{" "}
                            <Link to="/privacy" className="text-primary hover:underline">
                              Chính sách bảo mật
                            </Link>{" "}
                            của Global Shopper
                          </Label>
                        </div>
                        <ErrorMessage name="agreedToTerms">
                          {(msg) => (
                            <Alert variant="destructive" className="py-2">
                              <AlertDescription className="text-sm">{msg}</AlertDescription>
                            </Alert>
                          )}
                        </ErrorMessage>
                      </div>

                      <Button type="submit" className="w-full h-12" disabled={isLoading || isSubmitting}>
                        {isLoading || isSubmitting ? "Đang tạo tài khoản..." : "Tạo tài khoản"}
                      </Button>
                    </Form>
                  )
                }}
              </Formik>

              <div className="text-center">
                <p className="text-sm text-muted-foreground">
                  Đã có tài khoản?{" "}
                  <Link to="/login" className="text-primary hover:underline font-medium">
                    Đăng nhập
                  </Link>
                </p>
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
            <ShoppingCart className="h-24 w-24 text-primary" />
          </div>
          <h2 className="text-2xl font-semibold text-primary">Tham gia Global Shopper ngay hôm nay</h2>
          <p className="text-muted-foreground">
            Tạo tài khoản để khám phá hàng ngàn sản phẩm với ưu đãi độc quyền và giao hàng nhanh chóng.
          </p>
        </div>
      </div>
    </div>
  )
}
