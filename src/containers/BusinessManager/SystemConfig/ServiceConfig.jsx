import React, { useState } from "react";
import {
	Card,
	CardContent,
	CardDescription,
	CardHeader,
	CardTitle,
} from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Badge } from "@/components/ui/badge";
import {
	DollarSign,
	Settings,
	Save,
	Plus,
	Trash2,
	Edit,
	AlertTriangle,
	RefreshCw,
} from "lucide-react";

export default function ServiceConfig() {
	const [activeTab, setActiveTab] = useState("service");

	// Mock data cho phí dịch vụ
	const serviceFees = [
		{
			id: 1,
			name: "Phí mua hộ cơ bản",
			percentage: 5,
			minFee: 50000,
			maxFee: 500000,
			status: "active",
		},
		{
			id: 2,
			name: "Phí vận chuyển quốc tế",
			fixedAmount: 150000,
			status: "active",
		},
		{
			id: 3,
			name: "Phí kiểm tra chất lượng",
			percentage: 2,
			minFee: 20000,
			maxFee: 100000,
			status: "active",
		},
	];

	// Mock data cho phí hủy
	const cancelFees = [
		{
			id: 1,
			name: "Phí hủy đơn trước 24h",
			percentage: 0,
			fixedAmount: 0,
			status: "active",
		},
		{
			id: 2,
			name: "Phí hủy đơn sau 24h",
			percentage: 10,
			minFee: 50000,
			status: "active",
		},
		{
			id: 3,
			name: "Phí hủy khi đã mua hàng",
			percentage: 100,
			status: "active",
		},
	];

	// Mock data cho phí hoàn tiền
	const refundFees = [
		{
			id: 1,
			name: "Phí xử lý hoàn tiền",
			percentage: 3,
			minFee: 30000,
			maxFee: 200000,
			status: "active",
		},
		{
			id: 2,
			name: "Phí hoàn tiền chuyển khoản",
			fixedAmount: 25000,
			status: "active",
		},
		{
			id: 3,
			name: "Phí hoàn tiền ví điện tử",
			percentage: 1,
			minFee: 10000,
			status: "active",
		},
	];

	const formatCurrency = (amount) => {
		return new Intl.NumberFormat("vi-VN", {
			style: "currency",
			currency: "VND",
		}).format(amount);
	};

	const getStatusBadge = (status) => {
		return status === "active" ? (
			<Badge className="bg-green-100 text-green-800">Đang áp dụng</Badge>
		) : (
			<Badge variant="secondary">Tạm dừng</Badge>
		);
	};

	const renderFeeCard = (fee) => (
		<Card key={fee.id} className="hover:shadow-md transition-shadow">
			<CardHeader className="pb-3">
				<div className="flex items-center justify-between">
					<CardTitle className="text-lg">{fee.name}</CardTitle>
					{getStatusBadge(fee.status)}
				</div>
			</CardHeader>
			<CardContent>
				<div className="space-y-3">
					<div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-sm">
						{fee.percentage && (
							<div>
								<Label className="text-gray-600">
									Phần trăm
								</Label>
								<p className="font-medium">{fee.percentage}%</p>
							</div>
						)}
						{fee.fixedAmount && (
							<div>
								<Label className="text-gray-600">
									Phí cố định
								</Label>
								<p className="font-medium">
									{formatCurrency(fee.fixedAmount)}
								</p>
							</div>
						)}
						{fee.minFee && (
							<div>
								<Label className="text-gray-600">
									Phí tối thiểu
								</Label>
								<p className="font-medium">
									{formatCurrency(fee.minFee)}
								</p>
							</div>
						)}
						{fee.maxFee && (
							<div>
								<Label className="text-gray-600">
									Phí tối đa
								</Label>
								<p className="font-medium">
									{formatCurrency(fee.maxFee)}
								</p>
							</div>
						)}
					</div>

					<div className="flex gap-2 pt-2">
						<Button
							variant="outline"
							size="sm"
							className="flex items-center gap-1"
						>
							<Edit className="h-4 w-4" />
							Chỉnh sửa
						</Button>
						<Button
							variant="outline"
							size="sm"
							className="flex items-center gap-1 text-red-600 hover:text-red-700"
						>
							<Trash2 className="h-4 w-4" />
							Xóa
						</Button>
					</div>
				</div>
			</CardContent>
		</Card>
	);

	return (
		<div className="w-full px-2 md:px-6 flex flex-col flex-1 min-h-screen">
			<div className="bg-white rounded-xl shadow p-6 mb-6">
				<div className="flex items-center gap-3 mb-2">
					<DollarSign className="h-6 w-6 text-blue-600" />
					<h1 className="text-2xl font-bold text-gray-900">
						Cấu hình phí dịch vụ
					</h1>
				</div>
				<p className="text-gray-600">
					Quản lý các loại phí trong hệ thống mua hộ hàng nước ngoài
				</p>
			</div>

			<div className="bg-white rounded-xl shadow-md p-6">
				<Tabs
					value={activeTab}
					onValueChange={setActiveTab}
					className="w-full"
				>
					<TabsList className="grid w-full grid-cols-3 mb-6">
						<TabsTrigger
							value="service"
							className="flex items-center gap-2"
						>
							<Settings className="h-4 w-4" />
							Phí dịch vụ
						</TabsTrigger>
						<TabsTrigger
							value="cancel"
							className="flex items-center gap-2"
						>
							<AlertTriangle className="h-4 w-4" />
							Phí hủy đơn
						</TabsTrigger>
						<TabsTrigger
							value="refund"
							className="flex items-center gap-2"
						>
							<RefreshCw className="h-4 w-4" />
							Phí hoàn tiền
						</TabsTrigger>
					</TabsList>

					{/* Service Fees Tab */}
					<TabsContent value="service" className="space-y-6">
						<div className="flex items-center justify-between">
							<div>
								<h3 className="text-lg font-semibold text-gray-900">
									Cấu hình phí dịch vụ
								</h3>
								<p className="text-gray-600 text-sm">
									Quản lý các loại phí liên quan đến dịch vụ
									mua hộ
								</p>
							</div>
							<Button className="flex items-center gap-2">
								<Plus className="h-4 w-4" />
								Thêm phí mới
							</Button>
						</div>

						<div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
							{serviceFees.map((fee) => renderFeeCard(fee))}
						</div>
					</TabsContent>

					{/* Cancel Fees Tab */}
					<TabsContent value="cancel" className="space-y-6">
						<div className="flex items-center justify-between">
							<div>
								<h3 className="text-lg font-semibold text-gray-900">
									Cấu hình phí hủy đơn
								</h3>
								<p className="text-gray-600 text-sm">
									Thiết lập phí áp dụng khi khách hàng hủy đơn
									hàng
								</p>
							</div>
							<Button className="flex items-center gap-2">
								<Plus className="h-4 w-4" />
								Thêm quy định mới
							</Button>
						</div>

						<div className="bg-yellow-50 border border-yellow-200 rounded-lg p-4 mb-6">
							<div className="flex items-center gap-2">
								<AlertTriangle className="h-5 w-5 text-yellow-600" />
								<h4 className="font-medium text-yellow-800">
									Lưu ý quan trọng
								</h4>
							</div>
							<p className="text-yellow-700 text-sm mt-1">
								Phí hủy đơn sẽ được áp dụng theo thời gian và
								trạng thái đơn hàng. Vui lòng cân nhắc kỹ trước
								khi thay đổi.
							</p>
						</div>

						<div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
							{cancelFees.map((fee) => renderFeeCard(fee))}
						</div>
					</TabsContent>

					{/* Refund Fees Tab */}
					<TabsContent value="refund" className="space-y-6">
						<div className="flex items-center justify-between">
							<div>
								<h3 className="text-lg font-semibold text-gray-900">
									Cấu hình phí hoàn tiền
								</h3>
								<p className="text-gray-600 text-sm">
									Quản lý phí xử lý và chuyển khoản hoàn tiền
								</p>
							</div>
							<Button className="flex items-center gap-2">
								<Plus className="h-4 w-4" />
								Thêm loại phí
							</Button>
						</div>

						<div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
							{refundFees.map((fee) => renderFeeCard(fee))}
						</div>
					</TabsContent>
				</Tabs>

				{/* Save Changes Button */}
				<div className="flex justify-end mt-6 pt-6 border-t">
					<Button className="flex items-center gap-2">
						<Save className="h-4 w-4" />
						Lưu thay đổi
					</Button>
				</div>
			</div>
		</div>
	);
}
