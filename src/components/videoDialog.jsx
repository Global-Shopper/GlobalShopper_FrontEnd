import React from 'react'
import { Dialog, DialogClose, DialogTrigger, DialogContent } from '@/components/ui/dialog'

const VideoDialog = ({ url }) => {
  return (
    <Dialog>
      <DialogTrigger>
        <video controls src={url} className="w-20 h-20 object-contain rounded-lg border" />
      </DialogTrigger>
      <DialogContent>
        <video controls src={url} className="w-full h-full object-contain rounded-lg border" />
      </DialogContent>
      <DialogClose />
    </Dialog>
  )
}

export default VideoDialog