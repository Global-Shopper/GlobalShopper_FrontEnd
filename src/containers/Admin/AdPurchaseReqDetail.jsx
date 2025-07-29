import { useState } from "react";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Badge } from "@/components/ui/badge";
import { X, Plus } from "lucide-react";
import { useParams } from "react-router-dom";
import { useGetPurchaseRequestDetailQuery } from "@/services/gshopApi";
import PageLoading from "@/components/PageLoading";
import { toast } from "sonner";
import { getStatusText } from "@/utils/statusHandler";
import React from "react";
import { PurchaseRequestHeader } from "./PurchaseRequestHeader";
import { CustomerInfoCard } from "./CustomerInfoCard";
import { ProductDetail } from "./ProductDetail";
import { NotesSection } from "./NotesSection";
import { ProductList } from "./ProductList";

const getStatusColor = (status) => {
  switch (status) {
    case "SENT":
      return "bg-blue-100 text-blue-800 border-blue-200";
    case "PENDING":
      return "bg-yellow-100 text-yellow-800 border-yellow-200";
    case "APPROVED":
      return "bg-green-100 text-green-800 border-green-200";
    case "REJECTED":
      return "bg-red-100 text-red-800 border-red-200";
    default:
      return "bg-gray-100 text-gray-800 border-gray-200";
  }
};

const formatDate = (timestamp) => {
  return new Date(timestamp).toLocaleDateString("vi-VN", {
    year: "numeric",
    month: "short",
    day: "numeric",
    hour: "2-digit",
    minute: "2-digit",
  });
};

const formatCurrency = (amount) => {
  return new Intl.NumberFormat("vi-VN", {
    style: "currency",
    currency: "VND",
  }).format(amount);
};

// Mock API functions - replace with actual API calls
const requestCustomerUpdate = async () => {
  console.log("first");
};

