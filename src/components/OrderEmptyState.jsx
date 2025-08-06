import React from "react";
import { Package } from "lucide-react";

export default function OrderEmptyState() {
  return (
    <div className="flex flex-col items-center justify-center py-12">
      <div className="w-20 h-20 bg-gray-100 rounded-full flex items-center justify-center mb-6">
        <Package className="h-10 w-10 text-gray-400" />
      </div>
      <h3 className="text-xl font-medium text-gray-900 mb-3">Không có đơn hàng nào</h3>
      <p className="text-gray-600 mb-6 max-w-md text-center">
        Bạn chưa có đơn hàng nào. Đơn hàng của bạn sẽ xuất hiện ở đây khi bạn đặt hàng thành công!
      </p>
    </div>
  );
}
