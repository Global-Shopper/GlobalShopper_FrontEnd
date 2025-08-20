import React from 'react'
import { Formik, Form, Field, ErrorMessage } from 'formik'
import * as Yup from 'yup'
import { useNavigate, Link } from 'react-router-dom'
import { toast } from 'sonner'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card'
import { Alert, AlertDescription } from '@/components/ui/alert'
import { Textarea } from '@/components/ui/textarea'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import { ArrowLeft, AlertCircle, Shield, Check, Banknote, Wallet, BanknoteArrowDown } from 'lucide-react'
import { AMOUNT_OPTIONS } from '@/const/amount'
import { useCreateWithdrawRequestMutation, useGetBankAccountQuery, useGetWalletQuery } from '@/services/gshopApi'

// Validation schema
const WithdrawValidationSchema = Yup.object().shape({
  amount: Yup.number()
    .min(10000, 'Số tiền tối thiểu là 10.000 VNĐ')
    .max(50000000, 'Số tiền tối đa là 50.000.000 VNĐ')
    .required('Vui lòng nhập số tiền (Tối thiểu 10.000 VNĐ, Tối đa 50.000.000 VNĐ)'),
  reason: Yup.string()
    .trim()
    .required('Vui lòng nhập lý do rút tiền'),
  bankAccountId: Yup.string().required('Vui lòng chọn tài khoản ngân hàng'),
})

