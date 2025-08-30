import React, { useState, useRef, useEffect } from 'react'
import { Button } from '@/components/ui/button'
import { Dialog, DialogClose, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog'
import { Textarea } from '@/components/ui/textarea'
import { useCreateRefundMutation } from '@/services/gshopApi'
import { toast } from 'sonner'
import { Upload, X, Loader2 } from 'lucide-react'
import { uploadToCloudinary } from '@/utils/uploadToCloudinary'
import { refundReason } from '@/const/commonReason'
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group'
import { Label } from '@/components/ui/label'

const OrderRefundDialog = ({ order, open, onOpenChange }) => {
  const [createRefund] = useCreateRefundMutation()
  const [selectedReason, setSelectedReason] = useState('')
  const [customReason, setCustomReason] = useState('')
  const [localImages, setLocalImages] = useState([]) // blob preview URLs
  const [uploadedUrls, setUploadedUrls] = useState([]) // Cloudinary URLs aligned by index
  const [isUploading, setIsUploading] = useState(false)
  const [localVideos, setLocalVideos] = useState([])
  const [uploadedVideoUrls, setUploadedVideoUrls] = useState([])
  const [isUploadingVideo, setIsUploadingVideo] = useState(false)
  const fileInputRef = useRef()
  const localImagesRef = useRef([])
  const videoInputRef = useRef()
  const localVideosRef = useRef([])

  // Track latest localImages in a ref for unmount cleanup
  useEffect(() => {
    localImagesRef.current = localImages
  }, [localImages])

  // Track latest localVideos in a ref for unmount cleanup
  useEffect(() => {
    localVideosRef.current = localVideos
  }, [localVideos])

  // Cleanup object URLs on unmount only
  useEffect(() => {
    return () => {
      localImagesRef.current.forEach((u) => {
        if (u && typeof u === 'string' && u.startsWith('blob:')) {
          try { URL.revokeObjectURL(u) } catch (e) { console.warn('revokeObjectURL failed', e) }
        }
      })
    }
  }, [])

  // Cleanup video object URLs on unmount
  useEffect(() => {
    return () => {
      localVideosRef.current.forEach((u) => {
        if (u && typeof u === 'string' && u.startsWith('blob:')) {
          try { URL.revokeObjectURL(u) } catch (e) { console.warn('revokeObjectURL failed', e) }
        }
      })
    }
  }, [])

  const handleImageUpload = async (event) => {
    const files = Array.from(event.target.files || [])
    if (!files.length) return
    // validations
    for (const file of files) {
      if (!file.type?.startsWith('image/')) {
        toast.error('Vui lòng chọn file hình ảnh')
        return
      }
      if (file.size > 10 * 1024 * 1024) {
        toast.error('Kích thước file không được vượt quá 10MB')
        return
      }
    }
    const newPreviews = files.map((f) => URL.createObjectURL(f))
    const startIdx = localImages.length
    setLocalImages((prev) => [...prev, ...newPreviews])
    setUploadedUrls((prev) => [...prev, ...new Array(files.length).fill(null)])
    setIsUploading(true)
    try {
      for (let i = 0; i < files.length; i++) {
        const url = await uploadToCloudinary(files[i])
        if (url) {
          setUploadedUrls((prev) => {
            const copy = [...prev]
            copy[startIdx + i] = url
            return copy
          })
        }
      }
    } catch (err) {
      console.error(err)
      toast.error('Có lỗi xảy ra khi tải ảnh lên. Vui lòng thử lại.')
    } finally {
      setIsUploading(false)
    }
  }

  const handleVideoUpload = async (event) => {
    const files = Array.from(event.target.files || [])
    if (!files.length) return
    // validations
    for (const file of files) {
      if (!file.type?.startsWith('video/')) {
        toast.error('Vui lòng chọn file video')
        return
      }
      if (file.size > 100 * 1024 * 1024) {
        toast.error('Kích thước video không được vượt quá 100MB')
        return
      }
    }
    const newPreviews = files.map((f) => URL.createObjectURL(f))
    const startIdx = localVideos.length
    setLocalVideos((prev) => [...prev, ...newPreviews])
    setUploadedVideoUrls((prev) => [...prev, ...new Array(files.length).fill(null)])
    setIsUploadingVideo(true)
    try {
      for (let i = 0; i < files.length; i++) {
        const url = await uploadToCloudinary(files[i], 'video')
        if (url) {
          setUploadedVideoUrls((prev) => {
            const copy = [...prev]
            copy[startIdx + i] = url
            return copy
          })
        }
      }
    } catch (err) {
      console.error(err)
      toast.error('Có lỗi xảy ra khi tải video lên. Vui lòng thử lại.')
    } finally {
      setIsUploadingVideo(false)
    }
  }

  const handleRemoveImage = (idx) => {
    const revoke = localImages[idx]
    if (revoke?.startsWith('blob:')) {
      try { URL.revokeObjectURL(revoke) } catch (e) { console.warn('revokeObjectURL failed', e) }
    }
    setLocalImages((prev) => prev.filter((_, i) => i !== idx))
    setUploadedUrls((prev) => prev.filter((_, i) => i !== idx))
  }

  const handleRemoveVideo = (idx) => {
    const revoke = localVideos[idx]
    if (revoke?.startsWith('blob:')) {
      try { URL.revokeObjectURL(revoke) } catch (e) { console.warn('revokeObjectURL failed', e) }
    }
    setLocalVideos((prev) => prev.filter((_, i) => i !== idx))
    setUploadedVideoUrls((prev) => prev.filter((_, i) => i !== idx))
  }

  const handleCreateRefund = () => {
    const imageEvidence = uploadedUrls.filter(Boolean)
    const videoEvidence = uploadedVideoUrls.filter(Boolean)
    const evidence = [...imageEvidence, ...videoEvidence]
    createRefund({
      orderId: order.id,
      reason: selectedReason === 'Khác (tự nhập)' ? customReason.trim() : selectedReason,
      evidence,
    })
      .unwrap()
      .then(() => {
        toast.success('Gửi yêu cầu hoàn tiền thành công')
        onOpenChange?.(false)
      })
      .catch((error) => {
        toast.error('Gửi yêu cầu hoàn tiền thất bại')
        console.error(error)
      })
  }

  // Guard: don't render dialog content without order
  if (!order) return null

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogTrigger>
        <Button size="sm">Yêu cầu hoàn tiền</Button>
      </DialogTrigger>
      <DialogContent className="!max-w-2xl max-h-[95vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle>Yêu cầu hoàn tiền</DialogTitle>
          <DialogDescription className="sr-only">
            Tạo yêu cầu hoàn tiền cho đơn hàng #{order?.id}
          </DialogDescription>
        </DialogHeader>

        <div className="space-y-2">
          <div className="text-sm font-medium">Nội dung yêu cầu</div>
          <div className="flex flex-wrap gap-3">
            <RadioGroup
              value={selectedReason}
              onValueChange={(val) => {
                setSelectedReason(val)
                if (val !== 'Khác (tự nhập)') setCustomReason('')
              }}
            >
              {refundReason.map((reason, idx) => {
                const id = `refund-reason-${idx}`
                return (
                  <div className="flex items-center gap-2" key={id}>
                    <RadioGroupItem id={id} value={reason} />
                    <Label htmlFor={id} className="cursor-pointer">
                      {reason}
                    </Label>
                  </div>
                )
              })}
            </RadioGroup>
          </div>
          {selectedReason === 'Khác (tự nhập)' && (
            <Textarea
              placeholder="Mô tả lý do hoàn tiền…"
              value={customReason}
              onChange={(e) => setCustomReason(e.target.value)}
              rows={5}
            />
          )}
        </div>

        {/* Image Upload Section */}
        <div className="space-y-2">
          <div className="text-sm font-medium">Hình ảnh minh chứng</div>
          <div className="flex flex-wrap gap-3">
            {localImages.map((url, idx) => (
              <div key={url} className="relative">
                <img src={url} alt={`evidence-${idx + 1}`} className="w-20 h-20 object-contain rounded-lg border" />
                {(isUploading && !uploadedUrls[idx]) && (
                  <div className="absolute inset-0 flex items-center justify-center bg-white/60 rounded-lg">
                    <Loader2 className="h-5 w-5 animate-spin text-blue-500" />
                  </div>
                )}
                <Button
                  type="button"
                  variant="outline"
                  size="sm"
                  onClick={() => handleRemoveImage(idx)}
                  className="absolute -top-2 -right-2 h-6 w-6 p-0 bg-red-500 text-white hover:bg-red-600"
                >
                  <X className="h-3 w-3" />
                </Button>
              </div>
            ))}

            <div>
              <input
                ref={fileInputRef}
                type="file"
                accept="image/*"
                multiple
                onChange={handleImageUpload}
                className="hidden"
                disabled={isUploading}
              />
              <Button
                type="button"
                variant="outline"
                onClick={() => fileInputRef.current?.click()}
                disabled={isUploading}
                className="w-20 h-20 border-dashed border-2 border-gray-300 hover:border-blue-400"
              >
                {isUploading ? (
                  <Loader2 className="h-4 w-4 animate-spin" />
                ) : (
                  <Upload className="h-4 w-4" />
                )}
              </Button>
            </div>
          </div>
        </div>

        {/* Video Upload Section */}
        <div className="space-y-2">
          <div className="text-sm font-medium">Video minh chứng</div>
          <div className="flex flex-wrap gap-3">
            {localVideos.map((url, idx) => (
              <div key={url} className="relative">
                <video controls src={url} className="w-30 h-30 object-contain rounded-lg border" />
                {(isUploadingVideo && !uploadedVideoUrls[idx]) && (
                  <div className="absolute inset-0 flex items-center justify-center bg-white/60 rounded-lg">
                    <Loader2 className="h-5 w-5 animate-spin text-blue-500" />
                  </div>
                )}
                <Button
                  type="button"
                  variant="outline"
                  size="sm"
                  onClick={() => handleRemoveVideo(idx)}
                  className="absolute -top-2 -right-2 h-6 w-6 p-0 bg-red-500 text-white hover:bg-red-600"
                >
                  <X className="h-3 w-3" />
                </Button>
              </div>
            ))}

            <div>
              <input
                ref={videoInputRef}
                type="file"
                accept="video/*"
                multiple
                onChange={handleVideoUpload}
                className="hidden"
                disabled={isUploadingVideo}
              />
              <Button
                type="button"
                variant="outline"
                onClick={() => videoInputRef.current?.click()}
                disabled={isUploadingVideo}
                className="w-20 h-20 border-dashed border-2 border-gray-300 hover:border-blue-400"
              >
                {isUploadingVideo ? (
                  <Loader2 className="h-4 w-4 animate-spin" />
                ) : (
                  <Upload className="h-4 w-4" />
                )}
              </Button>
            </div>
          </div>
        </div>

        <DialogFooter>
          <DialogClose>
            <Button variant="outline">
              Đóng
            </Button>
          </DialogClose>
          <DialogClose>
            <Button onClick={handleCreateRefund} disabled={isUploading || isUploadingVideo}>
              Gửi yêu cầu
            </Button>
          </DialogClose>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  )
}

export default OrderRefundDialog