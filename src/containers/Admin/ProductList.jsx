/* eslint-disable no-unused-vars */
import {
  Card,
  CardHeader,
  CardTitle,
  CardContent,
  CardDescription,
} from "@/components/ui/card";
import { Package, ExternalLink, Users, X } from "lucide-react";
import { SubRequestDetails } from "./PurchaseRequest/SubRequestDetails";
import React, { useState } from "react";
import { Button } from "@/components/ui/button";
import { QuotationForm } from "./PurchaseRequest/QuotationForm";
import { useDispatch, useSelector } from "react-redux";
import {
  toggleExpandProductQuotation,
  setItemDetail,
} from "@/features/quotation";
import { GroupCreationDialog } from "./PurchaseRequest/GroupCreationDialog";
import NonSubItems from "./NonSubItems";

// Group Creation Controls Component
const GroupCreationControls = ({
  selectedItems,
  onOpenDialog,
  onClearSelection,
}) => {
  return (
    <div className="bg-blue-50 border-2 border-blue-200 rounded-lg p-4 mb-4">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2">
          <Users className="h-5 w-5 text-blue-600" />
          <span className="font-medium text-blue-900">
            {selectedItems.length} sản phẩm được chọn
          </span>
        </div>
        <div className="flex gap-2">
          <Button
            variant="outline"
            size="sm"
            onClick={onClearSelection}
            className="text-gray-600"
          >
            Bỏ chọn tất cả
          </Button>
          <Button
            size="sm"
            onClick={onOpenDialog}
            disabled={selectedItems.length === 0}
            className="bg-blue-600 hover:bg-blue-700"
          >
            <Users className="h-4 w-4 mr-1" />
            Nhập thông tin nhóm
          </Button>
        </div>
      </div>
    </div>
  );
};

