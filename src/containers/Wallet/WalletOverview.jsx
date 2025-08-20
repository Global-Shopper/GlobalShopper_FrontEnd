import React, { useEffect, useState } from 'react'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import {
  Wallet,
  Plus,
  DollarSign,
  BanknoteArrowUp,
  BanknoteArrowDown,
  Clock,
  Minus,
  Eye,
  EyeOff,
} from 'lucide-react'
import { Link } from 'react-router-dom'
import { useGetBankAccountQuery, useGetWalletQuery, useTransactionHistoryQuery } from '@/services/gshopApi'
import { Skeleton } from '@/components/ui/skeleton'
import { toast } from 'sonner'
import PageLoading from '@/components/PageLoading'
import { getPaginationInfo, PaginationBar } from '@/utils/Pagination'
import AddBankAccountDialog from './AddBankAccountDialog'

const WalletOverview = () => {
  const [currentPage, setCurrentPage] = useState(0)
  const [showFullAcc, setShowFullAcc] = useState({})
  const { data: wallet, isLoading: isWalletLoading } = useGetWalletQuery()
  const { data: transactionsRes, isLoading: isTransactionLoading, isError: isTransactionError } =
    useTransactionHistoryQuery({ page: currentPage, size: 10, direction: 'DESC' })
  const { data: bankAccount, isLoading: isBankAccountLoading } = useGetBankAccountQuery()

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

  const getTransactionIcon = (type, status) => {
    if (type === 'DEPOSIT' || type === 'REFUND') {
      return {
        icon: BanknoteArrowUp,
        color:
          status === 'SUCCESS'
            ? 'text-green-600'
            : status === 'FAIL'
              ? 'text-gray-500'
              : status === 'PENDING'
                ? 'text-yellow-600'
                : 'text-red-600',
        bg:
          status === 'SUCCESS'
            ? 'bg-green-100'
            : status === 'FAIL'
              ? 'bg-gray-100'
              : status === 'PENDING'
                ? 'bg-yellow-100'
                : 'bg-red-100',
      }
    } else if (type === 'WITHDRAW' || type === 'CHECKOUT') {
      return {
        icon: BanknoteArrowDown,
        color:
          status === 'SUCCESS'
            ? 'text-red-600'
            : status === 'FAIL'
              ? 'text-gray-500'
              : status === 'PENDING'
                ? 'text-yellow-600'
                : 'text-green-600',
        bg:
          status === 'SUCCESS'
            ? 'bg-red-100'
            : status === 'FAIL'
              ? 'bg-gray-100'
              : status === 'PENDING'
                ? 'bg-yellow-100'
                : 'bg-green-100',
      }
    }
    return {
      icon: Clock,
      color: 'text-gray-600',
      bg: 'bg-gray-100',
    }
  }

  // Refactored getCreditUpdateText for new color logic and clarity
  const getCreditUpdateText = (type, amount, status) => {
    const formattedAmount = new Intl.NumberFormat('vi-VN', { style: 'currency', currency: 'VND' }).format(amount);
    if (status === 'FAIL') {
      return (
        <span className="flex space-x-1 items-start text-gray-500">
          <span>Thất bại</span>
          <span>{formattedAmount}</span>
        </span>
      );
    }
    if (status === 'PENDING') {
      return (
        <span className="flex space-x-1 items-start text-yellow-600">
          <span>Đang xử lý</span>
          <span>{formattedAmount}</span>
        </span>
      );
    }
    if (type === 'DEPOSIT' || type === 'REFUND') {
      if (status === 'SUCCESS') {
        return <span className="text-green-600">+{formattedAmount}</span>;
      } else {
        return <span className="text-red-600">+{formattedAmount}</span>;
      }
    } else if (type === 'WITHDRAW' || type === 'CHECKOUT') {
      if (status === 'SUCCESS') {
        return <span className="text-red-600">-{formattedAmount}</span>;
      } else {
        return <span className="text-green-600">-{formattedAmount}</span>;
      }
    }
    return <span className="text-gray-500">{formattedAmount}</span>;
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
            <div className="flex gap-2">
              <Button>
                <Link className="flex items-center gap-2" to="/account-center/wallet/withdraw">
                  <Minus className="mr-2 h-4 w-4" />
                  Rút tiền
                </Link>
              </Button>
              <Button>
                <Link className="flex items-center gap-2" to="/account-center/wallet/deposit">
                  <Plus className="mr-2 h-4 w-4" />
                  Nạp tiền
                </Link>
              </Button>
            </div>
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
                  </div>
                )}
              </CardContent>
            </Card>

            {/* Linked Bank Accounts */}
            <Card className="mt-6">
              <CardHeader>
                <div className="flex items-center justify-between">
                  <CardTitle>Tài khoản ngân hàng liên kết</CardTitle>
                  <AddBankAccountDialog />
                </div>
              </CardHeader>
              <CardContent>
                {isBankAccountLoading ? (
                  <div className="space-y-3">
                    <Skeleton className="h-12 w-full" />
                    <Skeleton className="h-12 w-full" />
                    <Skeleton className="h-12 w-full" />
                  </div>
                ) : Array.isArray(bankAccount) && bankAccount.length > 0 ? (
                  <div className="space-y-3">
                    {bankAccount.map((acc) => {
                      const last4 = acc.bankAccountNumber
                        ? acc.bankAccountNumber.slice(-4)
                        : ''
                      const isShown = !!showFullAcc[acc.id]
                      const displayNumber = isShown
                        ? acc.bankAccountNumber
                        : `****${last4}`
                      return (
                        <div
                          key={acc.id}
                          className="flex items-center justify-between p-3 border border-gray-200 rounded-lg"
                        >
                          <div className="flex items-center gap-3">
                            <div>
                              <div className="flex items-center gap-2">
                                <div className="font-medium text-gray-900">
                                  {acc.accountHolderName}
                                </div>
                                <Button
                                  type="button"
                                  variant="ghost"
                                  className="h-8 px-2"
                                  onClick={() =>
                                    setShowFullAcc((prev) => ({ ...prev, [acc.id]: !prev[acc.id] }))
                                  }
                                >
                                  {isShown ? (
                                    <>
                                      <EyeOff className="h-4 w-4 mr-1" />
                                    </>
                                  ) : (
                                    <>
                                      <Eye className="h-4 w-4 mr-1" />
                                    </>
                                  )}
                                </Button>
                              </div>
                              <div className="text-sm text-gray-600">
                                {acc.providerName} • {displayNumber} • Hết hạn {acc.expirationDate}
                              </div>
                            </div>
                          </div>
                          <div className="flex items-center gap-2 shrink-0">
                            {acc.default && (
                              <span className="text-xs px-2 py-1 rounded-full bg-blue-100 text-blue-700">
                                Mặc định
                              </span>
                            )}
                          </div>
                        </div>
                      )
                    })}
                  </div>
                ) : (
                  <div className="text-sm text-gray-600">
                    Chưa có tài khoản ngân hàng liên kết.
                  </div>
                )}
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
                        className="flex items-center p-4 border border-gray-200 rounded-lg hover:bg-gray-50 transition-colors"
                      >
                        <div className="flex-shrink-0">
                          <div className={`p-2 rounded-lg ${bg}`}>
                            <Icon className={`h-4 w-4 ${color}`} />
                          </div>
                        </div>
                        <div className="flex-1 min-w-0 ml-4">
                          <p className="font-medium text-gray-900">{transaction.description}</p>
                          <p className="text-sm text-gray-600">{formatDate(transaction.updatedAt)}</p>
                        </div>
                        <div className="flex flex-col items-end space-y-2">
                          <div className="text-sm text-gray-600">
                            {getCreditUpdateText(transaction.type, transaction.amount, transaction.status)}
                          </div>
                          <div className="text-xs text-gray-600">
                            Số dư: {formatCurrency(transaction.balanceAfter)}
                          </div>
                        </div>
                      </div>
                    )
                  })}

                  {transactions.length === 0 && (
                    <div className="text-center py-8">
                      <Wallet className="h-12 w-12 text-gray-400 mx-auto mb-4" />
                      <p className="text-gray-600">Chưa có giao dịch nào</p>
                      <Button asChild className="mt-4">
                        <Link to="/account-center/wallet/deposit">Nạp tiền ngay</Link>
                      </Button>
                    </div>
                  )}
                </div>

                {/* Pagination */}
                <PaginationBar totalPages={pagination.totalPages} page={currentPage} setPage={setCurrentPage} />
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </div>
  )
}

export default WalletOverview
