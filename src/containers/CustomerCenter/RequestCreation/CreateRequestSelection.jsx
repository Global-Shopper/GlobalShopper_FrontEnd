import { useNavigate } from "react-router-dom";
import { Store, Link, ArrowRight } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";

export default function CreateRequestSelection() {
  const navigate = useNavigate();

  const handleSelectWithLink = () => {
    navigate("/create-request/with-link");
  };

  const handleSelectWithoutLink = () => {
    navigate("/create-request/without-link");
  };

  return (
    <div className="min-h-screen bg-white">
      <div className="max-w-7xl mx-auto px-6 py-12">
        {/* Header */}
        <div className="text-center mb-16">
          <h1 className="text-3xl font-bold text-gray-900 mb-4">
            Bắt đầu hành trình mua sắm của bạn
          </h1>
          <p className="text-l text-gray-500 max-w-4xl mx-auto">
            Chọn loại yêu cầu phù hợp để chúng tôi giúp bạn mua sắm hàng hóa từ
            các website quốc tế như Amazon, Taobao, eBay và nhiều hơn nữa.
          </p>
        </div>

        {/* Selection Cards */}
        <div className="max-w-6xl mx-auto">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
            {/* Without Link Option */}
            <Card
              className="cursor-pointer transition-all duration-300 border border-gray-200 hover:border-orange-300 shadow-md hover:shadow-xl group relative overflow-hidden bg-white rounded-2xl"
              onClick={handleSelectWithoutLink}
            >
              <CardContent className="p-8">
                <div className="text-center mb-6">
                  <div className="w-20 h-20 bg-gradient-to-br from-orange-500 to-orange-600 text-white rounded-2xl flex items-center justify-center mx-auto group-hover:scale-105 transition-transform duration-300 shadow-lg mb-4">
                    <Store className="h-10 w-10" />
                  </div>
                  <h3 className="text-2xl font-bold text-gray-900 mb-3">
                    Sản phẩm nội địa quốc tế
                  </h3>
                  <Badge
                    variant="outline"
                    className="bg-orange-50 text-orange-700 border-orange-200 px-4 py-2 text-sm font-medium rounded-full"
                  >
                    Hỗ trợ thủ công
                  </Badge>
                </div>

                <p className="text-gray-600 text-center leading-relaxed mb-8">
                  Dành cho sản phẩm nội địa nước ngoài không có sẵn link. Chúng
                  tôi sẽ hỗ trợ tìm kiếm và mua hàng dựa trên thông tin bạn cung
                  cấp.
                </p>

                <div className="space-y-3 mb-8">
                  <div className="flex items-center gap-3 p-4 bg-orange-50 rounded-xl border border-orange-100">
                    <div className="w-2 h-2 bg-orange-500 rounded-full flex-shrink-0" />
                    <span className="text-gray-700 font-medium">
                      Thông tin cửa hàng và địa chỉ
                    </span>
                  </div>
                  <div className="flex items-center gap-3 p-4 bg-orange-50 rounded-xl border border-orange-100">
                    <div className="w-2 h-2 bg-orange-500 rounded-full flex-shrink-0" />
                    <span className="text-gray-700 font-medium">
                      Mô tả chi tiết sản phẩm
                    </span>
                  </div>
                  <div className="flex items-center gap-3 p-4 bg-orange-50 rounded-xl border border-orange-100">
                    <div className="w-2 h-2 bg-orange-500 rounded-full flex-shrink-0" />
                    <span className="text-gray-700 font-medium">
                      Hình ảnh tham khảo
                    </span>
                  </div>
                  <div className="flex items-center gap-3 p-4 bg-orange-50 rounded-xl border border-orange-100">
                    <div className="w-2 h-2 bg-orange-500 rounded-full flex-shrink-0" />
                    <span className="text-gray-700 font-medium">
                      Thông tin liên hệ cửa hàng
                    </span>
                  </div>
                </div>

                <Button
                  className="w-full bg-gradient-to-r from-orange-500 to-orange-600 hover:from-orange-600 hover:to-orange-700 text-white h-12 text-base font-semibold shadow-lg hover:shadow-xl transition-all duration-300 rounded-xl group-hover:scale-[1.02]"
                  onClick={(e) => {
                    e.stopPropagation();
                    handleSelectWithoutLink();
                  }}
                >
                  Chọn loại này
                  <ArrowRight className="h-4 w-4 ml-2" />
                </Button>
              </CardContent>
            </Card>

            {/* With Link Option */}
            <Card
              className="cursor-pointer transition-all duration-300 border border-gray-200 hover:border-blue-300 shadow-md hover:shadow-xl group relative overflow-hidden bg-white rounded-2xl"
              onClick={handleSelectWithLink}
            >
              <CardContent className="p-8">
                <div className="text-center mb-6">
                  <div className="w-20 h-20 bg-gradient-to-br from-blue-500 to-blue-600 text-white rounded-2xl flex items-center justify-center mx-auto group-hover:scale-105 transition-transform duration-300 shadow-lg mb-4">
                    <Link className="h-10 w-10" />
                  </div>
                  <h3 className="text-2xl font-bold text-gray-900 mb-3">
                    Sản phẩm từ sàn thương mại điện tử
                  </h3>
                  <Badge
                    variant="outline"
                    className="bg-blue-50 text-blue-700 border-blue-200 px-4 py-2 text-sm font-medium rounded-full"
                  >
                    Xử lý tự động AI
                  </Badge>
                </div>

                <p className="text-gray-600 text-center leading-relaxed mb-8">
                  Dành cho sản phẩm trên các sàn thương mại điện tử quốc tế như
                  Amazon, eBay, Taobao. AI sẽ tự động trích xuất thông tin từ
                  link.
                </p>

                <div className="space-y-3 mb-8">
                  <div className="flex items-center gap-3 p-4 bg-blue-50 rounded-xl border border-blue-100">
                    <div className="w-2 h-2 bg-blue-500 rounded-full flex-shrink-0" />
                    <span className="text-gray-700 font-medium">
                      Hỗ trợ nhiều link sản phẩm
                    </span>
                  </div>
                  <div className="flex items-center gap-3 p-4 bg-blue-50 rounded-xl border border-blue-100">
                    <div className="w-2 h-2 bg-blue-500 rounded-full flex-shrink-0" />
                    <span className="text-gray-700 font-medium">
                      Trích xuất thông tin tự động
                    </span>
                  </div>
                  <div className="flex items-center gap-3 p-4 bg-blue-50 rounded-xl border border-blue-100">
                    <div className="w-2 h-2 bg-blue-500 rounded-full flex-shrink-0" />
                    <span className="text-gray-700 font-medium">
                      Xử lý hàng loạt nhanh chóng
                    </span>
                  </div>
                </div>

                <Button
                  className="w-full bg-gradient-to-r from-blue-500 to-blue-600 hover:from-blue-600 hover:to-blue-700 text-white h-12 text-base font-semibold shadow-lg hover:shadow-xl transition-all duration-300 rounded-xl group-hover:scale-[1.02]"
                  onClick={(e) => {
                    e.stopPropagation();
                    handleSelectWithLink();
                  }}
                >
                  Chọn loại này
                  <ArrowRight className="h-4 w-4 ml-2" />
                </Button>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </div>
  );
}
