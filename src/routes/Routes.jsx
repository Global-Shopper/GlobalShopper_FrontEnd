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

const AppRoutes = () => {
	return (
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
				<Route index element={<CustomerProfile />} />
				<Route
					path="purchase-request-list"
					element={<PurchaseRequest />}
				/>
				<Route
					path="purchase-request/:id"
					element={<PurchaseRequestDetail />}
				/>
				<Route
					path="purchase-request/:id/edit"
					element={<PurchaseRequestEdit />}
				/>
				<Route path="orders" element={<Orders />} />
				<Route path="orders/:id" element={<OrderDetail />} />
				<Route
					path="refunds"
					element={
						<div className="p-6">
							<h1>Yêu cầu hoàn tiền</h1>
							<p>Trang quản lý yêu cầu hoàn tiền</p>
						</div>
					}
				/>
				<Route
					path="settings"
					element={
						<div className="p-6">
							<h1>Cài đặt</h1>
							<p>Trang cài đặt tài khoản</p>
						</div>
					}
				/>
			</Route>

			{/* Protected Admin Routes */}
			<Route path="/admin" element={<AdminLayout />}>
				<Route index element={<AdPurchaseReqList />} />
				<Route
					path="purchase-request/:id"
					element={<AdPurchaseReqDetail />}
				/>
				<Route path="orders" element={<AdOrderList />} />
				<Route path="orders/:id" element={<AdOrderDetail />} />
			</Route>

			{/* Protected Business Manager Routes */}
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
				<Route path="config/hs-code" element={<HsCodeConfig />} />
				<Route path="config/service" element={<ServiceConfig />} />
				<Route path="config/variant" element={<VariantConfig />} />
			</Route>
			<Route path="*" element={<Navigate to="/" replace />} />
		</Routes>
	);
};

export default AppRoutes;
