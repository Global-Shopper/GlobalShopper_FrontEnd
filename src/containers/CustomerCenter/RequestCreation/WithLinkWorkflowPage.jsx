"use client"

import { useState } from "react"
import { useNavigate } from "react-router-dom"
import { Button } from "../ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "../ui/card"
import { Input } from "../ui/input"
import { Label } from "../ui/label"
import { Alert, AlertDescription } from "../ui/alert"
import { Link, Plus, X, Loader2, AlertTriangle, ArrowRight, ArrowLeft, Info, Home } from "lucide-react"
import ProductManagement from "./ProductManagement"
import RequestConfirmation from "./RequestConfirmation"
import RequestSuccess from "./RequestSuccess"
import { createEmptyProduct, EXTRACTION_STATUS, SUPPORTED_PLATFORMS } from "../../types/purchase-request"

const mockExtractProduct = async (link) => {
  await new Promise((resolve) => setTimeout(resolve, 2000 + Math.random() * 2000))

  if (Math.random() > 0.8) {
    throw new Error("Không thể trích xuất thông tin từ link này")
  }

  return {
    name: "Áo thun nam Nike Dri-FIT Premium",
    image: "/placeholder.svg?height=300&width=300",
    description:
      "Áo thun thể thao nam Nike với công nghệ Dri-FIT giúp thấm hút mồ hôi, chất liệu cotton cao cấp, thiết kế hiện đại",
    extractionStatus: EXTRACTION_STATUS.SUCCESS,
  }
}

