import { useState } from "react";
import {
	Calendar,
	MapPin,
	User,
	Package,
	ExternalLink,
	X,
	MoreVertical,
} from "lucide-react";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
	DropdownMenu,
	DropdownMenuContent,
	DropdownMenuItem,
	DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import {
	Dialog,
	DialogContent,
	DialogDescription,
	DialogFooter,
	DialogHeader,
	DialogTitle,
	DialogTrigger,
} from "@/components/ui/dialog";
import { getRequestTypeText } from "@/utils/reqTypeHandler";
import { getStatusBadgeVariant, getStatusText } from "@/utils/statusHandler";
import { formatDate } from "@/utils/parseDateTime";

const RequestCard = ({ request, listView = false }) => {
	const [isDialogOpen, setIsDialogOpen] = useState(false);
	const allItems = [
		...(request?.requestItems || []),
		...((request?.subRequests || []).flatMap((sub) => sub.requestItems || []))
	];

	const handleCancelRequest = () => {
		// TODO: Implement cancel request functionality
		console.log("Cancel request:", request.id);
		setIsDialogOpen(false);
	};

	if (listView) {
		return (
			<Card className="shadow-sm hover:shadow-lg transition-all duration-300 border-l-4 border-l-blue-500 bg-white">
				<CardContent className="px-3 py-0">
					{/* Header - Request ID and Time with Menu */}
					<div className="flex items-center justify-between mb-2">
						<div className="text-lg font-bold text-blue-600">
							#{request.id || "N/A"}
						</div>
						<div className="flex items-center gap-3">
							<div className="text-sm text-gray-500 font-medium">
								{formatDate(request.createdAt)}
							</div>
							{/* Three dots menu */}
							<DropdownMenu>
								<DropdownMenuTrigger asChild>
									<Button
										variant="ghost"
										size="sm"
										className="h-8 w-8 p-0 hover:bg-gray-100"
									>
										<MoreVertical className="h-4 w-4 text-gray-500" />
									</Button>
								</DropdownMenuTrigger>
								<DropdownMenuContent
									align="end"
									className="w-30"
								>
									<Dialog
										open={isDialogOpen}
										onOpenChange={setIsDialogOpen}
									>
										<DialogTrigger asChild>
											<DropdownMenuItem
												onSelect={(e) =>
													e.preventDefault()
												}
												className="text-red-600 cursor-pointer"
											>
												Hủy yêu cầu
											</DropdownMenuItem>
										</DialogTrigger>
										<DialogContent>
											<DialogHeader>
												<DialogTitle>
													Xác nhận hủy yêu cầu
												</DialogTitle>
												<DialogDescription>
													Bạn có chắc chắn muốn hủy
													yêu cầu #{request.id}? Hành
													động này không thể hoàn tác.
												</DialogDescription>
											</DialogHeader>
											<DialogFooter>
												<Button
													variant="outline"
													onClick={() =>
														setIsDialogOpen(false)
													}
												>
													Hủy
												</Button>
												<Button
													variant="destructive"
													onClick={
														handleCancelRequest
													}
												>
													Xác nhận
												</Button>
											</DialogFooter>
										</DialogContent>
									</Dialog>
								</DropdownMenuContent>
							</DropdownMenu>
						</div>
					</div>

					{/* Content Row */}
					<div className="flex items-start justify-between gap-6">
						{/* Left side - Main info */}
						<div className="flex-1 min-w-0">
							<div className="flex items-center gap-4 mb-2">
								{/* Request Type */}
								<div className="flex items-center gap-1">
									<span className="text-sm text-gray-500 font-medium">
										Loại yêu cầu:
									</span>
									<Badge
										variant="outline"
										className="px-2 py-1 text-xs font-medium border-blue-200 text-blue-700 bg-blue-50"
									>
										{getRequestTypeText(
											request.requestType
										)}
									</Badge>
								</div>

								{/* Product Count */}
								<div className="flex items-center gap-2">
									<span className="text-sm text-gray-500 font-medium">
										Sản phẩm:
									</span>
									<div className="flex items-center gap-1 bg-orange-50 px-2 py-2 rounded">
										<Package className="h-4 w-4 text-orange-700" />
										<span className="text-xs font-semibold text-orange-800">
											{request?.requestItems?.concat(request?.subRequests)?.length}
										</span>
									</div>
								</div>

								{/* Status */}
								<div className="flex items-center gap-2">
									<span className="text-sm text-gray-500 font-medium">
										Trạng thái:
									</span>
									<Badge
										variant={getStatusBadgeVariant(
											request.status
										)}
										className="px-2 py-1 text-xs font-semibold"
									>
										{getStatusText(request.status)}
									</Badge>
								</div>
							</div>

							{/* Shipping Address */}
							<div className="flex items-center gap-2">
								<div className="w-6 h-6 bg-green-100 rounded-full flex items-center justify-center">
									<MapPin className="h-3 w-3 text-green-600" />
								</div>
								<div className="text-sm flex-1 min-w-0">
									<div className="font-semibold text-gray-800 truncate">
										{request.shippingAddress?.name}
									</div>
									<div className="text-gray-500 text-xs truncate">
										{request.shippingAddress?.location}
									</div>
									<div className="text-gray-500 text-xs">
										{request.shippingAddress?.phoneNumber}
									</div>
								</div>
							</div>
						</div>

						{/* Right side - Product preview */}
						<div className="flex flex-col items-end">
							{/* First product preview */}
							{request.requestItems.length > 0 && (
								<div className="text-right max-w-xs">
									<div className="font-medium text-gray-800 text-sm truncate">
										{request.requestItems[0].productName}
									</div>
									{request.requestItems.length > 1 && (
										<div className="text-xs text-gray-500 mt-1">
											+ {request.requestItems.length - 1}{" "}
											sản phẩm khác
										</div>
									)}
								</div>
							)}
						</div>
					</div>
				</CardContent>
			</Card>
		);
	}

	// Original card view for grid layout
	return (
		<Card className="shadow-sm hover:shadow-md transition-shadow">
			<CardContent className="p-6">
				{/* Header */}
				<div className="flex items-start justify-between mb-4">
					<div className="space-y-1">
						<div className="flex items-center gap-2">
							<Badge
								variant={getStatusBadgeVariant(request.status)}
							>
								{getStatusText(request.status)}
							</Badge>
							<Badge variant="outline">
								{getRequestTypeText(request.requestType)}
							</Badge>
						</div>
					</div>
				</div>

				{/* Customer Info */}
				<div className="flex items-center gap-2 mb-4">
					<User className="h-4 w-4 text-gray-400" />
					<span className="text-sm font-medium">
						{request.customer?.name}
					</span>
				</div>

				{/* Shipping Address */}
				<div className="flex items-start gap-2 mb-4">
					<MapPin className="h-4 w-4 text-gray-400 mt-0.5" />
					<div className="text-sm">
						<p className="font-medium">
							{request.shippingAddress?.name}
						</p>
						<p className="text-gray-600">
							{request.shippingAddress?.location}
						</p>
						<p className="text-gray-500">
							{request.shippingAddress?.phoneNumber}
						</p>
					</div>
				</div>

				{/* Request Items */}
				<div className="space-y-3 mb-4">
					<div className="flex items-center gap-2">
						<Package className="h-4 w-4 text-gray-400" />
						<span className="text-sm font-medium">
							Sản phẩm ({allItems.length})
						</span>
					</div>
					{console.log(allItems)}
					{allItems.map((item) => (
						<div key={item.id} className="pl-6 space-y-1">
							<div className="flex items-center justify-between">
								<p className="text-sm font-medium">
									{item.productName}
								</p>
								<span className="text-sm text-gray-500">
									x{item.quantity}
								</span>
							</div>
							{item.productURL && (
								<div className="flex items-center gap-1">
									<ExternalLink className="h-3 w-3 text-gray-400" />
									<a
										href={item.productURL}
										target="_blank"
										rel="noopener noreferrer"
										className="text-xs text-blue-600 hover:underline"
									>
										Xem link sản phẩm
									</a>
								</div>
							)}
							{item.variants && item.variants.length > 0 && (
								<p className="text-xs text-gray-500">
									Loại sản phẩm: {item.variants.join(", ")}
								</p>
							)}
						</div>
					))}
				</div>

				{/* Dates */}
				<div className="flex items-center gap-2 text-sm text-gray-500">
					<Calendar className="h-4 w-4" />
					<span>Tạo: {formatDate(request.createdAt)}</span>
				</div>
			</CardContent>
		</Card>
	);
};

export default RequestCard;
