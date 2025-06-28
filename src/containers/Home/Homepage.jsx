import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import {
  ArrowRight,
  CheckCircle,
  ShoppingCart,
  Users,
  BarChart3,
  Shield,
  Clock,
  Zap,
  FileText,
  Settings,
  Star,
  ChevronRight,
  Package,
  Search,
  UserCheck,
} from "lucide-react"
import { Link } from "react-router-dom"

export default function Homepage() {
  return (
    <div className="min-h-screen bg-white">
      <main>
        {/* Hero Section */}
        <section className="py-6 md:py-12 lg:py-16">
          <div className="container px-4 md:px-6">
            <div className="grid gap-6 lg:grid-cols-[1fr_400px] lg:gap-12 xl:grid-cols-[1fr_600px]">
              <div className="flex flex-col justify-center space-y-4">
                <div className="space-y-2">
                  <Badge variant="secondary" className="w-fit">
                    Mua sắm quốc tế dễ dàng với GlobalShopper
                  </Badge>
                  <h1 className="text-3xl font-bold tracking-tighter sm:text-5xl xl:text-6xl/none">
                    Tạo yêu cầu mua hàng chỉ với một vài bước
                  </h1>
                  <p className="max-w-[600px] text-muted-foreground md:text-xl">
                    Gửi yêu cầu mua hàng với hoặc không có link sản phẩm. Chúng tôi sẽ tìm kiếm và báo giá tốt nhất cho bạn.
                  </p>
                </div>
                <div className="flex flex-col gap-2 min-[400px]:flex-row">
                  <Button size="lg" className="h-12 px-8" asChild>
                    <Link to="/app">
                      Gửi Yêu cầu Mua hàng
                      <ArrowRight className="ml-2 h-5 w-5" />
                    </Link>
                  </Button>
                  <Button variant="outline" size="lg" className="h-12 px-8 bg-white text-black" asChild>
                    <Link to="#how-it-works">Tìm hiểu thêm</Link>
                  </Button>
                </div>
                <div className="flex items-center space-x-4 text-sm text-muted-foreground">
                  <div className="flex items-center">
                    <CheckCircle className="mr-2 h-4 w-4 text-green-500" />
                    Gửi yêu cầu dễ dàng
                  </div>
                  <div className="flex items-center">
                    <CheckCircle className="mr-2 h-4 w-4 text-green-500" />
                    Báo giá nhanh chóng
                  </div>
                  <div className="flex items-center">
                    <CheckCircle className="mr-2 h-4 w-4 text-green-500" />
                    Theo dõi đơn hàng & thông tin vận chuyển nhanh chóng
                  </div>
                </div>
              </div>
              <div className="flex items-center justify-center">
                <img
                  src="/placeholder.svg?height=400&width=600"
                  width={600}
                  height={400}
                  alt="Xem trước Bảng điều khiển GlobalShopper"
                  className="aspect-video overflow-hidden rounded-xl object-cover shadow-2xl"
                />
              </div>
            </div>
          </div>
        </section>

        {/* Quick Access Section */}
        <section className="py-12 bg-muted/50">
          <div className="container px-4 md:px-6">
            <div className="text-center mb-8">
              <h2 className="text-2xl font-bold mb-2">Truy cập Nhanh</h2>
              <p className="text-muted-foreground">Đi thẳng đến các tính năng bạn cần</p>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6 max-w-4xl mx-auto">
              <Card className="hover:shadow-lg transition-shadow cursor-pointer" asChild>
                <Link to="/app">
                  <CardHeader className="text-center">
                    <div className="mx-auto flex h-12 w-12 items-center justify-center rounded-lg bg-blue-100">
                      <FileText className="h-6 w-6 text-blue-600" />
                    </div>
                    <CardTitle className="text-lg">Gửi Yêu cầu</CardTitle>
                    <CardDescription>Gửi yêu cầu mua hàng với hoặc không có link sản phẩm</CardDescription>
                  </CardHeader>
                </Link>
              </Card>

              <Card className="hover:shadow-lg transition-shadow cursor-pointer" asChild>
                <Link to="/app?tab=requests">
                  <CardHeader className="text-center">
                    <div className="mx-auto flex h-12 w-12 items-center justify-center rounded-lg bg-green-100">
                      <Package className="h-6 w-6 text-green-600" />
                    </div>
                    <CardTitle className="text-lg">Danh sách Yêu cầu</CardTitle>
                    <CardDescription>Xem báo giá và tạo đơn hàng từ yêu cầu</CardDescription>
                  </CardHeader>
                </Link>
              </Card>

              <Card className="hover:shadow-lg transition-shadow cursor-pointer" asChild>
                <Link to="/app?tab=orders">
                  <CardHeader className="text-center">
                    <div className="mx-auto flex h-12 w-12 items-center justify-center rounded-lg bg-purple-100">
                      <Clock className="h-6 w-6 text-purple-600" />
                    </div>
                    <CardTitle className="text-lg">Theo dõi Đơn hàng</CardTitle>
                    <CardDescription>Kiểm tra trạng thái và thông tin vận chuyển</CardDescription>
                  </CardHeader>
                </Link>
              </Card>
            </div>
          </div>
        </section>

        {/* Features Section */}
        <section id="features" className="py-6 md:py-12 lg:py-16">
          <div className="container px-4 md:px-6">
            <div className="flex flex-col items-center justify-center space-y-4 text-center">
              <div className="space-y-2">
                <Badge variant="secondary">Tính năng Cốt lõi</Badge>
                <h2 className="text-3xl font-bold tracking-tighter sm:text-5xl">Quy trình mua sắm đơn giản</h2>
                <p className="max-w-[900px] text-muted-foreground md:text-xl/relaxed lg:text-base/relaxed xl:text-xl/relaxed">
                  Từ yêu cầu đến nhận hàng, mọi thứ đều được tối ưu hóa cho trải nghiệm của bạn.
                </p>
              </div>
            </div>
            <div className="mx-auto grid max-w-6xl items-start gap-6 py-12 lg:grid-cols-2 lg:gap-12">
              <div className="grid gap-6">
                <Card className="hover:shadow-lg transition-shadow">
                  <CardHeader>
                    <div className="flex items-center space-x-2">
                      <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-blue-100">
                        <FileText className="h-5 w-5 text-blue-600" />
                      </div>
                      <CardTitle>Gửi Yêu cầu Linh hoạt</CardTitle>
                    </div>
                  </CardHeader>
                  <CardContent>
                    <CardDescription className="mb-4">
                      Gửi yêu cầu mua hàng với link sản phẩm hoặc mô tả sản phẩm bạn cần. Chúng tôi sẽ tìm kiếm và báo giá tốt nhất.
                    </CardDescription>
                    <Button variant="outline" size="sm" asChild>
                      <Link to="/app">
                        Tạo Yêu cầu
                        <ArrowRight className="ml-2 h-4 w-4" />
                      </Link>
                    </Button>
                  </CardContent>
                </Card>

                <Card className="hover:shadow-lg transition-shadow">
                  <CardHeader>
                    <div className="flex items-center space-x-2">
                      <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-green-100">
                        <Package className="h-5 w-5 text-green-600" />
                      </div>
                      <CardTitle>Báo giá và Tạo Đơn hàng</CardTitle>
                    </div>
                  </CardHeader>
                  <CardContent>
                    <CardDescription className="mb-4">
                      Xem báo giá từ yêu cầu của bạn và chọn sản phẩm để tạo đơn hàng một cách dễ dàng.
                    </CardDescription>
                    <Button variant="outline" size="sm" asChild>
                      <Link to="/app?tab=requests">
                        Xem Báo giá
                        <ArrowRight className="ml-2 h-4 w-4" />
                      </Link>
                    </Button>
                  </CardContent>
                </Card>

                <Card className="hover:shadow-lg transition-shadow">
                  <CardHeader>
                    <div className="flex items-center space-x-2">
                      <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-orange-100">
                        <Clock className="h-5 w-5 text-orange-600" />
                      </div>
                      <CardTitle>Theo dõi Đơn hàng Thời gian thực</CardTitle>
                    </div>
                  </CardHeader>
                  <CardContent>
                    <CardDescription className="mb-4">
                      Theo dõi trạng thái đơn hàng, thông tin vận chuyển và cập nhật thời gian thực từ khi đặt hàng đến khi nhận hàng.
                    </CardDescription>
                    <Button variant="outline" size="sm" asChild>
                      <Link to="/app?tab=orders">
                        Theo dõi Đơn hàng
                        <ArrowRight className="ml-2 h-4 w-4" />
                      </Link>
                    </Button>
                  </CardContent>
                </Card>
              </div>

              <div className="grid gap-6">
                <Card className="hover:shadow-lg transition-shadow">
                  <CardHeader>
                    <div className="flex items-center space-x-2">
                      <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-purple-100">
                        <Shield className="h-5 w-5 text-purple-600" />
                      </div>
                      <CardTitle>Bảo hành và Hoàn tiền</CardTitle>
                    </div>
                  </CardHeader>
                  <CardContent>
                    <CardDescription className="mb-4">
                      Đảm bảo chất lượng sản phẩm với chính sách bảo hành và hoàn tiền nếu sản phẩm có vấn đề.
                    </CardDescription>
                    <Button variant="outline" size="sm" asChild>
                      <Link to="/app?tab=orders">
                        Chính sách Bảo hành
                        <ArrowRight className="ml-2 h-4 w-4" />
                      </Link>
                    </Button>
                  </CardContent>
                </Card>

                <Card className="hover:shadow-lg transition-shadow">
                  <CardHeader>
                    <div className="flex items-center space-x-2">
                      <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-red-100">
                        <Users className="h-5 w-5 text-red-600" />
                      </div>
                      <CardTitle>Hỗ trợ Khách hàng</CardTitle>
                    </div>
                  </CardHeader>
                  <CardContent>
                    <CardDescription className="mb-4">
                      Đội ngũ hỗ trợ chuyên nghiệp sẵn sàng giúp đỡ bạn trong mọi bước của quá trình mua sắm.
                    </CardDescription>
                    <Button variant="outline" size="sm" asChild>
                      <Link to="/contact">
                        Liên hệ Hỗ trợ
                        <ArrowRight className="ml-2 h-4 w-4" />
                      </Link>
                    </Button>
                  </CardContent>
                </Card>

                <Card className="hover:shadow-lg transition-shadow">
                  <CardHeader>
                    <div className="flex items-center space-x-2">
                      <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-teal-100">
                        <BarChart3 className="h-5 w-5 text-teal-600" />
                      </div>
                      <CardTitle>Lịch sử Mua sắm</CardTitle>
                    </div>
                  </CardHeader>
                  <CardContent>
                    <CardDescription className="mb-4">
                      Xem lại tất cả yêu cầu và đơn hàng đã thực hiện để dễ dàng tham khảo và đặt hàng lại.
                    </CardDescription>
                    <Button variant="outline" size="sm" asChild>
                      <Link to="/app?tab=orders">
                        Xem Lịch sử
                        <ArrowRight className="ml-2 h-4 w-4" />
                      </Link>
                    </Button>
                  </CardContent>
                </Card>
              </div>
            </div>
          </div>
        </section>

        {/* How It Works Section */}
        <section id="how-it-works" className="py-6 md:py-12 lg:py-16">
          <div className="container px-4 md:px-6">
            <div className="flex flex-col items-center justify-center space-y-4 text-center">
              <div className="space-y-2">
                <Badge variant="secondary">Quy trình</Badge>
                <h2 className="text-3xl font-bold tracking-tighter sm:text-5xl">GlobalShopper hoạt động như thế nào</h2>
                <p className="max-w-[900px] text-muted-foreground md:text-xl/relaxed lg:text-base/relaxed xl:text-xl/relaxed">
                  Quy trình đơn giản, trực quan mà ai cũng có thể làm theo.
                </p>
              </div>
            </div>
            <div className="mx-auto grid max-w-5xl items-start gap-8 py-12 lg:grid-cols-4">
              <div className="text-center space-y-4">
                <div className="mx-auto flex h-16 w-16 items-center justify-center rounded-full bg-blue-100 text-blue-600 font-bold text-xl">
                  1
                </div>
                <h3 className="text-lg font-semibold">Gửi Yêu cầu</h3>
                <p className="text-sm text-muted-foreground">
                  Gửi yêu cầu mua hàng với link sản phẩm hoặc mô tả sản phẩm bạn cần.
                </p>
                <Button variant="outline" size="sm" asChild>
                  <Link to="/app">Gửi ngay</Link>
                </Button>
              </div>

              <div className="text-center space-y-4">
                <div className="mx-auto flex h-16 w-16 items-center justify-center rounded-full bg-green-100 text-green-600 font-bold text-xl">
                  2
                </div>
                <h3 className="text-lg font-semibold">Nhận Báo giá</h3>
                <p className="text-sm text-muted-foreground">
                  Chúng tôi tìm kiếm và gửi báo giá tốt nhất cho sản phẩm bạn yêu cầu.
                </p>
                <Button variant="outline" size="sm" asChild>
                  <Link to="/app?tab=requests">Xem Báo giá</Link>
                </Button>
              </div>

              <div className="text-center space-y-4">
                <div className="mx-auto flex h-16 w-16 items-center justify-center rounded-full bg-orange-100 text-orange-600 font-bold text-xl">
                  3
                </div>
                <h3 className="text-lg font-semibold">Tạo Đơn hàng</h3>
                <p className="text-sm text-muted-foreground">
                  Chọn sản phẩm từ báo giá và tạo đơn hàng để tiến hành mua sắm.
                </p>
                <Button variant="outline" size="sm" asChild>
                  <Link to="/app?tab=requests">Tạo Đơn hàng</Link>
                </Button>
              </div>

              <div className="text-center space-y-4">
                <div className="mx-auto flex h-16 w-16 items-center justify-center rounded-full bg-purple-100 text-purple-600 font-bold text-xl">
                  4
                </div>
                <h3 className="text-lg font-semibold">Theo dõi & Nhận hàng</h3>
                <p className="text-sm text-muted-foreground">
                  Theo dõi trạng thái đơn hàng và thông tin vận chuyển cho đến khi nhận hàng.
                </p>
                <Button variant="outline" size="sm" asChild>
                  <Link to="/app?tab=orders">Theo dõi Đơn hàng</Link>
                </Button>
              </div>
            </div>
          </div>
        </section>

        {/* Benefits Section */}
        <section id="benefits" className="py-6 md:py-12 lg:py-16 bg-muted/50">
          <div className="container px-4 md:px-6">
            <div className="flex flex-col items-center justify-center space-y-4 text-center">
              <div className="space-y-2">
                <Badge variant="secondary">Lợi ích Chính</Badge>
                <h2 className="text-3xl font-bold tracking-tighter sm:text-5xl">Tại sao chọn GlobalShopper?</h2>
                <p className="max-w-[900px] text-muted-foreground md:text-xl/relaxed lg:text-base/relaxed xl:text-xl/relaxed">
                  Trải nghiệm mua sắm tối ưu với những lợi ích vượt trội.
                </p>
              </div>
            </div>
            <div className="mx-auto grid max-w-5xl items-center gap-6 py-12 lg:grid-cols-3 lg:gap-12">
              <Card className="text-center">
                <CardHeader>
                  <div className="mx-auto flex h-12 w-12 items-center justify-center rounded-lg bg-green-100 mb-4">
                    <Zap className="h-6 w-6 text-green-600" />
                  </div>
                  <CardTitle>Gửi Yêu cầu Dễ dàng</CardTitle>
                </CardHeader>
                <CardContent>
                  <CardDescription>
                    Gửi yêu cầu mua hàng chỉ trong vài phút, có hoặc không có link sản phẩm.
                  </CardDescription>
                </CardContent>
              </Card>

              <Card className="text-center">
                <CardHeader>
                  <div className="mx-auto flex h-12 w-12 items-center justify-center rounded-lg bg-blue-100 mb-4">
                    <Shield className="h-6 w-6 text-blue-600" />
                  </div>
                  <CardTitle>Bảo hành Đảm bảo</CardTitle>
                </CardHeader>
                <CardContent>
                  <CardDescription>
                    Chính sách bảo hành và hoàn tiền rõ ràng nếu sản phẩm có vấn đề.
                  </CardDescription>
                </CardContent>
              </Card>

              <Card className="text-center">
                <CardHeader>
                  <div className="mx-auto flex h-12 w-12 items-center justify-center rounded-lg bg-purple-100 mb-4">
                    <Users className="h-6 w-6 text-purple-600" />
                  </div>
                  <CardTitle>Hỗ trợ 24/7</CardTitle>
                </CardHeader>
                <CardContent>
                  <CardDescription>
                    Đội ngũ hỗ trợ chuyên nghiệp sẵn sàng giúp đỡ bạn mọi lúc.
                  </CardDescription>
                </CardContent>
              </Card>
            </div>
          </div>
        </section>

        {/* Testimonials Section */}
        <section id="testimonials" className="py-6 md:py-12 lg:py-16">
          <div className="container px-4 md:px-6">
            <div className="flex flex-col items-center justify-center space-y-4 text-center">
              <div className="space-y-2">
                <h2 className="text-3xl font-bold tracking-tighter sm:text-5xl">Khách hàng nói gì</h2>
                <p className="max-w-[900px] text-muted-foreground md:text-xl/relaxed lg:text-base/relaxed xl:text-xl/relaxed">
                  Phản hồi thực tế từ khách hàng sử dụng GlobalShopper.
                </p>
              </div>
            </div>
            <div className="mx-auto grid max-w-5xl items-center gap-6 py-12 lg:grid-cols-3 lg:gap-12">
              <Card>
                <CardHeader>
                  <div className="flex items-center space-x-1">
                    {[...Array(5)].map((_, i) => (
                      <Star key={i} className="h-4 w-4 fill-yellow-400 text-yellow-400" />
                    ))}
                  </div>
                </CardHeader>
                <CardContent>
                  <blockquote className="text-lg">
                    "Gửi yêu cầu mua hàng thật dễ dàng. Chỉ cần mô tả sản phẩm tôi cần và nhận được báo giá nhanh chóng."
                  </blockquote>
                  <div className="mt-4">
                    <div className="font-semibold">Nguyễn Văn An</div>
                    <div className="text-sm text-muted-foreground">Khách hàng cá nhân</div>
                  </div>
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <div className="flex items-center space-x-1">
                    {[...Array(5)].map((_, i) => (
                      <Star key={i} className="h-4 w-4 fill-yellow-400 text-yellow-400" />
                    ))}
                  </div>
                </CardHeader>
                <CardContent>
                  <blockquote className="text-lg">
                    "Theo dõi đơn hàng rất thuận tiện. Tôi biết chính xác khi nào hàng sẽ đến và trạng thái vận chuyển."
                  </blockquote>
                  <div className="mt-4">
                    <div className="font-semibold">Trần Thị Bình</div>
                    <div className="text-sm text-muted-foreground">Doanh nghiệp nhỏ</div>
                  </div>
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <div className="flex items-center space-x-1">
                    {[...Array(5)].map((_, i) => (
                      <Star key={i} className="h-4 w-4 fill-yellow-400 text-yellow-400" />
                    ))}
                  </div>
                </CardHeader>
                <CardContent>
                  <blockquote className="text-lg">
                    "Dịch vụ hoàn tiền rất tốt khi sản phẩm có vấn đề. Hỗ trợ khách hàng rất nhiệt tình và chuyên nghiệp."
                  </blockquote>
                  <div className="mt-4">
                    <div className="font-semibold">Lê Văn Cường</div>
                    <div className="text-sm text-muted-foreground">Khách hàng thường xuyên</div>
                  </div>
                </CardContent>
              </Card>
            </div>
          </div>
        </section>

        {/* Final CTA Section */}
        <section className="py-6 md:py-12 lg:py-16">
          <div className="container px-4 md:px-6">
            <div className="flex flex-col items-center justify-center space-y-4 text-center">
              <div className="space-y-2">
                <h2 className="text-3xl font-bold tracking-tighter sm:text-5xl">
                  Sẵn sàng bắt đầu mua sắm?
                </h2>
                <p className="max-w-[900px] text-muted-foreground md:text-xl/relaxed lg:text-base/relaxed xl:text-xl/relaxed">
                  Tham gia cùng hàng nghìn khách hàng đã tin tưởng GlobalShopper cho nhu cầu mua sắm của họ.
                </p>
              </div>
              <div className="flex flex-col gap-2 min-[400px]:flex-row">
                <Button size="lg" className="h-12 px-8" asChild>
                  <Link to="/app">
                    Gửi Yêu cầu Đầu tiên
                    <ArrowRight className="ml-2 h-5 w-5" />
                  </Link>
                </Button>
                <Button variant="outline" size="lg" className="h-12 px-8 bg-white text-black" asChild>
                  <Link to="/contact">Liên hệ Hỗ trợ</Link>
                </Button>
              </div>
              <div className="flex items-center space-x-4 text-sm text-muted-foreground">
                <div className="flex items-center">
                  <CheckCircle className="mr-2 h-4 w-4 text-green-500" />
                  Miễn phí đăng ký
                </div>
                <div className="flex items-center">
                  <CheckCircle className="mr-2 h-4 w-4 text-green-500" />
                  Không phí ẩn
                </div>
                <div className="flex items-center">
                  <CheckCircle className="mr-2 h-4 w-4 text-green-500" />
                  Bảo hành đảm bảo
                </div>
              </div>
            </div>
          </div>
        </section>
      </main>
    </div>
  )
}
