import { Route, Routes } from "react-router-dom";
import AdminLayout from "../containers/Admin/AdminLayout";
import PurchaseRequestPage from "../containers/Admin/PurchaseRequestPage";
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

const AppRoutes = () => {
  return (
    <Routes>
      <Route path="/login" element={<Login />} />
      <Route path="/signup" element={<Signup />} />
      <Route path="/otp-verify" element={<OTPverification />} />
      <Route path="/forgot-password" element={<ForgotPassword />} />

      <Route path="/" element={<Homelayout />}>
        <Route index element={<Homepage />} />
      </Route>

      {/* Customer Account Center Routes */}
      <Route path="/account-center" element={<AccountCenterLayout />}>
        <Route index element={<CustomerProfile />} />
        <Route path="purchase-request-list" element={<PurchaseRequest />} />
        <Route path="create-request" element={<CreateRequestSelection />} />
        <Route path="quotes" element={<div className="p-6"><h1>Báo giá</h1><p>Trang xem báo giá từ yêu cầu</p></div>} />
        <Route path="orders" element={<div className="p-6"><h1>Đơn hàng</h1><p>Trang theo dõi đơn hàng</p></div>} />
        <Route path="refunds" element={<div className="p-6"><h1>Yêu cầu hoàn tiền</h1><p>Trang quản lý yêu cầu hoàn tiền</p></div>} />
        <Route path="settings" element={<div className="p-6"><h1>Cài đặt</h1><p>Trang cài đặt tài khoản</p></div>} />
      </Route>

      {/* Protected Admin Routes */}
      <Route path="/admin" element={<AdminLayout />}>
        <Route path="" element={<PurchaseRequestPage />} />
      </Route>
    </Routes>
  );
};

export default AppRoutes;