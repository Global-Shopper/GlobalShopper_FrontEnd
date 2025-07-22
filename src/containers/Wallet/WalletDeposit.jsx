import React, { useEffect } from 'react'
import { Formik, Form, Field, ErrorMessage } from 'formik'
import * as Yup from 'yup'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card'
import { Alert, AlertDescription } from '@/components/ui/alert'
import {
  ArrowLeft,
  Wallet,
  AlertCircle,
  Shield,
  Check,
  Banknote
} from 'lucide-react'
import { useNavigate } from 'react-router-dom'
import { toast } from 'sonner'
import { useDepositWalletMutation, useGetWalletQuery } from '@/services/gshopApi'
import { REDIRECT_URI } from '@/const/urlconst'

// Predefined amount options
const AMOUNT_OPTIONS = [
  { value: 50000, label: '50.000 VNĐ' },
  { value: 100000, label: '100.000 VNĐ' },
  { value: 200000, label: '200.000 VNĐ' },
  { value: 500000, label: '500.000 VNĐ' },
  { value: 1000000, label: '1.000.000 VNĐ' },
  { value: 2000000, label: '2.000.000 VNĐ' }
]

// Validation schema
const DepositValidationSchema = Yup.object().shape({
  amount: Yup.number()
    .min(10000, 'Số tiền tối thiểu là 10.000 VNĐ')
    .max(50000000, 'Số tiền tối đa là 50.000.000 VNĐ')
    .required('Vui lòng nhập số tiền (Tối thiểu 10.000 VNĐ, Tối đa 50.000.000 VNĐ)')
})

