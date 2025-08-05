import React, { useState } from 'react';
import { Badge } from "@/components/ui/badge";
import { Card, CardContent } from "@/components/ui/card";
import { Table, TableBody, TableCell, TableRow } from "@/components/ui/table";
import { Separator } from "@/components/ui/separator";
import { formatCurrency, getLocaleCurrencyFormat } from "@/utils/formatCurrency";
import { getStatusColor, getStatusText } from "@/utils/statusHandler";
import productDefaultImage from "@/assets/productDefault.png";
import { useCheckoutMutation } from '@/services/gshopApi';
import { toast } from 'sonner';

function StatusBadge({ status }) {
  const color = getStatusColor(status);
  const text = getStatusText(status);
  return (
    <span className={`inline-block px-2 py-1 rounded text-xs font-semibold border ${color}`}>
      {text || "Chưa xác định"}
    </span>
  );
}

function SubRequestItemCard({ item }) {
  const [open, setOpen] = useState(false);
  const q = item.quotationDetail;
  
  return (
    <div>
      <div className="flex flex-col gap-2 mb-4 p-3 bg-white rounded border border-gray-100 shadow-sm">
        {/* Top row: product info left, price right */}
        <div className="flex items-start justify-between w-full">
          <div className="flex items-start gap-4 flex-1">
            {item.images?.length > 0 ? (
              item.images.map((image) => (
                <img key={image} src={image} alt={item.productName} className="w-20 h-20 object-cover rounded border" />
              ))
            ) : (
              <img src={productDefaultImage} alt={item.productName} className="w-20 h-20 object-cover rounded border" />
            )}
            <div>
              <div className="font-semibold text-gray-900">{item.productName}</div>
              <div className="text-xs text-gray-500 mb-1">{item.variants?.join(", ")}</div>
              <div className="text-gray-700 mb-1">{item.description}</div>
              <div className="text-gray-500 text-xs">Số lượng: {item.quantity}</div>
            </div>
          </div>
          {q && q.totalVNDPrice && (
            <div className="flex flex-col items-end min-w-[110px]">
              <span className="text-green-600 font-bold text-base">{q.totalVNDPrice.toLocaleString()} VND</span>
            </div>
          )}
        </div>
        {/* Expand/collapse and quotation detail */}
        {q && (
          <div className="mt-2">
            <button
              type="button"
              className="flex items-center gap-2 text-green-700 font-semibold text-sm focus:outline-none select-none"
              onClick={() => setOpen((prev) => !prev)}
              aria-expanded={open}
            >
              <span>Chi tiết báo giá</span>
              <svg
                className={`transition-transform duration-300 w-4 h-4 ${open ? 'rotate-90' : ''}`}
                fill="none"
                stroke="currentColor"
                viewBox="0 0 20 20"
              >
                <path d="M6 8l4 4 4-4" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
              </svg>
            </button>
            <div
              className={`transition-all duration-300 overflow-hidden ${open ? 'max-h-[1000px] opacity-100' : 'max-h-0 opacity-0'}`}
              style={{ willChange: 'max-height, opacity' }}
            >
              {open && (
                <Card className="mt-2 bg-green-50 border-green-200">
                  <CardContent className="py-3 px-4">
                    <div className="font-semibold text-green-700 mb-2">Báo giá sản phẩm</div>
                    <Table className="border rounded overflow-hidden">
                      <TableBody>
                        <TableRow className="border-b">
                          <TableCell className="text-gray-600">Giá gốc</TableCell>
                          <TableCell>
                            <span className="font-semibold">
                              {formatCurrency(q.basePrice, q.currency, getLocaleCurrencyFormat(q.currency))}
                            </span>
                            <Badge variant="outline" className="ml-2">{q.currency}</Badge>
                          </TableCell>
                        </TableRow>
                        <TableRow className="border-b">
                          <TableCell className="text-gray-600">Phí dịch vụ</TableCell>
                          <TableCell>
                            {formatCurrency(q.serviceFee, q.currency, getLocaleCurrencyFormat(q.currency))}
                          </TableCell>
                        </TableRow>
                        <TableRow className="border-b">
                          <TableCell className="text-gray-600">Tỉ giá</TableCell>
                          <TableCell>
                            {formatCurrency(parseInt(q.exchangeRate), 'VND', getLocaleCurrencyFormat('VND'))} / {q.currency}
                          </TableCell>
                        </TableRow>
                        <TableRow className="border-b">
                          <TableCell className="text-gray-600">Tổng trước quy đổi</TableCell>
                          <TableCell>
                            {formatCurrency(q.totalPriceBeforeExchange, q.currency, getLocaleCurrencyFormat(q.currency))}
                          </TableCell>
                        </TableRow>
                        {q.taxRates?.map((tax, idx) => (
                          <TableRow key={idx} className="border-b">
                            <TableCell className="text-gray-600">
                              {tax.taxType} ({tax.rate}%){tax.region ? ` - ${tax.region}` : ''}
                            </TableCell>
                            <TableCell>
                              {q.taxAmounts?.[tax.taxType] ?
                                formatCurrency(q.taxAmounts[tax.taxType], q.currency, getLocaleCurrencyFormat(q.currency)) :
                                '-'}
                            </TableCell>
                          </TableRow>
                        ))}
                        {q.totalTaxAmount > 0 && (
                          <TableRow className="border-b">
                            <TableCell className="text-gray-600">Tổng thuế</TableCell>
                            <TableCell>{formatCurrency(q.totalTaxAmount, q.currency, getLocaleCurrencyFormat(q.currency))} <Badge variant="outline">{q.currency}</Badge></TableCell>
                          </TableRow>
                        )}
                      </TableBody>
                    </Table>
                    <Separator className="my-2" />
                    <div className="flex justify-between font-bold text-green-800 text-base">
                      <span>Tổng tiền (VND):</span>
                      <span>{q.totalVNDPrice?.toLocaleString()} VND</span>
                    </div>
                    {q.note && <div className="text-xs text-gray-400 mt-1">Ghi chú: {q.note}</div>}
                  </CardContent>
                </Card>
              )}
            </div>
          </div>
        )}
      </div>
    </div>
  );
}

