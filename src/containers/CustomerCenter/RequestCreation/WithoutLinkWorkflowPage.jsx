import { useState } from "react"
import { useNavigate } from "react-router-dom"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Store, ArrowRight, ArrowLeft, Home } from "lucide-react"
import RequestItemForm from "./RequestItemForm"
import RequestConfirmation from "./RequestConfirmation"
import RequestSuccess from "./RequestSuccess"
import { useCreateWithoutLinkPurchaseRequestMutation } from "@/services/gshopApi"
import { toast } from "sonner"

export default function WithoutLinkWorkflowPage() {
  const navigate = useNavigate()
  const [createPurchaseRequest, {data: purchaseData}] = useCreateWithoutLinkPurchaseRequestMutation()
  const [currentStep, setCurrentStep] = useState("contactInfo")

  const [shopName, setShopName] = useState("")
  const [shopEmail, setShopEmail] = useState("")
  const [shopAddress, setShopAddress] = useState("")
  const [shopWebsite, setShopWebsite] = useState("")
  const [items, setItems] = useState([])
  const [shippingAddressId, setShippingAddressId] = useState(null)

  const contactInfo = [
    `Tên cửa hàng: ${shopName}`,
    shopEmail ? `Email: ${shopEmail}` : null,
    `Địa chỉ: ${shopAddress}`,
    shopWebsite ? `Website: ${shopWebsite}` : null,
  ].filter(Boolean)

  const handleSuccess = () => {
    createPurchaseRequest({
      shippingAddressId,
      contactInfo,
      items,
    }).unwrap().then(() => {
      toast.success("Yêu cầu mua hàng đã được gửi thành công!")
    }).catch((error) => {
      toast.error(error?.data?.message || "Đã xảy ra lỗi khi gửi yêu cầu. Vui lòng thử lại sau.")
    })
    setCurrentStep("success")
  }

  const handleBackToSelection = () => {
    navigate(-1)
  }

  const handleBackToDashboard = () => {
    navigate("/account-center/purchase-request-list")
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
    const steps = ["contactInfo", "requestItems", "confirmation", "success"]
    const stepLabels = ["Thông tin CH", "Thông tin SP", "Xác nhận", "Hoàn thành"]
    const currentIndex = steps.indexOf(currentStep)

    return (
      <div className="flex items-center justify-center mb-8 overflow-x-auto">
        <div className="flex items-center space-x-2 min-w-max px-4">
          {steps.map((step, index) => (
            <div key={step} className="flex items-center">
              <div className="flex flex-col items-center">
                <div
                  className={`w-12 h-12 rounded-full flex items-center justify-center text-sm font-medium transition-colors shadow-lg ${index <= currentIndex
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
                  className={`w-16 h-1 mx-4 transition-colors ${index < currentIndex ? "bg-gradient-to-r from-orange-600 to-orange-700" : "bg-gray-200"
                    }`}
                />
              )}
            </div>
          ))}
        </div>
      </div>
    )
  }

  const renderContactInfo = () => (
    <Card className="shadow-lg p-2 py-4">
      <CardHeader className="bg-gradient-to-r from-orange-600 to-orange-700 text-white rounded-lg">
        <CardTitle className="flex items-center gap-3 text-xl">
          <Store className="h-6 w-6 mt-1" />
          Thông tin cửa hàng
        </CardTitle>
      </CardHeader>
      <CardContent className="p-4 pt-2 space-y-4">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div className="space-y-2">
            <Label htmlFor="shopName" className="text-base font-medium">
              Tên cửa hàng *
            </Label>
            <Input
              id="shopName"
              value={shopName}
              onChange={(e) => setShopName(e.target.value)}
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
              value={shopEmail}
              onChange={(e) => setShopEmail(e.target.value)}
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
            value={shopAddress}
            onChange={(e) => setShopAddress(e.target.value)}
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
            value={shopWebsite}
            onChange={(e) => setShopWebsite(e.target.value)}
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
            onClick={() => setCurrentStep("requestItems")}
            className="flex-1 h-12 bg-gradient-to-r from-orange-600 to-orange-700 hover:from-orange-700 hover:to-orange-800"
            disabled={!shopName || !shopAddress}
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

        {currentStep === "contactInfo" && renderContactInfo()}
        {currentStep === "requestItems" && (
          <RequestItemForm
            items={items}
            onItemsChange={setItems}
            onNext={() => setCurrentStep("confirmation")}
            onBack={() => setCurrentStep("contactInfo")}
          />
        )}
        {currentStep === "confirmation" && (
          <RequestConfirmation
            items={items}
            contactInfo={contactInfo}
            onNext={handleSuccess}
            onBack={() => setCurrentStep("requestItems")}
            setShippingAddressId={setShippingAddressId}
            shippingAddressId={shippingAddressId}
          />
        )}
        {currentStep === "success" && <RequestSuccess onClose={() => navigate("/")} purchaseData={purchaseData} />}
      </div>
    </div>
  )
}
