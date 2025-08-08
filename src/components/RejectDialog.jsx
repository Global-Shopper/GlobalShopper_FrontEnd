import React, { useState } from "react";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
  DialogClose,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { toast } from "sonner";
import { useRejectQuotationMutation } from "@/services/gshopApi";

const RejectDialog = ({ subRequestId }) => {
  const [open, setOpen] = useState(false);
  const [selectedReason, setSelectedReason] = useState("");
  const [customReason, setCustomReason] = useState("");
  const [error, setError] = useState("");
  const [rejectQuotation, { isLoading }] = useRejectQuotationMutation();

  const reasons = [
    { value: "out_of_stock", label: "Hết hàng / Người bán không đáp ứng" },
    { value: "price_high", label: "Giá quá cao" },
    { value: "lead_time", label: "Thời gian giao hàng không phù hợp" },
    { value: "info_issue", label: "Thông tin sản phẩm không đầy đủ/không chính xác" },
    { value: "other", label: "Khác (tự nhập)" },
  ];

  const resolveReasonText = () => {
    if (selectedReason === "other") return customReason.trim();
    const found = reasons.find((r) => r.value === selectedReason);
    return found ? found.label : "";
  };

  const handleConfirm = async () => {
    setError("");
    const reasonText = resolveReasonText();
    if (!selectedReason) {
      setError("Vui lòng chọn lý do hủy.");
      return;
    }
    if (selectedReason === "other" && reasonText.length === 0) {
      setError("Vui lòng nhập lý do hủy.");
      return;
    }
    try {
      await rejectQuotation({ subRequestId, rejectionReason: reasonText }).unwrap();
      toast.success("Đã hủy báo giá thành công.");
      setOpen(false);
      // reset state after close
      setSelectedReason("");
      setCustomReason("");
    } catch (err) {
      toast.error("Hủy báo giá thất bại" + (err?.data?.message ? `: ${err.data.message}` : ""));
    }
  };

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button variant="destructive">Hủy báo giá</Button>
      </DialogTrigger>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Bạn có chắc chắn muốn hủy báo giá?</DialogTitle>
          <DialogDescription>
            Sau khi hủy báo giá sẽ không thể khôi phục. Vui lòng chọn hoặc nhập lý do hủy.
          </DialogDescription>
        </DialogHeader>

        <div className="space-y-3">
          <Label className="font-medium">Lý do hủy báo giá</Label>
          <RadioGroup value={selectedReason} onValueChange={(v) => { setSelectedReason(v); setError(""); }}>
            {reasons.map((r) => (
              <div key={r.value} className="flex items-center gap-2">
                <RadioGroupItem id={`reason-${r.value}`} value={r.value} />
                <Label htmlFor={`reason-${r.value}`}>{r.label}</Label>
              </div>
            ))}
          </RadioGroup>

          {selectedReason === "other" && (
            <div className="mt-2">
              <Label className="mb-1 block">Nhập lý do</Label>
              <Textarea
                placeholder="Nhập lý do hủy..."
                value={customReason}
                onChange={(e) => setCustomReason(e.target.value)}
              />
            </div>
          )}

          {error && <div className="text-red-500 text-sm">{error}</div>}
        </div>

        <DialogFooter>
          <DialogClose asChild>
            <Button variant="outline">Đóng</Button>
          </DialogClose>
          <Button variant="destructive" onClick={handleConfirm} disabled={isLoading}>
            {isLoading ? "Đang xử lý..." : "Xác nhận hủy báo giá"}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};

export default RejectDialog