import React from 'react'
import { useParams } from 'react-router-dom'
import { useGetPurchaseRequestDetailQuery } from '@/services/gshopApi'
import PurchaseRequestEditOnline from './PurchaseRequestEditOnline'
import PurchaseRequestEditOffline from './PurchaseRequestEditOffline'

const PurchaseRequestEdit = () => {
  const { id } = useParams()
  const { data, isLoading, isError, error } = useGetPurchaseRequestDetailQuery(id)

  if (isLoading) return <div className="p-6">Đang tải dữ liệu...</div>
  if (isError) return <div className="p-6 text-red-600">{error?.data?.message || 'Không thể tải dữ liệu chỉnh sửa.'}</div>
  if (!data) return null

  const isOnline = data?.requestType === 'ONLINE'

  return isOnline ? (
    <PurchaseRequestEditOnline id={id} data={data} />
  ) : (
    <PurchaseRequestEditOffline id={id} data={data} />
  )
}

export default PurchaseRequestEdit