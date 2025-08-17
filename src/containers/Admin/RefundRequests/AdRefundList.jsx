import React from 'react'
import { useGetRefundListQuery } from '@/services/gshopApi';
import { useNavigate, useSearchParams } from 'react-router-dom';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';
import { Search } from 'lucide-react';
import {
  Select,
  SelectTrigger,
  SelectContent,
  SelectItem,
  SelectValue,
} from '@/components/ui/select';
import { Input } from '@/components/ui/input';
import PageLoading from '@/components/PageLoading';
import PageError from '@/components/PageError';
import { useURLSync } from '@/hooks/useURLSync';
import { PaginationBar } from '@/utils/Pagination';
import { formatVNDWithoutSymbol } from '@/utils/formatCurrency';
import { getStatusText } from '@/utils/statusHandler';

const AdRefundList = () => {
  const navigate = useNavigate();
  const [searchParams, setSearchParams] = useSearchParams();

  const [page, setPage] = useURLSync(searchParams, setSearchParams, 'page', 'number', 1);
  const [size] = useURLSync(searchParams, setSearchParams, 'size', 'number', 10);
  const [status] = useURLSync(searchParams, setSearchParams, 'status', 'string', 'ALL');
  const [sort] = useURLSync(searchParams, setSearchParams, 'sort', 'array', ['createdAt,desc']);

  const PAGE_SIZE_OPTIONS = [5, 10, 20, 50];
  const STATUS_OPTIONS = [
    { value: 'ALL', label: 'Tất cả' },
    { value: 'PENDING', label: 'Chờ duyệt' },
    { value: 'APPROVED', label: 'Đã duyệt' },
    { value: 'REJECTED', label: 'Đã từ chối' },
    { value: 'COMPLETED', label: 'Hoàn tất' },
    { value: 'FAILED', label: 'Thất bại' },
  ];

  const { data: refundData, isLoading, isError } = useGetRefundListQuery({
    page: Number(page) - 1,
    size,
    sort,
    ...(status !== 'ALL' && { status }),
  });

  const handlePageSizeChange = (value) => {
    setSearchParams((prev) => {
      prev.set('size', value);
      prev.set('page', '1');
      return prev;
    });
  };

  const handleStatusChange = (value) => {
    setSearchParams((prev) => {
      prev.set('status', value);
      prev.set('page', '1');
      return prev;
    });
  };

  const totalPages = refundData?.totalPages || 1;

  const getRefundStatusColor = (s) => {
    switch (s) {
      case 'PENDING':
        return 'bg-yellow-100 text-yellow-800';
      case 'APPROVED':
        return 'bg-blue-100 text-blue-800';
      case 'REJECTED':
        return 'bg-red-100 text-red-800';
      case 'COMPLETED':
        return 'bg-green-100 text-green-800';
      case 'FAILED':
        return 'bg-red-100 text-red-800';
      default:
        return 'bg-gray-100 text-gray-800';
    }
  };

  const getRefundStatusText = (s) => {
    switch (s) {
      case 'PENDING':
        return 'Chờ duyệt';
      case 'APPROVED':
        return 'Đã duyệt';
      case 'REJECTED':
        return 'Đã từ chối';
      case 'COMPLETED':
        return 'Hoàn tất';
      case 'FAILED':
        return 'Thất bại';
      default:
        return getStatusText(s) || s;
    }
  };

  const renderTable = (refunds) => (
    <Table className="w-full rounded-2xl shadow-md border border-gray-200">
      <TableHeader>
        <TableRow className="bg-blue-100 rounded-t-2xl">
          <TableHead className="w-24 text-gray-700 font-semibold text-sm rounded-tl-2xl bg-blue-100">
            Mã hoàn tiền
          </TableHead>
          <TableHead className="text-gray-700 font-semibold text-sm bg-blue-100">
            Mã đơn hàng
          </TableHead>
          <TableHead className="text-gray-700 font-semibold text-sm bg-blue-100">
            Lý do
          </TableHead>
          <TableHead className="text-gray-700 font-semibold text-sm bg-blue-100">
            Minh chứng
          </TableHead>
          <TableHead className="text-gray-700 font-semibold text-sm bg-blue-100">
            Số tiền
          </TableHead>
          <TableHead className="text-gray-700 font-semibold text-sm bg-blue-100">
            Trạng thái
          </TableHead>
          <TableHead className="text-center text-gray-700 font-semibold text-sm rounded-tr-2xl bg-blue-100">
            Ngày tạo
          </TableHead>
        </TableRow>
      </TableHeader>
      <TableBody>
        {refunds.map((refund) => (
          <TableRow
            key={refund.id}
            className="cursor-pointer transition hover:bg-blue-50/70 group"
            onClick={() => refund.orderId && navigate(`/admin/orders/${refund.orderId}`)}
          >
            <TableCell className="font-medium text-xs w-24 py-3 group-hover:text-blue-700">{refund.id}</TableCell>
            <TableCell className="font-medium py-3">{refund.orderId || '-'}</TableCell>
            <TableCell className="py-3 truncate max-w-[320px]" title={refund.reason}>{refund.reason || '-'}</TableCell>
            <TableCell className="py-3">
              {Array.isArray(refund.evidence) ? `${refund.evidence.length} tệp` : '0 tệp'}
            </TableCell>
            <TableCell className="py-3">{formatVNDWithoutSymbol(Number(refund.amount || 0).toFixed(0))}</TableCell>
            <TableCell className="py-3">
              <span className={`px-2 py-1 rounded-full text-xs font-medium ${getRefundStatusColor(refund.status)} group-hover:shadow`}>
                {getRefundStatusText(refund.status)}
              </span>
            </TableCell>
            <TableCell className="text-center py-3">{refund.createdAt ? new Date(refund.createdAt).toLocaleDateString('vi-VN') : '-'}</TableCell>
          </TableRow>
        ))}
      </TableBody>
    </Table>
  );

  return (
    <div className="w-full px-2 md:px-6 flex flex-col flex-1 min-h-screen">
      <div className="flex flex-col gap-4 mb-6">
        <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4 bg-white rounded-xl shadow p-4">
          <div className="flex items-center gap-2">
            <label htmlFor="pageSize" className="text-sm text-gray-600 font-medium">
              Số dòng/trang:
            </label>
            <Select value={String(size)} onValueChange={(value) => handlePageSizeChange(Number(value))}>
              <SelectTrigger id="pageSize" className="w-24 rounded-lg border-gray-300 focus:ring-2 focus:ring-blue-500">
                <SelectValue />
              </SelectTrigger>
              <SelectContent className="rounded-lg shadow">
                {PAGE_SIZE_OPTIONS.map((opt) => (
                  <SelectItem key={opt} value={String(opt)} className="rounded-lg">
                    {opt}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>

            <label htmlFor="statusFilter" className="text-sm text-gray-600 font-medium ml-4">
              Trạng thái:
            </label>
            <Select value={status || ''} onValueChange={(value) => handleStatusChange(value)}>
              <SelectTrigger id="statusFilter" className="w-40 rounded-lg border-gray-300 focus:ring-2 focus:ring-blue-500">
                <SelectValue placeholder="Tất cả" />
              </SelectTrigger>
              <SelectContent className="rounded-lg shadow">
                {STATUS_OPTIONS.map((opt) => (
                  <SelectItem key={opt.value} value={opt.value} className="rounded-lg">
                    {opt.label}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
        </div>

        {/* Search Bar (inactive for now) */}
        <div className="relative max-w-md mb-4">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-5 w-5 text-gray-400" />
          <Input
            type="text"
            placeholder="Tìm kiếm theo mã đơn/hoàn tiền"
            className="pl-10 rounded-lg border-gray-300 focus:ring-2 focus:ring-blue-500 py-2 text-base"
            onKeyDown={(e) => {
              if (e.key === 'Enter') {
                // reserved for future search
              }
            }}
          />
        </div>
      </div>

      <div className="flex-1 flex flex-col">
        {isLoading ? (
          <PageLoading />
        ) : isError ? (
          <PageError />
        ) : (
          renderTable(refundData?.content || [])
        )}
      </div>

      <PaginationBar totalPages={totalPages} page={page} setPage={setPage} />
    </div>
  )
}

export default AdRefundList