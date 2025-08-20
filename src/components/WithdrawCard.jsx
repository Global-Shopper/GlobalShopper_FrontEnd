import React from "react";
import { Card, CardContent } from "@/components/ui/card";
import { formatCurrency } from "@/utils/formatCurrency";
import { getStatusColor, getStatusText } from "@/utils/statusHandler";

const maskAccount = (num) => (num ? `****${String(num).slice(-4)}` : "-");

export default function WithdrawCard({ withdraw }) {
  const { id, reason, denyReason, amount, status, bankingBill, bankAccount = {} } = withdraw || {};

  return (
    <Card className="shadow-sm transition border-l-2 border-l-blue-500 bg-white">
      <CardContent className="px-3 py-2">
        <div className="flex items-center justify-between mb-4">
          <div className="text-sm font-semibold text-blue-600 truncate">#{id}</div>
          <div className="flex items-center gap-2">
            <span className="text-sm text-gray-500 font-medium">
              Trạng thái:
            </span>
            <span
              className={`px-2 py-1 rounded-full text-xs font-medium ${getStatusColor(
                status
              )} group-hover:shadow`}
            >
              {getStatusText(status)}
            </span>
          </div>
        </div>

        <div className="flex items-start justify-between gap-3">
          <div className="flex-1 min-w-0 flex flex-col gap-2">
            <div className="text-sm text-gray-700 truncate">
              <span className="font-medium">Ghi chú:</span> {reason || "—"}
            </div>

            <div className="text-xs text-gray-600">
              <span className="font-medium">Tài khoản nhận:</span> {bankAccount.providerName || "-"} • {maskAccount(bankAccount.bankAccountNumber)} • {bankAccount.accountHolderName || "-"}
            </div>

            <div className="flex items-center gap-2">
              <span className="text-xs text-gray-500 font-medium">Số tiền:</span>
              <span className="text-[11px] font-semibold text-orange-800 bg-orange-50 px-1.5 py-0.5 rounded">
                {formatCurrency(amount, "VND", "vi-VN")}
              </span>
            </div>

            {status === "REJECTED" && (
              <div className="text-xs text-red-600">
                <span className="font-medium">Lý do từ chối:</span> {denyReason || "—"}
              </div>
            )}
          </div>

          {bankingBill && (
            <div className="flex items-center gap-1.5 shrink-0">
              <a
                href={bankingBill}
                target="_blank"
                rel="noreferrer"
                className="relative w-16 h-16 rounded-md overflow-hidden bg-gray-100 border"
              >
                <img src={bankingBill} alt="bank-bill" className="w-full h-full object-contain" loading="lazy" />
              </a>
            </div>
          )}
        </div>
      </CardContent>
    </Card>
  );
}
