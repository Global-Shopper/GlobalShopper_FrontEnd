import React, { useMemo, useState, useEffect } from 'react'
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Input } from "@/components/ui/input";
import { toast } from "sonner";
import { Trash2 } from 'lucide-react';

const REQUIRED_COLUMNS = ["hsCode", "description", "unit", "parentCode"]; // values allowed empty
const DEFAULT_COLUMN_WIDTH = 180; // px
const COLUMN_WIDTHS = {
  hsCode: 140,
  description: 820,
  unit: 160,
  parentCode: 160,
  action: 20,
};
const PAGE_SIZE_OPTIONS = [5, 10, 20];

export default function HSCodeUploadDialog({ open, onOpenChange, rows = [], setRows, onConfirm }) {
  const [pageSize, setPageSize] = useState(10);
  const [page, setPage] = useState(1);

  const columnKeys = useMemo(() => {
    const keySet = new Set();
    (rows || []).forEach((row) => Object.keys(row || {}).forEach((key) => keySet.add(key)));
    REQUIRED_COLUMNS.forEach((requiredKey) => keySet.add(requiredKey));
    return Array.from(keySet);
  }, [rows]);

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
    // Reset page when dialog opens
    if (open) setPage(1);
  }, [open]);

  useEffect(() => {
    // Clamp page when rows or pageSize changes
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
      <DialogContent className="sm:max-w-7xl h-[98vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle>Tải lên HS Code - Xem trước và chỉnh sửa</DialogTitle>
        </DialogHeader>

        <div className="space-y-3">
          {missingRequired.length > 0 && (
            <div className="text-sm text-amber-600">Thiếu cột bắt buộc: {missingRequired.join(", ")}</div>
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
                  <TableHead style={{ width: `${COLUMN_WIDTHS.action}px` }} className="bg-primary/90 text-primary-foreground">Hành động</TableHead>
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
                      <TableCell style={{ width: `${COLUMN_WIDTHS.action}px` }}>
                        <Button variant="destructive" size="sm" onClick={() => removeRow(startIndex + rowIndex)}>
                          <Trash2 className="h-4 w-4" />
                        </Button>
                      </TableCell>
                    </TableRow>
                  ))
                )}
              </TableBody>
            </Table>
          </div>

          <div className="flex items-center gap-2">
            <Button variant="outline" onClick={addEmptyRow}>
              Thêm dòng
            </Button>
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
          <Button variant="outline" onClick={() => onOpenChange(false)}>
            Hủy
          </Button>
          <Button onClick={handleConfirm}>Xác nhận</Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}