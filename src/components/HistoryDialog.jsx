import React from 'react'
import { Dialog, DialogClose, DialogContent, DialogFooter, DialogTrigger } from "@/components/ui/dialog"
import { Button } from "@/components/ui/button"
import HistoryTimeline from './HistoryTimeline'
import { History } from 'lucide-react'

const HistoryDialog = ({ history }) => {
  return (
    <Dialog>
      <DialogTrigger>
        <Button size="sm" className="bg-blue-600 hover:bg-blue-700 w-full">
          <History className="h-4 w-4 mr-2" />
          Lịch sử trạng thái
        </Button>
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