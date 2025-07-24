import { Card, CardHeader, CardTitle, CardContent, CardDescription } from "@/components/ui/card"
import { Package, ExternalLink, CheckCircle2, Circle } from "lucide-react"
import { SubRequestDetails } from "./SubRequestDetails"

export function ProductList({
  requestItems,
  subRequests,
  selectedProductId,
  selectedProducts,
  expandedSubRequest,
  status,
  onProductClick,
  onToggleProductSelection,
  onToggleSubRequestExpansion,
  requestType
}) {
  const renderProductCard = (item, index, isSubRequest = false) => (
    <Card
      key={item.id}
      className={`cursor-pointer transition-all hover:shadow-md ${
        selectedProductId === item.id ? "ring-2 ring-primary border-primary bg-primary/5" : "hover:border-gray-300"
      }`}
      onClick={() => onProductClick(item.id)}
    >
      <CardContent className="p-4">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3 min-w-0 flex-1">
            <span
              className={`text-xs px-2 py-1 rounded shrink-0 ${
                isSubRequest ? "bg-orange-100 text-orange-600" : "bg-gray-100 text-gray-600"
              }`}
            >
              #{index + 1}
            </span>
            <span className="font-semibold text-base truncate">{item.productName}</span>
          </div>
          <div className="flex items-center gap-3">
            <span className={`font-bold text-lg ${isSubRequest ? "text-orange-600" : "text-blue-600"}`}>
              ×{item.quantity}
            </span>
            <button
              onClick={(e) => onToggleProductSelection(item.id, e)}
              className={`p-1 hover:bg-gray-100 rounded-full transition-colors ${
                status === "SENT" ? "opacity-50 cursor-not-allowed" : ""
              }`}
              disabled={status === "SENT"}
            >
              {selectedProducts.has(item.id) ? (
                <CheckCircle2 className="h-5 w-5 text-green-600" />
              ) : (
                <Circle className="h-5 w-5 text-gray-400 hover:text-gray-600" />
              )}
            </button>
          </div>
        </div>
        <div className="mt-3">
          <a
            href={item.productURL}
            target="_blank"
            rel="noopener noreferrer"
            className="flex items-center gap-1 text-blue-600 hover:underline text-sm"
            onClick={(e) => e.stopPropagation()}
          >
            <ExternalLink className="h-4 w-4" />
            Xem sản phẩm
          </a>
        </div>
      </CardContent>
    </Card>
  )

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
            <h3 className="font-semibold mb-3 text-lg">Sản phẩm chính</h3>
            <div className="space-y-2">{requestItems.map((item, index) => renderProductCard(item, index, false))}</div>
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
            {sub.requestItems.map((item, itemIndex) => renderProductCard(item, itemIndex, true))}
          </SubRequestDetails>
        ))}
      </CardContent>
    </Card>
  )
}
