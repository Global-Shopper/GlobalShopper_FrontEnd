import { createSlice } from "@reduxjs/toolkit";

const initialState = {
  onLineStatus: true,
  grabberExtensionDialogOpen: false,
};

const appSlice = createSlice({
  name: 'app',
  initialState,
  reducers: {
    setOnLineStatus: (state, action) => {
      state.onLineStatus = action.payload;
    },
    setGrabberExtensionDialogOpen: (state, action) => {
      state.grabberExtensionDialogOpen = action.payload;
    },
  },
});

export const {
  setOnLineStatus,
  setGrabberExtensionDialogOpen,
} = appSlice.actions;
export default appSlice.reducer;