function SubRequestCard({ subRequest, expired }) {
  const [checkout, { isLoading: isCheckoutLoading }] = useCheckoutMutation();
  const handlePaySubRequest = (subRequest) => {
    checkout({subRequestId: subRequest?.id, totalPriceEstimate: subRequest?.quotationForPurchase?.totalPriceEstimate})
    .unwrap()
    .then(() => {
      toast.success("Thanh toán thành công");
    })
    .catch((error) => {
      toast.error("Thanh toán thất bại", {
        description: error?.data?.message || "Đã xảy ra lỗi khi thanh toán. Vui lòng thử lại sau.",
      })
    });
    // TODO: Integrate payment logic/modal here
  };
  return (
    <div className="relative mb-6 p-4 bg-white rounded-lg shadow border border-gray-200">
      <div className="flex items-center gap-4 mb-2">
        <div className="font-semibold text-gray-800">
          {subRequest?.ecommercePlatform ? (
            <span>{subRequest?.seller} ({subRequest?.ecommercePlatform})</span>
          ) : (
            <span>{subRequest?.contactInfo[0]}</span>
          )}
        </div>
        <StatusBadge status={subRequest?.status} />
      </div>
      <div className="mb-2">
        {subRequest.requestItems?.map((item) => (
          <SubRequestItemCard key={item.id} item={item} />
        ))}
      </div>
      <div>
        {subRequest.quotationForPurchase ? (
          <div className="mb-2 p-3 bg-blue-50 border border-blue-200 rounded">
            {subRequest.quotationForPurchase.note && (
              <div className="text-xs text-gray-500">Ghi chú: {subRequest.quotationForPurchase.note}</div>
            )}
            <div className="text-xs text-gray-700">
              Phí vận chuyển: <span className="font-semibold">
                {subRequest.quotationForPurchase.shippingEstimate?.toLocaleString() || '0'} VND
              </span>
            </div>
          </div>
        ) : (
          <div className="mt-3 p-3 bg-yellow-50 border border-yellow-200 rounded text-sm text-yellow-700">
            Đang chờ báo giá
          </div>
        )}
      </div>
      {subRequest.status === "QUOTED" && (
        <button
          className={`mt-2 px-4 py-2 rounded shadow ${expired
            ? 'bg-gray-300 text-gray-500 cursor-not-allowed'
            : 'bg-gradient-to-r from-green-500 to-green-600 text-white hover:from-green-600 hover:to-green-700'
            }`}
          onClick={() => handlePaySubRequest(subRequest)}
          disabled={expired || isCheckoutLoading}
        >
          {expired ? 'Đã hết hạn thanh toán' : `Thanh toán ${subRequest.quotationForPurchase.totalPriceEstimate?.toLocaleString()} VND`}
        </button>
      )}
    </div>
  );
}

export default SubRequestCard;
