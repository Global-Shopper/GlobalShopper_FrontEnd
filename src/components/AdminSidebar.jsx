import { Banknote, Calendar, Home, Inbox, LogOut, Package, PackageSearch, Search, Settings, Undo2 } from "lucide-react";

import {
  Sidebar,
  SidebarContent,
  SidebarGroup,
  SidebarGroupContent,
  SidebarGroupLabel,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
} from "@/components/ui/sidebar";
import { Link, useNavigate } from "react-router-dom";
import { signout } from "@/features/user";
import { useDispatch, useSelector } from "react-redux";
import adminLogo from "@/assets/logo_admin.png";
import defaultAvt from "@/assets/defaultAvt.jpg";
import gshopApi, { useLoginTokenQuery } from "@/services/gshopApi";

// Menu items.
const items = [
  {
    title: "Yêu cầu mua hàng",
    url: "/admin",
    icon: PackageSearch,
  },
  {
    title: "Đơn hàng",
    url: "/admin/orders",
    icon: Package,
  },
  {
    title: "Yêu cầu hoàn tiền",
    url: "/admin/refunds",
    icon: Undo2,
  },
  {
    title: "Yêu cầu rút tiền",
    url: "/admin/withdraw",
    icon: Banknote,
  },
  {
    title: "Tài khoản",
    url: "/admin/account",
    icon: Settings,
  },
  {
    title: "Đăng xuất",
    url: "/login",
    icon: LogOut,
  },
];

export function AdminSidebar() {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { data: userInfo, isLoading: infoLoading } = useLoginTokenQuery();
  const { avatar, name, email } = useSelector(
    (state) => state.rootReducer.user
  );
  return (
    <Sidebar>
      <SidebarContent>
        <SidebarGroup>
          <SidebarGroupLabel className="flex justify-center items-center py-10">
            <img src={adminLogo} alt="GSHOP Logo" className="h-20 w-auto" />
          </SidebarGroupLabel>
          <SidebarGroupContent>
            <SidebarMenu>
              {items
                .filter((item) => item.url !== "/login")
                .map((item) => (
                  <SidebarMenuItem key={item.title}>
                    <SidebarMenuButton
                      asChild
                      isActive={location.pathname === item.url}
                    >
                      <Link to={item.url}>
                        <item.icon />
                        <span>{item.title}</span>
                      </Link>
                    </SidebarMenuButton>
                  </SidebarMenuItem>
                ))}
            </SidebarMenu>
          </SidebarGroupContent>
        </SidebarGroup>
      </SidebarContent>
      {/* Bottom sticky user info and signout section */}
      <div className="sticky bottom-0 left-0 w-full bg-white z-10 border-t border-gray-100 px-4 pt-4 pb-6 flex flex-col items-center select-none">
        <img
          src={
            userInfo?.user?.avatar ||
            defaultAvt
          }
          alt="Avatar"
          className="w-14 h-14 rounded-full border border-gray-300 object-contain shadow mb-1"
        />
        <div className="text-sm font-semibold text-gray-900 truncate w-full text-center max-w-[150px]">
          {userInfo?.user?.name || "Admin"}
        </div>
        <div
          className="text-xs text-gray-400 truncate w-full text-center max-w-[150px] mb-2"
          title={userInfo?.user?.email}
        >
          {userInfo?.user?.email || ""}
        </div>
        <button
          onClick={() => {
            dispatch(gshopApi.util.resetApiState());
            setTimeout(() => navigate("/login"), 0);//note: important for waiting the navigate of private route
            dispatch(signout());
          }}
          className="mt-2 flex items-center gap-2 px-4 py-2 rounded-lg bg-gray-100 hover:bg-gray-200 text-sm text-gray-700 font-medium transition w-full justify-center"
        >
          <LogOut className="w-4 h-4" />
          <span>Đăng xuất</span>
        </button>
      </div>
    </Sidebar>
  );
}
