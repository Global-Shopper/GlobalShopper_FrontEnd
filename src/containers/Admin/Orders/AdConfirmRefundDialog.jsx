import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog"
import { Button } from "@/components/ui/button"
import { useApproveRefundMutation } from "@/services/gshopApi"
import { useRejectRefundMutation } from "@/services/gshopApi"
import { Formik, Form } from "formik"
import { toast } from "sonner"
import { Input } from "@/components/ui/input"
import { Slider } from "@/components/ui/slider"
import { formatCurrency } from "@/utils/formatCurrency"

export function AdConfirmRefundDialog({ type, refundId, totalPrice = 0, initialPercentage = 100 }) {
  const [approveRefund, { isLoading: isApproveLoading }] = useApproveRefundMutation()
  const [rejectRefund, { isLoading: isRejectLoading }] = useRejectRefundMutation()
  const handleApproveRefund = async (values, { setSubmitting }) => {
    try {
      const percentage = Number(values.percentage ?? 0)
      await approveRefund({ refundId, data: { refundRate: percentage / 100 } }).unwrap()
      toast.success("Yêu cầu hoàn tiền đã được chấp nhận.")
    } catch (error) {
      toast.error(`Lỗi khi chấp nhận yêu cầu hoàn tiền: ${error?.data?.message || error.message}`)
    } finally {
      setSubmitting(false)
    }
  };
  const handleRejectRefund = async (values, { setSubmitting }) => {
    try {
      const reason = values.reason?.trim() || ""
      await rejectRefund({ refundId, data: { reason } }).unwrap()
      toast.success("Yêu cầu hoàn tiền đã được từ chối.")
    } catch (error) {
      toast.error(`Lỗi khi từ chối yêu cầu hoàn tiền: ${error?.data?.message || error.message}`)
    } finally {
      setSubmitting(false)
    }
  };
  return (
    <AlertDialog>
      <AlertDialogTrigger asChild>
        <Button className={type === "approve" ? "bg-green-600 hover:bg-green-700" : "bg-red-600 hover:bg-red-700"}>{type === "approve" ? "Chấp nhận" : "Từ chối"}</Button>
      </AlertDialogTrigger>
      <AlertDialogContent>
        {type === "approve" ? (
          <Formik
            initialValues={{
              percentage: initialPercentage,
              amount: Math.round((Number(totalPrice) || 0) * (initialPercentage / 100)),
            }}
            enableReinitialize
            onSubmit={handleApproveRefund}
          >
            {({ values, setFieldValue, handleSubmit, isSubmitting }) => (
              <Form onSubmit={handleSubmit} className="space-y-4">
                <AlertDialogHeader>
                  <AlertDialogTitle>Bạn có chắc chắn muốn chấp nhận yêu cầu hoàn tiền</AlertDialogTitle>
                  <AlertDialogDescription>
                    Chọn phần trăm số tiền hoàn lại cho khách hàng
                  </AlertDialogDescription>
                </AlertDialogHeader>
                <div className="space-y-1">
                  <div className="text-sm font-medium text-gray-700">Số tiền xử lý</div>
                  <div className="flex items-center gap-2">
                    <Input
                      type="number"
                      name="amount"
                      value={values.amount}
                      min={0}
                      max={totalPrice}
                      onChange={(e) => {
                        let amt = Number(e.target.value)
                        if (Number.isNaN(amt)) amt = 0
                        amt = Math.max(0, Math.min(amt, Number(totalPrice) || 0))
                        const pct = (Number(totalPrice) || 0) > 0 ? Math.round((amt / Number(totalPrice)) * 100) : 0
                        setFieldValue('amount', amt)
                        setFieldValue('percentage', pct)
                      }}
                    />
                    <span className="text-xs text-gray-600">{formatCurrency(values.amount || 0, "VND", "vn")}</span>
                  </div>
                </div>
                <div className="flex items-center gap-3 w-[100px]">
                  <Input
                    type="number"
                    name="percentage"
                    value={values.percentage}
                    min={0}
                    max={100}
                    step={1}
                    onChange={(e) => {
                      let v = Number(e.target.value)
                      if (Number.isNaN(v)) v = 0
                      v = Math.max(0, Math.min(100, v))
                      setFieldValue('percentage', v)
                      const amt = Math.round(((Number(totalPrice) || 0) * v) / 100)
                      setFieldValue('amount', amt)
                    }}
                  />
                  <span className="text-sm text-gray-600">%</span>
                </div>
                <Slider
                  value={[values.percentage]}
                  onValueChange={(v) => {
                    const v0 = v[0]
                    setFieldValue('percentage', v0)
                    const amt = Math.round(((Number(totalPrice) || 0) * v0) / 100)
                    setFieldValue('amount', amt)
                  }}
                  max={100}
                  step={1}
                />
                <AlertDialogFooter>
                  <AlertDialogCancel disabled={isSubmitting || isApproveLoading}>Đóng</AlertDialogCancel>
                  <Button type="submit" disabled={isSubmitting || isApproveLoading}>
                    Chấp nhận
                  </Button>
                </AlertDialogFooter>
              </Form>
            )}
          </Formik>
        ) : (
          <Formik initialValues={{ reason: "" }} onSubmit={handleRejectRefund}>
            {({ values, handleChange, handleSubmit, isSubmitting }) => (
              <Form onSubmit={handleSubmit} className="space-y-4">
                <AlertDialogHeader>
                  <AlertDialogTitle>Bạn có chắc chắn muốn từ chối yêu cầu hoàn tiền</AlertDialogTitle>
                  <AlertDialogDescription>
                    Vui lòng nhập lý do từ chối
                  </AlertDialogDescription>
                </AlertDialogHeader>
                <Input
                  type="text"
                  name="reason"
                  placeholder="Lý do từ chối"
                  value={values.reason}
                  onChange={handleChange}
                />
                <AlertDialogFooter>
                  <AlertDialogCancel disabled={isSubmitting || isRejectLoading}>Đóng</AlertDialogCancel>
                  <AlertDialogAction type="submit" disabled={isSubmitting || isRejectLoading || !values.reason.trim()}>
                    Từ chối
                  </AlertDialogAction>
                </AlertDialogFooter>
              </Form>
            )}
          </Formik>
        )}
      </AlertDialogContent>
    </AlertDialog>
  )
}
