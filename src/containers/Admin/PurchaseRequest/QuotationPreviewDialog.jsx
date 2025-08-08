import React, { useEffect, useState } from "react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from "@/components/ui/dialog";
import { Tabs, TabsList, TabsTrigger, TabsContent } from "@/components/ui/tabs";
import {
  Table,
  TableHeader,
  TableRow,
  TableHead,
  TableBody,
  TableCell,
} from "@/components/ui/table";
import { Button } from "@/components/ui/button";
import { useCalculateQuotationMutation } from "@/services/gshopApi";
import { toast } from "sonner";
import { Tooltip, TooltipContent, TooltipTrigger } from "@/components/ui/tooltip";
import { formatCurrency, getLocaleCurrencyFormat } from "@/utils/formatCurrency";

export default function QuotationPreviewDialog({ subRequest, values, quotationDetails, handleSubmit }) {
  const [open, setOpen] = useState(false);
  const [calculateQuotation, { isLoading: calculateQuotationLoading, data: quotation }] = useCalculateQuotationMutation();
  const [activeTab, setActiveTab] = useState("summary");
  console.log(quotation);

  // Sync the active tab to the first item when quotation data arrives
  useEffect(() => {
    if (quotation?.details?.length) {
      setActiveTab("summary");
    }
  }, [quotation?.details]);

  // const handleSubmit = async () => {
  //   try {
  //     await onSubmit(quotation);
  //     toast.success("Gửi báo giá thành công!");
  //     onClose();
  //   } catch (err) {
  //     toast.error("Gửi báo giá thất bại!" + (err?.data?.message ? `: ${err.data.message}` : ""));
  //   }
  // };

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <Button
        type="button"
        variant="outline"
        disabled={calculateQuotationLoading}
        onClick={async () => {
          await calculateQuotation({
            subRequestId: subRequest.id,
            note: values.note,
            shippingEstimate: Number(values.shippingEstimate),
            details: quotationDetails,
            expiredDate: 1
          }).unwrap().then(() => {
            setOpen(true);
          }).catch((err) => {
            setOpen(false);
            toast.error("Báo giá không hợp lệ" + (err?.data?.message ? `: ${err.data.message}` : ""));
          });
        }}
      >
        {calculateQuotationLoading ? "Đang tải..." : "Xem trước báo giá"}
      </Button>
      <DialogContent className="max-w-[90vw] sm:max-w-4xl max-h-[95vh] overflow-y-auto overflow-x-hidden">
        <DialogHeader>
          <DialogTitle>Chi tiết báo giá nhóm</DialogTitle>
        </DialogHeader>
        <Tabs
          value={activeTab}
          onValueChange={setActiveTab}
          className="mt-4"
        >
          <TabsList className="mb-4 overflow-x-auto whitespace-nowrap">
            {console.log(quotation)}
            <TabsTrigger value="summary" className="capitalize">Tổng quan</TabsTrigger>
            {quotation?.details?.map((detail, idx) => (
              <TabsTrigger
                key={detail.requestItemId}
                value={detail.requestItemId}
                className="capitalize"
              >
                <Tooltip>
                  <TooltipTrigger>{detail.productName ? `${detail.productName.slice(0, 20)}...` : `Sản phẩm ${idx + 1}`}</TooltipTrigger>
                  <TooltipContent>
                    {detail.productName}
                  </TooltipContent>
                </Tooltip>
              </TabsTrigger>
            ))}
          </TabsList>
          {/* Summary Tab */}
          <TabsContent value="summary" className="space-y-6">
            <div className="overflow-x-auto">
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Hạng mục</TableHead>
                    <TableHead>Số tiền</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {quotation?.details?.map((detail, idx) => (
                    <TableRow key={idx}>
                      <TableCell>{detail.productName}</TableCell>
                      <TableCell className="break-all">
                        {formatCurrency(detail.totalVNDPrice, "VND", getLocaleCurrencyFormat("VND"))}
                      </TableCell>
                    </TableRow>
                  ))}
                  <TableRow>
                    <TableCell>Phí vận chuyển</TableCell>
                    <TableCell className="break-all">
                      {formatCurrency(quotation?.shippingEstimate, "VND", getLocaleCurrencyFormat("VND"))}
                    </TableCell>
                  </TableRow>
                  <TableRow>
                    <TableCell>Tổng tiền dự kiến</TableCell>
                    <TableCell className="break-all">
                      {formatCurrency(quotation?.totalPriceEstimate, "VND", getLocaleCurrencyFormat("VND"))}
                    </TableCell>
                  </TableRow>
                </TableBody>
              </Table>
            </div>
          </TabsContent>
          {quotation?.details?.map((detail, idx) => (
            <TabsContent
              key={detail.requestItemId}
              value={detail.requestItemId}
              className="space-y-6"
            >
              {/* Product Info Table */}
              <div className="overflow-x-auto w-full">
                <Table className="w-full">
                  <TableHeader>
                    <TableRow>
                      <TableHead>Tên sản phẩm</TableHead>
                      <TableHead>Giá gốc</TableHead>
                      <TableHead>Phí dịch vụ</TableHead>
                      <TableHead>Tỷ giá ({detail.currency}/VND)</TableHead>
                      <TableHead>Ghi chú</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {console.log(detail)}
                    <TableRow>
                      <TableCell className="break-words">{detail.productName ? `${detail.productName.slice(0, 40)}...` : `Sản phẩm ${idx + 1}`}</TableCell>
                      <TableCell>{formatCurrency(detail.basePrice, detail.currency, getLocaleCurrencyFormat(detail.currency))}</TableCell>
                      <TableCell>{formatCurrency(detail.serviceFee, detail.currency, getLocaleCurrencyFormat(detail.currency))}</TableCell>
                      <TableCell>{parseInt(detail.exchangeRate)}</TableCell>
                      <TableCell className="break-words">{detail.note}</TableCell>
                    </TableRow>
                  </TableBody>
                </Table>
              </div>

              {/* Tax Table */}
              <div className="overflow-x-auto">
                <div className="font-semibold mb-2">Chi tiết thuế và chi phí</div>
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>Khu vực</TableHead>
                      <TableHead>Loại thuế</TableHead>
                      <TableHead>Tên thuế</TableHead>
                      <TableHead>Tỷ lệ (%)</TableHead>
                      <TableHead>Số tiền</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {detail.taxRates?.map((tax, tIdx) => (
                      <TableRow key={tIdx}>
                        <TableCell>{tax.region}</TableCell>
                        <TableCell>{tax.taxType}</TableCell>
                        <TableCell className="break-words max-w-[320px]">{tax.taxName || "-"}</TableCell>
                        <TableCell>{tax.rate}</TableCell>
                        <TableCell>{formatCurrency(detail.taxAmounts?.[tax.taxType] || "0", detail.currency, getLocaleCurrencyFormat(detail.currency))}</TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </div>

              {/* Calculation Table */}
              <div className="overflow-x-auto">
                <div className="font-semibold mb-2">Tổng kết</div>
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>Tổng thuế</TableHead>
                      <TableHead>Tổng trước quy đổi</TableHead>
                      <TableHead>Tổng tiền (VND)</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    <TableRow>
                      <TableCell className="break-all">{formatCurrency(detail.totalTaxAmount.toFixed(2), detail.currency, getLocaleCurrencyFormat(detail.currency))}</TableCell>
                      <TableCell className="break-all">{formatCurrency(detail.totalPriceBeforeExchange.toFixed(2), detail.currency, getLocaleCurrencyFormat(detail.currency))}</TableCell>
                      <TableCell className="break-all">{formatCurrency(parseInt(detail.totalVNDPrice), "VND", getLocaleCurrencyFormat("VND"))}</TableCell>
                    </TableRow>
                  </TableBody>
                </Table>
              </div>
            </TabsContent>
          ))}
        </Tabs>
        {/* Footer: summary and submit */}
        <DialogFooter className="flex flex-col gap-2 mt-6">
          <Button onClick={handleSubmit} type="button" className="mt-2 w-full">
            Gửi báo giá
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
