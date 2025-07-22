import React, { useEffect, useState } from 'react'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import {
  Wallet,
  Plus,
  ArrowUpRight,
  ArrowDownLeft,
  DollarSign,
  BanknoteArrowUp,
  BanknoteArrowDown,
  Clock,
} from 'lucide-react'
import { Link } from 'react-router-dom'
import { useGetWalletQuery, useTransactionHistoryQuery } from '@/services/gshopApi'
import { Skeleton } from '@/components/ui/skeleton'
import { toast } from 'sonner'
import PageLoading from '@/components/PageLoading'
import {
  Pagination,
  PaginationContent,
  PaginationItem,
  PaginationLink,
  PaginationEllipsis,
} from '@/components/ui/pagination'
import { generatePaginationItems, getPaginationInfo, shouldShowPagination } from '@/utils/Pagination'

const getTransactionIcon = (type, status) => {
  if (type === 'DEPOSIT') {
    return {
      icon: BanknoteArrowUp,
      color: status === 'SUCCESS' ? 'text-green-600' : 'text-red-600',
      bg: status === 'SUCCESS' ? 'bg-green-100' : 'bg-red-100'
    }
  } else if (type === 'WITHDRAW') {
    return {
      icon: BanknoteArrowDown,
      color: status === 'SUCCESS' ? 'text-green-600' : 'text-red-600',
      bg: status === 'SUCCESS' ? 'bg-green-100' : 'bg-red-100'
    }
  }
  return {
    icon: Clock,
    color: 'text-gray-600',
    bg: 'bg-gray-100'
  }
}

