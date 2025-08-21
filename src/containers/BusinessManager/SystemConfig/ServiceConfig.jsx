import React, { useState } from "react";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { useUpdateServiceFeeMutation } from "@/services/gshopApi";
import { toast } from "sonner";
import {
	DollarSign,
	Settings,
	Save,
	RefreshCw,
	Edit3,
	X,
	Check,
} from "lucide-react";

export default function ServiceConfig() {
	const [activeTab, setActiveTab] = useState("service");
	const [serviceFeePercentage, setServiceFeePercentage] = useState(10); // Display as percentage (10%)
	const [refundFeePercentage, setRefundFeePercentage] = useState(3); // Display as percentage (3%)
	const [isLoading, setIsLoading] = useState(false);

	// RTK Query hooks
	const [updateServiceFee] = useUpdateServiceFeeMutation();

	// Edit states for each tab
	const [isEditingService, setIsEditingService] = useState(false);
	const [isEditingRefund, setIsEditingRefund] = useState(false);

	// Temp values for editing
	const [tempServiceFee, setTempServiceFee] = useState(10);
	const [tempRefundFee, setTempRefundFee] = useState(3);

	// Convert percentage to decimal for API (10% -> 0.1)
	const convertToDecimal = (percentage) => {
		return percentage / 100;
	};

	// Handle edit mode
	const handleEditService = () => {
		setTempServiceFee(serviceFeePercentage);
		setIsEditingService(true);
	};

	const handleEditRefund = () => {
		setTempRefundFee(refundFeePercentage);
		setIsEditingRefund(true);
	};

	const handleCancelService = () => {
		setTempServiceFee(serviceFeePercentage);
		setIsEditingService(false);
	};

	const handleCancelRefund = () => {
		setTempRefundFee(refundFeePercentage);
		setIsEditingRefund(false);
	};

	// Handle input change for temp values
	const handleTempServiceFeeChange = (e) => {
		const inputValue = e.target.value;

		// Allow empty string
		if (inputValue === "") {
			setTempServiceFee("");
			return;
		}

		const value = parseFloat(inputValue);
		// Check if it's a valid number and within range
		if (!isNaN(value) && value >= 0 && value <= 100) {
			setTempServiceFee(value);
		}
	};

	const handleTempRefundFeeChange = (e) => {
		const inputValue = e.target.value;

		// Allow empty string
		if (inputValue === "") {
			setTempRefundFee("");
			return;
		}

		const value = parseFloat(inputValue);
		// Check if it's a valid number and within range
		if (!isNaN(value) && value >= 0 && value <= 100) {
			setTempRefundFee(value);
		}
	};

	// Save functions
	const handleSaveService = async () => {
		// Validate input before saving
		if (
			tempServiceFee === "" ||
			tempServiceFee < 0 ||
			tempServiceFee > 100
		) {
			toast.error("Vui lòng nhập phí dịch vụ hợp lệ (0-100%)");
			return;
		}

		setIsLoading(true);
		try {
			const serviceDecimal = convertToDecimal(tempServiceFee);
			console.log("Service Fee (decimal):", serviceDecimal);

			// Call API to update service fee
			const response = await updateServiceFee(serviceDecimal);

			if (response.error) {
				throw new Error(response.error.data?.message || "API Error");
			}

			// Update actual value and exit edit mode
			setServiceFeePercentage(tempServiceFee);
			setIsEditingService(false);
			toast.success("Cập nhật phí dịch vụ thành công!");
		} catch (error) {
			console.error("Error updating service fee:", error);
			toast.error("Có lỗi xảy ra khi cập nhật phí dịch vụ!");
		} finally {
			setIsLoading(false);
		}
	};
	const handleSaveRefund = async () => {
		// Validate input before saving
		if (tempRefundFee === "" || tempRefundFee < 0 || tempRefundFee > 100) {
			toast.error("Vui lòng nhập phí hoàn tiền hợp lệ (0-100%)");
			return;
		}

		setIsLoading(true);
		try {
			const refundDecimal = convertToDecimal(tempRefundFee);
			console.log("Refund Fee (decimal):", refundDecimal);

			// TODO: Call API to update refund fee when available
			await new Promise((resolve) => setTimeout(resolve, 1000));

			// Update actual value and exit edit mode
			setRefundFeePercentage(tempRefundFee);
			setIsEditingRefund(false);
			toast.success("Cập nhật phí hoàn tiền thành công!");
		} catch (error) {
			console.error("Error updating refund fee:", error);
			toast.error("Có lỗi xảy ra khi cập nhật phí hoàn tiền!");
		} finally {
			setIsLoading(false);
		}
	};

	return (
		<div className="p-6">
			{/* Header */}
			<div className="mb-6">
				<div className="flex items-center gap-3 mb-2">
					<div className="p-2 bg-blue-100 rounded-lg">
						<DollarSign className="h-6 w-6 text-blue-600" />
					</div>
					<div>
						<h1 className="text-2xl font-bold text-gray-900">
							Cấu hình phí dịch vụ
						</h1>
						<p className="text-gray-600 text-sm">
							Quản lý các loại phí trong hệ thống mua hộ hàng nước
							ngoài
						</p>
					</div>
				</div>
			</div>

			{/* Main Content */}
			<div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
				<Tabs
					value={activeTab}
					onValueChange={setActiveTab}
					className="w-full"
				>
					<TabsList className="grid w-full grid-cols-2 mb-6">
						<TabsTrigger
							value="service"
							className="flex items-center gap-2"
						>
							<Settings className="h-4 w-4" />
							Phí dịch vụ
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
					<TabsContent value="service" className="space-y-3">
						<div className="bg-gradient-to-br from-blue-50 to-blue-100 border border-blue-200 rounded-xl p-6 shadow-sm">
							<div className="flex items-center justify-between">
								<div className="flex-1">
									<div className="flex items-center gap-3">
										<div className="p-2 bg-blue-500 rounded-lg">
											<Settings className="h-4 w-4 text-white" />
										</div>
										<div>
											<h4 className="text-lg font-semibold text-gray-900">
												Phí dịch vụ
											</h4>
											<p className="text-gray-600 text-xs">
												Tỷ lệ phần trăm áp dụng cho dịch
												vụ mua hộ
											</p>
										</div>
									</div>
								</div>

								<div className="flex items-center gap-6">
									{/* Display/Edit Value */}
									<div className="text-center">
										{isEditingService ? (
											<div className="flex items-center gap-2">
												<Input
													type="number"
													value={tempServiceFee}
													onChange={
														handleTempServiceFeeChange
													}
													className="w-20 text-center text-lg font-semibold border-2 border-blue-300 focus:border-blue-500"
													min="0"
													max="100"
													step="0.1"
													disabled={isLoading}
												/>
												<span className="text-xl font-semibold text-blue-600">
													%
												</span>
											</div>
										) : (
											<div className="flex items-center gap-2">
												<span className="text-2xl font-semibold text-blue-700">
													{serviceFeePercentage}
												</span>
												<span className="text-xl font-semibold text-blue-600">
													%
												</span>
											</div>
										)}
									</div>

									{/* Action Buttons */}
									<div className="flex gap-2">
										{isEditingService ? (
											<>
												<Button
													onClick={handleSaveService}
													disabled={isLoading}
													className="bg-green-600 hover:bg-green-700 text-white px-4 py-2"
													size="sm"
												>
													<Check className="h-4 w-4 mr-1" />
													{isLoading
														? "Đang lưu..."
														: "Lưu"}
												</Button>
												<Button
													onClick={
														handleCancelService
													}
													disabled={isLoading}
													variant="outline"
													className="border-gray-300 hover:bg-gray-50 px-4 py-2"
													size="sm"
												>
													<X className="h-4 w-4 mr-1" />
													Hủy
												</Button>
											</>
										) : (
											<Button
												onClick={handleEditService}
												className="bg-blue-600 hover:bg-blue-700 text-white"
												size="sm"
											>
												<Edit3 className="h-4 w-4" />
											</Button>
										)}
									</div>
								</div>
							</div>
						</div>
					</TabsContent>

					{/* Refund Fees Tab */}
					<TabsContent value="refund" className="space-y-6">
						<div className="pb-4">
							<h3 className="text-xl font-semibold text-gray-900">
								Cấu hình phí hoàn tiền
							</h3>
						</div>

						<div className="bg-gradient-to-br from-orange-50 to-orange-100 border border-orange-200 rounded-xl p-6 shadow-sm">
							<div className="flex items-center justify-between">
								<div className="flex-1">
									<div className="flex items-center gap-3">
										<div className="p-2 bg-orange-500 rounded-lg">
											<RefreshCw className="h-4 w-4 text-white" />
										</div>
										<div>
											<h4 className="text-lg font-semibold text-gray-900">
												Phí hoàn tiền
											</h4>
											<p className="text-gray-600 text-xs">
												Tỷ lệ phần trăm áp dụng cho phí
												hoàn tiền
											</p>
										</div>
									</div>
								</div>

								<div className="flex items-center gap-6">
									{/* Display/Edit Value */}
									<div className="text-center">
										{isEditingRefund ? (
											<div className="flex items-center gap-2">
												<Input
													type="number"
													value={tempRefundFee}
													onChange={
														handleTempRefundFeeChange
													}
													className="w-20 text-center text-lg font-semibold border-2 border-orange-300 focus:border-orange-500"
													min="0"
													max="100"
													step="0.1"
													disabled={isLoading}
												/>
												<span className="text-xl font-semibold text-orange-600">
													%
												</span>
											</div>
										) : (
											<div className="flex items-center gap-2">
												<span className="text-2xl font-semibold text-orange-700">
													{refundFeePercentage}
												</span>
												<span className="text-xl font-semibold text-orange-600">
													%
												</span>
											</div>
										)}
									</div>

									{/* Action Buttons */}
									<div className="flex gap-2">
										{isEditingRefund ? (
											<>
												<Button
													onClick={handleSaveRefund}
													disabled={isLoading}
													className="bg-green-600 hover:bg-green-700 text-white px-4 py-2"
													size="sm"
												>
													<Check className="h-4 w-4 mr-1" />
													{isLoading
														? "Đang lưu..."
														: "Lưu"}
												</Button>
												<Button
													onClick={handleCancelRefund}
													disabled={isLoading}
													variant="outline"
													className="border-gray-300 hover:bg-gray-50 px-4 py-2"
													size="sm"
												>
													<X className="h-4 w-4 mr-1" />
													Hủy
												</Button>
											</>
										) : (
											<Button
												onClick={handleEditRefund}
												className="bg-orange-600 hover:bg-orange-700 text-white"
												size="sm"
											>
												<Edit3 className="h-4 w-4" />
											</Button>
										)}
									</div>
								</div>
							</div>
						</div>
					</TabsContent>
				</Tabs>

				{/* Save Changes Button */}
			</div>
		</div>
	);
}
