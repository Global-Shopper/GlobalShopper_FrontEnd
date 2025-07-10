import { useNavigate } from "react-router-dom"
import { ShoppingCart, Store, Link, ArrowRight, ArrowLeft } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { SUPPORTED_PLATFORMS } from "@/const/purchaseReqStatus"

export default function CreateRequestSelection() {
  const navigate = useNavigate()

  const handleBackToDashboard = () => {
    navigate("/account-center/purchase-request-list")
  }

  const handleSelectWithLink = () => {
    navigate("/account-center/create-request/with-link")
  }

  const handleSelectWithoutLink = () => {
    navigate("/account-center/create-request/without-link")
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-indigo-50">
      <div className="max-w-6xl mx-auto p-6 space-y-8">
        {/* Header */}
        <div className="flex items-center gap-4 mb-8">
          <Button
            variant="ghost"
            onClick={handleBackToDashboard}
            className="h-10 w-10 p-0 hover:bg-white/50 rounded-full"
          >
            <ArrowLeft className="h-5 w-5" />
          </Button>
          <div className="space-y-1">
            <h1 className="text-3xl font-bold text-gray-900">Tạo yêu cầu mua hàng mới</h1>
            <p className="text-gray-600">Chọn loại yêu cầu phù hợp với nhu cầu của bạn</p>
          </div>
        </div>

        {/* Selection Cards */}
        <div className="max-w-5xl mx-auto">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
            {/* Without Link Option */}
            <Card
              className="cursor-pointer hover:shadow-2xl transition-all duration-300 border-2 hover:border-orange-500 group relative overflow-hidden h-full"
              onClick={handleSelectWithoutLink}
            >
              <div className="absolute inset-0 bg-gradient-to-br from-orange-50 to-orange-100 opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
              <CardContent className="relative p-10 text-center space-y-8 h-full flex flex-col">
                <div className="w-24 h-24 bg-gradient-to-br from-orange-500 to-orange-600 text-white rounded-full flex items-center justify-center mx-auto group-hover:scale-110 transition-transform duration-300 shadow-xl">
                  <Store className="h-12 w-12" />
                </div>

                <div className="space-y-4 flex-1">
                  <h3 className="text-2xl font-bold text-gray-900">Không có link sản phẩm</h3>
                  <p className="text-gray-600 leading-relaxed text-lg">
                    Bạn biết sản phẩm muốn mua nhưng chưa có link cụ thể. Chúng tôi sẽ giúp bạn tìm kiếm từ thông tin
                    cửa hàng và mô tả sản phẩm chi tiết.
                  </p>

                  <div className="space-y-4">
                    <Badge
                      variant="outline"
                      className="bg-orange-50 text-orange-700 border-orange-200 px-4 py-2 text-sm"
                    >
                      Cần thông tin chi tiết
                    </Badge>

                    <div className="space-y-3 text-gray-600">
                      <div className="flex items-center gap-3">
                        <div className="w-2 h-2 bg-orange-500 rounded-full" />
                        <span>Thông tin cửa hàng và địa chỉ</span>
                      </div>
                      <div className="flex items-center gap-3">
                        <div className="w-2 h-2 bg-orange-500 rounded-full" />
                        <span>Mô tả chi tiết sản phẩm</span>
                      </div>
                      <div className="flex items-center gap-3">
                        <div className="w-2 h-2 bg-orange-500 rounded-full" />
                        <span>Hình ảnh tham khảo (nếu có)</span>
                      </div>
                      <div className="flex items-center gap-3">
                        <div className="w-2 h-2 bg-orange-500 rounded-full" />
                        <span>Thông tin liên hệ cửa hàng</span>
                      </div>
                    </div>
                  </div>
                </div>

                <Button
                  className="w-full bg-orange-600 hover:bg-orange-700 text-white h-14 text-lg group-hover:shadow-lg transition-all duration-300"
                  onClick={(e) => {
                    e.stopPropagation()
                    handleSelectWithoutLink()
                  }}
                >
                  Chọn loại này
                  <ArrowRight className="h-5 w-5 ml-2" />
                </Button>
              </CardContent>
            </Card>

            {/* With Link Option */}
            <Card
              className="cursor-pointer hover:shadow-2xl transition-all duration-300 border-2 hover:border-blue-500 group relative overflow-hidden h-full"
              onClick={handleSelectWithLink}
            >
              <div className="absolute inset-0 bg-gradient-to-br from-blue-50 to-blue-100 opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
              <CardContent className="relative p-10 text-center space-y-8 h-full flex flex-col">
                <div className="w-24 h-24 bg-gradient-to-br from-blue-500 to-blue-600 text-white rounded-full flex items-center justify-center mx-auto group-hover:scale-110 transition-transform duration-300 shadow-xl">
                  <Link className="h-12 w-12" />
                </div>

                <div className="space-y-4 flex-1">
                  <h3 className="text-2xl font-bold text-gray-900">Có link sản phẩm</h3>
                  <p className="text-gray-600 leading-relaxed text-lg">
                    Bạn đã có link sản phẩm từ các sàn thương mại điện tử quốc tế. Hệ thống AI sẽ tự động trích xuất
                    thông tin sản phẩm từ link.
                  </p>

                  <div className="space-y-4">
                    <Badge variant="outline" className="bg-blue-50 text-blue-700 border-blue-200 px-4 py-2 text-sm">
                      Xử lý tự động bằng AI
                    </Badge>

                    <div className="space-y-3 text-gray-600">
                      <div className="flex items-center gap-3">
                        <div className="w-2 h-2 bg-blue-500 rounded-full" />
                        <span>Hỗ trợ nhiều link sản phẩm</span>
                      </div>
                      <div className="flex items-center gap-3">
                        <div className="w-2 h-2 bg-blue-500 rounded-full" />
                        <span>Trích xuất thông tin tự động</span>
                      </div>
                      <div className="flex items-center gap-3">
                        <div className="w-2 h-2 bg-blue-500 rounded-full" />
                        <span>Xử lý hàng loạt nhanh chóng</span>
                      </div>
                      <div className="flex items-center gap-3">
                        <div className="w-2 h-2 bg-blue-500 rounded-full" />
                        <span>Amazon, eBay, AliExpress...</span>
                      </div>
                    </div>
                  </div>
                </div>

                <Button
                  className="w-full bg-blue-600 hover:bg-blue-700 text-white h-14 text-lg group-hover:shadow-lg transition-all duration-300"
                  onClick={(e) => {
                    e.stopPropagation()
                    handleSelectWithLink()
                  }}
                >
                  Chọn loại này
                  <ArrowRight className="h-5 w-5 ml-2" />
                </Button>
              </CardContent>
            </Card>
          </div>

          {/* Supported Platforms */}
          <div className="mt-12 text-center">
            <div className="bg-white/70 backdrop-blur-sm p-8 rounded-xl border border-gray-200 max-w-4xl mx-auto">
              <h3 className="text-lg font-semibold text-gray-900 mb-4">Các sàn thương mại điện tử được hỗ trợ</h3>
              <div className="flex flex-wrap justify-center gap-3 mb-6">
                {SUPPORTED_PLATFORMS.map((platform) => (
                  <Badge key={platform} variant="outline" className="bg-white/50 hover:bg-white px-3 py-1">
                    {platform}
                  </Badge>
                ))}
              </div>
              <p className="text-gray-600 mb-6">
                Nếu bạn không chắc chắn nên chọn loại yêu cầu nào, đội ngũ hỗ trợ của chúng tôi luôn sẵn sàng giúp đỡ
                bạn.
              </p>
              <div className="flex flex-col sm:flex-row gap-4 justify-center">
                <Button variant="outline" className="bg-white/50 hover:bg-white">
                  📞 Gọi hỗ trợ: 1900-xxxx
                </Button>
                <Button variant="outline" className="bg-white/50 hover:bg-white">
                  💬 Chat trực tuyến
                </Button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
