import React, { useMemo, useState, useEffect } from "react";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Input } from "@/components/ui/input";
import { toast } from "sonner";

const REQUIRED_COLUMNS = ["id", "rate", "region", "taxName", "taxType", "hsCode"];
const DEFAULT_COLUMN_WIDTH = 160; // px
const COLUMN_WIDTHS = {
  id: 120,
  rate: 120,
  region: 160,
  taxName: 500,
  taxType: 160,
  hsCode: 160,
};
const PAGE_SIZE_OPTIONS = [5, 10, 20];

export default function TaxRateUploadPreviewDialog({ open, onOpenChange, rows = [], setRows, onConfirm }) {
  const [pageSize, setPageSize] = useState(10);
  const [page, setPage] = useState(1);
  const columnKeys = useMemo(() => {
    const keySet = new Set();
    (rows || []).forEach((row) => Object.keys(row || {}).forEach((key) => keySet.add(key)));
    REQUIRED_COLUMNS.forEach((requiredKey) => keySet.add(requiredKey));
    return Array.from(keySet);
  }, [rows]);

  // Order: required columns first (in our defined order), then any additional columns alphabetically
  const displayColumnKeys = useMemo(() => {
    const additional = columnKeys.filter((key) => !REQUIRED_COLUMNS.includes(key)).sort();
    return [...REQUIRED_COLUMNS, ...additional];
  }, [columnKeys]);

  const missingRequired = useMemo(() => {
    if (!rows || rows.length === 0) return [];
    const headers = new Set(columnKeys);
    return REQUIRED_COLUMNS.filter((requiredKey) => !headers.has(requiredKey));
  }, [columnKeys, rows]);

  const totalRows = rows?.length ?? 0;
  const totalPages = Math.max(1, Math.ceil(totalRows / pageSize));
  const currentPage = Math.min(page, totalPages);
  const startIndex = (currentPage - 1) * pageSize;
  const endIndex = Math.min(startIndex + pageSize, totalRows);
  const displayedRows = useMemo(() => rows.slice(startIndex, endIndex), [rows, startIndex, endIndex]);

  useEffect(() => {
    if (open) setPage(1);
  }, [open]);

  useEffect(() => {
    const newTotalPages = Math.max(1, Math.ceil((rows?.length ?? 0) / pageSize));
    setPage((p) => (p > newTotalPages ? newTotalPages : p));
  }, [rows, pageSize]);

  const updateCell = (rowIndex, columnKey, value) => {
    setRows((prev) => {
      const nextRows = [...prev];
      nextRows[rowIndex] = { ...(nextRows[rowIndex] || {}), [columnKey]: value };
      return nextRows;
    });
  };

  const addEmptyRow = () => {
    const emptyRow = displayColumnKeys.reduce((acc, columnKey) => ({ ...acc, [columnKey]: "" }), {});
    setRows((prev) => [...(prev || []), emptyRow]);
  };

  const removeRow = (rowIndex) => {
    setRows((prev) => prev.filter((_, index) => index !== rowIndex));
  };

  const handleConfirm = () => {
    if (missingRequired.length > 0) {
      toast.error(`Thiếu cột bắt buộc: ${missingRequired.join(", ")}`);
      return;
    }
    if (!rows || rows.length === 0) {
      toast.error("Không có dữ liệu để tải lên.");
      return;
    }
    onConfirm?.(rows);
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-8xl h-[98vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle>Tải lên Thuế - Xem trước và chỉnh sửa</DialogTitle>
        </DialogHeader>

        <div className="space-y-3">
          {missingRequired.length > 0 && (
            <div className="text-sm text-amber-600">
              Thiếu cột bắt buộc: {missingRequired.join(", ")}
            </div>
          )}

          <div className="rounded-md border overflow-x-auto">
            <Table>
              <TableHeader>
                <TableRow>
                  {displayColumnKeys.map((columnKey) => (
                    <TableHead
                      key={columnKey}
                      className="bg-primary/90 text-primary-foreground"
                      style={{ width: `${COLUMN_WIDTHS[columnKey] ?? DEFAULT_COLUMN_WIDTH}px` }}
                    >
                      {columnKey}
                    </TableHead>
                  ))}
                  <TableHead className="bg-primary/90 text-primary-foreground">Hành động</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {(rows || []).length === 0 ? (
                  <TableRow>
                    <TableCell className="py-6 text-center" colSpan={displayColumnKeys.length + 1}>
                      Không có dữ liệu.
                    </TableCell>
                  </TableRow>
                ) : (
                  displayedRows.map((rowData, rowIndex) => (
                    <TableRow key={rowIndex}>
                      {displayColumnKeys.map((columnKey) => (
                        <TableCell
                          key={columnKey}
                          style={{ width: `${COLUMN_WIDTHS[columnKey] ?? DEFAULT_COLUMN_WIDTH}px` }}
                        >
                          <Input
                            value={rowData?.[columnKey] ?? ""}
                            onChange={(event) => updateCell(startIndex + rowIndex, columnKey, event.target.value)}
                          />
                        </TableCell>
                      ))}
                      <TableCell>
                        <Button variant="destructive" size="sm" onClick={() => removeRow(startIndex + rowIndex)}>
                          Xóa
                        </Button>
                      </TableCell>
                    </TableRow>
                  ))
                )}
              </TableBody>
            </Table>
          </div>

          <div className="flex items-center gap-2">
            <Button variant="outline" onClick={addEmptyRow}>Thêm dòng</Button>
          </div>

          <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-3">
            <div className="text-sm text-gray-600">
              Hiển thị {totalRows === 0 ? 0 : startIndex + 1}–{endIndex} trên {totalRows} dòng
            </div>
            <div className="flex items-center gap-3">
              <div className="flex items-center gap-2">
                <span className="text-sm">Số dòng/trang:</span>
                <select
                  className="border rounded px-2 py-1 text-sm"
                  value={pageSize}
                  onChange={(e) => {
                    setPageSize(Number(e.target.value));
                    setPage(1);
                  }}
                >
                  {PAGE_SIZE_OPTIONS.map((opt) => (
                    <option key={opt} value={opt}>
                      {opt}
                    </option>
                  ))}
                </select>
              </div>
              <div className="flex items-center gap-2">
                <Button
                  variant="outline"
                  size="sm"
                  disabled={currentPage <= 1}
                  onClick={() => setPage((p) => Math.max(1, p - 1))}
                >
                  Trang trước
                </Button>
                <div className="text-sm">
                  Trang {currentPage} / {totalPages}
                </div>
                <Button
                  variant="outline"
                  size="sm"
                  disabled={currentPage >= totalPages}
                  onClick={() => setPage((p) => Math.min(totalPages, p + 1))}
                >
                  Trang sau
                </Button>
              </div>
            </div>
          </div>
        </div>

        <DialogFooter>
          <Button variant="outline" onClick={() => onOpenChange(false)}>Hủy</Button>
          <Button onClick={handleConfirm}>Xác nhận</Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
