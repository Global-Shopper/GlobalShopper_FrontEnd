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
import { formatCurrency } from "@/utils/formatCurrency"
import _ from "lodash"

export function AdConfirmRefundDialog({ type, refundId, totalPrice = 0, initialPercentage = 100, reason }) {
  const [approveRefund, { isLoading: isApproveLoading }] = useApproveRefundMutation()
  const [rejectRefund, { isLoading: isRejectLoading }] = useRejectRefundMutation()
  const presetPercentages = [10, 20, 30, 50, 100]

  const getSuggestedPercentage = (r) => {
    switch (r) {
      case "Giao nhầm sản phẩm (sai loại hàng).":
        return 100
      case "Sản phẩm bị vỡ, móp méo do vận chuyển.":
        return 80
      case "Sản phẩm bị lỗi kỹ thuật, hỏng hóc.":
        return 70
      case "Sản phẩm không đúng mẫu mã, màu sắc, kích thước.":
        return 60
      case "Sản phẩm nhận được khác biệt so với hình ảnh hoặc mô tả trên website/app.":
        return 50
      case "Thiếu phụ kiện đi kèm hoặc thiếu linh kiện.":
        return 30
      default:
        return null
    }
  }
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
                {/* Quick select percentages */}
                <div className="space-y-2">
                  {reason && (
                    <div className="text-xs text-gray-600">
                      Lý do: <span className="font-medium text-gray-800">{reason}</span>
                      {getSuggestedPercentage(reason) != null && (
                        <span className="ml-2 inline-flex items-center rounded-full bg-amber-100 px-2 py-0.5 text-amber-700 text-[11px]">
                          Khuyến nghị: {getSuggestedPercentage(reason)}%
                        </span>
                      )}
                    </div>
                  )}
                  <div className="flex flex-wrap gap-2">
                    {_.sortBy(presetPercentages.concat(getSuggestedPercentage(reason))).map((pct) => (
                      <Button
                        key={pct}
                        type="button"
                        variant="outline"
                        className={pct === getSuggestedPercentage(reason) ? "!text-amber-500" : ""}
                        onClick={() => {
                          setFieldValue('percentage', pct)
                          const amt = Math.round(((Number(totalPrice) || 0) * pct) / 100)
                          setFieldValue('amount', amt)
                        }}
                      >
                        {console.log(values.percentage)}
                        {pct}%
                      </Button>
                    ))}
                  </div>
                </div>
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
