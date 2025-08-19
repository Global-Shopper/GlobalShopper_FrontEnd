import { createSlice, createSelector } from '@reduxjs/toolkit';
import { uploadToCloudinary } from '@/utils/uploadToCloudinary';

// Initial state
const initialState = {
  items: [
    {
      id: (() => `item_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`)(),
      link: '',
      status: 'idle',
      product: {
        localImages: [],
        name: '',
        description: '',
        quantity: 1,
        variants: [],
        variantRows: [],
        images: [],
        link: '',
        ecommercePlatform: '',
      },
    },
  ],
  currentStep: 'linkInput', // 'linkInput' | 'confirmation' | 'success'
  shippingAddressId: null,
  status: 'idle', // 'idle' | 'loading' | 'succeeded' | 'failed'
  error: null,
  currentRequestId: null,
};

// Helper function to generate a unique ID
const generateId = () => `item_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;

// Helper to extract the ecommerce platform/provider from a URL (hostname)
const extractHost = (url) => {
  try {
    const u = new URL(url);
    return u.hostname || '';
  } catch {
    return '';
  }
};

// Map extension products to internal item structure
const mapExtensionProductsToItems = (products = []) => {
  return products.map((p) => ({
    id: generateId(),
    link: p?.url || '',
    status: 'idle',
    product: {
      localImages: [],
      name: p?.name || '',
      description: '',
      quantity: 1,
      variants: [],
      variantRows: [],
      images: p?.mainImage ? [p.mainImage] : [],
      link: p?.url || '',
      ecommercePlatform: extractHost(p?.url || ''),
    },
  }));
};


const onlineReqSlice = createSlice({
  name: 'onlineReq',
  initialState,
  reducers: {
    // Add a new item link
    addItemLink: (state) => {
      state.items.push({
        id: generateId(),
        link: '',
        status: 'idle', // 'idle' | 'extracting' | 'success' | 'failed' | 'manual'
        product: {
          localImages: [],
          name: '',
          description: '',
          quantity: 1,
          variants: [],
          variantRows: [],
          images: [],
          link: '',
          ecommercePlatform: '',
        },
      });
    },
    
    // Remove an item link
    removeItemLink: (state, action) => {
      state.items = state.items.filter((_, i) => i !== action.payload);
    },
    
    // Update an item link
    updateItemLink: (state, action) => {
      const { index, link } = action.payload;
      if (state.items[index]) {
        state.items[index].link = link;
        state.items[index].product.link = link;
      }
    },
    
    // Update product field
    updateProductField: (state, action) => {
      const { index, field, value } = action.payload;
      if (state.items[index]?.product) {
        state.items[index].product[field] = value;
      }
    },
    // Update multiple product fields at once
    updateProductFields: (state, action) => {
      const { index, fields } = action.payload;
      if (state.items[index]?.product && typeof fields === 'object') {
        Object.entries(fields).forEach(([key, value]) => {
          state.items[index].product[key] = value;
        });
      }
    },
    
    // Update variant row
    updateVariantRow: (state, action) => {
      const { itemIndex, variantIndex, changes } = action.payload;
      if (state.items[itemIndex]?.product?.variantRows[variantIndex]) {
        state.items[itemIndex].product.variantRows[variantIndex] = {
          ...state.items[itemIndex].product.variantRows[variantIndex],
          ...changes,
        };
      }
    },
    
    // Add variant row
    addVariantRow: (state, action) => {
      const { itemIndex, fieldType } = action.payload;
      if (state.items[itemIndex]?.product) {
        const newVariant = {
          attributeName: fieldType === 'Khác' ? '' : fieldType,
          fieldValue: '',
        };
        state.items[itemIndex].product.variantRows.push(newVariant);
        
        // Also update the variants array if needed
        if (fieldType !== 'Khác' && !state.items[itemIndex].product.variants.includes(fieldType)) {
          state.items[itemIndex].product.variants.push(fieldType);
        }
      }
    },
    
    // Remove variant row
    removeVariantRow: (state, action) => {
      const { itemIndex, variantIndex } = action.payload;
      if (state.items[itemIndex]?.product?.variantRows[variantIndex]) {
        // Remove from variantRows
        state.items[itemIndex].product.variantRows = state.items[itemIndex].product.variantRows.filter(
          (_, i) => i !== variantIndex
        );
        
        // Also update the variants array if needed
        // This is a simplified version - you might need to adjust based on your needs
        state.items[itemIndex].product.variants = [
          ...new Set(state.items[itemIndex].product.variantRows.map(v => v.attributeName))
        ].filter(Boolean);
      }
    },
    
    // Add image URL
    addImageUrl: (state, action) => {
      const { itemIndex, url } = action.payload;
      if (state.items[itemIndex]?.product) {
        state.items[itemIndex].product.images.push(url);
      }
    },
    
    // Remove image URL
    removeImageUrl: (state, action) => {
      const { itemIndex, imageIndex } = action.payload;
      if (state.items[itemIndex]?.product?.images[imageIndex]) {
        state.items[itemIndex].product.images = state.items[itemIndex].product.images.filter(
          (_, i) => i !== imageIndex
        );
      }
    },
    
    // Set shipping address
    setShippingAddressId: (state, action) => {
      state.shippingAddressId = action.payload;
    },
    
    // Set current step
    setCurrentStep: (state, action) => {
      state.currentStep = action.payload;
    },
    
    // Merge items using payload from the browser extension
    setItemsFromExtension: (state, action) => {
      const products = Array.isArray(action.payload) ? action.payload : [];
      if (products.length === 0) return; // do nothing if empty
      const mapped = mapExtensionProductsToItems(products);
      state.items = [...mapped];
    },

    // Reset the state
    resetOnlRequest: () => initialState,
  },

});

// Export actions
export const {
  addItemLink,
  removeItemLink,
  updateItemLink,
  updateProductField,
  updateProductFields,
  updateVariantRow,
  addVariantRow,
  removeVariantRow,
  addImageUrl,
  removeImageUrl,
  setShippingAddressId,
  setCurrentStep,
  setItemsFromExtension,
  resetOnlRequest,
} = onlineReqSlice.actions;

// Selectors
export const selectAllItems = (state) => state?.rootReducer?.onlineReq?.items;
export const selectCurrentStep = (state) => state?.rootReducer?.onlineReq?.currentStep;
export const selectShippingAddressId = (state) => state?.rootReducer?.onlineReq?.shippingAddressId;
export const selectRequestStatus = (state) => state?.rootReducer?.onlineReq?.status;
export const selectRequestError = (state) => state?.rootReducer?.onlineReq?.error;

export const selectItemById = (state, itemId) =>
  state?.rootReducer?.onlineReq?.items?.find(item => item.id === itemId);

export const selectCanProceedToConfirmation = createSelector(
  [selectAllItems],
  (items) => {
    return items.length > 0 && items.every(
      item => item.product && item.product.name.trim()
    );
  }
);

// Export the reducer
export default onlineReqSlice.reducer;

// Helper function to upload images and update state
export const uploadImages = (files, itemIndex) => async (dispatch) => {
  const uploadedUrls = [];
  for (const file of files) {
    if (!file.type.startsWith('image/')) {
      throw new Error('Please select an image file');
    }
    if (file.size > 10 * 1024 * 1024) {
      throw new Error('File size should not exceed 10MB');
    }
    // Upload to Cloudinary
    const url = await uploadToCloudinary(file);
    if (url) {
      uploadedUrls.push(url);
      dispatch(addImageUrl({ itemIndex, url }));
    }
  }
  return uploadedUrls;
};