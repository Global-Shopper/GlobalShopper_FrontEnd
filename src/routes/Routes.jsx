import { Route, Routes } from "react-router-dom";
import AdminLayout from "../containers/Admin/AdminLayout";
import PurchaseRequestPage from "../containers/Admin/PurchaseRequestPage";
import Homelayout from "../containers/Home/Homelayout";
import Homepage from "../containers/Home/Homepage";
import Login from "@/containers/Auth/Login";
import Signup from "@/containers/Auth/SignUp";
import OTPverification from "@/containers/Auth/OTPverification";
import ForgotPassword from "@/containers/Auth/ForgotPassword";

const AppRoutes = () => {
  return (
    <Routes>
      <Route path="/login" element={<Login />}/>
      <Route path="/signup" element={<Signup />}/>
      <Route path="/otp-verify" element={<OTPverification />}/>
      <Route path="/forgot-password" element={<ForgotPassword />} />

      <Route path="/" element={<Homelayout />}>
        <Route index element={<Homepage />} />
      </Route>

      {/* Protected Admin Routes */}
      <Route path="/admin" element={<AdminLayout />}>
        <Route path="" element={<PurchaseRequestPage />} />
      </Route>
    </Routes>
  );
};

export default AppRoutes;