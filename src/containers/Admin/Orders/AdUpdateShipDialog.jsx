import { Dialog, DialogClose, DialogContent, DialogFooter, DialogTrigger, DialogHeader, DialogTitle, DialogDescription } from "@/components/ui/dialog"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Ship, ChevronsUpDown, Check } from "lucide-react"
import { useEffect, useState } from "react"
import { toast } from "sonner"
import { useUpdateShippingMutation } from "@/services/gshopApi"
import { createTracking, getAllCouriers } from "@/services/trackingMoreService"
import { Popover, PopoverTrigger, PopoverContent } from "@/components/ui/popover"
import { Command, CommandEmpty, CommandGroup, CommandInput, CommandItem, CommandList } from "@/components/ui/command"
import { cn } from "@/lib/utils"

export const AdUpdateShipDialog = ({ orderId }) => {
  const [couriers, setCouriers] = useState([])
  const [loadingCouriers, setLoadingCouriers] = useState(false)
  const [errorCouriers, setErrorCouriers] = useState("")
  const [selectedCourier, setSelectedCourier] = useState(null)
  const [open, setOpen] = useState(false)
  const [form, setForm] = useState({ name: 'FEDEX', orderCode: '', trackingNumber: '' })
  const [updateShipping, { isLoading: isUpdateLoading }] = useUpdateShippingMutation()
 console.log(selectedCourier)

  // Normalize courier logo URL: trim spaces, add https: for protocol-less URLs, remove encoded spaces
  const sanitizeLogoUrl = (url) => {
    if (!url) return ''
    let u = String(url).trim()
    // Handle protocol-less URLs like //s.trackingmore.com/...
    if (u.startsWith('//')) u = `https:${u}`
    // If it's a path or other format, prefix https:
    else if (!/^https?:/i.test(u)) u = `https:${u}`
    // Remove encoded and raw spaces that appear in some logo paths
    u = u.replace(/%20/g, '').replace(/\s+/g, '')
    return u
  }
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
      .then(() => {
        toast.success('Cập nhật thông tin giao hàng thành công')
        setOpen(false)
        setForm({ name: selectedCourier?.courier_code || '', orderCode: '', trackingNumber: '' })
        createTracking({
          tracking_number: form.trackingNumber,
          courier_code: selectedCourier?.courier_code || '',
        })
      })
    } catch (err) {
      toast.error(err?.data?.message || err?.message || 'Cập nhật thất bại')
    }
  }

  useEffect(() => {
    let mounted = true
    const fetchCouriers = async () => {
      try {
        setLoadingCouriers(true)
        setErrorCouriers("")
        const res = await getAllCouriers()
        console.log(res)
        const list = Array.isArray(res?.data?.data?.[0]) ? res.data.data[0] : (Array.isArray(res?.data?.data) ? res.data.data : [])
        console.log(list)
        if (mounted) setCouriers(list)
      } catch {
        if (mounted) setErrorCouriers('Không thể tải danh sách hãng vận chuyển')
      } finally {
        if (mounted) setLoadingCouriers(false)
      }
    }
    fetchCouriers()
    return () => { mounted = false }
  }, [])

  return (
    <div>
      <Dialog open={open} onOpenChange={setOpen}>
        <DialogTrigger asChild>
          <Button size="sm" className="bg-blue-600 hover:bg-blue-700">
            <Ship className="h-4 w-4 mr-2" />
            Cập nhật thông tin giao hàng
          </Button>
        </DialogTrigger>
        <DialogContent
          showCloseButton
          className="sm:max-w-2xl md:max-w-3xl lg:max-w-4xl"
          onInteractOutside={(e) => {
            // Keep dialog open when interacting with portal content such as Popover/Command
            e.preventDefault()
          }}
        >
          <DialogHeader>
            <DialogTitle>Cập nhật thông tin giao hàng</DialogTitle>
            <DialogDescription>
              Nhập thông tin vận chuyển và mã vận đơn để cập nhật: bao gồm Hãng vận chuyển, Order Code và Tracking Number.
            </DialogDescription>
          </DialogHeader>

          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
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

              {/* Carrier combobox moved to bottom and span full width */}
              <div className="space-y-1 md:col-span-3">
                <Label>Hãng vận chuyển</Label>
                <Popover>
                  <PopoverTrigger asChild>
                    <Button
                      type="button"
                      variant="outline"
                      role="combobox"
                      className="w-full justify-between"
                      disabled={loadingCouriers}
                    >
                      {selectedCourier ? selectedCourier.courier_name : (loadingCouriers ? 'Đang tải...' : 'Chọn hãng vận chuyển')}
                      <ChevronsUpDown className="h-4 w-4 opacity-50" />
                    </Button>
                  </PopoverTrigger>
                  <PopoverContent
                    className="max-w-[600px] w-full p-0"
                    onEscapeKeyDown={(e) => e.stopPropagation()}
                    align="start"
                    avoidCollisions={false}
                  >
                    <Command onKeyDown={(e) => { if (e.key === 'Enter') e.preventDefault() }}>
                      <CommandList className="pointer-events-auto order-1">
                        {errorCouriers ? (
                          <CommandEmpty>{errorCouriers}</CommandEmpty>
                        ) : (
                          <>
                            <CommandEmpty>Không tìm thấy.</CommandEmpty>
                            <CommandGroup>
                              {couriers.map((c) => (
                                <CommandItem
                                  key={c.courier_code}
                                  value={c.courier_name}
                                  onSelect={() => {
                                    setSelectedCourier(c)
                                    setForm((prev) => ({ ...prev, name: (c.courier_code || c.courier_name || '') }))
                                  }}
                                >
                                  <div className="flex items-center gap-2">
                                    {c.courier_logo ? (
                                      <img
                                        src={sanitizeLogoUrl(c.courier_logo)}
                                        alt={c.courier_name}
                                        className="h-6 w-6 rounded-sm object-contain"
                                        loading="lazy"
                                        onError={(e) => { e.currentTarget.style.display = 'none' }}
                                      />
                                    ) : null}
                                    <div className="flex flex-col text-left">
                                      <span className="font-medium">{c.courier_name}</span>
                                      <span className="text-xs text-muted-foreground">{c.courier_code}</span>
                                    </div>
                                  </div>
                                  <Check className={cn('ml-auto', selectedCourier?.courier_code === c.courier_code ? 'opacity-100' : 'opacity-0')} />
                                </CommandItem>
                              ))}
                            </CommandGroup>
                          </>
                        )}
                      </CommandList>
                      <CommandInput
                        placeholder="Tìm hãng vận chuyển..."
                        className="h-9 order-2"
                        onKeyDown={(e) => { if (e.key === 'Enter') e.preventDefault() }}
                      />
                    </Command>
                  </PopoverContent>
                </Popover>
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