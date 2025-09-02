import React, { useMemo, useState, useEffect } from 'react'
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Input } from "@/components/ui/input";
import { toast } from "sonner";
import { Trash2 } from 'lucide-react';
import { useImportHSCodeByListMutation } from "@/services/gshopApi";
import ImportHSCodeError from "@/components/ImportHSCodeError";

// Fixed column config (follow TaxRate dialog structure)
const REQUIRED_COLUMNS = [{
  name: "hsCode",
  label: "HS code",
  width: 140,
}, {
  name: "description",
  label: "Mô tả",
  width: 820,
}, {
  name: "unit",
  label: "Đơn vị",
  width: 160,
}, {
  name: "parentCode",
  label: "Parent Code",
  width: 160,
}];
const ACTION_COL_WIDTH = 20;
const COL = REQUIRED_COLUMNS.reduce((acc, c) => {
  acc[c.name] = c;
  return acc;
}, {});
const PAGE_SIZE_OPTIONS = [5, 10, 20];

export default function HSCodeUploadDialog({ open, onOpenChange, rows = [], setRows }) {
  const [pageSize, setPageSize] = useState(10);
  const [page, setPage] = useState(1);
  const [importResult, setImportResult] = useState(null);
  const [errorOpen, setErrorOpen] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  const [importHSCodeByList] = useImportHSCodeByListMutation();

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
    const emptyRow = REQUIRED_COLUMNS.reduce((acc, col) => ({ ...acc, [col.name]: "" }), {});
    setRows((prev) => [...(prev || []), emptyRow]);
  };

  const removeRow = (rowIndex) => {
    setRows((prev) => prev.filter((_, index) => index !== rowIndex));
  };

  const handleConfirm = async () => {
    if (!rows || rows.length === 0) {
      toast.error("Không có dữ liệu để tải lên.");
      return;
    }
    const payload = (rows || []).map((r) => ({
      hsCode: r?.hsCode ?? "",
      description: r?.description ?? "",
      unit: r?.unit ?? "",
      parentCode: r?.parentCode ?? "",
    }));

    try {
      setSubmitting(true);
      const res = await importHSCodeByList(payload).unwrap();
      setImportResult(res);
      const { message, errors = [], imported = 0, updated = 0, duplicated = 0 } = res || {};
      if ((errors || []).length > 0) {
        toast.error(`${message || "Có lỗi khi nhập"}. Lỗi: ${errors.length}.`);
        setRows(res?.errors?.flatMap(e => e?.object) || []);
        setErrorOpen(true);
      } else {
        toast.success(message || `Nhập thành công. Imported: ${imported}, Updated: ${updated}, Duplicated: ${duplicated}`);
        setRows([]);
        onOpenChange?.(false);
      }
    } catch (err) {
      console.error(err);
      toast.error("Nhập HS Code thất bại.");
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-7xl h-auto max-h-[98vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle>Tải lên HS Code - Xem trước và chỉnh sửa</DialogTitle>
        </DialogHeader>

        <div className="space-y-3">
          <div className="rounded-md border overflow-x-auto">
            <Table>
              <TableHeader>
                <TableRow>
                  {REQUIRED_COLUMNS.map((col) => (
                    <TableHead
                      key={col.name}
                      className="bg-primary/90 text-primary-foreground"
                      style={{ width: `${col.width}px` }}
                    >
                      {col.label}
                    </TableHead>
                  ))}
                  <TableHead style={{ width: `${ACTION_COL_WIDTH}px` }} className="bg-primary/90 text-primary-foreground">Hành động</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {(rows || []).length === 0 ? (
                  <TableRow>
                    <TableCell className="py-6 text-center" colSpan={REQUIRED_COLUMNS.length + 1}>
                      Không có dữ liệu.
                    </TableCell>
                  </TableRow>
                ) : (
                  displayedRows.map((rowData, rowIndex) => (
                    <TableRow key={rowIndex}>
                      <TableCell style={{ width: `${COL.hsCode.width}px` }}>
                        <Input
                          value={rowData?.hsCode ?? ""}
                          onChange={(event) => updateCell(startIndex + rowIndex, "hsCode", event.target.value)}
                        />
                      </TableCell>
                      <TableCell style={{ width: `${COL.description.width}px` }}>
                        <Input
                          value={rowData?.description ?? ""}
                          onChange={(event) => updateCell(startIndex + rowIndex, "description", event.target.value)}
                        />
                      </TableCell>
                      <TableCell style={{ width: `${COL.unit.width}px` }}>
                        <Input
                          value={rowData?.unit ?? ""}
                          onChange={(event) => updateCell(startIndex + rowIndex, "unit", event.target.value)}
                        />
                      </TableCell>
                      <TableCell style={{ width: `${COL.parentCode.width}px` }}>
                        <Input
                          value={rowData?.parentCode ?? ""}
                          onChange={(event) => updateCell(startIndex + rowIndex, "parentCode", event.target.value)}
                        />
                      </TableCell>
                      <TableCell style={{ width: `${ACTION_COL_WIDTH}px` }}>
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
          {importResult?.errors?.length > 0 && (
            <ImportHSCodeError open={errorOpen} onOpenChange={setErrorOpen} result={importResult} />
          )}
          <Button variant="outline" onClick={() => onOpenChange(false)}>
            Hủy
          </Button>
          <Button onClick={handleConfirm} disabled={submitting}>
            {submitting ? "Đang xử lý..." : "Xác nhận"}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}