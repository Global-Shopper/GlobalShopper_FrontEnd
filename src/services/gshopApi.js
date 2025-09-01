import { createApi } from "@reduxjs/toolkit/query/react";
import { axiosBaseQuery } from "./baseRequest";
import endpoints from "../const/endpoints";

const gshopApi = createApi({
	reducerPath: "gshopApi",
	tagTypes: [
		"CustomerProfile",
		"ShippingAddress",
		"PurchaseRequest",
		"Wallet",
		"PurchaseRequestDetail",
		"RefundList",
		"WithdrawList",
		"BMDashboard",
		"Variants",
		"Transactions",
		"RefundReasons",
	],
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
		loginToken: builder.query({
			query: () => ({
				url: endpoints.LOGIN_TOKEN,
				method: "GET",
			}),
		}),
		getCustomerInfo: builder.query({
			query: () => ({
				url: `${endpoints.CUSTOMER_PROFILE}/current-information`,
				method: "GET",
			}),
			providesTags: ["CustomerProfile"],
		}),
		getAdminInfo: builder.query({
			query: () => ({
				url: endpoints.CURRENT_ADMIN,
				method: "GET",
			}),
			providesTags: ["AdminProfile"],
		}),
		updateAdminAvatar: builder.mutation({
			query: (formData) => ({
				data: formData,
				url: endpoints.ADMIN_AVATAR,
				method: "POST",
			}),
			invalidatesTags: ["AdminProfile"],
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
				url: `${endpoints.PURCHASE_REQUEST}/edit/${id}`,
				method: "PUT",
			}),
			invalidatesTags: ["PurchaseRequest", "PurchaseRequestDetail"],
		}),
		createQuotationOnline: builder.mutation({
			query: (data) => ({
				data: data,
				url: `${endpoints.QUOTATION}/online`,
				method: "POST",
			}),
			invalidatesTags: ["PurchaseRequestDetail"],
		}),
		createQuotationOffline: builder.mutation({
			query: (data) => ({
				data: data,
				url: `${endpoints.QUOTATION}/offline`,
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
			providesTags: ["TransactionHistory"],
		}),
		getTransactions: builder.query({
			query: (params) => ({
				params: params,
				url: endpoints.TRANSACTION_FILTER,
				method: "GET",
			}),
			providesTags: ["Transactions"],
		}),
		// Refund Reasons endpoints
		getRefundReasons: builder.query({
			query: () => ({
				url: endpoints.REFUND_REASONS,
				method: "GET",
			}),
			providesTags: ["RefundReasons"],
		}),
		createRefundReason: builder.mutation({
			query: (data) => ({
				data: data,
				url: endpoints.CREATE_REFUND_REASON,
				method: "POST",
			}),
			invalidatesTags: ["RefundReasons"],
		}),
		editRefundReason: builder.mutation({
			query: ({ id, ...data }) => ({
				data: data,
				url: `${endpoints.EDIT_REFUND_REASON}/${id}`,
				method: "PUT",
			}),
			invalidatesTags: ["RefundReasons"],
		}),
		activateRefundReason: builder.mutation({
			query: ({ id, ...data }) => ({
				data: data,
				url: `${endpoints.ACTIVATE_REFUND_REASON}/${id}/activate`,
				method: "PATCH",
			}),
			invalidatesTags: ["RefundReasons"],
		}),
		deleteRefundReason: builder.mutation({
			query: (id) => ({
				url: `${endpoints.DELETE_REFUND_REASON}/${id}`,
				method: "DELETE",
			}),
			invalidatesTags: ["RefundReasons"],
		}),
		checkout: builder.mutation({
			query: (data) => ({
				data: data,
				url: endpoints.CHECKOUT,
				method: "POST",
			}),
			invalidatesTags: [
				"PurchaseRequestDetail",
				"Wallet",
				"Orders",
				"OrderDetail",
			],
		}),
		directCheckout: builder.mutation({
			query: (data) => ({
				data: data,
				url: endpoints.DIRECT_CHECKOUT,
				method: "POST",
			}),
			invalidatesTags: [
				"PurchaseRequestDetail",
				"Wallet",
				"Orders",
				"OrderDetail",
			],
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
			query: ({ orderId, payload }) => ({
				data: payload,
				url: `${endpoints.UPDATE_SHIPPING}/${orderId}`,
				method: "PUT",
			}),
			invalidatesTags: ["Orders", "OrderDetail"],
		}),
		cancelOrder: builder.mutation({
			query: ({ orderId, payload }) => ({
				data: payload,
				url: `${endpoints.CANCEL_ORDER}/${orderId}`,
				method: "PUT",
			}),
			invalidatesTags: ["Orders", "OrderDetail"],
		}),
		getHsCodes: builder.query({
			query: (data) => ({
				params: data,
				url: endpoints.HS_CODES,
				method: "GET",
			}),
			providesTags: ["HSCodeList"],
		}),
		getTaxRatesByHsCode: builder.query({
			query: (hsCode) => ({
				url: `${endpoints.TAX_RATES_BY_HSCODE}/${hsCode}`,
				method: "GET",
			}),
			providesTags: ["TaxRateList"],
		}),
		importTaxRatesByList: builder.mutation({
			query: (data) => ({
				data: data,
				url: endpoints.TAX_RATES_IMPORT_BY_LIST,
				method: "POST",
			}),
			invalidatesTags: ["TaxRateList"],
		}),
		importHSCodeByList: builder.mutation({
			query: (data) => ({
				data: data,
				url: endpoints.HS_CODES_IMPORT_BY_LIST,
				method: "POST",
			}),
			invalidatesTags: ["HSCodeList"],
		}),
		getShipmentRate: builder.query({
			query: (data) => ({
				data: data,
				url: endpoints.SHIPMENT_RATE,
				method: "POST",
			}),
		}),
		createShipment: builder.mutation({
			query: (data) => ({
				data: data,
				url: endpoints.CREATE_SHIPMENT,
				method: "POST",
			}),
		}),
		createFeedback: builder.mutation({
			query: (data) => ({
				data: data,
				url: endpoints.FEEDBACK,
				method: "POST",
			}),
		}),
		createRefund: builder.mutation({
			query: (data) => ({
				data: data,
				url: endpoints.REFUND,
				method: "POST",
			}),
			invalidatesTags: ["RefundList"],
		}),
		getRefundList: builder.query({
			query: (data) => ({
				params: data,
				url: endpoints.REFUND,
				method: "GET",
			}),
			providesTags: ["RefundList"],
		}),
		getRefundByOrderId: builder.query({
			query: (orderId) => ({
				url: `${endpoints.REFUND_ORDER}/${orderId}`,
				method: "GET",
			}),
			providesTags: ["RefundList"],
		}),
		approveRefund: builder.mutation({
			query: ({ data, refundId }) => ({
				data: data,
				url: `${endpoints.REFUND_PROCESS}/${refundId}`,
				method: "POST",
			}),
			invalidatesTags: ["RefundList"],
		}),
		rejectRefund: builder.mutation({
			query: ({ data, refundId }) => ({
				data: data,
				url: `${endpoints.REFUND_REJECT}/${refundId}`,
				method: "POST",
			}),
			invalidatesTags: ["RefundList"],
		}),
		getAllAdmins: builder.query({
			query: (params) => ({
				params: params,
				url: endpoints.GET_ALL_ADMINS,
				method: "GET",
			}),
			providesTags: ["AdminList"],
		}),
		createAdmin: builder.mutation({
			query: (data) => ({
				data: data,
				url: endpoints.CREATE_ADMIN,
				method: "POST",
			}),
			invalidatesTags: ["AdminList"],
		}),
		updateAdmin: builder.mutation({
			query: ({ id, data }) => ({
				data: data,
				url: `${endpoints.UPDATE_ADMIN}/${id}`,
				method: "PUT",
			}),
			invalidatesTags: ["AdminList"],
		}),
		banAdmin: builder.mutation({
			query: (id) => ({
				url: `${endpoints.BAN_ADMIN}/${id}`,
				method: "PUT",
			}),
			invalidatesTags: ["AdminList"],
		}),
		toggleAdminActive: builder.mutation({
			query: (id) => ({
				url: `${endpoints.TOGGLE_ADMIN_ACTIVE}/${id}/active`,
				method: "PATCH",
			}),
			invalidatesTags: ["AdminList"],
		}),

		getAllCustomers: builder.query({
			query: (params) => ({
				params: params,
				url: endpoints.GET_ALL_CUSTOMERS,
				method: "GET",
			}),
			providesTags: ["CustomerList"],
		}),
		updateCustomer: builder.mutation({
			query: ({ id, data }) => ({
				data: data,
				url: `${endpoints.UPDATE_CUSTOMER}/${id}`,
				method: "PUT",
			}),
			invalidatesTags: ["CustomerList"],
		}),
		banCustomer: builder.mutation({
			query: (id) => ({
				url: `${endpoints.BAN_CUSTOMER}/${id}`,
				method: "PUT",
			}),
			invalidatesTags: ["CustomerList"],
		}),
		getBankAccount: builder.query({
			query: () => ({
				url: endpoints.BANK_ACCOUNT,
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
			providesTags: ["BankAccount"],
		}),
		addBankAccount: builder.mutation({
			query: (data) => ({
				data: data,
				url: endpoints.BANK_ACCOUNT,
				method: "POST",
			}),
			invalidatesTags: ["BankAccount"],
		}),
		removeBankAccount: builder.mutation({
			query: (id) => ({
				url: `${endpoints.BANK_ACCOUNT}/${id}`,
				method: "DELETE",
			}),
			invalidatesTags: ["BankAccount"],
		}),
		updateBankAccount: builder.mutation({
			query: ({ id, data }) => ({
				data: data,
				url: `${endpoints.BANK_ACCOUNT}/${id}`,
				method: "PUT",
			}),
			invalidatesTags: ["BankAccount"],
		}),
		createWithdrawRequest: builder.mutation({
			query: (data) => ({
				data: data,
				url: endpoints.WITHDRAW_REQUEST,
				method: "POST",
			}),
			invalidatesTags: ["WithdrawList", "TransactionHistory"],
		}),
		getWithdrawRequestCustomer: builder.query({
			query: (params) => ({
				params: params,
				url: endpoints.WITHDRAW_CUSTOMER,
				method: "GET",
			}),
			providesTags: ["WithdrawList"],
		}),
		uploadBill: builder.mutation({
			query: ({ data, id }) => ({
				data: data,
				url: `${endpoints.WALLET}/${id}/upload-bill`,
				method: "POST",
			}),
			invalidatesTags: ["WithdrawList"],
		}),
		processWithdrawRequest: builder.mutation({
			query: ({ params, id }) => ({
				params: params,
				url: `${endpoints.WALLET}/${id}/process`,
				method: "POST",
			}),
			invalidatesTags: ["WithdrawList"],
		}),
		processWithdrawRequestNewPhase: builder.mutation({
			query: ({ params, id }) => ({
				params: params,
				url: `${endpoints.WALLET}/${id}/process-new-phase`,
				method: "POST",
			}),
			invalidatesTags: ["WithdrawList"],
		}),
		getWithdrawRequestAdmin: builder.query({
			query: (params) => ({
				params: params,
				url: endpoints.WITHDRAW_ADMIN,
				method: "GET",
			}),
			providesTags: ["WithdrawList"],
		}),
		getBMDashboard: builder.query({
			query: ({ startDate, endDate }) => ({
				params: { startDate, endDate },
				url: endpoints.BM_DASHBOARD,
				method: "GET",
			}),
			providesTags: ["BMDashboard"],
		}),
		getBMCustomer: builder.query({
			query: ({ page = 0, size = 20, startDate, endDate }) => ({
				params: { page, size, startDate, endDate },
				url: endpoints.BM_CUSTOMER,
				method: "GET",
			}),
			providesTags: ["BMDashboard"],
		}),
		updateServiceFee: builder.mutation({
			query: (serviceFee) => ({
				data: { serviceFee },
				url: endpoints.BM_SERVICE_FEE,
				method: "PUT",
			}),
			invalidatesTags: ["BMDashboard"],
		}),
		getRevenue: builder.query({
			query: ({ startDate, endDate }) => ({
				params: { startDate, endDate },
				url: endpoints.BM_REVENUE,
				method: "GET",
			}),
			providesTags: ["BMDashboard"],
		}),
		getAllVariants: builder.query({
			query: () => ({
				url: endpoints.VARIANTS,
				method: "GET",
			}),
			providesTags: ["Variants"],
		}),
		getVariantOnlyName: builder.query({
			query: () => ({
				url: endpoints.VARIANTS,
				method: "GET",
			}),
			transformResponse: (response) => {
				return response.map((variant) => variant.name).concat("Khác");
			},
			providesTags: ["Variants"],
		}),
		createVariant: builder.mutation({
			query: (variantData) => ({
				params: variantData,
				url: endpoints.VARIANTS,
				method: "POST",
			}),
			invalidatesTags: ["Variants"],
		}),
		updateVariant: builder.mutation({
			query: ({ id, name }) => ({
				params: { newName: name },
				url: `${endpoints.VARIANTS}/${id}`,
				method: "PUT",
			}),
			invalidatesTags: ["Variants"],
		}),
		deleteVariant: builder.mutation({
			query: (id) => ({
				url: `${endpoints.VARIANTS}/${id}`,
				method: "DELETE",
			}),
			invalidatesTags: ["Variants"],
		}),
		toggleVariantActive: builder.mutation({
			query: (id) => ({
				url: `${endpoints.TOGGLE_VARIANT_ACTIVE}/${id}/active`,
				method: "PATCH",
			}),
			invalidatesTags: ["Variants"],
		}),
	}),
});

