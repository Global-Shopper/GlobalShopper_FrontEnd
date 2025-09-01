import { useGetTaxRatesByHsCodeQuery } from '@/services/gshopApi'
import React from 'react'
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from "@/components/ui/dialog";
import { DialogClose } from "@/components/ui/dialog";
import { Table, TableHeader, TableBody, TableRow, TableHead, TableCell } from "@/components/ui/table";
import { Button } from './ui/button';

const TaxRateByHSDialog = ({ hsCode, open, onOpenChange }) => {
  const { data: taxRates, isLoading } = useGetTaxRatesByHsCodeQuery(hsCode)

  const COLUMN_WIDTHS = {
    region: 40,
    taxType: 40,
    rate: 40,
    taxName: 320,
  }
  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-4xl h-auto max-h-[98vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle>Thuế thuộc HS code {hsCode}</DialogTitle>
        </DialogHeader>
        <div className="mt-2 overflow-y-auto">
          <Table className="table-fixed">
            <TableHeader>
              <TableRow>
                <TableHead style={{ width: `${COLUMN_WIDTHS.region}px` }}>Quốc gia</TableHead>
                <TableHead style={{ width: `${COLUMN_WIDTHS.taxType}px` }}>Loại thuế</TableHead>
                <TableHead style={{ width: `${COLUMN_WIDTHS.rate}px` }}>Tỉ lệ</TableHead>
                <TableHead style={{ width: `${COLUMN_WIDTHS.taxName}px` }}>Tên thuế</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {isLoading ? (
                <TableRow>
                  <TableCell colSpan={4} className="text-center text-muted-foreground">Đang tải...</TableCell>
                </TableRow>
              ) : (taxRates && taxRates.length > 0) ? (
                taxRates.map((t) => (
                  <TableRow key={t.id}>
                    <TableCell style={{ width: `${COLUMN_WIDTHS.region}px` }}>{t.region}</TableCell>
                    <TableCell style={{ width: `${COLUMN_WIDTHS.taxType}px` }}>{t.taxType}</TableCell>
                    <TableCell style={{ width: `${COLUMN_WIDTHS.rate}px` }}>{t.rate}%</TableCell>
                    <TableCell style={{ width: `${COLUMN_WIDTHS.taxName}px` }}>{t.taxName}</TableCell>
                  </TableRow>
                ))
              ) : (
                <TableRow>
                  <TableCell colSpan={4} className="text-center text-muted-foreground">Không tìm thấy thuế cho HS code {hsCode}</TableCell>
                </TableRow>
              )}
            </TableBody>
          </Table>
        </div>
        <DialogFooter>
          <DialogClose>
            <Button variant="outline">Đóng</Button>
          </DialogClose>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  )
}

export default TaxRateByHSDialog