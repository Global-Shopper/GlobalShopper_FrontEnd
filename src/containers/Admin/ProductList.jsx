import { Card, CardHeader, CardTitle, CardContent, CardDescription } from "@/components/ui/card"
import { Package, ExternalLink } from "lucide-react"
import { SubRequestDetails } from "./SubRequestDetails"
import React from "react";
import { Button } from "@/components/ui/button";
import { QuotationForm } from "./QuotationForm";
import { useDispatch, useSelector } from "react-redux";
import { toggleExpandProductQuotation, setItemDetail } from "@/features/quotation";

export function ProductList({
  requestItems,
  subRequests,
  expandedSubRequest,
  status,
  onToggleSubRequestExpansion,
  requestType,
  onProductClick,
}) {
  // Redux hooks for expanded state
  const dispatch = useDispatch();
  const quotationState = useSelector(state => state.rootReducer.quotation);

  // Render a single product card, always with explicit subRequestId
  const renderProductCard = (item, index, subRequestId, status) => {
    // Use subRequestId directly for Redux selectors and actions
    const expandedProductForms = subRequestId
      ? quotationState?.subRequests?.[subRequestId]?.expandedProductForms || {}
      : quotationState?.expandedProductForms || {};
    // Use item.requestItemId for subrequest items, item.id for main
    const requestItemId = item.requestItemId || item.id;
    const isProductFormOpen = expandedProductForms[requestItemId];
    // Get product object and index from Redux
    let product = item;
    let productIndex = index;
    if (subRequestId && quotationState?.subRequests?.[subRequestId]?.itemDetails) {
      productIndex = quotationState.subRequests[subRequestId].itemDetails.findIndex(
        d => d.requestItemId === requestItemId || d.id === requestItemId
      );
      product = quotationState.subRequests[subRequestId].itemDetails[productIndex] || item;
    }
    // No validation for now
    const productErrors = {};
    return (
      <Card
        key={requestItemId}
        className={`transition-all hover:shadow-md ${isProductFormOpen ? 'shadow-lg ring-2 ring-blue-200 bg-blue-50' : ''}`}
        onClick={() => onProductClick(item.id)}
      >
        <CardContent className="p-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3 min-w-0 flex-1">
              <span
                className={`text-xs px-2 py-1 rounded shrink-0 ${
                  subRequestId ? "bg-orange-100 text-orange-600" : "bg-gray-100 text-orange-600"
                }`}
              >
                #{index + 1}
              </span>
              <span className="font-semibold text-base truncate">{item.productName}</span>
            </div>
            <div className="flex items-center gap-3">
              <span className={`font-bold text-lg ${subRequestId ? "text-orange-600" : "text-blue-600"}`}>
                ×{item.quantity}
              </span>
            </div>
          </div>
          <div className="flex justify-start mt-3">
            <a
              href={item.productURL}
              target="_blank"
              rel="noopener noreferrer"
              className="flex items-center justify-start gap-1 text-blue-600 hover:underline text-sm"
              onClick={e => e.stopPropagation()}
            >
              <ExternalLink className="h-4 w-4" />
              Xem sản phẩm
            </a>
          </div>
          {/* Quote button and inline form */}
          {status === "CHECKING" && 
          <>
            <div className="flex justify-end mt-3">
              <Button
                variant={isProductFormOpen ? "secondary" : "outline"}
                size="sm"
                type="button"
                onClick={e => {
                  e.stopPropagation();
                  dispatch(toggleExpandProductQuotation({ subRequestId, requestItemId }))
                }}
              >
                {isProductFormOpen ? "Đóng báo giá" : "Báo giá sản phẩm"}
              </Button>
            </div>
            {isProductFormOpen && (
              <div className="mt-3">
                <QuotationForm
                  product={product}
                  errors={productErrors}
                  onChange={(field, value) => {
                    dispatch(setItemDetail({
                      subRequestId,
                      itemIndex: productIndex,
                      field,
                      value
                    }));
                  }}
                />
              </div>
            )}
          </>}
        </CardContent>
      </Card>
    );
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Package className="h-5 w-5" />
          Danh sách sản phẩm
        </CardTitle>
        <CardDescription>
          {status === "SENT"
            ? "Xem thông tin sản phẩm trong yêu cầu mua hàng"
            : "Chọn sản phẩm để xem chi tiết và nhập giá báo giá"}
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-4">
        {/* Render main requestItems if any */}
        {requestItems?.length > 0 && (
          <div>
            <h3 className="font-semibold mb-3 text-lg">Sản phẩm chưa được tạo nhóm</h3>
            <div className="space-y-2">{requestItems.map((item, index) => renderProductCard(item, index, null, status))}</div>
          </div>
        )}

        {/* Consolidated SubRequests */}
        {subRequests?.map((sub, idx) => (
          <SubRequestDetails
            key={idx}
            subRequest={sub}
            index={idx}
            isExpanded={expandedSubRequest === idx}
            onToggleExpansion={onToggleSubRequestExpansion}
            requestType={requestType}
          >
            {sub.requestItems.map((item, itemIndex) => renderProductCard(item, itemIndex, sub.id, status))}
          </SubRequestDetails>
        ))}
      </CardContent>
    </Card>
  )
}
