"use client"
import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { CheckCircle, Copy, ExternalLink, Home } from "lucide-react"
import { Link } from "react-router-dom"

export default function RequestSuccess({onClose, purchaseData}) {
  const copyRequestId = () => {
    navigator.clipboard.writeText(purchaseData?.id || "")
    // You could add a toast notification here
  }

  return (
    <Card className="shadow-lg">
      <CardContent className="p-16 text-center space-y-8">
        <div className="w-28 h-28 bg-green-100 text-green-600 rounded-full flex items-center justify-center mx-auto shadow-lg">
          <CheckCircle className="h-14 w-14" />
        </div>

        <div className="space-y-4">
          <h3 className="text-4xl font-bold text-green-600">Gửi yêu cầu thành công!</h3>
          <p className="text-xl text-gray-600 max-w-3xl mx-auto leading-relaxed">
            Yêu cầu mua hàng của bạn đã được gửi thành công. Chúng tôi sẽ liên hệ với bạn trong thời gian sớm nhất để hỗ
            trợ tìm kiếm và báo giá sản phẩm.
          </p>
        </div>

        <div className="bg-gradient-to-br from-green-50 to-green-100 p-8 rounded-xl border border-green-200 max-w-lg mx-auto">
          <div className="space-y-4">
            <h4 className="font-semibold text-green-800 text-lg">Thông tin yêu cầu</h4>
            <div className="space-y-3 text-sm">
              <div className="flex justify-between items-center">
                <span className="font-medium text-gray-700">Mã yêu cầu:</span>
                <div className="flex items-center gap-2">
                  <span className="font-mono text-gray-900 bg-white px-2 py-1 rounded">{purchaseData?.id || ""}</span>
                  <Button variant="ghost" size="sm" onClick={copyRequestId} className="h-6 w-6 p-0 hover:bg-green-200">
                    <Copy className="h-3 w-3" />
                  </Button>
                </div>
              </div>
              <div className="flex justify-between items-center">
                <span className="font-medium text-gray-700">Trạng thái:</span>
                <Badge className="bg-green-600 hover:bg-green-600">Đã gửi yêu cầu</Badge>
              </div>
              <div className="flex justify-between items-center">
                <span className="font-medium text-gray-700">Thời gian:</span>
                <span className="text-gray-900">{new Date().toLocaleString("vi-VN")}</span>
              </div>
            </div>
          </div>
        </div>

        <div className="space-y-4">
          <div className="bg-blue-50 p-6 rounded-lg border border-blue-200 max-w-2xl mx-auto">
            <h4 className="font-semibold text-blue-800 mb-3">Các bước tiếp theo</h4>
            <div className="text-sm text-blue-700 space-y-2 text-left">
              <div className="flex items-start gap-3">
                <div className="w-6 h-6 bg-blue-600 text-white rounded-full flex items-center justify-center text-xs font-bold mt-0.5">
                  1
                </div>
                <span>Chúng tôi sẽ xem xét và xử lý yêu cầu của bạn trong vòng 24 giờ</span>
              </div>
              <div className="flex items-start gap-3">
                <div className="w-6 h-6 bg-blue-600 text-white rounded-full flex items-center justify-center text-xs font-bold mt-0.5">
                  2
                </div>
                <span>Bạn sẽ nhận được email xác nhận với thông tin chi tiết</span>
              </div>
              <div className="flex items-start gap-3">
                <div className="w-6 h-6 bg-blue-600 text-white rounded-full flex items-center justify-center text-xs font-bold mt-0.5">
                  3
                </div>
                <span>Chúng tôi sẽ liên hệ để báo giá và hỗ trợ đặt hàng</span>
              </div>
            </div>
          </div>
        </div>

        <div className="flex flex-col sm:flex-row gap-4 justify-center max-w-md mx-auto">
          <Button
            onClick={onClose}
            className="flex-1 h-12 bg-gradient-to-r from-blue-600 to-blue-700 hover:from-blue-700 hover:to-blue-800"
          >
            <Home className="h-4 w-4 mr-2" />
            Quay về trang chủ
          </Button>
          <Button variant="outline" className="flex-1 h-12 bg-transparent hover:bg-gray-50">
            <ExternalLink className="h-4 w-4 mr-2" />
            {console.log(purchaseData)}
            <Link to={`/account-center/purchase-request/${purchaseData?.id}`}>Theo dõi yêu cầu</Link>
          </Button>
        </div>
      </CardContent>
    </Card>
  )
}