function AdPurchaseReqDetail() {
  const { id } = useParams();
  const {
    data: req,
    isLoading: isReqLoading,
    isError: isRequestError,
  } = useGetPurchaseRequestDetailQuery(id);
  const [selectedProductId, setSelectedProductId] = useState(undefined);
  const [quotePrices, setQuotePrices] = useState({});
  const [notes, setNotes] = useState("");
  const [expandedSubRequest, setExpandedSubRequest] = useState(null);
  const [showCreateGroupModal, setShowCreateGroupModal] = useState(false);

  // Enhanced form state
  const [formData, setFormData] = useState({
    seller: "",
    ecommercePlatform: "",
    contactInfo: [],
    customSeller: "",
    customPlatform: "",
  });
  const [formErrors, setFormErrors] = useState({});
  const [newContactInfo, setNewContactInfo] = useState("");

  const [isRequestingUpdate, setIsRequestingUpdate] = useState(false);
  const [updateRequested, setUpdateRequested] = useState(false);
  const [isGroupingMode, setIsGroupingMode] = useState(false);
  const [selectedItemsForGroup, setSelectedItemsForGroup] = useState([]);

  const selectedProduct = React.useMemo(() => {
    if (req?.requestItems?.length > 0) {
      const selectItem = req.requestItems.find(
        (item) => item.id === selectedProductId
      );
      console.log(selectItem);
      if (selectItem) return selectItem;
    }

    if (req?.subRequests?.length > 0) {
      console.log(
        "Checking subrequests for selected product ID:",
        selectedProductId
      );
      for (const subReq of req.subRequests) {
        const selectItem = subReq.requestItems.find(
          (item) => item.id === selectedProductId
        );
        if (selectItem) return selectItem;
      }
    }

    return undefined;
  }, [req, selectedProductId]);

  const handlePriceChange = (productId, price) => {
    setQuotePrices((prev) => ({
      ...prev,
      [productId]: price,
    }));
  };

  const handleProductClick = (productId) => {
    setSelectedProductId(productId);
  };

  const toggleSubRequestExpansion = (subRequestIndex) => {
    setExpandedSubRequest(
      expandedSubRequest === subRequestIndex ? null : subRequestIndex
    );
  };

  const handleCreateGroup = (items = []) => {
    if (items.length > 0) {
      setSelectedItemsForGroup(items);
      setShowCreateGroupModal(true);
      setIsGroupingMode(false); // Exit selection mode after creating group
    } else {
      // Toggle selection mode
      setIsGroupingMode(!isGroupingMode);
    }
  };

  const handleRequestCustomerUpdate = async () => {
    setIsRequestingUpdate(true);
    try {
      await requestCustomerUpdate(req.id);
      setUpdateRequested(true);
    } catch (error) {
      toast.error(`Lỗi khi gửi yêu cầu cập nhật: ${error.message}`);
    } finally {
      setIsRequestingUpdate(false);
    }
  };

  // Form validation
  const validateForm = () => {
    const errors = {};

    // Validate seller
    const finalSeller =
      formData.seller === "Other" ? formData.customSeller : formData.seller;
    if (!finalSeller?.trim()) {
      errors.seller = "Seller is required";
    }

    // Validate platform
    const finalPlatform =
      formData.ecommercePlatform === "Other"
        ? formData.customPlatform
        : formData.ecommercePlatform;
    if (!finalPlatform?.trim()) {
      errors.ecommercePlatform = "Platform is required";
    }

    // Validate contact info
    if (formData.contactInfo.length === 0) {
      errors.contactInfo = "At least one contact info is required";
    }

    setFormErrors(errors);
    return Object.keys(errors).length === 0;
  };

  // Reset form
  const resetForm = () => {
    setFormData({
      seller: "",
      ecommercePlatform: "",
      contactInfo: [],
      customSeller: "",
      customPlatform: "",
    });
    setFormErrors({});
    setNewContactInfo("");
  };

  // Handle form field changes

  // Handle contact info

  const handleExitGroupingMode = () => {
    setIsGroupingMode(false);
  };

  if (isReqLoading) {
    return <PageLoading />;
  }

  if (isRequestError || !req) {
    return (
      <div className="min-h-screen flex items-center justify-center text-lg text-red-600">
        Không thể tải dữ liệu yêu cầu.
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50/30">
      <div className="max-w-7xl mx-auto p-6 space-y-6">
        {/* Header */}
        <PurchaseRequestHeader
          requestId={req.id}
          status={req.status}
          requestType={req.requestType}
          adminName={req?.admin?.name}
          createdAt={req.createdAt}
          expiredAt={req.expiredAt}
          isRequestingUpdate={isRequestingUpdate}
          updateRequested={updateRequested}
          onRequestCustomerUpdate={handleRequestCustomerUpdate}
          onCreateGroup={handleCreateGroup}
          isGroupingMode={isGroupingMode}
          getStatusColor={getStatusColor}
          getStatusText={getStatusText}
          formatDate={formatDate}
        />

        <div className="grid grid-cols-1 lg:grid-cols-7 gap-6">
          <div className="lg:col-span-3 space-y-4">
            {/* Product List */}
            <div className="h-auto overflow-y-auto">
              <ProductList
                requestItems={req.requestItems || []}
                subRequests={req.subRequests || []}
                selectedProductId={selectedProductId}
                expandedSubRequest={expandedSubRequest}
                status={req.status}
                onProductClick={handleProductClick}
                onToggleSubRequestExpansion={toggleSubRequestExpansion}
                requestType={req.requestType}
                isGroupingMode={isGroupingMode}
                onCreateGroup={handleCreateGroup}
                onExitGroupingMode={handleExitGroupingMode}
              />
            </div>
            {/* Notes */}
            <div className="h-auto overflow-y-auto">
              <NotesSection
                notes={notes}
                status={req.status}
                onNotesChange={setNotes}
              />
            </div>
          </div>

          <div className="space-y-4 grid grid-cols-5 col-span-4 gap-6">
            {/* Product Detail (sticky) */}
            {selectedProduct && (
              <div className="sticky top-4 self-start col-span-3">
                <ProductDetail
                  product={selectedProduct}
                  status={req.status}
                  quotePrice={quotePrices[selectedProduct.id] || ""}
                  onPriceChange={handlePriceChange}
                />
              </div>
            )}
            {/* Customer Info (sticky) */}
            <div className="sticky top-4 self-start col-span-2">
              <CustomerInfoCard
                customer={req.customer}
                shippingAddress={req.shippingAddress}
                formatCurrency={formatCurrency}
              />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default AdPurchaseReqDetail;
