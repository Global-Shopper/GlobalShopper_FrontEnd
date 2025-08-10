import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle, DialogTrigger, DialogClose } from "@/components/ui/dialog"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Tabs, TabsList, TabsTrigger, TabsContent } from "@/components/ui/tabs"
import { toast } from "sonner"
import { useMemo, useState } from "react"
import { ExternalLink, Trash2, Plus } from "lucide-react"
import { useAddItemToSubRequestMutation, useRemoveItemFromSubRequestMutation, useUpdateSubRequestMutation } from "@/services/gshopApi"

const PLATFORM_OPTIONS = ["Taobao", "Tmall", "1688", "Shopee", "Lazada"];

const EditSubDialog = ({ subRequest, requestItemsGroupByPlatform }) => {
  const [open, setOpen] = useState(false);
  const initialPlatform = useMemo(() => {
    const current = subRequest?.ecommercePlatform || "";
    return PLATFORM_OPTIONS.includes(current) ? current : (current ? "Khác" : "");
  }, [subRequest?.ecommercePlatform]);

  const [seller, setSeller] = useState(subRequest?.seller || "");
  const [platform, setPlatform] = useState(initialPlatform);
  const [customPlatform, setCustomPlatform] = useState(
    PLATFORM_OPTIONS.includes(subRequest?.ecommercePlatform || "") ? "" : (subRequest?.ecommercePlatform || "")
  );
  const [selectedToAdd, setSelectedToAdd] = useState("");

  const [updateSubRequest, { isLoading: isSaving }] = useUpdateSubRequestMutation();
  const [removeItem, { isLoading: isRemoving }] = useRemoveItemFromSubRequestMutation();
  const [addItem, { isLoading: isAdding }] = useAddItemToSubRequestMutation();

  const platformValue = platform === "Khác" ? (customPlatform || "") : platform;

  const handleSave = async () => {
    try {
      if (!seller.trim()) {
        toast.error("Vui lòng nhập tên người bán/nhóm (seller)");
        return;
      }
      const payload = {
        seller: seller.trim(),
        ecommercePlatform: platformValue.trim(),
      };
      await updateSubRequest({ id: subRequest.id, payload }).unwrap()
        .then(() => {
          toast.success("Cập nhật nhóm thành công");
          setOpen(false);
        })
    } catch (err) {
      toast.error("Cập nhật thất bại" + (err?.data?.message ? `: ${err.data.message}` : ""));
    }
  };

  const handleAddItem = async () => {
    if (!selectedToAdd) return;
    try {
      await addItem({ subRequestId: subRequest.id, itemId: selectedToAdd }).unwrap();
      toast.success("Đã thêm sản phẩm vào nhóm");
      setSelectedToAdd("");
    } catch (err) {
      toast.error("Thêm sản phẩm thất bại" + (err?.data?.message ? `: ${err.data.message}` : ""));
    }
  };

  const handleRemoveItem = async (itemId) => {
    try {
      await removeItem({ subRequestId: subRequest.id, itemId }).unwrap();
      toast.success("Đã xóa sản phẩm khỏi nhóm");
    } catch (err) {
      toast.error("Xóa sản phẩm thất bại" + (err?.data?.message ? `: ${err.data.message}` : ""));
    }
  };

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button variant="link" type="button" className="text-blue-600 font-medium mt-2">Chỉnh sửa nhóm</Button>
      </DialogTrigger>
      <DialogContent className="sm:max-w-[700px]">
        <DialogHeader>
          <DialogTitle>Chỉnh sửa nhóm</DialogTitle>
          <DialogDescription>
            Chỉnh sửa thông tin và thêm hoặc xóa sản phẩm trong nhóm
          </DialogDescription>
        </DialogHeader>
        <Tabs defaultValue="info" className="mt-2">
          <TabsList>
            <TabsTrigger value="info">Thông tin nhóm</TabsTrigger>
            <TabsTrigger value="items">Quản lý sản phẩm</TabsTrigger>
          </TabsList>

          <TabsContent value="info">
            {/* General info */}
            <div className="space-y-3 py-2">
              <div>
                <Label className="text-sm font-medium">Người bán</Label>
                <Input value={seller} onChange={(e) => setSeller(e.target.value)} placeholder="Nhập tên người bán" />
              </div>
              <div>
                <Label className="text-sm font-medium">Nền tảng</Label>
                <div className="flex gap-2 items-center">
                  <Select value={platform} onValueChange={(v) => setPlatform(v)}>
                    <SelectTrigger className="min-w-[200px]">
                      <SelectValue placeholder="Chọn nền tảng" />
                    </SelectTrigger>
                    <SelectContent>
                      {PLATFORM_OPTIONS.map(opt => (
                        <SelectItem key={opt} value={opt}>{opt}</SelectItem>
                      ))}
                      <SelectItem value="Khác">Khác</SelectItem>
                    </SelectContent>
                  </Select>
                  {platform === "Khác" && (
                    <Input
                      value={customPlatform}
                      onChange={(e) => setCustomPlatform(e.target.value)}
                      placeholder="Nhập nền tảng khác"
                      className="flex-1"
                    />
                  )}
                </div>
              </div>
            </div>
            <DialogFooter className="mt-4">
              <DialogClose asChild>
                <Button variant="outline">Hủy</Button>
              </DialogClose>
              <Button onClick={handleSave} disabled={isSaving} className="bg-blue-600 hover:bg-blue-700 text-white">Lưu</Button>
            </DialogFooter>
          </TabsContent>

          <TabsContent value="items">
            {/* Items in group */}
            <div className="mt-2">
              <Label className="text-sm font-medium">Sản phẩm trong nhóm</Label>
              <div className="mt-2 max-h-52 overflow-y-auto space-y-2">
                {(subRequest?.requestItems || []).length === 0 && (
                  <div className="text-sm text-gray-500">Chưa có sản phẩm nào trong nhóm này.</div>
                )}
                {(subRequest?.requestItems || []).map(item => (
                  <div key={item.id} className="flex items-center justify-between rounded border p-2">
                    <div className="flex items-center gap-2">
                      <div className="font-medium truncate">{item.productName}</div>
                      <div className="text-xs text-gray-500">×{item.quantity}</div>
                    </div>
                    <div className="flex items-center gap-4">
                      {item.productURL && (
                        <a href={item.productURL} target="_blank" rel="noopener noreferrer" className="inline-flex items-center gap-1 text-blue-600 text-xs mt-1">
                          <ExternalLink className="h-3 w-3" /> Xem sản phẩm
                        </a>
                      )}
                      <Button
                        variant="outline"
                        size="sm"
                        className="text-red-600"
                        disabled={isRemoving}
                        onClick={() => handleRemoveItem(item.id)}
                      >
                        <Trash2 className="h-4 w-4" />
                      </Button>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Add item */}
            <div className="mt-2">
              <Label className="text-sm font-medium">Thêm sản phẩm</Label>
              <div className="flex gap-2 mt-2 items-center">
                <Select value={selectedToAdd} onValueChange={setSelectedToAdd}>
                  <SelectTrigger className="min-w-[320px]">
                    <SelectValue placeholder={requestItemsGroupByPlatform.length ? "Chọn sản phẩm để thêm" : "Không còn sản phẩm để thêm"} />
                  </SelectTrigger>
                  <SelectContent>
                    {requestItemsGroupByPlatform.map(group => (
                      group.items.map(item => (
                        <SelectItem key={item.id} value={String(item.id)}>
                          <div>
                            [{item.ecommercePlatform || "Khác"}] {item.productName} (×{item.quantity})
                          </div>
                        </SelectItem>
                      ))
                    ))}
                  </SelectContent>
                </Select>
                <Button onClick={handleAddItem} disabled={!selectedToAdd || isAdding}>
                  <Plus className="h-4 w-4 mr-1" /> Thêm
                </Button>
              </div>
            </div>
          </TabsContent>
        </Tabs>
      </DialogContent>
    </Dialog>
  );
}

export default EditSubDialog