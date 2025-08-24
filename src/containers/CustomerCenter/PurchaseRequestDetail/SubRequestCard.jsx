import React, { useState } from 'react';
import { Badge } from "@/components/ui/badge";
import { Card, CardContent } from "@/components/ui/card";
import { Table, TableBody, TableCell, TableRow } from "@/components/ui/table";
import { Separator } from "@/components/ui/separator";
import { formatCurrency, getLocaleCurrencyFormat } from "@/utils/formatCurrency";
import { getStatusColor, getStatusText } from "@/utils/statusHandler";
import productDefaultImage from "@/assets/productDefault.png";
import PaymentDialog from './PaymentDialog';

function StatusBadge({ status }) {
  const color = getStatusColor(status);
  const text = getStatusText(status);
  return (
    <span className={`inline-block px-2 py-1 rounded text-xs font-semibold border ${color}`}>
      {text || "Chưa xác định"}
    </span>
  );
}

function SubRequestItemCard({ item, subRequest }) {
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
                <img key={image} src={image} alt={item.productName} className="w-20 h-20 object-contain rounded border" />
              ))
            ) : (
              <img src={productDefaultImage} alt={item.productName} className="w-20 h-20 object-contain rounded border" />
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
              <span className="text-green-600 font-bold text-base">{formatCurrency(q.totalVNDPrice, "VND", getLocaleCurrencyFormat("VND"))}</span>
            </div>
          )}
        </div>
        {/* Expand/collapse and quotation detail */}
        {q && (
          <div className="mt-2">
            <button
              type="button"
              className="flex items-center gap-2 text-green-700 font-semibold text-sm focus:outline-none select-none hover:opacity-70 hover:text-blue-600"
              onClick={() => setOpen((prev) => !prev)}
              aria-expanded={open}
            >
              <span>Chi tiết báo giá</span>
              <svg
                className={`transition-transform duration-300 w-4 h-4 mt-1 ${open ? 'rotate-180' : ''}`}
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
                              {formatCurrency(q.basePrice, subRequest.quotationForPurchase.currency, getLocaleCurrencyFormat(subRequest.quotationForPurchase.currency))}
                            </span>
                            <Badge variant="outline" className="ml-2">{subRequest.quotationForPurchase.currency}</Badge>
                          </TableCell>
                        </TableRow>
                        <TableRow className="border-b">
                          <TableCell className="text-gray-600">Phí dịch vụ</TableCell>
                          <TableCell>
                            {formatCurrency(q.serviceFee, subRequest.quotationForPurchase.currency, getLocaleCurrencyFormat(subRequest.quotationForPurchase.currency))}
                          </TableCell>
                        </TableRow>
                        {q.taxRates?.map((tax, idx) => (
                          <TableRow key={idx} className="border-b">
                            <TableCell className="text-gray-600">
                              {tax.taxType} ({tax.rate}%){tax.region ? ` - ${tax.region}` : ''}
                            </TableCell>
                            <TableCell>
                              {q.taxAmounts?.[tax.taxType] ?
                                formatCurrency(q.taxAmounts[tax.taxType], subRequest.quotationForPurchase.currency, getLocaleCurrencyFormat(subRequest.quotationForPurchase.currency)) :
                                '-'}
                            </TableCell>
                          </TableRow>
                        ))}
                        {q.totalTaxAmount > 0 && (
                          <TableRow className="border-b">
                            <TableCell className="text-gray-600">Tổng thuế</TableCell>
                            <TableCell>{formatCurrency(q.totalTaxAmount, subRequest.quotationForPurchase.currency, getLocaleCurrencyFormat(subRequest.quotationForPurchase.currency))}</TableCell>
                          </TableRow>
                        )}
                        <TableRow className="border-b">
                          <TableCell className="text-gray-600">Tổng trước quy đổi</TableCell>
                          <TableCell>
                            {formatCurrency(q.totalPriceBeforeExchange, subRequest.quotationForPurchase.currency, getLocaleCurrencyFormat(subRequest.quotationForPurchase.currency))}
                          </TableCell>
                        </TableRow>
                      </TableBody>
                    </Table>
                    <Separator className="my-2" />
                    <div className="flex justify-between font-bold text-green-800 text-base">
                      <span>Tổng tiền (VND):</span>
                      <span>{formatCurrency(q.totalVNDPrice, "VND", getLocaleCurrencyFormat("VND"))}</span>
                    </div>
                    <div className="flex gap-2 justify-between">
                      {q.note && <div className="text-md text-gray-600 mt-1">Ghi chú của sản phẩm: {q.note}</div>}

                      <div className="text-md text-gray-600 mt-1">
                        Tỉ giá: {parseInt(q.exchangeRate)}{" "}{"VNĐ"} / {subRequest.quotationForPurchase.currency}
                      </div>
                    </div>
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

function SubRequestCard({ subRequest, expired, requestType }) {
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
          <SubRequestItemCard key={item.id} item={item} subRequest={subRequest} requestType={requestType} />
        ))}
      </div>
      <div>
        {subRequest?.status === "QUOTED" || subRequest?.status === "PAID" ? (
          requestType === "ONLINE" &&
          <div className="mb-2 p-3 bg-blue-50 border border-blue-200 rounded">
            {subRequest?.quotationForPurchase?.fees?.map((fee) =>
              <div className="text-sm text-gray-700">
                {fee.feeName}: {formatCurrency(fee.amount, fee.currency, getLocaleCurrencyFormat(fee.currency))}
              </div>
            )}
            <div className="text-sm text-gray-700">
              Phí vận chuyển: <span className="font-semibold">
                {formatCurrency(subRequest.quotationForPurchase.shippingEstimate, "VND", "vn")}
              </span>
            </div>
            {subRequest?.quotationForPurchase?.note && (
              <div className="text-sm text-gray-700">
                Ghi chú của đơn hàng: {subRequest.quotationForPurchase.note}
              </div>
            )}
          </div>
        ) : (
          !expired && <div className="mt-3 p-3 bg-yellow-50 border border-yellow-200 rounded text-sm text-yellow-700">
            Đang chờ báo giá
          </div>
        )}
        <PaymentDialog subRequest={subRequest} expired={expired} requestType={requestType} quotationForPurchase={subRequest.quotationForPurchase} />
      </div>
    </div>
  );
}

export default SubRequestCard;
