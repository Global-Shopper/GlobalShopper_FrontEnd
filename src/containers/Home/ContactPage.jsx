import React from 'react'
import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Card } from "@/components/ui/card";
import { Formik, Form, Field, ErrorMessage } from "formik";
import * as Yup from "yup";
import { toast } from "sonner";

const ContactPage = () => {
  return (
    <div className="min-h-[60vh] bg-white">
      <div className="max-w-6xl mx-auto px-4 py-8">
        {/* Breadcrumb */}
        <div className="text-sm text-slate-500 mb-6">
          <Link to="/" className="hover:text-blue-600">Trang chủ</Link>
          <span className="mx-2">›</span>
          <span className="text-slate-700">Liên hệ</span>
        </div>

        {/* Title */}
        <h1 className="text-2xl font-bold text-slate-800 mb-2">LIÊN HỆ</h1>
        <div className="h-0.5 w-16 bg-blue-500 mb-6" />

        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          {/* Left: Info */}
          <div className="space-y-4 text-slate-700">
            <div>
              <h3 className="font-semibold mb-2">Văn phòng giao dịch</h3>
              <ul className="list-disc pl-5 space-y-1">
                <li>7 Đ. D1, Long Thạnh Mỹ, Thủ Đức, Hồ Chí Minh 700000</li>
              </ul>
            </div>
            <p><span className="font-semibold">Hotline:</span> 0123 456 789</p>
            <p>
              <span className="font-semibold">Email:</span> cskh@globalshopper.com
            </p>
            <p>
              Bạn có thể để lại thông tin và chúng tôi sẽ liên hệ để hỗ trợ ngay lập tức
            </p>
          </div>

          {/* Right: Form */}
          <Card className="p-4">
            <Formik
              initialValues={{ fullName: "", phone: "", content: "" }}
              validationSchema={Yup.object({
                fullName: Yup.string().trim().required("Vui lòng nhập họ và tên"),
                phone: Yup.string()
                  .matches(/^(0|\+84)\d{9,10}$/, "Số điện thoại không hợp lệ")
                  .required("Vui lòng nhập số điện thoại"),
                content: Yup.string().trim().required("Vui lòng nhập nội dung"),
              })}
              onSubmit={(values, { resetForm, setSubmitting }) => {
                setTimeout(() => {
                  toast.success("Đã gửi liên hệ", {
                    description: "Chúng tôi sẽ phản hồi sớm nhất có thể.",
                  });
                  resetForm();
                  setSubmitting(false);
                }, 400);
              }}
            >
              {({ errors, touched, isSubmitting }) => (
                <Form className="space-y-3">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                    <div>
                      <Field
                        as={Input}
                        name="fullName"
                        placeholder="Họ và tên"
                        aria-invalid={touched.fullName && errors.fullName ? true : undefined}
                      />
                      <ErrorMessage name="fullName">
                        {(msg) => (
                          <p className="mt-1 text-xs text-red-600">{msg}</p>
                        )}
                      </ErrorMessage>
                    </div>
                    <div>
                      <Field
                        as={Input}
                        name="phone"
                        placeholder="Số điện thoại"
                        inputMode="tel"
                        aria-invalid={touched.phone && errors.phone ? true : undefined}
                      />
                      <ErrorMessage name="phone">
                        {(msg) => (
                          <p className="mt-1 text-xs text-red-600">{msg}</p>
                        )}
                      </ErrorMessage>
                    </div>
                  </div>
                  <div>
                    <Field
                      as={Textarea}
                      name="content"
                      placeholder="Nhập nội dung"
                      rows={5}
                      aria-invalid={touched.content && errors.content ? true : undefined}
                    />
                    <ErrorMessage name="content">
                      {(msg) => (
                        <p className="mt-1 text-xs text-red-600">{msg}</p>
                      )}
                    </ErrorMessage>
                  </div>
                  <div className="pt-1">
                    <Button
                      type="submit"
                      disabled={isSubmitting}
                      className="px-6 bg-amber-500 hover:bg-amber-600"
                    >
                      GỬI
                    </Button>
                  </div>
                </Form>
              )}
            </Formik>
          </Card>
        </div>
      </div>
    </div>
  )
}

export default ContactPage