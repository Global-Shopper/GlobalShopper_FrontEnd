import { Navigate, Route, Routes } from "react-router-dom";
import AdminLayout from "../containers/Admin/AdminLayout";
import Homelayout from "../containers/Home/Homelayout";
import Homepage from "../containers/Home/Homepage";
import Login from "@/containers/Auth/Login";
import Signup from "@/containers/Auth/SignUp";
import OTPverification from "@/containers/Auth/OTPverification";
import ForgotPassword from "@/containers/Auth/ForgotPassword/ForgotPassword";
import AccountCenterLayout from "@/containers/CustomerCenter/AccountCenterLayout";
import CustomerProfile from "@/containers/CustomerCenter/CustomerProfile/CustomerProfile";
import PurchaseRequest from "@/containers/CustomerCenter/PurchaseRequestList/PurchaseRequest";
import CreateRequestSelection from "@/containers/CustomerCenter/RequestCreation/CreateRequestSelection";
import CreateRequestLayout from "@/containers/CustomerCenter/RequestCreation/CreateRequestLayout";
import WithoutLinkWorkflowPage from "@/containers/CustomerCenter/RequestCreation/WithoutLinkRequest/WithoutLinkWorkflowPage";
import WithLinkWorkflowPage from "@/containers/CustomerCenter/RequestCreation/WithLinkRequest/WithLinkWorkflowPage";
import WalletOverview from "@/containers/Wallet/WalletOverview";
import WalletDeposit from "@/containers/Wallet/WalletDeposit";
import AdPurchaseReqDetail from "@/containers/Admin/PurchaseRequest/AdPurchaseReqDetail";
import AdPurchaseReqList from "@/containers/Admin/PurchaseRequest/AdPurchaseReqList";
import PurchaseRequestDetail from "@/containers/CustomerCenter/PurchaseRequestDetail/PurchaseRequestDetail";
import BusinessManagerLayout from "@/containers/BusinessManager/BusinessManagerLayout";
import BMDashboard from "@/containers/BusinessManager/Dashboard/BMDashboard";
import RevenueDashboard from "@/containers/BusinessManager/Dashboard/RevenueDashboard";
import AdOrderList from "@/containers/Admin/Orders/AdOrderList";
import HsCodeConfig from "@/containers/BusinessManager/SystemConfig/HsCodeConfig";
import ServiceConfig from "@/containers/BusinessManager/SystemConfig/ServiceConfig";
import VariantConfig from "@/containers/BusinessManager/SystemConfig/VariantConfig";
import AdminManagement from "@/containers/BusinessManager/UserManagement/AdminManagement";
import CustomerManagement from "@/containers/BusinessManager/UserManagement/CustomerManagement";
import Orders from "@/containers/CustomerCenter/OrderList/Orders";
import PurchaseRequestEdit from "@/containers/CustomerCenter/PurchaseRequestEdit/PurchaseRequestEdit";
import AdOrderDetail from "@/containers/Admin/Orders/AdOrderDetail";
import OrderDetail from "@/containers/CustomerCenter/OrderDetail/OrderDetail";
import ScrollToTop from "./ScrollToTop";
import RefundList from "@/containers/CustomerCenter/Refund/RefundList";
import AdRefundList from "@/containers/Admin/RefundRequests/AdRefundList";
import AdWithdrawList from "@/containers/Admin/WithdrawRequests/AdWithdrawList";
import WalletWithdraw from "@/containers/Wallet/WalletWithdraw";
import WithdrawRequestList from "@/containers/CustomerCenter/WithdrawRequest/WithdrawRequestList";
import AdAccountSetting from "@/containers/Admin/AdAccountSetting/AdAccountSetting";
import Contact from "@/containers/Home/ContactPage";
import PrivacyPolicy from "@/containers/Home/Policy/PrivacyPolicy";
import RefundPolicy from "@/containers/Home/Policy/RefundPolicy";
import ReturnExchangePolicy from "@/containers/Home/Policy/ReturnExchangePolicy";
import TermOfService from "@/containers/Home/Policy/TermOfService";
import Pricing from "@/containers/Home/Pricing";
import FAQ from "@/containers/Home/FAQ";
import HsCodeDialogContent from "@/containers/BusinessManager/SystemConfig/HsCodeDialogContent";
import PrivateRoleBasedRoute from "./PrivateRoleBasedRoute";

