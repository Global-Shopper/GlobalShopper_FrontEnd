import React from "react";

export function AdminInfo({ admin }) {
  if (!admin) return null;
  return (
    <div className="mb-4 flex flex-col md:flex-row md:items-center md:gap-6">
      <div className="font-semibold text-gray-700">Nhân viên phụ trách:</div>
      <div className="text-gray-900">{admin.name}</div>
      <div className="text-gray-500">{admin.phone}</div>
    </div>
  );
}
