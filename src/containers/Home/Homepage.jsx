import { Button } from "@/components/ui/button";
import {
	Card,
	CardContent,
	CardDescription,
	CardHeader,
	CardTitle,
} from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import {
	ArrowRight,
	CheckCircle,
	Users,
	BarChart3,
	Shield,
	Clock,
	Zap,
	FileText,
	Star,
	Package,
} from "lucide-react";
import { Link } from "react-router-dom";
import heroImage from "@/assets/heroImage.jpg";

export default function Homepage() {
	return (
		<div className="min-h-screen bg-white">
			<main className="w-full max-w-none mx-auto">
				{/* Hero Section - Enhanced */}
				<section className="relative py-12 md:py-16 lg:py-20 overflow-hidden bg-gradient-to-br from-slate-50 via-blue-50 to-indigo-100">
					{/* Background decoration */}
					<div className="absolute inset-0 bg-gradient-to-r from-blue-500/8 to-indigo-500/8"></div>
					<div className="absolute top-0 left-0 w-72 h-72 bg-blue-400/30 rounded-full mix-blend-normal filter blur-3xl opacity-60 animate-blob"></div>
					<div className="absolute top-0 right-0 w-72 h-72 bg-indigo-400/30 rounded-full mix-blend-normal filter blur-3xl opacity-60 animate-blob animation-delay-2000"></div>
					<div className="absolute -bottom-8 left-20 w-72 h-72 bg-purple-400/25 rounded-full mix-blend-normal filter blur-3xl opacity-50 animate-blob animation-delay-4000"></div>

					<div className="container relative px-4 md:px-6 mx-auto max-w-7xl">
						<div className="grid gap-8 lg:grid-cols-[1fr_500px] lg:gap-16 xl:grid-cols-[1fr_650px] items-center justify-center">
							<div className="flex flex-col justify-center space-y-8">
								<div className="space-y-6">
									<h1 className="text-4xl font-bold tracking-tight sm:text-6xl xl:text-7xl bg-gradient-to-r from-gray-900 via-blue-900 to-indigo-900 bg-clip-text text-transparent leading-tight">
										Tạo yêu cầu mua hàng chỉ với một vài
										bước
									</h1>
									<p className="max-w-[600px] text-xl text-gray-600 leading-relaxed">
										GShop hỗ trợ mua hộ hàng từ quốc tế với
										quy trình đơn giản, không cần thẻ, không
										cần kinh nghiệm.
									</p>
								</div>
								<div className="flex flex-col gap-4 min-[400px]:flex-row">
									<Button
										size="lg"
										className="h-14 px-8 text-lg font-semibold bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700 shadow-xl hover:shadow-2xl transform hover:scale-105 transition-all duration-300"
										asChild
									>
										<Link to="/create-request">
											Gửi yêu cầu
											<ArrowRight className="ml-2 h-6 w-6" />
										</Link>
									</Button>
									<Button
										variant="outline"
										size="lg"
										className="h-14 px-8 text-lg font-semibold border-2 border-gray-300 hover:border-blue-300 hover:bg-blue-50 transition-all duration-300"
										asChild
									>
										<Link to="#how-it-works">
											Tìm hiểu thêm
										</Link>
									</Button>
								</div>
							</div>
							<div className="flex items-center justify-center relative">
								<div className="absolute inset-0 bg-gradient-to-r from-blue-400 to-indigo-600 rounded-3xl opacity-20 blur-3xl"></div>
								<img
									src={heroImage}
									width={650}
									height={450}
									alt="Xem trước Bảng điều khiển GlobalShopper"
									className="relative aspect-video w-full max-w-lg lg:max-w-none overflow-hidden rounded-2xl object-cover shadow-2xl border border-white/20"
								/>
							</div>
						</div>
					</div>
				</section>

				{/* How It Works Section - 3 bước sử dụng */}
				<section
					id="how-it-works"
					className="py-12 md:py-16 bg-gradient-to-br from-gray-50 to-blue-50 w-full relative"
				>
					{/* Smooth transition overlay */}
					<div className="absolute inset-0 bg-gradient-to-b from-transparent via-transparent to-white/20"></div>
					<div className="container mx-auto px-4 md:px-6 max-w-7xl relative z-10">
						<div className="flex flex-col items-center justify-center space-y-6 text-center mb-12">
							<div className="inline-flex items-center px-4 py-2 rounded-full bg-blue-100 border border-blue-200">
								<span className="text-sm font-semibold text-blue-700">
									✨ Quy trình đơn giản
								</span>
							</div>
							<h2 className="text-4xl md:text-5xl font-bold tracking-tight bg-gradient-to-r from-blue-900 to-indigo-900 bg-clip-text text-transparent leading-relaxed">
								3 bước sử dụng Global Shopper
							</h2>
							<p className="max-w-4xl text-lg text-gray-600 leading-tight">
								Quy trình đơn giản, trực quan mà ai cũng có thể
								làm theo chỉ trong vài phút.
							</p>
						</div>

						<div className="relative max-w-6xl mx-auto">
							{/* Connection lines with enhanced styling - more elegant design */}
							<div className="hidden lg:block absolute top-20 left-1/6 right-1/6 h-px bg-gradient-to-r from-transparent via-blue-300 to-transparent opacity-30"></div>
							<div className="hidden lg:block absolute top-20 left-1/4 right-1/4 h-px bg-gradient-to-r from-blue-300 via-indigo-400 to-blue-400 opacity-60"></div>
							{/* Dotted accent line */}
							<div className="hidden lg:block absolute top-[79px] left-1/4 right-1/4 h-px border-t border-dashed border-blue-300/40"></div>

							<div className="grid grid-cols-1 lg:grid-cols-3 gap-12 lg:gap-8">
								<div className="relative text-center group">
									{/* Enhanced number circle */}
									<div className="mx-auto relative mb-8">
										<div className="w-20 h-20 mx-auto flex items-center justify-center rounded-full bg-gradient-to-br from-blue-500 via-blue-600 to-indigo-600 text-white font-bold text-2xl shadow-2xl group-hover:scale-110 transition-all duration-500 relative z-10">
											1
										</div>
										<div className="absolute inset-0 w-20 h-20 mx-auto rounded-full bg-gradient-to-br from-blue-400 to-indigo-500 opacity-30 blur-lg group-hover:blur-xl transition-all duration-500"></div>
										<div className="absolute -inset-2 w-24 h-24 mx-auto rounded-full border-2 border-blue-200 opacity-50 group-hover:border-blue-300 group-hover:scale-110 transition-all duration-500"></div>
									</div>

									{/* Enhanced card design */}
									<div className="relative p-8 rounded-3xl bg-white shadow-xl hover:shadow-2xl transition-all duration-500 border border-blue-100 hover:border-blue-200 group-hover:-translate-y-2 overflow-hidden">
										{/* Gradient overlay */}
										<div className="absolute inset-0 bg-gradient-to-br from-blue-50/50 to-indigo-50/30 opacity-0 group-hover:opacity-100 transition-opacity duration-500"></div>
										{/* Animated background pattern */}
										<div className="absolute top-0 right-0 w-32 h-32 bg-gradient-to-br from-blue-100 to-transparent rounded-full -translate-y-16 translate-x-16 opacity-0 group-hover:opacity-100 transition-all duration-700"></div>

										<div className="relative z-10">
											<h3 className="text-2xl font-bold text-gray-900 mb-4 leading-tight">
												Gửi yêu cầu
											</h3>
											<p className="text-gray-600 leading-relaxed mb-6 text-base">
												Gửi yêu cầu mua hàng với link
												sản phẩm hoặc mô tả chi tiết sản
												phẩm bạn cần tìm.
											</p>
											<div className="flex justify-center">
												<Button
													variant="outline"
													size="lg"
													className="border-2 border-blue-200 text-blue-600 hover:bg-blue-50 hover:border-blue-300 font-semibold px-6 py-3 rounded-xl transition-all duration-300"
													asChild
												>
													<Link to="/create-request">
														Gửi ngay →
													</Link>
												</Button>
											</div>
										</div>
									</div>
								</div>

								<div className="relative text-center group">
									{/* Enhanced number circle */}
									<div className="mx-auto relative mb-8">
										<div className="w-20 h-20 mx-auto flex items-center justify-center rounded-full bg-gradient-to-br from-indigo-500 via-indigo-600 to-cyan-600 text-white font-bold text-2xl shadow-2xl group-hover:scale-110 transition-all duration-500 relative z-10">
											2
										</div>
										<div className="absolute inset-0 w-20 h-20 mx-auto rounded-full bg-gradient-to-br from-indigo-400 to-cyan-500 opacity-30 blur-lg group-hover:blur-xl transition-all duration-500"></div>
										<div className="absolute -inset-2 w-24 h-24 mx-auto rounded-full border-2 border-indigo-200 opacity-50 group-hover:border-indigo-300 group-hover:scale-110 transition-all duration-500"></div>
									</div>

									{/* Enhanced card design */}
									<div className="relative p-8 rounded-3xl bg-white shadow-xl hover:shadow-2xl transition-all duration-500 border border-indigo-100 hover:border-indigo-200 group-hover:-translate-y-2 overflow-hidden">
										{/* Gradient overlay */}
										<div className="absolute inset-0 bg-gradient-to-br from-indigo-50/50 to-cyan-50/30 opacity-0 group-hover:opacity-100 transition-opacity duration-500"></div>
										{/* Animated background pattern */}
										<div className="absolute top-0 right-0 w-32 h-32 bg-gradient-to-br from-indigo-100 to-transparent rounded-full -translate-y-16 translate-x-16 opacity-0 group-hover:opacity-100 transition-all duration-700"></div>

										<div className="relative z-10">
											<h3 className="text-2xl font-bold text-gray-900 mb-4 leading-tight">
												Nhận báo giá
											</h3>
											<p className="text-gray-600 leading-relaxed mb-6 text-base">
												Chúng tôi tìm kiếm từ nhiều
												nguồn và gửi báo giá tốt nhất,
												chi tiết cho sản phẩm bạn yêu
												cầu.
											</p>
											<div className="flex justify-center">
												<Button
													variant="outline"
													size="lg"
													className="border-2 border-indigo-200 text-indigo-600 hover:bg-indigo-50 hover:border-indigo-300 font-semibold px-6 py-3 rounded-xl transition-all duration-300"
													asChild
												>
													<Link to="/account-center/purchase-request-list?page=1&size=10">
														Xem báo giá →
													</Link>
												</Button>
											</div>
										</div>
									</div>
								</div>

								<div className="relative text-center group">
									{/* Enhanced number circle */}
									<div className="mx-auto relative mb-8">
										<div className="w-20 h-20 mx-auto flex items-center justify-center rounded-full bg-gradient-to-br from-blue-600 via-indigo-600 to-blue-700 text-white font-bold text-2xl shadow-2xl group-hover:scale-110 transition-all duration-500 relative z-10">
											3
										</div>
										<div className="absolute inset-0 w-20 h-20 mx-auto rounded-full bg-gradient-to-br from-blue-500 to-indigo-600 opacity-30 blur-lg group-hover:blur-xl transition-all duration-500"></div>
										<div className="absolute -inset-2 w-24 h-24 mx-auto rounded-full border-2 border-blue-200 opacity-50 group-hover:border-blue-300 group-hover:scale-110 transition-all duration-500"></div>
									</div>

									{/* Enhanced card design */}
									<div className="relative p-8 rounded-3xl bg-white shadow-xl hover:shadow-2xl transition-all duration-500 border border-blue-100 hover:border-blue-200 group-hover:-translate-y-2 overflow-hidden">
										{/* Gradient overlay */}
										<div className="absolute inset-0 bg-gradient-to-br from-blue-50/50 to-indigo-50/30 opacity-0 group-hover:opacity-100 transition-opacity duration-500"></div>
										{/* Animated background pattern */}
										<div className="absolute top-0 right-0 w-32 h-32 bg-gradient-to-br from-blue-100 to-transparent rounded-full -translate-y-16 translate-x-16 opacity-0 group-hover:opacity-100 transition-all duration-700"></div>

										<div className="relative z-10">
											<h3 className="text-2xl font-bold text-gray-900 mb-4 leading-tight">
												Theo dõi & Nhận hàng
											</h3>
											<p className="text-gray-600 leading-relaxed mb-6 text-base">
												Theo dõi trạng thái đơn hàng
												realtime và thông tin vận chuyển
												cho đến khi nhận hàng.
											</p>
											<div className="flex justify-center">
												<Button
													variant="outline"
													size="lg"
													className="border-2 border-blue-200 text-blue-600 hover:bg-blue-50 hover:border-blue-300 font-semibold px-6 py-3 rounded-xl transition-all duration-300"
													asChild
												>
													<Link to="/account-center/purchase-request-list?page=1&size=10">
														Theo dõi →
													</Link>
												</Button>
											</div>
										</div>
									</div>
								</div>
							</div>
						</div>
					</div>
				</section>

				{/* Benefits Section - Lợi ích nổi bật */}
				<section
					id="benefits"
					className="py-12 md:py-16 bg-white relative overflow-hidden"
				>
					{/* Subtle gradient overlay */}
					<div className="absolute inset-0 bg-gradient-to-br from-blue-50/30 to-indigo-50/30"></div>
					{/* Smooth transition from previous section */}
					<div className="absolute top-0 inset-x-0 h-20 bg-gradient-to-b from-gray-50/80 to-transparent"></div>
					<div className="container relative px-4 md:px-6 mx-auto max-w-7xl">
						<div className="flex flex-col items-center justify-center space-y-6 text-center mb-12">
							<div className="inline-flex items-center px-4 py-2 rounded-full bg-gradient-to-r from-blue-100 to-indigo-100 border border-blue-200">
								<span className="text-sm font-semibold text-blue-700">
									🚀 Lợi ích vượt trội
								</span>
							</div>
							<h2 className="text-4xl md:text-5xl font-bold tracking-tight bg-gradient-to-r from-blue-900 to-indigo-900 bg-clip-text text-transparent leading-relaxed">
								Tại sao chọn Global Shopper?
							</h2>
							<p className="max-w-4xl text-lg text-gray-600 leading-tight">
								Trải nghiệm mua sắm tối ưu với những lợi ích
								vượt trội mà chỉ GlobalShopper mang lại.
							</p>
						</div>

						<div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 max-w-7xl mx-auto">
							<div className="group relative p-6 rounded-2xl bg-white shadow-lg hover:shadow-xl transition-all duration-500 border border-blue-100 hover:border-blue-200">
								<div className="absolute inset-0 bg-gradient-to-br from-blue-500/5 to-indigo-500/5 rounded-2xl opacity-0 group-hover:opacity-100 transition-opacity duration-500"></div>
								<div className="relative">
									<div className="flex h-14 w-14 items-center justify-center rounded-xl bg-gradient-to-br from-blue-500 to-indigo-600 text-white mb-4 group-hover:scale-110 transition-transform duration-300">
										<Zap className="h-7 w-7" />
									</div>
									<h3 className="text-lg font-semibold text-gray-900 mb-3 leading-tight">
										Gửi yêu cầu dễ dàng
									</h3>
									<p className="text-gray-600 leading-relaxed text-sm">
										Gửi yêu cầu mua hàng chỉ trong vài phút,
										có hoặc không có link sản phẩm.
									</p>
								</div>
							</div>

							<div className="group relative p-6 rounded-2xl bg-white shadow-lg hover:shadow-xl transition-all duration-500 border border-blue-100 hover:border-blue-200">
								<div className="absolute inset-0 bg-gradient-to-br from-blue-500/5 to-indigo-500/5 rounded-2xl opacity-0 group-hover:opacity-100 transition-opacity duration-500"></div>
								<div className="relative">
									<div className="flex h-14 w-14 items-center justify-center rounded-xl bg-gradient-to-br from-blue-500 to-indigo-600 text-white mb-4 group-hover:scale-110 transition-transform duration-300">
										<Shield className="h-7 w-7" />
									</div>
									<h3 className="text-lg font-semibold text-gray-900 mb-3 leading-tight">
										Bảo hành đảm bảo
									</h3>
									<p className="text-gray-600 leading-relaxed text-sm">
										Chính sách bảo hành và hoàn tiền rõ
										ràng, minh bạch. An tâm mua sắm.
									</p>
								</div>
							</div>

							<div className="group relative p-6 rounded-2xl bg-white shadow-lg hover:shadow-xl transition-all duration-500 border border-cyan-100 hover:border-cyan-200 md:col-span-2 lg:col-span-1">
								<div className="absolute inset-0 bg-gradient-to-br from-cyan-500/5 to-teal-500/5 rounded-2xl opacity-0 group-hover:opacity-100 transition-opacity duration-500"></div>
								<div className="relative">
									<div className="flex h-14 w-14 items-center justify-center rounded-xl bg-gradient-to-br from-cyan-500 to-teal-600 text-white mb-4 group-hover:scale-110 transition-transform duration-300">
										<Users className="h-7 w-7" />
									</div>
									<h3 className="text-lg font-semibold text-gray-900 mb-3 leading-tight">
										Hỗ trợ 24/7
									</h3>
									<p className="text-gray-600 leading-relaxed text-sm">
										Đội ngũ hỗ trợ chuyên nghiệp, nhiệt tình
										sẵn sàng giúp đỡ bạn mọi lúc.
									</p>
								</div>
							</div>

							<div className="group relative p-6 rounded-2xl bg-white shadow-lg hover:shadow-xl transition-all duration-500 border border-orange-100 hover:border-orange-200">
								<div className="absolute inset-0 bg-gradient-to-br from-orange-500/5 to-red-500/5 rounded-2xl opacity-0 group-hover:opacity-100 transition-opacity duration-500"></div>
								<div className="relative">
									<div className="flex h-14 w-14 items-center justify-center rounded-xl bg-gradient-to-br from-orange-500 to-red-600 text-white mb-4 group-hover:scale-110 transition-transform duration-300">
										<Clock className="h-7 w-7" />
									</div>
									<h3 className="text-lg font-semibold text-gray-900 mb-3 leading-tight">
										Báo giá nhanh chóng
									</h3>
									<p className="text-gray-600 leading-relaxed text-sm">
										Nhận báo giá chi tiết từ nhiều nguồn uy
										tín trong thời gian ngắn nhất.
									</p>
								</div>
							</div>

							<div className="group relative p-6 rounded-2xl bg-white shadow-lg hover:shadow-xl transition-all duration-500 border border-blue-100 hover:border-blue-200">
								<div className="absolute inset-0 bg-gradient-to-br from-blue-500/5 to-indigo-500/5 rounded-2xl opacity-0 group-hover:opacity-100 transition-opacity duration-500"></div>
								<div className="relative">
									<div className="flex h-14 w-14 items-center justify-center rounded-xl bg-gradient-to-br from-blue-500 to-indigo-600 text-white mb-4 group-hover:scale-110 transition-transform duration-300">
										<BarChart3 className="h-7 w-7" />
									</div>
									<h3 className="text-lg font-semibold text-gray-900 mb-3 leading-tight">
										Theo dõi thời gian thực
									</h3>
									<p className="text-gray-600 leading-relaxed text-sm">
										Cập nhật trạng thái đơn hàng và thông
										tin vận chuyển theo thời gian thực.
									</p>
								</div>
							</div>
						</div>
					</div>
				</section>

				{/* Testimonials Section - Khách hàng đánh giá */}
				<section
					id="testimonials"
					className="py-12 md:py-16 bg-gradient-to-br from-indigo-50 via-blue-50 to-purple-50 relative overflow-hidden"
				>
					{/* Smooth transition from previous section */}
					<div className="absolute top-0 inset-x-0 h-20 bg-gradient-to-b from-white/80 to-transparent"></div>
					<div className="absolute inset-0 opacity-40">
						<div className="absolute top-1/4 left-1/4 w-32 h-32 bg-indigo-300 rounded-full mix-blend-multiply filter blur-xl animate-blob"></div>
						<div className="absolute top-1/3 right-1/4 w-32 h-32 bg-blue-300 rounded-full mix-blend-multiply filter blur-xl animate-blob animation-delay-2000"></div>
						<div className="absolute bottom-1/4 left-1/3 w-32 h-32 bg-purple-300 rounded-full mix-blend-multiply filter blur-xl animate-blob animation-delay-4000"></div>
					</div>

					<div className="container relative px-4 md:px-6 mx-auto max-w-7xl">
						<div className="flex flex-col items-center justify-center space-y-6 text-center mb-12">
							<div className="inline-flex items-center px-4 py-2 rounded-full bg-gradient-to-r from-blue-100 to-indigo-100 border border-blue-200">
								<span className="text-sm font-semibold text-blue-700">
									💬 Khách hàng nói gì
								</span>
							</div>
							<h2 className="text-4xl md:text-5xl font-bold tracking-tight bg-gradient-to-r from-blue-900 via-indigo-900 to-blue-800 bg-clip-text text-transparent leading-relaxed">
								Hàng nghìn khách hàng tin tưởng
							</h2>
							<p className="max-w-4xl text-lg text-gray-600 leading-tight">
								Phản hồi thực tế từ những khách hàng đã trải
								nghiệm dịch vụ.
							</p>
						</div>

						<div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 max-w-7xl mx-auto">
							<div className="group relative p-8 rounded-3xl bg-white/90 backdrop-blur-sm shadow-xl hover:shadow-2xl transition-all duration-500 border border-blue-100">
								<div className="absolute inset-0 bg-gradient-to-br from-blue-500/5 to-indigo-500/5 rounded-3xl opacity-0 group-hover:opacity-100 transition-opacity duration-500"></div>
								<div className="relative">
									<div className="flex items-center space-x-1 mb-6">
										{[...Array(5)].map((_, i) => (
											<Star
												key={i}
												className="h-5 w-5 fill-yellow-400 text-yellow-400"
											/>
										))}
									</div>
									<blockquote className="text-lg text-gray-800 leading-relaxed mb-6 font-medium">
										"Gửi yêu cầu mua hàng thật dễ dàng. Chỉ
										cần mô tả sản phẩm tôi cần và nhận được
										báo giá nhanh chóng, chi tiết."
									</blockquote>
									<div className="flex items-center space-x-4">
										<div className="w-12 h-12 rounded-full bg-gradient-to-br from-blue-400 to-indigo-500 flex items-center justify-center text-white font-bold">
											A
										</div>
										<div>
											<div className="font-bold text-gray-900">
												Nguyễn Văn An
											</div>
											<div className="text-sm text-gray-600">
												Khách hàng cá nhân
											</div>
										</div>
									</div>
								</div>
							</div>

							<div className="group relative p-8 rounded-3xl bg-white/90 backdrop-blur-sm shadow-xl hover:shadow-2xl transition-all duration-500 border border-indigo-100">
								<div className="absolute inset-0 bg-gradient-to-br from-indigo-500/5 to-blue-500/5 rounded-3xl opacity-0 group-hover:opacity-100 transition-opacity duration-500"></div>
								<div className="relative">
									<div className="flex items-center space-x-1 mb-6">
										{[...Array(5)].map((_, i) => (
											<Star
												key={i}
												className="h-5 w-5 fill-yellow-400 text-yellow-400"
											/>
										))}
									</div>
									<blockquote className="text-lg text-gray-800 leading-relaxed mb-6 font-medium">
										"Theo dõi đơn hàng rất thuận tiện. Tôi
										biết chính xác khi nào hàng sẽ đến và
										trạng thái vận chuyển realtime."
									</blockquote>
									<div className="flex items-center space-x-4">
										<div className="w-12 h-12 rounded-full bg-gradient-to-br from-indigo-400 to-blue-500 flex items-center justify-center text-white font-bold">
											B
										</div>
										<div>
											<div className="font-bold text-gray-900">
												Trần Thị Bình
											</div>
											<div className="text-sm text-gray-600">
												Chủ shop online
											</div>
										</div>
									</div>
								</div>
							</div>

							<div className="group relative p-8 rounded-3xl bg-white/90 backdrop-blur-sm shadow-xl hover:shadow-2xl transition-all duration-500 border border-blue-100 md:col-span-2 lg:col-span-1">
								<div className="absolute inset-0 bg-gradient-to-br from-blue-500/5 to-indigo-500/5 rounded-3xl opacity-0 group-hover:opacity-100 transition-opacity duration-500"></div>
								<div className="relative">
									<div className="flex items-center space-x-1 mb-6">
										{[...Array(5)].map((_, i) => (
											<Star
												key={i}
												className="h-5 w-5 fill-yellow-400 text-yellow-400"
											/>
										))}
									</div>
									<blockquote className="text-lg text-gray-800 leading-relaxed mb-6 font-medium">
										"Dịch vụ hoàn tiền rất tốt khi sản phẩm
										có vấn đề. Hỗ trợ khách hàng nhiệt tình
										và chuyên nghiệp."
									</blockquote>
									<div className="flex items-center space-x-4">
										<div className="w-12 h-12 rounded-full bg-gradient-to-br from-blue-400 to-indigo-500 flex items-center justify-center text-white font-bold">
											C
										</div>
										<div>
											<div className="font-bold text-gray-900">
												Lê Văn Cường
											</div>
											<div className="text-sm text-gray-600">
												Khách hàng thân thiết
											</div>
										</div>
									</div>
								</div>
							</div>
						</div>

						{/* Stats section */}
						<div className="mt-12 grid grid-cols-2 md:grid-cols-4 gap-8 max-w-4xl mx-auto">
							<div className="text-center">
								<div className="text-4xl font-bold text-gray-900 mb-2">
									5000+
								</div>
								<div className="text-gray-600">
									Yêu cầu đã xử lý
								</div>
							</div>
							<div className="text-center">
								<div className="text-4xl font-bold text-gray-900 mb-2">
									98%
								</div>
								<div className="text-gray-600">
									Khách hàng hài lòng
								</div>
							</div>
							<div className="text-center">
								<div className="text-4xl font-bold text-gray-900 mb-2">
									24h
								</div>
								<div className="text-gray-600">
									Thời gian báo giá
								</div>
							</div>
							<div className="text-center">
								<div className="text-4xl font-bold text-gray-900 mb-2">
									50+
								</div>
								<div className="text-gray-600">Quốc gia</div>
							</div>
						</div>
					</div>
				</section>

				{/* Final CTA Section - CTA mạnh cuối trang */}
				<section className="py-12 md:py-16 bg-gradient-to-br from-blue-50 via-indigo-50 to-purple-50 relative overflow-hidden">
					{/* Smooth transition from previous section */}
					<div className="absolute top-0 inset-x-0 h-20 bg-gradient-to-b from-indigo-50/60 to-transparent"></div>

					<div className="absolute inset-0">
						<div className="absolute top-1/4 left-1/4 w-64 h-64 bg-blue-200/40 rounded-full mix-blend-normal filter blur-3xl opacity-60 animate-blob"></div>
						<div className="absolute top-1/3 right-1/4 w-64 h-64 bg-indigo-200/40 rounded-full mix-blend-normal filter blur-3xl opacity-60 animate-blob animation-delay-2000"></div>
						<div className="absolute bottom-1/4 left-1/3 w-64 h-64 bg-purple-200/30 rounded-full mix-blend-normal filter blur-3xl opacity-50 animate-blob animation-delay-4000"></div>
					</div>

					<div className="container relative px-4 md:px-6 mx-auto max-w-7xl">
						<div className="flex flex-col items-center justify-center space-y-8 text-center max-w-4xl mx-auto">
							<div className="inline-flex items-center px-6 py-3 rounded-full bg-blue-100/80 backdrop-blur-sm border border-blue-200">
								<span className="text-sm font-semibold text-blue-700">
									🚀 Bắt đầu ngay hôm nay
								</span>
							</div>

							<h2 className="text-4xl md:text-6xl font-bold tracking-tight text-gray-900 leading-tight">
								Sẵn sàng mua hàng
								<br />
								<span className="bg-gradient-to-r from-blue-600 via-indigo-600 to-purple-600 bg-clip-text text-transparent">
									toàn cầu?
								</span>
							</h2>

							<p className="max-w-2xl text-xl text-gray-700 leading-relaxed">
								Hơn 5000 khách hàng đã tin tưởng GlobalShopper
								để mua sắm quốc tế. Tham gia ngay để trải nghiệm
								dịch vụ tuyệt vời!
							</p>

							<div className="flex flex-col sm:flex-row gap-6 pt-8">
								<Link
									to="/signup"
									className="group relative px-8 py-4 bg-gradient-to-r from-blue-600 via-indigo-600 to-purple-600 text-white font-bold text-lg rounded-2xl shadow-2xl hover:shadow-3xl transform transition-all duration-300 hover:scale-105"
								>
									<span className="relative z-10 flex items-center justify-center">
										Đăng ký miễn phí
										<ArrowRight className="ml-2 h-6 w-6 group-hover:translate-x-1 transition-transform" />
									</span>
									<div className="absolute inset-0 bg-gradient-to-r from-blue-700 via-indigo-700 to-purple-700 rounded-2xl opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
								</Link>

								<Link
									to="/login"
									className="group px-8 py-4 bg-white/80 backdrop-blur-sm text-blue-700 font-bold text-lg rounded-2xl border-2 border-blue-200 hover:bg-white hover:border-blue-300 transition-all duration-300"
								>
									Đăng nhập ngay
								</Link>
							</div>
						</div>
					</div>
				</section>
			</main>
		</div>
	);
}
