import { useNavigate } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import {
  addItemLink,
  removeItemLink,
  updateItemLink,
  updateProductField,
  updateProductFields,
  setCurrentStep,
  selectAllItems,
  selectCurrentStep,
  selectShippingAddressId,
} from "@/features/onlineReq";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
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
  ArrowRight,
  ArrowLeft,
  Home,
  ExternalLink,
} from "lucide-react";
import AIBotLoader from "@/components/ui/AIBotLoader";
import RequestConfirmation from "../RequestConfirmation";
import RequestSuccess from "../RequestSuccess";
import {
  useLazyGetRawDataQuery,
  useCreateWithLinkPurchaseRequestMutation,
} from "@/services/gshopApi";
import { toast } from "sonner";
import ItemExtractForm from "./ItemExtractForm";
import { useEffect, useState } from "react";
import ExtractPreviewModal from "@/components/ExtractPreviewModal";
import { resetAllPurchaseReq } from "@/features/purchaseReq.action";


export default function WithLinkWorkflowPage() {
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const [getRawData, { isFetching: isFetchingGetRawData }] = useLazyGetRawDataQuery();
  const [createPurchaseRequest, { data: purchaseData }] = useCreateWithLinkPurchaseRequestMutation();

  const itemLinks = useSelector(selectAllItems);
  const currentStep = useSelector(selectCurrentStep);
  const shippingAddressId = useSelector(selectShippingAddressId);

  // --- New preview state for extraction ---
  const [previewIndex, setPreviewIndex] = useState(null);
  const [previewProduct, setPreviewProduct] = useState(null);
  const [previewOpen, setPreviewOpen] = useState(false);

  // Remove a product link
  const handleRemoveItemLink = (index) => {
    dispatch(removeItemLink(index));
  };

  // Update the value of a product link
  const handleUpdateItemLink = (index, value) => {
    dispatch(updateItemLink({ index, link: value }));
  };

  // Extract product data from API (now previews before applying)
  const handleExtract = async (index) => {
    dispatch(updateItemLink({ index, link: itemLinks[index].link }));
    dispatch(updateProductField({ index, field: "status", value: "extracting" }));
    try {
      const rawData = await getRawData({ link: itemLinks[index].link }).unwrap();
      const isEmptyData =
        !rawData ||
        Object.keys(rawData).length === 0 ||
        (!rawData.name && !rawData.description && (!rawData.variants || rawData.variants.length === 0));
      if (isEmptyData) {
        dispatch(updateProductField({
          index,
          field: "product",
          value: {
            name: "",
            description: "",
            quantity: 1,
            variants: [],
            variantRows: [],
            images: [],
            link: itemLinks[index].link,
            id: `product_${Date.now()}_${index}`,
          },
        }));
        dispatch(updateProductField({ index, field: "status", value: "failed" }));
        toast.error("Không thể trích xuất thông tin từ link này. Vui lòng nhập thông tin thủ công.");
      } else {
        const variantRows = (rawData?.variants || []).map((variant) => ({
          attributeName: variant,
          fieldValue: "",
        }));
        // Instead of dispatching, show preview modal
        setPreviewProduct({
          name: rawData?.name || "",
          description: rawData?.description || "",
          quantity: 1,
          variants: rawData?.variants || [],
          variantRows,
          images: rawData?.images || [],
          link: itemLinks[index].link,
          id: `product_${Date.now()}_${index}`,
        });
        setPreviewIndex(index);
        setPreviewOpen(true);
        dispatch(updateProductField({ index, field: "status", value: "success" }));
      }
    } catch {
      dispatch(updateProductFields({
        index,
        fields: {
          name: "",
          description: "",
          quantity: 1,
          variants: [],
          variantRows: [],
          images: [],
          link: itemLinks[index].link,
          id: `product_${Date.now()}_${index}`,
        },
      }));
      dispatch(updateProductField({ index, field: "status", value: "failed" }));
      toast.error("Trích xuất thất bại. Vui lòng nhập thông tin thủ công.");
    }
  };

  // Handler for applying previewed product to form
  const handleApplyExtracted = () => {
    if (previewIndex !== null && previewProduct) {
      dispatch(updateProductFields({ index: previewIndex, fields: previewProduct }));
      toast.success("Đã áp dụng thông tin sản phẩm vào form!");
    }
    setPreviewOpen(false);
    setPreviewIndex(null);
    setPreviewProduct(null);
  };

  // Handler for discarding preview
  const handleClosePreview = () => {
    setPreviewOpen(false);
    setPreviewIndex(null);
    setPreviewProduct(null);
  };

  const canContinue =
    itemLinks?.length > 0 &&
    itemLinks.every((p) => p.product && p.product.name?.trim());

  // Handle success
  const handleSuccess = () => {
    if (!shippingAddressId) {
      toast.error("Vui lòng chọn địa chỉ giao hàng trước khi gửi yêu cầu.");
      return;
    }
    const requestItems = itemLinks.map((p) => p.product).filter(Boolean);
    console.log(requestItems)
    createPurchaseRequest({
      shippingAddressId,
      requestItems: requestItems.map((item) => ({
        productName: item?.name,
        productURL: item?.link,
        variants: item?.variantRows?.map((variant) => `${variant?.attributeName}: ${variant?.fieldValue}`),
        images: item?.images,
        quantity: item?.quantity,
        description: item?.description,
      })),
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
      })
      .finally(() => {
        dispatch(setCurrentStep("success"));
      });
  };

  useEffect(() => {
    dispatch(resetAllPurchaseReq());
  }, [dispatch]);

  // Step navigation
  const handleBackToSelection = () => navigate("/create-request");
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
                  className={`w-10 h-10 rounded-full flex items-center justify-center text-sm font-semibold transition-all duration-300 ${index <= currentIndex
                      ? "bg-blue-600 text-white shadow-md"
                      : "bg-white text-gray-400 border-2 border-gray-200"
                    }`}
                >
                  {index + 1}
                </div>
                <span
                  className={`text-xs mt-2 font-medium transition-colors ${index <= currentIndex ? "text-blue-600" : "text-gray-400"
                    }`}
                >
                  {stepLabels[index]}
                </span>
              </div>
              {index < steps.length - 1 && (
                <div
                  className={`w-16 h-0.5 mx-4 transition-colors ${index < currentIndex ? "bg-blue-600" : "bg-gray-200"
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
        {itemLinks.map((item, index) => (
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
                  onChange={(e) => handleUpdateItemLink(index, e.target.value)}
                  placeholder="https://amazon.com/product/... hoặc https://shopee.com/..."
                  className="h-10 border-gray-300 focus:border-blue-500 focus:ring-1 focus:ring-blue-500"
                />
              </div>
              {itemLinks.length > 1 && (
                <Button
                  type="button"
                  variant="outline"
                  size="sm"
                  onClick={() => handleRemoveItemLink(index)}
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
                disabled={!item.link.trim() || isFetchingGetRawData}
                onClick={() => handleExtract(index)}
                className="bg-blue-600 hover:bg-blue-700"
              >
                {isFetchingGetRawData ? (
                  <>
                    <AIBotLoader />
                    Đang trích xuất...
                  </>
                ) : (
                  <>
                    <ExternalLink className="h-4 w-4 mr-2" />
                    Trích xuất tự động
                  </>
                )}
              </Button>

              {item.status === "failed" && (
                <span className="text-xs text-red-600 font-medium">
                  ❌ Trích xuất thất bại
                </span>
              )}
              {item.status === "success" && (
                <span className="text-xs text-green-600 font-medium">
                  ✅ Điền tự động bởi AI
                </span>
              )}
            </div>
            {(item.status === "success" ||
              item.status === "failed" ||
              item.product) && (
                <ItemExtractForm index={index} />
              )}
          </div>
        ))}
        {/* Extraction Preview Modal */}
        <div className="space-0">
          <ExtractPreviewModal
            open={previewOpen}
            onClose={handleClosePreview}
            onApply={handleApplyExtracted}
            product={previewProduct}
          />
        </div>

        <Button
          type="button"
          variant="outline"
          onClick={() => dispatch(addItemLink())}
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
            onClick={() => dispatch(setCurrentStep("confirmation"))}
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
            type="online"
            onNext={handleSuccess}
            onBack={() => dispatch(setCurrentStep("linkInput"))}
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
