import React from 'react';
import { Badge } from "@/components/ui/badge";
import { Card, CardContent } from "@/components/ui/card";
import { getStatusColor, getStatusText } from "@/utils/statusHandler";
import { formatCurrency, getLocaleCurrencyFormat } from "@/utils/formatCurrency";

function StatusBadge({ status }) {
  const color = getStatusColor(status || 'PENDING');
  const text = getStatusText(status || 'PENDING');
  return (
    <span className={`inline-block px-2 py-1 rounded text-xs font-semibold border ${color}`}>
      {text}
    </span>
  );
}

function RequestItemCard({ 
  item, 
  showStatus = true, 
  className = '',
  showQuotation = true,
  showProductLink = true
}) {
  return (
    <div className={`bg-white rounded-lg border border-gray-200 shadow-sm overflow-hidden ${className}`}>
      <div className="p-4">
        <div className="flex justify-between items-start mb-3">
          <div className="font-medium text-gray-900 text-sm">
            {item.productName}
          </div>
          {showStatus && item.status && (
            <StatusBadge status={item.status} />
          )}
        </div>
        
        <div className="flex gap-4">
          <div className="flex-shrink-0">
            <img 
              src={item.images?.[0]} 
              alt={item.productName} 
              className="w-20 h-20 object-cover rounded border" 
              onError={(e) => {
                e.target.onerror = null;
                e.target.src = 'https://via.placeholder.com/80';
              }}
            />
          </div>
          
          <div className="flex-1 min-w-0">
            {item.variants?.length > 0 && (
              <div className="text-sm text-gray-600 mb-1 truncate">
                {item.variants.join(", ")}
              </div>
            )}
            
            {item.description && (
              <div className="text-sm text-gray-700 mb-2 line-clamp-2">
                {item.description}
              </div>
            )}
            
            <div className="flex flex-wrap items-center gap-4 text-sm">
              <div>
                <span className="text-gray-500">Số lượng:</span>{' '}
                <span className="font-medium">{item.quantity}</span>
              </div>
              
              {item.productURL && showProductLink && (
                <a 
                  href={item.productURL} 
                  target="_blank" 
                  rel="noopener noreferrer"
                  className="text-blue-600 hover:underline inline-flex items-center"
                >
                  <svg className="w-3 h-3 mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 6H6a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2v-4M14 4h6m0 0v6m0-6L10 14" />
                  </svg>
                  Xem sản phẩm
                </a>
              )}
            </div>
          </div>
        </div>

        {showQuotation && item.quotationDetail && (
          <div className="mt-3 border-t pt-3">
            <div className="text-sm font-medium text-gray-700 mb-2">Báo giá:</div>
            <div className="grid grid-cols-2 gap-2 text-sm">
              <div className="text-gray-600">Giá gốc:</div>
              <div className="text-right font-medium">
                {formatCurrency(
                  item.quotationDetail.basePrice, 
                  item.quotationDetail.currency, 
                  getLocaleCurrencyFormat(item.quotationDetail.currency)
                )}
              </div>
              
              <div className="text-gray-600">Phí dịch vụ:</div>
              <div className="text-right font-medium">
                {formatCurrency(
                  item.quotationDetail.serviceFee, 
                  'VND', 
                  getLocaleCurrencyFormat('VND')
                )}
              </div>
              
              <div className="text-gray-600">Tổng tiền:</div>
              <div className="text-right font-bold text-green-700">
                {formatCurrency(
                  item.quotationDetail.totalVNDPrice, 
                  'VND', 
                  getLocaleCurrencyFormat('VND')
                )}
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}

export default RequestItemCard;
