import React, { useEffect, useState } from 'react'
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import { X, ExternalLink, Phone, Mail, MapPin } from "lucide-react"

const PurchaseRequestDialog = ({ isOpen, onClose, request }) => {
  const [quotedPrices, setQuotedPrices] = useState({})
  const [customerMessage, setCustomerMessage] = useState('')

  // Initialize quoted prices when dialog opens
  useEffect(() => {
    if (request) {
      const initialPrices = {}
      request.requestItems.forEach((item, index) => {
        initialPrices[index] = item.price || 0
      })
      setQuotedPrices(initialPrices)
      setCustomerMessage('')
    }
  }, [request])
  
  if (!isOpen || !request) return null

  const handlePriceChange = (index, value) => {
    setQuotedPrices(prev => ({
      ...prev,
      [index]: parseFloat(value) || 0
    }))
  }

  const calculateTotal = () => {
    return request.requestItems.reduce((total, item, index) => {
      return total + (quotedPrices[index] || 0) * item.quantity
    }, 0)
  }

  const handleSubmitQuote = () => {
    // Handle submitting the quote
    console.log('Submitting quote:', quotedPrices)
    console.log('Customer message:', customerMessage)
    // You can add API call here to save the quoted prices and message
  }

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <div className="bg-white rounded-lg p-6 max-w-4xl w-full mx-4 max-h-[90vh] overflow-y-auto">
        {/* Header */}
        <div className="flex justify-between items-center mb-6">
          <h2 className="text-xl font-bold">Báo Giá Sản Phẩm</h2>
          <Button
            variant="ghost"
            size="sm"
            onClick={onClose}
            className="h-8 w-8 p-0"
          >
            <X className="h-4 w-4" />
          </Button>
        </div>

        {/* Products with Images, Links, and Price Inputs */}
        <div className="mb-6">
          <h3 className="text-lg font-semibold mb-4 text-gray-800">Sản Phẩm Yêu Cầu</h3>
          <div className="space-y-6">
            {request.requestItems.map((item, index) => (
              <div key={index} className="border rounded-lg p-6">
                <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                  {/* Product Image and Details */}
                  <div className="lg:col-span-2">
                    <div className="flex items-start space-x-4">
                      {/* Product Image */}
                      <div className="flex-shrink-0">
                        <div className="w-24 h-24 bg-gray-200 rounded-lg flex items-center justify-center">
                          <img 
                            src={item.image || `https://via.placeholder.com/96x96?text=${encodeURIComponent(item.productName)}`}
                            alt={item.productName}
                            className="w-full h-full object-cover rounded-lg"
                            onError={(e) => {
                              e.target.src = `https://via.placeholder.com/96x96?text=${encodeURIComponent(item.productName)}`
                            }}
                          />
                        </div>
                      </div>

                      {/* Product Details */}
                      <div className="flex-1">
                        <h4 className="font-semibold text-gray-900 mb-2">{item.productName}</h4>
                        <p className="text-sm text-gray-600 mb-3">{item.specification}</p>
                        <div className="flex items-center space-x-4 mb-3">
                          <span className="text-sm text-gray-600">Số lượng: {item.quantity}</span>
                          <span className="text-sm text-gray-600">Giá gốc: {item.price.toLocaleString('vi-VN')} ₫</span>
                        </div>
                        
                        {/* Product Link */}
                        {item.productLink && (
                          <div className="flex items-center space-x-2">
                            <ExternalLink className="h-4 w-4 text-blue-600" />
                            <a 
                              href={item.productLink} 
                              target="_blank" 
                              rel="noopener noreferrer"
                              className="text-sm text-blue-600 hover:text-blue-800 underline"
                            >
                              Xem sản phẩm
                            </a>
                          </div>
                        )}

                        {/* Contact Information Display for products without links */}
                        {!item.productLink && item.contactInfo && (
                          <div className="mt-3 p-3 bg-blue-50 rounded-lg">
                            <h5 className="text-sm font-medium text-blue-800 mb-2 flex items-center">
                              <Phone className="h-4 w-4 mr-1" />
                              Thông tin liên hệ
                            </h5>
                            <div className="text-sm text-blue-700">
                              {item.contactInfo.split(' - ').map((info, idx) => (
                                <div key={idx} className="flex items-center mb-1">
                                  {info.includes('@') && <Mail className="h-3 w-3 mr-1" />}
                                  {info.includes('Street') || info.includes('Đường') ? <MapPin className="h-3 w-3 mr-1" /> : null}
                                  <span>{info.trim()}</span>
                                </div>
                              ))}
                            </div>
                          </div>
                        )}
                      </div>
                    </div>
                  </div>

                  {/* Price Input */}
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Giá báo (₫)
                    </label>
                    <Input
                      type="number"
                      value={quotedPrices[index] || ''}
                      onChange={(e) => handlePriceChange(index, e.target.value)}
                      placeholder="Nhập giá báo"
                      className="w-full"
                    />
                    <div className="text-xs text-gray-500 mt-1">
                      Thành tiền: {((quotedPrices[index] || 0) * item.quantity).toLocaleString('vi-VN')} ₫
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Customer Message */}
        <div className="mb-6">
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Lời nhắn cho khách hàng
          </label>
          <Textarea
            value={customerMessage}
            onChange={(e) => setCustomerMessage(e.target.value)}
            placeholder="Nhập lời nhắn hoặc ghi chú cho khách hàng..."
            className="w-full min-h-[100px]"
            rows={4}
          />
        </div>

        {/* Total */}
        <div className="border-t pt-4 mb-6">
          <div className="flex justify-between items-center">
            <span className="text-lg font-semibold text-gray-800">Tổng cộng:</span>
            <span className="text-xl font-bold text-gray-900">
              {calculateTotal().toLocaleString('vi-VN')} ₫
            </span>
          </div>
        </div>

        {/* Action Buttons */}
        <div className="flex justify-end gap-3">
          <Button variant="outline" onClick={onClose}>
            Hủy
          </Button>
          <Button 
            onClick={handleSubmitQuote}
            className="bg-blue-600 hover:bg-blue-700"
          >
            Gửi Báo Giá
          </Button>
        </div>
      </div>
    </div>
  )
}

export default PurchaseRequestDialog 