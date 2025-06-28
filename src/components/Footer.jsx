import React from 'react'
import {
  ShoppingCart,
} from "lucide-react"
import { Link } from 'react-router-dom'

const Footer = () => {
  return (
    <footer className="border-t bg-muted z-10">
        <div className="container px-4 py-12 md:px-6">
          <div className="grid gap-8 lg:grid-cols-4">
            <div className="space-y-4">
              <div className="flex items-center space-x-2">
                <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-primary">
                  <ShoppingCart className="h-5 w-5 text-primary-foreground" />
                </div>
                <span className="text-xl font-bold">GlobalShopper</span>
              </div>
              <p className="text-sm text-muted-foreground">
                Nền tảng mua sắm toàn cầu - Gửi yêu cầu, nhận báo giá, theo dõi đơn hàng một cách dễ dàng.
              </p>
            </div>
            <div className="space-y-4">
              <h4 className="text-sm font-semibold">Dịch vụ</h4>
              <ul className="space-y-2 text-sm">
                <li>
                  <Link to="/app" className="text-muted-foreground hover:text-primary">
                    Gửi Yêu cầu
                  </Link>
                </li>
                <li>
                  <Link to="/app?tab=requests" className="text-muted-foreground hover:text-primary">
                    Danh sách Yêu cầu
                  </Link>
                </li>
                <li>
                  <Link to="/app?tab=orders" className="text-muted-foreground hover:text-primary">
                    Theo dõi Đơn hàng
                  </Link>
                </li>
              </ul>
            </div>
            <div className="space-y-4">
              <h4 className="text-sm font-semibold">Hỗ trợ</h4>
              <ul className="space-y-2 text-sm">
                <li>
                  <Link to="#how-it-works" className="text-muted-foreground hover:text-primary">
                    Cách hoạt động
                  </Link>
                </li>
                <li>
                  <Link to="/contact" className="text-muted-foreground hover:text-primary">
                    Liên hệ Hỗ trợ
                  </Link>
                </li>
                <li>
                  <Link to="/app?tab=orders" className="text-muted-foreground hover:text-primary">
                    Chính sách Bảo hành
                  </Link>
                </li>
              </ul>
            </div>
            <div className="space-y-4">
              <h4 className="text-sm font-semibold">Thông tin</h4>
              <ul className="space-y-2 text-sm">
                <li>
                  <Link to="#testimonials" className="text-muted-foreground hover:text-primary">
                    Đánh giá Khách hàng
                  </Link>
                </li>
                <li>
                  <Link to="/about" className="text-muted-foreground hover:text-primary">
                    Về chúng tôi
                  </Link>
                </li>
                <li>
                  <Link to="/privacy" className="text-muted-foreground hover:text-primary">
                    Chính sách Bảo mật
                  </Link>
                </li>
              </ul>
            </div>
          </div>
          <div className="mt-8 border-t pt-8 text-center text-sm text-muted-foreground">
            <p>&copy; {new Date().getFullYear()} GlobalShopper. Mua sắm toàn cầu, trải nghiệm địa phương.</p>
          </div>
        </div>
      </footer>
  )
}

export default Footer