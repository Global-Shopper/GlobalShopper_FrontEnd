import { useState } from "react"
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { useParams } from "react-router-dom"
import { useCheckingPurchaseRequestMutation, useGetPurchaseRequestDetailQuery } from "@/services/gshopApi"
import PageLoading from "@/components/PageLoading"
import { toast } from "sonner"
import { getStatusText } from "@/utils/statusHandler"
import React from "react"
import { PurchaseRequestHeader } from "./PurchaseRequestHeader"
import { CustomerInfoCard } from "./CustomerInfoCard"
import { ProductDetail } from "./ProductDetail"
import { NotesSection } from "./NotesSection"
import { ProductList } from "./ProductList"

const getStatusColor = (status) => {
  switch (status) {
    case "SENT":
      return "bg-blue-100 text-blue-800 border-blue-200"
    case "PENDING":
      return "bg-yellow-100 text-yellow-800 border-yellow-200"
    case "APPROVED":
      return "bg-green-100 text-green-800 border-green-200"
    case "REJECTED":
      return "bg-red-100 text-red-800 border-red-200"
    default:
      return "bg-gray-100 text-gray-800 border-gray-200"
  }
}

const formatDate = (timestamp) => {
  return new Date(timestamp).toLocaleDateString("vi-VN", {
    year: "numeric",
    month: "short",
    day: "numeric",
    hour: "2-digit",
    minute: "2-digit",
  })
}

const formatCurrency = (amount) => {
  return new Intl.NumberFormat("vi-VN", {
    style: "currency",
    currency: "VND",
  }).format(amount)
}

// Mock API functions - replace with actual API calls
const requestCustomerUpdate = async (requestId) => {
  console.log("first")
}

