import React, { useState } from 'react'
import { Button } from '@/components/ui/button'
import { Dialog, DialogClose, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog'
import { Textarea } from '@/components/ui/textarea'
import { Rating, RatingButton } from '@/components/ui/shadcn-io/rating'
import { useCreateFeedbackMutation } from '@/services/gshopApi'
import { toast } from 'sonner'
import { Star } from 'lucide-react'
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group'

const OrderFeedbackDialog = ({ order }) => {
  const [createFeedback] = useCreateFeedbackMutation()
  const [fbRating, setFbRating] = useState(5)
  const [fbContent, setFbContent] = useState('')
  const [preset, setPreset] = useState('')

  if (!order) return null

  const handleCreateFeedback = () => {
    createFeedback({
      orderId: order.id,
      rating: fbRating,
      comment: fbContent,
    })
      .unwrap()
      .then(() => {
        toast.success('Gửi đánh giá thành công')
      })
      .catch((error) => {
        toast.error('Gửi đánh giá thất bại')
        console.error(error)
      })
  }

  const handlePresetChange = (value) => {
    setPreset(value)
    if (value === 'other') {
      setFbContent('')
      return
    }
    const map = {
      accurate: 'Sản phẩm đúng mô tả',
      packaging: 'Đóng gói cẩn thận',
      fast: 'Giao hàng nhanh',
      support: 'Hỗ trợ nhiệt tình',
      quality: 'Chất lượng tốt',
      late: 'Giao hàng chậm',
      damaged: 'Hàng bị hư hại',
    }
    setFbContent(map[value] || '')
  }

  return (
    <Dialog>
      <DialogTrigger>
        <Button variant="outline">
          <Star className="w-4 h-4 mr-2" />
          Đánh giá
        </Button>
      </DialogTrigger>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Feedback</DialogTitle>
          <DialogDescription className="sr-only">
            Gửi đánh giá cho đơn hàng #{order?.id}
          </DialogDescription>
        </DialogHeader>

        {order.feedback ? (
          <div className="space-y-2">
            <div className="text-sm font-medium">Đánh giá</div>
            <div className="text-yellow-500">{order.feedback?.rating}★</div>
            <div className="text-sm font-medium">Nội dung</div>
            <div className="text-sm">{order.feedback?.comment}</div>
          </div>
        ) : (
          <>
            <div className="space-y-2">
              <div className="text-sm font-medium">Đánh giá</div>
              <Rating onValueChange={setFbRating} value={fbRating}>
                {Array.from({ length: 5 }).map((_, index) => (
                  <RatingButton className="text-yellow-500" key={index} />
                ))}
              </Rating>
            </div>

            <div className="space-y-2">
              <div className="text-sm font-medium">Chọn nhận xét</div>
              <RadioGroup value={preset} onValueChange={handlePresetChange}>
                <label className="flex items-center gap-2">
                  <RadioGroupItem value="accurate" />
                  <span>Sản phẩm đúng mô tả</span>
                </label>
                <label className="flex items-center gap-2">
                  <RadioGroupItem value="packaging" />
                  <span>Đóng gói cẩn thận</span>
                </label>
                <label className="flex items-center gap-2">
                  <RadioGroupItem value="fast" />
                  <span>Giao hàng nhanh</span>
                </label>
                <label className="flex items-center gap-2">
                  <RadioGroupItem value="support" />
                  <span>Hỗ trợ nhiệt tình</span>
                </label>
                <label className="flex items-center gap-2">
                  <RadioGroupItem value="quality" />
                  <span>Chất lượng tốt</span>
                </label>
                <label className="flex items-center gap-2">
                  <RadioGroupItem value="late" />
                  <span>Giao hàng chậm</span>
                </label>
                <label className="flex items-center gap-2">
                  <RadioGroupItem value="damaged" />
                  <span>Hàng bị hư hại</span>
                </label>
                <label className="flex items-center gap-2">
                  <RadioGroupItem value="other" />
                  <span>Khác…</span>
                </label>
              </RadioGroup>
            </div>

            {preset === 'other' && (
              <div className="space-y-2">
                <div className="text-sm font-medium">Nội dung</div>
                <Textarea
                  placeholder="Nhập cảm nhận của bạn…"
                  value={fbContent}
                  onChange={(e) => setFbContent(e.target.value)}
                  rows={5}
                />
              </div>
            )}

            <DialogFooter>
              <DialogClose>
                <Button variant="outline">
                  Đóng
                </Button>
              </DialogClose>
              <DialogClose>
                <Button onClick={handleCreateFeedback} disabled={preset === '' || (preset === 'other' && !fbContent.trim())}>
                  Gửi
                </Button>
              </DialogClose>
            </DialogFooter>
          </>
        )}
      </DialogContent>
    </Dialog>
  )
}

export default OrderFeedbackDialog