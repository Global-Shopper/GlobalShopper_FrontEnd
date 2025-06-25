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
    verifyOTP: builder.mutation({
      query: (data) => ({
        params: data,
        url: endpoints.VERIFY_OTP,
        method: 'POST',
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
} = gshopApi;

export default gshopApi;
