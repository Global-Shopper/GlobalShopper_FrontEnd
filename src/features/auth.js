import { createSlice } from "@reduxjs/toolkit";

const initialState = {
  otp: '',
  forgotPasswordToken: '',
  forgotPasswordStep: 'email',
};

const authSlice = createSlice({
  name: 'auth',
  initialState,
  reducers: {
    setOTP: (state, action) => {
      state.otp = action.payload;
    },
    setForgotPasswordToken: (state, action) => {
      state.forgotPasswordToken = action.payload;
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
  setForgotPasswordToken,
} = authSlice.actions;
export default authSlice.reducer;