export function ProductList({
  purchaseRequest,
  expandedSubRequest,
  onToggleSubRequestExpansion,
  onProductClick,
  isGroupingMode,
  onCreateGroup,
  onExitGroupingMode
}) {
  // Redux hooks for expanded state
  const dispatch = useDispatch();
  const quotationState = useSelector((state) => state.rootReducer.quotation);

  // Local state for selected items
  const [selectedItems, setSelectedItems] = useState([]);
  const [isDialogOpen, setIsDialogOpen] = useState(false);

  // Handle item selection
  const handleSelectionChange = (itemId, isSelected) => {
    const newSelection = [...selectedItems];
    if (isSelected) {
      newSelection.push(itemId);
    } else {
      newSelection.splice(newSelection.indexOf(itemId), 1);
    }
    setSelectedItems(newSelection);
  };

  // Clear all selections
  const handleClearSelection = () => {
    setSelectedItems([]);
  };

  // Handle opening dialog
  const handleOpenDialog = () => {
    if (selectedItems.length > 0) {
      setIsDialogOpen(true);
    }
  };

  React.useEffect(() => {
    if (!isGroupingMode) {
      setSelectedItems([]);
    }
  }, [isGroupingMode]);

  const flatUngroupedItems = React.useMemo(
    () => (purchaseRequest.requestItemsGroupByPlatform || []).flatMap((g) => g.items || []),
    [purchaseRequest.requestItemsGroupByPlatform]
  );
 console.log("flatUngroupedItems", flatUngroupedItems);
  const renderProductCard = (item, subRequestId, status, requestItems, subStatus) => {
    const itemIndexNumber = requestItems
      ? requestItems.findIndex((i) => i.id === item.id)
      : 0;
    const orderNumber = itemIndexNumber + 1;
    const expandedProductForms = subRequestId
      ? quotationState?.subRequests?.[subRequestId]?.expandedProductForms || {}
      : quotationState?.expandedProductForms || {};
    const requestItemId = item.id;
    const isProductFormOpen = expandedProductForms[requestItemId];
    let quotationDetails = item;
    if (
      subRequestId &&
      quotationState?.subRequests?.[subRequestId]?.quotationDetails
    ) {
      const foundIdx = quotationState.subRequests[
        subRequestId
      ].quotationDetails.findIndex(
        (d) => d.requestItemId === requestItemId || d.id === requestItemId
      );
      quotationDetails =
        quotationState.subRequests[subRequestId].quotationDetails[foundIdx] ||
        item;
    }
    const productErrors = {};
    return (
      <Card
        isItemCard={true}
        key={requestItemId}
        className={`transition-all hover:shadow-md ${isProductFormOpen ? "shadow-lg ring-2 ring-blue-200 bg-blue-50" : ""
          }`}
        onClick={() => onProductClick(item.id)}
      >
        <CardContent className="p-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3 min-w-0 flex-1">
              <span
                className={`text-xs px-2 py-1 rounded shrink-0 ${subRequestId
                    ? "bg-orange-100 text-orange-600"
                    : "bg-gray-100 text-orange-600"
                  }`}
              >
                #{orderNumber}
              </span>
              <span className="font-semibold text-base truncate">
                {item.productName}
              </span>
            </div>
            <div className="flex items-center gap-3">
              <span
                className={`font-bold text-lg ${subRequestId ? "text-orange-600" : "text-blue-600"
                  }`}
              >
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
              onClick={(e) => e.stopPropagation()}
            >
              <ExternalLink className="h-4 w-4" />
              Xem sản phẩm
            </a>
          </div>
          {((subStatus === "PENDING" || !subStatus) && (status === "CHECKING" || status === "QUOTED" || status === "PAID")) && (
            <>
              <div className="flex justify-end mt-3">
                <Button
                  variant={isProductFormOpen ? "secondary" : "outline"}
                  size="sm"
                  type="button"
                  onClick={(e) => {
                    e.stopPropagation();
                    dispatch(
                      toggleExpandProductQuotation({
                        subRequestId,
                        requestItemId,
                      })
                    );
                  }}
                >
                  {isProductFormOpen ? "Đóng báo giá" : "Báo giá sản phẩm"}
                </Button>
              </div>
              {isProductFormOpen && (
                <QuotationForm
                  purchaseRequest={purchaseRequest}
                  product={quotationDetails}
                  errors={productErrors}
                  onChange={(field, value) => {
                    dispatch(
                        setItemDetail({
                          subRequestId,
                          itemIndex: itemIndexNumber,
                          field,
                          value,
                        })
                      );
                    }}
                  />
              )}
            </>
          )}
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
          {isGroupingMode && (
            <span className="text-sm font-normal text-blue-600 bg-blue-100 px-2 py-1 rounded">
              Chế độ chọn nhóm
            </span>
          )}
        </CardTitle>
        <CardDescription>
          {isGroupingMode
            ? "Chọn các sản phẩm bằng checkbox để tạo nhóm"
            : status === "SENT"
              ? "Xem thông tin sản phẩm trong yêu cầu mua hàng"
              : "Chọn sản phẩm để xem chi tiết và nhập giá báo giá"}
        </CardDescription>
        {isGroupingMode && (
          <div className="flex justify-end">
            <Button
              variant="outline"
              size="sm"
              onClick={onExitGroupingMode}
              className="text-gray-600"
            >
              <X className="h-4 w-4 mr-1" />
              Thoát chế độ chọn
            </Button>
          </div>
        )}
      </CardHeader>
      <CardContent className="space-y-4">
        {/* Render main requestItemsGroupByPlatform if any */}
        {purchaseRequest?.requestItemsGroupByPlatform?.length > 0 && (
          <div>
            <h3 className="font-semibold mb-3 text-md">
              Sản phẩm chưa được tạo nhóm
            </h3>

            {/* Group creation controls (only in selection mode) */}
            {isGroupingMode && selectedItems.length > 0 && (
              <GroupCreationControls
                selectedItems={selectedItems}
                onOpenDialog={handleOpenDialog}
                onClearSelection={handleClearSelection}
                onExitGroupingMode={onExitGroupingMode}
              />
            )}

            {/* Product items */}
            <div className="space-y-4 mb-4">
              {purchaseRequest?.requestItemsGroupByPlatform?.map((group, gIdx) => (
                <div key={gIdx} className="space-y-2">
                  <div className="space-y-2">
                    {group.items.map((item) => (
                      <NonSubItems
                        key={item.id}
                        platform={group.ecommercePlatform}
                        item={item}
                        subRequestId={null}
                        onProductClick={onProductClick}
                        isGroupingMode={isGroupingMode}
                        isSelected={selectedItems.includes(item.id)}
                        onSelectionChange={handleSelectionChange}
                      />
                    ))}
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Consolidated SubRequests */}
        {purchaseRequest?.subRequests?.length > 0 &&
          <>
            <p className="font-semibold mb-3 text-md">Các nhóm sản phẩm</p>
            {purchaseRequest?.subRequests?.map((sub) => (
              <SubRequestDetails
                key={sub.id}
                subRequest={sub}
                purchaseRequest={purchaseRequest}
                isExpanded={expandedSubRequest === sub.id}
                onToggleExpansion={onToggleSubRequestExpansion}
              >
                {sub.requestItems.map((item) =>
                  renderProductCard(item, sub.id, purchaseRequest?.status, sub.requestItems, sub.status)
                )}
              </SubRequestDetails>
            ))}
          </>
        }
      </CardContent>

      {/* Group Creation Dialog (reusable component) */}
      <GroupCreationDialog
        handleClearSelection={handleClearSelection}
        isOpen={isDialogOpen}
        onClose={() => setIsDialogOpen(false)}
        selectedItems={selectedItems}
        requestItems={flatUngroupedItems}
        onCreateGroup={(selectedItemsArray) => {
          if (onCreateGroup) onCreateGroup(selectedItemsArray);
          setSelectedItems([]);
          setIsDialogOpen(false);
        }}
      />
    </Card>
  );
}
