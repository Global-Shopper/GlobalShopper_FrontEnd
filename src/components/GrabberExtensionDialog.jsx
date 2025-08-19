import { Copy, ExternalLink } from 'lucide-react'
import React from 'react'
import { Dialog, DialogClose, DialogContent, DialogFooter, DialogHeader, DialogTitle } from "@/components/ui/dialog"
import { Button } from "@/components/ui/button"
import { setGrabberExtensionDialogOpen } from '@/features/app'
import { useDispatch, useSelector } from 'react-redux'
import { useNavigate } from 'react-router-dom'
import { setCurrentStep, setItemsFromExtension } from '@/features/onlineReq'

const GrabberExtensionDialog = ({ items }) => {
  const open = useSelector((state) => state.rootReducer.app.grabberExtensionDialogOpen)
  const dispatch = useDispatch()
  const navigate = useNavigate()
  const onClose = () => {
    dispatch(setGrabberExtensionDialogOpen(false))
  }
  const handleAddProducts = () => {
    dispatch(setGrabberExtensionDialogOpen(false))
    dispatch(setCurrentStep('linkInput'))
    dispatch(setItemsFromExtension(items))
    navigate('/create-request/with-link')
  }
  return (
    <Dialog open={open} onOpenChange={onClose}>
      <DialogContent showCloseButton={false} className="sm:max-w-2xl md:max-w-3xl lg:max-w-4xl">
      <DialogHeader>
          <div className="flex items-center gap-2">
            <Copy className="h-4 w-4 mr-2" />
            <p className="text-lg font-medium">Xác nhận các sản phẩm trong giỏ tiện ích</p>
          </div>
      </DialogHeader>
      <div className="mt-2 max-h-[60vh] overflow-y-auto space-y-3 pr-1">
        {Array.isArray(items) && items.length > 0 ? (
          items.map((item, idx) => {
            const name = item?.name || ''
            const link = item?.url || item?.link || ''
            const image = item?.mainImage || ''
            const provider = (() => { try { return new URL(link).hostname } catch { return '' } })()
            return (
              <div key={item?.url || item?.id || `${name}-${idx}`} className="flex gap-4 p-3 border rounded-md">
                <div className="w-20 h-20 bg-muted/40 rounded overflow-hidden flex items-center justify-center flex-shrink-0">
                  {image ? (
                    <img src={image} alt={name || 'product'} className="w-full h-full object-contain" />
                  ) : (
                    <span className="text-xs text-muted-foreground">No image</span>
                  )}
                </div>
                <div className="min-w-0 flex-1">
                  <a
                    href={link}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-sm font-medium hover:underline break-words"
                    title={name}
                  >
                    {name || link}
                  </a>
                  <div className="text-xs text-gray-500 mt-1 break-all">{provider}</div>
                  {link && (
                    <div className="mt-1">
                      <a
                        href={link}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="inline-flex items-center gap-1 text-xs text-blue-600 hover:underline"
                      >
                        Mở liên kết
                        <ExternalLink className="h-3 w-3" />
                      </a>
                    </div>
                  )}
                </div>
              </div>
            )
          })
        ) : (
          <div className="p-6 text-center text-sm text-muted-foreground">
            Không có sản phẩm trong giỏ tiện ích
          </div>
        )}
      </div>
      <DialogFooter>
        <DialogClose>
          <Button className="bg-gray-600 hover:bg-gray-700">Đóng</Button>
        </DialogClose>
        <DialogClose>
          <Button className="bg-blue-600 hover:bg-blue-700" onClick={handleAddProducts}>Thêm sản phẩm vào yêu cầu mua hàng</Button>
        </DialogClose>
      </DialogFooter>
      </DialogContent>
    </Dialog>
  )
}

export default GrabberExtensionDialog