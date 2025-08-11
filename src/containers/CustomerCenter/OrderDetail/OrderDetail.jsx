import React from 'react'
import { useParams } from 'react-router-dom'
import { useGetOrderByIDQuery } from '@/services/gshopApi'
import PageLoading from '@/components/PageLoading'
import PageError from '@/components/PageError'
import { AdminInfo } from '@/components/AdminInfo'
import ShippingInfoCard from '@/components/ShippingInfoCard'
import HistoryTimeline from '@/components/HistoryTimeline'
import OrderInfo from './OrderInfo'
import OrderItemList from './OrderItemList'

const OrderDetail = () => {
  const { id } = useParams()
  const {
    data: orderData,
    isLoading: isOrderLoading,
    isError: isOrderError,
  } = useGetOrderByIDQuery(id)

  if (isOrderLoading) return <PageLoading />
  if (isOrderError) return <PageError />
  if (!orderData) return <div>Không tìm thấy dữ liệu đơn hàng.</div>

  const showPaymentAwaiting = orderData.status === 'PAYMENT_AWAITING'

  return (
    <div className="max-w-7xl mx-auto py-8 px-3">
      <OrderInfo order={orderData} />

      <div className="flex flex-col md:flex-row md:gap-6 mb-4 mt-4">
        {orderData.admin && (
          <div className="flex-1">
            <AdminInfo admin={orderData.admin} className="mb-4 md:mb-0" />
          </div>
        )}
        {orderData.shippingAddress && (
          <div className="flex-1">
            <ShippingInfoCard
              address={orderData.shippingAddress}
              title="Địa chỉ nhận hàng"
              className="mb-4 md:mb-0"
            />
          </div>
        )}
      </div>

      {showPaymentAwaiting && (
        <div className="mb-4 rounded border border-yellow-200 bg-yellow-50 text-yellow-900 px-4 py-3">
          Đơn hàng đang chờ thanh toán. Vui lòng thanh toán để chúng tôi tiếp tục xử lý đơn hàng của bạn.
        </div>
      )}

      <div className="mt-6">
        <OrderItemList
          orderItems={orderData.orderItems || []}
          ecommercePlatform={orderData.ecommercePlatform}
          seller={orderData.seller}
        />
      </div>

      <div className="mt-6">
        <HistoryTimeline history={orderData.history || []} />
      </div>
    </div>
  )
}

export default OrderDetail