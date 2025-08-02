import { useGetPurchaseRequestDetailQuery } from "@/services/gshopApi";
import React, { useMemo } from "react";
import { useParams } from "react-router-dom";
import PageLoading from "@/components/PageLoading";
import PageError from "@/components/PageError";
import ShippingInfoCard from "@/components/ShippingInfoCard";
import RequestItemCard from "@/components/RequestItemCard";
import { parseDateTime } from "@/utils/parseDateTime";
import SubRequestCard from "./SubRequestCard";

const RequestHeader = ({ title, icon, dateTime }) => (
  <div className="flex items-center gap-1">
    {icon}
    <span>{title}: {parseDateTime(dateTime)}</span>
  </div>
);

const RequestInfo = ({ requestData }) => (
  <div className="mb-4">
    <h1 className="text-2xl font-bold mb-2 text-gray-900">Chi tiết yêu cầu mua hàng</h1>
    <div className="flex items-center gap-4 text-sm text-muted-foreground">
      <RequestHeader 
        title="Tạo" 
        dateTime={requestData.createdAt} 
        icon={({ className }) => (
          <svg 
            className={className} 
            fill="none" 
            viewBox="0 0 24 24" 
            stroke="currentColor"
          >
            <path 
              strokeLinecap="round" 
              strokeLinejoin="round" 
              strokeWidth={2} 
              d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" 
            />
          </svg>
        )} 
      />
      <RequestHeader 
        title="Hết hạn" 
        dateTime={requestData.expiredAt}
        icon={({ className }) => (
          <svg 
            className={className} 
            fill="none" 
            viewBox="0 0 24 24" 
            stroke="currentColor"
          >
            <path 
              strokeLinecap="round" 
              strokeLinejoin="round" 
              strokeWidth={2} 
              d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" 
            />
          </svg>
        )} 
      />
    </div>
  </div>
);

const RequestItemList = ({ groupedItems, ungroupedItems, expired, onPay }) => {
  const hasGroupedItems = groupedItems.length > 0;
  const hasUngroupedItems = ungroupedItems.length > 0;

  if (!hasGroupedItems && !hasUngroupedItems) {
    return (
      <div className="text-center py-6 text-muted-foreground">
        Không có sản phẩm nào trong yêu cầu này.
      </div>
    );
  }

  return (
    <div className="space-y-8">
      {/* Grouped Items Section */}
      {hasGroupedItems && (
        <div className="space-y-4">
          <h2 className="text-lg font-semibold">Danh sách đơn hàng</h2>
          {groupedItems.map((subRequest) => (
            <SubRequestCard
              key={`subreq-${subRequest.id}`}
              subRequest={subRequest}
              expired={expired}
              onPay={onPay}
            />
          ))}
        </div>
      )}

      {/* Ungrouped Items Section */}
      {hasUngroupedItems && (
        <div className="space-y-4">
          <h2 className="text-lg font-semibold">Danh sách sản phẩm</h2>
          <div className="space-y-4">
            {ungroupedItems.map((item) => (
              <RequestItemCard 
                key={`item-${item.id}`}
                item={item}
                showStatus={false}
                className="border-l-4 border-amber-500"
              />
            ))}
          </div>
        </div>
      )}
    </div>
  );
};

function AdminInfo({ admin }) {
  if (!admin) return null;
  return (
    <div className="mb-4 flex flex-col md:flex-row md:items-center md:gap-6">
      <div className="font-semibold text-gray-700">Nhân viên phụ trách:</div>
      <div className="text-gray-900">{admin.name}</div>
      <div className="text-gray-500">{admin.phone}</div>
    </div>
  );
}

function ExpiredWarning({ expired, expiredAt }) {
  if (!expired) return null;
  
  return (
    <div className="mb-6 p-4 bg-red-50 border-l-4 border-red-500">
      <div className="flex items-start">
        <svg 
          className="h-5 w-5 text-red-500 mt-0.5 mr-2 flex-shrink-0" 
          fill="none" 
          viewBox="0 0 24 24" 
          stroke="currentColor"
        >
          <path 
            strokeLinecap="round" 
            strokeLinejoin="round" 
            strokeWidth={2} 
            d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" 
          />
        </svg>
        <div>
          <h3 className="text-sm font-medium text-red-800">Yêu cầu đã hết hạn</h3>
          <div className="mt-1 text-sm text-red-700">
            <p>Bạn không thể thực hiện thanh toán cho yêu cầu này vì đã quá hạn.</p>
            {expiredAt && (
              <p className="mt-1">
                Hạn thanh toán: <span className="font-medium">{parseDateTime(expiredAt)}</span>
              </p>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}

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

  // Payment handler (stub)
  const handlePaySubRequest = (subRequest) => {
    alert(`Thanh toán cho subRequest: ${subRequest.id}`);
    // TODO: Integrate payment logic/modal here
  };

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
    <div className="max-w-3xl mx-auto py-8 px-3">
      <RequestInfo requestData={purchaseRequestData} />
      
      <AdminInfo admin={purchaseRequestData.admin} />
      
      <ShippingInfoCard 
        address={purchaseRequestData.shippingAddress} 
        title="Địa chỉ nhận hàng"
        className="mb-4"
      />
      
      <ExpiredWarning 
        expired={expired} 
        expiredAt={purchaseRequestData.expiredAt} 
      />

      <div className="mt-6">
        <RequestItemList 
          groupedItems={groupedItems}
          ungroupedItems={ungroupedItems}
          expired={expired}
          onPay={handlePaySubRequest}
        />
      </div>
    </div>
  );
};

export default PurchaseRequestDetail;

