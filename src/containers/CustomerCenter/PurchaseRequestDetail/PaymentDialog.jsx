import React, { useMemo, useState } from 'react'
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog'
import { useCheckoutMutation, useCreateShipmentMutation, useDirectCheckoutMutation, useGetShipmentRateQuery, useGetWalletQuery } from '@/services/gshopApi';
import { toast } from 'sonner';
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group';
import { Label } from '@/components/ui/label';
import { formatCurrency } from '@/utils/formatCurrency';
import { getLocaleCurrencyFormat } from '@/utils/formatCurrency';
import { REDIRECT_URI } from '@/const/urlconst';
import { getFedexCreateShipPayload, getFedexRatePayload } from '@/utils/fedexPayload';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';

const PaymentDialog = ({ subRequest, expired, requestType }) => {
  console.log(requestType)
  const { data: wallet } = useGetWalletQuery()
  const [checkout, { isLoading: isCheckoutLoading }] = useCheckoutMutation();
  const [directCheckout, { isLoading: isDirectCheckoutLoading }] = useDirectCheckoutMutation();
  console.log(subRequest?.quotationForPurchase?.packageType)
  const { data: rate } = useGetShipmentRateQuery({inputJson: getFedexRatePayload(
    subRequest?.quotationForPurchase?.totalWeightEstimate,
    subRequest?.quotationForPurchase?.shipper,
    subRequest?.quotationForPurchase?.recipient,
    "VND",
    subRequest?.quotationForPurchase?.packageType
  )})
  const [createShipment, { isLoading: isCreateShipmentLoading }] = useCreateShipmentMutation();
  const [open, setOpen] = useState(false)
  const [method, setMethod] = useState('wallet') // 'wallet' | 'vnpay'
  const [selectedRateType, setSelectedRateType] = useState(null)
  const rateReplyDetails = rate?.output?.rateReplyDetails
  console.log(subRequest)
  const totalAmount = useMemo(() => {
    const q = subRequest?.quotationForPurchase
    if (!q) return 0
    return (q.totalPriceEstimate || 0) + (q.shippingEstimate || 0)
  }, [subRequest])

  const handleConfirm = async () => {
    try {
      if (method === 'wallet') {
        await checkout(
          {
            subRequestId: subRequest?.id,
            totalPriceEstimate: totalAmount
          }
        ).unwrap()
        .then(() => {
          toast.success('Thanh toán thành công')
          setOpen(false)
        })
      } else {
        await directCheckout(
          {
            subRequestId: subRequest?.id,
            totalPriceEstimate: totalAmount,
            redirectUri: `${REDIRECT_URI}/account-center/orders/:id`
          }
        ).unwrap()
        .then((res) => {
          window.location.href = res?.url
          setOpen(false)
        })
      }
      if (requestType === "OFFLINE") {
        await createShipment(
          {
            inputJson: getFedexCreateShipPayload(
              subRequest?.quotationForPurchase?.totalWeightEstimate,
              subRequest?.quotationForPurchase?.shipper,
              subRequest?.quotationForPurchase?.recipient,
              "VND",
              selectedRateType,
              subRequest?.quotationForPurchase?.packageType
            )
          }
        ).unwrap()
        .then(() => {
          toast.success('Thanh toán thành công')
          setOpen(false)
        })
      }
    } catch (error) {
      toast.error('Thanh toán thất bại', {
        description: error?.data?.message || 'Đã xảy ra lỗi khi thanh toán. Vui lòng thử lại sau.',
      })
    }
  }

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <button
          className={`mt-2 px-4 py-2 rounded shadow ${expired
            ? 'bg-gray-300 text-gray-500 cursor-not-allowed'
            : 'bg-gradient-to-r from-green-500 to-green-600 text-white hover:from-green-600 hover:to-green-700'
            }`}
          onClick={() => setOpen(true)}
          disabled={expired}
        >
          {expired ? 'Đã hết hạn thanh toán' : `Thanh toán ${formatCurrency(totalAmount, "VND", getLocaleCurrencyFormat("VND"))}`}
        </button>
      </DialogTrigger>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Thanh toán</DialogTitle>
          <DialogDescription>
            Chọn phương thức thanh toán
          </DialogDescription>
        </DialogHeader>
        <div className="mb-3 text-sm">
          Số tiền cần thanh toán: <span className="font-semibold">{formatCurrency(totalAmount, 'VND', getLocaleCurrencyFormat('VND'))}</span>
        </div>
        <div className="mb-3 text-sm">
          Số dư ví GSHOP: <span className="font-semibold">{formatCurrency(wallet?.balance, 'VND', getLocaleCurrencyFormat('VND'))}</span>
        </div>
        {
          requestType === "OFFLINE" && <Select value={selectedRateType} onValueChange={setSelectedRateType}>
          <SelectTrigger>
            <SelectValue placeholder="Chọn loại phí" >{selectedRateType || "Chọn loại vận chuyển"}</SelectValue>
          </SelectTrigger>
          <SelectContent>
          {console.log(rateReplyDetails)}
          {rateReplyDetails?.map((rate, index) => (

            <SelectItem key={index} value={rate?.serviceType}>{rate?.serviceName} - {formatCurrency(rate?.ratedShipmentDetails.find((detail) => detail.rateType === "PREFERRED_CURRENCY")?.totalNetChargeWithDutiesAndTaxes, 'VND', getLocaleCurrencyFormat('VND'))}</SelectItem>
          ))}
          </SelectContent>
        </Select>}
        <RadioGroup value={method} onValueChange={setMethod}>
          <div className="flex items-center space-x-2">
            <RadioGroupItem value="wallet" id="wallet" />
            <Label htmlFor="wallet">Thanh toán qua ví GSHOP</Label>
          </div>
          <div className="flex items-center space-x-2">
            <RadioGroupItem value="vnpay" id="vnpay" />
            <Label htmlFor="vnpay">Thanh toán qua VNPay</Label>
          </div>
        </RadioGroup>
        <div className="mt-4 flex justify-end gap-2">
          <button
            className="px-4 py-2 rounded border border-gray-300 text-gray-700 hover:bg-gray-50"
            onClick={() => setOpen(false)}
          >
            Hủy
          </button>
          <button
            className={`px-4 py-2 rounded text-white ${method === 'wallet' ? 'bg-green-600 hover:bg-green-700' : 'bg-blue-600 hover:bg-blue-700'}`}
            onClick={handleConfirm}
            disabled={expired || isCheckoutLoading || isDirectCheckoutLoading}
          >
            {method === 'wallet' ? (isCheckoutLoading ? 'Đang xử lý...' : 'Xác nhận thanh toán bằng Ví') : (isDirectCheckoutLoading ? 'Đang xử lý...' : 'Xác nhận thanh toán VNPay')}
          </button>
        </div>
      </DialogContent>
    </Dialog>
  )
}

export default PaymentDialog