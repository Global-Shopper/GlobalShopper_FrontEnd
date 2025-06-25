import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Checkbox } from "@/components/ui/checkbox"
import { Card, CardContent } from "@/components/ui/card"
import { Alert, AlertDescription } from "@/components/ui/alert"
import { Separator } from "@/components/ui/separator"
import { Eye, EyeOff, Mail, Lock, ShoppingCart } from "lucide-react"
import { Link, useNavigate } from "react-router-dom"
import { toast } from "sonner"
import { Formik, Form, Field, ErrorMessage } from "formik"
import * as Yup from "yup"
import { useLoginMutation } from "@/services/gshopApi"
import errorCode from "@/const/errorCode"

export default function Login() {
  const navigate = useNavigate()
  const [showPassword, setShowPassword] = useState(false)
  const [login, { data, isLoading, isError }] = useLoginMutation()

  // Yup validation schema
  const validationSchema = Yup.object({
    email: Yup.string()
      .email("Vui lòng nhập địa chỉ email hợp lệ")
      .required("Email không được để trống"),
    password: Yup.string().required("Mật khẩu không được để trống"),
    rememberMe: Yup.boolean(),
  })

  const handleSubmit = async (values, { setSubmitting }) => {
    try {
      login(values).unwrap().then(() => {
        toast("Đăng nhập thành công", {
          description: "Mừng bạn trở lại! Bạn đã đăng nhập thành công vào Global Shopper.",
        })
      })
        .catch((e) => {
          if (e.data?.errorCode === errorCode.EMAIL_UNCONFIRMED) {
            toast("Email chưa được xác nhận", {
              action: {
                label: 'Gửi lại mã xác nhận',
                onClick: () => console.log('Action!'),
              },
              description: e.data.message || "Vui lòng kiểm tra email của bạn để xác nhận tài khoản.",
            })
            navigate("/otp-verify", { state: { email: values.email }})
          }
          else {
            toast.error("Đăng nhập thất bại", {
              description: e?.data?.message || "Đã xảy ra lỗi khi đăng nhập. Vui lòng thử lại sau.",
            })
          }

        })
    } catch (e) {
      console.log(e)
    } finally {
      setSubmitting(false)
    }
  }

  return (
    <div className="min-h-screen flex">
      {/* Left Section - Login Form */}
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
            <h1 className="text-3xl font-bold tracking-tight">Chào mừng trở lại!</h1>
            <p className="text-muted-foreground">Đăng nhập để tiếp tục mua sắm</p>
          </div>

          <Card className="border-0 shadow-none">
            <CardContent className="space-y-6 p-0">
              <div className="relative">
                <div className="absolute inset-0 flex items-center">
                  <Separator className="w-full" />
                </div>
              </div>

              {/* Login Form with Formik */}
              <Formik
                initialValues={{ email: "", password: "" }}
                validationSchema={validationSchema}
                onSubmit={handleSubmit}
              >
                {({ values, errors, touched, isSubmitting, setFieldValue }) => (
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

                    <div className="space-y-2">
                      <Label htmlFor="password">Mật khẩu</Label>
                      <div className="relative">
                        <Lock className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                        <Field
                          as={Input}
                          id="password"
                          name="password"
                          type={showPassword ? "text" : "password"}
                          placeholder="Nhập mật khẩu"
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
                      <ErrorMessage name="password">
                        {(msg) => (
                          <Alert variant="destructive" className="py-2">
                            <AlertDescription className="text-sm">{msg}</AlertDescription>
                          </Alert>
                        )}
                      </ErrorMessage>
                    </div>

                    <div className="flex items-center justify-between">
                      <div className="flex items-center space-x-2">
                        <Field
                          as={Checkbox}
                          id="remember"
                          name="rememberMe"
                          checked={values.rememberMe}
                          onCheckedChange={(checked) => setFieldValue("rememberMe", checked)}
                          disabled={isLoading || isSubmitting}
                        />
                        <Label htmlFor="remember" className="text-sm font-normal cursor-pointer">
                          Ghi nhớ đăng nhập
                        </Label>
                      </div>
                      <Link to="/forgot-password" className="text-sm text-primary hover:underline">
                        Quên mật khẩu?
                      </Link>
                    </div>

                    <Button type="submit" className="w-full h-12" disabled={isLoading || isSubmitting}>
                      {isLoading || isSubmitting ? "Đang đăng nhập..." : "Đăng nhập"}
                    </Button>
                  </Form>
                )}
              </Formik>

              <div className="text-center">
                <p className="text-sm text-muted-foreground">
                  Chưa có tài khoản?{" "}
                  <Link to="/signup" className="text-primary hover:underline font-medium">
                    Đăng ký ngay
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
          <h2 className="text-2xl font-semibold text-primary">Chào mừng đến với Global Shopper</h2>
          <p className="text-muted-foreground">
            Điểm đến mua sắm trực tuyến hàng đầu của bạn. Khám phá sản phẩm tuyệt vời, ưu đãi hấp dẫn và dịch vụ xuất sắc.
          </p>
        </div>
      </div>
    </div>
  )
}
