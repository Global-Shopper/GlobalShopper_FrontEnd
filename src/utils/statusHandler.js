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
      return "Đang xử lý";
    case "CHECKING":
      return "Đã xác nhận";
    case "QUOTED":
      return "Đã báo giá";
    case "CANCELLED":
      return "Đã hủy";
    case "INSUFFICIENT":
      return "Chờ cập nhật lại";
    default:
      return "Đang xử lý";
  }
};
