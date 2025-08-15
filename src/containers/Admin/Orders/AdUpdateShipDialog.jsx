import { Dialog, DialogClose, DialogContent, DialogFooter, DialogTrigger, DialogHeader, DialogTitle, DialogDescription } from "@/components/ui/dialog"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Ship } from "lucide-react"
import { useState } from "react"
import { toast } from "sonner"
import { useUpdateShippingMutation } from "@/services/gshopApi"

export const AdUpdateShipDialog = ({ orderId }) => {
  const [open, setOpen] = useState(false)
  const [form, setForm] = useState({ name: 'FEDEX', orderCode: '', trackingNumber: '' })
  const [updateShipping, { isLoading: isUpdateLoading }] = useUpdateShippingMutation()

  const handleSubmit = async (e) => {
    e.preventDefault()
    if (!orderId) {
      toast.error('Thiếu mã đơn hàng')
      return
    }
    if (!form.trackingNumber) {
      toast.error('Vui lòng nhập mã vận đơn')
      return
    }
    try {
      await updateShipping({ orderId, payload: form }).unwrap()
      toast.success('Cập nhật thông tin giao hàng thành công')
      setOpen(false)
      setForm({ name: 'FEDEX', orderCode: '', trackingNumber: '' })
    } catch (err) {
      toast.error(err?.data?.message || err?.message || 'Cập nhật thất bại')
    }
  }

  return (
    <div>
      <Dialog open={open} onOpenChange={setOpen}>
        <DialogTrigger asChild>
          <Button className="bg-blue-600 hover:bg-blue-700">
            <Ship className="h-4 w-4 mr-2" />
            Cập nhật thông tin giao hàng
          </Button>
        </DialogTrigger>
        <DialogContent showCloseButton className="sm:max-w-2xl md:max-w-3xl lg:max-w-4xl">
          <DialogHeader>
            <DialogTitle>Cập nhật thông tin giao hàng</DialogTitle>
            <DialogDescription>
              Nhập thông tin vận chuyển và mã vận đơn để cập nhật: bao gồm Hãng vận chuyển, Order Code và Tracking Number.
            </DialogDescription>
          </DialogHeader>

          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div className="space-y-1">
                <Label>Hãng vận chuyển</Label>
                <Select
                  value={form.name}
                  onValueChange={(v) => setForm((prev) => ({ ...prev, name: v }))}
                >
                  <SelectTrigger className="w-full">
                    <SelectValue placeholder="Chọn hãng vận chuyển" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="FEDEX">FedEx</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <div className="space-y-1">
                <Label>Order Code</Label>
                <Input
                  value={form.orderCode}
                  onChange={(e) => setForm((p) => ({ ...p, orderCode: e.target.value }))}
                  placeholder="VD: 794899938811"
                  disabled={isUpdateLoading}
                />
              </div>

              <div className="space-y-1">
                <Label>Mã vận đơn (Tracking Number)</Label>
                <Input
                  value={form.trackingNumber}
                  onChange={(e) => setForm((p) => ({ ...p, trackingNumber: e.target.value }))}
                  placeholder="VD: 794899938811"
                  required
                  disabled={isUpdateLoading}
                />
              </div>
            </div>

            <DialogFooter>
              <DialogClose asChild>
                <Button type="button" variant="outline">Đóng</Button>
              </DialogClose>
              <Button type="submit" disabled={isUpdateLoading} className="bg-blue-600 hover:bg-blue-700">
                {isUpdateLoading ? 'Đang cập nhật...' : 'Cập nhật'}
              </Button>
            </DialogFooter>
          </form>
        </DialogContent>
      </Dialog>
    </div>
  )
}