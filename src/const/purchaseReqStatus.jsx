export const REQUEST_STATUS = {
  DRAFT: "draft",
  SENT: "sent",
  PROCESSING: "processing",
  COMPLETED: "completed",
  CANCELLED: "cancelled",
}

export const REQUEST_TYPE = {
  WITH_LINK: "with-link",
  WITHOUT_LINK: "without-link",
}

export const EXTRACTION_STATUS = {
  PENDING: "pending",
  SUCCESS: "success",
  FAILED: "failed",
  MANUAL: "manual",
}

export const SUPPORTED_PLATFORMS = [
  "Shopee",
  "Tiki",
  "Lazada",
  "Amazon",
  "eBay",
  "AliExpress",
  "Taobao",
  "1688",
  "Walmart",
  "Target",
  "Best Buy",
  "Etsy",
]

export const createEmptyShopInfo = () => ({
  name: "",
  address: "",
  email: "",
  website: "",
})

export const createEmptyProduct = () => ({
  id: "",
  name: "",
  image: "",
  quantity: 1,
  color: "",
  size: "",
  description: "",
  link: "",
  extractionStatus: EXTRACTION_STATUS.MANUAL,
})

export const createEmptyRequest = () => ({
  id: "",
  type: "",
  shopInfo: null,
  products: [],
  contactInfo: {
    email: "",
    phone: "",
  },
  shippingAddressId: "",
  status: REQUEST_STATUS.DRAFT,
  createdAt: new Date(),
  updatedAt: new Date(),
  totalProducts: 0,
})