const WalletWithdraw = () => {
  const navigate = useNavigate()
  const [createWithdraw, { isLoading: isSubmittingWithdraw }] = useCreateWithdrawRequestMutation()
  const { data: wallet, isLoading: isWalletLoading } = useGetWalletQuery()
  const { data: bankAccounts, isLoading: isBankAccountLoading } = useGetBankAccountQuery()

  const formatCurrency = (amount) => `${new Intl.NumberFormat('vi-VN').format(amount || 0)}`

  const handleSubmit = async (values, { setSubmitting, resetForm }) => {
    try {
      await createWithdraw({
        reason: values.reason,
        amount: values.amount,
        bankAccountId: values.bankAccountId,
      }).unwrap()
      toast.success('Gửi yêu cầu rút tiền thành công', {
        description: 'Yêu cầu của bạn đã được gửi. Vui lòng chờ quản trị viên xử lý.',
      })
      resetForm()
      navigate('/account-center/wallet')
    } catch (error) {
      toast.error('Gửi yêu cầu rút tiền thất bại', {
        description: error?.data?.message || 'Đã xảy ra lỗi khi gửi yêu cầu. Vui lòng thử lại sau.',
      })
    } finally {
      setSubmitting(false)
    }
  }

  const handleBack = () => {
    navigate('/account-center/wallet')
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
              <Banknote className="h-6 w-6 text-blue-600" />
            </div>
            <div>
              <h1 className="text-2xl font-bold text-gray-900">Tạo yêu cầu rút tiền</h1>
              <p className="text-gray-600">Nhập số tiền, tài khoản nhận và lý do rút tiền</p>
            </div>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Main Form */}
          <div className="lg:col-span-2">
            <Card>
              <CardHeader>
                <CardTitle>Thông tin rút tiền</CardTitle>
                <CardDescription>Vui lòng điền đầy đủ thông tin bên dưới</CardDescription>
              </CardHeader>
              <CardContent>
                <Formik
                  initialValues={{ amount: '', reason: '', bankAccountId: '' }}
                  validationSchema={WithdrawValidationSchema}
                  onSubmit={handleSubmit}
                >
                  {({ values, errors, touched, isSubmitting, setFieldValue }) => (
                    <>
                      <Form className="space-y-6">
                        {/* Amount */}
                        <div className="space-y-4">
                          <Label htmlFor="amount" className="text-base font-medium">
                            Số tiền rút (VNĐ) *
                          </Label>
                          <div className="space-y-3">
                            <div className="relative">
                              <BanknoteArrowDown className="absolute left-3 top-1/2 transform -translate-y-1/2 h-5 w-5 text-muted-foreground" />
                              <Field name="amount">
                                {({ field }) => (
                                  <Input
                                    id="amount"
                                    type="text"
                                    placeholder="Tối thiểu 10.000 VNĐ, Tối đa 50.000.000 VNĐ"
                                    className={`pl-10 text-lg ${errors.amount && touched.amount ? 'border-destructive' : ''}`}
                                    disabled={isSubmitting}
                                    value={field.value === '' ? '' : `${formatCurrency(field.value)}`}
                                    onChange={(e) => {
                                      const raw = e.target.value.replace(/[^0-9]/g, '')
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

                          {/* Quick Amounts */}
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

                        {/* Bank Account */}
                        <div className="space-y-2">
                          <Label htmlFor="bankAccountId" className="text-base font-medium">
                            Tài khoản ngân hàng nhận *
                          </Label>
                          <Field name="bankAccountId">
                            {({ field }) => (
                              <Select
                                value={field.value}
                                onValueChange={(v) => setFieldValue('bankAccountId', v)}
                                disabled={isSubmitting || isBankAccountLoading || !Array.isArray(bankAccounts) || bankAccounts.length === 0}
                              >
                                <SelectTrigger id="bankAccountId">
                                  <SelectValue placeholder={isBankAccountLoading ? 'Đang tải tài khoản...' : 'Chọn tài khoản nhận'} />
                                </SelectTrigger>
                                <SelectContent>
                                  {Array.isArray(bankAccounts) && bankAccounts.map((acc) => {
                                    const last4 = acc.bankAccountNumber ? acc.bankAccountNumber.slice(-4) : ''
                                    return (
                                      <SelectItem key={acc.id} value={acc.id}>
                                        {acc.providerName} • ****{last4} • {acc.accountHolderName}
                                      </SelectItem>
                                    )
                                  })}
                                </SelectContent>
                              </Select>
                            )}
                          </Field>
                          <ErrorMessage name="bankAccountId">
                            {(msg) => (
                              <Alert variant="destructive" className="py-2">
                                <AlertCircle className="h-4 w-4" />
                                <AlertDescription>{msg}</AlertDescription>
                              </Alert>
                            )}
                          </ErrorMessage>
                          {Array.isArray(bankAccounts) && bankAccounts.length === 0 && !isBankAccountLoading && (
                            <div className="text-sm text-muted-foreground">
                              Chưa có tài khoản ngân hàng. Vui lòng thêm trong trang
                              {' '}<Link className="underline" to="/account-center/wallet">Quản lý ví</Link>.
                            </div>
                          )}
                        </div>

                        {/* Reason */}
                        <div className="space-y-2">
                          <Label htmlFor="reason" className="text-base font-medium">
                            Lý do rút tiền *
                          </Label>
                          <Field name="reason">
                            {({ field }) => (
                              <Textarea
                                id="reason"
                                placeholder="Mô tả ngắn gọn lý do rút tiền"
                                rows={4}
                                disabled={isSubmitting}
                                className={errors.reason && touched.reason ? 'border-destructive' : ''}
                                {...field}
                              />
                            )}
                          </Field>
                          <ErrorMessage name="reason">
                            {(msg) => (
                              <Alert variant="destructive" className="py-2">
                                <AlertCircle className="h-4 w-4" />
                                <AlertDescription>{msg}</AlertDescription>
                              </Alert>
                            )}
                          </ErrorMessage>
                        </div>

                        {/* Submit */}
                        <Button
                          type="submit"
                          className="w-full h-12 text-lg font-medium"
                          disabled={
                            isSubmitting ||
                            isSubmittingWithdraw ||
                            !values.amount ||
                            !values.reason ||
                            !values.bankAccountId
                          }
                        >
                          {isSubmitting || isSubmittingWithdraw ? (
                            <>
                              <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2"></div>
                              Đang gửi yêu cầu...
                            </>
                          ) : (
                            <>
                              <Check className="mr-2 h-5 w-5" />
                              Xác nhận rút tiền
                            </>
                          )}
                        </Button>
                      </Form>

                      {/* Mobile Sidebar */}
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
                                  <p className="text-sm text-gray-600">Số dư khả dụng trong ví</p>
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
                                  <h3 className="font-medium text-blue-900 mb-1">Thông tin bảo mật</h3>
                                  <p className="text-sm text-blue-700">
                                    Yêu cầu rút tiền sẽ được xử lý bởi quản trị viên và chuyển khoản tới tài khoản ngân hàng bạn đã chọn.
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
                    <p className="text-sm text-gray-600">Số dư khả dụng trong ví</p>
                  </div>
                )}
              </CardContent>
            </Card>

            {/* Security Notice */}
            <Card className="border-blue-200 bg-blue-50">
              <CardContent>
                <div className="flex items-start gap-3">
                  <Shield className="size-20 text-blue-600" />
                  <div>
                    <h3 className="font-medium text-blue-900 mb-1">Thông tin bảo mật</h3>
                    <p className="text-sm text-blue-700">
                      Yêu cầu rút tiền sẽ được xử lý bởi quản trị viên và chuyển khoản tới tài khoản ngân hàng bạn đã chọn.
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

export default WalletWithdraw