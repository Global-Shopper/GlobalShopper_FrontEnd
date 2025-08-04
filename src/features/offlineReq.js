import { createSlice, nanoid } from "@reduxjs/toolkit";

const initialState = {
  shopInfo: {
    name: "",
    email: "",
    address: "",
    website: "",
  },
  currentItemDraft: {
    productName: "",
    quantity: 1,
    productURL: "",
    description: "",
    localImages: [],
    images: [],
    variantRows: [], // [{fieldType, customFieldName, fieldValue}]
  },
  items: [], // submitted items
  currentStep: "contactInfo", // "contactInfo" | "requestItems" | "confirmation" | "success"
  shippingAddressId: null,
  status: "idle",
  error: null,
};

const offlineReqSlice = createSlice({
  name: "offlineReq",
  initialState,
  reducers: {
    setShopInfoField(state, action) {
      const { field, value } = action.payload;
      state.shopInfo[field] = value;
    },
    setCurrentStep(state, action) {
      state.currentStep = action.payload;
    },
    setShippingAddressId(state, action) {
      state.shippingAddressId = action.payload;
    },
    setCurrentItemDraftField(state, action) {
      const { field, value } = action.payload;
      state.currentItemDraft[field] = value;
    },
    addDraftImage(state, action) {
      state.currentItemDraft.images.push(action.payload);
    },
    removeDraftImage(state, action) {
      state.currentItemDraft.images.splice(action.payload, 1);
    },
    setDraftVariantRows(state, action) {
      state.currentItemDraft.variantRows = action.payload;
    },
    addDraftVariantRow(state, action) {
      state.currentItemDraft.variantRows.push(action.payload);
    },
    updateDraftVariantRow(state, action) {
      const { index, changes } = action.payload;
      Object.assign(state.currentItemDraft.variantRows[index], changes);
    },
    removeDraftVariantRow(state, action) {
      state.currentItemDraft.variantRows.splice(action.payload, 1);
    },
    resetCurrentItemDraft(state) {
      state.currentItemDraft = {
        productName: "",
        quantity: 1,
        productURL: "",
        description: "",
        localImages: [],
        images: [],
        variantRows: [],
      };
    },
    addDraftLocalImage(state, action) {
      state.currentItemDraft.localImages.push(action.payload);
    },
    removeDraftLocalImage(state, action) {
      state.currentItemDraft.localImages.splice(action.payload, 1);
    },
    resetDraftLocalImages(state) {
      state.currentItemDraft.localImages = [];
    },
    setDraftLocalImages(state, action) {
      state.currentItemDraft.localImages = action.payload;
    },
    addItem(state) {
      const item = {
        ...state.currentItemDraft,
        id: nanoid(),
      };
      state.items.push(item);
    },
    removeItem(state, action) {
      state.items = state.items.filter((item) => item.id !== action.payload);
    },
    updateItem(state, action) {
      const { id, changes } = action.payload;
      const idx = state.items.findIndex((item) => item.id === id);
      if (idx !== -1) {
        Object.assign(state.items[idx], changes);
      }
    },
    resetOfflineRequest() {
      return initialState;
    },
    setStatus(state, action) {
      state.status = action.payload;
    },
    setError(state, action) {
      state.error = action.payload;
    },
  },
});

export const {
  setShopInfoField,
  setCurrentStep,
  setShippingAddressId,
  setCurrentItemDraftField,
  addDraftImage,
  removeDraftImage,
  setDraftVariantRows,
  addDraftVariantRow,
  updateDraftVariantRow,
  removeDraftVariantRow,
  resetCurrentItemDraft,
  addDraftLocalImage,
  removeDraftLocalImage,
  resetDraftLocalImages,
  setDraftLocalImages,
  addItem,
  removeItem,
  updateItem,
  resetOfflineRequest,
  setStatus,
  setError,
} = offlineReqSlice.actions;

// Selectors
export const selectShopInfo = (state) => state.rootReducer?.offlineReq?.shopInfo;
export const selectCurrentItemDraft = (state) => state.rootReducer?.offlineReq?.currentItemDraft;
export const selectAllItems = (state) => state.rootReducer?.offlineReq?.items;
export const selectCurrentStep = (state) => state.rootReducer?.offlineReq?.currentStep;
export const selectShippingAddressId = (state) => state.rootReducer?.offlineReq?.shippingAddressId;
export const selectOfflineReqStatus = (state) => state.rootReducer?.offlineReq?.status;
export const selectOfflineReqError = (state) => state.rootReducer?.offlineReq?.error;

export default offlineReqSlice.reducer;