const WalletDeposit = () => {
  const navigate = useNavigate()
  // const [checkPayment] = useLazyCheckPaymentQuery()
  const [depositWallet, { isLoading: isDepositing }] = useDepositWalletMutation()
  const { data: wallet, isLoading: isWalletLoading } = useGetWalletQuery()

  const formatCurrency = (amount) => {
    return `${new Intl.NumberFormat("vi-VN").format(amount)} VNĐ`
  }

  const handleSubmit = async (values, { setSubmitting, resetForm }) => {
    try {
      console.log(values)
      await depositWallet({
        balance: values.amount,
        redirectUri: REDIRECT_URI
      }).unwrap()
        .then((res) => {
          toast.success("Yêu cầu nạp tiền thành công", {
            description: "Yêu cầu của bạn đã được gửi. Vui lòng hoàn tất thanh toán để nạp tiền vào ví.",
          })
          window.location.href = res?.url
        })


      resetForm()
    } catch (error) {
      toast.error("Nạp tiền thất bại", {
        description: error?.data?.message || "Đã xảy ra lỗi khi nạp tiền. Vui lòng thử lại sau.",
      })
    } finally {
      setSubmitting(false)
    }
  }

  const handleBack = () => {
    navigate('/wallet')
  }


  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="container mx-auto px-4 max-w-4xl">
        {/* Header */}
        <div className="mb-8">
          <Button
            variant="ghost"
            onClick={handleBack}
            className="mb-4 p-0 h-auto font-normal text-muted-foreground hover:text-foreground"
          >
            <ArrowLeft className="mr-2 h-4 w-4" />
            Quay lại
          </Button>

          <div className="flex items-center gap-3 mb-2">
            <div className="p-2 rounded-lg bg-blue-100">
              <Wallet className="h-6 w-6 text-blue-600" />
            </div>
            <div>
              <h1 className="text-2xl font-bold text-gray-900">Nạp tiền vào ví</h1>
              <p className="text-gray-600">Chọn số tiền bạn muốn nạp</p>
            </div>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Main Form */}
          <div className="lg:col-span-2">
            <Card>
              <CardHeader>
                <CardTitle>Thông tin nạp tiền</CardTitle>
                <CardDescription>
                  Nhập số tiền bạn muốn nạp vào ví
                </CardDescription>
              </CardHeader>
              <CardContent>
                <Formik
                  initialValues={{
                    amount: ''
                  }}
                  validationSchema={DepositValidationSchema}
                  onSubmit={handleSubmit}
                >
                  {({ values, errors, touched, isSubmitting, setFieldValue }) => (
                    <>
                      <Form className="space-y-6">
                        {/* Amount Input */}
                        <div className="space-y-4">
                          <Label htmlFor="amount" className="text-base font-medium">
                            Số tiền nạp *
                          </Label>

                          <div className="space-y-3">
                            <div className="relative">
                              <Banknote className="absolute left-3 top-1/2 transform -translate-y-1/2 h-5 w-5 text-muted-foreground" />
                              <Field name="amount">
                                {({ field }) => (
                                  <Input
                                    id="amount"
                                    type="text"
                                    placeholder="Tối thiểu 10.000 VNĐ, Tối đa 50.000.000 VNĐ"
                                    className={`pl-10 text-lg ${errors.amount && touched.amount ? "border-destructive" : ""}`}
                                    disabled={isSubmitting}
                                    value={
                                      field.value === '' ? '' : `${formatCurrency(field.value)}`
                                    }
                                    onChange={(e) => {
                                      const raw = e.target.value.replace(/[^0-9]/g, '') // remove commas and non-digits
                                      const parsed = parseInt(raw || '0', 10)
                                      if (parsed > 50000000) {
                                        setFieldValue('amount', 50000000)
                                      } else {
                                        setFieldValue('amount', parsed)
                                      }
                                    }}
                                  />
                                )}
                              </Field>
                            </div>
                            <ErrorMessage name="amount">
                              {(msg) => (
                                <Alert variant="destructive" className="py-2">
                                  <AlertCircle className="h-4 w-4" />
                                  <AlertDescription>{msg}</AlertDescription>
                                </Alert>
                              )}
                            </ErrorMessage>
                          </div>

                          {/* Quick Amount Selection */}
                          <div className="space-y-2">
                            <p className="text-sm text-muted-foreground">Chọn nhanh:</p>
                            <div className="grid grid-cols-2 sm:grid-cols-3 gap-2">
                              {AMOUNT_OPTIONS.map((option) => (
                                <Button
                                  key={option.value}
                                  type="button"
                                  variant="outline"
                                  size="sm"
                                  className="h-10"
                                  onClick={() => setFieldValue('amount', option.value)}
                                >
                                  {option.label}
                                </Button>
                              ))}
                            </div>
                          </div>
                        </div>

                        {/* Submit Button */}
                        <Button
                          type="submit"
                          className="w-full h-12 text-lg font-medium"
                          disabled={isSubmitting || !values.amount}
                        >
                          {isSubmitting || isDepositing ? (
                            <>
                              <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2"></div>
                              Đang xử lý...
                            </>
                          ) : (
                            <>
                              <Check className="mr-2 h-5 w-5" />
                              Xác nhận nạp tiền
                            </>
                          )}
                        </Button>
                      </Form>

                      {/* Sidebar - Moved inside Formik to access values */}
                      <div className="lg:hidden mt-6">
                        <div className="space-y-6">
                          {/* Current Balance */}
                          <Card>
                            <CardHeader>
                              <CardTitle className="flex items-center gap-2">
                                <Wallet className="h-5 w-5 text-blue-600" />
                                Số dư hiện tại
                              </CardTitle>
                            </CardHeader>
                            <CardContent>
                              {isWalletLoading ? (
                                <div className="animate-pulse">
                                  <div className="h-8 bg-gray-200 rounded mb-2"></div>
                                  <div className="h-4 bg-gray-200 rounded w-3/4"></div>
                                </div>
                              ) : (
                                <div>
                                  <div className="text-2xl font-bold text-gray-900 mb-1">
                                    {formatCurrency(wallet?.balance)}
                                  </div>
                                  <p className="text-sm text-gray-600">
                                    Số dư khả dụng trong ví
                                  </p>
                                </div>
                              )}
                            </CardContent>
                          </Card>
                          {/* Security Notice */}
                          <Card className="border-blue-200 bg-blue-50">
                            <CardContent className="pt-6">
                              <div className="flex items-start gap-3">
                                <Shield className="h-5 w-5 text-blue-600 mt-0.5" />
                                <div>
                                  <h3 className="font-medium text-blue-900 mb-1">
                                    Giao dịch qua cổng thanh toán VNPay
                                  </h3>
                                  <p className="text-sm text-blue-700">
                                    Hỗ trợ thanh toán qua tài khoản ngân hàng nội địa, thẻ thanh toán quốc tế và ứng dụng VNPay.
                                  </p>
                                </div>
                              </div>
                            </CardContent>
                          </Card>
                        </div>
                      </div>
                    </>
                  )}
                </Formik>
              </CardContent>
            </Card>
          </div>

          {/* Desktop Sidebar */}
          <div className="hidden lg:block space-y-6">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Wallet className="h-5 w-5 text-blue-600" />
                  Số dư hiện tại
                </CardTitle>
              </CardHeader>
              <CardContent>
                {isWalletLoading ? (
                  <div className="animate-pulse">
                    <div className="h-8 bg-gray-200 rounded mb-2"></div>
                    <div className="h-4 bg-gray-200 rounded w-3/4"></div>
                  </div>
                ) : (
                  <div>
                    <div className="text-2xl font-bold text-gray-900 mb-1">
                      {formatCurrency(wallet?.balance)}
                    </div>
                    <p className="text-sm text-gray-600">
                      Số dư khả dụng trong ví
                    </p>
                  </div>
                )}
              </CardContent>
            </Card>

            {/* Security Notice */}
            <Card className="border-blue-200 bg-blue-50">
              <CardContent >
                <div className="flex items-start gap-3">
                  <Shield className="size-20 text-blue-600" />
                  <div>
                    <h3 className="font-medium text-blue-900 mb-1">
                      Giao dịch qua cổng thanh toán VNPay
                    </h3>
                    <p className="text-sm text-blue-700">
                      Hỗ trợ thanh toán qua tài khoản ngân hàng nội địa, thẻ thanh toán quốc tế và ứng dụng VNPay.
                    </p>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </div>
  )
}

export default WalletDeposit