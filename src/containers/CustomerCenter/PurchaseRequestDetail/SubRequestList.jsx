import React from 'react';
import SubRequestCard from './SubRequestCard';

function SubRequestList({ subRequests, expired, onPay }) {
  if (!subRequests || subRequests.length === 0) {
    return <div className="text-gray-500">Không có đơn hàng.</div>;
  }

  return (
    <div className="space-y-4">
      {subRequests.map((subRequest) => (
        <SubRequestCard
          key={subRequest.id}
          subRequest={subRequest}
          expired={expired}
          onPay={onPay}
        />
      ))}
    </div>
  );
}

export default SubRequestList;
