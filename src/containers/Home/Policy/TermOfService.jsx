import React from "react";
import {
	Card,
	CardHeader,
	CardTitle,
	CardDescription,
	CardContent,
} from "@/components/ui/card";
import {
	FileText,
	Shield,
	Users,
	CreditCard,
	Truck,
	RefreshCw,
	AlertTriangle,
	Settings,
	Phone,
} from "lucide-react";

const TermOfService = () => {
	const sections = [
		{
			id: 1,
			icon: Shield,
			title: "Chấp nhận điều khoản",
			content:
				"Bằng việc tạo tài khoản và/hoặc sử dụng dịch vụ GShop, bạn xác nhận đã đọc, hiểu và đồng ý tuân thủ các điều khoản dưới đây.",
		},
		{
			id: 2,
			icon: Users,
			title: "Tài khoản người dùng",
			items: [
				"Thông tin đăng ký phải chính xác, đầy đủ và được cập nhật khi thay đổi.",
				"Bạn chịu trách nhiệm giữ bí mật thông tin đăng nhập và mọi hoạt động phát sinh từ tài khoản.",
				"GShop có quyền tạm khóa tài khoản nếu phát hiện hành vi vi phạm hoặc bất thường.",
			],
		},
		{
			id: 3,
			icon: FileText,
			title: "Sử dụng dịch vụ",
			items: [
				"Không sử dụng dịch vụ để mua bán hàng cấm hoặc hàng hóa bị hạn chế theo quy định pháp luật.",
				"Không giả mạo danh tính, lạm dụng khuyến mãi hoặc thực hiện hành vi gian lận.",
				"Tuân thủ quy định của nhà cung cấp/đối tác vận chuyển và pháp luật hiện hành.",
			],
		},
		{
			id: 4,
			icon: CreditCard,
			title: "Giá, phí và thanh toán",
			content:
				"Phí dịch vụ, phí vận chuyển và các khoản thuế (nếu có) sẽ được hiển thị rõ trong phần báo giá. Bạn cần thanh toán theo hướng dẫn trước khi GShop thực hiện mua hàng.",
		},
		{
			id: 5,
			icon: Truck,
			title: "Vận chuyển và hải quan",
			content:
				"Thời gian vận chuyển phụ thuộc vào đối tác và thủ tục hải quan. Có thể phát sinh chi phí hải quan/thuế theo quy định từng quốc gia, và bạn sẽ được thông báo khi áp dụng.",
		},
		{
			id: 6,
			icon: RefreshCw,
			title: "Đổi trả và hoàn tiền",
			content:
				"Yêu cầu đổi trả/hoàn tiền được thực hiện theo chính sách hiện hành của GShop. Vui lòng tham khảo trang Chính sách đổi/hoàn trả và Chính sách hoàn tiền để biết chi tiết.",
		},
		{
			id: 7,
			icon: AlertTriangle,
			title: "Giới hạn trách nhiệm",
			content:
				"GShop không chịu trách nhiệm đối với các thiệt hại gián tiếp, ngẫu nhiên hoặc phát sinh ngoài tầm kiểm soát hợp lý, trừ khi pháp luật có quy định khác.",
		},
		{
			id: 8,
			icon: Settings,
			title: "Thay đổi điều khoản",
			content:
				"GShop có thể cập nhật điều khoản theo thời gian. Thay đổi sẽ có hiệu lực khi được đăng tải, và việc tiếp tục sử dụng dịch vụ đồng nghĩa với việc bạn chấp nhận các thay đổi đó.",
		},
	];

	return (
		<div className="min-h-screen bg-white">
			<div className="container mx-auto py-12 px-4 sm:px-6 lg:px-8 max-w-4xl">
				{/* Header Section */}
				<div className="text-center mb-12">
					<div className="inline-flex items-center justify-center w-16 h-16 bg-gradient-to-r from-blue-600 to-indigo-600 rounded-2xl shadow-lg mb-6">
						<FileText className="h-8 w-8 text-white" />
					</div>
					<h1 className="text-4xl font-bold text-gray-900 mb-4">
						Điều khoản dịch vụ
					</h1>
					<p className="text-lg text-gray-600 max-w-2xl mx-auto leading-relaxed">
						Các điều khoản sử dụng dịch vụ mua hộ quốc tế của GShop.
						Vui lòng đọc kỹ trước khi sử dụng dịch vụ của chúng tôi.
					</p>
				</div>
				{/* Terms Sections */}
				<div className="space-y-8">
					{sections.map((section) => (
						<Card
							key={section.id}
							className="border-0 shadow-lg hover:shadow-xl transition-all duration-300 bg-white/80 backdrop-blur-sm"
						>
							<CardContent className="p-8">
								<div className="flex items-start gap-6">
									<div className="flex-shrink-0">
										<div className="inline-flex items-center justify-center w-12 h-12 bg-gradient-to-r from-blue-100 to-indigo-100 rounded-xl">
											<section.icon className="h-6 w-6 text-blue-600" />
										</div>
									</div>
									<div className="flex-1 min-w-0">
										<h3 className="text-xl font-bold text-gray-900 mb-4 flex items-center gap-2">
											{section.id}. {section.title}
										</h3>
										{section.content && (
											<p className="text-gray-700 leading-relaxed">
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
															<div className="flex-shrink-0 w-2 h-2 bg-blue-500 rounded-full mt-2"></div>
															<span className="leading-relaxed">
																{item}
															</span>
														</li>
													)
												)}
											</ul>
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
						Điều khoản có hiệu lực từ ngày 28/08/2025 • Cập nhật lần
						cuối: 28/08/2025
					</p>
				</div>
			</div>
		</div>
	);
};

export default TermOfService;
