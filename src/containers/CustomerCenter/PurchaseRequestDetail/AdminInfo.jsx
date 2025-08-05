import React from "react";

export function AdminInfo({ admin, className = "" }) {
  if (!admin) return null;
  return (
    <div className={`bg-orange-50 p-6 rounded-lg border border-orange-200 ${className}`}>
      <h5 className="font-semibold mb-3 text-orange-800">Nhân viên phụ trách</h5>
      <div className="space-y-2 text-sm">
        <p>
          <strong>Tên:</strong> {admin.name}
        </p>
        <p>
          <strong>Số điện thoại:</strong> {admin.phone}
        </p>
        <p>
          <strong>Email:</strong> {admin.email}
        </p>
      </div>
    </div>
  );
}
