import React from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { Button } from './ui/button'
import GShopLogo from "@/assets/LOGO_Gshop.png";
import { useDispatch, useSelector } from 'react-redux';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import { User, Package, Settings, LogOut, CalendarArrowUp, ArrowDownUp } from "lucide-react"
import { signout } from '@/features/user';

const Header = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const isLoggedIn = useSelector((state) => state.rootReducer?.user?.isLoggedIn);
  const name = useSelector((state) => state.rootReducer?.user?.name) || "Người dùng";
  const email = useSelector((state) => state.rootReducer?.user?.email)
  const avatar = useSelector((state) => state.rootReducer?.user?.avatar);

  const handleSignout = () => {
    dispatch(signout());
    navigate('/login');
  }
  return (
    <header className="sticky top-0 z-50 w-full border-b bg-white/95 backdrop-blur supports-[backdrop-filter]:bg-white/60">
      <div className="container flex h-16 items-center justify-between px-4 md:px-32">
        <Link to="/" className="flex items-center space-x-2">
          <img src={GShopLogo} alt="Logo" width={48} height={48} className="h-12 w-12" />
          <span className="text-xl font-bold">Global Shopper</span>
        </Link>

        {/* Desktop Navigation */}
        <nav className="hidden md:flex items-center space-x-6">
          <Link to="/services" className="text-sm font-medium hover:text-primary transition-colors">
            Dịch vụ
          </Link>
          <Link to="/" className="text-sm font-medium hover:text-primary transition-colors">
            Trang chủ
          </Link>
          <Link to="/contact" className="text-sm font-medium hover:text-primary transition-colors">
            Liên hệ
          </Link>
          <Link to="/orders" className="text-sm font-medium hover:text-primary transition-colors">
            Xem đơn hàng
          </Link>
        </nav>

        <div className="flex items-center space-x-4">
          {
            !isLoggedIn ?
              <Button variant="ghost" size="sm" className="hidden sm:inline-flex">
                <Link to="/login">Đăng nhập</Link>
              </Button>
              : <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <img
                    src={avatar ? avatar : "https://via.placeholder.com/36"}
                    alt="User Avatar"
                    width={36}
                    height={36}
                    className="h-9 w-9 rounded-full border object-cover"
                  />
                </DropdownMenuTrigger>
                <DropdownMenuContent className="w-56" align="end" forceMount>
                  <DropdownMenuLabel className="font-normal">
                    <div className="flex flex-col space-y-1">
                      <p className="text-sm font-medium leading-none">{name}</p>
                      <p className="text-xs leading-none text-muted-foreground">{email}</p>
                    </div>
                  </DropdownMenuLabel>
                  <DropdownMenuSeparator />
                  <DropdownMenuItem asChild>
                    <Link to="/account-center/purchase-request-list" className="flex items-center">
                      <CalendarArrowUp className="mr-2 h-4 w-4" />
                      <span>Yêu cầu mua hàng</span>
                    </Link>
                  </DropdownMenuItem>
                  <DropdownMenuItem asChild>
                    <Link to="/orders" className="flex items-center">
                      <Package className="mr-2 h-4 w-4" />
                      <span>Đơn hàng của tôi</span>
                    </Link>
                  </DropdownMenuItem>
                  <DropdownMenuItem asChild>
                    <Link to="/orders" className="flex items-center">
                      <ArrowDownUp className="mr-2 h-4 w-4" />
                      <span>Lịch sử thanh toán</span>
                    </Link>
                  </DropdownMenuItem>
                  <DropdownMenuItem asChild>
                    <Link to="/account-center" className="flex items-center">
                      <User className="mr-2 h-4 w-4" />
                      <span>Quản lý tài khoản</span>
                    </Link>
                  </DropdownMenuItem>
                  <DropdownMenuSeparator />
                  <DropdownMenuItem onClick={handleSignout} className="text-red-600 focus:text-red-600">
                    <LogOut className="mr-2 h-4 w-4" />
                    <span>Đăng xuất</span>
                  </DropdownMenuItem>
                </DropdownMenuContent>
              </DropdownMenu>}
        </div>
      </div>
    </header>
  )
}

export default Header