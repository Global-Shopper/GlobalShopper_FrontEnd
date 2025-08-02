import React from 'react';
import { Badge } from "@/components/ui/badge";
import { Card, CardContent } from "@/components/ui/card";
import { Table, TableBody, TableCell, TableRow } from "@/components/ui/table";
import { Separator } from "@/components/ui/separator";
import { formatCurrency, getLocaleCurrencyFormat } from "@/utils/formatCurrency";
import { getStatusColor, getStatusText } from "@/utils/statusHandler";

function StatusBadge({ status }) {
  const color = getStatusColor(status);
  const text = getStatusText(status);
  return (
    <span className={`inline-block px-2 py-1 rounded text-xs font-semibold border ${color}`}>
      {text || "Chưa xác định"}
    </span>
  );
}

function RequestItemCard({ item }) {
  const q = item.quotationDetail;
  return (
    <div className="flex gap-4 mb-4 p-3 bg-white rounded border border-gray-100 shadow-sm">
      <img src={item.images?.[0]} alt={item.productName} className="w-20 h-20 object-cover rounded border" />
      <div className="flex-1">
        <div className="font-semibold text-gray-900">{item.productName}</div>
        <div className="text-xs text-gray-500 mb-1">{item.variants?.join(", ")}</div>
        <div className="text-gray-700 mb-1">{item.description}</div>
        <div className="text-gray-500 text-xs">Số lượng: {item.quantity}</div>
        {q && (
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
                      {formatCurrency(q.serviceFee, 'VND', getLocaleCurrencyFormat('VND'))}
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
                  {q.taxRates?.map((rate, idx) => (
                    <TableRow key={idx} className="border-b">
                      <TableCell className="text-gray-600">Thuế ({rate}%)</TableCell>
                      <TableCell>{q.taxAmounts?.[rate] ? q.taxAmounts[rate].toLocaleString() + ' VND' : '-'}</TableCell>
                    </TableRow>
                  ))}
                  {q.totalTaxAmount > 0 && (
                    <TableRow className="border-b">
                      <TableCell className="text-gray-600">Tổng thuế</TableCell>
                      <TableCell>{q.totalTaxAmount.toLocaleString()} <Badge variant="outline">VND</Badge></TableCell>
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
  );
}

function SubRequestCard({ subRequest, expired, onPay }) {
  return (
    <div className="mb-6 p-4 bg-white rounded-lg shadow border border-gray-200">
      <div className="flex items-center gap-4 mb-2">
        <div className="font-semibold text-gray-800">
          {subRequest.seller} ({subRequest.ecommercePlatform})
        </div>
        <StatusBadge status={subRequest.status} />
      </div>
      <div className="mb-2">
        {subRequest.requestItems?.map((item) => (
          <RequestItemCard key={item.id} item={item} />
        ))}
      </div>
      {subRequest.quotationForPurchase ? (
        <div className="mb-2 p-3 bg-blue-50 border border-blue-200 rounded">
          <div className="font-semibold text-blue-700 mb-1">Báo giá tổng:</div>
          <div className="text-xs text-gray-700">
            Tổng dự kiến: <span className="font-semibold">
              {subRequest.quotationForPurchase.totalPriceEstimate?.toLocaleString() || '0'} VND
            </span>
          </div>
          <div className="text-xs text-gray-700">
            Phí vận chuyển: <span className="font-semibold">
              {subRequest.quotationForPurchase.shippingEstimate?.toLocaleString() || '0'} VND
            </span>
          </div>
          {subRequest.quotationForPurchase.note && (
            <div className="text-xs text-gray-500">Ghi chú: {subRequest.quotationForPurchase.note}</div>
          )}
        </div>
      ) : (
        <div className="mt-3 p-3 bg-yellow-50 border border-yellow-200 rounded text-sm text-yellow-700">
          Đang chờ báo giá
        </div>
      )}
      {subRequest.status === "QUOTED" && (
        <button
          className={`mt-2 px-4 py-2 rounded shadow ${expired
              ? 'bg-gray-300 text-gray-500 cursor-not-allowed'
              : 'bg-gradient-to-r from-green-500 to-green-600 text-white hover:from-green-600 hover:to-green-700'
            }`}
          onClick={() => onPay(subRequest)}
          disabled={expired}
        >
          {expired ? 'Đã hết hạn thanh toán' : 'Thanh toán đơn này'}
        </button>
      )}
    </div>
  );
}

export default SubRequestCard;
