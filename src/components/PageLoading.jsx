import React from "react";

const PageLoading = ({ disEnableFullScreen }) => {
  return (
    <div
      className={`flex items-center justify-center ${
        disEnableFullScreen ? "w-full h-full" : "min-h-screen w-full"
      }`}
    >
      <div className="animate-spin rounded-full h-12 w-12 border-4 border-primary border-t-transparent"></div>
    </div>
  );
};

export default React.memo(PageLoading);
