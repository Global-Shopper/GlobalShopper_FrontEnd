import { createSlice } from "@reduxjs/toolkit";

const initialState = {
  otp: '',
  email: '',
  forgotPasswordStep: 'email',
};

const authSlice = createSlice({
  name: 'auth',
  initialState,
  reducers: {
    setOTP: (state, action) => {
      state.otp = action.payload;
    },
    setEmail: (state, action) => {
      state.email = action.payload;
    },
    setForgotPasswordStep: (state, action) => {
      state.forgotPasswordStep = action.payload;
    },
  },
});

export const {
  setOTP,
  setEmail,
  setForgotPasswordStep,
} = authSlice.actions;
export default authSlice.reducer;
