import React, { useState } from 'react'
import { Dialog, DialogClose, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog'
import { Button } from '@/components/ui/button'
import { useRepayOrderMutation } from '@/services/gshopApi'
import { REDIRECT_URI } from '@/const/urlconst'
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group'
import { Label } from '@/components/ui/label'
import { toast } from 'sonner'

const RepaymentDialog = ({ order }) => {
  const [paymentMethod, setPaymentMethod] = useState('wallet')
  const [repayOrder] = useRepayOrderMutation()
  const handleConfirm = () => {
    repayOrder({
      orderId: order.id,
      redirectUri: `${REDIRECT_URI}/account-center/orders/:id`,
      paymentMethod
    }).unwrap()
      .then((res) => {
        toast.success('Thanh toán lại đơn hàng thành công')
        window.location.href = res?.url
      })
      .catch(() => {
        toast.error('Thanh toán lại đơn hàng thất bại')
      })
  }
  return (
    <Dialog>
      <DialogTrigger>
        <Button>
          Thanh toán lại
        </Button>
      </DialogTrigger>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Thanh toán lại</DialogTitle>
          <DialogDescription>
            Bạn có chắc chắn muốn thanh toán lại đơn hàng này không?
          </DialogDescription>
          <RadioGroup value={paymentMethod} onValueChange={setPaymentMethod}>
            <div className="flex items-center space-x-2">
              <RadioGroupItem value="wallet" id="wallet" />
              <Label htmlFor="wallet">Thanh toán qua ví GSHOP</Label>
            </div>
            <div className="flex items-center space-x-2">
              <RadioGroupItem value="vnpay" id="vnpay" />
              <Label htmlFor="vnpay">Thanh toán qua VNPay</Label>
            </div>
          </RadioGroup>
        </DialogHeader>
        <DialogFooter>
          <DialogClose asChild>
            <Button variant="outline">Cancel</Button>
          </DialogClose>
          <Button onClick={handleConfirm}>Thanh toán lại</Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  )
}

export default RepaymentDialog