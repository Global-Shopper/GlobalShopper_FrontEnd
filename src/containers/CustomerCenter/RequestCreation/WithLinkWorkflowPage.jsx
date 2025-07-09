import { useState } from "react"
import { useNavigate } from "react-router-dom"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Link as LinkIcon, Plus, X, Loader2, ArrowRight, ArrowLeft, Home } from "lucide-react"
import ProductManagement from "./ProductManagement"
import RequestConfirmation from "./RequestConfirmation"
import RequestSuccess from "./RequestSuccess"

const createEmptyProduct = () => ({
  name: "",
  description: "",
  quantity: 1,
  color: "",
  size: "",
  variants: [],
  link: "",
  image: "",
})

const mockExtractProduct = async () => {
  await new Promise((resolve) => setTimeout(resolve, 1000 + Math.random() * 1000))
  if (Math.random() > 0.8) throw new Error("Không thể trích xuất thông tin từ link này")
  return {
    name: "Áo thun nam Nike Dri-FIT Premium",
    image: "/placeholder.svg?height=300&width=300",
    description: "Áo thun thể thao nam Nike với công nghệ Dri-FIT giúp thấm hút mồ hôi, chất liệu cotton cao cấp, thiết kế hiện đại",
  }
}

export default function WithLinkWorkflowPage() {
  const navigate = useNavigate()
  const [currentStep, setCurrentStep] = useState("link-input")
  const [productLinks, setProductLinks] = useState([
    { link: "", product: null, status: "idle" }
  ])
  const [products, setProducts] = useState([])

  const addProductLink = () => {
    setProductLinks([...productLinks, { link: "", product: null, status: "idle" }])
  }

  const removeProductLink = (index) => {
    setProductLinks(productLinks.filter((_, i) => i !== index))
  }

  const updateProductLink = (index, value) => {
    const newLinks = [...productLinks]
    newLinks[index].link = value
    setProductLinks(newLinks)
  }

  const handleExtract = async (index) => {
    const newLinks = [...productLinks]
    newLinks[index].status = "extracting"
    setProductLinks(newLinks)
    try {
      const extracted = await mockExtractProduct(newLinks[index].link)
      newLinks[index].product = {
        ...createEmptyProduct(),
        ...extracted,
        link: newLinks[index].link,
        id: `product_${Date.now()}_${index}`,
      }
      newLinks[index].status = "success"
    } catch {
      newLinks[index].status = "failed"
      newLinks[index].product = { ...createEmptyProduct(), link: newLinks[index].link, id: `product_${Date.now()}_${index}` }
    }
    setProductLinks([...newLinks])
  }

  const handleProductChange = (index, product) => {
    const newLinks = [...productLinks]
    newLinks[index].product = product
    setProductLinks(newLinks)
  }

  const canContinue = productLinks.length > 0 && productLinks.every(p => p.product && p.product.name?.trim())

  // Step navigation
  const handleBackToSelection = () => navigate(-1)
  const handleBackToDashboard = () => navigate("/account-center/purchase-request-list")
  const handleSuccess = () => setCurrentStep("success")

  // Render
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
      <span className="font-medium text-blue-600">Có link sản phẩm</span>
    </div>
  )

  const renderStepIndicator = () => {
    // Remove "product-management" from steps and stepLabels
    const steps = ["link-input", "confirmation", "success"]
    const stepLabels = ["Nhập link", "Xác nhận", "Hoàn thành"]
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
                      ? "bg-gradient-to-br from-blue-600 to-blue-700 text-white"
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
                    index < currentIndex ? "bg-gradient-to-r from-blue-600 to-blue-700" : "bg-gray-200"
                  }`}
                />
              )}
            </div>
          ))}
        </div>
      </div>
    )
  }

  // Step 1: Link input and extraction/manual entry
  const renderLinkInput = () => (
    <div>
      <Card className="shadow-lg p-2 py-4">
        <CardHeader className="bg-gradient-to-r from-blue-600 to-blue-700 text-white border-blue-800 rounded-lg">
          <CardTitle className="flex items-center gap-3 text-xl">
            <LinkIcon className="h-6 w-6 mt-1" />
            Nhập link sản phẩm
          </CardTitle>
        </CardHeader>
        <CardContent className="p-8 py-2 space-y-4">
            {productLinks.map((item, index) => (
              <div key={index} className="border rounded-lg p-4 mb-4 bg-white shadow-sm">
                <div className="flex gap-3 items-center mb-2">
                  <Input
                    value={item.link}
                    onBlur={() => {
                      if (item.link) {
                        handleExtract(index)
                      }
                    }}
                    onChange={e => updateProductLink(index, e.target.value)}
                    placeholder="https://amazon.com/product/... hoặc https://ebay.com/..."
                    className="h-12"
                  />
                  {productLinks.length > 1 && (
                    <Button
                      type="button"
                      variant="outline"
                      size="sm"
                      onClick={() => removeProductLink(index)}
                      className="text-red-600 hover:text-red-700 hover:bg-red-50"
                    >
                      <X className="h-4 w-4" />
                    </Button>
                  )}
                </div>
                <div className="flex gap-2 items-center mb-2">
                  <Button
                    type="button"
                    size="sm"
                    variant="secondary"
                    disabled={!item.link.trim() || item.status === "extracting"}
                    onClick={() => handleExtract(index)}
                  >
                    {item.status === "extracting" ? (
                      <>
                        <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                        Đang trích xuất...
                      </>
                    ) : (
                      <>Trích xuất tự động</>
                    )}
                  </Button>
                  {item.status === "failed" && (
                    <span className="text-xs text-red-600 ml-2">Trích xuất thất bại, vui lòng nhập thủ công.</span>
                  )}
                  {item.status === "success" && (
                    <span className="text-xs text-green-600 ml-2">Đã trích xuất thành công, bạn có thể chỉnh sửa.</span>
                  )}
                </div>
                {/* Product info form */}
                {(item.status === "success" || item.status === "failed" || item.product) && (
                    <ProductManagement
                      products={[item.product]}
                      onProductsChange={([p]) => handleProductChange(index, p)}
                    />
                )}
              </div>
            ))}
            <Button
              type="button"
              variant="outline"
              onClick={addProductLink}
              className="w-full h-12 border-dashed border-2 bg-transparent hover:bg-blue-50"
            >
              <Plus className="h-4 w-4 mr-2" />
              Thêm link sản phẩm khác
            </Button>
          <div className="flex gap-4 pt-6">
            <Button variant="outline" onClick={handleBackToSelection} className="flex-1 h-12 bg-transparent">
              <ArrowLeft className="h-4 w-4 mr-2" />
              Quay lại
            </Button>
            <Button
              onClick={() => {
                setProducts(productLinks.map(p => p.product))
                setCurrentStep("confirmation") // Go directly to confirmation
              }}
              className="flex-1 h-12 bg-gradient-to-r from-blue-600 to-blue-700 hover:from-blue-700 hover:to-blue-800"
              disabled={!canContinue}
            >
              Tiếp tục
              <ArrowRight className="h-4 w-4 ml-2" />
            </Button>
          </div>
        </CardContent>
      </Card>
    </div>
  )

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-indigo-50">
      <div className="max-w-6xl mx-auto p-6 space-y-8">
        {renderBreadcrumb()}
        <div className="space-y-2 mb-8">
          <h1 className="text-3xl font-bold text-gray-900">Yêu cầu có link sản phẩm</h1>
          <p className="text-gray-600">Nhập link sản phẩm, trích xuất tự động hoặc nhập thông tin thủ công</p>
        </div>
        {renderStepIndicator()}
        {currentStep === "link-input" && renderLinkInput()}
        {currentStep === "confirmation" && (
          <RequestConfirmation
            type="with-link"
            products={products}
            onNext={handleSuccess}
            onBack={() => setCurrentStep("link-input")}
          />
        )}
        {currentStep === "success" && <RequestSuccess onClose={() => navigate("/")} />}
      </div>
    </div>
  )
}
