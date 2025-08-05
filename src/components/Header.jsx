import { Link, useNavigate } from "react-router-dom";
import { Button } from "./ui/button";
import GShopLogo from "@/assets/LOGO_Gshop.png";
import { useDispatch, useSelector } from "react-redux";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import {
  User,
  Package,
  LogOut,
  CalendarIcon as CalendarArrowUp,
  ArrowDownUp,
  Wallet,
  Plus,
  Undo2,
  ChevronDown,
  ShoppingCart,
  Globe,
  DollarSign,
  FileText,
  Shield,
  RefreshCw,
  Eye,
} from "lucide-react";
import { signout } from "@/features/user";
import defaultAvt from "@/assets/defaultAvt.jpg";
import gshopApi, { useGetWalletQuery } from "@/services/gshopApi";
import { Skeleton } from "@/components/ui/skeleton";

const Header = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { data: wallet, isLoading: isWalletLoading } = useGetWalletQuery();
  const isLoggedIn = useSelector(
    (state) => state.rootReducer?.user?.isLoggedIn
  );
  const name =
    useSelector((state) => state.rootReducer?.user?.name) || "Người dùng";
  const email = useSelector((state) => state.rootReducer?.user?.email);
  const avatar = useSelector((state) => state.rootReducer?.user?.avatar);

  const handleSignout = () => {
    dispatch(gshopApi.util.resetApiState());
    dispatch(signout());
    navigate("/");
  };

  const formatCurrency = (amount) => {
    return new Intl.NumberFormat("vi-VN", {
      style: "currency",
      currency: "VND",
    }).format(amount || 0);
  };

  return (
    <header className="sticky top-0 z-50 w-full border-b border-white/10 bg-white/80 backdrop-blur-xl supports-[backdrop-filter]:bg-white/60 shadow-lg shadow-black/5">
      <div className="container mx-auto flex h-20 items-center justify-between px-6 md:px-8 lg:px-16 xl:px-24 max-w-8xl">
        {/* Logo Section */}
        <div className="flex-shrink-0 w-64">
          <Link
            to="/"
            className="group flex items-center space-x-3 transition-transform hover:scale-105 duration-300"
          >
            <div className="relative">
              <img
                src={GShopLogo || "/placeholder.svg"}
                alt="Global Shopper Logo"
                className="h-12 w-12 rounded-lg shadow-md group-hover:shadow-lg transition-shadow duration-300"
              />
            </div>
            <div className="hidden md:block">
              <span className="text-xl font-bold text-slate-800 group-hover:text-blue-600 transition-colors duration-300">
                Global Shopper
              </span>
              <div className="text-xs text-slate-500 font-medium">
                Mua sắm toàn cầu
              </div>
            </div>
          </Link>
        </div>

        {/* Navigation - Center */}
        <div className="flex-1 flex justify-center max-w-4xl">
          <nav className="hidden lg:flex items-center space-x-8 xl:space-x-10">
            <Link
              to="/"
              className="relative text-base font-medium text-slate-700 hover:text-blue-600 transition-all duration-300 group py-2"
            >
              Trang chủ
              <span className="absolute -bottom-1 left-0 w-0 h-0.5 bg-blue-500 group-hover:w-full transition-all duration-300 rounded-full"></span>
            </Link>

            {/* Dịch vụ Dropdown */}
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <button className="relative flex items-center space-x-1 text-base font-medium text-slate-700 hover:text-blue-600 transition-all duration-300 group py-2">
                  <span>Dịch vụ</span>
                  <ChevronDown className="h-3 w-3 transition-transform duration-300" />
                  <span className="absolute -bottom-1 left-0 w-0 h-0.5 bg-blue-500 group-hover:w-full transition-all duration-300 rounded-full"></span>
                </button>
              </DropdownMenuTrigger>
              <DropdownMenuContent className="w-64 mt-2 bg-white/95 backdrop-blur-xl shadow-xl border-0">
                <DropdownMenuItem
                  className="p-0 hover:bg-blue-50 focus:bg-blue-50"
                  asChild
                >
                  <Link
                    to="/create-request/with-link"
                    className="group flex items-center px-4 py-3 w-full hover:bg-blue-50 transition-colors duration-200"
                  >
                    <div>
                      <div className="text-sm font-medium text-slate-700 group-hover:text-blue-700">
                        Mua hàng qua sàn TMĐT
                      </div>
                      <div className="text-xs text-slate-500 group-hover:text-blue-600">
                        Amazon, eBay, Alibaba...
                      </div>
                    </div>
                  </Link>
                </DropdownMenuItem>
                <DropdownMenuItem
                  className="p-0 hover:bg-blue-50 focus:bg-blue-50"
                  asChild
                >
                  <Link
                    to="/create-request/without-link"
                    className="group flex items-center px-4 py-3 w-full hover:bg-blue-50 transition-colors duration-200"
                  >
                    <div>
                      <div className="text-sm font-medium text-slate-700 group-hover:text-blue-700">
                        Mua hàng nội địa nước ngoài
                      </div>
                      <div className="text-xs text-slate-500 group-hover:text-blue-600">
                        Mua trực tiếp tại nước ngoài
                      </div>
                    </div>
                  </Link>
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>

            <Link
              to="/pricing"
              className="relative text-base font-medium text-slate-700 hover:text-blue-600 transition-all duration-300 group py-2"
            >
              Bảng giá
              <span className="absolute -bottom-1 left-0 w-0 h-0.5 bg-blue-500 group-hover:w-full transition-all duration-300 rounded-full"></span>
            </Link>

            {/* Chính sách Dropdown */}
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <button className="relative flex items-center space-x-1 text-base font-medium text-slate-700 hover:text-blue-600 transition-all duration-300 group py-2">
                  <span>Chính sách</span>
                  <ChevronDown className="h-3 w-3 transition-transform duration-300" />
                  <span className="absolute -bottom-1 left-0 w-0 h-0.5 bg-blue-500 group-hover:w-full transition-all duration-300 rounded-full"></span>
                </button>
              </DropdownMenuTrigger>
              <DropdownMenuContent className="w-64 mt-2 bg-white/95 backdrop-blur-xl shadow-xl border-0">
                <DropdownMenuItem
                  className="p-0 hover:bg-blue-50 focus:bg-blue-50"
                  asChild
                >
                  <Link
                    to="/policies/terms"
                    className="group flex items-center px-4 py-3 w-full hover:bg-blue-50 transition-colors duration-200"
                  >
                    <span className="text-sm font-medium text-slate-700 group-hover:text-blue-700">
                      Điều khoản dịch vụ
                    </span>
                  </Link>
                </DropdownMenuItem>
                <DropdownMenuItem
                  className="p-0 hover:bg-blue-50 focus:bg-blue-50"
                  asChild
                >
                  <Link
                    to="/policies/refund"
                    className="group flex items-center px-4 py-3 w-full hover:bg-blue-50 transition-colors duration-200"
                  >
                    <span className="text-sm font-medium text-slate-700 group-hover:text-blue-700">
                      Chính sách hoàn tiền
                    </span>
                  </Link>
                </DropdownMenuItem>
                <DropdownMenuItem
                  className="p-0 hover:bg-blue-50 focus:bg-blue-50"
                  asChild
                >
                  <Link
                    to="/policies/privacy"
                    className="group flex items-center px-4 py-3 w-full hover:bg-blue-50 transition-colors duration-200"
                  >
                    <span className="text-sm font-medium text-slate-700 group-hover:text-blue-700">
                      Chính sách bảo mật
                    </span>
                  </Link>
                </DropdownMenuItem>
                <DropdownMenuItem
                  className="p-0 hover:bg-blue-50 focus:bg-blue-50"
                  asChild
                >
                  <Link
                    to="/policies/return"
                    className="group flex items-center px-4 py-3 w-full hover:bg-blue-50 transition-colors duration-200"
                  >
                    <span className="text-sm font-medium text-slate-700 group-hover:text-blue-700">
                      Chính sách hoàn trả
                    </span>
                  </Link>
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>

            <Link
              to="/contact"
              className="relative text-base font-medium text-slate-700 hover:text-blue-600 transition-all duration-300 group py-2"
            >
              Liên hệ
              <span className="absolute -bottom-1 left-0 w-0 h-0.5 bg-blue-500 group-hover:w-full transition-all duration-300 rounded-full"></span>
            </Link>
          </nav>
        </div>

        {/* Auth Section */}
        <div className="flex-shrink-0 w-64 flex justify-end ml-12">
          <div className="flex items-center space-x-4">
            {!isLoggedIn ? (
              <div className="flex items-center space-x-3">
                <Button
                  variant="ghost"
                  size="sm"
                  className="hidden sm:inline-flex px-6 py-2.5 text-base font-semibold text-slate-800 bg-white/90 hover:bg-blue-50 hover:text-blue-600 border border-slate-200 hover:border-blue-200 rounded-full transition-all duration-300 shadow-md hover:shadow-lg backdrop-blur-sm"
                  asChild
                >
                  <Link to="/login">Đăng nhập</Link>
                </Button>

                {/* Divider */}
                <div className="hidden sm:block w-px h-6 bg-slate-300"></div>

                <Button
                  size="sm"
                  className="px-6 py-2.5 text-base font-semibold bg-gradient-to-r from-blue-600 to-blue-700 hover:from-blue-700 hover:to-blue-800 text-white rounded-full shadow-lg hover:shadow-xl transition-all duration-300 transform hover:scale-105"
                  asChild
                >
                  <Link to="/signup">Đăng ký</Link>
                </Button>
              </div>
            ) : (
              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <div className="flex items-center space-x-3 cursor-pointer group">
                    {/* Wallet Balance Preview */}
                    <div className="hidden md:flex items-center space-x-2 px-3 py-2 bg-blue-50 rounded-full border border-blue-100 group-hover:shadow-md transition-all duration-300">
                      <Wallet className="h-4 w-4 text-blue-600" />
                      <div className="text-sm font-semibold text-blue-700">
                        {isWalletLoading ? (
                          <Skeleton className="h-4 w-16" />
                        ) : (
                          formatCurrency(wallet?.balance)
                        )}
                      </div>
                    </div>

                    {/* Avatar */}
                    <div className="relative">
                      <div className="absolute -inset-0.5 bg-blue-500 rounded-full opacity-0 group-hover:opacity-20 transition-opacity duration-300 blur-sm"></div>
                      <img
                        src={avatar ? avatar : defaultAvt}
                        alt="User Avatar"
                        width={40}
                        height={40}
                        className="relative h-10 w-10 rounded-full border-2 border-white object-cover shadow-lg group-hover:shadow-xl transition-all duration-300"
                      />
                      <div className="absolute -bottom-1 -right-1 h-4 w-4 bg-green-500 border-2 border-white rounded-full"></div>
                    </div>
                  </div>
                </DropdownMenuTrigger>
                <DropdownMenuContent
                  className="w-80 mt-2 border-0 shadow-2xl bg-white/95 backdrop-blur-xl"
                  align="end"
                  forceMount
                >
                  {/* User Info Header */}
                  <div className="p-4 bg-blue-50 border-b border-slate-100">
                    <div className="flex items-center space-x-3">
                      <img
                        src={avatar ? avatar : defaultAvt}
                        alt="User Avatar"
                        className="h-12 w-12 rounded-full border-2 border-white shadow-lg object-cover"
                      />
                      <div className="flex-1">
                        <p className="text-sm font-semibold text-slate-800">
                          {name}
                        </p>
                        <p className="text-xs text-slate-500">{email}</p>
                      </div>
                    </div>
                  </div>

                  {/* Wallet Section */}
                  <div className="p-4 border-b border-slate-100">
                    <div className="flex items-center justify-between p-3 rounded-xl bg-blue-50 border border-blue-200">
                      <div className="flex items-center space-x-3">
                        <div className="p-2 rounded-full bg-blue-100">
                          <Wallet className="h-5 w-5 text-blue-600" />
                        </div>
                        <div>
                          <p className="text-xs text-slate-500 font-medium">
                            Số dư ví
                          </p>
                          {isWalletLoading ? (
                            <Skeleton className="h-5 w-24 mt-1" />
                          ) : (
                            <p className="text-lg font-bold text-blue-700">
                              {formatCurrency(wallet?.balance)}
                            </p>
                          )}
                        </div>
                      </div>
                      <Button
                        size="sm"
                        className="h-10 w-10 p-0 bg-blue-600 hover:bg-blue-700 shadow-lg hover:shadow-xl transition-all duration-300"
                        asChild
                      >
                        <Link to="/account-center/wallet/deposit">
                          <Plus className="h-4 w-4" />
                        </Link>
                      </Button>
                    </div>
                  </div>
                  {/* Navigation Items */}
                  <div className="py-2">
                    {[
                      {
                        to: "/account-center/purchase-request-list?page=1&size=10",
                        text: "Yêu cầu mua hàng",
                        icon: CalendarArrowUp,
                      },
                      {
                        to: "/orders",
                        text: "Đơn hàng của tôi",
                        icon: Package,
                      },
                      {
                        to: "/account-center",
                        text: "Quản lý tài khoản",
                        icon: User,
                      },
                      {
                        to: "/account-center/wallet",
                        text: "Quản lý ví",
                        icon: Wallet,
                      },
                      {
                        to: "/account-center",
                        text: "Yêu cầu trả hàng & hoàn tiền",
                        icon: Undo2,
                      },
                    ].map((item, index) => {
                      const IconComponent = item.icon;
                      return (
                        <DropdownMenuItem key={index} asChild>
                          <Link
                            to={item.to}
                            className="group flex items-center px-4 py-3 hover:bg-blue-50 transition-colors duration-200"
                          >
                            <div className="p-2 rounded-lg bg-slate-100 group-hover:bg-blue-100 mr-3 transition-colors duration-200">
                              <IconComponent className="h-4 w-4 text-slate-600 group-hover:text-blue-600 transition-colors duration-200" />
                            </div>
                            <span className="text-sm font-medium text-slate-700">
                              {item.text}
                            </span>
                          </Link>
                        </DropdownMenuItem>
                      );
                    })}
                  </div>

                  {/* Logout */}
                  <div className="border-t border-slate-100 pt-2">
                    <DropdownMenuItem
                      onClick={handleSignout}
                      className="mx-2 mb-2 text-red-600 hover:text-red-700 hover:bg-red-50 focus:text-red-700 focus:bg-red-50 rounded-lg transition-colors duration-200"
                    >
                      <div className="p-2 rounded-lg bg-red-100 mr-3">
                        <LogOut className="h-4 w-4 text-red-600" />
                      </div>
                      <span className="text-sm font-medium">Đăng xuất</span>
                    </DropdownMenuItem>
                  </div>
                </DropdownMenuContent>
              </DropdownMenu>
            )}
          </div>
        </div>
      </div>
    </header>
  );
};

export default Header;
