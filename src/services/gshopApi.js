import { createApi } from "@reduxjs/toolkit/query/react";
import { axiosBaseQuery } from "./baseRequest";
import endpoints from "../const/endpoints";

const gshopApi = createApi({
  reducerPath: "gshopApi",
  tagTypes: ["CustomerProfile", "ShippingAddress", "PurchaseRequest", "Wallet", "PurchaseRequestDetail"],
  baseQuery: axiosBaseQuery(),
  endpoints: (builder) => ({
    login: builder.mutation({
      query: (data) => ({
        data: data,
        url: endpoints.LOGIN,
        method: "POST",
      }),
    }),
    register: builder.mutation({
      query: (data) => ({
        data: data,
        url: endpoints.REGISTER,
        method: "POST",
      }),
    }),
    changeEmail: builder.mutation({
      query: (newEmail) => ({
        params: newEmail,
        url: endpoints.CHANGE_EMAIL,
        method: "POST",
      }),
    }),
    verifyChangeEmail: builder.mutation({
      query: (data) => ({
        params: data,
        url: endpoints.VERIFY_CHANGE_EMAIL,
        method: "POST",
      }),
    }),
    verifyOTP: builder.mutation({
      query: (data) => ({
        params: data,
        url: endpoints.VERIFY_OTP,
        method: "POST",
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
        method: "POST",
      }),
    }),
    forgotPassword: builder.query({
      query: (data) => ({
        params: data,
        url: endpoints.FORGOT_PASSWORD,
      }),
    }),
    getCustomerInfo: builder.query({
      query: () => ({
        url: `${endpoints.CUSTOMER_PROFILE}/current-information`,
        method: "GET",
      }),
      providesTags: ["CustomerProfile"],
    }),
    updateCustomerProfile: builder.mutation({
      query: (data) => ({
        data: data,
        url: endpoints.CUSTOMER_PROFILE,
        method: "PUT",
      }),
      invalidatesTags: ["CustomerProfile"],
    }),
    uploadAvatar: builder.mutation({
      query: (formData) => ({
        data: formData,
        url: endpoints.UPLOAD_AVATAR,
        method: "POST",
      }),
      invalidatesTags: ["CustomerProfile"],
    }),
    resetPassword: builder.mutation({
      query: (data) => ({
        data: data,
        url: endpoints.RESET_PASSWORD,
        method: "PUT",
      }),
    }),
    getShippingAddress: builder.query({
      query: () => ({
        url: endpoints.SHIPPING_ADDRESS,
        method: "GET",
      }),
      transformResponse: (response) => {
        if (Array.isArray(response)) {
          response = [...response].sort(
            (a, b) => (b.default === true) - (a.default === true)
          );
        }
        return response;
      },
      providesTags: ["ShippingAddress"],
    }),
    createShippingAddress: builder.mutation({
      query: (data) => ({
        data: data,
        url: endpoints.SHIPPING_ADDRESS,
        method: "POST",
      }),
      invalidatesTags: ["ShippingAddress"],
    }),
    updateShippingAddress: builder.mutation({
      query: ({ id, ...data }) => ({
        data: data,
        url: `${endpoints.SHIPPING_ADDRESS}/${id}`,
        method: "PUT",
      }),
      invalidatesTags: ["ShippingAddress"],
    }),
    deleteShippingAddress: builder.mutation({
      query: (id) => ({
        url: `${endpoints.SHIPPING_ADDRESS}/${id}`,
        method: "DELETE",
      }),
      invalidatesTags: ["ShippingAddress"],
    }),
    defaultShippingAddress: builder.mutation({
      query: (id) => ({
        url: `${endpoints.DEFAULT_SHIPPING_ADDRESS}/${id}`,
        method: "PUT",
      }),
      invalidatesTags: ["ShippingAddress"],
    }),
    changePassword: builder.mutation({
      query: (data) => ({
        data: data,
        url: endpoints.CHANGE_PASSWORD,
        method: "PUT",
      }),
    }),
    getPurchaseRequest: builder.query({
      query: (data) => ({
        params: data,
        url: endpoints.PURCHASE_REQUEST,
        method: "GET",
      }),
      providesTags: ["PurchaseRequest"],
    }),
    checkingPurchaseRequest: builder.mutation({
      query: (id) => ({
        url: `${endpoints.CHECKING_PURCHASE_REQUEST}/${id}`,
        method: "PATCH",
      }),
      invalidatesTags: ["PurchaseRequest"],
    }),
    createWithLinkPurchaseRequest: builder.mutation({
      query: (data) => ({
        data: data,
        url: endpoints.WITH_LINK_PURCHASE_REQUEST,
        method: "POST",
      }),
      invalidatesTags: ["PurchaseRequest"],
    }),
    createWithoutLinkPurchaseRequest: builder.mutation({
      query: (data) => ({
        data: data,
        url: endpoints.WITHOUT_LINK_PURCHASE_REQUEST,
        method: "POST",
      }),
      invalidatesTags: ["PurchaseRequest"],
    }),
    getRawData: builder.query({
      query: (link) => ({
        params: link,
        url: endpoints.RAW_DATA,
        method: "GET",
      }),
    }),
    getPurchaseRequestDetail: builder.query({
      query: (id) => ({
        url: `${endpoints.PURCHASE_REQUEST}/${id}`,
        method: "GET",
      }),
      providesTags: ["PurchaseRequest", "PurchaseRequestDetail"],
    }),
    calculateQuotation: builder.mutation({
      query: (data) => ({
        data: data,
        url: endpoints.QUOTATION_CALCULATE,
        method: "POST",
      }),
    }),
    requestUpdatePurchaseRequest: builder.mutation({
      query: ({ purchaseRequestId, reason }) => ({
        data: reason,
        url: `${endpoints.PURCHASE_REQUEST}/${purchaseRequestId}/request-correction`,
        method: "POST",
      }),
      invalidatesTags: ["PurchaseRequestDetail"],
    }),
    getEditInfoPurchaseRequest: builder.query({
      query: (purchaseRequestId) => ({
        url: `${endpoints.PURCHASE_REQUEST}/${purchaseRequestId}/edit`,
        method: "GET",
      }),
    }),
    updatePurchaseRequest: builder.mutation({
      query: ({ id, payload }) => ({
        data: payload,
        url: `${endpoints.PURCHASE_REQUEST}/${id}`,
        method: "PUT",
      }),
      invalidatesTags: ["PurchaseRequest", "PurchaseRequestDetail"],
    }),
    createQuotation: builder.mutation({
      query: (data) => ({
        data: data,
        url: endpoints.QUOTATION,
        method: "POST",
      }),
      invalidatesTags: ["PurchaseRequestDetail"],
    }),
    rejectQuotation: builder.mutation({
      query: (data) => ({
        data: data,
        url: endpoints.REJECT_QUOTATION,
        method: "POST",
      }),
      invalidatesTags: ["PurchaseRequestDetail"],
    }),
    createGroup: builder.mutation({
      query: (data) => ({
        data: data,
        url: endpoints.CREATE_SUB_REQUEST,
        method: "POST",
      }),
      invalidatesTags: ["PurchaseRequestDetail"],
    }),
    updateSubRequest: builder.mutation({
      query: ({ id, payload }) => ({
        data: payload,
        url: `${endpoints.SUB_REQUEST}/${id}`,
        method: "PUT",
      }),
      invalidatesTags: ["PurchaseRequestDetail"],
    }),
    addItemToSubRequest: builder.mutation({
      query: ({ subRequestId, itemId }) => ({
        url: `${endpoints.SUB_REQUEST}/${subRequestId}/items/${itemId}`,
        method: "POST",
      }),
      invalidatesTags: ["PurchaseRequestDetail"],
    }),
    removeItemFromSubRequest: builder.mutation({
      query: ({ subRequestId, itemId }) => ({
        url: `${endpoints.SUB_REQUEST}/${subRequestId}/items/${itemId}`,
        method: "DELETE",
      }),
      invalidatesTags: ["PurchaseRequestDetail"],
    }),
    getWallet: builder.query({
      query: () => ({
        url: endpoints.WALLET,
        method: "GET",
      }),
      providesTags: ["Wallet"],
    }),
    depositWallet: builder.mutation({
      query: (data) => ({
        data: data,
        url: endpoints.WALLET,
        method: "POST",
      }),
    }),
    transactionHistory: builder.query({
      query: (data) => ({
        params: data,
        url: endpoints.TRANSACTION_HISTORY,
        method: "GET",
      }),
    }),
    checkout: builder.mutation({
      query: (data) => ({
        data: data,
        url: endpoints.CHECKOUT,
        method: "POST",
      }),
      invalidatesTags: ["PurchaseRequestDetail", "Wallet", "Orders", "OrderDetail"]
    }),
    directCheckout: builder.mutation({
      query: (data) => ({
        data: data,
        url: endpoints.DIRECT_CHECKOUT,
        method: "POST",
      }),
      invalidatesTags: ["PurchaseRequestDetail", "Wallet", "Orders", "OrderDetail"]
    }),
    getAllOrders: builder.query({
      query: (data) => ({
        params: data,
        url: endpoints.ORDER,
        method: "GET",
      }),
      providesTags: ["Orders"],
    }),
    getOrderByID: builder.query({
      query: (id) => ({
        url: `${endpoints.ORDER}/${id}`,
        method: "GET",
      }),
      providesTags: ["Orders"],
    }),
    updateShipping: builder.mutation({
      query: ({orderId, payload}) => ({
        data: payload,
        url: `${endpoints.UPDATE_SHIPPING}/${orderId}`,
        method: "PUT",
      }),
      invalidatesTags: ["Orders", "OrderDetail"],
    }),
    cancelOrder: builder.mutation({
      query: ({orderId, payload}) => ({
        data: payload,
        url: `${endpoints.CANCEL_ORDER}/${orderId}`,
        method: "PUT",
      }),
      invalidatesTags: ["Orders", "OrderDetail"],
    }),

    // checkPayment: builder.query({
    //   query: (data) => ({
    //     params: data,
    //     url: endpoints.CHECKPAYMENT,
    //     method: 'GET',
    //   }),
    // }),
    getHsCodes: builder.query({
      query: (data) => ({
        params: data,
        url: endpoints.HS_CODES,
        method: "GET",
      }),
    }),
  }),
});

