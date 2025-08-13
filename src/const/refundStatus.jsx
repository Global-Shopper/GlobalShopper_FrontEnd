export const REFUND_STATUS = {
    PENDING: {
      label: "Chờ duyệt",
      color: "secondary", 
    },
    APPROVED: {
      label: "Đã duyệt",
      color: "default",
    },
    REJECTED: {
      label: "Từ chối",
      color: "destructive",
    },
    COMPLETED: {
      label: "Hoàn tất",
      color: "success", 
    },
    FAILED: {
      label: "Lỗi xử lý",
      color: "destructive",
    },
  };
  
  // Dùng cho dropdown filter
  export const REFUND_STATUS_OPTIONS = [
    { value: "ALL", label: "Tất cả" },
    ...Object.entries(REFUND_STATUS).map(([value, { label }]) => ({
      value,
      label,
    })),
  ];