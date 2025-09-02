import React from "react";
import {
	Card,
	CardHeader,
	CardTitle,
	CardDescription,
	CardContent,
} from "@/components/ui/card";
import {
	Shield,
	Info,
	Database,
	Target,
	Share2,
	Lock,
	UserCheck,
	Clock,
	Cookie,
	Settings,
} from "lucide-react";

const PrivacyPolicy = () => {
	const sections = [
		{
			id: 1,
			icon: Info,
			title: "Giới thiệu",
			content:
				"Chính sách này giải thích cách chúng tôi thu thập, sử dụng, lưu trữ và bảo vệ thông tin của bạn. Việc sử dụng GShop đồng nghĩa với việc bạn đồng ý cho phép GShop xử lý dữ liệu cá nhân theo chính sách này.",
		},
		{
			id: 2,
			icon: Database,
			title: "Thông tin chúng tôi thu thập",
			items: [
				"Thông tin cá nhân: Họ tên, email, số điện thoại, địa chỉ giao hàng.",
				"Thông tin giao dịch: Lịch sử đơn hàng, chi tiết thanh toán, số tiền nạp/rút Ví GShop.",
				"Thông tin kỹ thuật: Địa chỉ IP, loại thiết bị, trình duyệt, cookies, lịch sử đăng nhập.",
				"Thông tin bổ sung: Hình ảnh, video, chứng từ phục vụ khiếu nại, đổi trả, hoàn tiền.",
			],
		},
		{
			id: 3,
			icon: Target,
			title: "Mục đích sử dụng thông tin",
			items: [
				"Xử lý đơn hàng, thanh toán và giao nhận.",
				"Gửi thông báo trạng thái đơn hàng, xác nhận thanh toán, khuyến mãi.",
				"Hỗ trợ khách hàng (hoàn tiền, đổi trả, khiếu nại).",
				"Ngăn chặn gian lận, lừa đảo hoặc vi phạm điều khoản dịch vụ.",
				"Cải thiện trải nghiệm và tối ưu dịch vụ GShop.",
			],
		},
		{
			id: 4,
			icon: Share2,
			title: "Chia sẻ thông tin với bên thứ ba",
			items: [
				"Với đối tác logistics để giao hàng.",
				"Với cổng thanh toán (VNPay, ngân hàng) để xử lý giao dịch.",
				"Với cơ quan nhà nước có thẩm quyền khi có yêu cầu hợp pháp.",
			],
			note: "GShop không bán hoặc cho thuê thông tin khách hàng cho bên thứ ba.",
		},
		{
			id: 5,
			icon: Lock,
			title: "Bảo mật dữ liệu",
			items: [
				"Sử dụng mã hóa SSL và công nghệ bảo mật để bảo vệ dữ liệu.",
				"Thông tin nhạy cảm được lưu trữ mã hóa và hạn chế truy cập.",
				"Nhân viên chỉ được truy cập dữ liệu trong phạm vi cần thiết.",
			],
		},
		{
			id: 6,
			icon: UserCheck,
			title: "Quyền của khách hàng",
			items: [
				"Truy cập thông tin cá nhân bất kỳ lúc nào.",
				"Yêu cầu chỉnh sửa nếu thông tin không chính xác.",
				"Yêu cầu xóa tài khoản và dữ liệu cá nhân (trừ trường hợp theo luật).",
				"Từ chối nhận email marketing qua hủy đăng ký.",
			],
		},
		{
			id: 7,
			icon: Clock,
			title: "Thời gian lưu trữ",
			items: [
				"Lưu trữ trong suốt quá trình sử dụng dịch vụ.",
				"Sau khi xóa tài khoản, dữ liệu được ẩn hoặc xóa trong 90 ngày (trừ trường hợp theo luật).",
			],
		},
		{
			id: 8,
			icon: Cookie,
			title: "Cookie & công nghệ theo dõi",
			items: [
				"Ghi nhớ thông tin đăng nhập.",
				"Phân tích hành vi sử dụng để tối ưu trải nghiệm.",
				"Cung cấp quảng cáo cá nhân hóa.",
			],
			note: "Bạn có thể tắt cookies trong trình duyệt, nhưng một số chức năng có thể bị hạn chế.",
		},
		{
			id: 9,
			icon: Settings,
			title: "Thay đổi chính sách bảo mật",
			content:
				"Chúng tôi có thể cập nhật chính sách và sẽ thông báo qua email và trên website.",
		},
	];

	return (
		<div className="min-h-screen bg-white">
			<div className="container mx-auto py-12 px-4 sm:px-6 lg:px-8 max-w-4xl">
				{/* Header Section */}
				<div className="text-center mb-12">
					<div className="inline-flex items-center justify-center w-16 h-16 bg-gradient-to-r from-purple-600 to-violet-600 rounded-2xl shadow-lg mb-6">
						<Shield className="h-8 w-8 text-white" />
					</div>
					<h1 className="text-4xl font-bold text-gray-900 mb-4">
						Chính sách bảo mật GShop
					</h1>
					<p className="text-lg text-gray-600 max-w-2xl mx-auto leading-relaxed">
						GShop cam kết bảo vệ dữ liệu cá nhân của khách hàng
						trong suốt quá trình sử dụng dịch vụ mua hộ quốc tế. Sự
						an toàn của bạn là ưu tiên hàng đầu.
					</p>
				</div>
				{/* Privacy Sections */}
				<div className="space-y-8">
					{sections.map((section) => (
						<Card
							key={section.id}
							className="border-0 shadow-lg hover:shadow-xl transition-all duration-300 bg-white/80 backdrop-blur-sm"
						>
							<CardContent className="p-8">
								<div className="flex items-start gap-6">
									<div className="flex-shrink-0">
										<div className="inline-flex items-center justify-center w-12 h-12 bg-gradient-to-r from-purple-100 to-violet-100 rounded-xl">
											<section.icon className="h-6 w-6 text-purple-600" />
										</div>
									</div>
									<div className="flex-1 min-w-0">
										<h3 className="text-xl font-bold text-gray-900 mb-4 flex items-center gap-2">
											{section.id}. {section.title}
										</h3>
										{section.content && (
											<p className="text-gray-700 leading-relaxed mb-4">
												{section.content}
											</p>
										)}
										{section.items && (
											<ul className="space-y-3">
												{section.items.map(
													(item, index) => (
														<li
															key={index}
															className="flex items-start gap-3 text-gray-700"
														>
															<div className="flex-shrink-0 w-2 h-2 bg-purple-500 rounded-full mt-2"></div>
															<span className="leading-relaxed">
																{item}
															</span>
														</li>
													)
												)}
											</ul>
										)}
										{section.note && (
											<div className="mt-4 p-4 bg-purple-50 border border-purple-200 rounded-lg">
												<p className="text-purple-800 text-sm font-medium">
													💡 {section.note}
												</p>
											</div>
										)}
									</div>
								</div>
							</CardContent>
						</Card>
					))}
				</div>

				{/* Footer Notice */}
				<div className="mt-12 text-center">
					<p className="text-sm text-gray-500 italic">
						Chính sách có hiệu lực từ ngày 28/08/2025 • Cập nhật lần
						cuối: 28/08/2025
					</p>
				</div>
			</div>
		</div>
	);
};

export default PrivacyPolicy;
