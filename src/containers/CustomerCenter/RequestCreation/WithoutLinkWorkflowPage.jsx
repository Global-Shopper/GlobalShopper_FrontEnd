"use client"

import { useState } from "react"
import { useNavigate } from "react-router-dom"
import { Button } from "../ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "../ui/card"
import { Input } from "../ui/input"
import { Label } from "../ui/label"
import { Textarea } from "../ui/textarea"
import { Alert, AlertDescription } from "../ui/alert"
import { Store, ArrowRight, ArrowLeft, Info, Home } from "lucide-react"
import ProductInfoManual from "./ProductInfoManual"
import RequestConfirmation from "./RequestConfirmation"
import RequestSuccess from "./RequestSuccess"
import { createEmptyShopInfo } from "../../types/purchase-request"

export default function WithoutLinkWorkflowPage() {
  const navigate = useNavigate()
  const [currentStep, setCurrentStep] = useState("shop-info")
  const [shopInfo, setShopInfo] = useState(createEmptyShopInfo())
  const [products, setProducts] = useState([])

  const handleSuccess = () => {
    setCurrentStep("success")
  }

  const handleBackToSelection = () => {
    navigate("/create-request")
  }

  const handleBackToDashboard = () => {
    navigate("/")
  }

  const renderBreadcrumb = () => (
    <div className="flex items-center gap-2 text-sm text-gray-600 mb-6">
      <Button variant="ghost" size="sm" onClick={handleBackToDashboard} className="h-8 px-2 hover:bg-white/50">
        <Home className="h-4 w-4 mr-1" />
        Trang chủ
      </Button>
      <span>/</span>
      <Button variant="ghost" size="sm" onClick={handleBackToSelection} className="h-8 px-2 hover:bg-white/50">
        Tạo yêu cầu
      </Button>
      <span>/</span>
      <span className="font-medium text-orange-600">Không có link sản phẩm</span>
    </div>
  )

  const renderStepIndicator = () => {
    const steps = ["shop-info", "product-info", "confirmation", "success"]
    const stepLabels = ["Thông tin CH", "Thông tin SP", "Xác nhận", "Hoàn thành"]
    const currentIndex = steps.indexOf(currentStep)

    return (
      <div className="flex items-center justify-center mb-8 overflow-x-auto">
        <div className="flex items-center space-x-2 min-w-max px-4">
          {steps.map((step, index) => (
            <div key={step} className="flex items-center">
              <div className="flex flex-col items-center">
                <div
                  className={`w-12 h-12 rounded-full flex items-center justify-center text-sm font-medium transition-colors shadow-lg ${
                    index <= currentIndex
                      ? "bg-gradient-to-br from-orange-600 to-orange-700 text-white"
                      : "bg-gray-200 text-gray-500"
                  }`}
                >
                  {index + 1}
                </div>
                <span className="text-xs mt-2 text-gray-600 font-medium">{stepLabels[index]}</span>
              </div>
              {index < steps.length - 1 && (
                <div
                  className={`w-16 h-1 mx-4 transition-colors ${
                    index < currentIndex ? "bg-gradient-to-r from-orange-600 to-orange-700" : "bg-gray-200"
                  }`}
                />
              )}
            </div>
          ))}
        </div>
      </div>
    )
  }

  const renderShopInfo = () => (
    <Card className="shadow-lg">
      <CardHeader className="bg-gradient-to-r from-orange-600 to-orange-700 text-white">
        <CardTitle className="flex items-center gap-3 text-xl">
          <Store className="h-6 w-6" />
          Thông tin cửa hàng
        </CardTitle>
      </CardHeader>
      <CardContent className="p-8 space-y-6">
        <Alert className="bg-orange-50 border-orange-200">
          <Info className="h-4 w-4 text-orange-600" />
          <AlertDescription className="text-orange-800">
            Vui lòng cung cấp thông tin chi tiết về cửa hàng để chúng tôi có thể hỗ trợ bạn tốt nhất.
          </AlertDescription>
        </Alert>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div className="space-y-2">
            <Label htmlFor="shopName" className="text-base font-medium">
              Tên cửa hàng *
            </Label>
            <Input
              id="shopName"
              value={shopInfo.name}
              onChange={(e) => setShopInfo((prev) => ({ ...prev, name: e.target.value }))}
              placeholder="Ví dụ: Nike Store, Uniqlo, Zara..."
              className="h-12"
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="shopEmail" className="text-base font-medium">
              Email cửa hàng
            </Label>
            <Input
              id="shopEmail"
              type="email"
              value={shopInfo.email}
              onChange={(e) => setShopInfo((prev) => ({ ...prev, email: e.target.value }))}
              placeholder="contact@store.com"
              className="h-12"
            />
          </div>
        </div>

        <div className="space-y-2">
          <Label htmlFor="shopAddress" className="text-base font-medium">
            Địa chỉ cửa hàng *
          </Label>
          <Textarea
            id="shopAddress"
            value={shopInfo.address}
            onChange={(e) => setShopInfo((prev) => ({ ...prev, address: e.target.value }))}
            placeholder="Địa chỉ cụ thể của cửa hàng (số nhà, đường, quận/huyện, thành phố)..."
            rows={3}
            className="resize-none"
          />
        </div>

        <div className="space-y-2">
          <Label htmlFor="shopWebsite" className="text-base font-medium">
            Website cửa hàng (nếu có)
          </Label>
          <Input
            id="shopWebsite"
            type="url"
            value={shopInfo.website}
            onChange={(e) => setShopInfo((prev) => ({ ...prev, website: e.target.value }))}
            placeholder="https://store-website.com"
            className="h-12"
          />
        </div>

        <div className="flex gap-4 pt-6">
          <Button variant="outline" onClick={handleBackToSelection} className="flex-1 h-12 bg-transparent">
            <ArrowLeft className="h-4 w-4 mr-2" />
            Quay lại
          </Button>
          <Button
            onClick={() => setCurrentStep("product-info")}
            className="flex-1 h-12 bg-gradient-to-r from-orange-600 to-orange-700 hover:from-orange-700 hover:to-orange-800"
            disabled={!shopInfo.name || !shopInfo.address}
          >
            Tiếp tục
            <ArrowRight className="h-4 w-4 ml-2" />
          </Button>
        </div>
      </CardContent>
    </Card>
  )

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-orange-50 to-red-50">
      <div className="max-w-6xl mx-auto p-6 space-y-8">
        {renderBreadcrumb()}

        <div className="space-y-2 mb-8">
          <h1 className="text-3xl font-bold text-gray-900">Yêu cầu không có link sản phẩm</h1>
          <p className="text-gray-600">Cung cấp thông tin cửa hàng và mô tả sản phẩm chi tiết</p>
        </div>

        {renderStepIndicator()}

        {currentStep === "shop-info" && renderShopInfo()}
        {currentStep === "product-info" && (
          <ProductInfoManual
            products={products}
            onProductsChange={setProducts}
            onNext={() => setCurrentStep("confirmation")}
            onBack={() => setCurrentStep("shop-info")}
          />
        )}
        {currentStep === "confirmation" && (
          <RequestConfirmation
            type="without-link"
            products={products}
            shopInfo={shopInfo}
            onNext={handleSuccess}
            onBack={() => setCurrentStep("product-info")}
          />
        )}
        {currentStep === "success" && <RequestSuccess onClose={() => navigate("/")} />}
      </div>
    </div>
  )
}
