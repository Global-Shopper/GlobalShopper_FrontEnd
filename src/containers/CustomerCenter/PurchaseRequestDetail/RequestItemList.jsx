import RequestItemCard from "@/components/RequestItemCard";
import SubRequestCard from "./SubRequestCard";

export default function RequestItemList({ groupedItems, ungroupedItems, expired, onPay }) {
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
}
