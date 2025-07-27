import { createSlice } from '@reduxjs/toolkit';

/**
 subRequests: {
  [subRequestId]: {
    itemDetails: [],
    note: '',
    shippingEstimate: '',
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
      state.subRequests[subRequestId].itemDetails[itemIndex][field] = value;
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
    toggleExpandQuotation(state, action) {
      const { subRequestId } = action.payload;
      if (!state.subRequests[subRequestId]) return;
      state.subRequests[subRequestId].expanded = !state.subRequests[subRequestId].expanded;
    },
    initializeSubRequest(state, action) {
      // Should be called when subrequests are loaded
      const { subRequestId, itemDetails } = action.payload;
      state.subRequests[subRequestId] = {
        itemDetails: itemDetails || [],
        note: '',
        shippingEstimate: '',
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
  toggleExpandQuotation,
  initializeSubRequest,
  resetQuotationById,
  resetQuotationState,
  toggleExpandProductQuotation,
} = quotationSlice.actions;

export default quotationSlice.reducer;
