import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { ChevronRight, Calendar, Clock, Users } from "lucide-react"
import { Link } from "react-router-dom"

export function PurchaseRequestHeader({
  requestId,
  status,
  adminName,
  createdAt,
  expiredAt,
  requestType,
  isCheckLoading,
  isRequestingUpdate,
  updateRequested,
  onAssignToMe,
  onRequestCustomerUpdate,
  onCreateGroup,
  getStatusColor,
  getStatusText,
  formatDate,
}) {
  const isCreateGroupDisabled = status === "SENT" || requestType === "OFFLINE"

  return (
    <div className="space-y-4">
      {/* Breadcrumb */}
      <div className="flex items-center text-sm text-muted-foreground">
        <span>
          <Link to="/admin">Danh sách yêu cầu mua hàng</Link>
        </span>
        <ChevronRight className="h-4 w-4 mx-2" />
        <span className="text-foreground font-medium">Yêu cầu #{requestId}</span>
      </div>

      {/* Title and Actions */}
      <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-4">
        <div className="space-y-2">
          <div className="flex items-center gap-3">
            <h1 className="text-2xl font-bold">Yêu cầu mua hàng</h1>
            <span className={`px-2 py-2 rounded-full text-xs font-medium ${getStatusColor(status)}`}>
              {getStatusText(status)}
            </span>
            {status === "CHECKING" && adminName && (
              <Badge variant="outline" className="text-xs">
                Assigned to: {adminName}
              </Badge>
            )}
          </div>
          <div className="flex items-center gap-4 text-sm text-muted-foreground">
            <div className="flex items-center gap-1">
              <Calendar className="h-4 w-4" />
              <span>Tạo: {formatDate(createdAt)}</span>
            </div>
            <div className="flex items-center gap-1">
              <Clock className="h-4 w-4" />
              <span>Hết hạn: {formatDate(expiredAt)}</span>
            </div>
          </div>
        </div>

        <div className="flex gap-2">
          {status === "SENT" && (
            <>
              <Button variant="default" size="sm" onClick={onAssignToMe} disabled={isCheckLoading}>
                {isCheckLoading ? "Đang tiếp nhận..." : "Tiếp nhận yêu cầu"}
              </Button>
              <Button
                variant="outline"
                size="sm"
                onClick={onRequestCustomerUpdate}
                disabled={isRequestingUpdate || updateRequested}
              >
                {isRequestingUpdate
                  ? "Requesting..."
                  : updateRequested
                    ? "Update Requested"
                    : "Yêu cầu khách cập nhật thông tin"}
              </Button>
            </>
          )}
          <Button variant="outline" size="sm" disabled={isCreateGroupDisabled} onClick={onCreateGroup}>
            <Users className="h-4 w-4 mr-2" />
            Tạo Nhóm
          </Button>
          <Button size="sm" disabled={status === "SENT"}>
            Gửi Báo Giá
          </Button>
        </div>
      </div>
    </div>
  )
}
