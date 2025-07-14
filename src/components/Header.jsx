import { Link, useNavigate } from "react-router-dom"
import { Button } from "./ui/button"
import GShopLogo from "@/assets/LOGO_Gshop.png"
import { useDispatch, useSelector } from "react-redux"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import {
  User,
  Package,
  LogOut,
  CalendarIcon as CalendarArrowUp,
  ArrowDownUp,
  Wallet,
  Plus,
  Undo2,
} from "lucide-react"
import { signout } from "@/features/user"
import defaultAvt from "@/assets/defaultAvt.jpg"
import { useGetWalletQuery } from "@/services/gshopApi"
import { Skeleton } from "@/components/ui/skeleton"

const Header = () => {
  const dispatch = useDispatch()
  const navigate = useNavigate()
  const { data: wallet, isLoading: isWalletLoading } = useGetWalletQuery()
  const isLoggedIn = useSelector((state) => state.rootReducer?.user?.isLoggedIn)
  const name = useSelector((state) => state.rootReducer?.user?.name) || "Người dùng"
  const email = useSelector((state) => state.rootReducer?.user?.email)
  const avatar = useSelector((state) => state.rootReducer?.user?.avatar)

  const handleSignout = () => {
    dispatch(signout())
    navigate("/login")
  }

  const formatCurrency = (amount) => {
    return new Intl.NumberFormat("vi-VN", {
      style: "currency",
      currency: "VND",
    }).format(amount || 0)
  }

  return (
    <header className="sticky top-0 z-50 w-full border-b bg-white/95 backdrop-blur supports-[backdrop-filter]:bg-white/60">
      <div className="container flex h-16 items-center justify-between px-4 md:px-32">
        <Link
          to="/"
        >
          <img
            src={GShopLogo || "/placeholder.svg"}
            alt="Logo"
            width={48}
            height={48}
            className="h-12 w-12"
          />
        </Link>

        <nav className=" md:flex items-center space-x-6">
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
          {!isLoggedIn ? (
            <Button variant="ghost" size="sm" className="hidden sm:inline-flex">
              <Link to="/login">Đăng nhập</Link>
            </Button>
          ) : (
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <img
                  src={avatar ? avatar : defaultAvt}
                  alt="User Avatar"
                  width={36}
                  height={36}
                  className="h-9 w-9 rounded-full border object-cover cursor-pointer hover:ring-2 hover:ring-primary/20 transition-all"
                />
              </DropdownMenuTrigger>
              <DropdownMenuContent className="w-64" align="end" forceMount>
                <DropdownMenuLabel className="font-normal">
                  <div className="flex flex-col space-y-1">
                    <p className="text-sm font-medium leading-none">{name}</p>
                    <p className="text-xs leading-none text-muted-foreground">{email}</p>
                  </div>
                </DropdownMenuLabel>
                <DropdownMenuSeparator />
                <div className="px-2 py-2">
                  <div className="flex items-center justify-between p-2 rounded-lg bg-gradient-to-r from-blue-50 to-indigo-50 border border-blue-100">
                    <div className="flex items-center space-x-2">
                      <div className="p-1.5 rounded-full bg-blue-100">
                        <Wallet className="h-4 w-4 text-blue-600" />
                      </div>
                      <div>
                        <p className="text-xs text-muted-foreground">Số dư ví</p>
                        {isWalletLoading ? (
                          <Skeleton className="h-4 w-20" />
                        ) : (
                          <p className="text-sm font-semibold text-blue-700">{formatCurrency(wallet?.balance)}</p>
                        )}
                      </div>
                    </div>
                    <Button size="sm" variant="ghost" className="h-8 w-8 p-0" asChild>
                      <Link to="/wallet/deposit">
                        <Plus className="h-4 w-4" />
                      </Link>
                    </Button>
                  </div>
                </div>
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
                <DropdownMenuSeparator />
                <DropdownMenuItem asChild>
                  <Link to="/account-center" className="flex items-center">
                    <User className="mr-2 h-4 w-4" />
                    <span>Quản lý tài khoản</span>
                  </Link>
                </DropdownMenuItem>
                <DropdownMenuItem asChild>
                  <Link to="/wallet/transactions" className="flex items-center">
                    <ArrowDownUp className="mr-2 h-4 w-4" />
                    <span>Lịch sử thanh toán</span>
                  </Link>
                </DropdownMenuItem>
                <DropdownMenuItem asChild>
                  <Link to="/wallet" className="flex items-center">
                    <Wallet className="mr-2 h-4 w-4" />
                    <span>Quản lý ví</span>
                  </Link>
                </DropdownMenuItem>
                <DropdownMenuItem asChild>
                  <Link to="/account-center" className="flex items-center">
                    <Undo2 className="mr-2 h-4 w-4" />
                    <span>Yêu cầu trả hàng & hoàn tiền</span>
                  </Link>
                </DropdownMenuItem>
                <DropdownMenuSeparator />

                <DropdownMenuItem onClick={handleSignout} className="text-red-600 focus:text-red-600">
                  <LogOut className="mr-2 h-4 w-4" />
                  <span>Đăng xuất</span>
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          )}
        </div>
      </div>
    </header>
  )
}

export default Header
