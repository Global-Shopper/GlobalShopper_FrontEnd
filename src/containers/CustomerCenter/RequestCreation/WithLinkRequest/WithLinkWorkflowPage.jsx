import { useState, useRef } from "react";
import { useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import {
  Select,
  SelectTrigger,
  SelectValue,
  SelectContent,
  SelectItem,
} from "@/components/ui/select";
import {
  Link as LinkIcon,
  Plus,
  X,
  Loader2,
  ArrowRight,
  ArrowLeft,
  Home,
  ExternalLink,
  Upload,
  Trash2,
} from "lucide-react";
import RequestConfirmation from "../RequestConfirmation";
import RequestSuccess from "../RequestSuccess";
import {
  useLazyGetRawDataQuery,
  useCreateWithLinkPurchaseRequestMutation,
} from "@/services/gshopApi";

import { uploadToCloudinary } from "@/utils/uploadToCloudinary";
import { toast } from "sonner";
import ItemForm from "./ItemForm";

const createEmptyProduct = () => ({
  name: "",
  description: "",
  quantity: 1,
  variants: [],
  link: "",
  images: [],
  variantRows: [],
});

export default function WithLinkWorkflowPage() {
  const navigate = useNavigate();
  const [getRawData] = useLazyGetRawDataQuery();
  const [createPurchaseRequest, { data: purchaseData }] =
    useCreateWithLinkPurchaseRequestMutation();
  const [currentStep, setCurrentStep] = useState("linkInput");
  const [productLinks, setProductLinks] = useState([
    { link: "", product: null, status: "idle", isUploading: false },
  ]);
  const [shippingAddressId, setShippingAddressId] = useState(null);

  // Add new product link
  const addProductLink = () => {
    setProductLinks([
      ...productLinks,
      { link: "", product: null, status: "idle" },
    ]);
  };

  // Remove a product link
  const removeProductLink = (index) => {
    setProductLinks(productLinks.filter((_, i) => i !== index));
  };

  // Update the value of a product link
  const updateProductLink = (index, value) => {
    const newLinks = [...productLinks];
    newLinks[index].link = value;
    setProductLinks(newLinks);
  };

  // Extract product data from API
  const handleExtract = async (index) => {
    const newLinks = [...productLinks];
    newLinks[index].status = "extracting";
    setProductLinks(newLinks);
    try {
      console.log(newLinks[index].link);
      const rawData = await getRawData({
        link: newLinks[index].link,
      }).unwrap();

      // Check if rawData is empty or has no meaningful content
      const isEmptyData =
        !rawData ||
        Object.keys(rawData).length === 0 ||
        (!rawData.name &&
          !rawData.description &&
          (!rawData.variants || rawData.variants.length === 0));

      if (isEmptyData) {
        // Treat empty response as failed extraction
        newLinks[index].status = "failed";
        newLinks[index].product = {
          ...createEmptyProduct(),
          link: newLinks[index].link,
          id: `product_${Date.now()}_${index}`,
        };
        toast.error(
          "Không thể trích xuất thông tin từ link này. Vui lòng nhập thông tin thủ công."
        );
      } else {
        // Successful extraction with meaningful data
        // Create variant rows from extracted variants
        const variantRows = (rawData?.variants || []).map((variant) => ({
          fieldType: variant,
          customFieldName: "",
          fieldValue: "",
        }));

        newLinks[index].product = {
          ...createEmptyProduct(),
          name: rawData?.name || "",
          description: rawData?.description || "",
          variants: rawData?.variants || [],
          variantRows,
          link: newLinks[index].link,
          id: `product_${Date.now()}_${index}`,
        };
        newLinks[index].status = "success";
        toast.success("Trích xuất thông tin sản phẩm thành công!");
      }
    } catch (error) {
      newLinks[index].status = "failed";
      newLinks[index].product = {
        ...createEmptyProduct(),
        link: newLinks[index].link,
        id: `product_${Date.now()}_${index}`,
      };
      toast.error("Trích xuất thất bại. Vui lòng nhập thông tin thủ công.");
    }
    setProductLinks([...newLinks]);
  };

  // Allow manual entry
  const handleManualEntry = (index) => {
    const newLinks = [...productLinks];
    newLinks[index].status = "manual";
    newLinks[index].product = {
      ...createEmptyProduct(),
      link: newLinks[index].link,
      id: `manual_${Date.now()}_${index}`,
    };
    setProductLinks(newLinks);
    toast.info("Chế độ nhập thủ công đã được kích hoạt.");
  };

  // When product info is edited
  const handleProductChange = (index, product) => {
    const newLinks = [...productLinks];
    newLinks[index].product = product;
    setProductLinks(newLinks);
  };

  // Handle image upload for a specific product
  const handleImageUpload = async (index, event) => {
    const files = Array.from(event.target.files);
    if (!files.length) return;

    // Validate all files
    for (const file of files) {
      if (!file.type.startsWith("image/")) {
        toast.error("Vui lòng chọn file hình ảnh");
        return;
      }
      if (file.size > 10 * 1024 * 1024) {
        toast.error("Kích thước file không được vượt quá 10MB");
        return;
      }
    }

    const newLinks = [...productLinks];
    newLinks[index].isUploading = true;
    setProductLinks(newLinks);

    try {
      const uploadPromises = files.map((file) => uploadToCloudinary(file));
      const urls = await Promise.all(uploadPromises);
      const updatedProduct = {
        ...newLinks[index].product,
        images: [
          ...(newLinks[index].product?.images || []),
          ...urls.filter(Boolean),
        ],
      };
      handleProductChange(index, updatedProduct);
    } catch {
      toast.error("Có lỗi xảy ra khi tải ảnh lên. Vui lòng thử lại.");
    } finally {
      newLinks[index].isUploading = false;
      setProductLinks(newLinks);
    }
  };

  // Remove image from a specific product
  const removeImage = (productIndex, imageIndex) => {
    const newLinks = [...productLinks];
    const updatedProduct = {
      ...newLinks[productIndex].product,
      images: newLinks[productIndex].product.images.filter(
        (_, i) => i !== imageIndex
      ),
    };
    handleProductChange(productIndex, updatedProduct);
  };

  // Add variant row for a specific product
  const addVariantRow = (productIndex, fieldType) => {
    const newLinks = [...productLinks];
    const currentVariantRows =
      newLinks[productIndex].product?.variantRows || [];
    const updatedProduct = {
      ...newLinks[productIndex].product,
      variantRows: [
        ...currentVariantRows,
        { fieldType, customFieldName: "", fieldValue: "" },
      ],
    };
    handleProductChange(productIndex, updatedProduct);
  };

  // Update variant row for a specific product
  const updateVariantRow = (productIndex, variantIndex, changes) => {
    const newLinks = [...productLinks];
    const currentVariantRows =
      newLinks[productIndex].product?.variantRows || [];
    const updatedVariantRows = currentVariantRows.map((row, i) =>
      i === variantIndex ? { ...row, ...changes } : row
    );
    const updatedProduct = {
      ...newLinks[productIndex].product,
      variantRows: updatedVariantRows,
    };
    handleProductChange(productIndex, updatedProduct);
  };

  // Remove variant row for a specific product
  const removeVariantRow = (productIndex, variantIndex) => {
    const newLinks = [...productLinks];
    const currentVariantRows =
      newLinks[productIndex].product?.variantRows || [];
    const updatedProduct = {
      ...newLinks[productIndex].product,
      variantRows: currentVariantRows.filter((_, i) => i !== variantIndex),
    };
    handleProductChange(productIndex, updatedProduct);
  };

  // Can continue if all products have a name
  const canContinue =
    productLinks.length > 0 &&
    productLinks.every((p) => p.product && p.product.name?.trim());

  // Handle success
  const handleSuccess = () => {
    const requestItems = productLinks.map((p) => p.product).filter(Boolean);
    createPurchaseRequest({
      shippingAddressId,
      requestItems,
    })
      .unwrap()
      .then(() => {
        toast.success("Yêu cầu mua hàng đã được gửi thành công!");
      })
      .catch((error) => {
        toast.error(
          error?.data?.message ||
            "Đã xảy ra lỗi khi gửi yêu cầu. Vui lòng thử lại sau."
        );
      });
    setCurrentStep("success");
  };

  // Step navigation
  const handleBackToSelection = () => navigate(-1);
  const handleBackToHome = () => navigate("/");

  // Render breadcrumb
  const renderBreadcrumb = () => (
    <div className="flex items-center gap-2 text-sm text-gray-500">
      <Button
        variant="ghost"
        size="sm"
        onClick={handleBackToHome}
        className="h-8 px-3 hover:bg-gray-100 text-gray-600 hover:text-gray-900"
      >
        <Home className="h-4 w-4 mr-1" />
        Trang chủ
      </Button>
      <span className="text-gray-400">/</span>
      <Button
        variant="ghost"
        size="sm"
        onClick={handleBackToSelection}
        className="h-8 px-3 hover:bg-gray-100 text-gray-600 hover:text-gray-900"
      >
        Tạo yêu cầu
      </Button>
      <span className="text-gray-400">/</span>
      <span className="font-medium text-blue-600">Có link sản phẩm</span>
    </div>
  );

  // Render step indicator
  const renderStepIndicator = () => {
    const steps = ["linkInput", "confirmation", "success"];
    const stepLabels = [
      "Nhập link sản phẩm",
      "Xác nhận đơn hàng",
      "Hoàn thành",
    ];
    const currentIndex = steps.indexOf(currentStep);

    return (
      <div className="flex items-center justify-center mb-8">
        <div className="flex items-center space-x-6">
          {steps.map((step, index) => (
            <div key={step} className="flex items-center">
              <div className="flex flex-col items-center">
                <div
                  className={`w-10 h-10 rounded-full flex items-center justify-center text-sm font-semibold transition-all duration-300 ${
                    index <= currentIndex
                      ? "bg-blue-600 text-white shadow-md"
                      : "bg-white text-gray-400 border-2 border-gray-200"
                  }`}
                >
                  {index + 1}
                </div>
                <span
                  className={`text-xs mt-2 font-medium transition-colors ${
                    index <= currentIndex ? "text-blue-600" : "text-gray-400"
                  }`}
                >
                  {stepLabels[index]}
                </span>
              </div>
              {index < steps.length - 1 && (
                <div
                  className={`w-16 h-0.5 mx-4 transition-colors ${
                    index < currentIndex ? "bg-blue-600" : "bg-gray-200"
                  }`}
                />
              )}
            </div>
          ))}
        </div>
      </div>
    );
  };

  // Step 1: Link input and extraction/manual entry
  const renderLinkInput = () => (
    <Card className="bg-white shadow-sm border border-gray-200">
      <CardHeader className="bg-gradient-to-r from-blue-600 to-blue-700 text-white">
        <CardTitle className="flex items-center gap-3 text-xl font-semibold">
          <LinkIcon className="h-6 w-6" />
          Nhập link sản phẩm
        </CardTitle>
      </CardHeader>
      <CardContent className="p-6 space-y-6">
        {productLinks.map((item, index) => (
          <div
            key={index}
            className="border border-gray-200 rounded-lg p-4 bg-gray-50 space-y-4"
          >
            <div className="flex gap-3 items-center">
              <div className="flex-1">
                <Label className="text-sm font-medium text-gray-700 mb-2 block">
                  Link sản phẩm {index + 1}{" "}
                  <span className="text-red-500">*</span>
                </Label>
                <Input
                  value={item.link}
                  onChange={(e) => updateProductLink(index, e.target.value)}
                  placeholder="https://amazon.com/product/... hoặc https://shopee.com/..."
                  className="h-10 border-gray-300 focus:border-blue-500 focus:ring-1 focus:ring-blue-500"
                />
              </div>
              {productLinks.length > 1 && (
                <Button
                  type="button"
                  variant="outline"
                  size="sm"
                  onClick={() => removeProductLink(index)}
                  className="mt-6 text-red-600 hover:text-red-700 hover:bg-red-50 border-red-300"
                >
                  <X className="h-4 w-4" />
                </Button>
              )}
            </div>

            <div className="flex gap-3 items-center">
              <Button
                type="button"
                size="sm"
                variant="default"
                disabled={!item.link.trim() || item.status === "extracting"}
                onClick={() => handleExtract(index)}
                className="bg-blue-600 hover:bg-blue-700"
              >
                {item.status === "extracting" ? (
                  <>
                    <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                    Đang trích xuất...
                  </>
                ) : (
                  <>
                    <ExternalLink className="h-4 w-4 mr-2" />
                    Trích xuất tự động
                  </>
                )}
              </Button>
              <Button
                type="button"
                size="sm"
                variant="outline"
                disabled={item.status === "extracting"}
                onClick={() => handleManualEntry(index)}
                className="border-blue-300 text-blue-600 hover:bg-blue-50"
              >
                Nhập thủ công
              </Button>

              {item.status === "failed" && (
                <span className="text-xs text-red-600 font-medium">
                  ❌ Trích xuất thất bại
                </span>
              )}
              {item.status === "success" && (
                <span className="text-xs text-green-600 font-medium">
                  ✅ Trích xuất thành công
                </span>
              )}
              {item.status === "manual" && (
                <span className="text-xs text-blue-600 font-medium">
                  ✏️ Nhập thủ công
                </span>
              )}
            </div>
            {console.log(item)}
            {(item.status === "success" ||
              item.status === "failed" ||
              item.status === "manual" ||
              item.product) && (
              <ItemForm
                initialItem={item.product}
                index={index}
                onChange={(updatedProduct) => {
                  const newLinks = [...productLinks];
                  newLinks[index].product = updatedProduct;
                  setProductLinks(newLinks);
                }}
              />
            )}
          </div>
        ))}

        <Button
          type="button"
          variant="outline"
          onClick={addProductLink}
          className="w-full h-12 border-dashed border-2 border-blue-300 text-blue-600 hover:bg-blue-50"
        >
          <Plus className="h-4 w-4 mr-2" />
          Thêm link sản phẩm khác
        </Button>

        <div className="flex gap-3 pt-6 border-t border-gray-100">
          <Button
            variant="outline"
            onClick={handleBackToSelection}
            className="flex-1 h-10 border-gray-300 text-gray-700 hover:bg-gray-50"
          >
            <ArrowLeft className="h-4 w-4 mr-2" />
            Quay lại
          </Button>
          <Button
            onClick={() => setCurrentStep("confirmation")}
            className="flex-1 h-10 bg-gradient-to-r from-blue-600 to-blue-700 hover:from-blue-700 hover:to-blue-800"
            disabled={!canContinue}
          >
            Tiếp tục
            <ArrowRight className="h-4 w-4 ml-2" />
          </Button>
        </div>
      </CardContent>
    </Card>
  );

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="max-w-4xl mx-auto px-4 py-6 space-y-6">
        {renderBreadcrumb()}

        <div className="text-center space-y-2 mb-8">
          <h1 className="text-2xl font-bold text-gray-900">
            Yêu cầu mua hàng có link sản phẩm
          </h1>
          <p className="text-gray-600 max-w-xl mx-auto">
            Nhập link sản phẩm để trích xuất thông tin tự động hoặc nhập thông
            tin thủ công
          </p>
        </div>

        {renderStepIndicator()}

        {currentStep === "linkInput" && renderLinkInput()}
        {currentStep === "confirmation" && (
          <RequestConfirmation
            items={productLinks.map((p) => p.product).filter(Boolean)}
            type="with-link"
            onNext={handleSuccess}
            onBack={() => setCurrentStep("linkInput")}
            setShippingAddressId={setShippingAddressId}
            shippingAddressId={shippingAddressId}
          />
        )}
        {currentStep === "success" && (
          <RequestSuccess
            onClose={() => navigate("/")}
            purchaseData={purchaseData}
          />
        )}
      </div>
    </div>
  );
}
