import React from "react";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";

export function QuotationForm({
  product,
  errors = {},
  onChange
}) {
  return (
    <div className="p-4 rounded space-y-2">
      <div className="grid grid-cols-2 gap-4">
        <div className="col-span-2">
          <Label>{product?.productName || 'Sản phẩm'}</Label>
        </div>

        <div>
          <Label>Giá gốc</Label>
          <Input
            name="basePrice"
            placeholder="Giá gốc"
            type="number"
            value={product?.basePrice || ''}
            onChange={e => onChange('basePrice', e.target.value)}
          />
          {errors?.basePrice && (
            <div className="text-red-500 text-xs">{errors.basePrice}</div>
          )}
        </div>
        <div>
          <Label>HS Code</Label>
          <Input
            name="hsCodeId"
            placeholder="HS Code"
            value={product?.hsCodeId || ''}
            onChange={e => onChange('hsCodeId', e.target.value)}
          />
          {errors?.hsCodeId && (
            <div className="text-red-500 text-xs">{errors.hsCodeId}</div>
          )}
        </div>
        <div>
          <Label>Khu vực</Label>
          <Input
            name="region"
            placeholder="VD: UK"
            value={product?.region || ''}
            onChange={e => onChange('region', e.target.value)}
          />
          {errors?.region && (
            <div className="text-red-500 text-xs">{errors.region}</div>
          )}
        </div>
        <div>
          <Label>Phí dịch vụ</Label>
          <Input
            name="serviceFee"
            placeholder="Phí dịch vụ"
            type="number"
            value={product?.serviceFee || ''}
            onChange={e => onChange('serviceFee', e.target.value)}
          />
          {errors?.serviceFee && (
            <div className="text-red-500 text-xs">{errors.serviceFee}</div>
          )}
        </div>
        <div>
          <Label>Tiền tệ</Label>
          <select
            name="currency"
            value={product?.currency || ''}
            onChange={e => onChange('currency', e.target.value)}
            className="w-full px-4 py-2 border border-gray-300 rounded"
          >
            <option value="">Chọn tiền tệ</option>
            <option value="USD">USD</option>
            <option value="EUR">EUR</option>
            <option value="VND">VND</option>
          </select>
          {errors?.currency && (
            <div className="text-red-500 text-xs">{errors.currency}</div>
          )}
        </div>
      </div>
      <div>
        <Label>Ghi chú sản phẩm</Label>
        <Textarea
          name="note"
          placeholder="Ghi chú cho sản phẩm này..."
          value={product?.note || ''}
          onChange={e => onChange('note', e.target.value)}
        />
        {errors?.note && (
          <div className="text-red-500 text-xs">{errors.note}</div>
        )}
      </div>
    </div>
  );
}