export default function WithLinkWorkflowPage() {
  const navigate = useNavigate()
  const [currentStep, setCurrentStep] = useState("link-input")
  const [productLinks, setProductLinks] = useState([""])
  const [products, setProducts] = useState([])
  const [processingLinks, setProcessingLinks] = useState(new Set())
  const [failedLinks, setFailedLinks] = useState(new Set())

  const addProductLink = () => {
    setProductLinks([...productLinks, ""])
  }

  const removeProductLink = (index) => {
    const newLinks = productLinks.filter((_, i) => i !== index)
    setProductLinks(newLinks)
    setProcessingLinks((prev) => {
      const newSet = new Set(prev)
      newSet.delete(index)
      return newSet
    })
    setFailedLinks((prev) => {
      const newSet = new Set(prev)
      newSet.delete(index)
      return newSet
    })
  }

  const updateProductLink = (index, value) => {
    const newLinks = [...productLinks]
    newLinks[index] = value
    setProductLinks(newLinks)
  }

  const processProductLinks = async () => {
    setCurrentStep("ai-processing")
    const validLinks = productLinks.filter((link) => link.trim() !== "")
    const newProducts = []

    for (let i = 0; i < validLinks.length; i++) {
      const link = validLinks[i]
      setProcessingLinks((prev) => new Set([...prev, i]))

      try {
        const extractedData = await mockExtractProduct(link)
        const product = {
          ...createEmptyProduct(),
          id: `product_${Date.now()}_${i}`,
          name: extractedData.name || "",
          image: extractedData.image || "",
          description: extractedData.description || "",
          link: link,
          extractionStatus: EXTRACTION_STATUS.SUCCESS,
        }
        newProducts.push(product)
        setProcessingLinks((prev) => {
          const newSet = new Set(prev)
          newSet.delete(i)
          return newSet
        })
      } catch (error) {
        setFailedLinks((prev) => new Set([...prev, i]))
        setProcessingLinks((prev) => {
          const newSet = new Set(prev)
          newSet.delete(i)
          return newSet
        })

        const product = {
          ...createEmptyProduct(),
          id: `product_${Date.now()}_${i}`,
          link: link,
          extractionStatus: EXTRACTION_STATUS.FAILED,
        }
        newProducts.push(product)
      }
    }

    setProducts(newProducts)
    setCurrentStep("product-management")
  }

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
      <span className="font-medium text-blue-600">Có link sản phẩm</span>
    </div>
  )

  const renderStepIndicator = () => {
    const steps = ["link-input", "ai-processing", "product-management", "confirmation", "success"]
    const stepLabels = ["Nhập link", "Xử lý AI", "Quản lý SP", "Xác nhận", "Hoàn thành"]
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

  const renderLinkInput = () => (
    <div className="space-y-6">
      <Card className="shadow-lg">
        <CardHeader className="bg-gradient-to-r from-blue-600 to-blue-700 text-white">
          <CardTitle className="flex items-center gap-3 text-xl">
            <Link className="h-6 w-6" />
            Nhập link sản phẩm
          </CardTitle>
        </CardHeader>
        <CardContent className="p-8 space-y-6">
          <Alert className="bg-blue-50 border-blue-200">
            <Info className="h-4 w-4 text-blue-600" />
            <AlertDescription className="text-blue-800">
              Hỗ trợ các sàn quốc tế: {SUPPORTED_PLATFORMS.slice(0, 6).join(", ")} và nhiều sàn khác. Bạn có thể thêm
              nhiều link sản phẩm cùng lúc.
            </AlertDescription>
          </Alert>

          <div className="space-y-4">
            <Label className="text-lg font-semibold">Danh sách link sản phẩm</Label>

            {productLinks.map((link, index) => (
              <div key={index} className="flex gap-3 items-center">
                <div className="flex-1 space-y-2">
                  <Label htmlFor={`link-${index}`} className="text-sm font-medium">
                    Link sản phẩm {index + 1} {index === 0 && "*"}
                  </Label>
                  <Input
                    id={`link-${index}`}
                    value={link}
                    onChange={(e) => updateProductLink(index, e.target.value)}
                    placeholder="https://amazon.com/product/... hoặc https://ebay.com/..."
                    className="h-12"
                  />
                </div>

                {productLinks.length > 1 && (
                  <Button
                    type="button"
                    variant="outline"
                    size="sm"
                    onClick={() => removeProductLink(index)}
                    className="mt-6 text-red-600 hover:text-red-700 hover:bg-red-50"
                  >
                    <X className="h-4 w-4" />
                  </Button>
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
          </div>

          <div className="flex gap-4 pt-6">
            <Button variant="outline" onClick={handleBackToSelection} className="flex-1 h-12 bg-transparent">
              <ArrowLeft className="h-4 w-4 mr-2" />
              Quay lại
            </Button>
            <Button
              onClick={processProductLinks}
              className="flex-1 h-12 bg-gradient-to-r from-blue-600 to-blue-700 hover:from-blue-700 hover:to-blue-800"
              disabled={!productLinks[0]?.trim()}
            >
              Xử lý link sản phẩm
              <ArrowRight className="h-4 w-4 ml-2" />
            </Button>
          </div>
        </CardContent>
      </Card>
    </div>
  )

  const renderAIProcessing = () => (
    <Card className="shadow-lg">
      <CardContent className="p-16 text-center space-y-8">
        <div className="w-28 h-28 bg-blue-100 text-blue-600 rounded-full flex items-center justify-center mx-auto shadow-lg">
          <Loader2 className="h-14 w-14 animate-spin" />
        </div>
        <div className="space-y-4">
          <h3 className="text-3xl font-bold text-gray-900">Đang xử lý thông tin sản phẩm</h3>
          <p className="text-gray-600 text-lg max-w-2xl mx-auto">
            Hệ thống AI đang trích xuất thông tin từ {productLinks.filter((link) => link.trim()).length} link sản phẩm
            của bạn. Quá trình này có thể mất vài phút...
          </p>
        </div>

        <div className="space-y-4 max-w-md mx-auto">
          <div className="w-full bg-gray-200 rounded-full h-4">
            <div
              className="bg-gradient-to-r from-blue-600 to-blue-700 h-4 rounded-full transition-all duration-1000"
              style={{
                width: `${
                  ((productLinks.filter((link) => link.trim()).length - processingLinks.size) /
                    productLinks.filter((link) => link.trim()).length) *
                  100
                }%`,
              }}
            ></div>
          </div>
          <p className="text-sm text-gray-500">
            Đã xử lý {productLinks.filter((link) => link.trim()).length - processingLinks.size} /{" "}
            {productLinks.filter((link) => link.trim()).length} sản phẩm
          </p>
        </div>

        {failedLinks.size > 0 && (
          <Alert className="bg-amber-50 border-amber-200 max-w-2xl mx-auto">
            <AlertTriangle className="h-4 w-4 text-amber-600" />
            <AlertDescription className="text-amber-800">
              Có {failedLinks.size} link không thể trích xuất thông tin. Bạn sẽ cần nhập thông tin thủ công cho những
              sản phẩm này.
            </AlertDescription>
          </Alert>
        )}
      </CardContent>
    </Card>
  )

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-indigo-50">
      <div className="max-w-6xl mx-auto p-6 space-y-8">
        {renderBreadcrumb()}

        <div className="space-y-2 mb-8">
          <h1 className="text-3xl font-bold text-gray-900">Yêu cầu có link sản phẩm</h1>
          <p className="text-gray-600">Nhập link sản phẩm để hệ thống AI tự động trích xuất thông tin</p>
        </div>

        {renderStepIndicator()}

        {currentStep === "link-input" && renderLinkInput()}
        {currentStep === "ai-processing" && renderAIProcessing()}
        {currentStep === "product-management" && (
          <ProductManagement
            products={products}
            onProductsChange={setProducts}
            onNext={() => setCurrentStep("confirmation")}
            onBack={() => setCurrentStep("link-input")}
            failedLinks={failedLinks}
          />
        )}
        {currentStep === "confirmation" && (
          <RequestConfirmation
            type="with-link"
            products={products}
            onNext={handleSuccess}
            onBack={() => setCurrentStep("product-management")}
          />
        )}
        {currentStep === "success" && <RequestSuccess onClose={() => navigate("/")} />}
      </div>
    </div>
  )
}
