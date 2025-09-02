import React, { useMemo, useState, useEffect } from "react";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Input } from "@/components/ui/input";
import { toast } from "sonner";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { TAX_TYPE_CODES, getRegionsByTaxType, REGION_CODES, getTaxTypeLabel, getTaxTypesByRegion } from "@/const/taxType";
import { useImportTaxRatesByListMutation } from "@/services/gshopApi";
import ImportTaxRateError from "@/components/ImportTaxRateError";

const REQUIRED_COLUMNS = [{
  name: "rate",
  label: "Tỉ lệ(%)",
  width: 120,
}, {
  name: "region",
  label: "Quốc gia",
  width: 160,
}, {
  name: "taxName",
  label: "Tên thuế",
  width: 500,
}, {
  name: "taxType",
  label: "Loại thuế",
  width: 160,
}, {
  name: "hsCode",
  label: "HS code",
  width: 160,
}];
const PAGE_SIZE_OPTIONS = [5, 10, 20];
const COL = REQUIRED_COLUMNS.reduce((cols, c) => {
  cols[c.name] = c;
  return cols;
}, {});

export default function TaxRateUploadPreviewDialog({ open, onOpenChange, rows = [], setRows }) {
  const [pageSize, setPageSize] = useState(10);
  const [page, setPage] = useState(1);
  const [importResult, setImportResult] = useState(null);
  const [errorOpen, setErrorOpen] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  const [importTaxRatesByList] = useImportTaxRatesByListMutation();

  const totalRows = rows?.length ?? 0;
  const totalPages = Math.max(1, Math.ceil(totalRows / pageSize));
  const currentPage = Math.min(page, totalPages);
  const startIndex = (currentPage - 1) * pageSize;
  const endIndex = Math.min(startIndex + pageSize, totalRows);
  const displayedRows = useMemo(() => rows.slice(startIndex, endIndex), [rows, startIndex, endIndex]);

  useEffect(() => {
    if (open) setPage(1);
  }, [open]);

  // Reset import result when dialog (re)opens
  useEffect(() => {
    if (open) {
      setImportResult(null);
      setErrorOpen(false);
    }
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

  const updateTaxType = (rowIndex, value) => {
    setRows((prev) => {
      const nextRows = [...prev];
      const current = { ...(nextRows[rowIndex] || {}) };
      current.taxType = value;
      // Ensure region remains valid for the selected tax type
      const allowedRegions = getRegionsByTaxType(value);
      if (current.region && !allowedRegions.includes(current.region)) {
        current.region = "";
      }
      nextRows[rowIndex] = current;
      return nextRows;
    });
  };

  const updateRegion = (rowIndex, value) => {
    setRows((prev) => {
      const nextRows = [...prev];
      const current = { ...(nextRows[rowIndex] || {}) };
      current.region = value;
      // Ensure taxType remains valid for selected region
      const allowedTaxTypes = value ? getTaxTypesByRegion(value) : TAX_TYPE_CODES;
      if (current.taxType && !allowedTaxTypes.includes(current.taxType)) {
        current.taxType = "";
      }
      nextRows[rowIndex] = current;
      return nextRows;
    });
  };

  const getTaxLabel = (value) => getTaxTypeLabel?.(value) || "";

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
    // Build payload for API (derive taxName for display/back-end convenience)
    const payload = (rows || []).map((r) => ({
      rate: r?.rate ?? "",
      region: r?.region ?? "",
      taxName: getTaxTypeLabel?.(r?.taxType) || "",
      taxType: r?.taxType ?? "",
      hsCode: r?.hsCode ?? "",
    }));

    try {
      setSubmitting(true);
      const res = await importTaxRatesByList(payload).unwrap();
      setImportResult(res);
      const { message, errors = [], imported = 0, updated = 0, duplicated = 0 } = res || {};
      if ((errors || []).length > 0) {
        setRows(res.errors?.flatMap(e => e?.object) || []);
        toast.error(`${message || "Có lỗi khi nhập"}. Lỗi: ${errors.length}.`);
        setErrorOpen(true);
      } else {
        toast.success(message || `Nhập thành công. Imported: ${imported}, Updated: ${updated}, Duplicated: ${duplicated}`);
        setRows([]);
        onOpenChange?.(false);
      }
    } catch (err) {
      console.error(err);
      toast.error("Nhập Thuế thất bại.");
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <>
      <Dialog open={open} onOpenChange={onOpenChange}>
        <DialogContent className="sm:max-w-7xl max-h-[98vh] h-auto overflow-y-auto">
          <DialogHeader>
            <DialogTitle>Tải lên Thuế - Xem trước và chỉnh sửa</DialogTitle>
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
                    <TableHead className="bg-primary/90 text-primary-foreground">Hành động</TableHead>
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
                        <TableCell style={{ width: `${COL.rate.width}px` }}>
                          <Input
                            value={rowData?.rate ?? ""}
                            onChange={(event) => updateCell(startIndex + rowIndex, "rate", event.target.value)}
                          />
                        </TableCell>

                        <TableCell style={{ width: `${COL.region.width}px` }}>
                          <Select
                            value={rowData?.region ?? ""}
                            onValueChange={(val) => updateRegion(startIndex + rowIndex, val)}
                          >
                            <SelectTrigger>
                              <SelectValue placeholder="Chọn quốc gia" />
                            </SelectTrigger>
                            <SelectContent>
                              {!getRegionsByTaxType(rowData.taxType).includes(rowData.region) ?
                                REGION_CODES.map((code) => (
                                  <SelectItem key={code} value={code}>
                                    {code}
                                  </SelectItem>
                                ))
                                : getRegionsByTaxType(rowData.taxType).map((code) => (
                                  <SelectItem key={code} value={code}>
                                    {code}
                                  </SelectItem>
                                ))}
                            </SelectContent>
                          </Select>
                        </TableCell>

                        <TableCell style={{ width: `${COL.taxName.width}px` }}>
                          <Input value={getTaxLabel(rowData?.taxType)} readOnly disabled />
                        </TableCell>

                        <TableCell style={{ width: `${COL.taxType.width}px` }}>
                          <Select
                            value={rowData?.taxType ?? ""}
                            onValueChange={(val) => updateTaxType(startIndex + rowIndex, val)}
                          >
                            <SelectTrigger>
                              <SelectValue placeholder="Chọn loại thuế" />
                            </SelectTrigger>
                            <SelectContent>
                              {(rowData?.region ? getTaxTypesByRegion(rowData.region) : TAX_TYPE_CODES).map((code) => (
                                <SelectItem key={code} value={code}>
                                  {code}
                                </SelectItem>
                              ))}
                            </SelectContent>
                          </Select>
                        </TableCell>

                        <TableCell style={{ width: `${COL.hsCode.width}px` }}>
                          <Input
                            value={rowData?.hsCode ?? ""}
                            onChange={(event) => updateCell(startIndex + rowIndex, "hsCode", event.target.value)}
                          />
                        </TableCell>
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
            {
              importResult?.errors?.length > 0 && (
                <ImportTaxRateError open={errorOpen} onOpenChange={setErrorOpen} result={importResult} />
              )
            }
            <Button variant="outline" onClick={() => onOpenChange(false)}>Hủy</Button>
            <Button onClick={handleConfirm} disabled={submitting}>{submitting ? "Đang xử lý..." : "Xác nhận"}</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </>
  );
}
