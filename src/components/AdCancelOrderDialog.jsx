import React from 'react'
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle, DialogTrigger } from './ui/dialog';
import { Button } from './ui/button';
import { useCancelOrderMutation } from '@/services/gshopApi';
import { DialogClose } from './ui/dialog';
import { toast } from 'sonner';
import { Formik, Form, Field, ErrorMessage } from 'formik';
import * as Yup from 'yup';
import { Input } from './ui/input';

const AdCancelOrderDialog = ({ order }) => {
  const [cancelOrder, { isLoading: isCancelLoading }] = useCancelOrderMutation()
  const [open, setOpen] = React.useState(false);

  const validationSchema = Yup.object({
    rejectionReason: Yup.string()
      .trim()
      .required('Vui lòng nhập lý do.')
      .min(10, 'Cần ít nhất 10 ký tự.'),
  });
  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger>
        <Button
          disabled={isCancelLoading}
          className="bg-red-400 hover:bg-red-500 w-full"
        >
          {isCancelLoading ? "Đang hủy..." : "Hủy đơn hàng"}
        </Button>
      </DialogTrigger>
      <DialogContent>
        <Formik
          initialValues={{ rejectionReason: '' }}
          validationSchema={validationSchema}
          onSubmit={async (values, { setSubmitting, resetForm }) => {
            try {
              await cancelOrder({
                orderId: order.id,
                payload: { rejectionReason: values.rejectionReason.trim() },
              }).unwrap();
              toast.success('Đơn hàng đã được hủy thành công.');
              setOpen(false);
              resetForm();
            } catch (error) {
              const message = error?.data?.message || error?.error || error?.message || 'Có lỗi xảy ra.';
              toast.error(`Lỗi khi hủy đơn hàng: ${message}`);
            } finally {
              setSubmitting(false);
            }
          }}
        >
          {({ isSubmitting, isValid, dirty }) => {
            return (
              <Form>
                <DialogHeader>
                  <DialogTitle>Yêu cầu hoàn tiền</DialogTitle>
                  <DialogDescription>
                    Xem xét yêu cầu hoàn tiền
                  </DialogDescription>
                  <Field
                    as={Input}
                    name="rejectionReason"
                    placeholder="Nhập lý do hủy đơn hàng (tối thiểu 10 ký tự)"
                    disabled={isCancelLoading || isSubmitting}
                  />
                  <ErrorMessage name="rejectionReason" component="div" className="text-sm text-red-500 mt-1" />
                </DialogHeader>
                <DialogFooter className="mt-4">
                  <Button
                    type="submit"
                    disabled={!isValid || !dirty || isSubmitting || isCancelLoading}
                    className="bg-red-500 hover:bg-red-600"
                  >
                    {isSubmitting || isCancelLoading ? 'Đang hủy...' : 'Xác nhận hủy'}
                  </Button>
                  <DialogClose>
                    <Button type="button">Đóng</Button>
                  </DialogClose>
                </DialogFooter>
              </Form>
            );
          }}
        </Formik>
      </DialogContent>
    </Dialog>
  )
}

export default AdCancelOrderDialog