import React, { useState } from 'react'
import {
  Table,
  TableBody,
  TableCaption,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table"
import { Button } from "@/components/ui/button"
import { Eye } from "lucide-react"
import PurchaseRequestDialog from './PurchaseRequestDialog'

const PurchaseRequestPage = () => {
  const [selectedRequest, setSelectedRequest] = useState(null)
  const [isDialogOpen, setIsDialogOpen] = useState(false)

  // Mock data - replace with actual data from your API
  const purchaseRequests = [
    {
      id: 1,
      customer: {
        name: "Nguyễn Văn A",
        phone: "+84 123 456 789",
        email: "nguyenvana@example.com",
        address: "123 Đường ABC, Quận 1, TP.HCM"
      },
      requestItems: [
        {
          productName: "iPhone 15 Pro",
          specification: "256GB, Titanium, Chip A17 Pro",
          quantity: 1,
          price: 999.00,
          image: "https://example.com/iphone15pro.jpg",
          productLink: "https://www.apple.com/iphone-15-pro/",
          isQuoted: true
        },
        {
          productName: "AirPods Pro",
          specification: "Thế hệ 2, Chống ồn chủ động",
          quantity: 1,
          price: 249.00,
          image: "https://example.com/airpods-pro.jpg",
          productLink: "https://www.apple.com/airpods-pro/",
          isQuoted: false
        }
      ],
      totalAmount: 1248.00,
      status: "Đang kiểm tra"
    },
    {
      id: 2,
      customer: {
        name: "Trần Thị B",
        phone: "+84 987 654 321",
        email: "tranthib@example.com",
        address: "456 Đường XYZ, Quận 3, TP.HCM"
      },
      requestItems: [
        {
          productName: "MacBook Air",
          specification: "13 inch, Chip M2, 8GB RAM, 256GB SSD",
          quantity: 1,
          price: 1199.00,
          image: "https://example.com/macbook-air.jpg",
          productLink: "https://www.apple.com/macbook-air/",
          isQuoted: true
        }
      ],
      totalAmount: 1199.00,
      status: "Đã báo giá"
    },
    {
      id: 3,
      customer: {
        name: "Lê Văn C",
        phone: "+84 555 123 456",
        email: "levanc@example.com",
        address: "789 Đường DEF, Quận 7, TP.HCM"
      },
      requestItems: [
        {
          productName: "iPad Pro",
          specification: "11 inch, Chip M2, 128GB",
          quantity: 1,
          price: 899.00,
          image: "https://example.com/ipad-pro.jpg",
          contactInfo: "0901234567 - shop@example.com - 123 ABC Street",
          isQuoted: false
        }
      ],
      totalAmount: 899.00,
      status: "Đã gửi yêu cầu"
    },
    {
      id: 4,
      customer: {
        name: "Phạm Thị D",
        phone: "+84 777 888 999",
        email: "phamthid@example.com",
        address: "321 Đường GHI, Quận 2, TP.HCM"
      },
      requestItems: [
        {
          productName: "Apple Watch",
          specification: "Series 9, GPS, 45mm",
          quantity: 1,
          price: 799.00,
          image: "https://example.com/apple-watch.jpg",
          productLink: "https://www.apple.com/apple-watch/",
          isQuoted: false
        }
      ],
      totalAmount: 799.00,
      status: "Đã huỷ yêu cầu"
    }
  ]

  const getStatusColor = (status) => {
    switch (status) {
      case 'Đã gửi yêu cầu':
        return 'bg-blue-100 text-blue-800'
      case 'Đang kiểm tra':
        return 'bg-yellow-100 text-yellow-800'
      case 'Đã báo giá':
        return 'bg-green-100 text-green-800'
      case 'Đã huỷ yêu cầu':
        return 'bg-red-100 text-red-800'
      default:
        return 'bg-gray-100 text-gray-800'
    }
  }

  const getQuotedProductsCount = (requestItems) => {
    return requestItems.filter(item => item.isQuoted).length
  }

  const getTotalProductsCount = (requestItems) => {
    return requestItems.length
  }

  const handleViewDetails = (request) => {
    setSelectedRequest(request)
    setIsDialogOpen(true)
  }

  const handleCloseDialog = () => {
    setIsDialogOpen(false)
    setSelectedRequest(null)
  }

  return (
    <div className="p-6">
      <h1 className="text-2xl font-bold mb-6">Yêu Cầu Mua Hàng</h1>
      <Table>
        <TableCaption>Danh sách yêu cầu mua hàng từ khách hàng.</TableCaption>
        <TableHeader>
          <TableRow>
            <TableHead>Tên Khách Hàng</TableHead>
            <TableHead>Số Điện Thoại</TableHead>
            <TableHead>Email</TableHead>
            <TableHead>Địa Chỉ</TableHead>
            <TableHead>Trạng Thái</TableHead>
            <TableHead className="text-center">Sản Phẩm Đã Báo Giá</TableHead>
            <TableHead className="text-center">Chi Tiết</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {purchaseRequests.map((request) => {
            const quotedCount = getQuotedProductsCount(request.requestItems)
            const totalCount = getTotalProductsCount(request.requestItems)
            
            return (
              <TableRow key={request.id}>
                <TableCell className="font-medium">{request.customer.name}</TableCell>
                <TableCell>{request.customer.phone}</TableCell>
                <TableCell>{request.customer.email}</TableCell>
                <TableCell className="max-w-[200px] truncate" title={request.customer.address}>
                  {request.customer.address}
                </TableCell>
                <TableCell>
                  <span className={`px-2 py-1 rounded-full text-xs font-medium ${getStatusColor(request.status)}`}>
                    {request.status}
                  </span>
                </TableCell>
                <TableCell className="text-center">
                  <span className="text-sm font-medium">
                    {quotedCount}/{totalCount}
                  </span>
                </TableCell>
                <TableCell className="text-center">
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={() => handleViewDetails(request)}
                    className="h-8 w-8 p-0"
                    title="Xem chi tiết"
                  >
                    <Eye className="h-4 w-4" />
                  </Button>
                </TableCell>
              </TableRow>
            )
          })}
        </TableBody>
      </Table>

      {/* Dialog */}
      <PurchaseRequestDialog
        isOpen={isDialogOpen}
        onClose={handleCloseDialog}
        request={selectedRequest}
      />
    </div>
  )
}

export default PurchaseRequestPage