const AppRoutes = () => {
	return (
		<>
			<ScrollToTop>
				<Routes>
					<Route path="/login" element={<Login />} />
					<Route path="/signup" element={<Signup />} />
					<Route path="/otp-verify" element={<OTPverification />} />
					<Route
						path="/otp-verify/change-email"
						element={<OTPverification changeEmail />}
					/>
					<Route path="/forgot-password" element={<ForgotPassword />} />

					<Route path="/" element={<Homelayout />}>
						<Route index element={<Homepage />} />
						<Route path="/contact" element={<Contact />} />
						<Route path="/privacy-policy" element={<PrivacyPolicy />} />
						<Route path="/refund-policy" element={<RefundPolicy />} />
						<Route path="/return-exchange-policy" element={<ReturnExchangePolicy />} />
						<Route path="/term-of-service" element={<TermOfService />} />
						<Route path="/pricing" element={<Pricing />} />
						<Route path="/faq" element={<FAQ />} />
						<Route path="create-request" element={<CreateRequestLayout />}>
							<Route index element={<CreateRequestSelection />} />
							<Route
								path="without-link"
								element={<WithoutLinkWorkflowPage />}
							/>
							<Route
								path="with-link"
								element={<WithLinkWorkflowPage />}
							/>
						</Route>
					</Route>

					{/* Customer Account Center Routes */}
					<Route path="/account-center" element={<AccountCenterLayout />}>
						<Route path="wallet" element={<WalletOverview />} />
						<Route path="wallet/deposit" element={<WalletDeposit />} />
						<Route path="wallet/withdraw" element={<WalletWithdraw />} />
						<Route path="withdraw" element={<WithdrawRequestList />} />
						<Route index element={<CustomerProfile />} />
						<Route path="purchase-request-list" element={<PurchaseRequest />} />
						<Route
							path="purchase-request/:id"
							element={<PurchaseRequestDetail />}
						/>
						<Route path="purchase-request/:id/edit" element={<PurchaseRequestEdit />} />
						<Route path="orders" element={<Orders />} />
						<Route path="orders/:id" element={<OrderDetail />} />
						<Route path="refunds" element={<RefundList />} />
					</Route>

					{/* Protected Admin Routes */}
					<Route element={<PrivateRoleBasedRoute requiredRoles={["ADMIN"]} />}>
						<Route path="/admin" element={<AdminLayout />}>
							<Route index element={<AdPurchaseReqList />} />
							<Route
								path="purchase-request/:id"
								element={<AdPurchaseReqDetail />}
							/>
							<Route path="orders" element={<AdOrderList />} />
							<Route path="orders/:id" element={<AdOrderDetail />} />
							<Route path="refunds" element={<AdRefundList />} />
							<Route path="withdraw" element={<AdWithdrawList />} />
							<Route path="account" element={<AdAccountSetting />} />
						</Route>
					</Route>

					{/* Protected Business Manager Routes */}
					<Route element={<PrivateRoleBasedRoute requiredRoles={["BUSINESS_MANAGER"]} />}>
					<Route path="/business-manager" element={<BusinessManagerLayout />}>
						<Route index element={<BMDashboard />} />
						<Route path="overview" element={<BMDashboard />} />
						<Route path="revenue" element={<RevenueDashboard />} />
						<Route
							path="user-management/admin"
							element={<AdminManagement />}
						/>
						<Route
							path="user-management/customer"
							element={<CustomerManagement />}
						/>
						<Route path="config/hs-code" element={<HsCodeDialogContent />} />
						<Route path="config/service" element={<ServiceConfig />} />
						<Route path="config/variant" element={<VariantConfig />} />
					</Route>
				</Route>
				<Route path="*" element={<Navigate to="/" replace />} />
				</Routes>
			</ScrollToTop>
		</>
	);
};

export default AppRoutes;
