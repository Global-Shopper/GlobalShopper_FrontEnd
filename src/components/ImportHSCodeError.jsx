import React, { useMemo } from "react";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter, DialogTrigger } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";

const ImportHSCodeError = ({ result, open, onOpenChange }) => {
  const {
    success,
    message,
    totalRequestData = 0,
    imported = 0,
    updated = 0,
    duplicated = 0,
    errors = [],
  } = result || {};

  const rowsMemo = useMemo(() => (Array.isArray(errors) ? errors : []), [errors]);

  const parsedRows = useMemo(() => {
    return rowsMemo.map((e, idx) => {
      const obj = e?.object || {};
      const msg = e?.message || "";
      return {
        key: obj?.id || String(idx),
        hsCode: obj?.hsCode || "",
        description: obj?.description || "",
        unit: obj?.unit || "",
        parentCode: obj?.parentCode || "",
        message: msg,
      };
    });
  }, [rowsMemo]);

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogTrigger>
        <Button className="bg-yellow-500" variant="outline">Xem lỗi</Button>
      </DialogTrigger>
      <DialogContent className="sm:max-w-6xl max-h-[90vh] h-auto overflow-y-auto">
        <DialogHeader>
          <DialogTitle>Kết quả nhập HS Code - Lỗi</DialogTitle>
        </DialogHeader>

        <div className="space-y-3">
          <div className="px-4 py-3 bg-red-50 text-red-700 text-sm font-medium rounded-md border">
            {message || (success ? "Thành công" : "Có lỗi")}
          </div>
          <div className="px-4 py-3 flex flex-wrap gap-4 text-sm rounded-md border">
            <div>Tổng yêu cầu: <span className="font-medium">{totalRequestData}</span></div>
            <div>Nhập mới: <span className="font-medium">{imported}</span></div>
            <div>Cập nhật: <span className="font-medium">{updated}</span></div>
            <div>Bị trùng: <span className="font-medium">{duplicated}</span></div>
            <div>Lỗi: <span className="font-medium text-red-600">{rowsMemo.length}</span></div>
          </div>

          <div className="rounded-md border overflow-x-auto">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead className="min-w-[160px]">HS code</TableHead>
                  <TableHead className="min-w-[360px]">Mô tả</TableHead>
                  <TableHead className="min-w-[140px]">Đơn vị</TableHead>
                  <TableHead className="min-w-[160px]">Mã cha</TableHead>
                  <TableHead className="min-w-[360px]">Thông báo lỗi</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {parsedRows.length === 0 ? (
                  <TableRow>
                    <TableCell colSpan={5} className="text-center py-6 text-sm">Không có lỗi.</TableCell>
                  </TableRow>
                ) : (
                  parsedRows.map((r) => (
                    <TableRow key={r.key} className="bg-red-50/40">
                      <TableCell>{r.hsCode}</TableCell>
                      <TableCell className="max-w-[28rem] truncate" title={r.description}>{r.description}</TableCell>
                      <TableCell>{r.unit}</TableCell>
                      <TableCell>{r.parentCode}</TableCell>
                      <TableCell className="text-xs text-red-700 whitespace-pre-wrap break-words">{r.message}</TableCell>
                    </TableRow>
                  ))
                )}
              </TableBody>
            </Table>
          </div>
        </div>

        <DialogFooter>
          <Button variant="outline" onClick={() => onOpenChange?.(false)}>Đóng</Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};

export default ImportHSCodeError;
