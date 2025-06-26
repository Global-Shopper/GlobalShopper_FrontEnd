import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Lock, Eye, EyeOff } from "lucide-react"
import { Formik, Form, Field, ErrorMessage } from "formik"
import * as Yup from "yup"
import { useResetPasswordMutation } from "@/services/gshopApi"
import { toast } from "sonner"
import { useSelector } from "react-redux"

export default function NewPasswordForm() {
  const accessToken = useSelector((state) => state.rootReducer?.user?.accessToken)
  const [resetPassword, { isLoading }] = useResetPasswordMutation()
  const [showPassword, setShowPassword] = useState(false)
  const [showConfirmPassword, setShowConfirmPassword] = useState(false)

  const passwordValidationSchema = Yup.object({
    password: Yup.string()
      .min(8, "Mật khẩu phải có ít nhất 8 ký tự")
      .required("Mật khẩu không được để trống"),
    confirmPassword: Yup.string()
      .oneOf([Yup.ref('password'), null], 'Mật khẩu xác nhận phải khớp')
      .required("Xác nhận mật khẩu không được để trống"),
  })

  const handleSubmit = async (values, { setSubmitting, resetForm }) => {
    try {
      await resetPassword({ token: accessToken, password: values.password }).unwrap()
      toast.success("Đặt lại mật khẩu thành công", {
        description: "Mật khẩu của bạn đã được đặt lại. Đang chuyển hướng...",
      })
      resetForm()
      // You can dispatch a navigation or state reset here if needed
    } catch (e) {
      toast.error("Đặt lại mật khẩu thất bại", {
        description: e?.data?.message || "Đã xảy ra lỗi khi đặt lại mật khẩu. Vui lòng thử lại.",
      })
    } finally {
      setSubmitting(false)
    }
  }

  return (
    <Formik
      initialValues={{ password: "", confirmPassword: "" }}
      validationSchema={passwordValidationSchema}
      onSubmit={handleSubmit}
    >
      {({ errors, touched, isSubmitting }) => (
        <Form className="space-y-6">
          <div className="space-y-2">
            <Label htmlFor="password">Mật khẩu mới</Label>
            <div className="relative">
              <Lock className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
              <Field
                as={Input}
                id="password"
                name="password"
                type={showPassword ? "text" : "password"}
                placeholder="Nhập mật khẩu mới"
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
                <div className="text-destructive text-sm">{msg}</div>
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
                placeholder="Xác nhận mật khẩu mới"
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
            <ErrorMessage name="confirmPassword">
              {(msg) => (
                <div className="text-destructive text-sm">{msg}</div>
              )}
            </ErrorMessage>
          </div>
          <Button type="submit" className="w-full h-12" disabled={isLoading || isSubmitting}>
            {isLoading || isSubmitting ? "Đang đặt lại..." : "Đặt lại mật khẩu"}
          </Button>
        </Form>
      )}
    </Formik>
  )
}