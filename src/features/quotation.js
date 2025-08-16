import { createSlice } from '@reduxjs/toolkit';

/**
 subRequests: {
  [subRequestId]: {
    // item-level editable fields (per request item)
    quotationDetails: [],
    // group-level fields
    note: '',
    shippingEstimate: '',
    currency: 'VND', // moved from item-level to group-level
    region: '',      // moved from item-level to group-level (OFFLINE only)
    expanded: false,
    expandedProductForms: {
      [requestItemId]: true | false
    }
  },
  ...
}
 */
const initialState = {
  subRequests: {},
};

const quotationSlice = createSlice({
  name: 'quotation',
  initialState,
  reducers: {
    setItemDetail(state, action) {
      const { subRequestId, itemIndex, field, value } = action.payload;
      if (!state.subRequests[subRequestId]) return;
      state.subRequests[subRequestId].quotationDetails[itemIndex][field] = value;
    },
    setGroupNote(state, action) {
      const { subRequestId, note } = action.payload;
      if (!state.subRequests[subRequestId]) return;
      state.subRequests[subRequestId].note = note;
    },
    setShippingEstimate(state, action) {
      const { subRequestId, shippingEstimate } = action.payload;
      if (!state.subRequests[subRequestId]) return;
      state.subRequests[subRequestId].shippingEstimate = shippingEstimate;
    },
    setGroupCurrency(state, action) {
      const { subRequestId, currency } = action.payload;
      if (!state.subRequests[subRequestId]) return;
      state.subRequests[subRequestId].currency = currency;
    },
    setGroupRegion(state, action) {
      const { subRequestId, region } = action.payload;
      if (!state.subRequests[subRequestId]) return;
      state.subRequests[subRequestId].region = region;
    },
    toggleExpandQuotation(state, action) {
      const { subRequestId } = action.payload;
      if (!state.subRequests[subRequestId]) return;
      state.subRequests[subRequestId].expanded = !state.subRequests[subRequestId].expanded;
    },
    initializeSubRequest(state, action) {
      // Should be called when subrequests are loaded
      const { subRequestId, quotationDetails } = action.payload;
      state.subRequests[subRequestId] = {
        quotationDetails: quotationDetails || [],
        note: '',
        shippingEstimate: '',
        currency: 'VND',
        region: '',
        expanded: false,
        expandedProductForms: {},
      };
    },
    toggleExpandProductQuotation(state, action) {
      const { subRequestId, requestItemId } = action.payload;
      if (subRequestId) {
        if (!state.subRequests[subRequestId]) return;
        const current = state.subRequests[subRequestId].expandedProductForms[requestItemId];
        state.subRequests[subRequestId].expandedProductForms[requestItemId] = !current;
      } else {
        // For main request items, store at root level
        if (!state.expandedProductForms) state.expandedProductForms = {};
        const current = state.expandedProductForms[requestItemId];
        state.expandedProductForms[requestItemId] = !current;
      }
    },
    resetQuotationById(state, action) {
      const { subRequestId } = action.payload;
      if (!state.subRequests[subRequestId]) return;
      state.subRequests[subRequestId] = {};
    },
    resetQuotationState(state) {
      state.subRequests = {};
    },
  },
});

export const {
  setItemDetail,
  setGroupNote,
  setShippingEstimate,
  setGroupCurrency,
  setGroupRegion,
  toggleExpandQuotation,
  initializeSubRequest,
  resetQuotationById,
  resetQuotationState,
  toggleExpandProductQuotation,
} = quotationSlice.actions;

export default quotationSlice.reducer;
