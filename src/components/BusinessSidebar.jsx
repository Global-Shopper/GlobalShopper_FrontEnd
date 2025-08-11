import { ChartLine, ChartPie, LogOut, Settings, User } from "lucide-react";

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
import logo from "@/assets/LOGO_Gshop.png";
import defaultAvt from "@/assets/defaultAvt.jpg";

// Menu items.
const items = [
  {
    title: "Thống kê tổng quan",
    url: "/business-manager/overview",
    icon: ChartPie,
  },
  {
    title: "Thống kê doanh thu",
    url: "/business-manager/revenue",
    icon: ChartLine,
  },
  {
    title: "Cấu hình hệ thống",
    url: "/business-manager/config",
    icon: Settings,
  },
  {
    title: "Quản lý admin",
    url: "/business-manager/admin-management",
    icon: User,
  },
  {
    title: "Đăng xuất",
    url: "/login",
    icon: LogOut,
  },
];

export function BusinessSidebar() {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { avatar, name, email } = useSelector(
    (state) => state.rootReducer.user
  );
  console.log(avatar);
  return (
    <Sidebar>
      <SidebarContent>
        <SidebarGroup>
          <SidebarGroupLabel className="flex justify-center items-center py-10">
            <img src={logo} alt="GSHOP Logo" className="h-20 w-auto" />
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
            avatar ||
            defaultAvt
          }
          alt="Avatar"
          className="w-14 h-14 rounded-full border border-gray-300 object-contain shadow mb-1"
        />
        <div className="text-sm font-semibold text-gray-900 truncate w-full text-center max-w-[150px]">
          {name || "Admin"}
        </div>
        <div
          className="text-xs text-gray-400 truncate w-full text-center max-w-[150px] mb-2"
          title={email}
        >
          {email || ""}
        </div>
        <button
          onClick={() => {
            dispatch(signout());
            navigate("/login");
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
