import React, { useEffect, useMemo, useState } from 'react'
import AdOrderItemList from './AdOrderItemList'
import AdOrderItemDetail from './AdOrderItemDetail'
import { CustomerInfoCard } from '../CustomerInfoCard'
import { useParams } from 'react-router-dom'
import { useGetOrderByIDQuery } from '@/services/gshopApi'

import PageLoading from '@/components/PageLoading'
import PageError from '@/components/PageError'
import AdOrderDetailHeader from './AdOrderDetailHeader'

const AdOrderDetail = () => {
  const { id } = useParams()
  const { data: order, isLoading: isOrderLoading, isError: isOrderError } = useGetOrderByIDQuery(id)
  const [selectedItemId, setSelectedItemId] = useState(null)

  // Initialize selected item when order loads
  useEffect(() => {
    if (order?.orderItems?.length && !selectedItemId) {
      setSelectedItemId(order.orderItems[0].id)
    }
  }, [order, selectedItemId])

  const selectedItem = useMemo(() => {
    return order?.orderItems?.find((it) => it.id === selectedItemId) || null
  }, [order, selectedItemId])

  if (isOrderLoading) return <PageLoading />
  if (isOrderError) return <PageError />
  return (
    <div className="min-h-screen bg-gray-50/30">
      <div className="max-w-7xl mx-auto p-6 space-y-6">
        <AdOrderDetailHeader order={order}/>
        <div className="grid grid-cols-1 lg:grid-cols-7 gap-6">
          <div className="lg:col-span-3 space-y-4">
            <AdOrderItemList order={order} selectedItemId={selectedItemId} onSelect={setSelectedItemId} />
          </div>
          <div className="space-y-4 grid grid-cols-5 col-span-4 gap-6">
            <div className="sticky top-4 self-start col-span-3">
              <AdOrderItemDetail item={selectedItem} currency={order?.currency} />
            </div>
            <div className="sticky top-4 self-start col-span-2">
              <CustomerInfoCard customer={order?.customer} shippingAddress={order?.shippingAddress}/>
            </div>
          </div>

        </div>
      </div>
    </div>
  )
}

export default AdOrderDetail