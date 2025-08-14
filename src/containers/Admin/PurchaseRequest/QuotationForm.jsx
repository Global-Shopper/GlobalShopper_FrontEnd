import React, { useState } from "react";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
} from "@/components/ui/dialog";
import SystemConfig from "@/containers/BusinessManager/SystemConfig/SystemConfig";

export function QuotationForm({ requestType, product, errors = {}, onChange }) {
  const [hsOpen, setHsOpen] = useState(false);

  // Hàm nhận HS code từ bảng
  const handleTakeHsCode = (code) => {
    onChange("hsCodeId", code);
    setHsOpen(false);
  };

  return (
    <div className="p-4 rounded space-y-2">
      <div className="grid grid-cols-2 gap-4">
        <div className="col-span-2">
          <Label>{product?.productName || "Sản phẩm"}</Label>
        </div>

        <div>
          <Label>Tiền tệ</Label>
          <select
            name="currency"
            value={product?.currency || ""}
            onChange={(e) => onChange("currency", e.target.value)}
            className="w-full px-4 py-2 border border-gray-300 rounded"
          >
            <option value="">Chọn tiền tệ</option>
            <option value="USD">USD</option>
            <option value="EUR">EUR</option>
            <option value="CNY">CNY</option>
            <option value="JPY">JPY</option>
            <option value="KRW">KRW</option>
            <option value="GBP">GBP</option>
          </select>
          {errors?.currency && (
            <div className="text-red-500 text-xs">{errors.currency}</div>
          )}
        </div>

        <div>
          <Label>Giá gốc</Label>
          <Input
            name="basePrice"
            placeholder="Giá gốc"
            type="number"
            value={product?.basePrice || ""}
            onChange={(e) => onChange("basePrice", e.target.value)}
          />
          {errors?.basePrice && (
            <div className="text-red-500 text-xs">{errors.basePrice}</div>
          )}
        </div>

        {requestType === "OFFLINE" && (
          <>
            <div>
              <Label>HS Code</Label>
              <div className="flex gap-2">
                <Input
                  name="hsCodeId"
                  placeholder="HS Code"
                  value={product?.hsCodeId || ""}
                  onChange={(e) => onChange("hsCodeId", e.target.value)}
                />
                <Button variant="outline" size="sm" onClick={() => setHsOpen(true)}>
                  Search
                </Button>
              </div>
              {errors?.hsCodeId && (
                <div className="text-red-500 text-xs">{errors.hsCodeId}</div>
              )}
            </div>

            <div>
              <Label>Khu vực</Label>
              <select
                name="region"
                value={product?.region || ""}
                onChange={(e) => onChange("region", e.target.value)}
                className="w-full px-4 py-2 border border-gray-300 rounded"
              >
                <option value="">Chọn khu vực</option>
                <option value="US">Mỹ</option>
                <option value="UK">Anh</option>
                <option value="JP">Nhật bản</option>
                <option value="KR">Hàn Quốc</option>
                <option value="CHN">Trung Quốc</option>
              </select>
              {errors?.region && (
                <div className="text-red-500 text-xs">{errors.region}</div>
              )}
            </div>
          </>
        )}

        <div>
          <Label>Phí dịch vụ</Label>
          <Input
            name="serviceFee"
            placeholder="Phí dịch vụ"
            type="number"
            value={product?.serviceFee || ""}
            onChange={(e) => onChange("serviceFee", e.target.value)}
          />
          {errors?.serviceFee && (
            <div className="text-red-500 text-xs">{errors.serviceFee}</div>
          )}
        </div>
      </div>

      {requestType === "OFFLINE" && (
        <div>
          <Label>Ghi chú sản phẩm</Label>
          <Textarea
            name="note"
            placeholder="Ghi chú cho sản phẩm này..."
            value={product?.note || ""}
            onChange={(e) => onChange("note", e.target.value)}
          />
          {errors?.note && (
            <div className="text-red-500 text-xs">{errors.note}</div>
          )}
        </div>
      )}
      <Dialog open={hsOpen} onOpenChange={setHsOpen}>
        <DialogContent
          className="
            max-w-[100vw] sm:max-w-[100vw] md:max-w-[100vw] lg:max-w-[100vw] xl:max-w-[100vw] 2xl:max-w-[100vw]
            w-[100vw] h-[100vh]
            p-0 overflow-hidden
            rounded-none sm:rounded-none
          "
        >
          <DialogHeader className="px-6 pt-6">
            <DialogTitle>Chọn HS Code</DialogTitle>
            <DialogDescription>
              Tìm kiếm và chọn HS code phù hợp cho sản phẩm.
            </DialogDescription>
          </DialogHeader>
          <div className="px-6 pb-6 h-[calc(100%-90px)] overflow-auto">
            <SystemConfig setHScode={handleTakeHsCode} />
          </div>
        </DialogContent>
      </Dialog>

    </div>
  );
}
