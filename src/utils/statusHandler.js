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
			return "outline";
		case "CANCELLED":
			return "destructive";
    case "INSUFFICIENT":
      return "outline";
		default:
			return "outline";
	}
};

