// Helper functions
export const getStatusColor = (status) => {
  switch (status) {
    case "SENT":
      return "bg-blue-100 text-blue-800";
    case "PROCESSING":
      return "bg-yellow-100 text-yellow-800";
    case "QUOTED":
      return "bg-green-100 text-green-800";
    case "CANCELLED":
      return "bg-red-100 text-red-800";
    case "INSUFFICIENT":
      return "bg-yellow-100 text-yellow-800";
    case "PAID":
      return "bg-green-100 text-green-800";
    case "AWAITING_PAYMENT":
      return "bg-yellow-100 text-yellow-800";
    case "ORDER_REQUESTED":
      return "bg-blue-100 text-blue-800";
    case "PURCHASED":
      return "bg-green-100 text-green-800";
    case "IN_TRANSIT":
      return "bg-yellow-100 text-yellow-800";
    case "ARRIVED_IN_DESTINATION":
      return "bg-green-100 text-green-800";
    case "DELIVERED":
      return "bg-green-100 text-green-800";
    case "APPROVED":
      return "bg-green-100 text-green-800";
    case "REJECTED":
      return "bg-red-100 text-red-800";
    case "FAILED":
      return "bg-red-100 text-red-800";
    case "COMPLETED":
      return "bg-green-100 text-green-800";
    default:
      return "bg-gray-100 text-gray-800";
  }
};

export const getStatusText = (status) => {
  switch (status) {
    case "SENT":
      return "Đã gửi";
    case "CHECKING":
      return "Đang xử lý";
    case "QUOTED":
      return "Đã báo giá";
    case "CANCELLED":
      return "Đã hủy";
    case "INSUFFICIENT":
      return "Chờ cập nhật lại";
    case "PAID":
      return "Đã thanh toán";
    case "AWAITING_PAYMENT":
      return "Đang chờ thanh toán";
    case "ORDER_REQUESTED":
      return "Đang đặt hàng";
    case "PURCHASED":
      return "Đã mua";
    case "IN_TRANSIT":
      return "Đang vận chuyển";
    case "ARRIVED_IN_DESTINATION":
      return "Đã đến nơi";
    case "DELIVERED":
      return "Đã giao hàng";
    case "REJECTED":
      return "Đã từ chối";
    case "APPROVED":
      return "Đã chấp nhận";
    case "FAILED":
      return "Đã thất bại";
    case "COMPLETED":
      return "Đã hoàn thành";
    case "PENDING":
      return "Chờ xử lý";
    default:
      return "Đã gửi";
  }
};// Helper function to get status badge variant
export const getStatusBadgeVariant = (status) => {
	switch (status) {
		case "SENT":
			return "default";
		case "CHECKING":
			return "secondary";
		case "QUOTED":
			return "default";
		case "CANCELLED":
			return "destructive";
    case "INSUFFICIENT":
      return "outline";
    case "AWAITING_PAYMENT":
      return "outline";
    case "ORDER_REQUESTED":
      return "default";
    case "PURCHASED":
      return "default";
    case "IN_TRANSIT":
      return "default";
    case "ARRIVED_IN_DESTINATION":
      return "default";
    case "DELIVERED":
      return "default";
    case "REJECTED":
      return "destructive";
    case "APPROVED":
      return "default";
			default:
			return "outline";
	}
};