export const {
	useLoginMutation,
	useLoginTokenQuery,
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
	useGetAdminInfoQuery,
	useUpdateAdminAvatarMutation,
	useUpdateCustomerProfileMutation,
	useDefaultShippingAddressMutation,
	useUploadAvatarMutation,
	useGetPurchaseRequestQuery,
	useCreateWithLinkPurchaseRequestMutation,
	useCreateWithoutLinkPurchaseRequestMutation,
	useGetWalletQuery,
	useDepositWalletMutation,
	useCreateQuotationOnlineMutation,
	useCreateQuotationOfflineMutation,
	useRequestUpdatePurchaseRequestMutation,
	useRejectQuotationMutation,
	useGetEditInfoPurchaseRequestQuery,
	useUpdatePurchaseRequestMutation,
	useCheckingPurchaseRequestMutation,
	useGetPurchaseRequestDetailQuery,
	useTransactionHistoryQuery,
	useGetTransactionsQuery,
	useGetRefundReasonsQuery,
	useCreateRefundReasonMutation,
	useEditRefundReasonMutation,
	useActivateRefundReasonMutation,
	useDeleteRefundReasonMutation,
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
	useLazyGetHsCodesQuery,
	useGetShipmentRateQuery,
	useCreateShipmentMutation,
	useCreateFeedbackMutation,
	useCreateRefundMutation,
	useGetRefundListQuery,
	useGetRefundByOrderIdQuery,
	useApproveRefundMutation,
	useRejectRefundMutation,
	useBanCustomerMutation,
	useUpdateCustomerMutation,
	useGetAllCustomersQuery,
	useBanAdminMutation,
	useToggleAdminActiveMutation,
	useUpdateAdminMutation,
	useCreateAdminMutation,
	useGetAllAdminsQuery,
	useGetBankAccountQuery,
	useAddBankAccountMutation,
	useRemoveBankAccountMutation,
	useUpdateBankAccountMutation,
	useUploadBillMutation,
	useProcessWithdrawRequestMutation,
	useProcessWithdrawRequestNewPhaseMutation,
	useGetWithdrawRequestAdminQuery,
	useCreateWithdrawRequestMutation,
	useGetWithdrawRequestCustomerQuery,
	useGetBMDashboardQuery,
	useGetBMCustomerQuery,
	useUpdateServiceFeeMutation,
	useGetRevenueQuery,
	useGetAllVariantsQuery,
	useCreateVariantMutation,
	useUpdateVariantMutation,
	useDeleteVariantMutation,
	useToggleVariantActiveMutation,
	useGetVariantOnlyNameQuery,
	useImportTaxRatesByListMutation,
	useGetTaxRatesByHsCodeQuery,
	useImportHSCodeByListMutation,
} = gshopApi;

export default gshopApi;