function AdPurchaseReqDetail() {
  const { id } = useParams()
  const { data: req, isLoading: isReqLoading, isError: isRequestError } = useGetPurchaseRequestDetailQuery(id)
  const [selectedProductId, setSelectedProductId] = useState(undefined)
  const [quotePrices, setQuotePrices] = useState({})
  const [notes, setNotes] = useState("")
  const [selectedProducts, setSelectedProducts] = useState(new Set())
  const [expandedSubRequest, setExpandedSubRequest] = useState(null)
  const [showCreateGroupModal, setShowCreateGroupModal] = useState(false)
  const [groupSeller, setGroupSeller] = useState("")
  const [groupPlatform, setGroupPlatform] = useState("")
  const [groupAddress, setGroupAddress] = useState("")
  const [isRequestingUpdate, setIsRequestingUpdate] = useState(false)
  const [updateRequested, setUpdateRequested] = useState(false)
  const [checking, { isLoading: isCheckLoading }] = useCheckingPurchaseRequestMutation()

  const selectedProduct = React.useMemo(() => {
    if (req?.requestItems?.length > 0) {
      const selectItem = req.requestItems.find((item) => item.id === selectedProductId)
      console.log(selectItem)
      if (selectItem) return selectItem
    }
    
    if (req?.subRequests?.length > 0) {
      console.log("Checking subrequests for selected product ID:", selectedProductId)
      for (const subReq of req.subRequests) {
        const selectItem = subReq.requestItems.find((item) => item.id === selectedProductId)
        if (selectItem) return selectItem
      }
    }
    
    return undefined
  }, [req, selectedProductId])

  const handlePriceChange = (productId, price) => {
    setQuotePrices((prev) => ({
      ...prev,
      [productId]: price,
    }))
  }

  const toggleProductSelection = (productId, e) => {
    e.stopPropagation()
    setSelectedProducts((prev) => {
      const newSet = new Set(prev)
      if (newSet.has(productId)) {
        newSet.delete(productId)
      } else {
        newSet.add(productId)
      }
      return newSet
    })
  }

  const handleProductClick = (productId) => {
    setSelectedProductId(productId)
  }

  const toggleSubRequestExpansion = (subRequestIndex) => {
    setExpandedSubRequest(expandedSubRequest === subRequestIndex ? null : subRequestIndex)
  }

  const handleCreateGroup = () => {
    setShowCreateGroupModal(true)
  }

  const handleAssignToMe = async () => {
    try {
      await checking(req.id)
        .unwrap()
        .then(() => {
          toast.success("Yêu cầu đã được tiếp nhận thành công.")
        })
    } catch (error) {
      toast.error(`Lỗi khi tiếp nhận yêu cầu: ${error.message}`)
    }
  }

  const handleRequestCustomerUpdate = async () => {
    setIsRequestingUpdate(true)
    try {
      await requestCustomerUpdate(req.id)
      setUpdateRequested(true)
    } catch (error) {
      toast.error(`Lỗi khi gửi yêu cầu cập nhật: ${error.message}`)
    } finally {
      setIsRequestingUpdate(false)
    }
  }

  const handleCreateGroupSubmit = () => {
    /* logic here */
    setShowCreateGroupModal(false)
  }

  if (isReqLoading) {
    return <PageLoading />
  }

  if (isRequestError || !req) {
    return (
      <div className="min-h-screen flex items-center justify-center text-lg text-red-600">
        Không thể tải dữ liệu yêu cầu.
      </div>
    )
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
          isCheckLoading={isCheckLoading}
          isRequestingUpdate={isRequestingUpdate}
          updateRequested={updateRequested}
          onAssignToMe={handleAssignToMe}
          onRequestCustomerUpdate={handleRequestCustomerUpdate}
          onCreateGroup={handleCreateGroup}
          getStatusColor={getStatusColor}
          getStatusText={getStatusText}
          formatDate={formatDate}
        />

        <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
          <div className="lg:col-span-2 space-y-4">
            {/* Product List */}
            <ProductList
              requestItems={req.requestItems || []}
              subRequests={req.subRequests || []}
              selectedProductId={selectedProductId}
              selectedProducts={selectedProducts}
              expandedSubRequest={expandedSubRequest}
              status={req.status}
              onProductClick={handleProductClick}
              onToggleProductSelection={toggleProductSelection}
              onToggleSubRequestExpansion={toggleSubRequestExpansion}
              requestType={req.requestType}
            />
          </div>

          <div className="space-y-4 grid grid-cols-2 col-span-2 gap-6">
            {/* Customer Info */}
            <CustomerInfoCard
              customer={req.customer}
              shippingAddress={req.shippingAddress}
              formatCurrency={formatCurrency}
            />

            {/* Product Detail */}
            {selectedProduct && (
              <ProductDetail
                product={selectedProduct}
                status={req.status}
                quotePrice={quotePrices[selectedProduct.id] || ""}
                onPriceChange={handlePriceChange}
                formatCurrency={formatCurrency}
              />
            )}

            {/* Notes */}
            <NotesSection notes={notes} status={req.status} onNotesChange={setNotes} />
          </div>
        </div>

        {/* Create Group Modal */}
        {showCreateGroupModal && (
          <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
            <Card className="w-96 max-w-md">
              <CardHeader>
                <CardTitle>Thông tin của đơn hàng</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="space-y-2">
                  <Label>Seller</Label>
                  <Input
                    placeholder="Loreal Paris"
                    value={groupSeller}
                    onChange={(e) => setGroupSeller(e.target.value)}
                  />
                </div>
                <div className="space-y-2">
                  <Label>Platform</Label>
                  <Input
                    placeholder="Amazon"
                    value={groupPlatform}
                    onChange={(e) => setGroupPlatform(e.target.value)}
                  />
                </div>
                <div className="space-y-2">
                  <Label>Address</Label>
                  <Input placeholder="Paris" value={groupAddress} onChange={(e) => setGroupAddress(e.target.value)} />
                </div>
                <div className="flex gap-2 pt-4">
                  <Button onClick={handleCreateGroupSubmit} className="flex-1">
                    Tạo nhóm
                  </Button>
                  <Button variant="outline" onClick={() => setShowCreateGroupModal(false)}>
                    Hủy
                  </Button>
                </div>
              </CardContent>
            </Card>
          </div>
        )}
      </div>
    </div>
  )
}

export default AdPurchaseReqDetail
