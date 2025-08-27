import React, { useEffect, useState } from 'react'
import { useSearchParams } from 'react-router-dom'
import { useGetWithdrawRequestAdminQuery } from '@/services/gshopApi'
import { useURLSync } from '@/hooks/useURLSync'
import PageLoading from '@/components/PageLoading'
import PageError from '@/components/PageError'
import { PaginationBar } from '@/utils/Pagination'
import { formatVNDWithoutSymbol } from '@/utils/formatCurrency'
import { getStatusColor, getStatusText } from '@/utils/statusHandler'
import { Search } from 'lucide-react'
import { Input } from '@/components/ui/input'
import { Select, SelectTrigger, SelectContent, SelectItem, SelectValue } from '@/components/ui/select'
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table'
import AdWithdrawDetailDialog from './AdWithdrawDetailDialog'

const PAGE_SIZE_OPTIONS = [5, 10, 20, 50]
const STATUS_OPTIONS = [
  { value: 'ALL', label: 'Tất cả' },
  { value: 'PENDING', label: 'Chờ xử lý' },
  { value: 'APPROVED', label: 'Đã duyệt' },
  { value: 'REJECTED', label: 'Đã từ chối' },
  { value: 'COMPLETED', label: 'Hoàn tất' },
  { value: 'FAILED', label: 'Thất bại' },
]

const AdWithdrawList = () => {
  const [open, setOpen] = useState(false)
  const [selectedWithdraw, setSelectedWithdraw] = useState(null)
  const [searchParams, setSearchParams] = useSearchParams()

  const [page, setPage] = useURLSync(searchParams, setSearchParams, 'page', 'number', 1)
  const [size] = useURLSync(searchParams, setSearchParams, 'size', 'number', 10)
  const [status] = useURLSync(searchParams, setSearchParams, 'status', 'string', 'ALL')
  const [sort] = useURLSync(searchParams, setSearchParams, 'sort', 'array', ['createdAt,desc'])

  const { data: withdrawData, isLoading, isError } = useGetWithdrawRequestAdminQuery({
    page: Number(page) - 1,
    size,
    sort,
    ...(status !== 'ALL' && { status }),
  })

  const totalPages = withdrawData?.totalPages || 1

  const handlePageSizeChange = (value) => {
    setSearchParams((prev) => {
      prev.set('size', value)
      prev.set('page', '1')
      return prev
    })
  }

  const handleStatusChange = (value) => {
    setSearchParams((prev) => {
      prev.set('status', value)
      prev.set('page', '1')
      return prev
    })
  }

  useEffect(() => {
    setSelectedWithdraw(withdrawData?.content?.find((w) => w.id === selectedWithdraw?.id))
  }, [open, selectedWithdraw?.id, withdrawData?.content])

  const renderTable = (rows) => (
    <Table className="w-full rounded-2xl shadow-md border border-gray-200">
      <TableHeader>
        <TableRow className="bg-blue-100 rounded-t-2xl">
          <TableHead className="w-24 text-gray-700 font-semibold text-sm rounded-tl-2xl bg-blue-100">
            Mã rút
          </TableHead>
          <TableHead className="text-gray-700 font-semibold text-sm bg-blue-100">
            Chủ tài khoản
          </TableHead>
          <TableHead className="text-gray-700 font-semibold text-sm bg-blue-100">
            Số tài khoản
          </TableHead>
          <TableHead className="text-gray-700 font-semibold text-sm bg-blue-100">
            Ngân hàng
          </TableHead>
          <TableHead className="text-gray-700 font-semibold text-sm bg-blue-100">
            Lý do
          </TableHead>
          <TableHead className="text-gray-700 font-semibold text-sm bg-blue-100">
            Hóa đơn
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
        {rows.map((w) => (
          <TableRow
            key={w.id}
            className="transition hover:bg-blue-50/70 group cursor-pointer"
            onClick={() => {
              setSelectedWithdraw(w)
              setOpen(true)
            }}
          >
            <TableCell className="font-medium text-xs w-24 py-3 group-hover:text-blue-700">{w.id}</TableCell>
            <TableCell className="py-3">{w.bankAccount?.accountHolderName || '-'}</TableCell>
            <TableCell className="py-3">{w.bankAccount?.bankAccountNumber || '-'}</TableCell>
            <TableCell className="py-3">{w.bankAccount?.providerName || '-'}</TableCell>
            <TableCell className="py-3 truncate max-w-[320px]" title={w.reason}>{w.reason || '-'}</TableCell>
            <TableCell className="py-3">
              {w.bankingBill ? (
                <div className="h-12 w-12 overflow-hidden rounded-md border">
                  <img src={w.bankingBill} alt="bill" className="h-full w-full object-contain" />
                </div>
              ) : (
                '-'
              )}
            </TableCell>
            <TableCell className="py-3">{formatVNDWithoutSymbol(Number(w.amount || 0).toFixed(0))}</TableCell>
            <TableCell className="py-3">
              <span className={`px-2 py-1 rounded-full text-xs font-medium ${getStatusColor(w.status)} group-hover:shadow`}>
                {getStatusText(w.status)}
              </span>
            </TableCell>
            <TableCell className="text-center py-3">{w.createdAt ? new Date(w.createdAt).toLocaleDateString('vi-VN') : '-'}</TableCell>
          </TableRow>
        ))}
      </TableBody>
    </Table>
  )

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
            placeholder="Tìm kiếm theo mã yêu cầu"
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
          renderTable(withdrawData?.content || [])
        )}
      </div>

      <PaginationBar totalPages={totalPages} page={page} setPage={setPage} />
      <AdWithdrawDetailDialog open={open} setOpen={setOpen} withdraw={selectedWithdraw} />
    </div>
  )
}

export default AdWithdrawList