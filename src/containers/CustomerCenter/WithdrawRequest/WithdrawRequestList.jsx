import React from 'react'
import PageError from '@/components/PageError'
import PageLoading from '@/components/PageLoading'
import { useSearchParams } from 'react-router-dom'
import { useURLSync } from '@/hooks/useURLSync'
import { useGetWithdrawRequestCustomerQuery } from '@/services/gshopApi'
import { PaginationBar } from '@/utils/Pagination'
import WithdrawFilters from './WithdrawFilters'
import WithdrawCard from '@/components/WithdrawCard'

const WithdrawRequestList = () => {
  const [searchParams, setSearchParams] = useSearchParams()
  const [page, setPage] = useURLSync(searchParams, setSearchParams, 'page', 'number', 1)
  const [size] = useURLSync(searchParams, setSearchParams, 'size', 'number', 10)
  const [sort, setSort] = useURLSync(searchParams, setSearchParams, 'sort', 'string', 'createdAt,desc')
  const [status, setStatus] = useURLSync(searchParams, setSearchParams, 'status', 'string', 'ALL')

  const { data, isLoading, isError } = useGetWithdrawRequestCustomerQuery({
    page: page - 1,
    size,
    sort,
    ...(status !== 'ALL' && { status }),
  })

  if (isLoading) return <PageLoading />
  if (isError) return <PageError />

  const rows = data?.content || []
  const totalPages = data?.totalPages || 1

  const handleClearFilters = () => {
    setStatus('ALL')
    setSort('createdAt,desc')
  }

  return (
    <div className="min-h-screen bg-white">
      <div className="max-w-7xl mx-auto px-3 py-6 space-y-4">
        {/* Filters */}
        <WithdrawFilters
          status={status}
          setStatus={setStatus}
          sort={sort}
          setSort={setSort}
          onClear={handleClearFilters}
        />

        {/* List */}
        {rows.length === 0 ? (
          <div className="rounded-xl border p-6 text-center text-muted-foreground">Không có dữ liệu</div>
        ) : (
          <div className="flex flex-col gap-2">
            {rows.map((w) => (
              <WithdrawCard key={w.id} withdraw={w} />
            ))}
          </div>
        )}

        {/* Pagination */}
        <div className="flex justify-center">
          <PaginationBar totalPages={totalPages} page={page} setPage={setPage} />
        </div>
      </div>
    </div>
  )
}

export default WithdrawRequestList