import React from "react";

export default function ServiceConfig() {
	return (
		<div className="w-full px-2 md:px-6 flex flex-col flex-1 min-h-screen">
			<div className="bg-white rounded-xl shadow p-6 mb-6">
				<h1 className="text-2xl font-bold text-gray-900 mb-2">
					Cấu hình phí
				</h1>
				<p className="text-gray-600">
					Quản lý cấu hình phí dịch vụ trong hệ thống
				</p>
			</div>

			<div className="bg-white rounded-xl shadow-md p-6">
				<p className="text-gray-500">
					Tính năng cấu hình phí đang được phát triển...
				</p>
			</div>
		</div>
	);
}
