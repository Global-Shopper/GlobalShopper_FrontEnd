import React from "react";

const PageLoading = ({ disEnableFullScreen, text = "Đang tải dữ liệu..." }) => {
  return (
    <div
      className={`flex flex-col items-center justify-center ${
        disEnableFullScreen ? "w-full h-full" : "min-h-screen w-screen"
      }`}
    >
      <div className="relative flex items-center justify-center">
        <div className="animate-spin rounded-full h-16 w-16 border-4 border-blue-400 border-t-transparent shadow-lg" />
        <div className="absolute w-10 h-10 rounded-full bg-blue-50 opacity-60" />
      </div>
      <span className="mt-6 text-base text-gray-500 font-medium animate-pulse select-none">{text}</span>
    </div>
  );
};

export default React.memo(PageLoading);