export const {
  useLoginMutation,
  useVerifyOTPMutation,
  useLazyResendOTPQuery,
  useLazyForgotPasswordQuery,
  useResetPasswordMutation,
  useRegisterMutation,
  useChangeEmailMutation,
  useVerifyChangeEmailMutation,
  useVerifyOTPForgotPasswordMutation,
  useCreateShippingAddressMutation,
  useUpdateShippingAddressMutation,
  useGetShippingAddressQuery,
  useDeleteShippingAddressMutation,
  useChangePasswordMutation,
  useGetCustomerInfoQuery,
  useUpdateCustomerProfileMutation,
  useDefaultShippingAddressMutation,
  useUploadAvatarMutation,
  useGetPurchaseRequestQuery,
  useCreateWithLinkPurchaseRequestMutation,
  useCreateWithoutLinkPurchaseRequestMutation,
  useGetWalletQuery,
  useDepositWalletMutation,
  useCreateQuotationMutation,
  useRequestUpdatePurchaseRequestMutation,
  useRejectQuotationMutation,
  useGetEditInfoPurchaseRequestQuery,
  useUpdatePurchaseRequestMutation,
  // useLazyCheckPaymentQuery,
  useCheckingPurchaseRequestMutation,
  useGetPurchaseRequestDetailQuery,
  useTransactionHistoryQuery,
  useCreateGroupMutation,
  useUpdateSubRequestMutation,
  useAddItemToSubRequestMutation,
  useRemoveItemFromSubRequestMutation,
  useCalculateQuotationMutation,
  useLazyGetRawDataQuery,
  useCheckoutMutation,
  useGetAllOrdersQuery,
  useDirectCheckoutMutation,
  useGetOrderByIDQuery,
  useCancelOrderMutation,
  useUpdateShippingMutation,
  useGetHsCodesQuery,
} = gshopApi;

export default gshopApi;
