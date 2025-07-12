import React from 'react'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { 
  Wallet, 
  Plus, 
  ArrowUpRight, 
  ArrowDownLeft, 
  Clock,
  CheckCircle,
  XCircle,
  DollarSign
} from 'lucide-react'
import { Link } from 'react-router-dom'
import { useGetWalletQuery } from '@/services/gshopApi'
import { Skeleton } from '@/components/ui/skeleton'

const WalletOverview = () => {
  const { data: wallet, isLoading: isWalletLoading } = useGetWalletQuery()

  const formatCurrency = (amount) => {
    return new Intl.NumberFormat("vi-VN", {
      style: "currency",
      currency: "VND",
    }).format(amount || 0)
  }

  // Mock transaction history - in real app this would come from API
  const mockTransactions = [
    {
      id: 1,
      type: 'deposit',
      amount: 500000,
      status: 'completed',
      date: '2024-01-15T10:30:00Z',
      description: 'Nạp tiền qua chuyển khoản ngân hàng'
    },
    {
      id: 2,
      type: 'withdrawal',
      amount: 200000,
      status: 'completed',
      date: '2024-01-14T15:45:00Z',
      description: 'Thanh toán đơn hàng #12345'
    },
    {
      id: 3,
      type: 'deposit',
      amount: 1000000,
      status: 'pending',
      date: '2024-01-13T09:20:00Z',
      description: 'Nạp tiền qua thẻ tín dụng'
    }
  ]

  const getStatusIcon = (status) => {
    switch (status) {
      case 'completed':
        return <CheckCircle className="h-4 w-4 text-green-600" />
      case 'pending':
        return <Clock className="h-4 w-4 text-yellow-600" />
      case 'failed':
        return <XCircle className="h-4 w-4 text-red-600" />
      default:
        return <Clock className="h-4 w-4 text-gray-400" />
    }
  }

  const getStatusBadge = (status) => {
    switch (status) {
      case 'completed':
        return <Badge variant="default" className="bg-green-100 text-green-800">Hoàn thành</Badge>
      case 'pending':
        return <Badge variant="secondary" className="bg-yellow-100 text-yellow-800">Đang xử lý</Badge>
      case 'failed':
        return <Badge variant="destructive">Thất bại</Badge>
      default:
        return <Badge variant="outline">Không xác định</Badge>
    }
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
                  {mockTransactions.map((transaction) => (
                    <div
                      key={transaction.id}
                      className="flex items-center justify-between p-4 border border-gray-200 rounded-lg hover:bg-gray-50 transition-colors"
                    >
                      <div className="flex items-center gap-3">
                        <div className={`p-2 rounded-lg ${
                          transaction.type === 'deposit' 
                            ? 'bg-green-100' 
                            : 'bg-red-100'
                        }`}>
                          {transaction.type === 'deposit' ? (
                            <ArrowUpRight className={`h-4 w-4 ${
                              transaction.type === 'deposit' 
                                ? 'text-green-600' 
                                : 'text-red-600'
                            }`} />
                          ) : (
                            <ArrowDownLeft className="h-4 w-4 text-red-600" />
                          )}
                        </div>
                        
                        <div className="flex-1">
                          <div className="flex items-center gap-2 mb-1">
                            <p className="font-medium text-gray-900">
                              {transaction.description}
                            </p>
                            {getStatusIcon(transaction.status)}
                          </div>
                          <p className="text-sm text-gray-600">
                            {formatDate(transaction.date)}
                          </p>
                        </div>
                      </div>
                      
                      <div className="text-right">
                        <div className={`font-semibold ${
                          transaction.type === 'deposit' 
                            ? 'text-green-600' 
                            : 'text-red-600'
                        }`}>
                          {transaction.type === 'deposit' ? '+' : '-'}
                          {formatCurrency(transaction.amount)}
                        </div>
                        {getStatusBadge(transaction.status)}
                      </div>
                    </div>
                  ))}
                  
                  {mockTransactions.length === 0 && (
                    <div className="text-center py-8">
                      <Wallet className="h-12 w-12 text-gray-400 mx-auto mb-4" />
                      <p className="text-gray-600">Chưa có giao dịch nào</p>
                      <Button asChild className="mt-4">
                        <Link to="/wallet/deposit">
                          Nạp tiền ngay
                        </Link>
                      </Button>
                    </div>
                  )}
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </div>
  )
}

export default WalletOverview 