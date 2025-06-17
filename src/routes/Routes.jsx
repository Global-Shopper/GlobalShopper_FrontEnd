import { Route, Routes } from "react-router-dom";
import AdminLayout from "../containers/Admin/AdminLayout";
import PurchaseRequestPage from "../containers/Admin/PurchaseRequestPage";
import Homelayout from "../containers/Home/Homelayout";
import Homepage from "../containers/Home/Homepage";

const AppRoutes = () => {
  return (
    <Routes>
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