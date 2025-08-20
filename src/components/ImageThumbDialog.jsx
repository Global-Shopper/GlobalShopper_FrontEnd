import React from 'react'
import { Dialog, DialogTrigger, DialogContent } from "@/components/ui/dialog"

const ImageThumbDialog = ({ images }) => {
  return (
    <Dialog>
      <DialogTrigger asChild>
        <div className="relative w-20 h-20 overflow-hidden rounded-md border">
          <span className="absolute inset-0 bg-black/50 text-white text-xs font-semibold flex items-center justify-center">+{images.length - 1}</span>
        </div>
      </DialogTrigger>
      <DialogContent className="flex sm:max-w-[425px]">
        {
          images.map((image, index) => (
            <img key={index} src={image} alt={`Image ${index + 1}`} className="w-20 h-20 object-contain" />
          ))
        }
      </DialogContent>
    </Dialog>
  )
}

export default ImageThumbDialog