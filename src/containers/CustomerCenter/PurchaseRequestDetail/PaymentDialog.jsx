import React, { useEffect, useMemo, useState } from 'react'
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
import { useNavigate } from 'react-router-dom';

const PaymentDialog = ({ subRequest, expired, requestType, quotationForPurchase }) => {
  const navigate = useNavigate()
  const { data: wallet, isLoading: isWalletLoading } = useGetWalletQuery()
  const [checkout, { isLoading: isCheckoutLoading }] = useCheckoutMutation();
  const [directCheckout, { isLoading: isDirectCheckoutLoading }] = useDirectCheckoutMutation();
  const shouldFetchRate = requestType === 'OFFLINE' && !!quotationForPurchase;
  const { data: rate, isLoading: isRateLoading } = useGetShipmentRateQuery(
    shouldFetchRate
      ? {
          inputJson: getFedexRatePayload(
            subRequest?.quotationForPurchase?.totalWeightEstimate,
            subRequest?.quotationForPurchase?.shipper,
            subRequest?.quotationForPurchase?.recipient,
            'VND',
            subRequest?.quotationForPurchase?.packageType
          ),
        }
      : undefined,
    { skip: !shouldFetchRate }
  )
  const [createShipment, { isLoading: isCreateShipmentLoading }] = useCreateShipmentMutation();
  const [open, setOpen] = useState(false)
  const [method, setMethod] = useState('wallet') // 'wallet' | 'vnpay'
  const [selectedRateType, setSelectedRateType] = useState(null)
  useEffect(() => {
    if (requestType !== 'OFFLINE') {
      setSelectedRateType(null);
    }
  }, [requestType])
  const rateReplyDetails = rate?.output?.rateReplyDetails
  const totalAmount = useMemo(() => {
    const q = subRequest?.quotationForPurchase
    if (!q) return 0
    return (q.totalPriceEstimate || 0)
  }, [subRequest])

  // Selected shipping cost derived from FedEx rateReplyDetails
  const selectedService = useMemo(() => {
    if (!selectedRateType || !Array.isArray(rateReplyDetails)) return null;
    return rateReplyDetails.find((r) => r?.serviceType === selectedRateType) || null;
  }, [selectedRateType, rateReplyDetails])

  const selectedShipCost = useMemo(() => {
    if (!selectedService) return null;
    const preferred = selectedService?.ratedShipmentDetails?.find((d) => d?.rateType === 'PREFERRED_CURRENCY');
    return preferred?.totalNetChargeWithDutiesAndTaxes ?? null;
  }, [selectedService])

  // Aggregated loading states for UX
  const isProcessingPayment = isCheckoutLoading || isDirectCheckoutLoading || isCreateShipmentLoading;
  const isBusy = isWalletLoading || isRateLoading || isProcessingPayment;
  const onlineShipCost = subRequest?.quotationForPurchase?.shippingEstimate ?? null;

  const handleConfirm = async () => {
    try {
      if (requestType === 'OFFLINE' && (!selectedRateType || selectedShipCost == null)) {
        toast.error('Vui lòng chọn loại vận chuyển trước khi thanh toán.');
        return;
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
          .then(async (res) => {
            if (method === 'wallet') {
              await checkout(
                {
                  subRequestId: subRequest?.id,
                  totalPriceEstimate: totalAmount + selectedShipCost,
                  shippingFee: selectedShipCost,
                  trackingNumber: res?.output?.transactionShipments[0]?.masterTrackingNumber
                }
              ).unwrap()
                .then((res) => {
                  toast.success('Thanh toán thành công')
                  setOpen(false)
                  navigate(`/account-center/orders/${res?.id}`)
                })
            } else {
              await directCheckout(
                {
                  subRequestId: subRequest?.id,
                  totalPriceEstimate: totalAmount + selectedShipCost,
                  redirectUri: `${REDIRECT_URI}/account-center/orders/:id`,
                  shippingFee: selectedShipCost,
                  trackingNumber: res?.output?.transactionShipments[0]?.masterTrackingNumber
                }
              ).unwrap()
                .then((res) => {
                  window.location.href = res?.url
                  setOpen(false)
                })
            }
          })
      }
      else {
        // ONLINE-like flow: use existing shippingEstimate, no shipment creation
        const shippingFee = onlineShipCost || 0;
        const total = totalAmount; // total already includes shippingEstimate for ONLINE
        if (method === 'wallet') {
          await checkout(
            {
              subRequestId: subRequest?.id,
              totalPriceEstimate: total + (shippingFee || 0),
              shippingFee: shippingFee,
            }
          ).unwrap()
            .then((res) => {
              toast.success('Thanh toán thành công')
              setOpen(false)
              navigate(`/account-center/orders/${res?.id}`)
            })
        } else {
          await directCheckout(
            {
              subRequestId: subRequest?.id,
              totalPriceEstimate: total + (shippingFee || 0),
              redirectUri: `${REDIRECT_URI}/account-center/orders/:id`,
              shippingFee: shippingFee,
            }
          ).unwrap()
            .then((res) => {
              window.location.href = res?.url
              setOpen(false)
            })
        }
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
        {
          subRequest.status === "QUOTED" || subRequest.status === "PAID" ? (
            <button
              className={`mt-2 px-4 py-2 rounded shadow ${expired
                ? 'bg-gray-300 text-gray-500 cursor-not-allowed'
                : 'bg-gradient-to-r from-green-500 to-green-600 text-white hover:from-green-600 hover:to-green-700'
                }`}
              onClick={() => setOpen(true)}
              disabled={expired}
            >
              {expired ? 'Đã hết hạn thanh toán' : `Thanh toán`}
            </button>
          ) : null}
      </DialogTrigger>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Thanh toán</DialogTitle>
          <DialogDescription>
            Chọn phương thức thanh toán
          </DialogDescription>
        </DialogHeader>
        <div className="mb-3 text-sm">
          Số dư ví GSHOP: <span className="font-semibold">{isWalletLoading ? 'Đang tải...' : formatCurrency((wallet?.balance ?? 0), 'VND', getLocaleCurrencyFormat('VND'))}</span>
        </div>
        {Array.isArray(subRequest?.requestItems) && subRequest.requestItems.length > 0 && (
          <div className="mb-4">
            <div className="text-sm font-semibold mb-2">Chi tiết từng mặt hàng</div>
            <ul className="space-y-1">
              {subRequest.requestItems.map((item) => (
                <li key={item.id} className="flex justify-between text-sm">
                  <span className="break-words">{item.productName}</span>
                  <span className="font-medium">
                    {formatCurrency(item?.quotationDetail?.totalVNDPrice || 0, 'VND', getLocaleCurrencyFormat('VND'))}
                  </span>
                </li>
              ))}
            </ul>
          </div>
        )}
        {quotationForPurchase?.fees?.map((fee) => (
          <div className="mb-3 text-sm flex justify-between">
            <span>{fee.feeName}</span>
            <span className="font-medium">{formatCurrency(fee.amount, fee.currency, getLocaleCurrencyFormat(fee.currency))}</span>
          </div>
        ))}
        {(requestType === 'OFFLINE' ? selectedShipCost != null : onlineShipCost != null) && (
          <div className="mb-3 text-sm flex justify-between">
            <span>Phí vận chuyển{requestType === 'OFFLINE' && selectedService?.serviceName ? ` (${selectedService.serviceName})` : ''}</span>
            <span className="font-medium">{formatCurrency(requestType === 'OFFLINE' ? selectedShipCost : onlineShipCost, 'VND', getLocaleCurrencyFormat('VND'))}</span>
          </div>
        )}
        {
          requestType === "OFFLINE" && <Select value={selectedRateType} onValueChange={setSelectedRateType} disabled={isRateLoading || isProcessingPayment}>
            <SelectTrigger className={!selectedRateType && !isRateLoading ? 'border border-amber-500' : undefined}>
              <SelectValue placeholder={isRateLoading ? "Đang tải biểu phí..." : "Chọn loại phí"} >{selectedRateType ? `${selectedRateType} - ${formatCurrency(rateReplyDetails.find((rate) => rate.serviceType === selectedRateType)?.ratedShipmentDetails.find((detail) => detail.rateType === "PREFERRED_CURRENCY")?.totalNetChargeWithDutiesAndTaxes, 'VND', getLocaleCurrencyFormat('VND'))}` : (isRateLoading ? 'Đang tải biểu phí...' : "Chọn loại vận chuyển")}</SelectValue>
            </SelectTrigger>
            <SelectContent>
              {rateReplyDetails?.map((rate, index) => (

                <SelectItem key={index} value={rate?.serviceType}>{rate?.serviceName} - {formatCurrency(rate?.ratedShipmentDetails.find((detail) => detail.rateType === "PREFERRED_CURRENCY")?.totalNetChargeWithDutiesAndTaxes, 'VND', getLocaleCurrencyFormat('VND'))}</SelectItem>
              ))}
            </SelectContent>
          </Select>}
        {requestType === 'OFFLINE' && !isRateLoading && !selectedRateType && (
          <p className="mt-1 text-xs text-amber-600">Vui lòng chọn loại vận chuyển để tiếp tục thanh toán.</p>
        )}
        {(requestType === 'OFFLINE' ? selectedShipCost != null : onlineShipCost != null) && (
          <div className="mt-2 text-sm flex justify-between border-t pt-2 font-semibold">
            <span>Tổng thanh toán</span>
            <span>{formatCurrency(requestType === 'OFFLINE' ? (totalAmount + selectedShipCost) : totalAmount + onlineShipCost, 'VND', getLocaleCurrencyFormat('VND'))}</span>
          </div>
        )}
        <RadioGroup value={method} onValueChange={setMethod}>
          <div className="flex items-center space-x-2">
            <RadioGroupItem value="wallet" id="wallet" disabled={isBusy} />
            <Label htmlFor="wallet">Thanh toán qua ví GSHOP</Label>
          </div>
          <div className="flex items-center space-x-2">
            <RadioGroupItem value="vnpay" id="vnpay" disabled={isBusy} />
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
            disabled={expired || isBusy || (requestType === 'OFFLINE' && (!selectedRateType || selectedShipCost == null))}
          >
            {isBusy ? 'Đang xử lý...' : (method === 'wallet' ? 'Xác nhận thanh toán bằng Ví' : 'Xác nhận thanh toán VNPay')}
          </button>
        </div>
      </DialogContent>
    </Dialog>
  )
}

export default PaymentDialog