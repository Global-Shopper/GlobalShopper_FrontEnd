import { useSelector, useDispatch } from "react-redux";
import { useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Store, ArrowRight, ArrowLeft, Home } from "lucide-react";
import RequestItemForm from "./RequestItemForm";
import RequestConfirmation from "../RequestConfirmation";
import RequestSuccess from "../RequestSuccess";
import { useCreateWithoutLinkPurchaseRequestMutation } from "@/services/gshopApi";
import { toast } from "sonner";
import { setCurrentStep, setShopInfoField } from "@/features/offlineReq";

export default function WithoutLinkWorkflowPage() {
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const [createPurchaseRequest, { data: purchaseData }] = useCreateWithoutLinkPurchaseRequestMutation();

  // Redux selectors
  const shopInfo = useSelector((state) => state?.rootReducer?.offlineReq?.shopInfo);
  const currentStep = useSelector((state) => state?.rootReducer?.offlineReq?.currentStep);
  const items = useSelector((state) => state?.rootReducer?.offlineReq?.items);
  const shippingAddressId = useSelector((state) => state?.rootReducer?.offlineReq?.shippingAddressId);
  // Compose contactInfo from Redux shopInfo
  const contactInfo = [
    `Tên cửa hàng: ${shopInfo?.name}`,
    shopInfo?.email ? `Email: ${shopInfo?.email}` : null,
    `Địa chỉ: ${shopInfo?.address}`,
    shopInfo?.website ? `Website: ${shopInfo?.website}` : null,
  ].filter(Boolean);
  const handleSuccess = () => {
    if (!shippingAddressId) {
      toast.error("Vui lòng chọn địa chỉ giao hàng trước khi gửi yêu cầu.");
      return;
    }
    createPurchaseRequest({
      shippingAddressId,
      contactInfo,
      requestItems: items.map((item) => ({
        productName: item?.productName,
        productURL: item?.productURL,
        variants: item?.variantRows?.map((variant) => `${variant?.fieldType}: ${variant?.fieldValue}`),
        images: item?.images,
        quantity: item?.quantity,
        description: item?.description,
        seller: shopInfo?.name,
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
      });
    dispatch(setCurrentStep("success"));
    window.scrollTo(0, 0);
  };

  const handleBackToSelection = () => {
    navigate("/create-request");
  };

  const handleBackToHome = () => {
    navigate("/");
  };

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
      <span className="font-medium text-orange-600">
        Sản phẩm nội địa quốc tế
      </span>
    </div>
  );

  const renderStepIndicator = () => {
    const steps = ["contactInfo", "requestItems", "confirmation", "success"];
    const stepLabels = [
      "Thông tin cửa hàng",
      "Thông tin sản phẩm",
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
                      ? "bg-orange-600 text-white shadow-md"
                      : "bg-white text-gray-400 border-2 border-gray-200"
                    }`}
                >
                  {index + 1}
                </div>
                <span
                  className={`text-xs mt-2 font-medium transition-colors ${index <= currentIndex ? "text-gray-900" : "text-gray-400"
                    }`}
                >
                  {stepLabels[index]}
                </span>
              </div>
              {index < steps.length - 1 && (
                <div
                  className={`w-16 h-0.5 mx-4 transition-all duration-300 ${index < currentIndex ? "bg-orange-600" : "bg-gray-200"
                    }`}
                />
              )}
            </div>
          ))}
        </div>
      </div>
    );
  };

  const renderContactInfo = () => (
    <Card className="border-0 shadow-md bg-white rounded-lg overflow-hidden">
      <CardHeader className="bg-gradient-to-r from-orange-600 to-orange-700 text-white px-6 py-4">
        <CardTitle className="flex items-center gap-3 text-lg font-semibold">
          <div className="w-7 h-7 bg-white/20 rounded-lg flex items-center justify-center">
            <Store className="h-4 w-4" />
          </div>
          Thông tin cửa hàng
        </CardTitle>
        <p className="text-orange-100 mt-1 text-sm">
          Cung cấp thông tin chi tiết về cửa hàng bạn muốn mua hàng
        </p>
      </CardHeader>
      <CardContent className="p-6 space-y-5">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
          <div className="space-y-2">
            <Label
              htmlFor="shopName"
              className="text-sm font-medium text-gray-700"
            >
              Tên cửa hàng <span className="text-red-500">*</span>
            </Label>
            <Input
              id="shopName"
              value={shopInfo.name}
              onChange={(e) => dispatch(setShopInfoField({ field: "name", value: e.target.value }))}
              placeholder="Ví dụ: Nike Store, Uniqlo, Zara..."
              className="h-10 border-gray-300 focus:border-orange-500 focus:ring-1 focus:ring-orange-500"
            />
          </div>

          <div className="space-y-2">
            <Label
              htmlFor="shopEmail"
              className="text-sm font-medium text-gray-700"
            >
              Email cửa hàng
            </Label>
            <Input
              id="shopEmail"
              type="email"
              value={shopInfo.email}
              onChange={(e) => dispatch(setShopInfoField({ field: "email", value: e.target.value }))}
              placeholder="contact@store.com"
              className="h-10 border-gray-300 focus:border-orange-500 focus:ring-1 focus:ring-orange-500"
            />
          </div>
        </div>

        <div className="space-y-2">
          <Label
            htmlFor="shopAddress"
            className="text-sm font-medium text-gray-700"
          >
            Địa chỉ cửa hàng <span className="text-red-500">*</span>
          </Label>
          <Textarea
            id="shopAddress"
            value={shopInfo.address}  
            onChange={(e) => dispatch(setShopInfoField({ field: "address", value: e.target.value }))}
            placeholder="Địa chỉ cụ thể của cửa hàng (số nhà, đường, quận/huyện, thành phố)..."
            rows={3}
            className="resize-none border-gray-300 focus:border-orange-500 focus:ring-1 focus:ring-orange-500"
          />
        </div>

        <div className="space-y-2">
          <Label
            htmlFor="shopWebsite"
            className="text-sm font-medium text-gray-700"
          >
            Link Website hoặc mạng xã hội của cửa hàng
          </Label>
          <Input
            id="shopWebsite"
            type="url"
            value={shopInfo.website}
            onChange={(e) => dispatch(setShopInfoField({ field: "website", value: e.target.value }))}
            placeholder="https://store-website.com"
            className="h-10 border-gray-300 focus:border-orange-500 focus:ring-1 focus:ring-orange-500"
          />
        </div>

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
            onClick={() => dispatch(setCurrentStep("requestItems"))}
            className="flex-1 h-10 bg-gradient-to-r from-orange-600 to-orange-700 hover:from-orange-700 hover:to-orange-800"
            disabled={!shopInfo.name || !shopInfo.address}
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
            Yêu cầu mua sản phẩm nội địa quốc tế
          </h1>
          <p className="text-gray-600 max-w-xl mx-auto">
            Cung cấp thông tin cửa hàng và sản phẩm để chúng tôi hỗ trợ bạn mua
            hàng từ các cửa hàng nước ngoài
          </p>
        </div>

        {renderStepIndicator()}

        {currentStep === "contactInfo" && renderContactInfo()}
        {currentStep === "requestItems" && (
          <RequestItemForm
            // All state is now in Redux; no need to pass items/onItemsChange
            onNext={() => dispatch(setCurrentStep("confirmation"))}
            onBack={() => dispatch(setCurrentStep("contactInfo"))}
          />
        )}
        {currentStep === "confirmation" && (
          <RequestConfirmation
            type="offline"
            onNext={handleSuccess}
            onBack={() => dispatch(setCurrentStep("requestItems"))}
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
