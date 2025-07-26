import { createSlice } from '@reduxjs/toolkit';

const initialState = {
  // Structure: { [subRequestId]: { itemDetails: [], note: '', shippingEstimate: '', expanded: false } }
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
      };
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
  resetQuotationState,
} = quotationSlice.actions;

export default quotationSlice.reducer;
