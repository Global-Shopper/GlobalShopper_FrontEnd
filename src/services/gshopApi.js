import { createApi } from '@reduxjs/toolkit/query/react';
import { axiosBaseQuery } from './baseRequest';
import endpoints from '../const/endpoints';

//Lưu ý khi cho dev, cần phải sửa lại baseURL trong file baseRequest.js
const gshopApi = createApi({
  reducerPath: 'gshopApi',
  baseQuery: axiosBaseQuery(), // Adjust base URL as needed
  endpoints: (builder) => ({
    login: builder.mutation({
      query: (data) => ({
        data: data,
        url: endpoints.LOGIN,
        method: 'POST',
      }),
    }),
    register: builder.mutation({
      query: (data) => ({
        data: data,
        url: endpoints.REGISTER,
        method: 'POST',
      }),
    }),
    verifyOTP: builder.mutation({
      query: (data) => ({
        params: data,
        url: endpoints.VERIFY_OTP,
        method: 'POST',
      }),
    }),
    resendOTP: builder.query({
      query: (data) => ({
        params: data,
        url: endpoints.RESEND_OTP,
      }),
    }),
    verifyOTPForgotPassword: builder.mutation({
      query: (data) => ({
        params: data,
        url: endpoints.VERIFY_OTP_FORGOT_PASSWORD,
        method: 'POST',
      }),
    }),
    forgotPassword: builder.query({
      query: (data) => ({
        params: data,
        url: endpoints.FORGOT_PASSWORD,
      }),
    }),
    resetPassword: builder.mutation({
      query: (data) => ({
        data: data,
        url: endpoints.RESET_PASSWORD,
        method: 'PUT',
      }),
    }),
    // getPreorderById: builder.query({
    //   query: (id) => ({
    //     url: `${endpoints.PREORDERS}/${id}`,
    //     method: 'GET',
    //   }),
    // }),
  }),
});

export const {
  useLoginMutation,
  useVerifyOTPMutation,
  useLazyResendOTPQuery,
  useLazyForgotPasswordQuery,
  useResetPasswordMutation,
  useRegisterMutation,
  useVerifyOTPForgotPasswordMutation,
} = gshopApi;

export default gshopApi;
