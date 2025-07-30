import React from "react";

import { AlertTriangle } from "lucide-react";

const PageError = ({ message = "Đã xảy ra lỗi khi tải dữ liệu" }) => {
  return (
    <div className="flex flex-col items-center justify-center min-h-[40vh] p-8 text-center">
      <AlertTriangle className="w-16 h-16 text-red-400 mb-4" />
      <h2 className="text-xl font-bold text-red-600 mb-2">Có lỗi xảy ra!</h2>
      <div className="text-gray-500 mb-4">
        {message}
        <br />
        Vui lòng kiểm tra kết nối mạng hoặc thử lại sau.
      </div>
      <button
        onClick={() => window.location.reload()}
        className="inline-flex items-center gap-2 px-4 py-2 rounded bg-red-50 hover:bg-red-100 text-red-700 font-medium shadow-sm border border-red-200 transition"
      >
        Thử lại
      </button>
    </div>
  );
};

export default PageError;
