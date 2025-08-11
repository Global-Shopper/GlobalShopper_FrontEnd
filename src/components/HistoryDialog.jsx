import React from 'react'
import { Dialog, DialogClose, DialogContent, DialogFooter, DialogTrigger } from "@/components/ui/dialog"
import { Button } from "@/components/ui/button"
import HistoryTimeline from './HistoryTimeline'

const HistoryDialog = ({ history }) => {
  return (
    <Dialog>
      <DialogTrigger>
        <Button className="bg-blue-600 hover:bg-blue-700">Xem lịch sử trạng thái</Button>
      </DialogTrigger>
      <DialogContent showCloseButton={false} className="sm:max-w-2xl md:max-w-3xl lg:max-w-4xl">
        <HistoryTimeline history={history} />
        <DialogFooter>
          <DialogClose>
            <Button>Đóng</Button>
          </DialogClose>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  )
}

export default HistoryDialog