import React from 'react'
import { Dialog, DialogClose, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog"
import { Button } from "@/components/ui/button"
import { SendHorizonal } from 'lucide-react'
import { toast } from "sonner";
import { useRequestUpdatePurchaseRequestMutation } from "@/services/gshopApi";
import { Label } from './ui/label';
import { Textarea } from './ui/textarea';
import * as Yup from "yup";
import { Formik, Form, Field, ErrorMessage } from "formik";
import { useState } from "react";

const RequestUpdatePRDialog = ({ purchaseRequest }) => {
  console.log(purchaseRequest);
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [requestUpdate, { isLoading: isRequestUpdateLoading }] = useRequestUpdatePurchaseRequestMutation();
  const validateSchema = Yup.object({
    reason: Yup.string().required("Lý do không được để trống").min(10, "Lý do phải có ít nhất 10 ký tự"),
  });
  const handleRequestUpdate = async (values) => {
    try {
      await requestUpdate({ subRequestId: purchaseRequest.id, reason: values.reason }).unwrap()
        .then(() => {
          toast.success("Yêu cầu đã được yêu cầu khách hàng cập nhật thông tin thành công.");
          setIsDialogOpen(false);
        });
    } catch (error) {
      toast.error(`Lỗi khi yêu cầu khách hàng cập nhật thông tin: ${error.message}`);
    }
  };
  return (
    <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
      <DialogTrigger asChild>
        <Button className="bg-blue-600 hover:bg-blue-700">
          <SendHorizonal className="h-4 w-4 mr-2" />
          Yêu cầu cập nhật thông tin</Button>
      </DialogTrigger>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Yêu cầu khách hàng cập nhật thông tin</DialogTitle>
          <DialogDescription>
            Nhập lý do và hướng dẫn khách hàng cập nhật thông tin
          </DialogDescription>
        </DialogHeader>
        <Formik
          initialValues={{ reason: "" }}
          validationSchema={validateSchema}
          onSubmit={async (values) => await handleRequestUpdate(values)}
        >
          {({ handleChange, errors, touched }) => (
            <Form className="space-y-2">
              <Label htmlFor="reason">Lý do</Label>
              <Field name="reason">
                {({ meta }) => (
                  <Textarea
                    id="reason"
                    placeholder="Nhập lý do"
                    aria-invalid={meta.touched && meta.error ? "true" : undefined}
                    onChange={handleChange}
                  />
                )}
              </Field>       
              {touched.reason && errors.reason && (<ErrorMessage name="reason" component="div" className="text-red-500" />)}

              <DialogFooter>
                <DialogClose asChild>
                  <Button variant="outline" type="button">Hủy</Button>
                </DialogClose>
                <Button className="bg-blue-600 hover:bg-blue-700" type="submit" disabled={isRequestUpdateLoading}>Yêu cầu</Button>
              </DialogFooter>
            </Form>
          )}
        </Formik>
      </DialogContent>
    </Dialog>
  )
}

export default RequestUpdatePRDialog