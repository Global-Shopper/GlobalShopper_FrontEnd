import React from 'react'
import { Dialog, DialogClose, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { useDeleteHSCodeMutation } from '@/services/gshopApi';

const DeleteHSCodeConfirmDIalog = ({node, open, onOpenChange}) => {
  const [deleteHSCode] = useDeleteHSCodeMutation()
  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle>Xóa mã HS {node}?</DialogTitle>
          <DialogDescription>
            Bạn có chắc chắn muốn xóa mã HS này không?
          </DialogDescription>
        </DialogHeader>
        <DialogFooter>
          <DialogClose asChild>
            <Button variant="outline">Hủy</Button>
          </DialogClose>
          <DialogClose asChild>
            <Button variant="destructive" onClick={() => deleteHSCode(node)}>Xóa</Button>
          </DialogClose>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  )
}

export default DeleteHSCodeConfirmDIalog