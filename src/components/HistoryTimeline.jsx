import React from "react";
import { getStatusText, getStatusBadgeVariant } from "@/utils/statusHandler";
import { CheckCircleIcon, ClockIcon, PackageSearch, PencilLine, XCircleIcon } from "lucide-react";

function formatDateTime(timestamp) {
  const date = new Date(timestamp);
  const pad = (n) => n.toString().padStart(2, "0");
  return `${pad(date.getHours())}:${pad(date.getMinutes())} ${pad(date.getDate())}-${pad(date.getMonth() + 1)}-${date.getFullYear()}`;
}

// Customize icon and color for each status
const statusConfig = {
  SENT: {
    icon: <ClockIcon className="w-5 h-5 text-blue-400" />,
    dot: "bg-blue-400"
  },
  CHECKING: {
    icon: <PackageSearch className="w-5 h-5 text-yellow-400" />,
    dot: "bg-yellow-400"
  },
  QUOTED: {
    icon: <CheckCircleIcon className="w-5 h-5 text-green-500" />,
    dot: "bg-green-500"
  },
  CANCELLED: {
    icon: <XCircleIcon className="w-5 h-5 text-red-400" />,
    dot: "bg-red-400"
  },
  INSUFFICIENT: {
    icon: <PencilLine className="w-5 h-5 text-orange-400" />,
    dot: "bg-orange-400"
  },
  DEFAULT: {
    icon: <XCircleIcon className="w-5 h-5 text-gray-300" />,
    dot: "bg-gray-300"
  }
};

const HistoryTimeline = ({ history, maxHeight = 600 }) => {
  if (!history || history.length === 0) return null;
  // Sort descending (latest first)
  const sorted = [...history].sort((a, b) => b.createdAt - a.createdAt);

  return (
    <div
      className="bg-blue-50 border border-blue-200 rounded-lg p-5 shadow-sm flex flex-col min-w-[260px]"
      style={{ maxHeight }}
    >
      <h3 className="text-base md:text-lg font-semibold text-blue-700 mb-4 border-b border-blue-100 pb-2 flex items-center gap-2">
        Lịch sử trạng thái
      </h3>
      <div className="overflow-y-auto pr-2" style={{ maxHeight: maxHeight - 60 }}>
        <ol className="relative border-l border-blue-200">
          {sorted.map((item, idx) => {
            const isLatest = idx === 0;
            const config = statusConfig[item.status] || statusConfig.DEFAULT;
            return (
              <li key={item.id} className="mb-8 ml-4 relative flex items-start">
                {/* Timeline dot & icon */}
                <span className={`flex-shrink-0 flex items-center justify-center w-6 h-6 rounded-full ring-8 ring-blue-50 ${config.dot}`}>
                  {config.icon}
                </span>
                {/* Content */}
                <div className="ml-3 flex-1">
                  <div className="flex items-center gap-2">
                    <span className="text-xs text-gray-400 font-medium">{formatDateTime(item.createdAt)}</span>
                    <span
                      className={`inline-block px-2 py-0.5 rounded text-xs font-medium bg-${getStatusBadgeVariant(item.status)}-100 text-${getStatusBadgeVariant(item.status)}-800`}
                    >
                      {getStatusText(item.status)}
                    </span>
                    <span className={isLatest ? "font-bold text-green-700 ml-1" : "text-gray-700 ml-1"}>{item.description}</span>
                  </div>
                </div>
              </li>
            );
          })}
        </ol>
      </div>
    </div>
  );
};

export default HistoryTimeline;
