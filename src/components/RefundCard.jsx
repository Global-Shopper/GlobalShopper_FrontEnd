import React from "react";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Link } from "react-router-dom";
import { REFUND_STATUS } from "@/const/refundStatus";
import { formatCurrency } from "@/utils/formatCurrency";

export default function RefundCard({ refund }) {
  const { id, reason, amount, status, rejectionReason, orderId, evidence = [] } = refund || {};

  const imageUrls = (Array.isArray(evidence) ? evidence : [])
    .filter((e) => typeof e === "string" && e.trim().length > 0);
  const thumbs = imageUrls.slice(0, 2);
  const extraCount = imageUrls.length > 2 ? imageUrls.length - 2 : 0;

  return (
    <Card className="shadow-sm transition border-l-2 border-l-blue-500 bg-white">
      <CardContent className="px-3 py-2">
        <div className="flex items-center justify-between mb-4">
          <div className="text-sm font-semibold text-blue-600 truncate">#{id}</div>
          <div className="flex items-center gap-2">
            <Badge variant={REFUND_STATUS[status]?.color || "secondary"}>
              {REFUND_STATUS[status]?.label || status}
            </Badge>
            <Link to={`/account-center/orders/${orderId}`} className="text-xs text-blue-600 hover:underline">
              Xem đơn hàng
            </Link>
          </div>
        </div>

        <div className="flex items-start justify-between gap-3">
          <div className="flex-1 min-w-0 flex flex-col gap-2">
            <div className="text-sm text-gray-700 truncate">
              <span className="font-medium">Lý do:</span> {reason || "—"}
            </div>

            <div className="flex items-center gap-2">
              <span className="text-xs text-gray-500 font-medium">Số tiền:</span>
              <span className="text-[11px] font-semibold text-orange-800 bg-orange-50 px-1.5 py-0.5 rounded">
                {formatCurrency(amount, "VND", "vn")}
              </span>
            </div>

            {status === "REJECTED" && (
              <div className="text-xs text-red-600">
                <span className="font-medium">Lý do từ chối:</span> {rejectionReason || "—"}
              </div>
            )}
          </div>

          {thumbs.length > 0 && (
            <div className="flex items-center gap-1.5 shrink-0">
              {thumbs.map((src, idx) => (
                <div key={idx} className="relative w-12 h-12 rounded-md overflow-hidden bg-gray-100 border">
                  <img
                    src={src}
                    alt={`evidence-${idx}`}
                    className="w-full h-full object-contain"
                    loading="lazy"
                  />
                  {idx === 1 && extraCount > 0 && (
                    <div className="absolute inset-0 bg-black/40 text-white flex items-center justify-center text-xs font-semibold">
                      +{extraCount}
                    </div>
                  )}
                </div>
              ))}
            </div>
          )}
        </div>
      </CardContent>
    </Card>
  );
}
