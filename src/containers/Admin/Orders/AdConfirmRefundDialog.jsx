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
import _ from "lodash"
import { formatCurrency } from "@/utils/formatCurrency"

export function AdConfirmRefundDialog({ type, refundOrder, totalPrice }) {
  const [approveRefund, { isLoading: isApproveLoading }] = useApproveRefundMutation()
  const [rejectRefund, { isLoading: isRejectLoading }] = useRejectRefundMutation()
  const handleApproveRefund = async () => {
    try {
      console.log(refundOrder)
      await approveRefund({ refundId: refundOrder?.id, data: { refundRate: refundOrder?.refundRate } }).unwrap()
      toast.success("Yêu cầu hoàn tiền đã được chấp nhận.")
    } catch (error) {
      toast.error(`Lỗi khi chấp nhận yêu cầu hoàn tiền: ${error?.data?.message || error.message}`)
    }
  };
  const handleRejectRefund = async (values, { setSubmitting }) => {
    try {
      const reason = values.reason?.trim() || ""
      await rejectRefund({ refundId: refundOrder?.id, data: { reason } }).unwrap()
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
          <>
            <AlertDialogHeader>
              <AlertDialogTitle>Bạn có chắc chắn muốn chấp nhận yêu cầu hoàn tiền</AlertDialogTitle>
              <AlertDialogDescription>
                  Số tiền hoàn lại: {formatCurrency(totalPrice * refundOrder?.refundRate || 0, "VND", "vn")}
              </AlertDialogDescription>
            </AlertDialogHeader>
            <AlertDialogFooter>
              <AlertDialogCancel disabled={isApproveLoading}>Đóng</AlertDialogCancel>
              <Button onClick={handleApproveRefund} disabled={isApproveLoading}>
                Chấp nhận
              </Button>
            </AlertDialogFooter>
          </>
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
