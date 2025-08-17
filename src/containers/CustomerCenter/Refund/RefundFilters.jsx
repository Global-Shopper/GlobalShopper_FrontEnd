import React from "react";
import { Select, SelectTrigger, SelectValue, SelectContent, SelectItem } from "@/components/ui/select";
import { Button } from "@/components/ui/button";
import { Funnel } from "lucide-react";
import { REFUND_STATUS_OPTIONS } from "@/const/refundStatus";

const SORT_OPTIONS = [
  { value: "createdAt,desc", label: "Mới nhất" },
  { value: "createdAt,asc", label: "Cũ nhất" },
];

export default function RefundFilters({ status, setStatus, sort, setSort, onClear }) {
  const hasActiveFilters = (status && status !== "ALL") || (sort && sort !== "createdAt,desc");

  return (
    <div className="flex flex-wrap items-center gap-3 bg-white p-3 rounded shadow-sm">
      <div className="flex items-center gap-2">
        <Funnel className="w-4 h-4 text-gray-400" />
        <span className="font-medium text-gray-700 text-sm">Lọc hoàn tiền</span>
      </div>
      <Select value={status} onValueChange={setStatus}>
        <SelectTrigger className="w-44">
          <SelectValue placeholder="Trạng thái" />
        </SelectTrigger>
        <SelectContent>
          {REFUND_STATUS_OPTIONS.map((opt) => (
            <SelectItem key={opt.value} value={opt.value}>{opt.label}</SelectItem>
          ))}
        </SelectContent>
      </Select>
      <Select value={sort} onValueChange={setSort}>
        <SelectTrigger className="w-36">
          <SelectValue placeholder="Sắp xếp" />
        </SelectTrigger>
        <SelectContent>
          {SORT_OPTIONS.map((opt) => (
            <SelectItem key={opt.value} value={opt.value}>{opt.label}</SelectItem>
          ))}
        </SelectContent>
      </Select>
      {hasActiveFilters && (
        <Button variant="outline" size="sm" onClick={onClear}>
          Xóa bộ lọc
        </Button>
      )}
    </div>
  );
}
