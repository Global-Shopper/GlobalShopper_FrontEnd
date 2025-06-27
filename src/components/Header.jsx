import React from 'react'
import { Link } from 'react-router-dom'
import { Button } from './ui/button'
import GShopLogo from "@/assets/LOGO_Gshop.png";

const Header = () => {
  return (
    <header className="sticky top-0 z-50 w-full border-b bg-white/95 backdrop-blur supports-[backdrop-filter]:bg-white/60">
        <div className="container flex h-16 items-center justify-between px-4 md:px-32">
          <Link to='/' className="flex items-center space-x-2">
              <img src={GShopLogo} alt="Logo" className="h-12 w-12x" />
            <span className="text-xl font-bold">Global Shopper</span>
          </Link>

          <nav className="hidden md:flex items-center space-x-6">
            <Link to="#features" className="text-sm font-medium hover:text-primary transition-colors">
              Dịch vụ
            </Link>
            <Link to="#testimonials" className="text-sm font-medium hover:text-primary transition-colors">
              Trang chủ
            </Link>
            <Link to="#pricing" className="text-sm font-medium hover:text-primary transition-colors">
              Liên hệ
            </Link>
            <Link to="#contact" className="text-sm font-medium hover:text-primary transition-colors">
              Xem đơn hàng
            </Link>
          </nav>

          <div className="flex items-center space-x-4">
            <Button variant="ghost" size="sm" className="hidden sm:inline-flex">
              <Link to='/login'>Đăng nhập</Link>
            </Button>
            <Link to="/profile" className="flex items-center">
              <img
                src="https://ui-avatars.com/api/?name=User"
                alt="User Avatar"
                className="h-9 w-9 rounded-full border"
              />
            </Link>
          </div>
        </div>
      </header>
  )
}

export default Header