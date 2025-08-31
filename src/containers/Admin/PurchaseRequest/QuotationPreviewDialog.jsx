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
import { PACKAGE_TYPE } from "@/const/packageType";
import { Separator } from "@/components/ui/separator";

export default function QuotationPreviewDialog({ subRequest, values, quotationDetails, handleSubmit }) {
  const [open, setOpen] = useState(false);
  const [calculateQuotation, { isLoading: calculateQuotationLoading, data: quotation }] = useCalculateQuotationMutation();
  const [activeTab, setActiveTab] = useState("summary");

  // Sync the active tab to the first item when quotation data arrives
  useEffect(() => {
    if (quotation?.details?.length) {
      setActiveTab("summary");
    }
  }, [quotation?.details]);

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <Button
        type="button"
        variant="outline"
        disabled={calculateQuotationLoading}
        onClick={async () => {
          const expiredDate = Date.now() + 3 * 24 * 60 * 60 * 1000; // default 3 days
          const details = quotationDetails.map((d) => ({
            requestItemId: d.requestItemId,
            quantity: d.quantity,
            hsCodeId: d.hsCodeId,
            basePrice: Number(d.basePrice ?? 0),
            serviceFee: Number(d.serviceFee ?? 0),
            note: d.note,
          }));
          const payload = {
            subRequestId: subRequest.id,
            note: values.note,
            shippingEstimate: Number(values.shippingEstimate),
            details,
            expiredDate,
            totalWeightEstimate: Number(values.totalWeightEstimate || 0),
            packageType: values.packageType,
            shipper: { ...values.shipper },
            recipient: { ...values.recipient },
            region: values.region,
            currency: values.currency,
          };
          await calculateQuotation(payload).unwrap().then(() => {
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
            <TabsTrigger value="summary" className="capitalize">Tổng quan</TabsTrigger>
            <TabsTrigger value="shipment" className="capitalize">Vận chuyển</TabsTrigger>
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
                      <TableCell className="break-all">{detail.productName}</TableCell>
                      <TableCell className="break-all">
                        {formatCurrency(detail.totalVNDPrice, "VND", getLocaleCurrencyFormat("VND"))}
                      </TableCell>
                    </TableRow>
                  ))}
                  <TableRow>
                    <TableCell>Tổng tiền dự kiến</TableCell>
                    <TableCell className="break-all">
                      {formatCurrency((quotation?.totalPriceEstimate + quotation?.shippingEstimate), "VND", getLocaleCurrencyFormat("VND"))}
                    </TableCell>
                  </TableRow>
                </TableBody>
              </Table>
            </div>
          </TabsContent>
          {/* Shipment Tab */}
          <TabsContent value="shipment" className="space-y-6">
            {/* Shipping summary */}
            <div className="overflow-x-auto">
              <div className="font-semibold mb-2">Tóm tắt vận chuyển</div>
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Thông tin</TableHead>
                    <TableHead>Giá trị</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  <TableRow>
                    <TableCell>Tổng trọng lượng ước tính</TableCell>
                    <TableCell className="break-all">{quotation?.totalWeightEstimate ?? "-"}</TableCell>
                  </TableRow>
                  <TableRow>
                    <TableCell>Loại kiện hàng</TableCell>
                    <TableCell className="break-all">{PACKAGE_TYPE.find((p) => p.type === quotation?.packageType)?.value ?? quotation?.packageType ?? "-"}</TableCell>
                  </TableRow>
                </TableBody>
              </Table>
            </div>

            {/* Addresses */}
            <div className="grid grid-cols-1 md:grid-cols-[1fr_auto_1fr] gap-6 items-stretch">
              <div className="overflow-x-auto">
                <div className="font-semibold mb-2">Người gửi</div>
                <Table>
                  <TableBody>
                    <TableRow>
                      <TableCell className="font-medium">Họ tên</TableCell>
                      <TableCell className="break-words">{quotation?.shipper?.shipmentName || "-"}</TableCell>
                    </TableRow>
                    <TableRow>
                      <TableCell className="font-medium">Số điện thoại</TableCell>
                      <TableCell className="break-words">{quotation?.shipper?.shipmentPhone || "-"}</TableCell>
                    </TableRow>
                    <TableRow>
                      <TableCell className="font-medium">Địa chỉ</TableCell>
                      <TableCell className="break-words">{quotation?.shipper?.shipmentStreetLine || "-"}</TableCell>
                    </TableRow>
                    <TableRow>
                      <TableCell className="font-medium">Thành phố</TableCell>
                      <TableCell className="break-words">{quotation?.shipper?.shipmentCity || "-"}</TableCell>
                    </TableRow>
                    <TableRow>
                      <TableCell className="font-medium">Mã bưu chính</TableCell>
                      <TableCell className="break-words">{quotation?.shipper?.shipmentPostalCode || "-"}</TableCell>
                    </TableRow>
                    <TableRow>
                      <TableCell className="font-medium">Quốc gia</TableCell>
                      <TableCell className="break-words">{quotation?.shipper?.shipmentCountryCode || "-"}</TableCell>
                    </TableRow>
                    {quotation?.shipper?.shipmentCountryCode === "US" && (
                      <TableRow>
                        <TableCell className="font-medium">Tiểu bang</TableCell>
                        <TableCell className="break-words">{quotation?.shipper?.shipmentStateOrProvinceCode || "-"}</TableCell>
                      </TableRow>
                    )}
                  </TableBody>
                </Table>
              </div>
              <Separator orientation="vertical" className="hidden md:block h-full w-px bg-border self-stretch justify-self-center" />
              <div className="overflow-x-auto">
                <div className="font-semibold mb-2">Người nhận</div>
                <Table>
                  <TableBody>
                    <TableRow>
                      <TableCell className="font-medium">Họ tên</TableCell>
                      <TableCell className="break-words">{quotation?.recipient?.recipientName || "-"}</TableCell>
                    </TableRow>
                    <TableRow>
                      <TableCell className="font-medium">Số điện thoại</TableCell>
                      <TableCell className="break-words">{quotation?.recipient?.recipientPhone || "-"}</TableCell>
                    </TableRow>
                    <TableRow>
                      <TableCell className="font-medium">Địa chỉ</TableCell>
                      <TableCell className="break-words">{quotation?.recipient?.recipientStreetLine || "-"}</TableCell>
                    </TableRow>
                    <TableRow>
                      <TableCell className="font-medium">Thành phố</TableCell>
                      <TableCell className="break-words">{quotation?.recipient?.recipientCity || "-"}</TableCell>
                    </TableRow>
                    <TableRow>
                      <TableCell className="font-medium">Mã bưu chính</TableCell>
                      <TableCell className="break-words">{quotation?.recipient?.recipientPostalCode || "-"}</TableCell>
                    </TableRow>
                    <TableRow>
                      <TableCell className="font-medium">Quốc gia</TableCell>
                      <TableCell className="break-words">{quotation?.recipient?.recipientCountryCode || "-"}</TableCell>
                    </TableRow>
                    {quotation?.recipient?.recipientCountryCode === "US" && (
                      <TableRow>
                        <TableCell className="font-medium">Tiểu bang</TableCell>
                        <TableCell className="break-words">{quotation?.recipient?.recipientStateOrProvinceCode || "-"}</TableCell>
                      </TableRow>
                    )}
                  </TableBody>
                </Table>
              </div>
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
                      <TableHead>Tỷ giá ({(detail.currency || values.currency)}/VND)</TableHead>
                      <TableHead>Ghi chú</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    <TableRow>
                      <TableCell className="break-words">{detail.productName ? `${detail.productName.slice(0, 40)}...` : `Sản phẩm ${idx + 1}`}</TableCell>
                      <TableCell>{formatCurrency(detail.basePrice, (detail.currency || values.currency), getLocaleCurrencyFormat((detail.currency || values.currency)))}</TableCell>
                      <TableCell>{formatCurrency(detail.serviceFee, (detail.currency || values.currency), getLocaleCurrencyFormat((detail.currency || values.currency)))}</TableCell>
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
                        <TableCell>{formatCurrency(detail.taxAmounts?.[tax.taxType] || "0", (detail.currency || values.currency), getLocaleCurrencyFormat((detail.currency || values.currency)))}</TableCell>
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
                      <TableCell className="break-all">{formatCurrency(detail.totalTaxAmount.toFixed(2), (detail.currency || values.currency), getLocaleCurrencyFormat((detail.currency || values.currency)))}</TableCell>
                      <TableCell className="break-all">{formatCurrency(detail.totalPriceBeforeExchange.toFixed(2), (detail.currency || values.currency), getLocaleCurrencyFormat((detail.currency || values.currency)))}</TableCell>
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
          <Button onClick={handleSubmit} type="button" className="mt-2 w-full bg-green-600 hover:bg-green-700">
            Gửi báo giá
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
