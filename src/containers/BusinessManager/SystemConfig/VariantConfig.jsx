import React, { useState } from "react";
import {
	useGetAllVariantsQuery,
	useCreateVariantMutation,
	useUpdateVariantMutation,
	useDeleteVariantMutation,
} from "@/services/gshopApi";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
	AlertDialog,
	AlertDialogAction,
	AlertDialogCancel,
	AlertDialogContent,
	AlertDialogDescription,
	AlertDialogFooter,
	AlertDialogHeader,
	AlertDialogTitle,
	AlertDialogTrigger,
} from "@/components/ui/alert-dialog";
import { toast } from "sonner";
import { Package, Search, Plus, Edit3, X, Check, Trash2 } from "lucide-react";

export default function VariantConfig() {
	const [searchTerm, setSearchTerm] = useState("");
	const [editingId, setEditingId] = useState(null);
	const [tempName, setTempName] = useState("");
	const [newVariantName, setNewVariantName] = useState("");
	const [isAdding, setIsAdding] = useState(false);
	const [deleteDialog, setDeleteDialog] = useState({
		open: false,
		id: null,
		name: "",
	});

	// API hooks
	const { data: variants, isLoading, error } = useGetAllVariantsQuery();
	const [createVariant] = useCreateVariantMutation();
	const [updateVariant] = useUpdateVariantMutation();
	const [deleteVariant] = useDeleteVariantMutation();

	// Filter variants based on search
	const filteredVariants =
		variants?.filter((variant) =>
			variant.name.toLowerCase().includes(searchTerm.toLowerCase())
		) || [];

	// Handle edit mode
	const handleEdit = (variant) => {
		setEditingId(variant.id);
		setTempName(variant.name);
	};

	const handleCancel = () => {
		setEditingId(null);
		setTempName("");
	};

	const handleSave = async () => {
		if (!tempName.trim()) {
			toast.error("Tên thuộc tính không được để trống!");
			return;
		}

		try {
			await updateVariant({
				id: editingId,
				name: tempName.trim(),
			}).unwrap();
			toast.success("Cập nhật thuộc tính thành công!");
			handleCancel();
		} catch {
			toast.error("Có lỗi xảy ra khi cập nhật thuộc tính!");
		}
	};

	const handleDelete = async (id, name) => {
		setDeleteDialog({ open: true, id, name });
	};

	const confirmDelete = async () => {
		try {
			await deleteVariant(deleteDialog.id).unwrap();
			toast.success(`Xóa thuộc tính "${deleteDialog.name}" thành công!`);
			setDeleteDialog({ open: false, id: null, name: "" });
		} catch {
			toast.error("Có lỗi xảy ra khi xóa thuộc tính!");
			setDeleteDialog({ open: false, id: null, name: "" });
		}
	};

	const handleAdd = () => {
		setIsAdding(true);
		setNewVariantName("");
	};

	const handleCancelAdd = () => {
		setIsAdding(false);
		setNewVariantName("");
	};

	const handleSaveAdd = async () => {
		if (!newVariantName.trim()) {
			toast.error("Tên thuộc tính không được để trống!");
			return;
		}

		try {
			await createVariant({
				name: newVariantName.trim(),
			}).unwrap();
			toast.success("Thêm thuộc tính thành công!");
			handleCancelAdd();
		} catch {
			toast.error("Có lỗi xảy ra khi thêm thuộc tính!");
		}
	};

	if (isLoading) {
		return (
			<div className="p-6 flex items-center justify-center">
				<div className="text-gray-600">Đang tải dữ liệu...</div>
			</div>
		);
	}

	if (error) {
		return (
			<div className="p-6 flex items-center justify-center">
				<div className="text-red-600">
					Lỗi khi tải dữ liệu thuộc tính
				</div>
			</div>
		);
	}

	return (
		<div className="p-6">
			{/* Header */}
			<div className="mb-6">
				<div className="flex items-center gap-3 mb-4">
					<div className="p-2 bg-blue-100 rounded-lg">
						<Package className="h-6 w-6 text-blue-600" />
					</div>
					<div>
						<h1 className="text-2xl font-bold text-gray-900">
							Quản lý thuộc tính
						</h1>
						<p className="text-gray-600 text-sm">
							Danh sách các thuộc tính trong yêu cầu mua sản phẩm
							trong hệ thống
						</p>
					</div>
				</div>

				{/* Search and Add */}
				<div className="flex items-center gap-4">
					<div className="relative flex-1">
						<Search className="h-4 w-4 absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
						<Input
							placeholder="Tìm kiếm thuộc tính ..."
							value={searchTerm}
							onChange={(e) => setSearchTerm(e.target.value)}
							className="pl-10"
						/>
					</div>
					<Button
						onClick={handleAdd}
						className="bg-blue-600 hover:bg-blue-700"
					>
						<Plus className="h-4 w-4 mr-2" />
						Thêm thuộc tính
					</Button>
				</div>
			</div>

			{/* Variants List */}
			<div className="bg-white rounded-xl shadow-sm border border-gray-200">
				<div className="p-4 border-b border-gray-200">
					<h3 className="text-lg font-semibold text-gray-900">
						Danh sách thuộc tính ({filteredVariants.length})
					</h3>
				</div>

				<div className="p-4">
					{/* Add New Variant Row */}
					{isAdding && (
						<div className="flex items-center justify-between p-4 bg-blue-50 border border-blue-200 rounded-lg mb-4">
							<div className="flex items-center gap-3 flex-1">
								<Package className="h-5 w-5 text-blue-600" />
								<Input
									placeholder="Nhập tên thuộc tính..."
									value={newVariantName}
									onChange={(e) =>
										setNewVariantName(e.target.value)
									}
									className="border-blue-300 focus:border-blue-500"
									onKeyPress={(e) => {
										if (e.key === "Enter") {
											handleSaveAdd();
										}
									}}
								/>
							</div>
							<div className="flex gap-2 ml-4">
								<Button
									onClick={handleSaveAdd}
									size="sm"
									className="bg-green-600 hover:bg-green-700"
								>
									<Check className="h-4 w-4" />
								</Button>
								<Button
									onClick={handleCancelAdd}
									variant="outline"
									size="sm"
								>
									<X className="h-4 w-4" />
								</Button>
							</div>
						</div>
					)}

					{filteredVariants.length === 0 ? (
						<div className="text-center py-12">
							<Package className="h-12 w-12 text-gray-400 mx-auto mb-4" />
							<p className="text-gray-500">
								{searchTerm
									? "Không tìm thấy thuộc tính nào"
									: "Chưa có thuộc tính nào"}
							</p>
						</div>
					) : (
						<div className="space-y-2">
							{filteredVariants.map((variant) => (
								<div
									key={variant.id}
									className="flex items-center justify-between p-4 bg-gradient-to-r from-blue-50 to-blue-100 border border-blue-200 rounded-lg hover:shadow-md transition-all"
								>
									<div className="flex items-center gap-3 flex-1">
										<Package className="h-5 w-5 text-blue-600" />
										{editingId === variant.id ? (
											<Input
												value={tempName}
												onChange={(e) =>
													setTempName(e.target.value)
												}
												className="border-blue-300 focus:border-blue-500"
												onKeyPress={(e) => {
													if (e.key === "Enter") {
														handleSave();
													}
												}}
											/>
										) : (
											<span className="text-gray-900 font-medium">
												{variant.name}
											</span>
										)}
									</div>

									{/* Action Buttons */}
									<div className="flex gap-2 ml-4">
										{editingId === variant.id ? (
											<>
												<Button
													onClick={handleSave}
													size="sm"
													className="bg-green-600 hover:bg-green-700"
												>
													<Check className="h-4 w-4" />
												</Button>
												<Button
													onClick={handleCancel}
													variant="outline"
													size="sm"
												>
													<X className="h-4 w-4" />
												</Button>
											</>
										) : (
											<>
												<Button
													onClick={() =>
														handleEdit(variant)
													}
													size="sm"
													className="bg-blue-600 hover:bg-blue-700"
												>
													<Edit3 className="h-4 w-4" />
												</Button>
												<Button
													onClick={() =>
														handleDelete(
															variant.id,
															variant.name
														)
													}
													size="sm"
													variant="outline"
													className="text-red-600 hover:text-red-700 hover:bg-red-50"
												>
													<Trash2 className="h-4 w-4" />
												</Button>
											</>
										)}
									</div>
								</div>
							))}
						</div>
					)}
				</div>
			</div>

			<AlertDialog
				open={deleteDialog.open}
				onOpenChange={(open) =>
					setDeleteDialog((prev) => ({ ...prev, open }))
				}
			>
				<AlertDialogContent>
					<AlertDialogHeader>
						<AlertDialogTitle>Xác nhận xóa</AlertDialogTitle>
						<AlertDialogDescription>
							Bạn có chắc chắn muốn xóa thuộc tính "
							{deleteDialog.name}
							"? Hành động này không thể hoàn tác.
						</AlertDialogDescription>
					</AlertDialogHeader>
					<AlertDialogFooter>
						<AlertDialogCancel
							onClick={() =>
								setDeleteDialog({
									open: false,
									id: null,
									name: "",
								})
							}
						>
							Hủy
						</AlertDialogCancel>
						<AlertDialogAction
							onClick={confirmDelete}
							className="bg-red-600 hover:bg-red-700"
						>
							Xóa
						</AlertDialogAction>
					</AlertDialogFooter>
				</AlertDialogContent>
			</AlertDialog>
		</div>
	);
}
