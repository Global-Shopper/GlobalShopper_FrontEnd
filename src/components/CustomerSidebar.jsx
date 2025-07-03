import { Home, Inbox, Package, RefreshCw, User } from "lucide-react"
import { Link, useLocation } from "react-router-dom"

import {
  Sidebar,
  SidebarContent,
  SidebarGroup,
  SidebarGroupContent,
  SidebarGroupLabel,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
} from "@/components/ui/sidebar"

// Menu items with proper routing
const items = [
  {
    title: "Hồ sơ cá nhân",
    url: "/account-center",
    icon: User,
  },
  {
    title: "Yêu cầu mua hàng",
    url: "/account-center/purchase-request-list",
    icon: Home,
  },
  {
    title: "Báo giá",
    url: "/account-center/quotes",
    icon: Inbox,
  },
  {
    title: "Đơn hàng",
    url: "/account-center/orders",
    icon: Package,
  },
  {
    title: "Yêu cầu hoàn tiền",
    url: "/account-center/refunds",
    icon: RefreshCw,
  },
]

export function CustomerSidebar() {
  const location = useLocation()

  return (
    <Sidebar>
      <SidebarContent className="mt-16">
        <SidebarGroup>
          <SidebarGroupLabel>Trung tâm tài khoản</SidebarGroupLabel>
          <SidebarGroupContent>
            <SidebarMenu>
              {items.map((item) => (
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
    </Sidebar>
  )
} 