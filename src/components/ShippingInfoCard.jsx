import React from 'react';

/**
 * ShippingInfoCard component displays shipping information in a consistent format
 * @param {Object} props
 * @param {Object} props.address - The address object containing shipping information
 * @param {string} [props.title='Thông tin nhận hàng'] - Optional custom title
 * @param {string} [props.className] - Additional CSS classes
 */
const ShippingInfoCard = ({ address, title = 'Thông tin nhận hàng', className = '' }) => {
  if (!address) return null;

  return (
    <div className={`bg-orange-50 p-6 rounded-lg border border-orange-200 ${className}`}>
      <h5 className="font-semibold mb-3 text-orange-800">{title}</h5>
      <div className="space-y-2 text-sm">
        <p>
          <strong>Người nhận:</strong> {address.name}
        </p>
        <p>
          <strong>Loại địa chỉ:</strong> {address.tag}
        </p>
        <p>
          <strong>Địa chỉ:</strong> {address.location}
        </p>
        <p>
          <strong>Số điện thoại:</strong> {address.phoneNumber}
        </p>
      </div>
    </div>
  );
};

export default ShippingInfoCard;
