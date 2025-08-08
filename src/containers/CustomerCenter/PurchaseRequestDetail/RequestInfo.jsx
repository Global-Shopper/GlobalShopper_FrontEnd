import React from "react";
import { CalendarArrowUp, Clock } from "lucide-react";
import { parseDateTime } from "@/utils/parseDateTime";
import { getStatusBadgeVariant, getStatusText } from "@/utils/statusHandler";
import { Badge } from "@/components/ui/badge";

const RequestInfo = ({ requestData }) => {
  return (
    <div className="mb-4">
      <h1 className="text-2xl font-bold mb-2 text-gray-900">Chi tiết yêu cầu mua hàng</h1>
      <div className="flex items-center gap-4 text-sm text-muted-foreground">
        <div className="flex items-center gap-1">
          <CalendarArrowUp className="h-4 w-4 text-gray-500" />
          <span>Tạo: {parseDateTime(requestData.createdAt)}</span>
        </div>
        <div className="flex items-center gap-1">
          <Clock className="h-4 w-4 text-gray-500" />
          <span>Hết hạn: {parseDateTime(requestData.expiredAt)}</span>
        </div>
        <Badge
          variant={getStatusBadgeVariant(requestData.status)}
          className="text-xs"
        >
          {getStatusText(requestData.status)}{" "}{(requestData.status === "QUOTED") ? `(${requestData?.itemsHasQuotation}/${requestData?.totalItems})` : ""}
        </Badge>
      </div>
    </div>
  );
};

export default RequestInfo;
