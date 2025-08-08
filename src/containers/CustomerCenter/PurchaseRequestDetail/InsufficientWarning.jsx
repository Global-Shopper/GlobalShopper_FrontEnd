import { Button } from '@/components/ui/button'
import React from 'react'
import { Link } from 'react-router-dom'

const InsufficientWarning = ({ id }) => {
  return (
    <div>
      <div className="mb-6 p-4 bg-red-50 border-l-4 border-red-500">
        <div className="flex items-start">
          <svg
            className="h-5 w-5 text-red-500 mt-0.5 mr-2 flex-shrink-0"
            fill="none"
            viewBox="0 0 24 24"
            stroke="currentColor"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
          </svg>
          <div>
            <h3 className="text-sm font-medium text-red-800">Admin đã yêu cầu bạn cập nhật thông tin của yêu cầu mua hàng</h3>
            <p className="text-sm text-red-700">
              Yêu cầu của bạn không hợp lệ. Vui lòng cập nhật lại yêu cầu mua hàng.
            </p>
            <Button
              type="button"
              variant="outline"
              size="sm"
              className="text-red-600 hover:text-red-700 hover:bg-red-50"
            >
              <Link to={`/account-center/purchase-request/${id}/edit`}>Cập nhật lại</Link>
            </Button>
          </div>
        </div>
      </div>
    </div>
  )
}

export default InsufficientWarning