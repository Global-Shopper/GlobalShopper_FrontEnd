import React from 'react'
import BasicInfo from './BasicInfo'
import ShippingAddress from './ShippingAddress'

const CustomerProfile = () => {
  return (
    <div className="max-w-7xl mx-auto space-y-6">
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          <BasicInfo />
          <ShippingAddress />
      </div>
    </div>
  )
}

export default CustomerProfile