import RequestUpdatePRDialog from "@/components/RequestUpdatePRDialog";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { useCheckingPurchaseRequestMutation } from "@/services/gshopApi";
import { formatDate } from "@/utils/parseDateTime";
import { getStatusBadgeVariant, getStatusText } from "@/utils/statusHandler";
import { ChevronRight, Calendar, Clock, Users } from "lucide-react";
import { Link } from "react-router-dom";
import { toast } from "sonner";

export function PurchaseRequestHeader({
  onCreateGroup,
  isGroupingMode,
  purchaseRequest,
}) {
  const [checking, { isLoading: isCheckLoading }] =
    useCheckingPurchaseRequestMutation();
  const handleCheckingRequest = async () => {
    try {
      await checking(purchaseRequest.id)
        .unwrap()
        .then(() => {
          toast.success("Yêu cầu đã được tiếp nhận thành công.");
        });
    } catch (error) {
      toast.error(`Lỗi khi tiếp nhận yêu cầu: ${error.message}`);
    }
  };

  return (
    <div className="space-y-4">
      {/* Breadcrumb */}
      <div className="flex items-center text-sm text-muted-foreground">
        <span>
          <Link to="/admin">Danh sách yêu cầu mua hàng</Link>
        </span>
        <ChevronRight className="h-4 w-4 mx-2" />
        <span className="text-foreground font-medium">
          Yêu cầu #{purchaseRequest.id}
        </span>
      </div>

      {/* Title and Actions */}
      <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-4">
        <div className="space-y-2">
          <div className="flex items-center gap-3">
            <h1 className="text-2xl font-bold">Yêu cầu mua hàng</h1>
            <Badge
              variant={getStatusBadgeVariant(purchaseRequest.status)}
              className="text-xs"
            >
              {getStatusText(purchaseRequest.status)}{" "}{(purchaseRequest.status === "QUOTED") ? `(${purchaseRequest?.itemsHasQuotation}/${purchaseRequest?.totalItems})` : ""}
            </Badge>
            {purchaseRequest.status === "CHECKING" && purchaseRequest?.admin?.name && (
              <Badge variant="outline" className="text-xs">
                Assigned to: {purchaseRequest?.admin?.name}
              </Badge>
            )}
          </div>
          <div className="flex items-center gap-4 text-sm text-muted-foreground">
            <div className="flex items-center gap-1">
              <Calendar className="h-4 w-4" />
              <span>Tạo: {formatDate(purchaseRequest.createdAt)}</span>
            </div>
            <div className="flex items-center gap-1">
              <Clock className="h-4 w-4" />
              <span>Hết hạn: {formatDate(purchaseRequest.expiredAt)}</span>
            </div>
          </div>
        </div>

        <div className="flex gap-2">
          {purchaseRequest.status === "SENT" && (
            <>
              <Button
                onClick={handleCheckingRequest}
                disabled={isCheckLoading}
                className="bg-blue-600 hover:bg-blue-700"
              >
                {isCheckLoading ? "Đang tiếp nhận..." : "Tiếp nhận yêu cầu"}
              </Button>
              <RequestUpdatePRDialog purchaseRequest={purchaseRequest} />
            </>
          )}

          {/* Toggle Tạo Nhóm button */}
          {purchaseRequest.status !== "SENT" && (
            <>
              <Button
                variant={isGroupingMode ? "outline" : "default"}
                disabled={isCheckLoading}
                onClick={onCreateGroup}
                className={isGroupingMode ? "" : "bg-blue-600 hover:bg-blue-700"}
              >
                <Users className="h-4 w-4 mr-2" />
                {console.log(purchaseRequest.status)}
                <div>{isGroupingMode ? "Thoát tạo nhóm" : "Tạo Nhóm"}</div>
              </Button>

            </>
          )}
        </div>
      </div>
    </div>
  );
}