const WalletOverview = () => {
  const [currentPage, setCurrentPage] = useState(0)
  const { data: wallet, isLoading: isWalletLoading } = useGetWalletQuery()
  const { data: transactionsRes, isLoading: isTransactionLoading, isError: isTransactionError } =
    useTransactionHistoryQuery({ page: currentPage, size: 10, direction: 'ASC' })

  const query = new URLSearchParams(location.search)
  const vnpResponseCode = query.get("vnp_ResponseCode")
  useEffect(() => {
    if (vnpResponseCode === "00") {
      toast.success("Giao dịch đã được xử lý")
    } else if (vnpResponseCode) {
      toast.error("Giao dịch thất bại", {
        description:
          vnpResponseCode === "24"
            ? "Bạn đã hủy giao dịch nạp tiền. Vui lòng thử lại nếu cần."
            : "Có lỗi xảy ra trong quá trình xử lý giao dịch. Vui lòng thử lại sau.",
      })
    }
  }, [vnpResponseCode])

  const formatCurrency = (amount) => {
    return new Intl.NumberFormat("vi-VN", {
      style: "currency",
      currency: "VND",
    }).format(amount || 0)
  }

  const formatDate = (dateString) => {
    return new Date(dateString).toLocaleDateString('vi-VN', {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    })
  }

  if (isTransactionLoading) return <PageLoading />
  if (isTransactionError || !transactionsRes?.content) {
    return <div className="min-h-screen flex items-center justify-center text-lg text-red-600">Không thể tải dữ liệu yêu cầu.</div>
  }

  const transactions = transactionsRes.content
  const pagination = getPaginationInfo(transactionsRes.pageable, transactionsRes.totalPages, transactionsRes.totalElements)

  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="container mx-auto px-4 max-w-6xl">
        {/* Header */}
        <div className="mb-8">
          <div className="flex items-center justify-between mb-4">
            <div className="flex items-center gap-3">
              <div className="p-2 rounded-lg bg-blue-100">
                <Wallet className="h-6 w-6 text-blue-600" />
              </div>
              <div>
                <h1 className="text-2xl font-bold text-gray-900">Quản lý ví tiền</h1>
                <p className="text-gray-600">Theo dõi số dư và lịch sử giao dịch</p>
              </div>
            </div>
            <Button asChild>
              <Link to="/wallet/deposit">
                <Plus className="mr-2 h-4 w-4" />
                Nạp tiền
              </Link>
            </Button>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Balance Card */}
          <div className="lg:col-span-1">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <DollarSign className="h-5 w-5 text-green-600" />
                  Số dư hiện tại
                </CardTitle>
              </CardHeader>
              <CardContent>
                {isWalletLoading ? (
                  <div className="space-y-3">
                    <Skeleton className="h-12 w-full" />
                    <Skeleton className="h-4 w-3/4" />
                  </div>
                ) : (
                  <div className="space-y-4">
                    <div className="text-3xl font-bold text-gray-900">
                      {formatCurrency(wallet?.balance)}
                    </div>
                    <p className="text-sm text-gray-600">
                      Số dư khả dụng trong ví
                    </p>

                    <div className="pt-4 space-y-3">
                      <div className="flex items-center justify-between text-sm">
                        <span className="text-gray-600">Tổng nạp:</span>
                        <span className="font-medium text-green-600">
                          {formatCurrency(wallet?.totalDeposited || 0)}
                        </span>
                      </div>
                      <div className="flex items-center justify-between text-sm">
                        <span className="text-gray-600">Tổng chi:</span>
                        <span className="font-medium text-red-600">
                          {formatCurrency(wallet?.totalSpent || 0)}
                        </span>
                      </div>
                    </div>
                  </div>
                )}
              </CardContent>
            </Card>

            {/* Quick Actions */}
            <Card className="mt-6">
              <CardHeader>
                <CardTitle>Thao tác nhanh</CardTitle>
              </CardHeader>
              <CardContent className="space-y-3">
                <Button asChild className="w-full justify-start" variant="outline">
                  <Link to="/wallet/deposit">
                    <Plus className="mr-2 h-4 w-4" />
                    Nạp tiền vào ví
                  </Link>
                </Button>
                <Button asChild className="w-full justify-start" variant="outline">
                  <Link to="/account-center/purchase-request-list">
                    <ArrowUpRight className="mr-2 h-4 w-4" />
                    Tạo yêu cầu mua hàng
                  </Link>
                </Button>
                <Button asChild className="w-full justify-start" variant="outline">
                  <Link to="/account-center/orders">
                    <ArrowDownLeft className="mr-2 h-4 w-4" />
                    Xem đơn hàng
                  </Link>
                </Button>
              </CardContent>
            </Card>
          </div>

          {/* Transaction History */}
          <div className="lg:col-span-2">
            <Card>
              <CardHeader>
                <CardTitle>Lịch sử giao dịch</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {transactions.map((transaction) => {
                    const { icon: Icon, color, bg } = getTransactionIcon(transaction.type, transaction.status)

                    return (
                      <div
                        key={transaction.id}
                        className="flex items-center justify-between p-4 border border-gray-200 rounded-lg hover:bg-gray-50 transition-colors"
                      >
                        <div className="flex items-center gap-3">
                          <div className={`p-2 rounded-lg ${bg}`}>
                            <Icon className={`h-4 w-4 ${color}`} />
                          </div>
                          <div>
                            <p className="font-medium text-gray-900">{transaction.description}</p>
                            <p className="text-sm text-gray-600">{formatDate(transaction.updatedAt)}</p>
                          </div>
                        </div>
                        <div className={`font-semibold ${transaction.type === 'DEPOSIT' ? 'text-green-600' : 'text-red-600'}`}>
                          {transaction.type === 'DEPOSIT' ? '+' : '-'}
                          {formatCurrency(transaction.amount)}
                        </div>
                      </div>
                    )
                  })}

                  {transactions.length === 0 && (
                    <div className="text-center py-8">
                      <Wallet className="h-12 w-12 text-gray-400 mx-auto mb-4" />
                      <p className="text-gray-600">Chưa có giao dịch nào</p>
                      <Button asChild className="mt-4">
                        <Link to="/wallet/deposit">Nạp tiền ngay</Link>
                      </Button>
                    </div>
                  )}
                </div>

                {/* Pagination */}
                {shouldShowPagination(pagination.totalPages) && (
                  <Pagination className="mt-6">
                    <PaginationContent>
                      {generatePaginationItems(pagination.totalPages, pagination.currentPage, setCurrentPage)}
                    </PaginationContent>
                  </Pagination>
                )}
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </div>
  )
}

export default WalletOverview
