import React, { useState } from "react";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
	Dialog,
	DialogContent,
	DialogHeader,
	DialogTitle,
	DialogTrigger,
} from "@/components/ui/dialog";
import { Label } from "@/components/ui/label";
import { Switch } from "@/components/ui/switch";
import {
	useUpdateServiceFeeMutation,
	useGetBusinessManagerConfigQuery,
	useGetRefundReasonsQuery,
	useCreateRefundReasonMutation,
	useEditRefundReasonMutation,
	useActivateRefundReasonMutation,
	useDeleteRefundReasonMutation,
} from "@/services/gshopApi";
import { toast } from "sonner";
import {
	DollarSign,
	Settings,
	RefreshCw,
	Edit3,
	X,
	Check,
	Plus,
	Trash2,
} from "lucide-react";

export default function ServiceConfig() {
	const [activeTab, setActiveTab] = useState("service");
	const [serviceFeePercentage, setServiceFeePercentage] = useState(10);
	const [isLoading, setIsLoading] = useState(false);
	const [showCreateDialog, setShowCreateDialog] = useState(false);
	const [newReasonText, setNewReasonText] = useState("");
	const [newReasonRate, setNewReasonRate] = useState("");
	const [showDeleteDialog, setShowDeleteDialog] = useState(false);
	const [reasonToDelete, setReasonToDelete] = useState(null);

	// Edit states for refund reasons
	const [editingReasonId, setEditingReasonId] = useState(null);
	const [tempReasonText, setTempReasonText] = useState("");
	const [tempReasonRate, setTempReasonRate] = useState("");

	const [updateServiceFee] = useUpdateServiceFeeMutation();
	const {
		data: bmConfig,
		isLoading: loadingConfig,
		refetch: refetchConfig,
	} = useGetBusinessManagerConfigQuery();
	const {
		data: refundReasons,
		isLoading: loadingReasons,
		refetch: refetchReasons,
	} = useGetRefundReasonsQuery();
	const [createRefundReason] = useCreateRefundReasonMutation();
	const [editRefundReason] = useEditRefundReasonMutation();
	const [activateRefundReason] = useActivateRefundReasonMutation();
	const [deleteRefundReason] = useDeleteRefundReasonMutation();

	const [isEditingService, setIsEditingService] = useState(false);

	const [tempServiceFee, setTempServiceFee] = useState(10);

	// Update serviceFeePercentage when bmConfig is loaded
	React.useEffect(() => {
		if (bmConfig?.serviceFee) {
			const percentage = bmConfig.serviceFee * 100;
			setServiceFeePercentage(percentage);
			setTempServiceFee(percentage);
		}
	}, [bmConfig]);

	const convertToDecimal = (percentage) => {
		return percentage / 100;
	};

	const handleEditService = () => {
		setTempServiceFee(serviceFeePercentage);
		setIsEditingService(true);
	};

	const handleCancelService = () => {
		setTempServiceFee(serviceFeePercentage);
		setIsEditingService(false);
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
		if (!isNaN(value) && value >= 0 && value <= 100) {
			setTempServiceFee(value);
		}
	};

	// Save functions
	const handleSaveService = async () => {
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

			const response = await updateServiceFee(serviceDecimal);

			if (response.error) {
				throw new Error(response.error.data?.message || "API Error");
			}

			// Refetch config to get updated service fee
			await refetchConfig();
			setIsEditingService(false);
			toast.success("Cập nhật phí dịch vụ thành công!");
		} catch (error) {
			console.error("Error updating service fee:", error);
			toast.error("Có lỗi xảy ra khi cập nhật phí dịch vụ!");
		} finally {
			setIsLoading(false);
		}
	};

	// Refund Reasons handlers
	const handleCreateReason = async () => {
		if (!newReasonText.trim()) {
			toast.error("Vui lòng nhập nội dung lý do hoàn tiền");
			return;
		}

		if (
			newReasonRate &&
			(isNaN(newReasonRate) || newReasonRate < 0 || newReasonRate > 100)
		) {
			toast.error("Tỷ lệ phí phải là số từ 0 đến 100");
			return;
		}

		try {
			const payload = {
				reason: newReasonText.trim(),
				...(newReasonRate && { rate: parseFloat(newReasonRate) / 100 }),
			};
			await createRefundReason(payload).unwrap();
			toast.success("Tạo lý do hoàn tiền thành công!");
			setNewReasonText("");
			setNewReasonRate("");
			setShowCreateDialog(false);
			refetchReasons();
		} catch (error) {
			console.error("Error creating refund reason:", error);
			toast.error("Có lỗi xảy ra khi tạo lý do hoàn tiền");
		}
	};

	const handleToggleReason = async (reasonId, currentStatus) => {
		try {
			await activateRefundReason({
				id: reasonId,
				active: !currentStatus,
			}).unwrap();
			toast.success("Cập nhật trạng thái thành công!");
			refetchReasons();
		} catch (error) {
			console.error("Error toggling refund reason:", error);
			toast.error("Có lỗi xảy ra khi cập nhật trạng thái");
		}
	};

	const handleDeleteReason = (reasonId) => {
		const reason = refundReasons?.find((r) => r.id === reasonId);
		setReasonToDelete(reason);
		setShowDeleteDialog(true);
	};

	const confirmDeleteReason = async () => {
		if (!reasonToDelete) return;

		try {
			await deleteRefundReason(reasonToDelete.id).unwrap();
			toast.success("Xóa lý do hoàn tiền thành công!");
			refetchReasons();
			setShowDeleteDialog(false);
			setReasonToDelete(null);
		} catch (error) {
			console.error("Error deleting refund reason:", error);
			toast.error("Có lỗi xảy ra khi xóa lý do hoàn tiền");
		}
	};

	// Edit reason handlers
	const handleEditReason = (reason) => {
		setEditingReasonId(reason.id);
		setTempReasonText(reason.reason);
		setTempReasonRate(reason.rate ? (reason.rate * 100).toString() : "");
	};

	const handleCancelEditReason = () => {
		setEditingReasonId(null);
		setTempReasonText("");
		setTempReasonRate("");
	};

	const handleSaveEditReason = async () => {
		if (!tempReasonText.trim()) {
			toast.error("Tên lý do không được để trống!");
			return;
		}

		// Validate rate if provided
		if (
			tempReasonRate &&
			(isNaN(tempReasonRate) ||
				tempReasonRate < 0 ||
				tempReasonRate > 100)
		) {
			toast.error("Tỷ lệ phí phải là số từ 0 đến 100");
			return;
		}

		try {
			const payload = {
				id: editingReasonId,
				reason: tempReasonText.trim(),
				...(tempReasonRate && {
					rate: parseFloat(tempReasonRate) / 100,
				}),
			};
			await editRefundReason(payload).unwrap();
			toast.success("Cập nhật lý do hoàn tiền thành công!");
			handleCancelEditReason();
			refetchReasons();
		} catch (error) {
			console.error("Error editing refund reason:", error);
			toast.error("Có lỗi xảy ra khi cập nhật lý do hoàn tiền");
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
							Cấu hình phí
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
												{loadingConfig ? (
													<div className="flex items-center gap-2">
														<div className="w-8 h-8 border-2 border-blue-300 border-t-blue-600 rounded-full animate-spin"></div>
														<span className="text-sm text-gray-500">
															Đang tải...
														</span>
													</div>
												) : (
													<>
														<span className="text-2xl font-semibold text-blue-700">
															{
																serviceFeePercentage
															}
														</span>
														<span className="text-xl font-semibold text-blue-600">
															%
														</span>
													</>
												)}
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

					{/* Refund Reasons Tab */}
					<TabsContent value="refund" className="space-y-6">
						<div className="flex items-center justify-between pb-4">
							<div>
								<h3 className="text-xl font-semibold text-gray-900">
									Cấu hình lý do hoàn tiền
								</h3>
								<p className="text-gray-600 text-sm">
									Quản lý các lý do hoàn tiền có sẵn trong hệ
									thống
								</p>
							</div>
							<Dialog
								open={showCreateDialog}
								onOpenChange={setShowCreateDialog}
							>
								<DialogTrigger asChild>
									<Button className="bg-blue-600 hover:bg-blue-700 text-white">
										<Plus className="h-4 w-4 mr-2" />
										Thêm lý do
									</Button>
								</DialogTrigger>
								<DialogContent>
									<DialogHeader>
										<DialogTitle>
											Thêm lý do hoàn tiền mới
										</DialogTitle>
									</DialogHeader>
									<div className="space-y-4">
										<div>
											<Label htmlFor="reason">
												Nội dung lý do
											</Label>
											<Input
												id="reason"
												value={newReasonText}
												onChange={(e) =>
													setNewReasonText(
														e.target.value
													)
												}
												placeholder="Nhập lý do hoàn tiền..."
												className="mt-1"
											/>
										</div>
										<div>
											<Label htmlFor="rate">
												Tỷ lệ phí (%)
											</Label>
											<Input
												id="rate"
												type="number"
												value={newReasonRate}
												onChange={(e) =>
													setNewReasonRate(
														e.target.value
													)
												}
												placeholder="Nhập tỷ lệ phí (0-100)..."
												className="mt-1"
												min="0"
												max="100"
												step="0.1"
											/>
											<p className="text-xs text-gray-500 mt-1">
												Tùy chọn. Ví dụ: 70 = 70%
											</p>
										</div>
										<div className="flex gap-2 justify-end">
											<Button
												variant="outline"
												onClick={() => {
													setShowCreateDialog(false);
													setNewReasonText("");
													setNewReasonRate("");
												}}
											>
												Hủy
											</Button>
											<Button
												onClick={handleCreateReason}
											>
												Tạo lý do
											</Button>
										</div>
									</div>
								</DialogContent>
							</Dialog>
						</div>

						{/* Delete Confirmation Dialog */}
						<Dialog
							open={showDeleteDialog}
							onOpenChange={setShowDeleteDialog}
						>
							<DialogContent>
								<DialogHeader>
									<DialogTitle>
										Xác nhận xóa lý do hoàn tiền
									</DialogTitle>
								</DialogHeader>
								<div className="space-y-4">
									<p className="text-gray-600">
										Bạn có chắc chắn muốn xóa lý do hoàn
										tiền này không?
									</p>
									{reasonToDelete && (
										<div className="p-3 bg-gray-50 rounded-lg">
											<p className="font-medium">
												{reasonToDelete.reason}
											</p>
											{reasonToDelete.rate !==
												undefined &&
												reasonToDelete.rate !==
													null && (
													<p className="text-sm text-blue-600">
														Phí:{" "}
														{Math.round(
															reasonToDelete.rate *
																100
														)}
														%
													</p>
												)}
										</div>
									)}
									<div className="flex gap-2 justify-end">
										<Button
											variant="outline"
											onClick={() => {
												setShowDeleteDialog(false);
												setReasonToDelete(null);
											}}
										>
											Hủy
										</Button>
										<Button
											variant="destructive"
											onClick={confirmDeleteReason}
										>
											Xóa
										</Button>
									</div>
								</div>
							</DialogContent>
						</Dialog>

						{/* Refund Reasons List */}
						<div className="bg-white rounded-xl shadow-sm border border-gray-200">
							<div className="p-4 border-b border-gray-200">
								<h3 className="text-lg font-semibold text-gray-900">
									Danh sách lý do hoàn tiền (
									{refundReasons?.length || 0})
								</h3>
							</div>

							<div className="p-4">
								{loadingReasons ? (
									<div className="text-center py-8">
										<div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600 mx-auto"></div>
										<p className="text-gray-500 mt-2">
											Đang tải...
										</p>
									</div>
								) : refundReasons &&
								  refundReasons.length > 0 ? (
									<div className="space-y-2">
										{refundReasons.map((reason) => (
											<div
												key={reason.id}
												className="flex items-center justify-between p-4 bg-gradient-to-r from-blue-50 to-blue-100 border border-blue-200 rounded-lg hover:shadow-md transition-all"
											>
												<div className="flex items-center gap-3 flex-1">
													<RefreshCw className="h-5 w-5 text-blue-600" />
													<div className="flex-1">
														{editingReasonId ===
														reason.id ? (
															<div className="space-y-2">
																<Input
																	value={
																		tempReasonText
																	}
																	onChange={(
																		e
																	) =>
																		setTempReasonText(
																			e
																				.target
																				.value
																		)
																	}
																	className="border-blue-300 focus:border-blue-500"
																	onKeyPress={(
																		e
																	) => {
																		if (
																			e.key ===
																			"Enter"
																		) {
																			handleSaveEditReason();
																		}
																	}}
																/>
																<Input
																	type="number"
																	placeholder="Tỷ lệ phí (0-100)..."
																	value={
																		tempReasonRate
																	}
																	onChange={(
																		e
																	) =>
																		setTempReasonRate(
																			e
																				.target
																				.value
																		)
																	}
																	className="border-blue-300 focus:border-blue-500"
																	min="0"
																	max="100"
																	step="0.1"
																/>
															</div>
														) : (
															<>
																<span className="text-gray-900 font-medium">
																	{
																		reason.reason
																	}
																</span>
																{reason.rate !==
																	undefined &&
																	reason.rate !==
																		null && (
																		<div className="text-sm text-blue-600 font-medium mt-1">
																			Phí:{" "}
																			{Math.round(
																				reason.rate *
																					100
																			)}
																			%
																		</div>
																	)}
															</>
														)}
													</div>
												</div>

												{/* Action Buttons */}
												<div className="flex items-center gap-4 ml-4">
													{editingReasonId ===
													reason.id ? (
														<div className="flex gap-2">
															<Button
																onClick={
																	handleSaveEditReason
																}
																size="sm"
																className="bg-green-600 hover:bg-green-700"
															>
																<Check className="h-4 w-4" />
															</Button>
															<Button
																onClick={
																	handleCancelEditReason
																}
																variant="outline"
																size="sm"
															>
																<X className="h-4 w-4" />
															</Button>
														</div>
													) : (
														<>
															<div className="flex items-center gap-2">
																<span className="text-sm text-gray-600">
																	{reason.active
																		? "Hoạt động"
																		: "Vô hiệu"}
																</span>
																<Switch
																	checked={
																		reason.active
																	}
																	onCheckedChange={() =>
																		handleToggleReason(
																			reason.id,
																			reason.active
																		)
																	}
																	className="data-[state=checked]:bg-green-500 data-[state=unchecked]:bg-gray-300"
																/>
															</div>
															<div className="flex gap-2">
																<Button
																	onClick={() =>
																		handleEditReason(
																			reason
																		)
																	}
																	size="sm"
																	className="bg-blue-600 hover:bg-blue-700"
																>
																	<Edit3 className="h-4 w-4" />
																</Button>
																<Button
																	onClick={() =>
																		handleDeleteReason(
																			reason.id
																		)
																	}
																	size="sm"
																	variant="outline"
																	className="text-red-600 hover:text-red-700 hover:bg-red-50"
																>
																	<Trash2 className="h-4 w-4" />
																</Button>
															</div>
														</>
													)}
												</div>
											</div>
										))}
									</div>
								) : (
									<div className="text-center py-12">
										<RefreshCw className="h-12 w-12 text-gray-400 mx-auto mb-4" />
										<p className="text-gray-500">
											Chưa có lý do hoàn tiền nào
										</p>
									</div>
								)}
							</div>
						</div>
					</TabsContent>
				</Tabs>

				{/* Save Changes Button */}
			</div>
		</div>
	);
}
