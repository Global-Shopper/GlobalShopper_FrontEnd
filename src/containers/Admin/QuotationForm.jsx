import React from "react";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";

export function QuotationForm({
  index,
  values,
  errors,
  touched,
  handleChange,
  handleBlur
}) {
  return (
    <div className="p-4 rounded space-y-2">
      <div className="grid grid-cols-2 gap-4">
        <div>
          <Label>Giá gốc</Label>
          <Input
            name={`details[${index}].basePrice`}
            placeholder="Giá gốc"
            type="number"
            value={values?.details[index].basePrice}
            onChange={handleChange}
            onBlur={handleBlur}
          />
          {touched?.details?.[index]?.basePrice && errors.details?.[index]?.basePrice && (
            <div className="text-red-500 text-xs">{errors.details[index].basePrice}</div>
          )}
        </div>
        <div>
          <Label>HS Code</Label>
          <Input
            name={`details[${index}].hsCodeId`}
            placeholder="HS Code"
            value={values?.details[index].hsCodeId}
            onChange={handleChange}
            onBlur={handleBlur}
          />
          {touched?.details?.[index]?.hsCodeId && errors.details?.[index]?.hsCodeId && (
            <div className="text-red-500 text-xs">{errors.details[index].hsCodeId}</div>
          )}
        </div>
        <div>
          <Label>Khu vực</Label>
          <Input
            name={`details[${index}].region`}
            placeholder="VD: UK"
            value={values?.details[index].region}
            onChange={handleChange}
            onBlur={handleBlur}
          />
          {touched?.details?.[index]?.region && errors.details?.[index]?.region && (
            <div className="text-red-500 text-xs">{errors.details[index].region}</div>
          )}
        </div>
        <div>
          <Label>Phí dịch vụ</Label>
          <Input
            name={`details[${index}].serviceFee`}
            placeholder="Phí dịch vụ"
            type="number"
            value={values?.details[index].serviceFee}
            onChange={handleChange}
            onBlur={handleBlur}
          />
          {touched?.details?.[index]?.serviceFee && errors?.details?.[index]?.serviceFee && (
            <div className="text-red-500 text-xs">{errors.details[index].serviceFee}</div>
          )}
        </div>
        <div>
          <Label>Tiền tệ</Label>
          <select
            name={`details[${index}].currency`}
            value={values?.details[index].currency}
            onChange={handleChange}
            onBlur={handleBlur}
            className="w-full px-4 py-2 border border-gray-300 rounded"
          >
            <option value="">Chọn tiền tệ</option>
            <option value="USD">USD</option>
            <option value="EUR">EUR</option>
            <option value="VND">VND</option>
          </select>
          {touched?.details?.[index]?.currency && errors?.details?.[index]?.currency && (
            <div className="text-red-500 text-xs">{errors.details[index].currency}</div>
          )}
        </div>
      </div>
      <div>
        <Label>Ghi chú sản phẩm</Label>
        <Textarea
          name={`details[${index}].note`}
          placeholder="Ghi chú cho sản phẩm này..."
          value={values?.details[index].note}
          onChange={handleChange}
          onBlur={handleBlur}
        />
        {touched?.details?.[index]?.note && errors?.details?.[index]?.note && (
          <div className="text-red-500 text-xs">{errors.details[index].note}</div>
        )}
      </div>
    </div>
  );
}
