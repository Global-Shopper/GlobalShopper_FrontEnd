import { useState } from "react";
import { useParams } from "react-router-dom";
import { useGetPurchaseRequestDetailQuery } from "@/services/gshopApi";
import PageLoading from "@/components/PageLoading";
import React from "react";
import { PurchaseRequestHeader } from "./PurchaseRequestHeader";
import { CustomerInfoCard } from "../CustomerInfoCard";
import { ProductDetail } from "../ProductDetail";
import { ProductList } from "../ProductList";

const formatCurrency = (amount) => {
  return new Intl.NumberFormat("vi-VN", {
    style: "currency",
    currency: "VND",
  }).format(amount);
};

function AdPurchaseReqDetail() {
  const { id } = useParams();
  const {
    data: req,
    isLoading: isReqLoading,
    isError: isRequestError,
  } = useGetPurchaseRequestDetailQuery(id);
  const [selectedProductId, setSelectedProductId] = useState(undefined);
  const [quotePrices, setQuotePrices] = useState({});
  const [expandedSubRequest, setExpandedSubRequest] = useState(null);
  const [isGroupingMode, setIsGroupingMode] = useState(false);

  const selectedProduct = React.useMemo(() => {
    if (req?.requestItems?.length > 0) {
      const selectItem = req.requestItems.find(
        (item) => item.id === selectedProductId
      );
      console.log(selectItem);
      if (selectItem) return selectItem;
    }

    if (req?.subRequests?.length > 0) {
      console.log(
        "Checking subrequests for selected product ID:",
        selectedProductId
      );
      for (const subReq of req.subRequests) {
        const selectItem = subReq.requestItems.find(
          (item) => item.id === selectedProductId
        );
        if (selectItem) return selectItem;
      }
    }

    return undefined;
  }, [req, selectedProductId]);

  const handlePriceChange = (productId, price) => {
    setQuotePrices((prev) => ({
      ...prev,
      [productId]: price,
    }));
  };

  const handleProductClick = (productId) => {
    setSelectedProductId(productId);
  };

  const toggleSubRequestExpansion = (subRequestId) => {
    setExpandedSubRequest(
      expandedSubRequest === subRequestId ? null : subRequestId
    );
  };

  const handleCreateGroup = (items = []) => {
    if (items.length > 0) {
      setIsGroupingMode(false); // Exit selection mode after creating group
    } else {
      // Toggle selection mode
      setIsGroupingMode(!isGroupingMode);
    }
  };


  const handleExitGroupingMode = () => {
    setIsGroupingMode(false);
  };

  if (isReqLoading) {
    return <PageLoading />;
  }

  if (isRequestError || !req) {
    return (
      <div className="min-h-screen flex items-center justify-center text-lg text-red-600">
        Không thể tải dữ liệu yêu cầu.
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50/30">
      <div className="max-w-7xl mx-auto p-6 space-y-6">
        {/* Header */}
        <PurchaseRequestHeader
          onCreateGroup={handleCreateGroup}
          isGroupingMode={isGroupingMode}
          purchaseRequest={req}
        />

        <div className="grid grid-cols-1 lg:grid-cols-7 gap-6">
          <div className="lg:col-span-3 space-y-4">
            {/* Product List */}
            <div className="h-[calc(100vh-100px)] overflow-y-auto">
              <ProductList
                subRequests={req.subRequests || []}
                selectedProductId={selectedProductId}
                expandedSubRequest={expandedSubRequest}
                status={req.status}
                onProductClick={handleProductClick}
                onToggleSubRequestExpansion={toggleSubRequestExpansion}
                requestType={req.requestType}
                isGroupingMode={isGroupingMode}
                onCreateGroup={handleCreateGroup}
                onExitGroupingMode={handleExitGroupingMode}
                requestItemsGroupByPlatform={req.requestItemsGroupByPlatform}
              />
            </div>
          </div>

          <div className="space-y-4 grid grid-cols-5 col-span-4 gap-6">
            {/* Product Detail (sticky) */}
            {selectedProduct && (
              <div className="sticky top-4 self-start col-span-3">
                <ProductDetail
                  product={selectedProduct}
                  status={req.status}
                  quotePrice={quotePrices[selectedProduct.id] || ""}
                  onPriceChange={handlePriceChange}
                />
              </div>
            )}
            {/* Customer Info (sticky) */}
            <div className="sticky top-4 self-start col-span-2">
              <CustomerInfoCard
                customer={req.customer}
                shippingAddress={req.shippingAddress}
                formatCurrency={formatCurrency}
              />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default AdPurchaseReqDetail;
