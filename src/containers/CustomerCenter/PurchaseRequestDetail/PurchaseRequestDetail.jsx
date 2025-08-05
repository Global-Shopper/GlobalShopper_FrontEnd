import { useGetPurchaseRequestDetailQuery } from "@/services/gshopApi";
import React, { useMemo } from "react";
import { useParams } from "react-router-dom";
import PageLoading from "@/components/PageLoading";
import PageError from "@/components/PageError";
import ShippingInfoCard from "@/components/ShippingInfoCard";
import RequestInfo from "./RequestInfo";
import RequestItemList from "./RequestItemList";
import { ExpiredWarning } from "./ExpiredWarning";
import { AdminInfo } from "./AdminInfo";
import HistoryTimeline from "@/components/HistoryTimeline";

const PurchaseRequestDetail = () => {
  const { id } = useParams();
  const {
    data: purchaseRequestData,
    isLoading: isRequestLoading,
    isError: isRequestError,
  } = useGetPurchaseRequestDetailQuery(id);

  // Process request items and subrequests
  const { groupedItems, ungroupedItems, hasData } = useMemo(() => {
    if (!purchaseRequestData) {
      return { groupedItems: [], ungroupedItems: [], hasData: false };
    }

    const allSubRequests = purchaseRequestData.subRequests || [];
    const allRequestItems = purchaseRequestData.requestItems || [];

    // Get all item IDs that are in subrequests
    const itemsInSubrequests = new Set();
    allSubRequests.forEach(subRequest => {
      (subRequest.requestItems || []).forEach(item => {
        if (item?.id) itemsInSubrequests.add(item.id);
      });
    });

    // Filter out items that are already in subrequests
    const ungroupedItems = allRequestItems.filter(item =>
      item?.id && !itemsInSubrequests.has(item.id)
    );

    return {
      groupedItems: allSubRequests,
      ungroupedItems,
      hasData: true
    };
  }, [purchaseRequestData]);

  // Check if request is expired
  const now = Date.now();
  const expired = purchaseRequestData?.expiredAt && now > purchaseRequestData.expiredAt;

  // Render loading state
  if (isRequestLoading) {
    return <PageLoading />;
  }

  // Render error state
  if (isRequestError) {
    return <PageError />;
  }

  // Render empty state
  if (!purchaseRequestData || !hasData) {
    return <div>Không tìm thấy dữ liệu yêu cầu mua hàng.</div>;
  }

  // Main content render
  return (
    <div className="max-w-7xl mx-auto py-8 px-3">
      <RequestInfo requestData={purchaseRequestData} />

      <div className="flex flex-col md:flex-row md:gap-6 mb-4">
        <div className="flex-1">
          <AdminInfo admin={purchaseRequestData.admin} className="mb-4 md:mb-0" />
        </div>
        <div className="flex-1">
          <ShippingInfoCard
            address={purchaseRequestData.shippingAddress}
            title="Địa chỉ nhận hàng"
            className="mb-4 md:mb-0"
          />
        </div>
      </div>



      <ExpiredWarning
        expired={expired}
        expiredAt={purchaseRequestData.expiredAt}
      />

      <div className="mt-6">
        <RequestItemList
          groupedItems={groupedItems}
          ungroupedItems={ungroupedItems}
          expired={expired}
        />
      </div>
      <div className="mt-6"><HistoryTimeline history={purchaseRequestData?.history} /></div>
    </div>
  );
};

export default PurchaseRequestDetail;

