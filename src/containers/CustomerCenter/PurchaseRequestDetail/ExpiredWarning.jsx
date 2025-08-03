import { parseDateTime } from "@/utils/parseDateTime";
import React from "react";

export function ExpiredWarning({ expired, expiredAt }) {
  if (!expired) return null;

  return (
    <div className="mb-6 p-4 bg-red-50 border-l-4 border-red-500">
      <div className="flex items-start">
        <svg
          className="h-5 w-5 text-red-500 mt-0.5 mr-2 flex-shrink-0"
          fill="none"
          viewBox="0 0 24 24"
          stroke="currentColor"
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth={2}
            d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
        </svg>
        <div>
          <h3 className="text-sm font-medium text-red-800">Yêu cầu đã hết hạn</h3>
          <div className="mt-1 text-sm text-red-700">
            <p>Bạn không thể thực hiện thanh toán cho yêu cầu này vì đã quá hạn.</p>
            {expiredAt && (
              <p className="mt-1">
                Hạn thanh toán: <span className="font-medium">{parseDateTime(expiredAt)}</span>
              </p>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
