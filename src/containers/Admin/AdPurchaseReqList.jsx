import React, { useState, useRef } from "react";
import { replace, useNavigate } from "react-router-dom";
import {
	Table,
	TableBody,
	TableCell,
	TableHead,
	TableHeader,
	TableRow,
} from "@/components/ui/table";
import { Button } from "@/components/ui/button";
import { Eye, PackageCheck, Receipt, Search } from "lucide-react";
import { Tabs, TabsList, TabsTrigger, TabsContent } from "@/components/ui/tabs";
import {
	useCheckingPurchaseRequestMutation,
	useGetPurchaseRequestQuery,
} from "@/services/gshopApi";
import {
	Pagination,
	PaginationContent,
	PaginationItem,
	PaginationNext,
	PaginationPrevious,
} from "@/components/ui/pagination";
import {
	generatePaginationItems,
	shouldShowPagination,
} from "@/utils/Pagination";
import {
	Select,
	SelectTrigger,
	SelectContent,
	SelectItem,
	SelectValue,
} from "@/components/ui/select";
import { Input } from "@/components/ui/input";
import PageLoading from "@/components/PageLoading";
import { toast } from "sonner";
import {
	Tooltip,
	TooltipContent,
	TooltipTrigger,
} from "@/components/ui/tooltip";
import { getStatusColor, getStatusText } from "@/utils/statusHandler";

const TABS = [
	{ value: "assigned", label: "Yêu cầu đã nhận" },
	{ value: "unassigned", label: "Yêu cầu đang chờ" },
];

const PAGE_SIZE_OPTIONS = [5, 10, 20, 50];

