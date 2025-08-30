import React, { useRef, useState } from 'react'
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle, DialogClose } from '@/components/ui/dialog'
import { Button } from '@/components/ui/button'
import { Textarea } from '@/components/ui/textarea'
import { Label } from '@/components/ui/label'
import { toast } from 'sonner'
import { useProcessWithdrawRequestNewPhaseMutation, useUploadBillMutation } from '@/services/gshopApi'
import { getQRCodeUrl } from '@/services/bankService'

const AdWithdrawDetailDialog = ({ open, setOpen, withdraw }) => {
  const [processWithdrawRequestNewPhase, { isLoading: isProcessNewPhaseLoading }] = useProcessWithdrawRequestNewPhaseMutation()
  const [uploadBill, { isLoading: isUploadLoading }] = useUploadBillMutation()

  const [reason, setReason] = useState('')
  const fileInputRef = useRef(null)

  const bank = withdraw?.bankAccount
  const qrUrl = bank && withdraw?.amount
    ? getQRCodeUrl(
        bank.bankAccountNumber,
        bank.accountHolderName,
        bank.providerName,
        withdraw.amount,
        withdraw.reason || `RUT_${withdraw?.id}`,
      )
    : null

  const handleProcess = async (isApproved) => {
    if (!withdraw?.id) return
    try {
      await processWithdrawRequestNewPhase({
        id: withdraw.id,
        params: { isApproved, reason: reason || undefined },
      }).unwrap()
      toast.success(isApproved ? 'Phê duyệt yêu cầu rút tiền thành công.' : 'Từ chối yêu cầu rút tiền thành công.')
    } catch (err) {
      toast.error('Xử lý yêu cầu rút tiền thất bại', {
        description: err?.data?.message || 'Vui lòng thử lại.',
      })
    }
  }

  const onClickUpload = () => fileInputRef.current?.click()

  const handleFileChange = async (e) => {
    const file = e.target.files?.[0]
    if (!file || !withdraw?.id) return
    try {
      await uploadBill({ id: withdraw.id, data: { file } }).unwrap()
      toast.success('Tải lên hóa đơn ngân hàng thành công.')
    } catch (err) {
      toast.error('Tải lên hóa đơn thất bại', {
        description: err?.data?.message || 'Vui lòng thử lại.',
      })
    } finally {
      // reset input value to allow re-uploading same file if needed
      if (fileInputRef.current) fileInputRef.current.value = ''
    }
  }
  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogContent className="min-w-[800px]">
        <DialogHeader>
          <DialogTitle>Chi tiết yêu cầu rút tiền</DialogTitle>
          <DialogDescription>
            {withdraw ? (
              <>
                Mã rút: {withdraw.id}
              </>
            ) : (
              '—'
            )}
          </DialogDescription>
        </DialogHeader>
        {/* Body */}
        {withdraw ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div className="space-y-2">
              <div className="text-sm font-medium text-gray-700">QR chuyển khoản</div>
              {qrUrl ? (
                <div className="border rounded-lg p-2 bg-white">
                  <img src={qrUrl} alt="VietQR" className="w-full h-auto object-contain" />
                </div>
              ) : (
                <div className="text-sm text-gray-500">Thiếu thông tin để tạo QR</div>
              )}
              <div className="text-xs text-gray-600">
                Người nhận: {bank?.accountHolderName || '-'}
              </div>
              <div className="text-xs text-gray-600">
                STK: {bank?.bankAccountNumber || '-'} ({bank?.providerName || '-'})
              </div>
              <div className="text-xs text-gray-600">
                Số tiền: {Number(withdraw.amount || 0).toLocaleString('vi-VN')} đ
              </div>
              <div className="text-xs text-gray-600">
                Lý do: {withdraw.reason || '-'}
              </div>
            </div>
            <div className="space-y-2">
              <div className="text-sm font-medium text-gray-700">Hóa đơn ngân hàng</div>
              {withdraw.bankingBill ? (
                <a href={withdraw.bankingBill} target="_blank" rel="noreferrer" className="block border rounded-lg overflow-hidden bg-white">
                  <img src={withdraw.bankingBill} alt="Bank bill" className="w-full h-64 object-contain" />
                </a>
              ) : (
                <div className="text-sm text-gray-500">Chưa có hóa đơn</div>
              )}
              {
                withdraw.status === 'APPROVED' && <div className="pt-2">
                <input
                  ref={fileInputRef}
                  type="file"
                  accept="image/*,application/pdf"
                  onChange={handleFileChange}
                  className="hidden"
                  disabled={isUploadLoading}
                />
                <Button onClick={onClickUpload} disabled={isUploadLoading} variant="outline">
                  {isUploadLoading ? 'Đang tải lên...' : (withdraw.bankingBill ? 'Cập nhật hóa đơn' : 'Tải lên hóa đơn')}
                </Button>
                <div className="text-xs text-gray-500 mt-1">Chấp nhận hình ảnh hoặc PDF.</div>
              </div>}
              {withdraw.status === 'PENDING' && <div className="pt-3 space-y-2">
                <Label htmlFor="process-reason" className="text-sm font-medium text-gray-700">Ghi chú xử lý (tùy chọn)</Label>
                <Textarea
                  id="process-reason"
                  placeholder="Nhập ghi chú hoặc lý do..."
                  value={reason}
                  onChange={(e) => setReason(e.target.value)}
                  rows={3}
                />
              </div>}
            </div>
          </div>
        ) : (
          <div className="text-sm text-gray-500">Không có dữ liệu yêu cầu.</div>
        )}
        <DialogFooter className="flex items-center gap-2">
          <DialogClose asChild>
            <Button variant="outline">Đóng</Button>
          </DialogClose>
          {withdraw?.status === 'PENDING' && 
          <>
            <Button
              variant="destructive"
              onClick={() => handleProcess(false)}
              disabled={isProcessNewPhaseLoading || !withdraw}
            >
              {isProcessNewPhaseLoading ? 'Đang xử lý...' : 'Từ chối'}
            </Button>
            <Button
              className="bg-green-600 hover:bg-green-700"
              onClick={() => handleProcess(true)}
              disabled={isProcessNewPhaseLoading || !withdraw}
            >
              {isProcessNewPhaseLoading ? 'Đang xử lý...' : 'Phê duyệt'}
            </Button>
          </>
          }
        </DialogFooter>
      </DialogContent>
    </Dialog>
  )
}

export default AdWithdrawDetailDialog