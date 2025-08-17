import { Card, CardContent } from "@/components/ui/card";
import { ExternalLink } from "lucide-react";
import { Tabs, TabsList, TabsTrigger, TabsContent } from "@/components/ui/tabs";
import {
  formatCurrency,
  getLocaleCurrencyFormat,
} from "@/utils/formatCurrency";
import productDefault from "@/assets/productDefault.png";

export function ProductDetail({ product, status, requestType, quotationForPurchase }) {
  const currency = quotationForPurchase?.currency || product?.quotationDetail?.currency;
  return (
    <Card>
      <CardContent className="space-y-4">
        <Tabs defaultValue="product" className="w-full">
          <TabsList className="mb-2">
            <TabsTrigger value="product">Chi tiết sản phẩm</TabsTrigger>
            <TabsTrigger value="quotation">Chi tiết báo giá</TabsTrigger>
          </TabsList>
          <TabsContent value="product">
            <div>
              <h3 className="font-semibold mb-2">{product.productName}</h3>
              <p className="text-sm text-muted-foreground mb-3">
                {product.description}
              </p>
              {/* Product Images */}
              {product.images && product.images.length > 0 && (
                <div className="mb-3">
                  <span className="font-medium text-sm mb-2 block">
                    Hình ảnh sản phẩm:
                  </span>
                  <div className="flex gap-2 overflow-x-auto">
                    {product.images.map((image, idx) => (
                      <img
                        key={idx}
                        src={
                          image ||
                          productDefault
                        }
                        alt={`${product.productName} ${idx + 1}`}
                        className="w-16 h-16 object-contain rounded border flex-shrink-0"
                        onError={(e) => {
                          e.target.src =
                            productDefault;
                        }}
                      />
                    ))}
                  </div>
                </div>
              )}
              <div className="space-y-2 text-sm">
                <div>
                  <span className="font-medium">Số lượng:</span>{" "}
                  {product.quantity}
                </div>
                <div>
                  <span className="font-medium">Link sản phẩm:</span>
                  <a
                    href={product.productURL}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="ml-2 text-blue-600 hover:underline inline-flex items-center gap-1"
                  >
                    <ExternalLink className="h-3 w-3" />
                    Xem chi tiết
                  </a>
                </div>
                {product.variants && product.variants.length > 0 && (
                  <div>
                    <span className="font-medium">Thông số sản phẩm:</span>
                    <ul className="mt-1 space-y-1 text-xs">
                      {product.variants.map((variant, idx) => (
                        <li key={idx} className="bg-gray-50 px-2 py-1 rounded">
                          {variant}
                        </li>
                      ))}
                    </ul>
                  </div>
                )}
              </div>
            </div>
          </TabsContent>
          <TabsContent value="quotation">
            {/* Quotation Detail Section */}
            {product.quotationDetail ? (
              <div className="bg-gray-50 border border-gray-200 rounded-md p-4 mb-4">
                <h4 className="font-semibold mb-2 text-base">
                  Chi tiết báo giá
                </h4>
                <div className="grid grid-cols-1 gap-4 text-sm mb-3">
                  <div>
                    <span className="font-medium">Tiền tệ:</span>{" "}
                    {quotationForPurchase?.currency}
                  </div>
                  <div>
                    <span className="font-medium">Giá gốc:</span>{" "}
                    {formatCurrency(
                      product.quotationDetail.basePrice,
                      quotationForPurchase?.currency || currency,
                      getLocaleCurrencyFormat(quotationForPurchase?.currency || currency)
                    )}
                  </div>
                  <div>
                    <span className="font-medium">Phí dịch vụ:</span>{" "}
                    {formatCurrency(
                      product.quotationDetail.serviceFee,
                      currency,
                      getLocaleCurrencyFormat(currency)
                    )}
                  </div>
                  <div>
                    <span className="font-medium">Ghi chú:</span>{" "}
                    {product.quotationDetail.note || (
                      <span className="italic text-muted-foreground">
                        Không có
                      </span>
                    )}
                  </div>
                </div>
                {/* Tax Rates Table */}
                {requestType === "OFFLINE" && (
                    <div className="mb-3">
                      <span className="font-medium block mb-1">
                        Thuế áp dụng:
                      </span>
                      <table className="w-full text-xs border">
                        <thead>
                          <tr className="bg-gray-100">
                            <th className="border px-2 py-1">Khu vực</th>
                            <th className="border px-2 py-1">Loại thuế</th>
                            <th className="border px-2 py-1">Tỉ lệ (%)</th>
                          </tr>
                        </thead>
                        <tbody>
                          {product.quotationDetail.taxRates.map((tax, idx) => (
                            <tr key={idx}>
                              <td className="border px-2 py-1">{tax.region}</td>
                              <td className="border px-2 py-1">
                                {`${tax.taxName} (${tax.taxType})`}
                              </td>
                              <td className="border px-2 py-1">{tax.rate}</td>
                            </tr>
                          ))}
                        </tbody>
                      </table>
                    </div>
                  )}
                {/* Tax Amounts */}
                {requestType === "OFFLINE" && product.quotationDetail.taxAmounts && (
                  <div className="mb-3">
                    <span className="font-medium block mb-1">Tiền thuế:</span>
                    <ul className="list-disc list-inside text-xs">
                      {Object.entries(product.quotationDetail.taxAmounts).map(
                        ([taxType, amount]) => (
                          <li key={taxType}>
                            {taxType}:{" "}
                            {formatCurrency(
                              amount,
                              currency,
                              getLocaleCurrencyFormat(currency)
                            )}
                          </li>
                        )
                      )}
                    </ul>
                  </div>
                )}
                <div className="grid grid-cols-1 gap-4 text-sm">
                  { requestType === "OFFLINE" &&
                    <div>
                    <span className="font-medium">Tổng tiền thuế:</span>{" "}
                    {formatCurrency(
                      product.quotationDetail.totalTaxAmount,
                      currency,
                      getLocaleCurrencyFormat(currency)
                    )}
                  </div>}
                  <div>
                    <span className="font-medium">Tổng giá trước quy đổi:</span>{" "}
                    {formatCurrency(
                      product.quotationDetail.totalPriceBeforeExchange,
                      currency,
                      getLocaleCurrencyFormat(currency)
                    )}
                  </div>
                  <div>
                    <span className="font-medium">Tổng giá (VNĐ):</span>{" "}
                    {formatCurrency(
                      Math.floor(product.quotationDetail.totalVNDPrice),
                      "VND",
                      getLocaleCurrencyFormat("VND")
                    )}
                  </div>
                </div>
              </div>
            ) : (
              <div className="text-sm text-muted-foreground">
                Chưa có thông tin báo giá.
              </div>
            )}
          </TabsContent>
        </Tabs>
        {status === "SENT" && (
          <div className="bg-yellow-50 border border-yellow-200 text-yellow-700 px-4 py-3 rounded-md">
            <p className="text-sm font-medium">
              Chức năng báo giá chưa khả dụng
            </p>
            <p className="text-sm">
              Vui lòng assign yêu cầu này để bắt đầu quá trình báo giá.
            </p>
          </div>
        )}
      </CardContent>
    </Card>
  );
}