const AdPurchaseReqList = () => {
	const [tab, setTab] = useState("assigned");
	const [currentPage, setCurrentPage] = useState(1);
	const [pageSize, setPageSize] = useState(10);
	const [searchTerm, setSearchTerm] = useState("");
	const searchInputRef = useRef(null);
	const navigate = useNavigate();

	const {
		data: requestsData,
		isFetching: isRequestLoading,
		isError: isRequestError,
	} = useGetPurchaseRequestQuery({
		page: currentPage - 1,
		size: pageSize,
		type: tab,
	});
	const [checking, { isLoading: isCheckLoading }] =
		useCheckingPurchaseRequestMutation();

	const handleChecking = async (requestId) => {
		try {
			await checking(requestId)
				.unwrap()
				.then(() => {
					toast.success("Yêu cầu đã được kiểm tra thành công.");
				});
		} catch (error) {
			toast.error(
				"Lỗi khi kiểm tra yêu cầu: " +
					(error?.data?.message || "Vui lòng thử lại.")
			);
		}
	};

	// Table rendering function
	const renderTable = (requests) => (
		<Table className="w-full rounded-2xl shadow-md border border-gray-200">
			<TableHeader>
				<TableRow className="bg-blue-100 rounded-t-2xl">
					<TableHead className="w-20 text-gray-700 font-semibold text-sm rounded-tl-2xl bg-blue-100">
						Mã yêu cầu
					</TableHead>
					<TableHead className="text-gray-700 font-semibold text-sm bg-blue-100">
						Khách hàng
					</TableHead>
					<TableHead className="text-gray-700 font-semibold text-sm bg-blue-100">
						Cửa hàng
					</TableHead>
					<TableHead className="text-gray-700 font-semibold text-sm bg-blue-100">
						Số điện thoại
					</TableHead>
					<TableHead className="text-gray-700 font-semibold text-sm bg-blue-100">
						Email
					</TableHead>
					<TableHead className="text-gray-700 font-semibold text-sm bg-blue-100">
						Trạng thái
					</TableHead>
					<TableHead className="text-center text-gray-700 font-semibold text-sm bg-blue-100">
						Số lượng sản phẩm
					</TableHead>
					<TableHead className="text-center text-gray-700 font-semibold text-sm bg-blue-100">
						Ngày tạo
					</TableHead>
					<TableHead className="text-center text-gray-700 font-semibold text-sm rounded-tr-2xl bg-blue-100">
						Ngày hết hạn
					</TableHead>
				</TableRow>
			</TableHeader>
			<TableBody>
				{requests.map((request) => (
					<TableRow
						className="cursor-pointer transition hover:bg-blue-50/70 group"
						key={request.id}
						onClick={() =>
							navigate(`purchase-request/${request.id}`)
						}
					>
						<TableCell className="font-medium text-xs w-20 py-3 group-hover:text-blue-700">
							<p>{request.id}</p>
						</TableCell>
						<TableCell className="font-medium py-3">
							{request.customer?.name}
						</TableCell>
						<TableCell className="py-3">
							{request.shop?.name || "-"}
						</TableCell>
						<TableCell className="py-3">
							{request.customer?.phone}
						</TableCell>
						<TableCell className="py-3">
							{request.customer?.email}
						</TableCell>
						<TableCell className="py-3">
							<span
								className={`px-2 py-1 rounded-full text-xs font-medium ${getStatusColor(
									request.status
								)} group-hover:shadow`}
							>
								{getStatusText(request.status)}
							</span>
						</TableCell>
						<TableCell className="text-center py-3">
							<span className="text-sm font-medium">
								{request.requestItems?.length || 0}
							</span>
						</TableCell>
						<TableCell className="text-center py-3">
							{request.createdAt
								? new Date(
										Number(request.createdAt)
								  ).toLocaleDateString("vi-VN")
								: "-"}
						</TableCell>
						<TableCell className="text-center py-3">
							{request.expiredAt
								? new Date(
										Number(request.expiredAt)
								  ).toLocaleDateString("vi-VN")
								: "-"}
						</TableCell>
					</TableRow>
				))}
			</TableBody>
		</Table>
	);

	// Pagination controls
	const totalPages = requestsData?.totalPages || 1;
	const pageFromApi = requestsData?.number ?? currentPage - 1;
	const currentPageDisplay = pageFromApi + 1;

	const handleTabChange = (value) => {
		setTab(value);
		setCurrentPage(1);
	};

	const handlePageSizeChange = (value) => {
		setPageSize(value);
		setCurrentPage(1);
	};

	// Handle search input change
	const handleSearchChange = (e) => {
		setSearchTerm(e.target.value);
	};
	// On blur or Enter, navigate to /purchase-request/{id}
	const handleSearchAction = () => {
		const value = searchInputRef.current?.value?.trim();
		if (value) {
			navigate(`purchase-request/${value}`);
		}
	};

	return (
		<div className="w-full px-2 md:px-6 flex flex-col flex-1 min-h-screen">
			<Tabs
				value={tab}
				onValueChange={handleTabChange}
				className="flex-1 flex flex-col"
			>
				<div className="flex flex-col gap-4 mb-6">
					<div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4 bg-white rounded-xl shadow p-4">
						<TabsList className="rounded-lg bg-gray-100">
							{TABS.map((t) => (
								<TabsTrigger
									key={t.value}
									value={t.value}
									className="rounded-lg data-[state=active]:bg-blue-600 data-[state=active]:text-white text-gray-700 font-semibold"
								>
									{t.label}
								</TabsTrigger>
							))}
						</TabsList>
						<div className="flex items-center gap-2">
							<label
								htmlFor="pageSize"
								className="text-sm text-gray-600 font-medium"
							>
								Số dòng/trang:
							</label>
							<Select
								value={String(pageSize)}
								onValueChange={handlePageSizeChange}
							>
								<SelectTrigger
									id="pageSize"
									className="w-24 rounded-lg border-gray-300 focus:ring-2 focus:ring-blue-500"
								>
									<SelectValue />
								</SelectTrigger>
								<SelectContent className="rounded-lg shadow">
									{PAGE_SIZE_OPTIONS.map((size) => (
										<SelectItem
											key={size}
											value={String(size)}
											className="rounded-lg"
										>
											{size}
										</SelectItem>
									))}
								</SelectContent>
							</Select>
						</div>
					</div>

					{/* Search Bar */}
					<div className="relative max-w-md mb-4">
						<Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-5 w-5 text-gray-400" />
						<Input
							ref={searchInputRef}
							type="text"
							placeholder="Tìm kiếm theo ID"
							value={searchTerm}
							onChange={handleSearchChange}
							onBlur={handleSearchAction}
							onKeyDown={(e) => {
								if (e.key === "Enter") {
									handleSearchAction();
								}
							}}
							className="pl-10 rounded-lg border-gray-300 focus:ring-2 focus:ring-blue-500 py-2 text-base"
						/>
					</div>
				</div>
				<div className="flex-1 flex flex-col">
					<TabsContent value="assigned">
						{isRequestLoading ? (
							<PageLoading />
						) : isRequestError ? (
							<div>Lỗi khi tải dữ liệu.</div>
						) : (
							renderTable(requestsData?.content || [], true)
						)}
					</TabsContent>
					<TabsContent value="unassigned">
						{isRequestLoading ? (
							<PageLoading disEnableFullScreen />
						) : isRequestError ? (
							<div>Lỗi khi tải dữ liệu.</div>
						) : (
							renderTable(requestsData?.content || [])
						)}
					</TabsContent>
				</div>
				{shouldShowPagination(totalPages) && (
					<div className="flex justify-center mt-4 mb-2">
						<Pagination className="rounded-lg shadow bg-white px-4 py-2">
							<PaginationContent className="gap-1">
								<PaginationItem>
									<PaginationPrevious
										onClick={() =>
											setCurrentPage(
												Math.max(
													1,
													currentPageDisplay - 1
												)
											)
										}
										className={
											currentPageDisplay === 1
												? "pointer-events-none opacity-50 rounded-lg"
												: "cursor-pointer rounded-lg hover:bg-blue-100"
										}
									/>
								</PaginationItem>
								{generatePaginationItems(
									totalPages,
									currentPageDisplay - 1,
									(page) => setCurrentPage(page + 1)
								)}
								<PaginationItem>
									<PaginationNext
										onClick={() =>
											setCurrentPage(
												Math.min(
													totalPages,
													currentPageDisplay + 1
												)
											)
										}
										className={
											currentPageDisplay === totalPages
												? "pointer-events-none opacity-50 rounded-lg"
												: "cursor-pointer rounded-lg hover:bg-blue-100"
										}
									/>
								</PaginationItem>
							</PaginationContent>
						</Pagination>
					</div>
				)}
			</Tabs>
		</div>
	);
};

export default AdPurchaseReqList;
